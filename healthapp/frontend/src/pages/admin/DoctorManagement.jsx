import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Stethoscope, 
  ShieldCheck, 
  Trash2, 
  Zap, 
  ArrowLeft,
  Mail,
  Activity,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const DoctorManagement = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await api.get('/admin/doctors');
      setDoctors(res.data.data);
    } catch {
      console.error('Error fetching personnel registry');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.body.classList.add('app-dark-mode');
    fetchDoctors();
    return () => document.body.classList.remove('app-dark-mode');
  }, [fetchDoctors]);

  const handleDelete = async (id) => {
    if (!window.confirm('Mandatory: Confirm identity deletion? This action is irreversible.')) return;
    try {
      await api.delete(`/admin/doctors/${id}`);
      fetchDoctors();
    } catch {
      console.error('Personnel deletion failed');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-6 text-white/20">
      <Zap className="animate-spin text-saffron" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Auditing Personnel Registry...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-16 pb-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-10 px-4 md:px-0">
         <div className="space-y-4">
            <button 
               onClick={() => navigate('/admin/dashboard')}
               className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-saffron transition-all"
            >
               <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Sentinel Hub
            </button>
            <h1 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter uppercase leading-none">
               Personnel <br />
               <span className="text-saffron italic font-sans font-medium lowercase">Nodes</span>
            </h1>
         </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-12 px-4 md:px-0">
         <div className="lg:col-span-1 space-y-8">
            <div className="glass-dark p-10 rounded-[48px] border border-white/5 space-y-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-mesh-saffron opacity-5"></div>
               <Users className="text-saffron" size={40} />
               <div className="space-y-2">
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Active Personnel</p>
                  <p className="text-6xl font-display font-black text-white">{doctors.length}</p>
               </div>
               <p className="text-[9px] text-white/20 font-black uppercase tracking-widest leading-relaxed">System is performing sequential biometric audits on clinical clusters.</p>
            </div>
         </div>

         <div className="lg:col-span-3 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
               <AnimatePresence>
                  {doctors.map((doctor) => (
                     <motion.div 
                        key={doctor.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-dark p-8 rounded-[48px] border border-white/5 shadow-5xl group relative overflow-hidden"
                     >
                        <div className="absolute left-0 top-0 w-2 h-full bg-saffron opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-start justify-between gap-6 mb-8">
                           <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[24px] flex items-center justify-center text-saffron shadow-3xl group-hover:scale-110 transition-transform">
                              <Stethoscope size={32} />
                           </div>
                           <button 
                              onClick={() => handleDelete(doctor.id)}
                              className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-white/10 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all"
                           >
                              <Trash2 size={18} />
                           </button>
                        </div>
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">{doctor.full_name}</h3>
                              <div className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-widest">
                                 <Mail size={12} className="text-saffron/40" /> {doctor.email}
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                 <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1">Quals</p>
                                 <p className="text-[10px] text-white font-black uppercase truncate">{doctor.qualification || 'Verified'}</p>
                              </div>
                              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                 <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1">License</p>
                                 <p className="text-[10px] text-white font-black uppercase truncate">{doctor.license_number || 'LCN-SYS'}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 pt-4">
                              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-500/10">
                                 <ShieldCheck size={10} /> Node Active
                              </div>
                              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron/5 text-saffron text-[8px] font-black uppercase tracking-widest border border-saffron/10">
                                 <Activity size={10} /> Load Stable
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>

            {doctors.length === 0 && (
               <div className="glass-dark border-dashed border-2 border-white/5 p-24 rounded-[64px] text-center space-y-8 flex flex-col items-center opacity-40">
                  <Award size={64} className="text-white/10" />
                  <p className="text-white font-display font-black text-2xl uppercase tracking-tight">No Personnel Indexed</p>
               </div>
            )}
         </div>
      </div>
    </motion.div>
  );
};

export default DoctorManagement;
