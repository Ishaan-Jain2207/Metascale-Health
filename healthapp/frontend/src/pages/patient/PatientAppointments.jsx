import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Search, 
  Info, 
  CheckCircle2, 
  XCircle,
  Loader2,
  AlertCircle,
  Video,
  Hospital,
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const PatientAppointments = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [newAppt, setNewAppt] = useState({
    doctor_id: '',
    appt_date: '',
    appt_time: '',
    reason: '',
    type: 'in-person'
  });

  useEffect(() => {
    fetchData().then(() => {
       if (location.state?.prefill) {
          const { type, risk } = location.state.prefill;
          setShowBooking(true);
          setNewAppt(prev => ({
             ...prev,
             reason: `Clinical review for ${type.toUpperCase()} screening result: ${risk} Risk`
          }));
       }
    });
  }, [location]);

  const fetchData = async () => {
    try {
      const [apptRes, doctorRes] = await Promise.all([
        api.get('/appointments/patient'),
        api.get('/auth/doctors')
      ]);
      setAppointments(apptRes.data.data);
      setDoctors(doctorRes.data.data);
    } catch (err) {
      setError('Failed to load clinical data.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const res = await api.post('/appointments/book', newAppt);
      if (res.data.success) {
        setShowBooking(false);
        fetchData();
        setNewAppt({ doctor_id: '', appt_date: '', appt_time: '', reason: '', type: 'in-person' });
      }
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this consultation?')) return;
    try {
      await api.put(`/appointments/${id}/status`, { status: 'cancelled' });
      fetchData();
    } catch (err) {
      setError('Failed to cancel appointment.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-saffron-deep" size={48} />
        <div className="absolute inset-0 bg-saffron/20 blur-xl animate-pulse rounded-full"></div>
      </div>
      <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Retrieving Clinical Schedule...</p>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >
      {/* Header Mesh Hero */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-mesh-saffron rounded-[40px] p-8 md:p-12 text-white shadow-3xl border border-white/20"
      >
         <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 animate-float">
            <Calendar size={240} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
               <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/20">
                  <ShieldCheck size={14} /> Verified Consultations
               </div>
               <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 drop-shadow-md text-white">
                  Metascale <br />
                  <span className="text-white/80 italic font-sans font-medium">Clinical Network</span>
               </h1>
               <p className="text-white/70 max-w-lg text-lg font-medium leading-relaxed">
                  Bridge the gap between AI screening and expert medical advice with our dedicated specialist bank.
               </p>
            </div>
            
            <button 
              onClick={() => setShowBooking(!showBooking)}
              className={`group flex items-center gap-3 px-8 py-5 rounded-[24px] font-black uppercase tracking-widest transition-all shadow-3xl active:scale-95 ${showBooking ? 'bg-white text-rose-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {showBooking ? <XCircle size={20} /> : <Plus size={20} className="group-hover:rotate-90 transition-transform" />}
              {showBooking ? 'Cancel Booking' : 'New Consultation'}
            </button>
         </div>
      </motion.div>

      <AnimatePresence>
        {showBooking && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card !bg-white/40 backdrop-blur-3xl border border-white/60 shadow-3xl p-10 rounded-[48px] mb-10">
               <h2 className="text-2xl font-display font-black text-slate-900 mb-8 uppercase tracking-tight">Schedule Diagnostic Session</h2>
               <form onSubmit={handleBook} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Specialist</label>
                       <select 
                         value={newAppt.doctor_id}
                         onChange={(e) => setNewAppt({...newAppt, doctor_id: e.target.value})}
                         required
                         className="w-full px-6 py-5 bg-white border border-slate-100 rounded-[20px] outline-none focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep transition-all font-medium font-sans"
                       >
                          <option value="">Select a Verified Clinician</option>
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.full_name} — {d.specialization}</option>
                          ))}
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Date</label>
                          <input 
                            type="date" 
                            value={newAppt.appt_date}
                            onChange={(e) => setNewAppt({...newAppt, appt_date: e.target.value})}
                            required
                            className="w-full px-6 py-5 bg-white border border-slate-100 rounded-[20px] outline-none transition-all font-medium"
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Time Slot</label>
                          <input 
                            type="time" 
                            value={newAppt.appt_time}
                            onChange={(e) => setNewAppt({...newAppt, appt_time: e.target.value})}
                            required
                            className="w-full px-6 py-5 bg-white border border-slate-100 rounded-[20px] outline-none transition-all font-medium"
                          />
                       </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferred Modality</label>
                       <div className="flex gap-4 p-2 bg-slate-100/50 rounded-[22px] border border-slate-100/50">
                          <button 
                            type="button"
                            onClick={() => setNewAppt({...newAppt, type: 'in-person'})}
                            className={`flex-1 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${newAppt.type === 'in-person' ? 'bg-white text-saffron-deep shadow-lg shadow-saffron/10' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            <Hospital size={14} className="inline mr-2" /> In-Person
                          </button>
                          <button 
                            type="button"
                            onClick={() => setNewAppt({...newAppt, type: 'virtual'})}
                            className={`flex-1 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${newAppt.type === 'virtual' ? 'bg-white text-saffron-deep shadow-lg shadow-saffron/10' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            <Video size={14} className="inline mr-2" /> Virtual Session
                          </button>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Reason for Consultation</label>
                       <input 
                         type="text" 
                         value={newAppt.reason}
                         onChange={(e) => setNewAppt({...newAppt, reason: e.target.value})}
                         placeholder="e.g. Discuss Screening Metrics"
                         required
                         className="w-full px-6 py-5 bg-white border border-slate-100 rounded-[20px] outline-none transition-all font-medium font-sans"
                       />
                    </div>
                  </div>
                  <div className="pt-4">
                     <button 
                       type="submit" 
                       disabled={bookingLoading}
                       className="w-full bg-mesh-saffron py-6 rounded-[24px] text-white font-display font-black text-lg uppercase tracking-[0.2em] shadow-3xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 border border-white/20 disabled:opacity-50"
                     >
                       {bookingLoading ? <Loader2 className="animate-spin" /> : <Zap size={24} />}
                       {bookingLoading ? 'Securing Slot...' : 'Confirm Consultation Request'}
                     </button>
                  </div>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase">
               Your Clinical Pipeline
               <div className="h-px flex-1 bg-slate-100"></div>
            </h2>
            {appointments.length > 0 ? (
               <div className="grid gap-6">
                  {appointments.map((appt, index) => (
                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={appt.id} 
                        className="card !bg-white/40 backdrop-blur-3xl border border-white/60 p-8 rounded-[40px] hover:shadow-3xl transition-all relative overflow-hidden group"
                     >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                           <div className="flex items-center gap-5">
                              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all border border-slate-50 text-saffron-deep">
                                 <User size={28} />
                              </div>
                              <div>
                                 <p className="font-display font-black text-slate-900 text-xl tracking-tight">{appt.doctor_name}</p>
                                 <p className="text-[10px] text-saffron-deep font-black uppercase tracking-[0.2em]">{appt.specialization}</p>
                              </div>
                           </div>
                           <div className="flex flex-wrap items-center gap-6">
                              <div className="flex flex-col gap-1">
                                 <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <Calendar size={14} className="text-saffron" /> Scheduled
                                 </div>
                                 <p className="text-slate-900 font-bold ml-5">
                                    {new Date(appt.appt_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {appt.appt_time}
                                 </p>
                              </div>
                              <div className="flex flex-col gap-2">
                                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-center ${
                                    appt.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-emerald-500/5 shadow-lg' :
                                    appt.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-amber-500/5 shadow-lg' :
                                    'bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-rose-500/5 shadow-lg'
                                 }`}>
                                    {appt.status}
                                 </span>
                              </div>
                              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                                 <button 
                                   onClick={() => handleCancel(appt.id)}
                                   className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 hover:shadow-xl transition-all active:scale-90"
                                   title="Cancel Consultation"
                                 >
                                    <XCircle size={20} />
                                 </button>
                                 <Link 
                                    to={`/patient/appointments/${appt.id}`}
                                    className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white hover:bg-saffron shadow-xl transition-all"
                                 >
                                    <ChevronRight size={20} />
                                 </Link>
                              </div>
                           </div>
                        </div>
                        {appt.doctor_notes && (
                           <div className="mt-8 p-6 bg-saffron/5 rounded-[24px] border border-saffron/10 text-xs text-saffron-deep font-sans font-medium italic relative">
                              <span className="absolute top-2 left-3 text-4xl opacity-10">"</span>
                              {appt.doctor_notes}
                              <span className="absolute bottom-[-10px] right-3 text-4xl opacity-10 rotate-180">"</span>
                           </div>
                        )}
                     </motion.div>
                  ))}
               </div>
            ) : (
               <motion.div variants={itemVariants} className="card !bg-white/40 backdrop-blur-3xl border-dashed border-2 border-slate-200 py-24 text-center rounded-[48px]">
                  <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-slate-200 shadow-2xl mx-auto mb-8">
                     <Calendar size={48} className="opacity-20 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-display font-black text-slate-900 mb-2 uppercase tracking-tight">Schedule Void</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto mb-10">Initiate a formal medical consultation to review clinical screening parameters.</p>
                  <button onClick={() => setShowBooking(true)} className="bg-mesh-saffron text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest shadow-3xl hover:scale-105 active:scale-95 transition-all">
                     Bridge Consultation
                  </button>
               </motion.div>
            )}
         </div>

         <div className="space-y-10">
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase">
               Elite Specialists
               <div className="h-px flex-1 bg-slate-100"></div>
            </h2>
            <div className="grid gap-6">
               {doctors.slice(0, 3).map((doctor, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    key={doctor.id} 
                    className="card !bg-white/40 backdrop-blur-3xl border border-white/60 p-6 hover:shadow-2xl transition-all rounded-[32px] group"
                  >
                     <div className="flex items-center gap-5 mb-5">
                        <div className="w-14 h-14 bg-mesh-saffron text-white rounded-2xl flex items-center justify-center font-display font-black text-xl shadow-lg shadow-saffron/20 group-hover:scale-110 transition-transform">
                           {doctor.full_name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-display font-black text-slate-900 tracking-tight text-lg group-hover:text-saffron-deep transition-colors">{doctor.full_name}</p>
                           <p className="text-[10px] text-saffron-deep font-black uppercase tracking-[0.2em]">{doctor.specialization}</p>
                        </div>
                     </div>
                     <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                        <p className="text-[10px] text-slate-400 flex items-center gap-2 font-black uppercase tracking-widest"><Hospital size={14} className="text-saffron" /> {doctor.hospital || 'METASCALE CLINIC'}</p>
                        <div className="flex gap-1">
                           {[1,2,3,4,5].map(s => <div key={s} className="w-1 h-1 rounded-full bg-saffron/40"></div>)}
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
            
            <motion.div 
               variants={itemVariants}
               className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-3xl"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Info size={20} className="text-saffron" /></div>
                     <h4 className="font-display font-black text-lg uppercase tracking-tight">Clinical Protocol</h4>
                  </div>
                  <p className="text-xs leading-relaxed font-medium text-white/60 uppercase tracking-widest">Ensure synchronization of clinical records prior to session initiation. Virtual modules require high-bandwidth infrastructure.</p>
                  <div className="pt-4 flex items-center gap-4">
                     <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-saffron" 
                          animate={{ x: [-100, 200] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                     </div>
                     <span className="text-[10px] font-black text-saffron">READY</span>
                  </div>
               </div>
            </motion.div>
         </div>
      </div>
    </motion.div>
  );
};

export default PatientAppointments;
