
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, ShieldCheck, Eye, EyeOff, User, CheckSquare, Square, AlertCircle, Key, ChevronRight, Fingerprint } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register, addBroadcast, user } = useStore();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (!agreed && !isLogin) {
      setErrorMsg('Iltimos, foydalanish shartlariga rozilik bildiring!');
      return;
    }

    setLoading(true);
    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        addBroadcast('Xush kelibsiz!', 'success');
        navigate('/');
      } else {
        setErrorMsg(res.message || 'Email yoki parol xato kiritildi.');
      }
    } else {
      if (password !== confirmPassword) {
        setErrorMsg('Parollar mos kelmadi!');
        setLoading(false);
        return;
      }
      const res = await register(email, nickname, password);
      if (res.success) {
        addBroadcast("Tabriklaymiz! Endi tizimga kirishingiz mumkin.", 'success');
        setIsLogin(true);
      } else {
        setErrorMsg(res.message || "Xatolik yuz berdi.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative z-10 animate-scale-in">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 emerald-glow transform hover:rotate-6 transition-transform shadow-2xl border-4 border-emerald-400/20">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-minecraft text-emerald-400 tracking-widest uppercase mb-2">SUNLITE.GG</h2>
          <p className="text-slate-500 uppercase text-[10px] font-bold tracking-[0.4em]">
            {isLogin ? 'Hisobga kirish' : 'Gamer yaratish'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl animate-shake flex items-center space-x-3">
            <AlertCircle className="text-rose-500 shrink-0" size={18} />
            <p className="text-[10px] text-rose-200 font-bold uppercase tracking-wider">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" required value={nickname} onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-bold text-emerald-400 font-minecraft text-2xl tracking-widest placeholder:text-slate-800"
                  placeholder="Gamer_Name"
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-300"
                placeholder="Email manzilingiz"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 pl-11 pr-11 py-4 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-300 tracking-widest"
                placeholder="Parolingiz"
              />
              <button 
                type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-500 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative group animate-fade-in">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type={showPass ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-300 tracking-widest"
                  placeholder="Parolni takrorlang"
                />
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="flex items-start space-x-3 p-2 group cursor-pointer" onClick={() => setAgreed(!agreed)}>
               {agreed ? <CheckSquare className="text-emerald-500 shrink-0" size={18}/> : <Square className="text-slate-700 shrink-0" size={18}/>}
               <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                 Men saytning <span className="text-emerald-500 hover:underline">foydalanish shartlariga</span> roziman.
               </p>
            </div>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white py-5 rounded-2xl font-bold transition-all emerald-glow flex items-center justify-center space-x-3 uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                <span>{isLogin ? 'TIZIMGA KIRISH' : "RO'YXATDAN O'TISH"}</span>
                <ChevronRight size={14} className="opacity-50" />
              </>
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-slate-800/50 flex flex-col items-center space-y-4">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            {isLogin ? "Hali hisobingiz yo'qmi?" : "Hisobingiz bormi?"}
          </p>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail(''); setPassword(''); setConfirmPassword(''); setNickname('');
              setErrorMsg(null);
            }}
            className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center space-x-2"
          >
            <span>{isLogin ? "Yangi hisob yaratish" : "Mavjud hisobga kirish"}</span>
            <Fingerprint size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
