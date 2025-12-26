
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { ShoppingBag, Check, X, Clock, Trash2, User, MessageSquare } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, processOrder, deleteOrder, addBroadcast } = useStore();
  const [adminPass, setAdminPass] = useState('');
  const [showPassModal, setShowPassModal] = useState<string | null>(null);
  const [confirmProcess, setConfirmProcess] = useState<{ id: string, status: OrderStatus } | null>(null);

  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING);
  const otherOrders = orders.filter(o => o.status !== OrderStatus.PENDING);

  const handleProcess = async () => {
    if (!confirmProcess) return;
    await processOrder(confirmProcess.id, confirmProcess.status);
    addBroadcast(`Buyurtma ${confirmProcess.status === OrderStatus.COMPLETED ? 'bajarildi' : 'bekor qilindi'}!`, 'success');
    setConfirmProcess(null);
  };

  const confirmDelete = async () => {
    if (!showPassModal) return;
    const success = await deleteOrder(showPassModal, adminPass);
    if (success) {
      addBroadcast('O\'chirildi', 'success');
      setShowPassModal(null);
      setAdminPass('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-minecraft text-emerald-400 uppercase tracking-widest">Buyurtmalar</h2>
        <span className="text-[10px] bg-slate-950 px-4 py-1.5 rounded-full border border-slate-800 font-bold text-slate-500 uppercase">
          {pendingOrders.length} faol
        </span>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Yangi buyurtmalar</h3>
        <div className="grid grid-cols-1 gap-4">
          {pendingOrders.map(o => (
            <div key={o.id} className="bg-slate-950 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-500/20 transition-all">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                   <ShoppingBag size={28} className="text-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center space-x-4 mb-1">
                    <div className="flex items-center space-x-1 text-emerald-400">
                      <User size={12} />
                      <span className="font-bold text-sm tracking-wider">@{o.userNickname}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded text-[10px] font-bold">
                       <MessageSquare size={10} />
                       <span>{o.contactInfo}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase">{o.productName}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{o.tariffName} • {o.price.toLocaleString()} UZS</p>
                </div>
              </div>
              <div className="flex space-x-3">
                 <button onClick={() => setConfirmProcess({ id: o.id, status: OrderStatus.COMPLETED })} className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white p-4 rounded-2xl transition-all border border-emerald-500/20"><Check size={24} /></button>
                 <button onClick={() => setConfirmProcess({ id: o.id, status: OrderStatus.CANCELLED })} className="bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white p-4 rounded-2xl transition-all border border-rose-500/20"><X size={24} /></button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-16">Tarix</h3>
        <div className="bg-slate-950 border border-slate-800 rounded-[2rem] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase tracking-widest text-slate-500">
                <th className="p-5 px-8">Buyurtma</th>
                <th className="p-5 px-8">User / Aloqa</th>
                <th className="p-5 px-8 text-center">Status</th>
                <th className="p-5 px-8 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {otherOrders.map(o => (
                <tr key={o.id} className="border-b border-slate-900/50 group hover:bg-slate-900/30 transition-colors">
                  <td className="p-5 px-8"><p className="font-bold text-slate-300 uppercase">{o.productName}</p></td>
                  <td className="p-5 px-8">
                    <p className="font-bold text-emerald-500">@{o.userNickname}</p>
                    <p className="text-[10px] text-slate-500">{o.contactInfo}</p>
                  </td>
                  <td className="p-5 px-8 text-center">
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase border ${o.status === OrderStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{o.status}</span>
                  </td>
                  <td className="p-5 px-8 text-right">
                    <button onClick={() => setShowPassModal(o.id)} className="opacity-0 group-hover:opacity-100 p-2 text-rose-500"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirmProcess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setConfirmProcess(null)} />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-sm p-10 rounded-[2.5rem] shadow-2xl text-center animate-scale-in">
            <h2 className="text-xl font-bold mb-8 uppercase">Tasdiqlaysizmi?</h2>
            <div className="flex gap-4">
               <button onClick={() => setConfirmProcess(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold">Yo'q</button>
               <button onClick={handleProcess} className={`flex-1 py-4 rounded-2xl font-bold ${confirmProcess.status === OrderStatus.COMPLETED ? 'bg-emerald-600' : 'bg-rose-600'}`}>Ha</button>
            </div>
          </div>
        </div>
      )}

      {showPassModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95" onClick={() => setShowPassModal(null)} />
          <div className="relative bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] max-w-sm w-full text-center animate-scale-in">
            <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-6 text-center outline-none" placeholder="Admin paroli" autoFocus />
            <div className="flex space-x-3"><button onClick={() => setShowPassModal(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold">BEKOR</button><button onClick={confirmDelete} className="flex-1 py-4 bg-rose-600 rounded-2xl font-bold">O'CHIRISH</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
