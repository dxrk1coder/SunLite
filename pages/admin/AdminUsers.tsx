
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { User as UserIcon, Trash2, Wallet, ShieldCheck, Mail, Eye, EyeOff, Plus, X, UserPlus, Shield, Edit3, Lock, Save } from 'lucide-react';
import { UserRole, User } from '../../types';

export const AdminUsers: React.FC = () => {
  const { users, deleteUser, adminAddUser, adminUpdateUser, addBroadcast } = useStore();
  const [adminPass, setAdminPass] = useState('');
  const [showPassModal, setShowPassModal] = useState<string | null>(null);
  const [showAdminPass, setShowAdminPass] = useState(false);
  
  // Create User State
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ 
    email: '', nickname: '', role: UserRole.USER, balance: 0, 
    password: '', confirmPassword: '' 
  });

  // Edit User State
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.nickname || !newUser.password) return;
    if (newUser.password !== newUser.confirmPassword) {
      addBroadcast('Parollar mos kelmadi!', 'warning');
      return;
    }

    const { confirmPassword, password, ...userData } = newUser;
    await adminAddUser(userData, password);
    addBroadcast(`${newUser.nickname} muvaffaqiyatli qo'shildi!`, 'success');
    setIsAdding(false);
    setNewUser({ email: '', nickname: '', role: UserRole.USER, balance: 0, password: '', confirmPassword: '' });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    await adminUpdateUser(editingUser.id, editingUser);
    addBroadcast('Foydalanuvchi ma\'lumotlari yangilandi', 'success');
    setEditingUser(null);
  };

  const confirmDelete = async () => {
    if (!showPassModal) return;
    const success = await deleteUser(showPassModal, adminPass);
    if (success) {
      addBroadcast('Foydalanuvchi o\'chirildi', 'success');
      setShowPassModal(null);
      setAdminPass('');
      setShowAdminPass(false);
    } else {
      addBroadcast('Parol xato!', 'warning');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-minecraft text-emerald-400 uppercase tracking-widest">Foydalanuvchilar</h2>
        <div className="flex items-center space-x-4">
          <span className="text-[10px] bg-slate-950 px-4 py-1.5 rounded-full border border-slate-800 font-bold text-slate-500 uppercase">
            {users.length} jami
          </span>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all emerald-glow"
          >
            <UserPlus size={18} />
            <span>Yangi User</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase tracking-widest text-slate-500">
                <th className="p-6 px-8">Foydalanuvchi</th>
                <th className="p-6 px-8">Email</th>
                <th className="p-6 px-8 text-center">Balans</th>
                <th className="p-6 px-8 text-center">Rol</th>
                <th className="p-6 px-8 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium">
              {users.map(u => (
                <tr key={u.id} className="border-b border-slate-900/50 hover:bg-slate-900/30 transition-colors group">
                  <td className="p-6 px-8">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                           {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full object-cover" /> : <UserIcon size={18} className="text-slate-500" />}
                        </div>
                        <span className="font-bold text-slate-200 tracking-wider">@{u.nickname}</span>
                     </div>
                  </td>
                  <td className="p-6 px-8">
                    <div className="flex items-center space-x-2 text-slate-500">
                       <Mail size={14} />
                       <span>{u.email}</span>
                    </div>
                  </td>
                  <td className="p-6 px-8 text-center">
                    <div className="flex items-center justify-center space-x-2 font-bold text-emerald-400 font-minecraft text-lg">
                       <Wallet size={16} />
                       <span>{u.balance.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-6 px-8 text-center">
                     <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase border ${
                       u.role === UserRole.ADMIN ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                     }`}>
                        {u.role}
                     </span>
                  </td>
                  <td className="p-6 px-8 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setEditingUser({ ...u })}
                        className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      {u.role !== UserRole.ADMIN && (
                        <button 
                          onClick={() => setShowPassModal(u.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsAdding(false)} />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-lg p-10 rounded-[2.5rem] shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
             <h2 className="text-2xl font-minecraft text-emerald-400 mb-8 uppercase tracking-widest">YANGI FOYDALANUVCHI</h2>
             <form onSubmit={handleAddUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nickname</label>
                    <input 
                      type="text" required value={newUser.nickname} onChange={e => setNewUser({...newUser, nickname: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none font-bold text-emerald-400"
                      placeholder="GamerName"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
                    <input 
                      type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none"
                      placeholder="user@mail.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Rol</label>
                    <select 
                      value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none font-bold text-xs"
                    >
                       <option value={UserRole.USER}>USER</option>
                       <option value={UserRole.ADMIN}>ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Balans</label>
                    <input 
                      type="number" value={newUser.balance} onChange={e => setNewUser({...newUser, balance: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none font-bold text-emerald-400"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Yangi Parol</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                       <input 
                        type={showAdminPass ? "text" : "password"} required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 rounded-xl focus:border-emerald-500 outline-none font-bold tracking-widest"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tasdiqlash</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                       <input 
                        type={showAdminPass ? "text" : "password"} required value={newUser.confirmPassword} onChange={e => setNewUser({...newUser, confirmPassword: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 rounded-xl focus:border-emerald-500 outline-none font-bold tracking-widest"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button type="button" onClick={() => setShowAdminPass(!showAdminPass)} className="text-[10px] text-slate-500 uppercase font-bold hover:text-emerald-500 transition-colors flex items-center space-x-2">
                     {showAdminPass ? <EyeOff size={12}/> : <Eye size={12}/>}
                     <span>Parollarni ko'rish</span>
                  </button>
                </div>

                <div className="flex gap-4 pt-6">
                   <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold uppercase tracking-widest text-xs">Bekor qilish</button>
                   <button type="submit" className="flex-1 py-4 bg-emerald-600 rounded-2xl font-bold emerald-glow uppercase tracking-widest text-xs">Yaratish</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setEditingUser(null)} />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-lg p-10 rounded-[2.5rem] shadow-2xl animate-scale-in">
             <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
                   <UserIcon size={32} />
                </div>
                <h2 className="text-2xl font-minecraft text-emerald-400 uppercase tracking-widest">USERNI TAHRIRLASH</h2>
             </div>

             <form onSubmit={handleUpdateUser} className="space-y-6">
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nickname</label>
                   <input 
                    type="text" required value={editingUser.nickname} onChange={e => setEditingUser({...editingUser, nickname: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none font-bold text-emerald-400"
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
                   <input 
                    type="email" readOnly value={editingUser.email}
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl opacity-50 cursor-not-allowed outline-none"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Rol</label>
                    <select 
                      value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none font-bold text-xs"
                    >
                       <option value={UserRole.USER}>USER</option>
                       <option value={UserRole.ADMIN}>ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Balans (UZS)</label>
                    <input 
                      type="number" value={editingUser.balance} onChange={e => setEditingUser({...editingUser, balance: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none font-bold text-emerald-400"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                   <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold uppercase tracking-widest text-xs">Bekor qilish</button>
                   <button type="submit" className="flex-1 py-4 bg-emerald-600 rounded-2xl font-bold emerald-glow uppercase tracking-widest text-xs flex items-center justify-center space-x-2">
                      <Save size={16} />
                      <span>Saqlash</span>
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" onClick={() => setShowPassModal(null)} />
          <div className="relative bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] max-w-sm w-full text-center">
            <Trash2 className="mx-auto text-rose-500 mb-6" size={56} />
            <h3 className="text-xl font-bold mb-2 uppercase">FOYDALANUVCHINI O'CHIRISH</h3>
            <p className="text-slate-500 text-xs mb-8 leading-relaxed px-4">Diqqat! Ushbu foydalanuvchi va barcha tranzaksiyalari butunlay o'chib ketadi. Admin parolini kiriting.</p>
            
            <div className="relative mb-6">
               <input 
                type={showAdminPass ? "text" : "password"} value={adminPass} onChange={e => setAdminPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl focus:border-rose-500 outline-none text-center font-bold text-lg"
                placeholder="Admin paroli"
                autoFocus
              />
              <button 
                type="button" 
                onClick={() => setShowAdminPass(!showAdminPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500"
              >
                {showAdminPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex space-x-3">
              <button onClick={() => setShowPassModal(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold">BEKOR QILISH</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-rose-600 rounded-2xl font-bold">TASDIQLASH</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
