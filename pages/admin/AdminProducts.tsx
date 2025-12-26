
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category, Product, Tariff } from '../../types';
import { Plus, Trash2, Edit3, X, Crown, Coins, Package, Gavel, Eye, EyeOff, DatabaseZap } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, seedProducts, dbConnected, addBroadcast } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [adminPass, setAdminPass] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showPassModal, setShowPassModal] = useState<{ id: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    if (!window.confirm("Barcha namunaviy mahsulotlarni Supabase bazasiga yuklamoqchimisiz?")) return;
    setIsSeeding(true);
    await seedProducts();
    setIsSeeding(false);
  };

  const handleAddTariff = () => {
    if (!currentProduct) return;
    const tariffs = currentProduct.tariffs || [];
    if (tariffs.length >= 5) {
      addBroadcast('Maksimal 5 ta tarif qo\'shish mumkin', 'warning');
      return;
    }
    const newTariff: Tariff = {
      id: Math.random().toString(36).substr(2, 5),
      name: 'Yangi tarif',
      price: 0,
      duration: '30 kun'
    };
    setCurrentProduct({ ...currentProduct, tariffs: [...tariffs, newTariff] });
  };

  const handleUpdateTariff = (tid: string, fields: Partial<Tariff>) => {
    if (!currentProduct?.tariffs) return;
    const tariffs = currentProduct.tariffs.map(t => t.id === tid ? { ...t, ...fields } : t);
    setCurrentProduct({ ...currentProduct, tariffs });
  };

  const handleRemoveTariff = (tid: string) => {
    if (!currentProduct?.tariffs) return;
    setCurrentProduct({ ...currentProduct, tariffs: currentProduct.tariffs.filter(t => t.id !== tid) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct?.name || !currentProduct?.tariffs?.length) return;
    
    if (currentProduct.id) {
      updateProduct(currentProduct.id, currentProduct);
      addBroadcast('Mahsulot tahrirlandi', 'success');
    } else {
      addProduct(currentProduct as Omit<Product, 'id'>);
      addBroadcast('Yangi mahsulot qo\'shildi', 'success');
    }
    setIsEditing(false);
  };

  const confirmDelete = async () => {
    if (!showPassModal) return;
    const success = await deleteProduct(showPassModal.id, adminPass);
    if (success) {
      addBroadcast('Mahsulot o\'chirildi', 'success');
      setShowPassModal(null);
      setAdminPass('');
      setShowAdminPass(false);
    } else {
      addBroadcast('Parol xato!', 'warning');
    }
  };

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case Category.RANKS: return <Crown size={24} className="text-emerald-400" />;
      case Category.COINS: return <Coins size={24} className="text-amber-400" />;
      case Category.KEYS: return <Package size={24} className="text-blue-400" />;
      case Category.UNBAN: return <Gavel size={24} className="text-rose-500" />;
      default: return <Crown size={24} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-minecraft text-emerald-400">MAHSULOTLARNI BOSHQARISH</h2>
        <div className="flex items-center space-x-3">
          {dbConnected && (
             <button 
              onClick={handleSeed}
              disabled={isSeeding}
              className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all border border-blue-500/20"
            >
              {isSeeding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <DatabaseZap size={18} />}
              <span>Bazani to'ldirish</span>
            </button>
          )}
          <button 
            onClick={() => {
              setCurrentProduct({ name: '', description: '', category: Category.RANKS, active: true, tariffs: [], image: '' });
              setIsEditing(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all emerald-glow"
          >
            <Plus size={18} />
            <span>Yangi qo'shish</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-900 rounded-2xl">
                   {getCategoryIcon(p.category)}
                </div>
                <div className="flex space-x-1">
                   <button onClick={() => { setCurrentProduct(p); setIsEditing(true); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit3 size={18} /></button>
                   <button onClick={() => setShowPassModal({ id: p.id })} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1 uppercase font-minecraft tracking-wider">{p.name}</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">{p.category} • {p.tariffs.length} tarif</p>
              <div className="space-y-2 border-t border-slate-900 pt-4">
                {p.tariffs.slice(0, 3).map(t => (
                  <div key={t.id} className="text-[10px] flex justify-between text-slate-400 uppercase font-bold">
                    <span>{t.name}</span>
                    <span className="text-emerald-500">{t.price.toLocaleString()} UZS</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && currentProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-4xl p-8 rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-minecraft text-emerald-400 mb-8 uppercase">{currentProduct.id ? 'Tahrirlash' : 'Yangi Mahsulot'}</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Nomi</label>
                  <input 
                    type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none text-emerald-400 font-bold" required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Tavsif</label>
                  <textarea 
                    value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl h-32 focus:border-emerald-500 outline-none text-sm" required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Kategoriya</label>
                  <select 
                    value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value as any})}
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none uppercase font-bold text-xs"
                  >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest">Tariflar (Maks 5 ta)</label>
                   <button type="button" onClick={handleAddTariff} className="text-emerald-400 text-xs font-bold flex items-center space-x-1 hover:underline">
                      <Plus size={14} /> <span>Yangi tarif</span>
                   </button>
                </div>
                
                <div className="space-y-3">
                  {currentProduct.tariffs?.map((t, idx) => (
                    <div key={t.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 relative group/tariff">
                       <button type="button" onClick={() => handleRemoveTariff(t.id)} className="absolute -top-2 -right-2 p-1 bg-rose-600 rounded-full">
                          <X size={12} />
                       </button>
                       <div className="grid grid-cols-2 gap-2 mb-2">
                          <input 
                            placeholder="Nomi (mas: 1 oy)" value={t.name} onChange={e => handleUpdateTariff(t.id, {name: e.target.value})}
                            className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs outline-none focus:border-emerald-500"
                          />
                          <input 
                            placeholder="Muddati" value={t.duration} onChange={e => handleUpdateTariff(t.id, {duration: e.target.value})}
                            className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs outline-none focus:border-emerald-500"
                          />
                       </div>
                       <input 
                          type="number" placeholder="Narxi" value={t.price} onChange={e => handleUpdateTariff(t.id, {price: Number(e.target.value)})}
                          className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs outline-none font-bold text-emerald-400"
                        />
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 flex justify-end space-x-4 pt-8 border-t border-slate-800">
                <button type="button" onClick={() => setIsEditing(false)} className="px-10 py-4 rounded-2xl border border-slate-800 hover:bg-slate-800 transition-all font-bold">BEKOR QILISH</button>
                <button type="submit" className="px-10 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold emerald-glow">SAQLASH</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPassModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95" onClick={() => setShowPassModal(null)} />
          <div className="relative bg-slate-900 border border-rose-500/30 p-10 rounded-[2.5rem] max-w-sm w-full text-center">
            <Trash2 className="mx-auto text-rose-500 mb-6" size={56} />
            <h3 className="text-xl font-bold mb-2 uppercase">O'CHIRISHNI TASDIQLANG</h3>
            <p className="text-slate-500 text-xs mb-8">Ma'lumot butunlay o'chiriladi. Admin parolini kiriting.</p>
            
            <div className="relative mb-6">
               <input 
                type={showAdminPass ? "text" : "password"} value={adminPass} onChange={e => setAdminPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl focus:border-rose-500 outline-none text-center font-bold"
                placeholder="Admin paroli"
                autoFocus
              />
              <button 
                type="button" 
                onClick={() => setShowAdminPass(!showAdminPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500"
              >
                {showAdminPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex space-x-3">
              <button onClick={() => setShowPassModal(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold">YO'Q</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-rose-600 rounded-2xl font-bold">HA</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
