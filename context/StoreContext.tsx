
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
  
  updateConfig: (newConfig: SystemConfig) => Promise<boolean>;
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
  deleteLog: (id: string, adminPass: string) => Promise<boolean>;
  
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

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

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
      if (uData) setUsers(uData.map((u: any) => ({ ...u, createdAt: u.created_at || u.createdAt })));

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

      const { data: lData } = await supabase.from('admin_logs').select('*').order('created_at', { ascending: false });
      if (lData) setLogs(lData.map((l: any) => ({
        id: l.id, adminId: l.admin_id, adminName: l.admin_name,
        action: l.action, details: l.details, timestamp: l.created_at || l.timestamp
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
        setLoading(false);
        return;
      }

      const currentSession = session || (await supabase.auth.getSession()).data.session;
      
      // Fetch System Config
      const { data: cfgData, error: cfgError } = await supabase.from('system_config').select('*').eq('id', 1).maybeSingle();
      
      if (cfgData) {
        setConfig({
          siteName: cfgData.site_name || cfgData.siteName || INITIAL_SYSTEM_CONFIG.siteName,
          cardDetails: cfgData.card_details || cfgData.cardDetails || INITIAL_SYSTEM_CONFIG.cardDetails,
          telegramSupport: cfgData.telegram_support || cfgData.telegramSupport || INITIAL_SYSTEM_CONFIG.telegramSupport,
          serverIp: cfgData.server_ip || cfgData.serverIp || INITIAL_SYSTEM_CONFIG.serverIp,
          maintenanceMode: cfgData.maintenance_mode ?? cfgData.maintenanceMode ?? INITIAL_SYSTEM_CONFIG.maintenanceMode,
          stats: typeof cfgData.stats === 'string' ? JSON.parse(cfgData.stats) : (cfgData.stats || INITIAL_SYSTEM_CONFIG.stats)
        });
      }

      const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (prodData && prodData.length > 0) {
        setProducts(prodData.map(p => ({
          ...p,
          tariffs: typeof p.tariffs === 'string' ? JSON.parse(p.tariffs) : p.tariffs
        })));
      } else {
        setProducts(MOCK_PRODUCTS);
      }

      if (currentSession?.user) {
        let { data: userData } = await supabase.from('users').select('*').eq('id', currentSession.user.id).maybeSingle();
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

  const login = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return { success: false, message: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const googleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const logout = async () => {
    setUser(null);
    setUsers([]);
    setPayments([]);
    setOrders([]);
    await supabase.auth.signOut();
  };

  const register = async (email: string, nickname: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { nickname } }
      });
      if (error) return { success: false, message: error.message };
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email,
          nickname,
          role: UserRole.USER,
          balance: 0
        });
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const updateConfig = async (newConfig: SystemConfig) => {
    setConfig(newConfig);

    if (isSupabaseConfigured) {
      try {
        const payload = {
          id: 1,
          site_name: newConfig.siteName,
          card_details: newConfig.cardDetails,
          telegram_support: newConfig.telegramSupport,
          server_ip: newConfig.serverIp,
          maintenance_mode: newConfig.maintenanceMode,
          stats: JSON.stringify(newConfig.stats)
        };

        const { error } = await supabase
          .from('system_config')
          .upsert(payload, { onConflict: 'id' });
        
        if (error) {
          console.error("Supabase Save Error:", error);
          alert("Sozlamalarni saqlashda xato (Supabase): " + error.message);
          return false;
        }
        return true;
      } catch (err: any) {
        console.error("Unexpected Save Error:", err);
        alert("Kutilmagan xato: " + err.message);
        return false;
      }
    }
    return false;
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const { data } = await supabase.from('products').insert({
      ...product,
      tariffs: JSON.stringify(product.tariffs)
    }).select().single();
    if (data) {
      setProducts([{ ...data, tariffs: product.tariffs }, ...products]);
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    const updates = { ...product };
    if (updates.tariffs) (updates as any).tariffs = JSON.stringify(updates.tariffs);
    await supabase.from('products').update(updates).eq('id', id);
    setProducts(products.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const deleteProduct = async (id: string, adminPass: string) => {
    if (adminPass !== 'qazzaq') return false;
    await supabase.from('products').delete().eq('id', id);
    setProducts(products.filter(p => p.id !== id));
    return true;
  };

  const seedProducts = async () => { 
    if (!isSupabaseConfigured) return;
    await supabase.from('products').delete().neq('name', '___');
    const productsToInsert = MOCK_PRODUCTS.map(p => ({
      name: p.name,
      description: p.description,
      category: p.category,
      image: p.image,
      active: p.active,
      tariffs: JSON.stringify(p.tariffs)
    }));
    await supabase.from('products').insert(productsToInsert);
    await fetchData();
  };

  const adminAddUser = async (userData: any, pass: string) => {
    await register(userData.email, userData.nickname, pass);
    await adminUpdateUser(userData.id || '', { role: userData.role, balance: userData.balance });
  };

  const adminUpdateUser = async (id: string, updates: Partial<User>) => {
    await supabase.from('users').update(updates).eq('id', id);
    setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
    if (user?.id === id) setUser({ ...user, ...updates });
  };

  const updateUserProfile = async (id: string, updates: Partial<User>) => {
    const { error } = await supabase.from('users').update(updates).eq('id', id);
    if (error) return false;
    if (user?.id === id) setUser({ ...user, ...updates });
    return true;
  };

  const deleteUser = async (id: string, adminPass: string) => {
    if (adminPass !== 'qazzaq') return false;
    await supabase.from('users').delete().eq('id', id);
    setUsers(users.filter(u => u.id !== id));
    return true;
  };

  const deletePayment = async (id: string, adminPass: string) => {
    if (adminPass !== 'qazzaq') return false;
    await supabase.from('payments').delete().eq('id', id);
    setPayments(payments.filter(p => p.id !== id));
    return true;
  };

  const deleteOrder = async (id: string, adminPass: string) => {
    if (adminPass !== 'qazzaq') return false;
    await supabase.from('orders').delete().eq('id', id);
    setOrders(orders.filter(o => o.id !== id));
    return true;
  };

  const deleteLog = async (id: string, adminPass: string) => {
    if (adminPass !== 'qazzaq') return false;
    await supabase.from('admin_logs').delete().eq('id', id);
    setLogs(logs.filter(l => l.id !== id));
    return true;
  };

  const submitPayment = async (amount: number, receiptFile: File) => {
    if (!user) return;
    const fileName = `${user.id}_${Date.now()}_${receiptFile.name}`;
    const { data: uploadData } = await supabase.storage.from('receipts').upload(fileName, receiptFile);
    if (uploadData) {
      const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(fileName);
      const { data: payData } = await supabase.from('payments').insert({
        user_id: user.id,
        amount,
        receipt_url: publicUrl,
        status: PaymentStatus.PENDING
      }).select().single();
      if (payData) {
        setPayments([{ 
          id: payData.id, userId: user.id, userEmail: user.email, 
          amount, receiptUrl: publicUrl, status: PaymentStatus.PENDING, 
          createdAt: payData.created_at 
        }, ...payments]);
      }
    }
  };

  const processPayment = async (id: string, status: PaymentStatus, reason?: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;
    await supabase.from('payments').update({ status, rejection_reason: reason }).eq('id', id);
    if (status === PaymentStatus.APPROVED) {
      const { data: userData } = await supabase.from('users').select('balance').eq('id', payment.userId).single();
      if (userData) {
        const newBalance = userData.balance + payment.amount;
        await supabase.from('users').update({ balance: newBalance }).eq('id', payment.userId);
        if (user?.id === payment.userId) setUser({ ...user, balance: newBalance });
      }
    }
    setPayments(payments.map(p => p.id === id ? { ...p, status, rejectionReason: reason } : p));
  };

  const purchaseProduct = async (productId: string, tariffId: string, nickname: string, contactInfo: string) => {
    if (!user) return false;
    const product = products.find(p => p.id === productId);
    const tariff = product?.tariffs.find(t => t.id === tariffId);
    if (!product || !tariff || user.balance < tariff.price) return false;

    const newBalance = user.balance - tariff.price;
    await supabase.from('users').update({ balance: newBalance }).eq('id', user.id);
    setUser({ ...user, balance: newBalance });

    const { data: orderData } = await supabase.from('orders').insert({
      user_id: user.id,
      user_nickname: nickname,
      contact_info: contactInfo,
      product_id: productId,
      product_name: product.name,
      tariff_name: tariff.name,
      price: tariff.price,
      status: OrderStatus.PENDING
    }).select().single();

    if (orderData) {
      setOrders([{
        id: orderData.id, userId: user.id, userNickname: nickname,
        contactInfo, productId, productName: product.name,
        tariffName: tariff.name, price: tariff.price,
        status: OrderStatus.PENDING, createdAt: orderData.created_at
      }, ...orders]);
      return true;
    }
    return false;
  };

  const processOrder = async (id: string, status: OrderStatus) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const addBroadcast = (message: string, type: Broadcast['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setBroadcasts([{ id, message, type, createdAt: new Date().toISOString() }, ...broadcasts]);
  };

  const removeBroadcast = (id: string) => setBroadcasts(broadcasts.filter(b => b.id !== id));

  const addNotification = (userId: string, title: string, message: string, type: Notification['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications([{ id, userId, title, message, type, isRead: false, createdAt: new Date().toISOString() }, ...notifications]);
  };

  const markNotificationsAsRead = () => setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  const clearNotifications = () => setNotifications([]);
  const deleteNotification = (id: string) => setNotifications(notifications.filter(n => n.id !== id));

  const value = {
    user, users, products, payments, orders, config, logs, broadcasts, notifications, loading, dbConnected,
    login, googleLogin, logout, register, updateConfig, addProduct, updateProduct, deleteProduct, seedProducts,
    adminAddUser, adminUpdateUser, updateUserProfile, deleteUser, deletePayment, deleteOrder, deleteLog,
    submitPayment, processPayment, purchaseProduct, processOrder, addBroadcast, removeBroadcast,
    addNotification, markNotificationsAsRead, clearNotifications, deleteNotification
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
