
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Menu, X, LayoutDashboard, ShoppingCart, 
  Wallet, Settings, LogOut, User as UserIcon,
  Bell, Terminal, ShieldCheck, CheckCheck, Trash2, ExternalLink, HelpCircle,
  Wrench, ArrowLeft
} from 'lucide-react';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, logout, config, broadcasts, removeBroadcast, 
    notifications, markNotificationsAsRead, clearNotifications, deleteNotification 
  } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Maintenance Logic
  const isMaintenanceActive = config.maintenanceMode && user?.role !== UserRole.ADMIN;
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const userNotifications = notifications.filter(n => {
    if (n.userId === 'ALL') return true;
    if (user?.role === UserRole.ADMIN && n.userId === 'ADMIN') return true;
    return n.userId === user?.id;
  });
  
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const NavLink = ({ to, icon: Icon, label, adminOnly = false }: any) => {
    if (adminOnly && user?.role !== UserRole.ADMIN) return null;
    return (
      <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          location.pathname === to 
            ? 'bg-emerald-500 text-white emerald-glow' 
            : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
        }`}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      {/* Maintenance Overlay */}
      {isMaintenanceActive && !isAuthPage && (
        <div className="fixed inset-0 z-[999] bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* Background Decor */}
          <div className="absolute inset-0 z-0">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] animate-pulse" />
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] animate-pulse delay-1000" />
             <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                  style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          </div>

          <div className="relative z-10 animate-scale-in flex flex-col items-center">
            <div className="w-28 h-28 bg-amber-500/10 border border-amber-500/30 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(245,158,11,0.15)] relative">
               <div className="absolute inset-0 bg-amber-500/10 blur-2xl animate-pulse" />
               <Wrench size={56} className="text-amber-500 animate-float" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-minecraft text-white mb-6 uppercase tracking-[0.1em] drop-shadow-2xl">
              TEXNIK <span className="text-amber-500">ISHAR</span>
            </h1>
            
            <p className="text-slate-400 max-w-xl mb-12 leading-relaxed font-medium text-lg">
              Saytda yangilanishlar va texnik sozlash ishlari olib borilmoqda. 
              Xavotir olmang, sizning barcha ma'lumotlaringiz xavfsiz holatda.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
               <a href="https://t.me/SunLite_GG" target="_blank" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all emerald-glow uppercase text-xs tracking-widest group">
                  <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Yangiliklar Kanali</span>
               </a>
               <button onClick={handleLogout} className="bg-slate-900 border border-slate-800 text-slate-400 px-10 py-5 rounded-2xl font-bold hover:text-white hover:bg-slate-800 transition-all uppercase text-xs tracking-widest flex items-center justify-center space-x-3">
                  <ArrowLeft size={18} />
                  <span>Login sahifasiga</span>
               </button>
            </div>
            
            <div className="mt-16 flex items-center space-x-2 text-slate-600">
               <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
               <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Tez orada qaytamiz</p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-20 right-4 z-[100] space-y-2 pointer-events-none">
        {broadcasts.map(bc => (
          <div key={bc.id} className="pointer-events-auto p-4 rounded-lg border-l-4 shadow-lg backdrop-blur-md flex items-center justify-between min-w-[300px] bg-slate-900/90 border-emerald-500 animate-slide-in-right">
            <div className="flex items-center space-x-3"><Bell size={18} className="text-emerald-400"/><p className="text-xs font-bold uppercase tracking-wider">{bc.message}</p></div>
            <button onClick={() => removeBroadcast(bc.id)} className="ml-4 opacity-50"><X size={14} /></button>
          </div>
        ))}
      </div>

      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center emerald-glow transition-transform group-hover:rotate-12"><ShieldCheck className="text-white" /></div>
              <span className="font-minecraft text-2xl tracking-wider text-emerald-400 uppercase">{config.siteName}</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/" icon={LayoutDashboard} label="Bosh sahifa" />
              <NavLink to="/store" icon={ShoppingCart} label="Do'kon" />
              {user && (
                <>
                  <NavLink to="/balance" icon={Wallet} label="Balans" />
                  {user.role === UserRole.ADMIN && <NavLink to="/admin" icon={Settings} label="Admin" adminOnly />}
                  <div className="relative" ref={notifRef}>
                    <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 text-slate-400 relative">
                      <Bell size={20} />
                      {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-slate-950 font-bold">{unreadCount}</span>}
                    </button>
                    {isNotifOpen && (
                      <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bildirishnomalar</span>
                           <div className="flex space-x-2"><button onClick={markNotificationsAsRead} className="text-emerald-400"><CheckCheck size={14}/></button><button onClick={clearNotifications} className="text-rose-500"><Trash2 size={14}/></button></div>
                        </div>
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                           {userNotifications.length === 0 ? <p className="p-8 text-center text-xs text-slate-600 italic">Xabarlar yo'q</p> : userNotifications.map(n => (
                             <div key={n.id} className={`p-4 border-b border-slate-800/50 flex items-start space-x-3 ${!n.isRead ? 'bg-emerald-500/5' : ''}`}>
                               <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"/>
                               <div className="flex-grow">
                                  <p className="text-xs font-bold text-slate-200">{n.title}</p>
                                  <p className="text-[10px] text-slate-500 mt-1">{n.message}</p>
                                </div>
                               <button onClick={() => deleteNotification(n.id)} className="text-slate-700 hover:text-rose-500"><X size={10}/></button>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Link to="/profile" className="flex items-center space-x-2 bg-slate-900 p-1.5 px-3 rounded-full border border-slate-800 hover:border-emerald-500 transition-all">
                    <span className="text-xs font-bold text-emerald-400">@{user.nickname}</span>
                    <UserIcon size={14} className="text-slate-500" />
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500"><LogOut size={20}/></button>
                </>
              )}
              {!user && <Link to="/login" className="bg-emerald-600 px-6 py-2 rounded-lg font-bold emerald-glow uppercase text-sm tracking-widest">Kirish</Link>}
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-400">
               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-grow">{children}</main>
      <footer className="bg-slate-950 border-t border-slate-900 py-16">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                  <ShieldCheck className="text-emerald-500" />
                  <span className="font-minecraft text-2xl tracking-wider text-emerald-400 uppercase">SUNLITE.GG</span>
               </div>
               <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-600">O'zbekistondagi eng barqaror server</p>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Support Zone</h4>
               <a href="https://t.me/SunDonate" target="_blank" className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl hover:border-emerald-500/50 transition-all group">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 group-hover:scale-110 transition-transform">
                     <HelpCircle size={18} />
                  </div>
                  <div className="text-left">
                     <p className="text-xs font-bold text-white">Yordam kerakmi?</p>
                     <p className="text-[9px] text-slate-500 uppercase">t.me/SunDonate</p>
                  </div>
               </a>
            </div>

            <div className="text-center md:text-right">
               <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-700">SUNLITE.GG &copy; 2024. Barcha huquqlar himoyalangan.</p>
            </div>
         </div>
      </footer>
    </div>
  );
};
