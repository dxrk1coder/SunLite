
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
        contactInfo: o.contact_info, productName: o.product_name,
        tariffName: o.tariff_name, price: o.price, status: o.status,
        createdAt: o.created_at
      })));
    } catch (err) {
      console.error("Admin data fetch failed:", err);
    }
  }, []);

  const fetchUserSpecificData = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { data: pData } = await supabase.from('payments').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (pData) setPayments(pData.map((p: any) => ({
        id: p.id, userId: p.user_id, amount: p.amount, receiptUrl: p.receipt_url, 
        status: p.status, rejectionReason: p.rejection_reason, createdAt: p.created_at
      })));

      const { data: oData } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (oData) setOrders(oData.map((o: any) => ({
        id: o.id, userId: o.user_id, userNickname: o.user_nickname,
        contactInfo: o.contact_info, productName: o.product_name,
        tariffName: o.tariff_name, price: o.price, status: o.status,
        createdAt: o.created_at
      })));
    } catch (err) {
      console.error("User specific data fetch failed:", err);
    }
  }, []);

  const fetchData = useCallback(async (session?: any) => {
    try {
      if (!isSupabaseConfigured) {
        setProducts(MOCK_PRODUCTS);
        return;
      }

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
        
        if (userData) {
          const mappedUser = { ...userData, createdAt: userData.created_at || userData.createdAt };
          setUser(mappedUser);
          
          if (mappedUser.role === UserRole.ADMIN) {
            await fetchAdminData();
          } else {
            await fetchUserSpecificData(mappedUser.id);
          }
        }
      } else {
        setUser(null);
        setPayments([]);
        setOrders([]);
      }
      setDbConnected(true);
    } catch (err) {
      console.warn("Fetch Data Error:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchAdminData, fetchUserSpecificData]);

  useEffect(() => {
    fetchData();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      fetchData(session);
    });
    return () => subscription.unsubscribe();
  }, [fetchData]);

  useEffect(() => {
    if (!user?.id || !isSupabaseConfigured) return;
    const channel = supabase
      .channel(`user-updates-${user.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` }, 
        (payload) => { setUser(prev => prev ? { ...prev, ...payload.new } : null); }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const googleLogin = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/login' } });
  };

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  const register = async (email: string, nickname: string, pass: string) => {
    const { data, error: authError } = await supabase.auth.signUp({ email, password: pass, options: { data: { nickname } } });
    if (authError) return { success: false, message: authError.message };
    await supabase.from('users').upsert([{ id: data.user!.id, email, nickname, balance: 0, role: UserRole.USER }]);
    return { success: true };
  };

  const logout = async () => {
    setUser(null);
    setUsers([]);
    setPayments([]);
    setOrders([]);
    await supabase.auth.signOut();
  };

  const adminUpdateUser = async (id: string, updates: any) => { 
    const { id: _, created_at: __, createdAt: ___, email: ____, ...cleanUpdates } = updates;
    await supabase.from('users').update(cleanUpdates).eq('id', id); 
    await fetchData(); 
  };

  const submitPayment = async (amount: number, receiptFile: File) => {
    if (!user || !dbConnected) return;
    try {
      const fileName = `${user.id}-${Date.now()}`;
      await supabase.storage.from('receipts').upload(fileName, receiptFile);
      const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(fileName);
      await supabase.from('payments').insert([{ user_id: user.id, amount, receipt_url: publicUrl, status: PaymentStatus.PENDING }]);
      addNotification('ADMIN', 'Yangi To\'lov!', `@${user.nickname} to'lov qildi.`, 'success');
      await fetchData();
    } catch (err: any) {
      addBroadcast('To\'lovda xatolik: ' + err.message, 'error');
    }
  };

  const processPayment = async (id: string, status: PaymentStatus, reason?: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;
    if (status === PaymentStatus.APPROVED) {
      const { data: u } = await supabase.from('users').select('balance').eq('id', payment.userId).single();
      await supabase.from('users').update({ balance: (u?.balance || 0) + payment.amount }).eq('id', payment.userId);
      addNotification(payment.userId, 'To\'lov tasdiqlandi!', `${payment.amount.toLocaleString()} UZS balansingizga qo'shildi.`, 'success');
    } else if (status === PaymentStatus.REJECTED) {
      addNotification(payment.userId, 'To\'lov rad etildi', `Sabab: ${reason || 'Noma\'lum'}`, 'error');
    }
    await supabase.from('payments').update({ status, rejection_reason: reason }).eq('id', id);
    await fetchData();
  };

  const purchaseProduct = async (productId: string, tariffId: string, nickname: string, contactInfo: string) => {
    const prod = products.find(p => p.id === productId);
    const tariff = prod?.tariffs.find(t => t.id === tariffId);
    if (!prod || !tariff || !user || user.balance < tariff.price) return false;
    await supabase.from('users').update({ balance: user.balance - tariff.price }).eq('id', user.id);
    await supabase.from('orders').insert([{ user_id: user.id, user_nickname: nickname, contact_info: contactInfo, product_name: prod.name, tariff_name: tariff.name, price: tariff.price, status: OrderStatus.PENDING }]);
    addNotification('ADMIN', 'Yangi Buyurtma!', `@${user.nickname} ${prod.name} sotib oldi.`, 'info');
    await fetchData();
    return true;
  };

  const processOrder = async (id: string, status: OrderStatus) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    if (status === OrderStatus.COMPLETED) {
      addNotification(order.userId, 'Buyurtma bajarildi!', `${order.productName} faollashtirildi. Tabriklaymiz!`, 'success');
    } else if (status === OrderStatus.CANCELLED) {
      addNotification(order.userId, 'Buyurtma bekor qilindi', `Xarid qilingan ${order.productName} bekor qilindi. Iltimos, qo'llab-quvvatlash xizmati bilan bog'laning.`, 'error');
    }
    await supabase.from('orders').update({ status }).eq('id', id);
    await fetchData();
  };

  const addBroadcast = (message: string, type: any) => setBroadcasts(p => [{ id: Math.random().toString(), message, type, createdAt: new Date().toISOString() }, ...p]);
  const removeBroadcast = (id: string) => setBroadcasts(p => p.filter(b => b.id !== id));
  const addNotification = (userId: string, title: string, message: string, type: any) => setNotifications(p => [{ id: Math.random().toString(), userId, title, message, type, isRead: false, createdAt: new Date().toISOString() }, ...p]);
  const markNotificationsAsRead = () => setNotifications(p => p.map(n => ({ ...n, isRead: true })));
  const clearNotifications = () => setNotifications([]);
  const deleteNotification = (id: string) => setNotifications(p => p.filter(n => n.id !== id));
  
  const updateUserProfile = async (id: string, updates: any) => { 
    if (updates.email && updates.email !== user?.email) {
      const { data: existing } = await supabase.from('users').select('id').eq('email', updates.email).maybeSingle();
      if (existing) return false;
    }
    await supabase.from('users').update(updates).eq('id', id); 
    await fetchData(); 
    return true; 
  };

  const adminAddUser = async (u: any, p: string) => {};
  const deleteUser = async (id: string, p: string) => { if(p === 'qazzaq') { await supabase.from('users').delete().eq('id', id); await fetchData(); return true; } return false; };
  const deletePayment = async (id: string, p: string) => { if(p === 'qazzaq') { await supabase.from('payments').delete().eq('id', id); await fetchData(); return true; } return false; };
  const deleteOrder = async (id: string, p: string) => { if(p === 'qazzaq') { await supabase.from('orders').delete().eq('id', id); await fetchData(); return true; } return false; };
  const addProduct = async (p: any) => { await supabase.from('products').insert([p]); await fetchData(); };
  const updateProduct = async (id: string, p: any) => { await supabase.from('products').update(p).eq('id', id); await fetchData(); };
  const deleteProduct = async (id: string, p: string) => { if(p === 'qazzaq') { await supabase.from('products').delete().eq('id', id); await fetchData(); return true; } return false; };
  
  const seedProducts = async () => { 
    if (!isSupabaseConfigured) return;
    // Bazadagi barcha mavjud mahsulotlarni o'chirish (Tozalash)
    await supabase.from('products').delete().neq('name', '___FORCE_DELETE_ALL___');
    // Yangi mahsulotlarni (30/60 kunlik tariflar bilan) yuklash
    await supabase.from('products').insert(MOCK_PRODUCTS.map(({id, ...p}) => ({
      ...p,
      tariffs: JSON.stringify(p.tariffs) // Supabase JSON ustuniga moslash
    }))); 
    await fetchData(); 
  };

  const updateConfig = (c: any) => setConfig(c);

  return (
    <StoreContext.Provider value={{
      user, users, products, payments, orders, config, logs, broadcasts, notifications, loading, dbConnected,
      login, googleLogin, logout, register,
      updateConfig, addProduct, updateProduct, deleteProduct, seedProducts,
      adminAddUser, adminUpdateUser, updateUserProfile, deleteUser,
      deletePayment, deleteOrder, submitPayment, processPayment,
      purchaseProduct, processOrder, addBroadcast, removeBroadcast,
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
