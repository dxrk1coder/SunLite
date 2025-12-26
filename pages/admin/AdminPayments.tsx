
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentStatus } from '../../types';
import { Check, X, Eye, Clock, User, Trash2, ShieldAlert, Mail } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { payments, processPayment, deletePayment, addBroadcast } = useStore();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [showPassModal, setShowPassModal] = useState<string | null>(null);
  const [adminPass, setAdminPass] = useState('');

  const pendingPayments = payments.filter(p => p.status === PaymentStatus.PENDING);
  const otherPayments = payments.filter(p => p.status !== PaymentStatus.PENDING);

  const handleApprove = async (id: string) => {
    await processPayment(id, PaymentStatus.APPROVED);
    addBroadcast('To\'lov tasdiqlandi!', 'success');
    setIsApproving(null);
  };

  const handleReject = async () => {
    if (!selectedPayment || !rejectReason) return;
    await processPayment(selectedPayment.id, PaymentStatus.REJECTED, rejectReason);
    addBroadcast('To\'lov rad etildi.', 'info');
    setIsRejecting(false);
    setRejectReason('');
    setSelectedPayment(null);
  };

  const confirmDelete = async () => {
    if (!showPassModal) return;
    const success = await deletePayment(showPassModal, adminPass);
    if (success) {
      addBroadcast('Tranzaksiya o\'chirildi', 'success');
      setShowPassModal(null);
      setAdminPass('');
    } else {
      addBroadcast('Parol xato!', 'warning');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-minecraft text-emerald-400 uppercase">To'lovlar boshqaruvi</h2>
        <div className="flex space-x-2">
          <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/20 uppercase">
            {pendingPayments.length} kutilmoqda
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Kutilayotganlar</h3>
        {pendingPayments.length === 0 && (
          <div className="text-center py-20 bg-slate-950/50 rounded-3xl border border-slate-800/50">
            <Clock className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 text-sm italic">Hozircha yangi to'lovlar mavjud emas</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4">
          {pendingPayments.map(p => (
            <div key={p.id} className="bg-slate-950 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden group/receipt relative">
                  <img src={p.receiptUrl} alt="Chek" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => window.open(p.receiptUrl, '_blank')}
                    className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/receipt:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Eye size={20} className="text-emerald-400" />
                  </button>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Mail size={12} className="text-emerald-500" />
                    <p className="font-bold text-slate-200 text-sm">{p.userEmail}</p>
                  </div>
                  <p className="text-2xl font-bold font-minecraft text-emerald-400">{p.amount.toLocaleString()} UZS</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-1">Sana: {new Date(p.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setIsApproving(p.id)}
                  className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white p-4 rounded-2xl transition-all border border-emerald-500/20"
                >
                  <Check size={24} />
                </button>
                <button 
                  onClick={() => { setSelectedPayment(p); setIsRejecting(true); }}
                  className="bg-rose-600/20 hover:bg-rose-600 text-rose-500 hover:text-white p-4 rounded-2xl transition-all border border-rose-500/20"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-16">Barcha tranzaksiyalar</h3>
        <div className="bg-slate-950 border border-slate-800 rounded-[2rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-widest">
                  <th className="py-5 px-6">Email</th>
                  <th className="py-5 px-6">Summa</th>
                  <th className="py-5 px-6">Sana</th>
                  <th className="py-5 px-6 text-center">Status</th>
                  <th className="py-5 px-6 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {otherPayments.map(p => (
                  <tr key={p.id} className="border-b border-slate-900/50 hover:bg-slate-900/20 transition-colors group">
                    <td className="py-4 px-6 font-medium text-slate-300">{p.userEmail}</td>
                    <td className="py-4 px-6 font-bold text-emerald-400">{p.amount.toLocaleString()} UZS</td>
                    <td className="py-4 px-6 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase border ${
                        p.status === PaymentStatus.APPROVED ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => window.open(p.receiptUrl, '_blank')} className="p-2 text-slate-500 hover:text-emerald-400"><Eye size={14}/></button>
                        <button onClick={() => setShowPassModal(p.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approve Confirmation */}
      {isApproving && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsApproving(null)} />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl text-center">
            <Check size={48} className="mx-auto text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Tasdiqlash</h2>
            <p className="text-slate-400 text-sm mb-8">Foydalanuvchi balansi oshiriladi.</p>
            <div className="flex gap-4">
               <button onClick={() => setIsApproving(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold">Bekor</button>
               <button onClick={() => handleApprove(isApproving)} className="flex-1 py-4 bg-emerald-600 rounded-2xl font-bold emerald-glow">Tasdiqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejecting && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsRejecting(false)} />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl">
            <ShieldAlert size={48} className="text-rose-500 mb-4" />
            <h2 className="text-2xl font-minecraft text-rose-500 mb-2 uppercase">Rad Etish</h2>
            <p className="text-slate-400 text-sm mb-6">Sababni ko'rsating:</p>
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-rose-500 outline-none min-h-[120px] mb-8 text-sm"
              placeholder="Masalan: Chek yaroqsiz..."
            />
            <div className="flex space-x-4">
              <button onClick={() => setIsRejecting(false)} className="flex-1 py-4 rounded-2xl font-bold bg-slate-800">Bekor</button>
              <button onClick={handleReject} disabled={!rejectReason} className="flex-1 bg-rose-600 hover:bg-rose-500 py-4 rounded-2xl font-bold transition-all disabled:opacity-50">Rad Etish</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showPassModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" onClick={() => setShowPassModal(null)} />
          <div className="relative bg-slate-900 border border-rose-500/30 p-10 rounded-[2.5rem] max-w-sm w-full text-center">
            <Trash2 className="mx-auto text-rose-500 mb-6" size={48} />
            <h3 className="text-xl font-bold mb-8 uppercase">O'CHIRISH</h3>
            <input 
              type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-6 text-center font-bold"
              placeholder="Admin paroli"
              autoFocus
            />
            <div className="flex space-x-3">
              <button onClick={() => setShowPassModal(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold">Yo'q</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-rose-600 rounded-2xl font-bold">Ha</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
