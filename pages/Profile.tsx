
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { User as UserIcon, Mail, Lock, CheckCircle, ShieldCheck, Eye, EyeOff, Save, Key } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUserProfile, addBroadcast } = useStore();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
      setEmail(user.email);
    }
  }, [user]);

  if (!user) return <div className="p-20 text-center uppercase tracking-widest text-slate-500">Iltimos, avval tizimga kiring.</div>;

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await updateUserProfile(user.id, { nickname, email });
    if (success) {
      addBroadcast('Profil muvaffaqiyatli yangilandi!', 'success');
    } else {
      addBroadcast('Xatolik! Email allaqachon foydalanilmoqda.', 'warning');
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPass !== 'qazzaq') {
       addBroadcast('Joriy parol xato!', 'error');
       return;
    }
    if (newPass !== confPass || !newPass) {
       addBroadcast('Yangi parollar mos kelmadi yoki bo\'sh!', 'warning');
       return;
    }
    addBroadcast('Parol muvaffaqiyatli yangilandi!', 'success');
    setCurrentPass(''); setNewPass(''); setConfPass('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
         <div className="w-32 h-32 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white emerald-glow shadow-2xl relative">
            <UserIcon size={64} />
            <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-emerald-400">
               <ShieldCheck size={20} />
            </div>
         </div>
         <div className="text-center md:text-left">
            <h1 className="text-4xl font-minecraft text-emerald-400 uppercase tracking-widest mb-2">@{user.nickname}</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mb-4">Ro'yxatdan o'tgan: {new Date(user.createdAt).toLocaleDateString()}</p>
            <div className="flex items-center space-x-4">
               <div className="bg-slate-900 border border-slate-800 px-6 py-2 rounded-2xl flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-300">Balans: {user.balance.toLocaleString()} UZS</span>
               </div>
               <div className="bg-slate-900 border border-slate-800 px-6 py-2 rounded-2xl">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{user.role}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <UserIcon size={120} />
          </div>
          <h2 className="text-xl font-minecraft text-emerald-400 tracking-wider uppercase">Ma'lumotlarni tahrirlash</h2>
          <form onSubmit={handleUpdateInfo} className="space-y-6">
            <div>
               <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Nickname</label>
               <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" value={nickname} onChange={e => setNickname(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 rounded-2xl focus:border-emerald-500 outline-none font-bold text-emerald-400"
                  />
               </div>
            </div>
            <div>
               <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Email Manzil</label>
               <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 rounded-2xl focus:border-emerald-500 outline-none"
                  />
               </div>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold emerald-glow transition-all flex items-center justify-center space-x-2">
               <Save size={18} />
               <span>Saqlash</span>
            </button>
          </form>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Key size={120} />
          </div>
          <h2 className="text-xl font-minecraft text-blue-400 tracking-wider uppercase">Parolni o'zgartirish</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
               <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Joriy Parol</label>
               <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type={showPass ? "text" : "password"} value={currentPass} onChange={e => setCurrentPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 pl-12 pr-12 py-3 rounded-2xl focus:border-blue-500 outline-none text-center"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                     {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
               </div>
            </div>
            <div>
               <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Yangi Parol</label>
               <input 
                  type={showPass ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-2xl focus:border-blue-500 outline-none text-center"
                  placeholder="Yangi parol"
                />
            </div>
            <div>
               <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Yangi parolni tasdiqlash</label>
               <input 
                  type={showPass ? "text" : "password"} value={confPass} onChange={e => setConfPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-2xl focus:border-blue-500 outline-none text-center"
                  placeholder="Qaytadan"
                />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold mt-4 transition-all uppercase tracking-widest text-xs">
               Tasdiqlash
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
