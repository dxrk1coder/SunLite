
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Wallet, CreditCard, Upload, Send, AlertCircle, Clock, CheckCircle, XCircle, Gem } from 'lucide-react';
import { PaymentStatus } from '../types';

export const Balance: React.FC = () => {
  const { user, config, submitPayment, payments, addBroadcast } = useStore();
  const [amount, setAmount] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || amount < 5000) {
      addBroadcast('Kamida 5,000 UZS kiriting va chek rasmini yuklang', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitPayment(amount, file);
      setAmount(0);
      setFile(null);
      addBroadcast('To\'lov ko\'rib chiqishga yuborildi!', 'success');
    } catch (err) {
      addBroadcast('Xatolik yuz berdi', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <div className="p-20 text-center uppercase font-minecraft text-slate-500 text-2xl">Iltimos, avval tizimga kiring.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 animate-fade-in space-y-12">
      {/* Current Balance Display */}
      <section className="bg-emerald-600 rounded-[3rem] p-10 relative overflow-hidden emerald-glow-strong">
        <div className="absolute right-0 top-0 p-10 opacity-10 rotate-12">
           <Gem size={200} className="text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div>
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-[0.3em] mb-2">Sizning balansingiz</p>
              <h2 className="text-5xl md:text-7xl font-minecraft text-white tracking-wider">
                {user.balance.toLocaleString()} <span className="text-emerald-200">UZS</span>
              </h2>
           </div>
           <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-center min-w-[200px]">
              <Wallet size={32} className="mx-auto text-white mb-2" />
              <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Hamyon holati</p>
              <p className="text-white font-bold">Faol</p>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Top-up Form */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-minecraft text-emerald-400 mb-2 uppercase tracking-widest">BALANSNI TO'LDIRISH</h1>
            <p className="text-slate-500 font-medium text-sm">To'lov qiling va chekni yuklang</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center space-x-4 p-6 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                 <CreditCard className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">To'lov uchun karta:</p>
                <p className="text-lg font-bold text-emerald-400 font-mono tracking-tighter">{config.cardDetails}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">To'lov summasi (UZS)</label>
                <input 
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl focus:outline-none focus:border-emerald-500 text-2xl font-bold text-emerald-400 font-minecraft tracking-widest"
                  placeholder="10000"
                  min="5000"
                />
                <p className="text-[10px] text-slate-600 mt-3 font-bold uppercase italic">Kamida: 5,000 UZS</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">To'lov cheki (Screenshot)</label>
                <label className="w-full flex flex-col items-center px-4 py-10 bg-slate-950 text-slate-500 rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group overflow-hidden">
                  {file ? (
                    <div className="text-center animate-scale-in">
                      <CheckCircle className="mx-auto text-emerald-500 mb-3" size={32} />
                      <p className="text-sm font-bold text-slate-200">{file.name}</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-3 group-hover:text-emerald-400 transition-colors" size={32} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Rasm yuklash (JPG/PNG)</p>
                    </>
                  )}
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 py-5 rounded-2xl font-bold transition-all emerald-glow flex items-center justify-center space-x-3 uppercase tracking-widest text-sm"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    <span>Yuborish</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Payment History */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-minecraft text-slate-300 mb-2 uppercase tracking-widest">TO'LOVLAR TARIXI</h2>
            <p className="text-slate-500 font-medium text-sm">Oxirgi tranzaksiyalaringiz</p>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {payments.filter(p => p.userId === user.id).length === 0 && (
              <div className="text-center py-24 bg-slate-900/30 rounded-[2.5rem] border border-slate-800">
                <Clock className="mx-auto text-slate-800 mb-4" size={64} />
                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Hozircha tranzaksiyalar mavjud emas</p>
              </div>
            )}
            
            {payments.filter(p => p.userId === user.id).map(p => (
              <div key={p.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center justify-between hover:border-slate-700 transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-2xl ${
                    p.status === PaymentStatus.APPROVED ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    p.status === PaymentStatus.REJECTED ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                    'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {p.status === PaymentStatus.APPROVED ? <CheckCircle size={24} /> :
                     p.status === PaymentStatus.REJECTED ? <XCircle size={24} /> :
                     <Clock size={24} />}
                  </div>
                  <div>
                    <p className="text-xl font-bold font-minecraft text-white tracking-widest">{p.amount.toLocaleString()} UZS</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="text-right">
                   <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border ${
                    p.status === PaymentStatus.APPROVED ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' :
                    p.status === PaymentStatus.REJECTED ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' :
                    'bg-amber-500/20 text-amber-500 border-amber-500/30'
                  }`}>
                    {p.status}
                  </span>
                  {p.rejectionReason && (
                    <p className="text-[9px] text-rose-400 mt-2 font-bold uppercase max-w-[120px] truncate" title={p.rejectionReason}>
                      {p.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
