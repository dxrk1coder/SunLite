
import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Server, Users, Cpu, Activity, 
  Globe, ShoppingCart, ArrowRight, Star, Gem, Crown, Coins, Package, Gavel
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

const StatCard = ({ icon: Icon, label, value, colorClass, currentVal, maxVal }: any) => {
  let percent = 100;
  if (label === 'Ping Rate') {
    percent = Math.max(0, Math.min(100, Math.round(((200 - currentVal) / 200) * 100)));
  } else if (maxVal) {
    percent = Math.round((currentVal / maxVal) * 100);
  } else {
    percent = Math.max(0, Math.min(100, currentVal)); 
  }

  const glowClass = colorClass.includes('emerald') ? 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                    colorClass.includes('blue') ? 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
                    colorClass.includes('purple') ? 'shadow-[0_0_15px_rgba(168,85,247,0.3)]' :
                    'shadow-[0_0_15px_rgba(244,63,94,0.3)]';

  return (
    <div className={`bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-slate-700 transition-all group relative overflow-hidden ${glowClass}`}>
      <div className={`absolute -top-4 -right-4 p-8 opacity-5 group-hover:scale-110 transition-transform ${colorClass}`}>
        <Icon size={120} />
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 rounded-2xl bg-slate-950/50 border border-slate-800 ${colorClass}`}>
          <Icon size={24} />
        </div>
        <div className="text-right">
           <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mb-1">{label}</p>
           <h3 className="text-2xl font-minecraft font-bold">{value}</h3>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
           <span className="text-slate-500">Status</span>
           <span className={colorClass}>{percent}%</span>
        </div>
        <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${colorClass.replace('text-', 'bg-')} ${glowClass}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  // Extract addBroadcast from useStore hook to fix "Cannot find name 'addBroadcast'"
  const { config, products, addBroadcast } = useStore();
  const { stats } = config;

  const featured = products.slice(0, 4);

  const getFeaturedIcon = (category: Category) => {
     switch (category) {
        case Category.RANKS: return <Crown size={32} className="text-emerald-400" />;
        case Category.COINS: return <Coins size={32} className="text-amber-400" />;
        case Category.KEYS: return <Package size={32} className="text-blue-400" />;
        case Category.UNBAN: return <Gavel size={32} className="text-rose-500" />;
        default: return <Crown size={32} className="text-slate-400" />;
     }
  };

  return (
    <div className="space-y-32 pb-32 animate-fade-in">
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-400/10 blur-[150px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-6 py-2.5 rounded-full mb-10 animate-bounce-slow">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em]">Official Server Platform</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-minecraft mb-8 tracking-tighter leading-none uppercase drop-shadow-2xl">
            {config.siteName.split('.')[0]}<span className="text-emerald-500">.{config.siteName.split('.')[1] || 'GG'}</span>
          </h1>
          
          <p className="text-slate-400 text-xl md:text-2xl mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
            O'zbekistondagi eng barqaror va sifatli Minecraft serveri uchun maxsus paketlar va imkoniyatlar.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <Link 
              to="/store" 
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-6 rounded-2xl font-bold text-lg flex items-center justify-center space-x-4 transition-all emerald-glow-strong hover:-translate-y-1.5 uppercase tracking-widest"
            >
              <ShoppingCart size={24} />
              <span>Do'konga o'tish</span>
            </Link>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(config.serverIp);
                addBroadcast("IP ko'chirildi: " + config.serverIp, 'info');
              }}
              className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-slate-700 px-12 py-6 rounded-2xl font-bold text-lg flex items-center justify-center space-x-4 transition-all hover:-translate-y-1.5 border-b-4 border-slate-800 active:border-b-0 active:translate-y-1"
            >
              <Globe size={24} className="text-emerald-400" />
              <span>IP: {config.serverIp}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
           <Star className="mx-auto text-amber-500 mb-4 animate-pulse" size={32} />
           <h2 className="text-4xl font-minecraft text-white mb-2 tracking-widest uppercase">SARALANGAN TO'PLAMLAR</h2>
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Eng ommabop tanlovlarimiz</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {featured.map(product => {
             const minPrice = Math.min(...product.tariffs.map(t => t.price));
             return (
               <Link 
                 to="/store" 
                 key={product.id}
                 className="group bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] hover:border-emerald-500/40 transition-all hover:-translate-y-2 relative overflow-hidden"
               >
                 <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
                    {getFeaturedIcon(product.category)}
                 </div>
                 <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {getFeaturedIcon(product.category)}
                 </div>
                 <h3 className="text-xl font-bold font-minecraft mb-2 uppercase group-hover:text-emerald-400 transition-colors">{product.name}</h3>
                 <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-6">Boshlanadi: <span className="text-emerald-500 font-minecraft text-sm">{minPrice.toLocaleString()} UZS</span></p>
                 <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                    <span>Hozir ko'rish</span>
                    <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </div>
               </Link>
             );
           })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-5xl font-minecraft text-emerald-400 mb-3 tracking-widest uppercase">SERVER STATUS</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Tizim barqarorligi va onlayn holat</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 px-8 py-4 rounded-3xl flex items-center space-x-6">
             <div className="text-right">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Global Status</span>
                <span className="block text-emerald-500 font-bold font-minecraft text-2xl uppercase tracking-widest">Stable</span>
             </div>
             <div className="w-12 h-12 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            icon={Users} 
            label="Online Players" 
            value={`${stats.online} / ${stats.maxPlayers}`} 
            colorClass="text-emerald-400"
            currentVal={stats.online}
            maxVal={stats.maxPlayers}
          />
          <StatCard 
            icon={Cpu} 
            label="CPU Utilization" 
            value={`${stats.cpu}%`} 
            colorClass="text-blue-400"
            currentVal={stats.cpu}
          />
          <StatCard 
            icon={Activity} 
            label="RAM Consumption" 
            value={`${stats.ram}%`} 
            colorClass="text-purple-400"
            currentVal={stats.ram}
          />
          <StatCard 
            icon={Server} 
            label="Network Ping" 
            value={`${stats.ping}ms`} 
            colorClass="text-rose-400"
            currentVal={stats.ping}
          />
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-4">
         <div className="relative bg-emerald-600 rounded-[3rem] p-16 overflow-hidden group">
            <div className="absolute top-0 right-0 p-24 opacity-10 rotate-12 group-hover:scale-125 transition-transform">
               < Gem size={350} className="text-white" />
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="max-w-2xl text-center lg:text-left">
                  <h3 className="text-5xl font-minecraft text-white mb-6 uppercase tracking-wider leading-none">DO'KONIMIZDA YANGI IMKONIYATLAR!</h3>
                  <p className="text-emerald-50 text-xl font-medium leading-relaxed">Serverimizda eng yaxshi o'yin tajribasiga ega bo'lish uchun maxsus paketlarni hozirda qo'lga kiriting. Barcha xaridlar admin nazorati ostida amalga oshiriladi.</p>
               </div>
               <Link to="/store" className="bg-white text-emerald-700 px-12 py-6 rounded-[2rem] font-bold text-xl uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-4 shrink-0">
                  <span>Mahsulotlar</span>
                  <ArrowRight size={24} />
               </Link>
            </div>
         </div>
      </footer>
    </div>
  );
};
