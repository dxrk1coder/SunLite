import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Layout } from './components/Layout.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { Home } from './pages/Home.tsx';
import { Store } from './pages/Store.tsx';
import { Balance } from './pages/Balance.tsx';
import { Login } from './pages/Login.tsx';
import { Profile } from './pages/Profile.tsx';
import { AdminLayout } from './pages/admin/AdminLayout.tsx';
import { AdminPayments } from './pages/admin/AdminPayments.tsx';
import { AdminSettings } from './pages/admin/AdminSettings.tsx';
import { AdminProducts } from './pages/admin/AdminProducts.tsx';
import { AdminLogs } from './pages/admin/AdminLogs.tsx';
import { AdminOrders } from './pages/admin/AdminOrders.tsx';
import { AdminUsers } from './pages/admin/AdminUsers.tsx';
import { 
  Zap, Users, ShoppingBag, CreditCard, 
  DatabaseZap, ArrowUpRight, TrendingUp,
  History, Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const { users, products, payments, orders, seedProducts } = useStore();
  const totalSales = orders.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + o.price, 0);
  const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
  const activeOrders = orders.filter(o => o.status === 'PENDING').length;

  return (
    <div className="space-y-12 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-minecraft text-emerald-400 tracking-wider uppercase">BOSHQARUV PANELI</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Platformaning umumiy holati va nazorati</p>
          </div>
          <div className="flex items-center space-x-3 bg-slate-950 p-4 rounded-3xl border border-slate-800">
             <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tizim Online</span>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Gamerlar', val: users.length, color: 'text-blue-500', icon: Users, trend: '+12%' },
            { label: 'Mahsulotlar', val: products.length, color: 'text-purple-500', icon: ShoppingBag, trend: 'Stabil' },
            { label: 'Jami Savdo', val: totalSales.toLocaleString(), color: 'text-emerald-500', icon: TrendingUp, trend: '+24%' },
            { label: 'Kutilayotgan To\'lovlar', val: pendingPayments, color: 'text-amber-500', icon: CreditCard, trend: pendingPayments > 0 ? 'Urgent' : 'None' },
          ].map(s => (
            <div key={s.label} className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 hover:border-emerald-500/20 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <s.icon size={80} />
               </div>
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`p-3 rounded-2xl bg-slate-900 ${s.color}`}>
                     <s.icon size={20} />
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 ${s.trend.includes('+') ? 'text-emerald-400' : 'text-slate-500'}`}>
                     {s.trend}
                  </span>
               </div>
               <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">{s.label}</p>
               <p className={`text-3xl font-minecraft ${s.color} group-hover:scale-105 transition-transform origin-left`}>
                 {s.val} {s.label === 'Jami Savdo' ? 'UZS' : ''}
               </p>
            </div>
          ))}
       </div>

       {/* Quick Actions */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Tezkor Amallar</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => seedProducts()} 
                  className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white p-6 rounded-[2rem] border border-emerald-500/20 flex items-center justify-between group transition-all"
                >
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-emerald-500/20 rounded-2xl group-hover:bg-white/20">
                         <DatabaseZap size={24} />
                      </div>
                      <div className="text-left">
                         <p className="font-bold text-sm uppercase">Bazani to'ldirish</p>
                         <p className="text-[9px] opacity-70 uppercase">Mahsulotlarni qayta yuklash</p>
                      </div>
                   </div>
                   <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>

                <Link 
                  to="/admin/payments" 
                  className="bg-amber-600/10 hover:bg-amber-600 text-amber-500 hover:text-white p-6 rounded-[2rem] border border-amber-500/20 flex items-center justify-between group transition-all"
                >
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-amber-500/20 rounded-2xl group-hover:bg-white/20">
                         <CreditCard size={24} />
                      </div>
                      <div className="text-left">
                         <p className="font-bold text-sm uppercase">To'lovlarni ko'rish</p>
                         <p className="text-[9px] opacity-70 uppercase">{pendingPayments} ta yangi kutilmoqda</p>
                      </div>
                   </div>
                   <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>

                <Link 
                  to="/admin/orders" 
                  className="bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white p-6 rounded-[2rem] border border-blue-500/20 flex items-center justify-between group transition-all"
                >
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-500/20 rounded-2xl group-hover:bg-white/20">
                         <Zap size={24} />
                      </div>
                      <div className="text-left">
                         <p className="font-bold text-sm uppercase">Aktiv Buyurtmalar</p>
                         <p className="text-[9px] opacity-70 uppercase">{activeOrders} ta bajarilmagan</p>
                      </div>
                   </div>
                   <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>

                <Link 
                  to="/admin/settings" 
                  className="bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white p-6 rounded-[2rem] border border-slate-700 flex items-center justify-between group transition-all"
                >
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-slate-700/50 rounded-2xl group-hover:bg-white/20">
                         <Settings size={24} />
                      </div>
                      <div className="text-left">
                         <p className="font-bold text-sm uppercase">Tizim Sozlamalari</p>
                         <p className="text-[9px] opacity-70 uppercase">IP, Karta va Xavfsizlik</p>
                      </div>
                   </div>
                   <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
             </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Oxirgi Loglar</h3>
             <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 space-y-4 max-h-[320px] overflow-y-auto custom-scrollbar">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3 text-[10px] border-b border-slate-900 pb-3 last:border-0">
                     <History size={14} className="text-slate-600 mt-0.5" />
                     <div>
                        <p className="text-slate-300 font-bold uppercase">Tizimga kirish</p>
                        <p className="text-slate-600">Admin tomonidan yangilanish amalga oshirildi</p>
                        <p className="text-slate-700 mt-1 font-mono">Bugun, 14:20</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

const AdminBroadcast = () => {
  const { addBroadcast } = useStore();
  const [msg, setMsg] = React.useState('');
  const [type, setType] = React.useState<'info' | 'success' | 'warning' | 'error'>('info');

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-minecraft text-emerald-400 uppercase tracking-widest">Global E'lonlar</h2>
      <div className="bg-slate-950 border border-slate-800 p-10 rounded-[2.5rem] space-y-6">
        <textarea 
          className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl min-h-[180px] focus:border-emerald-500 outline-none transition-all text-sm leading-relaxed" 
          placeholder="Barcha foydalanuvchilar ekranida ko'rinadigan xabarni yozing..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <select 
            value={type}
            onChange={(e: any) => setType(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl outline-none font-bold text-xs"
          >
            <option value="info">INFO (BLUE)</option>
            <option value="success">SUCCESS (GREEN)</option>
            <option value="warning">WARNING (AMBER)</option>
            <option value="error">ERROR (RED)</option>
          </select>
          <button 
            onClick={() => { 
              if (!msg) return;
              addBroadcast(msg, type); 
              setMsg(''); 
            }}
            className="w-full sm:flex-grow bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-2xl font-bold transition-all emerald-glow"
          >
            Yuborish
          </button>
        </div>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { loading } = useStore();
  
  if (loading) return <LoadingScreen />;

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="broadcast" element={<AdminBroadcast />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
};

export default App;