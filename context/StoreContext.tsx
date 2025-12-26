
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, Product, Payment, Order, SystemConfig, AdminLog, Broadcast, Notification,
  UserRole, PaymentStatus, OrderStatus, Category, Tariff
} from '../types';
import { INITIAL_SYSTEM_CONFIG, MOCK_PRODUCTS } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface StoreContextType {
  user: User | null;
  users: User[];
  products: Product[];
  payments: Payment[];
  orders: Order[];
  config: SystemConfig;
  logs: AdminLog[];
  broadcasts: Broadcast[];
  notifications: Notification[];
  loading: boolean;
  dbConnected: boolean;
  
  login: (email: string, pass: string) => Promise<{success: boolean, message?: string}>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, nickname: string, pass: string) => Promise<{success: boolean, message?: string}>;
  
  updateConfig: (newConfig: SystemConfig) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string, adminPass: string) => Promise<boolean>;
  seedProducts: () => Promise<void>;
  
  adminAddUser: (userData: any, pass: string) => Promise<void>;
  adminUpdateUser: (id: string, updates: Partial<User>) => Promise<void>;
  updateUserProfile: (id: string, updates: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string, adminPass: string) => Promise<boolean>;
  
  deletePayment: (id: string, adminPass: string) => Promise<boolean>;
  deleteOrder: (id: string, adminPass: string) => Promise<boolean>;
  
  submitPayment: (amount: number, receiptFile: File) => Promise<void>;
  processPayment: (id: string, status: PaymentStatus, reason?: string) => Promise<void>;
  
  purchaseProduct: (productId: string, tariffId: string, nickname: string, contactInfo: string) => Promise<boolean>;
  processOrder: (id: string, status: OrderStatus) => Promise<void>;
  
  addBroadcast: (message: string, type: Broadcast['type']) => void;
  removeBroadcast: (id: string) => void;
  
  addNotification: (userId: string, title: string, message: string, type: Notification['type']) => void;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;
  deleteNotification: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(isSupabaseConfigured);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [config, setConfig] = useState<SystemConfig>(INITIAL_SYSTEM_CONFIG);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  const fetchAdminData = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data: uData } = await supabase.from('users').select('*');
      if (uData) setUsers(uData.map((u: any) => ({ ...u, createdAt: u.created_at })));

      const { data: pData } = await supabase.from('payments').select('*, users(email, nickname)').order('created_at', { ascending: false });
      if (pData) {
        setPayments(pData.map((p: any) => ({
          id: p.id, userId: p.user_id, userEmail: p.users?.email || 'Noma\'lum',
          amount: p.amount, receiptUrl: p.receipt_url, status: p.status, 
          rejectionReason: p.rejection_reason, createdAt: p.created_at
        })));
      }

      const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (oData) setOrders(oData.map((o: any) => ({
        id: o.id, userId: o.user_id, userNickname: o.user_nickname,
        contact_info: o.contact_info, product_name: o.product_name,
        tariff_name: o.tariff_name, price: o.price, status: o.status,
        createdAt: o.created_at
      })));
    } catch (err) {
      console.error("Admin data fetch failed:", err);
    }
  }, []);

  const fetchData = useCallback(async (session?: any) => {
    if (!isSupabaseConfigured) {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
      return;
    }

    try {
      const currentSession = session || (await supabase.auth.getSession()).data.session;
      
      const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (prodData) {
        setProducts(prodData.map(p => ({
          ...p,
          tariffs: typeof p.tariffs === 'string' ? JSON.parse(p.tariffs) : p.tariffs
        })));
      }

      if (currentSession?.user) {
        let { data: userData, error: fetchError } = await supabase.from('users').select('*').eq('id', currentSession.user.id).maybeSingle();
        
        if (!userData && !fetchError) {
          // Google login or first time session creation
          const rawName = currentSession.user.user_metadata?.full_name || currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0];
          const newUser = {
            id: currentSession.user.id,
            email: currentSession.user.email!,
            nickname: rawName || 'Gamer',
            balance: 0,
            role: UserRole.USER
          };
          const { data: createdUser, error: insertError } = await supabase.from('users').insert([newUser]).select().single();
          if (!insertError) userData = createdUser;
        }

        if (userData) {
          const mappedUser = { ...userData, createdAt: userData.created_at || userData.createdAt };
          setUser(mappedUser);
          if (mappedUser.role === UserRole.ADMIN) {
            await fetchAdminData();
          }
        }
      } else {
        setUser(null);
      }
      setDbConnected(true);
    } catch (err) {
      console.warn("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchAdminData]);

  useEffect(() => {
    fetchData();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth Event Context:", event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        fetchData(session);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUsers([]);
        setPayments([]);
        setOrders([]);
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchData]);

  const googleLogin = async () => {
    if (!dbConnected) return;
    try {
      // Supabase OAuth callback URL-ga yo'naltirish
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google', 
        options: { 
          redirectTo: window.location.origin,
          queryParams: { 
            access_type: 'offline', 
            prompt: 'select_account' 
          }
        } 
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google Auth Logic Error:", err);
      throw err;
    }
  };

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  const register = async (email: string, nickname: string, pass: string) => {
    const { data, error: authError } = await supabase.auth.signUp({ 
      email, password: pass, options: { data: { nickname } } 
    });
    if (authError) return { success: false, message: authError.message };
    if (!data.user) return { success: false, message: 'Foydalanuvchi yaratilmadi.' };
    
    // Auth trigger ishlamasa, qo'lda yozamiz
    await supabase.from('users').upsert([{ id: data.user.id, email, nickname, balance: 0, role: UserRole.USER }]);
    return { success: true };
  };

  const logout = async () => {
    setUser(null);
    setUsers([]);
    setPayments([]);
    setOrders([]);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("SignOut Error:", err);
    }
  };

  const submitPayment = async (amount: number, receiptFile: File) => {
    if (!user || !dbConnected) return;
    try {
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, receiptFile);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(fileName);
      const { error: dbError } = await supabase.from('payments').insert([{ 
        user_id: user.id, amount, receipt_url: publicUrl, status: PaymentStatus.PENDING 
      }]);
      
      if (dbError) throw dbError;
      addNotification('ADMIN', 'Yangi To\'lov!', `@${user.nickname} ${amount.toLocaleString()} UZS to'ladi.`, 'success');
      addBroadcast('To\'lov ko\'rib chiqishga yuborildi!', 'success');
      await fetchData();
    } catch (err: any) {
      addBroadcast('Xato: ' + err.message, 'error');
    }
  };

  const processPayment = async (id: string, status: PaymentStatus, reason?: string) => {
    if (!dbConnected) return;
    const payment = payments.find(p => p.id === id);
    if (!payment) return;
    
    if (status === PaymentStatus.APPROVED) {
      const { data: currentUser } = await supabase.from('users').select('balance').eq('id', payment.userId).single();
      await supabase.from('users').update({ balance: (currentUser?.balance || 0) + payment.amount }).eq('id', payment.userId);
      addNotification(payment.userId, 'To\'lov tasdiqlandi!', `${payment.amount.toLocaleString()} UZS qo'shildi.`, 'success');
    } else if (status === PaymentStatus.REJECTED) {
      addNotification(payment.userId, 'To\'lov rad etildi', `Sabab: ${reason || 'Xatolik'}`, 'error');
    }

    await supabase.from('payments').update({ status, rejection_reason: reason }).eq('id', id);
    await fetchData();
  };

  const purchaseProduct = async (productId: string, tariffId: string, nickname: string, contactInfo: string) => {
    const product = products.find(p => p.id === productId);
    const tariff = product?.tariffs.find(t => t.id === tariffId);
    if (!product || !tariff || !user || user.balance < tariff.price || !dbConnected) return false;

    await supabase.from('users').update({ balance: user.balance - tariff.price }).eq('id', user.id);
    await supabase.from('orders').insert([{
      user_id: user.id, user_nickname: nickname, contact_info: contactInfo,
      product_name: product.name, tariff_name: tariff.name, price: tariff.price, status: OrderStatus.PENDING
    }]);

    addNotification('ADMIN', 'Yangi Buyurtma!', `@${user.nickname}: ${product.name}`, 'info');
    await fetchData();
    return true;
  };

  const processOrder = async (id: string, status: OrderStatus) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    await fetchData();
  };

  const addBroadcast = (message: string, type: Broadcast['type']) => setBroadcasts(prev => [{ id: Math.random().toString(), message, type, createdAt: new Date().toISOString() }, ...prev]);
  const removeBroadcast = (id: string) => setBroadcasts(prev => prev.filter(b => b.id !== id));
  const addNotification = (userId: string, title: string, message: string, type: Notification['type']) => setNotifications(prev => [{ id: Math.random().toString(), userId, title, message, type, isRead: false, createdAt: new Date().toISOString() }, ...prev]);
  const markNotificationsAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const clearNotifications = () => setNotifications([]);
  const deleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const updateConfig = (newConfig: SystemConfig) => setConfig(newConfig);

  const adminAddUser = async (userData: any, pass: string) => { const { data } = await supabase.auth.signUp({ email: userData.email, password: pass }); if (data.user) await supabase.from('users').insert([{ id: data.user.id, ...userData }]); await fetchData(); };
  const adminUpdateUser = async (id: string, updates: Partial<User>) => { await supabase.from('users').update(updates).eq('id', id); await fetchData(); };
  const updateUserProfile = async (id: string, updates: Partial<User>) => { const { error } = await supabase.from('users').update(updates).eq('id', id); await fetchData(); return !error; };
  const deletePayment = async (id: string, adminPass: string) => { if (adminPass !== 'qazzaq') return false; await supabase.from('payments').delete().eq('id', id); await fetchData(); return true; };
  const deleteOrder = async (id: string, adminPass: string) => { if (adminPass !== 'qazzaq') return false; await supabase.from('orders').delete().eq('id', id); await fetchData(); return true; };
  const deleteUser = async (id: string, adminPass: string) => { if (adminPass !== 'qazzaq') return false; await supabase.from('users').delete().eq('id', id); await fetchData(); return true; };
  const addProduct = async (p: Omit<Product, 'id'>) => { await supabase.from('products').insert([p]); await fetchData(); };
  const updateProduct = async (id: string, p: Partial<Product>) => { await supabase.from('products').update(p).eq('id', id); await fetchData(); };
  const deleteProduct = async (id: string, adminPass: string) => { if (adminPass !== 'qazzaq') return false; await supabase.from('products').delete().eq('id', id); await fetchData(); return true; };
  const seedProducts = async () => { if (!dbConnected) return; await supabase.from('products').delete().neq('id', '0'); await supabase.from('products').insert(MOCK_PRODUCTS.map(({id, ...p}) => p)); await fetchData(); };

  return (
    <StoreContext.Provider value={{
      user, users, products, payments, orders, config, logs, broadcasts, notifications, loading, dbConnected,
      login, googleLogin, logout, register,
      updateConfig, addProduct, updateProduct, deleteProduct, seedProducts,
      adminAddUser, adminUpdateUser, updateUserProfile, deleteUser,
      deletePayment, deleteOrder,
      submitPayment, processPayment,
      purchaseProduct, processOrder,
      addBroadcast, removeBroadcast,
      addNotification, markNotificationsAsRead, clearNotifications, deleteNotification
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
