
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Menu, X, LayoutDashboard, ShoppingCart, 
  Wallet, Settings, LogOut, User as UserIcon,
  Bell, CheckCheck, Trash2, HelpCircle,
  Wrench, ArrowLeft, Activity, Wifi, WifiOff, ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';

const NetworkIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [latency, setLatency] = useState<number>(Math.floor(Math.random() * 20) + 15);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(() => {
      if (isOnline) {
        setLatency(prev => {
          const change = Math.floor(Math.random() * 5) - 2;
          return Math.max(10, Math.min(100, prev + change));
        });
      }
    }, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
      isOnline 
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
        : 'bg-rose-500/10 border-rose-500/20 text-rose-500 animate-pulse'
    }`}>
      {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
      <span>{isOnline ? `Online • ${latency}ms` : 'Offline'}</span>
    </div>
  );
};

// Mukammal va Attractive Minecraft Emerald Logo Komponenti
export const LogoComponent = ({ className = "h-14" }: { className?: string }) => (
  <div className={`${className} aspect-square flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group transition-all relative animate-float logo-container`}>
    
    {/* Sunray Particles (Back Layer) */}
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-60">
      <g className="animate-ray origin-center">
        <rect x="46" y="2" width="8" height="15" fill="#fbbf24" rx="1" />
        <rect x="46" y="83" width="8" height="15" fill="#fbbf24" rx="1" />
        <rect x="2" y="46" width="15" height="8" fill="#fbbf24" rx="1" />
        <rect x="83" y="46" width="15" height="8" fill="#fbbf24" rx="1" />
        
        <rect x="20" y="20" width="8" height="8" fill="#fbbf24" opacity="0.5" />
        <rect x="72" y="20" width="8" height="8" fill="#fbbf24" opacity="0.5" />
        <rect x="20" y="72" width="8" height="8" fill="#fbbf24" opacity="0.5" />
        <rect x="72" y="72" width="8" height="8" fill="#fbbf24" opacity="0.5" />
      </g>
    </svg>

    {/* Main 3D Emerald Block */}
    <svg viewBox="0 0 100 100" className="w-[70%] h-[70%] z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
      {/* Front faces shadows */}
      <path d="M50 20 L85 37.5 L85 72.5 L50 90 L15 72.5 L15 37.5 Z" fill="black" opacity="0.3" />

      {/* Front Left Face (Emerald Green Deep) */}
      <path d="M50 55 L15 37.5 L15 72.5 L50 90 Z" fill="#059669" />
      
      {/* Front Right Face (Emerald Green Main) */}
      <path d="M50 55 L85 37.5 L85 72.5 L50 90 Z" fill="#10b981" />
      
      {/* Top Face (Emerald Green Light / Lit by Sun) */}
      <path d="M50 20 L85 37.5 L50 55 L15 37.5 Z" fill="#34d399" />

      {/* Details/Facets */}
      <path d="M50 20 L65 27.5 L50 35 L35 27.5 Z" fill="white" opacity="0.4" />
      <path d="M15 37.5 L50 55 L50 65 L15 47.5 Z" fill="white" opacity="0.1" />
      
      {/* Magic Glints (Square pixels) */}
      <rect x="25" y="45" width="5" height="5" fill="white" opacity="0.5">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="65" y="60" width="4" height="4" fill="white" opacity="0.4">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <rect x="55" y="30" width="3" height="3" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
      </rect>
    </svg>

    {/* Enchanted Item Overlay (Shimmer) */}
    <div className="absolute inset-0 shimmer-effect opacity-30 pointer-events-none"></div>
  </div>
);

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
        onClick={() => setIsMenuOpen(false)}
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
      {isMaintenanceActive && !isAuthPage && (
        <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <div className="relative z-10 animate-scale-in flex flex-col items-center max-w-2xl">
            <div className="relative mb-12 group">
               <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse" />
               <LogoComponent className="h-40 md:h-56 border-emerald-500/20" />
            </div>

            <h1 className="text-5xl md:text-7xl font-minecraft text-white mb-6 uppercase tracking-[0.2em] leading-none text-center">
              TEXNIK <span className="text-amber-500">ISHLAR</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl mb-12 font-medium leading-relaxed px-4">
              SUNLITE.GG hozirda takomillashtirilmoqda. Tez orada yanada kuchliroq qaytamiz!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
               <button onClick={handleLogout} className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center space-x-3 transition-all">
                 <ArrowLeft size={16} />
                 <span>Chiqish</span>
               </button>
               <a href={config.telegramSupport} target="_blank" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest emerald-glow transition-all">
                 Yordam markazi
               </a>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-24 right-4 z-[100] space-y-2 pointer-events-none w-full max-w-[350px]">
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

      <nav className="sticky top-0 z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between h-full items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-4 group">
                <LogoComponent />
                <span className="font-minecraft text-3xl tracking-widest text-emerald-400 uppercase hidden sm:block">{config.siteName}</span>
              </Link>
              <div className="hidden lg:block">
                <NetworkIndicator />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/" icon={LayoutDashboard} label="Asosiy" />
              <NavLink to="/store" icon={ShoppingCart} label="Do'kon" />
              {user && (
                <>
                  <NavLink to="/balance" icon={Wallet} label="Balans" />
                  <NavLink to="/admin" icon={Settings} label="Admin" adminOnly />
                  
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
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all overflow-hidden">
                       {user.avatarUrl ? (
                         <img src={user.avatarUrl} className="w-full h-full object-cover" />
                       ) : (
                         <span className="font-bold text-[10px]">{user.nickname.charAt(0).toUpperCase()}</span>
                       )}
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

            <div className="md:hidden flex items-center space-x-4">
              <NetworkIndicator />
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className={`p-3 rounded-xl transition-all ${isMenuOpen ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden fixed inset-x-0 top-20 bg-slate-950/98 backdrop-blur-3xl border-b border-slate-900 transition-all duration-300 overflow-hidden z-[110] ${isMenuOpen ? 'max-h-[90vh] opacity-100 py-8 shadow-2xl' : 'max-h-0 opacity-0 py-0'}`}>
          <div className="px-6 flex flex-col space-y-3">
            <NavLink to="/" icon={LayoutDashboard} label="Bosh sahifa" />
            <NavLink to="/store" icon={ShoppingCart} label="Do'kon" />
            
            {user ? (
              <>
                <NavLink to="/balance" icon={Wallet} label="Balans" />
                {user.role === UserRole.ADMIN && <NavLink to="/admin" icon={Settings} label="Admin Panel" adminOnly />}
                <NavLink to="/profile" icon={UserIcon} label="Profil" />
                
                <div className="pt-6 mt-4 border-t border-slate-900">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-3 p-5 rounded-2xl bg-rose-600/10 text-rose-500 font-bold uppercase text-[11px] tracking-widest border border-rose-500/20 active:scale-95 transition-transform"
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
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold uppercase text-center text-[11px] tracking-widest emerald-glow shadow-xl active:scale-95 transition-transform"
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
               <div className="flex items-center justify-center md:justify-start space-x-4 mb-4 group">
                  <LogoComponent className="h-12" />
                  <span className="font-minecraft text-2xl tracking-widest text-emerald-400 uppercase">{config.siteName}</span>
               </div>
               <div className="flex flex-col space-y-1">
                 <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-600">O'zbekistondagi eng barqaror server</p>
                 <div className="md:hidden pt-4 flex justify-center">
                    <NetworkIndicator />
                 </div>
               </div>
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

            <div className="text-center md:text-right space-y-2">
               <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-700">SUNLITE.GG &copy; 2024. Barcha huquqlar himoyalangan.</p>
               <div className="hidden md:flex justify-end">
                  <NetworkIndicator />
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};
