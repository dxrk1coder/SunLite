
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { History, Trash2, Clock, Terminal, Eye, EyeOff } from 'lucide-react';

export const AdminLogs: React.FC = () => {
  const { logs, deleteLog, addBroadcast } = useStore();
  const [adminPass, setAdminPass] = useState('');
  const [showPassModal, setShowPassModal] = useState<string | null>(null);
  const [showAdminPass, setShowAdminPass] = useState(false);

  const confirmDelete = async () => {
    if (!showPassModal) return;
    const success = await deleteLog(showPassModal, adminPass);
    if (success) {
      addBroadcast('Log o\'chirildi', 'success');
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
        <h2 className="text-2xl font-minecraft text-emerald-400 uppercase tracking-wider">Tizim loglari</h2>
        <div className="p-2 bg-slate-950 rounded-lg text-[9px] text-slate-500 font-mono border border-slate-800">
           DB STATUS: {logs.length} / 100 entries
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase tracking-widest text-slate-500">
                <th className="p-5 px-8">Vaqt</th>
                <th className="p-5 px-8">Admin</th>
                <th className="p-5 px-8">Amal</th>
                <th className="p-5 px-8">Tafsilotlar</th>
                <th className="p-5 px-8 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-mono">
              {logs.map(log => (
                <tr key={log.id} className="border-b border-slate-900/50 hover:bg-slate-900/30 transition-colors group">
                  <td className="p-5 px-8 text-slate-500 whitespace-nowrap">
                     {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-5 px-8">
                    <span className="text-emerald-500 font-bold">@{log.adminName}</span>
                  </td>
                  <td className="p-5 px-8">
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[9px] uppercase font-bold border border-blue-500/20">
                       {log.action}
                    </span>
                  </td>
                  <td className="p-5 px-8 text-slate-400 italic">
                    {log.details}
                  </td>
                  <td className="p-5 px-8 text-right">
                    <button 
                      onClick={() => setShowPassModal(log.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-600 italic">
                    <Terminal className="mx-auto mb-4 opacity-20" size={48} />
                    Hozircha tizim loglari mavjud emas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" onClick={() => setShowPassModal(null)} />
          <div className="relative bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wider">LOGNI O'CHIRISH</h3>
            
            <div className="relative mb-6">
               <input 
                type={showAdminPass ? "text" : "password"} value={adminPass} onChange={e => setAdminPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-center outline-none focus:border-emerald-500 font-bold"
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
              <button onClick={() => setShowPassModal(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold">YO'Q</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-emerald-600 rounded-2xl font-bold">HA, O'CHIR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
