import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowRight,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import api from '../../services/api';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    total_patients: 0,
    pending_appointments: 0,
    recent_screenings: 0,
    avg_confidence: 0
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = useCallback(async () => {
    try {
      const [statsRes, patientsRes] = await Promise.all([
        api.get('/doctor/stats'),
        api.get('/doctor/patients?limit=5')
      ]);
      setStats(statsRes.data.data);
      setRecentPatients(patientsRes.data.data);
    } catch {
      console.error('Error fetching clinical data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const statCards = useMemo(() => [
    { label: 'Clinical Reach', value: stats.total_patients, icon: Users, color: 'bg-saffron', trend: '+12%' },
    { label: 'Pending Mandates', value: stats.pending_appointments, icon: Calendar, color: 'bg-slate-900', trend: 'Active' },
    { label: 'Spectral Density', value: stats.recent_screenings, icon: Activity, color: 'bg-saffron-deep', trend: 'Audit Req' },
    { label: 'Model Assurance', value: `${(stats.avg_confidence * 100).toFixed(0)}%`, icon: ShieldCheck, color: 'bg-emerald-500', trend: 'SLA OK' }
  ], [stats]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-6 text-white/20">
      <Zap className="animate-spin text-saffron" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Synchronizing Master Node...</p>
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
      className="space-y-16 pb-24"
    >
      {/* Dynamic Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-10">
         <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full text-saffron text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl border border-white/10">
               <Zap size={14} className="animate-pulse" /> Personnel Session: 0x92f1
            </div>
            <h1 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter uppercase leading-none">
               Clinical <br />
               <span className="text-saffron italic font-sans font-medium lowercase">Overview</span>
            </h1>
         </div>
         <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
               <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-1">Temporal Audit</p>
               <p className="text-white font-display font-black text-lg uppercase tracking-tight">{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center text-saffron shadow-4xl cursor-help hover:bg-saffron hover:text-slate-900 transition-all">
               <Clock size={24} />
            </div>
         </div>
      </motion.div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <motion.div 
            variants={itemVariants}
            key={i} 
            className="glass-dark p-10 rounded-[56px] border border-white/5 shadow-5xl group hover:border-saffron/20 transition-all relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-40 group-hover:scale-150 transition-transform"></div>
             <div className="flex justify-between items-start relative z-10 mb-10">
                <div className={`w-14 h-14 ${stat.color} rounded-[24px] flex items-center justify-center text-white shadow-2xl`}>
                   <stat.icon size={24} />
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-saffron bg-saffron/5 px-3 py-1.5 rounded-full border border-saffron/10">
                   {stat.trend} <ArrowUpRight size={10} />
                </div>
             </div>
             <div className="relative z-10">
                <h3 className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-3 italic">{stat.label}</h3>
                <p className="text-5xl font-display font-black text-white tracking-tighter uppercase">{stat.value}</p>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
         {/* Recent Clinical Registry */}
         <motion.div variants={itemVariants} className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-4">
                  <Users className="text-saffron" size={24} /> Registry Hub
                  <div className="h-px w-24 bg-white/5"></div>
               </h2>
               <button className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-saffron transition-colors flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/5">
                  Expand Registry <ArrowRight size={14} />
               </button>
            </div>

            <div className="space-y-6">
               {recentPatients.map((patient) => (
                  <motion.div 
                     whileHover={{ x: 10 }}
                     key={patient.id} 
                     className="glass-dark p-8 rounded-[48px] border border-white/5 flex items-center justify-between shadow-5xl group transition-all relative overflow-hidden"
                  >
                     <div className="absolute left-0 top-0 w-2 h-full bg-saffron opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="flex items-center gap-10">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center text-white font-display font-black text-2xl shadow-3xl text-saffron group-hover:scale-110 transition-transform">
                           {patient.full_name.charAt(0)}
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-tight">{patient.full_name}</h4>
                           <div className="flex items-center gap-6 text-[9px] font-black text-white/20 uppercase tracking-widest">
                              <span className="flex items-center gap-2"><Stethoscope size={10} className="text-saffron/40" /> ID_{patient.id}</span>
                              <span className="flex items-center gap-2"><Activity size={10} className="text-saffron/40" /> META_{patient.age}Y</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-8">
                        <div className="text-right hidden md:block">
                           <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1 flex items-center justify-end gap-2 px-3 py-1 bg-emerald-500/5 rounded-full border border-emerald-500/10">
                              <CheckCircle2 size={10} /> Active
                           </p>
                           <p className="text-[9px] text-white/10 font-black uppercase tracking-widest mt-2">{new Date(patient.created_at).toLocaleDateString()}</p>
                        </div>
                        <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/20 hover:text-saffron hover:bg-saffron/10 hover:border-saffron/20 transition-all shadow-4xl group-hover:rotate-12">
                           <ArrowUpRight size={24} />
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
         </motion.div>

         {/* Protocol Alerts */}
         <motion.div variants={itemVariants} className="lg:col-span-1 space-y-10">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-4">
               <AlertCircle className="text-saffron" size={24} /> System Mandates
            </h2>
            
            <div className="space-y-6">
               <div className="glass-dark p-10 rounded-[56px] border border-white/5 border-l-4 border-l-rose-500/40 relative overflow-hidden group shadow-5xl animate-pulse-slow">
                  <div className="flex items-start gap-8 relative z-10">
                     <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 shadow-2xl">
                        <TrendingUp size={24} />
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] font-display">Priority Alert</h4>
                        <p className="text-white font-display font-black text-sm uppercase tracking-tight leading-relaxed">Elevated Metabolic Risk Vectors detected in Cluster #7.</p>
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Temporal Stamp: 22:41 IST</p>
                     </div>
                  </div>
               </div>

               <div className="glass-dark p-10 rounded-[56px] border border-white/5 border-l-4 border-l-saffron/40 relative overflow-hidden group shadow-5xl">
                  <div className="flex items-start gap-8 relative z-10">
                     <div className="w-12 h-12 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron shadow-2xl">
                        <ShieldCheck size={24} />
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-saffron uppercase tracking-[0.3em] font-display">System Integrity</h4>
                        <p className="text-white font-display font-black text-sm uppercase tracking-tight leading-relaxed">Personnel registry synchronization complete. 0x0 errors detected.</p>
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Protocol: V4.1 Stable</p>
                     </div>
                  </div>
               </div>

               <div className="p-10 rounded-[56px] bg-white/5 border border-white/5 grayscale opacity-50 select-none">
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.15em] leading-relaxed italic text-center">
                     Personnel Dashboard v4.1: Clinical overview is generated based on secure nodal handshakes. All data is encrypted and board-certified.
                  </p>
               </div>
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
};

export default DoctorDashboard;
