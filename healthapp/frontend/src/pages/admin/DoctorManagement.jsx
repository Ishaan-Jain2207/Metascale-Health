import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ShieldAlert, 
  Loader2,
  Mail,
  User,
  Activity,
  MoreVertical,
  Check,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/admin/doctors');
      setDoctors(res.data.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/admin/doctors/${id}/approve`);
      fetchDoctors();
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setActionLoading(id);
    try {
      await api.put(`/admin/users/${id}/status`, { is_active: !currentStatus });
      fetchDoctors();
    } catch (err) {
      console.error('Status toggle failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div>;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
           <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-4">
              <span className="w-3 h-10 bg-indigo-clinical rounded-full"></span> Personnel Sentinel
           </h1>
           <p className="text-slate-500 font-medium max-w-lg mt-2">Manage Clinical Personnel and Professional Authorization workflows.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-clinical transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search Identity..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-6 py-3.5 bg-white/60 backdrop-blur-md border border-slate-200 rounded-[20px] outline-none focus:ring-4 focus:ring-indigo-clinical/10 focus:border-indigo-clinical w-full md:w-80 transition-all font-medium"
              />
           </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filteredDoctors.map((doctor) => (
            <motion.div variants={itemVariants} key={doctor.id} className="card group hover:shadow-3xl hover:border-indigo-clinical/20 transition-all relative overflow-hidden bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[32px] p-8">
               <div className="absolute -top-4 -right-4 text-indigo-clinical/5 rotate-12 transition-transform group-hover:scale-125"><Stethoscope size={160} /></div>
               <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className={`w-18 h-18 rounded-[24px] flex items-center justify-center font-display font-bold text-2xl shadow-2xl ring-4 ring-white group-hover:rotate-3 transition-transform ${doctor.is_approved ? 'bg-ink text-white' : 'bg-saffron-light/20 text-saffron-deep'}`}>
                        {doctor.full_name?.charAt(0)}
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900 text-xl leading-tight">{doctor.full_name}</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mt-1">{doctor.specialization || 'Clinical Generalist'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${doctor.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} title={doctor.is_active ? 'Online' : 'Restricted'}></div>
                  </div>
               </div>

               <div className="space-y-4 mb-10 relative z-10">
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50 p-2 px-4 rounded-full w-fit">
                     <Mail size={12} className="text-indigo-clinical" /> {doctor.email}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600 px-4">
                     <ShieldCheck size={14} className="text-green-500" /> {doctor.hospital || 'Clinical Node Alpha'}
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-100 flex items-center gap-2 relative z-10">
                  {!doctor.is_approved ? (
                     <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => handleApprove(doctor.id)}
                          disabled={actionLoading === doctor.id}
                          className="flex-1 bg-indigo-clinical hover:bg-[#513f9c] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100/50 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                           {actionLoading === doctor.id ? <Loader2 size={14} className="animate-spin" /> : 'Authorize Residency'}
                        </button>
                        <button className="p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-2xl transition-all border border-slate-100"><Trash2 size={16} /></button>
                     </div>
                  ) : (
                     <button 
                       onClick={() => handleToggleStatus(doctor.id, doctor.is_active)}
                       disabled={actionLoading === doctor.id}
                       className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 ${doctor.is_active ? 'bg-white border border-slate-200 text-red-600 hover:bg-red-50' : 'bg-green-600 text-white hover:bg-green-700 shadow-xl shadow-green-100'}`}
                     >
                        {actionLoading === doctor.id ? <Loader2 size={14} className="animate-spin" /> : doctor.is_active ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
                        {doctor.is_active ? 'Revoke Access' : 'Restore Authorization'}
                     </button>
                  )}
               </div>
            </motion.div>
         ))}

         {filteredDoctors.length === 0 && (
            <motion.div variants={itemVariants} className="col-span-full card py-32 flex flex-col items-center justify-center text-center space-y-6 border-dashed bg-slate-50/20 border-2 rounded-[40px]">
               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-xl mx-auto border border-slate-100"><User size={48} /></div>
               <div>
                  <h3 className="text-2xl font-bold text-slate-900">Personnel Index Empty</h3>
                  <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2 text-sm uppercase tracking-widest text-[#94a3b8]">No active medical records match the query.</p>
               </div>
            </motion.div>
         )}
      </div>
    </motion.div>
  );
};

export default DoctorManagement;
