import React, { useState, useEffect, useCallback, useMemo } from 'react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */
import { 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare,
  Zap,
  Globe,
  Database,
  Loader2,
  Calendar,
  Lock,
  ArrowUpRight,
  TrendingUp,
  History as HistoryIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
     try {
        const [historyRes] = await Promise.all([
           api.get('/predict/history')
        ]);
        setHistory(historyRes.data.data.slice(0, 3));
     } catch {
        console.error('Error fetching clinical vectors');
     } finally {
        setLoading(false);
     }
  }, []);

  useEffect(() => {
    document.body.classList.add('app-dark-mode');
    fetchData();
    return () => document.body.classList.remove('app-dark-mode');
  }, [fetchData]);

  const dashboardCards = useMemo(() => [
     {
        title: "Clinical Screening",
        label: "AI Diagnostic Portal",
        desc: "Initialize deep-learning protocols for liver and metabolic risk assessment.",
        path: "/patient/screening",
        icon: Zap,
        accent: "saffron"
     },
     {
        title: "Medical History",
        label: "Temporal Ledger",
        desc: "Audit your decrypted clinical vectors and diagnostic history across time.",
        path: "/patient/history",
        icon: HistoryIcon,
        accent: "white"
     },
     {
        title: "Personnel Sync",
        label: "Medical Appointments",
        desc: "Synchronize with specialized personnel for diagnostic mandate verification.",
        path: "/patient/appointments",
        icon: Activity,
        accent: "white"
     }
  ], []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-6 text-white/20">
      <Zap className="animate-spin text-saffron" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Synchronizing Clinical Identity...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-16 pb-24 px-4 md:px-0"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
         <div className="space-y-6">
            <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-saffron text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">
               <ShieldCheck size={14} className="animate-pulse" /> Sentinel v4.1 Active
            </div>
            <h1 className="text-6xl md:text-[7rem] font-display font-black text-white tracking-tighter leading-[0.85] uppercase">
               Identity <br />
               <span className="text-saffron italic font-sans font-medium lowercase">Nexus</span>
            </h1>
         </div>
         <div className="flex items-center gap-4">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 min-w-[200px] text-center shadow-5xl group overflow-hidden relative">
               <div className="absolute inset-0 bg-mesh-saffron opacity-5 group-hover:opacity-10 transition-opacity"></div>
               <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 relative z-10">Diagnostic Confidence</p>
               <p className="text-5xl font-display font-black text-white relative z-10">98.4%</p>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {dashboardCards.map((card, i) => (
            <Link 
               to={card.path} 
               key={i} 
               className="glass-dark p-12 rounded-[64px] border border-white/5 shadow-5xl group transition-all hover:border-saffron/40 hover:-translate-y-4 relative overflow-hidden"
            >
               <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${card.accent === 'saffron' ? 'bg-saffron' : 'bg-white'}`}></div>
               <div className="space-y-10 relative z-10">
                  <div className={`w-20 h-20 rounded-[32px] border flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 ${card.accent === 'saffron' ? 'bg-saffron text-ink border-saffron shadow-4xl' : 'bg-white/5 text-white border-white/10'}`}>
                     <card.icon size={36} />
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] font-display">{card.label}</p>
                     <h3 className="text-4xl font-display font-black text-white uppercase tracking-tight leading-none">{card.title}</h3>
                     <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-loose italic">{card.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black text-white/20 group-hover:text-saffron transition-all uppercase tracking-widest pt-4">
                     Initialize Protocol <ArrowUpRight size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                  </div>
               </div>
            </Link>
         ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-12 pt-10">
         <div className="lg:col-span-3 space-y-10">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-4">
               <Activity className="text-saffron" size={24} /> Recent Handshakes
               <div className="h-px w-20 bg-white/5"></div>
            </h2>
            <div className="space-y-6">
               <AnimatePresence mode="popLayout">
                  {history.map((item) => (
                     <motion.div 
                        layout 
                        key={item.id} 
                        className="glass-dark p-8 rounded-[48px] border border-white/5 flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all shadow-4xl"
                        onClick={() => navigate(`/patient/result/${item.type}/${item.id}`)}
                     >
                        <div className="flex items-center gap-10">
                           <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center text-saffron group-hover:rotate-12 transition-transform">
                              <ShieldCheck size={28} />
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none">{item.type} Vector</h4>
                              <p className="text-[10px] text-white/20 font-black uppercase tracking-widest italic">{item.interpretation}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="px-6 py-2 rounded-full border border-saffron/20 bg-saffron/5 text-saffron text-[10px] font-black uppercase tracking-widest group-hover:bg-saffron group-hover:text-ink transition-all">
                              {item.risk_band}
                           </div>
                           <ArrowRight size={20} className="text-white/10 group-hover:text-saffron group-hover:translate-x-3 transition-all" />
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>

         <div className="lg:col-span-1 space-y-10">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">Security Node</h2>
            <div className="bg-white/5 border border-white/10 rounded-[48px] p-10 space-y-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-mesh-saffron opacity-5"></div>
               <div className="w-12 h-12 bg-saffron rounded-2xl flex items-center justify-center text-ink shadow-xl group-hover:rotate-12 transition-transform">
                  <Lock size={20} />
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Metadata encryption active</p>
                  <p className="text-[9px] text-white/20 font-black uppercase tracking-widest leading-relaxed italic">All clinical vectors are SHA-256 hashed and stored on Metascale nodal repositories for diagnostic integrity.</p>
               </div>
               <div className="pt-4 flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-saffron transition-all">
                  Audit Protocol <ArrowUpRight size={14} />
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default PatientDashboard;
