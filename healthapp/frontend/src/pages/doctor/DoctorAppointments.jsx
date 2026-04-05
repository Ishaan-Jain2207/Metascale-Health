import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  CalendarCheck,
  Stethoscope,
  BriefcaseMedical,
  ShieldCheck,
  Zap,
  Check,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [noteMap, setNoteMap] = useState({});

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await api.get('/appointments/doctor');
      setAppointments(res.data.data);
    } catch {
      console.error('Failed to load clinical schedule.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleAction = async (id, status) => {
    setActionLoading(id);
    try {
      await api.patch(`/appointments/${id}`, { 
        status, 
        doctor_notes: noteMap[id] || `${status.toUpperCase()} by Personnel` 
      });
      fetchAppointments();
      setNoteMap({ ...noteMap, [id]: '' });
    } catch {
      console.error('Error updating appointment');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-6 text-white/20">
      <Zap className="animate-spin text-saffron" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Restoring Clinical Schedule...</p>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const upcoming = appointments.filter(a => a.status === 'pending');
  const history = appointments.filter(a => a.status !== 'pending');

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-16 pb-24 px-4 md:px-0"
    >
      <motion.div variants={itemVariants} className="text-left space-y-10 relative py-12 border-b border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/10 blur-[120px] rounded-full opacity-40"></div>
        <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full text-saffron text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-white/10 shadow-2xl">
           <BriefcaseMedical size={14} className="animate-pulse" /> Personnel Operations
        </div>
        <h1 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-none uppercase">
          Mandate <br/>
          <span className="text-saffron italic font-sans font-medium lowercase">Verification</span>
        </h1>
        <p className="text-white/20 text-xs md:text-sm max-w-2xl font-black uppercase tracking-[0.3em] leading-relaxed">
           Audit and synchronize clinical schedules with pending biovariable assessment mandates.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-16">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-12">
            <div className="space-y-10">
               <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-4">
                  <AlertCircle className="text-saffron" size={24} /> Pending Mandates
                  <div className="h-px flex-1 bg-white/5"></div>
               </h2>

               <AnimatePresence mode="popLayout">
                 {upcoming.length > 0 ? (
                    <div className="space-y-6">
                       {upcoming.map((appt) => (
                          <motion.div 
                             layout
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: 20 }}
                             key={appt.id} 
                             className="glass-dark p-10 rounded-[48px] border border-white/5 shadow-5xl group transition-all relative overflow-hidden"
                          >
                             <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="flex items-center gap-10">
                                   <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center text-saffron shadow-3xl group-hover:scale-110 transition-transform">
                                      <Stethoscope size={36} />
                                   </div>
                                   <div className="space-y-4">
                                      <h4 className="text-3xl font-display font-black text-white uppercase tracking-tight leading-tight">{appt.patient_name}</h4>
                                      <div className="flex flex-wrap items-center gap-6">
                                         <div className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-widest">
                                            <Calendar size={14} className="text-saffron" /> {appt.appt_date}
                                         </div>
                                         <div className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-widest">
                                            <Clock size={14} className="text-saffron" /> {appt.appt_time}
                                         </div>
                                      </div>
                                      <p className="text-[10px] text-white/40 font-medium leading-relaxed italic pr-4">"{appt.reason}"</p>
                                   </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto">
                                   <button 
                                      onClick={() => handleAction(appt.id, 'cancelled')}
                                      disabled={actionLoading === appt.id}
                                      className="p-6 rounded-[28px] bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all shadow-3xl"
                                   >
                                      <XCircle size={24} />
                                   </button>
                                   <button 
                                      onClick={() => handleAction(appt.id, 'confirmed')}
                                      disabled={actionLoading === appt.id}
                                      className="bg-saffron hover:bg-saffron-deep text-slate-900 px-10 py-6 rounded-[28px] text-[10px] font-black uppercase tracking-widest shadow-5xl active:scale-95 transition-all flex items-center gap-4"
                                   >
                                      {actionLoading === appt.id ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />} Synchronize
                                   </button>
                                </div>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 ) : (
                    <div className="glass-dark border-dashed border-2 border-white/5 p-24 rounded-[64px] text-center space-y-8 flex flex-col items-center opacity-40">
                       <ShieldCheck size={64} className="text-white/10" />
                       <div className="space-y-4">
                          <p className="text-white font-display font-black text-2xl uppercase tracking-tight">Timeline Integrity Verified</p>
                          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] max-w-sm">System has no pending clinical mandates awaiting verification.</p>
                       </div>
                    </div>
                 )}
               </AnimatePresence>
            </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-12">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-4">
               <CalendarCheck className="text-saffron" size={24} /> History Log
            </h2>

            <div className="space-y-6">
               {history.slice(0, 5).map((appt) => (
                  <div key={appt.id} className="glass-dark p-8 rounded-[40px] border border-white/5 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity group">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-saffron transition-colors">
                           <Check size={20} />
                        </div>
                        <div>
                           <p className="font-display font-black text-white text-sm uppercase tracking-tight">{appt.patient_name}</p>
                           <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1">{appt.appt_date}</p>
                        </div>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${appt.status === 'confirmed' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-rose-500/20 text-rose-400 bg-rose-500/5'}`}>
                        {appt.status}
                     </span>
                  </div>
               ))}
               
               <button className="w-full py-6 rounded-[32px] bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-4 group">
                  Audit Registry <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DoctorAppointments;
