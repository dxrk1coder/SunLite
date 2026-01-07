import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  CheckSquare,
  Square,
  AlertCircle,
  Key,
  ChevronRight,
  Fingerprint,
} from 'lucide-react';

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
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isLogin && !agreed) {
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
        setErrorMsg(res.message || 'Email yoki parol noto‘g‘ri.');
      }
    } else {
      if (password !== confirmPassword) {
        setErrorMsg('Parollar mos kelmadi!');
        setLoading(false);
        return;
      }

      const res = await register(email, nickname, password);
      if (res.success) {
        addBroadcast("Ro‘yxatdan o‘tish muvaffaqiyatli!", 'success');
        setIsLogin(true);
        setAgreed(false);
      } else {
        setErrorMsg(res.message || 'Ro‘yxatdan o‘tishda xatolik.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-emerald-500/5 blur-[120px]" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[3.5rem] shadow-2xl z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-emerald-500 rounded-3xl flex items-center justify-center mb-6">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-minecraft text-emerald-400 tracking-widest uppercase">
            SUNLITE.GG
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-2">
            {isLogin ? 'Hisobga kirish' : "Ro‘yxatdan o‘tish"}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl mb-5 flex items-center space-x-3">
            <AlertCircle className="text-rose-500" size={18} />
            <p className="text-[10px] uppercase tracking-wider text-rose-200 font-bold">
              {errorMsg}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <Input icon={<User size={18} />} value={nickname} setValue={setNickname} placeholder="Gamer_Name" />
          )}

          <Input icon={<Mail size={18} />} value={email} setValue={setEmail} placeholder="Email manzil" type="email" />

          <PasswordInput
            value={password}
            setValue={setPassword}
            show={showPass}
            toggle={() => setShowPass(!showPass)}
          />

          {!isLogin && (
            <Input
              icon={<Key size={18} />}
              value={confirmPassword}
              setValue={setConfirmPassword}
              placeholder="Parolni takrorlang"
              type={showPass ? 'text' : 'password'}
            />
          )}

          {!isLogin && (
            <div
              onClick={() => setAgreed(prev => !prev)}
              className="flex items-start space-x-3 p-2 cursor-pointer select-none"
            >
              {agreed ? (
                <CheckSquare size={18} className="text-emerald-500" />
              ) : (
                <Square size={18} className="text-slate-600" />
              )}

              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Men saytning{' '}
                <a
                  href="https://docs.google.com/document/d/1-JjU97WU0KJ1wRVgFjrhHSfd4pyO8cHT_27XibObra0/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-emerald-500 hover:underline"
                >
                  foydalanish shartlariga
                </a>{' '}
                roziman
              </p>
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-3"
          >
            {loading ? '...' : isLogin ? 'KIRISH' : "RO‘YXAT"}
            <ChevronRight size={14} />
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setAgreed(false);
              setErrorMsg(null);
            }}
            className="text-emerald-400 text-[10px] uppercase tracking-widest hover:text-white"
          >
            {isLogin ? "Yangi hisob yaratish" : "Mavjud hisobga kirish"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Helpers ---------- */

const Input = ({ icon, value, setValue, placeholder, type = 'text' }: any) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
    <input
      type={type}
      required
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-950 border border-slate-800 pl-11 pr-4 py-4 rounded-2xl text-slate-300"
    />
  </div>
);

const PasswordInput = ({ value, setValue, show, toggle }: any) => (
  <div className="relative">
    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
    <input
      type={show ? 'text' : 'password'}
      required
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="Parol"
      className="w-full bg-slate-950 border border-slate-800 pl-11 pr-11 py-4 rounded-2xl text-slate-300"
    />
    <button type="button" onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2">
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);
