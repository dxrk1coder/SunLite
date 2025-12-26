
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  Users, ShoppingBag, CreditCard, 
  Settings, Megaphone, BarChart3, History
} from 'lucide-react';

const AdminDashboard = () => {
  const { users, products, payments, orders } = useStore();
  const totalSales = orders.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + o.price, 0);
  const pendingPayments = payments.filter(p => p.status === 'PENDING').length;

  return (
    <div className="space-y-12 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-minecraft text-emerald-400 tracking-wider uppercase">BOSHQARUV PANELI</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Platformaning umumiy holati</p>
          </div>
          <div className="flex items-center space-x-3 bg-slate-950 p-4 rounded-3xl border border-slate-800">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tizim Online</span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Gamerlar', val: users.length, color: 'text-blue-500', icon: Users },
            { label: 'Mahsulotlar', val: products.length, color: 'text-purple-500', icon: ShoppingBag },
            { label: 'Jami Savdo', val: totalSales.toLocaleString(), color: 'text-emerald-500', icon: BarChart3 },
            { label: 'To\'lovlar', val: pendingPayments, color: 'text-amber-500', icon: CreditCard },
          ].map(s => (
            <div key={s.label} className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 hover:border-emerald-500/20 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <s.icon size={80} />
               </div>
               <div className={`p-3 w-fit rounded-2xl bg-slate-900 ${s.color} mb-4`}>
                  <s.icon size={20} />
               </div>
               <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">{s.label}</p>
               <p className={`text-3xl font-minecraft ${s.color}`}>
                 {s.val} {s.label === 'Jami Savdo' ? 'UZS' : ''}
               </p>
            </div>
          ))}
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
          placeholder="Xabarni yozing..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <select 
            value={type}
            onChange={(e: any) => setType(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl outline-none font-bold text-xs"
          >
            <option value="info">INFO</option>
            <option value="success">SUCCESS</option>
            <option value="warning">WARNING</option>
            <option value="error">ERROR</option>
          </select>
          <button 
            onClick={() => { if (!msg) return; addBroadcast(msg, type); setMsg(''); }}
            className="w-full sm:flex-grow bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-2xl font-bold transition-all emerald-glow uppercase text-xs tracking-widest text-white"
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <StoreProvider>
        <MainContent />
      </StoreProvider>
    </Router>
  );
};

export default App;
