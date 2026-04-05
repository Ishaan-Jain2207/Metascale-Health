import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Activity, 
  Stethoscope, 
  CheckCircle2, 
  History, 
  Calendar, 
  Phone, 
  Mail,
  Loader2,
  TrendingUp,
  Download,
  ShieldCheck,
  Zap,
  Clock,
  MessageSquare,
  FileText
} from 'lucide-react';
import api from '../../services/api';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchPatientData = useCallback(async () => {
    try {
      const [patientRes, historyRes] = await Promise.all([
        api.get(`/doctor/patients/${id}`),
        api.get(`/predict/history/${id}`)
      ]);
      setPatient(patientRes.data.data);
      setHistory(historyRes.data.data);
    } catch (err) {
      console.error('Diagnostic synchronization failed:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  const handleReview = async (type, screeningId) => {
    if (!reviewNote.trim()) return;
    setReviewLoading(true);
    try {
      await api.post(`/doctor/review/${type}/${screeningId}`, { doctor_notes: reviewNote });
      fetchPatientData();
      setReviewNote('');
    } catch {
      console.error('Error reviewing screening:');
    } finally {
      setReviewLoading(false);
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
        <Loader2 className="animate-spin text-primary-600" size={48} />
        <div className="absolute inset-0 bg-primary-500/20 blur-xl animate-pulse rounded-full"></div>
      </div>
      <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Retrieving Clinical Vectors...</p>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-20 max-w-6xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
           <button 
             onClick={() => navigate('/doctor/patients')} 
             className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary-600 transition-all"
           >
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                <ArrowLeft size={14} />
              </div>
              Back to Clinical Registry
           </button>
           <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Diagnostic <br />Analysis Hub</h1>
        </div>
        <div className="flex items-center gap-4">
           <button className="w-14 h-14 rounded-[28px] bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:shadow-xl transition-all shadow-md">
              <Download size={20} />
           </button>
           <Link to="/doctor/appointments" className="bg-slate-900 text-white px-10 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-3xl hover:bg-primary-600 active:scale-95 transition-all flex items-center gap-4">
              <Calendar size={18} className="text-primary-400" /> Follow-up Pipeline
           </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Patient Identity Profile */}
         <div className="lg:col-span-1 space-y-8">
            <motion.div variants={itemVariants} className="card !bg-white/40 backdrop-blur-3xl border border-white/60 p-10 rounded-[48px] shadow-3xl text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-32 bg-mesh-clinical opacity-10 group-hover:opacity-20 transition-opacity"></div>
               <div className="relative pt-6 space-y-8">
                  <div className="relative mx-auto w-32 h-32">
                     <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full scale-125"></div>
                     <div className="relative w-32 h-32 bg-white rounded-[40px] flex items-center justify-center font-display font-black text-5xl text-slate-900 shadow-2xl border-4 border-white group-hover:rotate-3 transition-transform">
                        {patient?.full_name?.charAt(0)}
                     </div>
                  </div>
                  <div>
                     <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight uppercase leading-tight">{patient?.full_name}</h2>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2">EMR Vector Index: #{patient?.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-white/50 p-6 rounded-[32px] border border-white/60">
                     <div className="text-center border-r border-slate-100">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Age</p>
                        <p className="text-2xl font-display font-black text-slate-900">{patient?.age}Y</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Bio</p>
                        <p className="text-2xl font-display font-black text-slate-900 capitalize">{patient?.gender?.charAt(0)}</p>
                     </div>
                  </div>

                  <div className="space-y-4 text-left pt-4">
                     <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white shadow-sm p-4 rounded-2xl border border-slate-50">
                        <Mail size={16} className="text-primary-400" /> <span className="truncate">{patient?.email}</span>
                     </div>
                     <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white shadow-sm p-4 rounded-2xl border border-slate-50">
                        <Phone size={16} className="text-primary-400" /> <span>{patient?.phone || 'NULL_SIGNAL'}</span>
                     </div>
                     <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white shadow-sm p-4 rounded-2xl border border-slate-50">
                        <ShieldCheck size={16} className="text-primary-400" /> <span>EST. {new Date(patient?.created_at).getFullYear()}</span>
                     </div>
                  </div>
               </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-slate-900 text-white rounded-[40px] p-10 space-y-10 shadow-4xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-mesh-clinical opacity-20"></div>
               <div className="relative z-10 flex items-center gap-4 border-b border-white/5 pb-6">
                  <TrendingUp className="text-primary-400" size={24} />
                  <h3 className="font-display font-black text-xl uppercase tracking-tight">Clinical Trajectory</h3>
               </div>
               <div className="relative z-10 space-y-8">
                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                        <span>Analysis Density</span>
                        <span>{history.length} Vectors</span>
                     </div>
                     <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                     </div>
                  </div>
                  <p className="text-[10px] text-white/30 leading-relaxed font-black uppercase tracking-[0.15em]">High frequency of clinical analysis indicates elevated patient engagement and proactive management protocols.</p>
                  
                  <div className="pt-4 flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary-400">
                        <Activity size={24} className="animate-pulse" />
                     </div>
                     <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary-500" 
                          animate={{ x: [-100, 200] }} 
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                     </div>
                  </div>
               </div>
            </motion.div>
         </div>

         {/* Diagnostic Timeline & Review */}
         <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-display font-black text-slate-900 flex items-center gap-4 uppercase tracking-tight">
                  Diagnostic Pipeline
                  <div className="h-px w-24 bg-slate-100"></div>
               </h2>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                  <Activity size={14} className="text-primary-500" /> Sequential Priority
               </div>
            </div>

            <AnimatePresence>
              {history.length > 0 ? (
                 <div className="space-y-8">
                    {history.map((screening, index) => (
                       <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          key={`${screening.type}-${screening.id}`} 
                          className="card !bg-white/40 backdrop-blur-3xl border border-white/60 p-10 rounded-[48px] hover:shadow-4xl transition-all relative overflow-hidden group"
                       >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-10 relative z-10">
                             <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-4">
                                   <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                                      screening.risk_band === 'Minimal' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                                      screening.risk_band === 'Elevated' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                                      'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                   }`}>
                                      {screening.risk_band} RISK Status
                                   </span>
                                   <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${screening.type === 'liver' ? 'bg-saffron/10 text-saffron border-saffron/20 shadow-saffron/5' : 'bg-primary-500/10 text-primary-600 border-primary-500/20 shadow-primary-500/5'} shadow-xl`}>
                                      {screening.type === 'liver' ? <Activity size={20} /> : <Stethoscope size={20} />}
                                   </div>
                                   <p className="font-display font-black text-slate-900 tracking-tight uppercase text-lg">{screening.type} Screening Protocol</p>
                                </div>
                                <div className="relative">
                                   <MessageSquare className="absolute -left-6 top-1 text-slate-100" size={16} />
                                   <p className="text-slate-500 font-medium leading-relaxed italic text-lg pl-2">"{screening.interpretation}"</p>
                                </div>
                             </div>
                             <div className="text-right space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-end gap-2">
                                   <ShieldCheck size={14} className="text-primary-500" /> Model Confidence
                                </p>
                                <p className="text-5xl font-display font-black text-slate-900">{(screening.confidence * 100).toFixed(0)}<span className="text-xl opacity-20">%</span></p>
                                <div className="flex items-center justify-end gap-2 pt-2">
                                   <Clock size={12} className="text-slate-300" />
                                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(screening.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                             </div>
                          </div>

                          {screening.is_reviewed ? (
                             <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900 border border-white/5 rounded-[32px] p-8 flex gap-6 relative overflow-hidden group/review shadow-3xl"
                             >
                                <div className="absolute inset-0 bg-mesh-clinical opacity-10 group-hover/review:opacity-20 transition-opacity"></div>
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-primary-400 border border-white/10 shrink-0 shadow-2xl"><CheckCircle2 size={28} /></div>
                                <div className="space-y-3 relative z-10">
                                   <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] font-display">Validated Clinical Review</p>
                                   <p className="text-white/80 font-medium leading-relaxed italic font-sans">"{screening.doctor_notes}"</p>
                                </div>
                                <div className="absolute top-2 right-2 p-4 text-white/5">
                                   <FileText size={64} />
                                </div>
                             </motion.div>
                          ) : (
                             <div className="space-y-6 pt-10 border-t border-slate-100 relative">
                                <div className="flex items-center justify-between mb-2">
                                   <label className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] font-display pl-1">Consultation Assessment Log</label>
                                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">DR_#AUTO_SIG</span>
                                </div>
                                <div className="flex gap-6">
                                   <textarea 
                                     value={reviewNote}
                                     onChange={(e) => setReviewNote(e.target.value)}
                                     placeholder="Input clinical assessment, diagnostic recommendations, or metabolic interventions..."
                                     className="flex-1 px-8 py-6 bg-white border border-slate-100 rounded-[32px] outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500/40 min-h-[120px] font-medium transition-all shadow-inner text-slate-900 font-sans"
                                   />
                                   <button 
                                     onClick={() => handleReview(screening.type, screening.id)}
                                     disabled={reviewLoading || !reviewNote.trim()}
                                     className="bg-slate-900 hover:bg-primary-600 text-white w-24 rounded-[32px] flex flex-col items-center justify-center gap-3 transition-all shadow-3xl active:scale-95 disabled:opacity-30 disabled:grayscale group/post"
                                   >
                                      {reviewLoading ? <Loader2 size={24} className="animate-spin" /> : <Zap className="group-hover/post:scale-125 transition-transform" size={24} />}
                                      <span className="text-[10px] font-black uppercase tracking-widest">Post</span>
                                   </button>
                                </div>
                             </div>
                          )}
                       </motion.div>
                    ))}
                 </div>
              ) : (
                 <motion.div variants={itemVariants} className="card !bg-white/40 backdrop-blur-3xl border-dashed border-2 border-slate-200 py-32 flex flex-col items-center justify-center text-center rounded-[56px]">
                    <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-2xl text-slate-200 mb-8">
                       <History size={48} className="opacity-20 animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-3xl font-display font-black text-slate-900 uppercase tracking-tight">Signal Loss</h3>
                       <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">No medical screening signals have been captured for this identity in the current clinical cluster.</p>
                    </div>
                 </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </motion.div>
  );
};

export default PatientDetail;
