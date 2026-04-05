import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  Users, 
  Stethoscope, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Cpu, 
  ChevronRight 
} from 'lucide-react';
import api from '../../services/api';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data.data);
    } catch {
      console.error('Error fetching admin analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.body.classList.add('app-dark-mode');
    fetchAnalytics();
    return () => document.body.classList.remove('app-dark-mode');
  }, [fetchAnalytics]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-6 text-white/20">
      <Zap className="animate-spin text-saffron" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Initializing Core Sentinel...</p>
    </div>
  );

  const totalUsers = analytics?.users?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const doctorCount = analytics?.users?.find(u => u.role === 'doctor')?.count || 0;
  const totalScreenings = analytics?.screenings?.reduce((acc, curr) => acc + curr.count, 0) || 0;

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
      className="space-y-12 pb-20 max-w-7xl mx-auto px-4 md:px-0"
    >
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-mesh-app-dark rounded-[56px] p-10 md:p-16 text-white shadow-5xl border border-white/5 group">
         <div className="absolute inset-0 bg-mesh-saffron opacity-5"></div>
         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 transition-transform duration-1000 group-hover:scale-110">
            <Cpu size={300} />
         </div>
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="space-y-10">
               <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-2 border border-white/10">
                  <ShieldCheck size={14} className="text-emerald-400 animate-pulse" /> Global System Integrity
               </div>
               <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-none uppercase">
                  Metascale <br />
                  <span className="text-saffron italic font-sans font-medium lowercase">Sentinel Hub</span>
               </h1>
               <div className="flex flex-wrap gap-4 pt-4">
                  <div className="bg-white/5 border border-white/10 rounded-[24px] px-8 py-5 flex items-center gap-4 shadow-xl backdrop-blur-xl">
                     <div className="w-10 h-10 bg-saffron text-ink rounded-xl flex items-center justify-center font-black text-lg">{totalUsers}</div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Registered <br />Identities</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-[24px] px-8 py-5 flex items-center gap-4 shadow-xl backdrop-blur-xl">
                     <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center font-black text-lg">OPTIMAL</div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Internal <br />Node Load</p>
                  </div>
               </div>
            </div>
            <div className="flex bg-white/5 backdrop-blur-xl rounded-[40px] p-2 border border-white/10 shadow-5xl">
               <div className="px-12 py-8 text-center border-r border-white/5">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Assessments</p>
                  <p className="text-4xl font-display font-black text-white">{totalScreenings}</p>
               </div>
               <div className="px-12 py-8 text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">State</p>
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                       <p className="text-[10px] font-black text-white uppercase tracking-widest">Stable</p>
                    </div>
               </div>
            </div>
         </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Identities', val: totalUsers, icon: Users, accent: 'saffron' },
            { label: 'Personnel Nodes', val: doctorCount, icon: Stethoscope, accent: 'white' },
            { label: 'Total Audits', val: totalScreenings, icon: Activity, accent: 'emerald-400' },
            { label: 'Network Uptime', val: '100%', icon: TrendingUp, accent: 'saffron' }
          ].map((stat, i) => (
             <div key={i} className="glass-dark p-8 rounded-[40px] border border-white/5 shadow-4xl group transition-all hover:border-white/20">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 bg-white/5 text-${stat.accent} rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                     <stat.icon size={24} />
                  </div>
                  <div>
                     <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                     <p className="text-3xl font-display font-black text-white">{stat.val}</p>
                  </div>
                </div>
             </div>
          ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-12">
         <motion.div variants={itemVariants} className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between px-4">
               <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-4">
                  <BarChart3 className="text-saffron" size={28} />
                  Population Trends
                  <div className="h-px w-20 bg-white/5"></div>
               </h2>
               <div className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-3">
                  Historical Log <ChevronRight size={14} />
               </div>
            </div>
            <div className="glass-dark rounded-[56px] border border-white/5 overflow-hidden shadow-5xl p-10 md:p-14">
               <div className="space-y-12">
                  {analytics?.trend?.map((item, i) => (
                    <div key={i} className="space-y-4 group">
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-white/40">{item.month}</span>
                          <span className="text-white">{item.count} Personnel Screened</span>
                       </div>
                       <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 flex">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(item.count / (Math.max(...analytics.trend.map(t => t.count)) || 1)) * 100}%` }}
                             transition={{ duration: 1, delay: i * 0.1 }}
                             className="h-full bg-gradient-to-r from-saffron to-saffron-deep rounded-full shadow-[0_0_20px_rgba(247,147,30,0.3)]"
                          ></motion.div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </motion.div>

         <motion.div variants={itemVariants} className="space-y-12">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">Security</h2>
            <div className="bg-white/5 border border-white/10 rounded-[48px] p-10 text-white shadow-5xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-mesh-saffron opacity-5"></div>
               <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 transition-transform duration-1000 group-hover:scale-125"><Lock size={120} /></div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-saffron text-ink rounded-2xl transition-transform group-hover:rotate-12"><Lock size={28} /></div>
                  <h3 className="font-display font-black text-xl uppercase tracking-tight">Encryption</h3>
               </div>
               <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-relaxed mb-10">Metascale identities are cryptographically isolated and audited via clinical node protocols.</p>
               <button className="btn-primary w-full !py-5">Audit Global Keys</button>
            </div>
            <div className="glass-dark rounded-[48px] p-10 border border-white/5 shadow-5xl space-y-10">
               <h3 className="font-black text-[10px] uppercase tracking-widest text-white/20">Exposure Metrics</h3>
               <div className="space-y-8">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Liver Exposure</span>
                     <span className="text-saffron font-display font-black text-2xl">{analytics?.screenings?.find(s => s.type === 'liver')?.count || 0}</span>
                  </div>
                  <div className="h-px bg-white/5"></div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Metabolic Load</span>
                     <span className="text-saffron font-display font-black text-2xl">{analytics?.screenings?.find(s => s.type === 'diabetes')?.count || 0}</span>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
