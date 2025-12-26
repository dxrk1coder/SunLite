
import React, { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';
import { 
  BarChart3, Box, CreditCard, 
  ShoppingBag, Settings, History, 
  Megaphone, Users, ChevronRight, Database, DatabaseZap
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, dbConnected } = useStore();

  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/" />;
  }

  const navItems = [
    { to: '/admin', label: 'Statistika', icon: BarChart3, end: true },
    { to: '/admin/products', label: 'Mahsulotlar', icon: Box },
    { to: '/admin/payments', label: 'To\'lovlar', icon: CreditCard },
    { to: '/admin/orders', label: 'Buyurtmalar', icon: ShoppingBag },
    { to: '/admin/users', label: 'Foydalanuvchilar', icon: Users },
    { to: '/admin/broadcast', label: 'E\'lonlar', icon: Megaphone },
    { to: '/admin/settings', label: 'Sozlamalar', icon: Settings },
    { to: '/admin/logs', label: 'Tizim loglari', icon: History },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Admin Panel</p>
          <p className="text-lg font-bold">Xush kelibsiz, {user.nickname}</p>
        </div>

        <div className={`p-4 rounded-2xl border mb-6 flex items-center space-x-3 transition-colors ${dbConnected ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/5 border-rose-500/20 text-rose-500'}`}>
           {dbConnected ? <DatabaseZap size={18} /> : <Database size={18} />}
           <div className="text-[10px] font-bold uppercase tracking-widest">
              Database: {dbConnected ? 'CONNECTED' : 'MOCK MODE'}
           </div>
        </div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `
              flex items-center justify-between p-4 rounded-xl transition-all group
              ${isActive 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'}
            `}
          >
            <div className="flex items-center space-x-3">
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl min-h-[600px]">
        {!dbConnected && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl mb-8 flex items-center space-x-4">
             <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg animate-pulse">
                <Database size={20} />
             </div>
             <div>
                <p className="text-rose-400 text-xs font-bold uppercase tracking-widest">DATABASE_CONNECTION_ERROR</p>
                <p className="text-[10px] text-slate-500 uppercase font-medium mt-1">Supabase ulanmagan. Ma'lumotlar faqat vaqtinchalik LocalStorage'da saqlanmoqda.</p>
             </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};
