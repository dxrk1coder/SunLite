
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Save, Globe, CreditCard, MessageSquare, Server, Activity, ShieldAlert, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { config, updateConfig, addBroadcast } = useStore();
  const [formData, setFormData] = useState({ ...config });

  const handleStatChange = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      stats: { ...prev.stats, [key]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    addBroadcast('Tizim sozlamalari muvaffaqiyatli saqlandi!', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-minecraft text-emerald-400 uppercase tracking-widest">Tizim sozlamalari</h2>
        <button 
          onClick={handleSubmit}
          className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all emerald-glow"
        >
          <Save size={18} />
          <span>Saqlash</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Global Config */}
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-[2rem] space-y-8">
          <div className="flex items-center space-x-3 text-emerald-400">
            <Globe size={20} />
            <h3 className="font-bold uppercase tracking-[0.2em] text-xs">Asosiy ma'lumotlar</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Sayt nomi</label>
              <input 
                type="text" 
                value={formData.siteName}
                onChange={e => setFormData({...formData, siteName: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">To'lov kartasi (Rekvizitlar)</label>
              <input 
                type="text" 
                value={formData.cardDetails}
                onChange={e => setFormData({...formData, cardDetails: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none font-bold font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Telegram Support Link</label>
              <input 
                type="text" 
                value={formData.telegramSupport}
                onChange={e => setFormData({...formData, telegramSupport: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900">
             <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] border border-slate-800">
                <div className="flex items-center space-x-4">
                   <div className={`p-3 rounded-2xl ${formData.maintenanceMode ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-500'}`}>
                      <ShieldAlert size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-sm uppercase">Maintenance Mode</h4>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">Texnik ishlar rejimi</p>
                   </div>
                </div>
                <button 
                  onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}
                  className={`p-1 rounded-full transition-all ${formData.maintenanceMode ? 'text-emerald-500' : 'text-slate-700'}`}
                >
                   {formData.maintenanceMode ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
                </button>
             </div>
             <p className="mt-4 text-[9px] text-slate-500 italic uppercase px-2 leading-relaxed">Eslatma: Bu rejim yoqilganda faqat Adminlar saytdan to'liq foydalanishi mumkin bo'ladi.</p>
          </div>
        </div>

        {/* Server Info */}
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-[2rem] space-y-8">
          <div className="flex items-center space-x-3 text-blue-400">
            <Server size={20} />
            <h3 className="font-bold uppercase tracking-[0.2em] text-xs">Server holati (Mock)</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Server IP</label>
              <input 
                type="text" 
                value={formData.serverIp}
                onChange={e => setFormData({...formData, serverIp: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Onlayn</label>
                <input 
                  type="number" 
                  value={formData.stats.online}
                  onChange={e => handleStatChange('online', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Maksimal</label>
                <input 
                  type="number" 
                  value={formData.stats.maxPlayers}
                  onChange={e => handleStatChange('maxPlayers', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div>
                <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">CPU %</label>
                <input 
                  type="number" 
                  value={formData.stats.cpu}
                  onChange={e => handleStatChange('cpu', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none"
                />
              </div>
               <div>
                <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">RAM %</label>
                <input 
                  type="number" 
                  value={formData.stats.ram}
                  onChange={e => handleStatChange('ram', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none"
                />
              </div>
               <div>
                <label className="block text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">Ping (ms)</label>
                <input 
                  type="number" 
                  value={formData.stats.ping}
                  onChange={e => handleStatChange('ping', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
