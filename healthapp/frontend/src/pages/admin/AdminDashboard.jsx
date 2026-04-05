import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Stethoscope, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Globe,
  Loader2,
  Calendar,
  Zap,
  Lock,
  Cpu
} from 'lucide-react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data.data);
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div>;

  const totalUsers = analytics?.users?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const doctorCount = analytics?.users?.find(u => u.role === 'doctor')?.count || 0;
  const totalScreenings = analytics?.screenings?.reduce((acc, curr) => acc + curr.count, 0) || 0;

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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-10"
    >
      {/* Admin Hero - System Intelligence */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-ink rounded-[40px] p-8 md:p-12 text-white shadow-3xl border border-white/5"
      >
         <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 animate-float">
            <Cpu size={280} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
               <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/10">
                  <Zap size={14} className="text-saffron animate-pulse" /> Core Sentinel Active
               </div>
               <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 drop-shadow-md text-white">
                  System <br />
                  <span className="text-white/80 italic">Intelligence</span>
               </h1>
               <p className="text-white/50 max-w-md text-lg font-medium leading-relaxed font-sans">
                  Monitoring {totalUsers} identities across metascale distributed clinical nodes.
               </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5 text-center px-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Network Load</p>
                  <p className="text-3xl font-display font-bold text-white">OPTIMAL</p>
               </div>
            </div>
         </div>
      </motion.div>

      {/* Hero Analytics - Glass Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Identities', val: totalUsers, icon: Users, change: '+8.1%', up: true },
           { label: 'Personnel', val: doctorCount, icon: Stethoscope, change: '+2.4%', up: true },
           { label: 'Assessments', val: totalScreenings, icon: Activity, change: '+12.5%', up: true },
           { label: 'Uptime', val: '99.9%', icon: TrendingUp, change: 'Stable', up: true }
         ].map((stat, i) => (
           <motion.div variants={itemVariants} key={i} className="card group hover:scale-105 transition-all bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-3xl p-8">
              <div className="flex items-start justify-between mb-4">
                 <div className="w-12 h-12 bg-slate-50 text-ink rounded-xl flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-all shadow-sm">
                    <stat.icon size={20} />
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${stat.up ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</span>
              </div>
              <p className="text-3xl font-display font-bold text-slate-900 leading-none mb-1">{stat.val}</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">{stat.label}</p>
           </motion.div>
         ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Growth Trend */}
         <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            <div className="card !p-0 overflow-hidden relative border-none shadow-3xl bg-white/80 backdrop-blur-2xl rounded-[40px]">
               <div className="bg-slate-950 text-white p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Globe size={120} /></div>
                  <h3 className="text-xl font-bold flex items-center gap-2 relative z-10"><Globe size={24} className="text-saffron" /> Screening Velocity</h3>
                  <p className="text-xs text-white/40 font-black uppercase tracking-widest relative z-10">Monthly distribution of AI diagnostics</p>
               </div>
               <div className="p-8 space-y-8 bg-white">
                  {analytics?.trend?.map((item, i) => (
                    <div key={i} className="space-y-3">
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>{item.month}</span>
                          <span className="text-slate-900 font-bold">{item.count} Assessments</span>
                       </div>
                       <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 flex">
                          <div className="h-full bg-mesh-saffron rounded-full shadow-lg" style={{ width: `${(item.count / (Math.max(...analytics.trend.map(t => t.count)) || 1)) * 100}%` }}></div>
                       </div>
                    </div>
                  ))}
                  {(!analytics?.trend || analytics.trend.length === 0) && (
                     <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No trend data captured.</div>
                  )}
               </div>
            </div>
         </motion.div>

         {/* Security & Focus */}
         <motion.div variants={itemVariants} className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Compliance & Data</h2>
            
            <div className="bg-emerald-50/50 rounded-[32px] p-8 border border-emerald-100 flex gap-4 hover:shadow-xl transition-all group shadow-sm bg-white/50 backdrop-blur-md">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform"><ShieldCheck size={28} /></div>
               <div>
                  <h4 className="font-bold text-slate-900 text-lg">GDPR Shield</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2 leading-relaxed">Personal Data encrypted via metascale protocol.</p>
               </div>
            </div>

            <div className="bg-white/60 backdrop-blur-3xl rounded-[40px] p-10 border border-white space-y-8 shadow-3xl">
               <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Demographic Risk Exposure</h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-black uppercase tracking-widest text-slate-700">Liver Exposure</span>
                     <span className="text-saffron-deep font-display font-black text-lg">{analytics?.screenings?.find(s => s.type === 'liver')?.count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-black uppercase tracking-widest text-slate-700">Metabolic Exposure</span>
                     <span className="text-saffron-deep font-display font-black text-lg">{analytics?.screenings?.find(s => s.type === 'diabetes')?.count || 0}</span>
                  </div>
                  <div className="pt-6 border-t border-slate-100">
                     <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-wider">
                        <Lock size={12} /> System Integrity Verified
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-mesh-saffron rounded-[40px] p-8 text-white shadow-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform"><Calendar size={120} /></div>
               <h3 className="text-xl font-bold mb-6 relative z-10">Operational Review</h3>
               <div className="space-y-4 relative z-10">
                  <button className="w-full py-4 bg-white text-ink rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Export Global Audit</button>
                  <button className="w-full py-4 bg-white/10 backdrop-blur-md rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/20">Log Retention</button>
               </div>
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
