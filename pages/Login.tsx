
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, ShieldCheck, Eye, EyeOff, User, ExternalLink, CheckSquare, Square, AlertCircle, HelpCircle, X, Settings2, Globe, Copy, Check, Info, ShieldAlert, MonitorCheck, Key, Rocket, ExternalLink as LinkIcon, Fingerprint, Zap, Layout } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register, googleLogin, addBroadcast, user } = useStore();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showGoogleHelp, setShowGoogleHelp] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
    addBroadcast('Nusxalandi!', 'info');
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await googleLogin();
    } catch (err: any) {
      console.error("Google Auth Full Error:", err);
      setErrorMsg('Google Login (403): Kirish taqiqlandi. Quyidagi sozlamalarni tekshiring.');
      setShowGoogleHelp(true);
    } finally {
      setLoading(false);
    }
  };

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

  const currentOrigin = window.location.origin;
  const redirectUri = "https://oylhpwsgifvbpgvitnqq.supabase.co/auth/v1/callback";

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden animate-scale-in">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />
        
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 emerald-glow transform hover:rotate-6 transition-transform">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-minecraft text-emerald-400 tracking-widest uppercase">SUNLITE.GG</h2>
          <p className="text-slate-500 mt-2 uppercase text-[9px] font-bold tracking-[0.3em]">{isLogin ? 'Tizimga kirish' : 'Gamer yaratish'}</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl animate-shake">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-rose-500 shrink-0" size={18} />
              <div className="space-y-2">
                <p className="text-[10px] text-rose-200 font-bold uppercase tracking-wider leading-relaxed">{errorMsg}</p>
                <button 
                  onClick={() => setShowGoogleHelp(true)} 
                  className="flex items-center space-x-2 text-[9px] text-emerald-400 underline uppercase font-bold hover:text-emerald-300 transition-colors"
                >
                  <Settings2 size={12} />
                  <span>Google 403 Xatosini Tuzatish</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {showGoogleHelp && (
          <div className="bg-slate-950 border border-emerald-500/30 p-6 rounded-3xl space-y-5 animate-fade-in relative shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowGoogleHelp(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={16}/></button>
            <div className="flex items-center space-x-3 text-emerald-400 mb-2">
               <ShieldAlert size={20} />
               <h4 className="text-xs font-bold uppercase tracking-widest">Vercel & Google Setup:</h4>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                 <p className="text-[10px] text-blue-300 font-bold uppercase leading-relaxed mb-2">Vercel Domeningiz:</p>
                 <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl gap-2">
                    <code className="text-[8px] text-blue-400 font-mono break-all leading-tight">{currentOrigin}</code>
                    <button onClick={() => copyToClipboard(currentOrigin, 'origin')} className="text-emerald-500 shrink-0 hover:scale-110">
                       {copied === 'origin' ? <Check size={14}/> : <Copy size={14}/>}
                    </button>
                 </div>
                 <p className="text-[8px] text-slate-500 mt-2 uppercase font-medium">1. Google Console -> Credentials -> Origins bo'limiga qo'shing.</p>
                 <p className="text-[8px] text-slate-500 mt-1 uppercase font-medium">2. Supabase -> Auth -> Redirect URLs bo'limiga qo'shing.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                   <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-[10px] font-bold">2</div>
                   <p className="text-[9px] text-slate-400 font-bold uppercase italic">Authorized redirect URIs:</p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-3 rounded-xl flex items-center justify-between gap-2">
                   <code className="text-[8px] text-emerald-400 font-mono break-all leading-tight">{redirectUri}</code>
                   <button onClick={() => copyToClipboard(redirectUri, 'red')} className="text-emerald-500 shrink-0">
                      {copied === 'red' ? <Check size={14}/> : <Copy size={14}/>}
                   </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                   <div className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center text-amber-500 text-[10px] font-bold">3</div>
                   <p className="text-[9px] text-slate-400 font-bold uppercase italic">API Check:</p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-4 rounded-xl flex items-start space-x-3">
                   <Zap className="text-amber-500 shrink-0" size={18} />
                   <p className="text-[9px] text-slate-300 font-medium leading-relaxed uppercase">
                     Google Console-da **"People API"** yoqilganligiga 100% ishonch hosil qiling.
                   </p>
                </div>
              </div>

              <button onClick={() => setShowGoogleHelp(false)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg hover:bg-emerald-500 transition-all">
                Hammasi Tayyor
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" required value={nickname} onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-bold text-emerald-400 font-minecraft text-xl tracking-widest"
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
               <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                 Men saytning <a href="https://docs.google.com/document/d/1-JjU97WU0KJ1wRVgFjrhHSfd4pyO8cHT_27XibObra0/edit?usp=sharing" target="_blank" className="text-emerald-500 hover:underline">foydalanish shartlariga <LinkIcon size={8} className="inline ml-1"/></a> roziman.
               </p>
            </div>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all emerald-glow flex items-center justify-center space-x-3 uppercase tracking-widest text-xs shadow-xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                <span>{isLogin ? 'KIRISH' : "RO'YXATDAN O'TISH"}</span>
              </>
            )}
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800/50"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.4em]">
            <span className="bg-slate-900 px-4 text-slate-600">YOKI</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-white text-slate-900 hover:bg-slate-100 py-3 rounded-full font-bold flex items-center justify-center space-x-3 transition-all shadow-md active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            <span className="text-[11px] uppercase font-bold tracking-widest">Google bilan davom etish</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail(''); setPassword(''); setConfirmPassword(''); setNickname('');
              setErrorMsg(null);
              setShowGoogleHelp(false);
            }}
            className="text-emerald-50 text-[9px] font-bold uppercase tracking-[0.2em] hover:text-emerald-400 transition-colors bg-slate-800/30 px-6 py-2.5 rounded-full border border-slate-800/50"
          >
            {isLogin ? "Hali hisobingiz yo'qmi? Yaratish" : "Hisobingiz bormi? Kirish"}
          </button>
        </div>
      </div>
    </div>
  );
};
