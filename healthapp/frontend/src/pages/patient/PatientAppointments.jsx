import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  CalendarCheck,
  Stethoscope,
  BriefcaseMedical,
  ShieldCheck,
  Plus
} from 'lucide-react';
import api from '../../services/api';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const PatientAppointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    doctor_id: '',
    appt_date: '',
    appt_time: '',
    reason: ''
  });

  const fetchInitialData = useCallback(async () => {
    try {
      const [docRes, apptRes] = await Promise.all([
        api.get('/admin/doctors'),
        api.get('/appointments/patient')
      ]);
      setDoctors(docRes.data.data);
      setAppointments(apptRes.data.data);
    } catch {
      console.error('Error fetching data:');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.body.classList.add('app-dark-mode');
    fetchInitialData();
    return () => document.body.classList.remove('app-dark-mode');
  }, [fetchInitialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBooking(true);
    setSuccess('');
    setError('');

    try {
      await api.post('/appointments', formData);
      setSuccess('Mandate synchronization successful. Personnel will verify your request.');
      setFormData({ doctor_id: '', appt_date: '', appt_time: '', reason: '' });
      fetchInitialData();
    } catch {
      setError('Synchronization failed.');
    } finally {
      setBooking(false);
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
           <BriefcaseMedical size={14} className="animate-pulse" /> Personnel Sync Protocol
        </div>
        <h1 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-none uppercase">
          Mandate <br/>
          <span className="text-saffron italic font-sans font-medium lowercase">Management</span>
        </h1>
        <p className="text-white/20 text-xs md:text-sm max-w-2xl font-black uppercase tracking-[0.3em] leading-relaxed">
           Schedule a clinical audit with specialized personnel to evaluate your biometric vectors.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-16">
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-10">
           <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-4">
              <Plus className="text-saffron" size={24} /> New Mandate
           </h2>

           <div className="glass-dark p-10 rounded-[56px] border border-white/5 shadow-5xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-40"></div>
              
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                 <AnimatePresence>
                   {success && (
                     <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-6 rounded-[28px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 backdrop-blur-xl mb-8"
                     >
                        <CheckCircle2 size={18} /> {success}
                     </motion.div>
                   )}
                   {error && (
                     <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-6 rounded-[28px] bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 backdrop-blur-xl mb-8"
                     >
                        <XCircle size={18} /> {error}
                     </motion.div>
                   )}
                 </AnimatePresence>

                 <div className="space-y-3 relative group">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-6 italic">Clinical Lead</label>
                    <div className="relative">
                       <Stethoscope size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" />
                       <select 
                         name="doctor_id" value={formData.doctor_id} onChange={handleChange}
                         className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-black text-[10px] uppercase tracking-widest text-white appearance-none transition-all shadow-inner"
                         required
                       >
                         <option value="" className="bg-ink text-white">Select Personnel</option>
                         {doctors.map(doc => (
                           <option key={doc.id} value={doc.id} className="bg-ink text-white">Dr. {doc.full_name}</option>
                         ))}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-3 group">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-6 italic">Audit Date</label>
                    <div className="relative">
                       <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" />
                       <input 
                         type="date" name="appt_date" value={formData.appt_date} onChange={handleChange}
                         className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-inner" 
                         required
                       />
                    </div>
                 </div>

                 <div className="space-y-3 group">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-6 italic">Synchronous Window</label>
                    <div className="relative">
                       <Clock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" />
                       <input 
                         type="time" name="appt_time" value={formData.appt_time} onChange={handleChange}
                         className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-inner" 
                         required
                       />
                    </div>
                 </div>

                 <div className="space-y-3 group">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-6 italic">Personnel Notes</label>
                    <textarea 
                       name="reason" value={formData.reason} onChange={handleChange}
                       className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-medium text-sm text-white transition-all shadow-inner min-h-[140px] placeholder:text-white/10" 
                       placeholder="Detail your clinical manifestation..."
                       required
                    ></textarea>
                 </div>

                 <motion.button 
                   whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}
                   type="submit" disabled={booking}
                   className="btn-primary w-full py-6 !text-[11px] !tracking-[0.4em] flex items-center justify-center gap-4 group disabled:opacity-50 shadow-5xl hover:shadow-saffron/40"
                 >
                   {booking ? <Loader2 className="animate-spin" size={20} /> : (
                     <>Synchronize Mandate <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /></>
                   )}
                 </motion.button>
              </form>
           </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-10">
           <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-4">
              <CalendarCheck className="text-saffron" size={24} /> Sync Registry
              <div className="h-px flex-1 bg-white/5"></div>
           </h2>

           <div className="space-y-8">
              {appointments.length === 0 ? (
                 <div className="glass-dark border-dashed border-2 border-white/5 p-20 rounded-[60px] text-center space-y-8 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[40px] mx-auto flex items-center justify-center text-white/10 shadow-4xl mb-6">
                       <Calendar size={48} className="animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <p className="text-white font-display font-black text-2xl uppercase tracking-tight">Timeline Clean</p>
                       <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] max-w-sm mx-auto italic leading-relaxed">No upcoming synchronized clinical audits detected in your personnel personnel timeline.</p>
                    </div>
                 </div>
              ) : (
                <div className="grid md:grid-cols-1 gap-6">
                   {appointments.map((appt) => (
                     <motion.div 
                        key={appt.id} 
                        whileHover={{ x: 10 }}
                        className="glass-dark p-8 rounded-[48px] border border-white/5 shadow-5xl group transition-all relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 w-4 h-full bg-saffron opacity-20 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                           <div className="flex items-center gap-8">
                              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center text-saffron shadow-3xl group-hover:scale-110 transition-transform">
                                 <BriefcaseMedical size={28} />
                              </div>
                              <div>
                                 <h4 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-tight">Dr. {appt.doctor_name}</h4>
                                 <div className="flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-widest mt-2">
                                    <Clock size={14} className="text-saffron" /> {appt.appt_date} @ {appt.appt_time}
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-8 px-6 md:px-0">
                              <span className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                 appt.status === 'confirmed' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                                 appt.status === 'cancelled' ? 'border-rose-500/20 text-rose-400 bg-rose-500/5' :
                                 'border-amber-500/20 text-amber-400 bg-amber-500/5 pulse'
                              }`}>
                                 Identified: {appt.status}
                              </span>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                </div>
              )}
           </div>
           
           <div className="flex items-center gap-6 p-10 bg-white/5 rounded-[40px] border border-white/5 shadow-4xl grayscale opacity-30 select-none">
              <ShieldCheck size={28} className="text-saffron shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-[0.15em] leading-relaxed italic text-white/40">
                 Personnel Synchronization v4.1: Clinical schedules are synchronized via encrypted nodal handshakes. All booking mandates are immutable once authorized by personnel.
              </p>
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Zap = ({ className, size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

export default PatientAppointments;
