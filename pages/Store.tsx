
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Category, Product, Tariff } from '../types';
import { ShoppingCart, Clock, Crown, Coins, Package, Gavel, AlertTriangle, X, ChevronRight, User, Send, CheckCircle2 } from 'lucide-react';

export const Store: React.FC = () => {
  const { products, user, purchaseProduct, addBroadcast } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal]);

  const filteredProducts = products.filter(p => 
    p.active && (selectedCategory === 'ALL' || p.category === selectedCategory)
  );

  const getCategoryTheme = (category: Category) => {
    switch (category) {
      case Category.RANKS:
        return { 
          icon: <Crown size={40} />, 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/10',
          border: 'group-hover:border-emerald-500/50'
        };
      case Category.COINS:
        return { 
          icon: <Coins size={40} />, 
          color: 'text-amber-400', 
          bg: 'bg-amber-500/10',
          border: 'group-hover:border-amber-500/50'
        };
      case Category.KEYS:
        return { 
          icon: <Package size={40} />, 
          color: 'text-blue-400', 
          bg: 'bg-blue-500/10',
          border: 'group-hover:border-blue-500/50'
        };
      case Category.UNBAN:
        return { 
          icon: <Gavel size={40} />, 
          color: 'text-rose-500', 
          bg: 'bg-rose-500/10',
          border: 'group-hover:border-rose-500/50'
        };
      default:
        return { 
          icon: <Crown size={40} />, 
          color: 'text-slate-400', 
          bg: 'bg-slate-500/10',
          border: 'group-hover:border-emerald-500/50'
        };
    }
  };

  const handlePurchaseClick = (product: Product) => {
    if (!user) {
      addBroadcast('Xarid qilish uchun tizimga kiring!', 'warning');
      return;
    }
    setSelectedProduct(product);
    setSelectedTariff(product.tariffs[0] || null);
    setNickname(user.nickname || '');
    setShowModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedProduct || !selectedTariff || !nickname || !contactInfo) {
      addBroadcast('Barcha maydonlarni to\'ldiring!', 'warning');
      return;
    }
    
    if (user!.balance < selectedTariff.price) {
      addBroadcast('Balansingiz yetarli emas!', 'warning');
      return;
    }

    setBuyingId(selectedProduct.id);
    const success = await purchaseProduct(selectedProduct.id, selectedTariff.id, nickname, contactInfo);
    setBuyingId(null);
    
    if (success) {
      addBroadcast('Xarid muvaffaqiyatli! Admin tasdig\'ini kuting.', 'success');
      setContactInfo('');
      setShowModal(false);
    } else {
      addBroadcast('Xatolik yuz berdi.', 'warning');
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 animate-fade-in relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-minecraft text-emerald-400 mb-2 tracking-wide uppercase">DO'KON</h1>
            <p className="text-slate-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em]">O'yin olamingizni yangilang</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['ALL', ...Object.values(Category)].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-5 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold transition-all uppercase text-[10px] md:text-xs tracking-widest border ${
                  selectedCategory === cat 
                  ? 'bg-emerald-600 text-white border-emerald-500 emerald-glow' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                {cat === 'ALL' ? 'Barchasi' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const theme = getCategoryTheme(product.category);
            const minPrice = Math.min(...product.tariffs.map(t => t.price));
            return (
              <div key={product.id} className="group bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-emerald-500/40 transition-all flex flex-col h-full shadow-lg">
                <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden">
                  <div className={`absolute inset-0 ${theme.bg} opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                  <div className={`transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 z-10 ${theme.color}`}>
                    {theme.icon}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold font-minecraft tracking-wide group-hover:text-emerald-400 transition-colors uppercase">{product.name}</h3>
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full border border-slate-800 uppercase tracking-widest text-slate-500 shrink-0 ml-2">{product.category}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mb-6 line-clamp-2 leading-relaxed h-8">{product.description}</p>
                  <div className="mt-auto pt-5 border-t border-slate-800/50 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1">Narxi:</p>
                      <p className="text-lg font-bold text-emerald-400 font-minecraft">{minPrice.toLocaleString()} UZS</p>
                    </div>
                    <button 
                      onClick={() => handlePurchaseClick(product)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-2 px-4 rounded-xl transition-all emerald-glow flex items-center space-x-2 uppercase tracking-widest"
                    >
                      <ShoppingCart size={14} />
                      <span>Sotib olish</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal - Animatsiya konteyneridan tashqariga chiqarildi (fixed inset-0 ekranni to'liq egallaydi) */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-6 overflow-hidden">
          {/* Backdrop - Viewport bo'yicha qat'iy */}
          <div 
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl animate-fade-in" 
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal Content Container */}
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[2rem] md:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] overflow-hidden animate-scale-in z-50">
            
            {/* Left Section: Info */}
            <div className="w-full md:w-2/5 bg-slate-950/40 p-6 md:p-10 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 shrink-0 overflow-y-auto custom-scrollbar">
               <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-6 mb-6">
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center ${getCategoryTheme(selectedProduct.category).bg} ${getCategoryTheme(selectedProduct.category).color} border border-white/5 shadow-2xl`}>
                    {getCategoryTheme(selectedProduct.category).icon}
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl md:text-3xl font-minecraft text-white uppercase tracking-widest leading-tight mb-1">{selectedProduct.name}</h2>
                    <span className="inline-block text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {selectedProduct.category}
                    </span>
                  </div>
               </div>
               
               <p className="text-slate-400 text-xs leading-relaxed mb-6 md:mb-10 opacity-80">{selectedProduct.description}</p>
               
               <div className="mt-auto bg-slate-900 border border-slate-800/50 p-5 rounded-3xl">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.3em] mb-2">Umumiy to'lov:</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl md:text-4xl font-minecraft text-emerald-400">{selectedTariff?.price.toLocaleString()}</span>
                    <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase">UZS</span>
                  </div>
               </div>
            </div>

            {/* Right Section: Form */}
            <div className="w-full md:w-3/5 flex flex-col overflow-y-auto custom-scrollbar bg-slate-900/50">
               <div className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md p-6 md:p-8 flex justify-between items-center border-b border-slate-800/50">
                  <div>
                    <h3 className="text-lg font-minecraft text-emerald-400 uppercase tracking-widest">Buyurtma berish</h3>
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Ma'lumotlarni tekshirib to'ldiring</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all group">
                     <X size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                  </button>
               </div>

               <div className="p-6 md:p-10 space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="flex items-center space-x-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] px-1">
                          <User size={12} className="text-emerald-500" />
                          <span>Minecraft Nickname</span>
                       </label>
                       <input 
                         type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-800 p-4 md:p-5 rounded-2xl focus:border-emerald-500 outline-none transition-all font-bold text-emerald-400 font-minecraft text-2xl tracking-[0.1em] placeholder:text-slate-800 shadow-inner"
                         placeholder="Steve_GG"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="flex items-center space-x-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] px-1">
                          <Send size={12} className="text-blue-400" />
                          <span>Telegram Username</span>
                       </label>
                       <input 
                         type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-800 p-4 md:p-5 rounded-2xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-200 text-sm shadow-inner"
                         placeholder="@username"
                       />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] px-1">Muddatni tanlang</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProduct.tariffs.map(t => (
                        <button
                          key={t.id} onClick={() => setSelectedTariff(t)}
                          className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                            selectedTariff?.id === t.id 
                            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                            : 'bg-slate-950 border-slate-800/50 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1 z-10">
                             <Clock size={12} className={selectedTariff?.id === t.id ? 'text-emerald-400' : 'text-slate-600'} />
                             <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedTariff?.id === t.id ? 'text-white' : 'text-slate-500'}`}>{t.name}</span>
                          </div>
                          <p className={`text-xl font-bold font-minecraft z-10 ${selectedTariff?.id === t.id ? 'text-emerald-400' : 'text-slate-400'}`}>{t.price.toLocaleString()} <span className="text-[10px]">UZS</span></p>
                          {selectedTariff?.id === t.id && <div className="absolute top-0 right-0 p-1 bg-emerald-500 text-white rounded-bl-lg"><CheckCircle2 size={10} /></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex items-start space-x-3">
                     <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={14} />
                     <p className="text-[9px] text-amber-200/60 font-bold uppercase leading-relaxed tracking-[0.1em]">
                       To'lov balansingizdan yechiladi. Buyurtma admin tomonidan tasdiqlanganidan so'ng faollashadi.
                     </p>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={confirmPurchase} 
                      disabled={!nickname || !contactInfo || !selectedTariff || !!buyingId} 
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:opacity-50 py-5 rounded-2xl font-bold transition-all emerald-glow flex items-center justify-center space-x-3 uppercase text-[11px] tracking-[0.2em] shadow-xl text-white active:scale-95 mb-8"
                    >
                      {buyingId ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          <span>Tasdiqlash va Xarid qilish</span>
                          <ChevronRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
