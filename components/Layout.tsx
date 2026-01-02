
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Menu, X, LayoutDashboard, ShoppingCart, 
  Wallet, Settings, LogOut, User as UserIcon,
  Bell, ShieldCheck, CheckCheck, Trash2, HelpCircle,
  Wrench, ArrowLeft, ChevronRight, Activity
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Maintenance logic: Only blocks non-admins
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
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
          isActive 
            ? 'bg-emerald-500 text-white emerald-glow shadow-lg' 
            : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900/50'
        }`}
      >
        <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
        <span className="font-bold uppercase text-[11px] tracking-widest">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      {/* Maintenance Overlay - Premium Design */}
      {isMaintenanceActive && !isAuthPage && (
        <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] animate-pulse" />
             <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] animate-pulse delay-1000" />
             <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>
          
          <div className="relative z-10 animate-scale-in flex flex-col items-center max-w-2xl">
            <div className="relative mb-12">
               <div className="absolute inset-0 bg-amber-500/20 blur-3xl animate-pulse" />
               <div className="w-32 h-32 bg-slate-900 border border-amber-500/30 rounded-[3rem] flex items-center justify-center shadow-2xl relative z-10">
                  <Wrench size={56} className="text-amber-500 animate-bounce-slow" />
               </div>
               <div className="absolute -top-4 -right-4 bg-slate-950 border border-slate-800 p-3 rounded-2xl text-emerald-400 animate-spin-slow">
                  <Activity size={24} />
               </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-minecraft text-white mb-6 uppercase tracking-[0.2em] leading-none">
              TEXNIK <span className="text-amber-500">ISHLAR</span>
            </h1>
            
            <div className="h-1 w-32 bg-amber-500/30 rounded-full mb-8" />
            
            <p className="text-slate-400 text-lg md:text-xl mb-12 font-medium leading-relaxed">
              SUNLITE.GG hozirda takomillashtirilmoqda. Biz siz uchun eng so'nggi texnologiyalarni va xavfsizlik tizimlarini joriy etyapmiz. Tez orada yanada kuchliroq qaytamiz!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
               <button onClick={handleLogout} className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center space-x-3 transition-all">
                 <ArrowLeft size={16} />
                 <span>Login sahifasiga</span>
               </button>
               <a href={config.telegramSupport} target="_blank" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest emerald-glow transition-all">
                 Yordam markazi
               </a>
            </div>
          </div>
          
          <div className="absolute bottom-10 text-[10px] font-bold text-slate-700 uppercase tracking-[0.5em]">
             Sunlite System v2.5.0 • Protected by Arcanum
          </div>
        </div>
      )}

      {/* Broadcasts */}
      <div className="fixed top-20 right-4 z-[100] space-y-2 pointer-events-none w-full max-w-[350px]">
        {broadcasts.map(bc => (
          <div key={bc.id} className="pointer-events-auto p-4 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl flex items-center justify-between bg-slate-900/90 border-l-4 border-l-emerald-500 animate-slide-in-right">
            <div className="flex items-center space-x-3">
              <Bell size={18} className="text-emerald-400 shrink-0"/>
              <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">{bc.message}</p>
            </div>
            <button onClick={() => removeBroadcast(bc.id)} className="ml-4 text-slate-600 hover:text-white transition-colors"><X size={14} /></button>
          </div>
        ))}
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center emerald-glow transition-transform group-hover:rotate-12">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <span className="font-minecraft text-2xl tracking-widest text-emerald-400 uppercase">{config.siteName}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/" icon={LayoutDashboard} label="Asosiy" />
              <NavLink to="/store" icon={ShoppingCart} label="Do'kon" />
              {user && (
                <>
                  <NavLink to="/balance" icon={Wallet} label="Balans" />
                  <NavLink to="/admin" icon={Settings} label="Admin" adminOnly />
                  
                  {/* Notifications Toggle */}
                  <div className="relative" ref={notifRef}>
                    <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-3 text-slate-400 hover:text-emerald-400 transition-colors relative">
                      <Bell size={20} />
                      {unreadCount > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-slate-950 font-black">{unreadCount}</span>}
                    </button>
                    {isNotifOpen && (
                      <div className="absolute right-0 mt-4 w-80 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bildirishnomalar</span>
                           <div className="flex space-x-3">
                              <button onClick={markNotificationsAsRead} className="text-emerald-500 hover:text-emerald-400"><CheckCheck size={16}/></button>
                              <button onClick={clearNotifications} className="text-rose-500 hover:text-rose-400"><Trash2 size={16}/></button>
                           </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                           {userNotifications.length === 0 ? (
                             <div className="p-10 text-center text-slate-600 italic">
                               <p className="text-[10px] uppercase font-bold tracking-widest">Xabarlar yo'q</p>
                             </div>
                           ) : userNotifications.map(n => (
                             <div key={n.id} className={`p-5 border-b border-slate-800/50 flex items-start space-x-4 ${!n.isRead ? 'bg-emerald-500/5' : ''}`}>
                               <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}/>
                               <div className="flex-grow">
                                  <p className="text-[11px] font-bold text-slate-200 uppercase tracking-wide">{n.title}</p>
                                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                                </div>
                               <button onClick={() => deleteNotification(n.id)} className="text-slate-700 hover:text-rose-500 transition-colors"><X size={12}/></button>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link to="/profile" className="flex items-center space-x-3 bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-800 hover:border-emerald-500 transition-all group">
                    <span className="text-[11px] font-bold text-emerald-400">@{user.nickname}</span>
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                       <UserIcon size={16} />
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="p-3 text-slate-600 hover:text-rose-500 transition-colors"><LogOut size={22}/></button>
                </>
              )}
              {!user && (
                <Link to="/login" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold emerald-glow uppercase text-[11px] tracking-widest transition-all">
                  Kirish
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {user && unreadCount > 0 && (
                <button onClick={() => navigate('/profile')} className="relative p-2 text-slate-400">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
                </button>
              )}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className={`p-3 rounded-xl transition-all ${isMenuOpen ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden fixed inset-x-0 top-20 bg-slate-950/95 backdrop-blur-2xl border-b border-slate-900 transition-all duration-300 overflow-hidden z-[90] ${isMenuOpen ? 'max-h-[85vh] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'}`}>
          <div className="px-4 flex flex-col space-y-2">
            <NavLink to="/" icon={LayoutDashboard} label="Bosh sahifa" />
            <NavLink to="/store" icon={ShoppingCart} label="Do'kon" />
            
            {user ? (
              <>
                <NavLink to="/balance" icon={Wallet} label="Balans" />
                {user.role === UserRole.ADMIN && <NavLink to="/admin" icon={Settings} label="Admin Panel" adminOnly />}
                <NavLink to="/profile" icon={UserIcon} label="Profil" />
                
                <div className="pt-4 mt-4 border-t border-slate-900">
                  <div className="p-6 bg-slate-900/50 rounded-3xl flex items-center justify-between mb-4 border border-slate-800">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Gamer</p>
                      <p className="text-lg font-minecraft text-emerald-400">@{user.nickname}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Balans</p>
                      <p className="text-lg font-minecraft text-white">{user.balance.toLocaleString()} UZS</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-3 p-5 rounded-2xl bg-rose-600/10 text-rose-500 font-bold uppercase text-[11px] tracking-widest border border-rose-500/20"
                  >
                    <LogOut size={18} />
                    <span>Tizimdan chiqish</span>
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold uppercase text-center text-[11px] tracking-widest emerald-glow"
              >
                Kirish / Ro'yxatdan o'tish
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow relative z-0">{children}</main>

      <footer className="bg-slate-950 border-t border-slate-900 py-16">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start space-x-3 mb-4 group">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <span className="font-minecraft text-2xl tracking-widest text-emerald-400 uppercase">{config.siteName}</span>
               </div>
               <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-600">O'zbekistondagi eng barqaror server</p>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Support Zone</h4>
               <a href={config.telegramSupport} target="_blank" className="flex items-center space-x-4 bg-slate-900 border border-slate-800 px-8 py-4 rounded-[2rem] hover:border-emerald-500/50 transition-all group">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform">
                     <HelpCircle size={20} />
                  </div>
                  <div className="text-left">
                     <p className="text-xs font-bold text-white uppercase tracking-wider">Yordam kerakmi?</p>
                     <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Telegram Support</p>
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
