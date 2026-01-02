
import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentStatus } from '../../types';
import { 
  Check, X, Eye, Clock, Trash2, ShieldAlert, Mail, EyeOff, 
  ZoomIn, Download, Search, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { payments, processPayment, deletePayment, addBroadcast } = useStore();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [showPassModal, setShowPassModal] = useState<string | null>(null);
  const [adminPass, setAdminPass] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  
  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  
  // Image zoom state
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const pendingPayments = payments.filter(p => p.status === PaymentStatus.PENDING);
  const otherPayments = payments.filter(p => p.status !== PaymentStatus.PENDING);

  // Filter and Search Logic
  const filteredOtherPayments = useMemo(() => {
    return otherPayments.filter(p => {
      const matchesSearch = p.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.amount.toString().includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [otherPayments, searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOtherPayments.length / pageSize);
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOtherPayments.slice(start, start + pageSize);
  }, [filteredOtherPayments, currentPage, pageSize]);

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
    <>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-minecraft text-emerald-400 uppercase tracking-widest">To'lovlar boshqaruvi</h2>
          <div className="flex space-x-2">
            <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
              {pendingPayments.length} kutilmoqda
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
            <Clock size={16} className="text-amber-500" />
            <span>Kutilayotganlar</span>
          </h3>
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
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden group/receipt relative cursor-zoom-in">
                    <img src={p.receiptUrl} alt="Chek" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setZoomImg(p.receiptUrl)}
                      className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/receipt:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <ZoomIn size={24} className="text-emerald-400" />
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
                    className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white p-4 rounded-2xl transition-all border border-emerald-500/20 active:scale-95 transform"
                  >
                    <Check size={24} />
                  </button>
                  <button 
                    onClick={() => { setSelectedPayment(p); setIsRejecting(true); }}
                    className="bg-rose-600/20 hover:bg-rose-600 text-rose-500 hover:text-white p-4 rounded-2xl transition-all border border-rose-500/20 active:scale-95 transform"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-16 mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Barcha tranzaksiyalar</h3>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="text"
                  placeholder="Email yoki summa..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-2.5 text-xs focus:border-emerald-500 outline-none w-full sm:w-64 transition-all"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest focus:border-emerald-500 outline-none"
              >
                <option value="ALL">BARCHASI</option>
                <option value={PaymentStatus.APPROVED}>TASDIQLANGAN</option>
                <option value={PaymentStatus.REJECTED}>RAD ETILGAN</option>
              </select>
            </div>
          </div>

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
                  {paginatedPayments.map(p => (
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
                          <button onClick={() => setZoomImg(p.receiptUrl)} className="p-2 text-slate-500 hover:text-emerald-400 active:scale-90 transition-transform"><Eye size={14}/></button>
                          <button onClick={() => setShowPassModal(p.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg active:scale-90 transition-transform"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedPayments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-600 italic">Hech qanday ma'lumot topilmadi</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  Sahifa {currentPage} / {totalPages}
                </p>
                <div className="flex space-x-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomImg && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => setZoomImg(null)} />
           <div className="relative max-w-4xl w-full h-[80vh] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl animate-scale-in border border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">To'lov cheki</h3>
                 <div className="flex space-x-2">
                    <a href={zoomImg} download className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all active:scale-90"><Download size={18}/></a>
                    <button onClick={() => setZoomImg(null)} className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-all active:scale-90"><X size={18}/></button>
                 </div>
              </div>
              <div className="flex-grow p-4 md:p-8 flex items-center justify-center bg-slate-950 overflow-hidden">
                 <img src={zoomImg} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Receipt Full" />
              </div>
           </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {isApproving && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsApproving(null)} />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-sm p-10 rounded-[2.5rem] shadow-2xl text-center animate-scale-in z-50">
            <Check size={56} className="mx-auto text-emerald-500 mb-6 bg-emerald-500/10 p-4 rounded-full" />
            <h2 className="text-xl font-minecraft font-bold mb-4 uppercase tracking-widest text-emerald-400">TO'LOVNI TASDIQLASH</h2>
            <p className="text-slate-400 text-xs mb-8 leading-relaxed">Foydalanuvchi balansi darhol to'ldiriladi va unga bildirishnoma yuboriladi.</p>
            <div className="flex gap-4">
               <button onClick={() => setIsApproving(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-transform">Bekor</button>
               <button onClick={() => handleApprove(isApproving)} className="flex-1 py-4 bg-emerald-600 rounded-2xl font-bold emerald-glow uppercase text-[10px] tracking-widest text-white shadow-xl active:scale-95 transition-transform">Tasdiqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejecting && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsRejecting(false)} />
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl animate-scale-in z-50">
            <ShieldAlert size={56} className="text-rose-500 mb-6 mx-auto bg-rose-500/10 p-4 rounded-full" />
            <h2 className="text-2xl font-minecraft text-rose-500 mb-2 uppercase text-center tracking-widest">TO'LOVNI RAD ETISH</h2>
            <p className="text-slate-400 text-xs mb-6 text-center">Foydalanuvchiga rad etish sababini ko'rsating:</p>
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl focus:border-rose-500 outline-none min-h-[140px] mb-8 text-slate-300 text-sm"
              placeholder="Masalan: Chek sifati yomon yoki rekvizitlar xato..."
            />
            <div className="flex space-x-4">
              <button onClick={() => setIsRejecting(false)} className="flex-1 py-4 rounded-2xl font-bold bg-slate-800 uppercase text-[10px] tracking-widest active:scale-95 transition-transform">Bekor qilish</button>
              <button onClick={handleReject} disabled={!rejectReason} className="flex-1 bg-rose-600 hover:bg-rose-500 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 uppercase text-[10px] tracking-widest text-white shadow-xl active:scale-95 transition-transform">Rad Etish</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" onClick={() => setShowPassModal(null)} />
          <div className="relative bg-slate-900 border border-rose-500/30 p-10 rounded-[2.5rem] max-w-sm w-full text-center animate-scale-in z-50">
            <Trash2 className="mx-auto text-rose-500 mb-6 bg-rose-500/10 p-4 rounded-full" size={56} />
            <h3 className="text-xl font-minecraft font-bold mb-4 uppercase tracking-widest text-rose-500">TRANZAKSIYANI O'CHIRISH</h3>
            <p className="text-slate-500 text-xs mb-8">Ushbu amalni ortga qaytarib bo'lmaydi. Admin parolini kiriting.</p>
            <div className="relative mb-6">
               <input 
                type={showAdminPass ? "text" : "password"} value={adminPass} onChange={e => setAdminPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-6 text-center font-bold text-lg focus:border-rose-500 outline-none"
                placeholder="••••••••"
                autoFocus
              />
              <button type="button" onClick={() => setShowAdminPass(!showAdminPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                {showAdminPass ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowPassModal(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-transform">Bekor</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-rose-600 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-white shadow-xl active:scale-95 transition-transform">O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
