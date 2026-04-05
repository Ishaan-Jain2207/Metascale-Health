import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  MessageSquare,
  AlertTriangle,
  FileText,
  Zap,
  Globe,
  Database,
  Loader2,
  TrendingUp,
  Download,
  Share2
} from 'lucide-react';
import api from '../../services/api';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const PredictionResult = () => {
  const { type, id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResult = useCallback(async () => {
    try {
      const res = await api.get(`/predict/result/${type}/${id}`);
      setResult(res.data.data);
    } catch {
      console.error('Prediction retrieval failed');
    } finally {
      setLoading(false);
    }
  }, [type, id]);

  useEffect(() => {
    document.body.classList.add('app-dark-mode');
    fetchResult();
    return () => document.body.classList.remove('app-dark-mode');
  }, [fetchResult]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-6 text-white/20">
      <Zap className="animate-spin text-saffron" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Decoding Clinical Paradox...</p>
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
      <motion.div variants={itemVariants} className="text-center space-y-10 relative py-20 border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-saffron/10 blur-[150px] rounded-full opacity-40"></div>
        <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full text-saffron text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-white/10 shadow-2xl">
           <ShieldCheck size={14} className="animate-pulse" /> Diagnostic Integrity: v4.1 STABLE
        </div>
        <h1 className="text-6xl md:text-[7rem] font-display font-black text-white tracking-tighter leading-none uppercase">
          Signal <br/>
          <span className="text-saffron italic font-sans font-medium lowercase">Decoded</span>
        </h1>
        <p className="text-white/20 text-xs md:text-sm max-w-2xl mx-auto font-black uppercase tracking-[0.3em] leading-relaxed">
           Clinical deep-learning has extracted biovariable vectors for your identity. Audit the results below.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-16 py-12">
         {/* Risk Assessment Cluster */}
         <motion.div variants={itemVariants} className="lg:col-span-2 space-y-12">
            <div className="glass-dark p-16 rounded-[72px] border border-white/10 shadow-5xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/5 rounded-full -mr-40 -mt-40 blur-3xl opacity-40 group-hover:scale-125 transition-transform"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
                  <div className="space-y-10 text-center md:text-left">
                     <div className="space-y-4">
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] italic mb-2">Protocol Spectrum</p>
                        <h2 className="text-5xl font-display font-black text-white uppercase tracking-tight">{type} Screening</h2>
                     </div>
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] min-w-[140px] text-center">
                           <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-1">Status</p>
                           <p className="text-2xl font-display font-black text-white uppercase">{result?.risk_band}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] min-w-[140px] text-center">
                           <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-1">Confidence</p>
                           <p className="text-2xl font-display font-black text-saffron">{(result?.confidence * 100).toFixed(0)}%</p>
                        </div>
                     </div>
                  </div>

                  <div className="relative w-64 h-64 flex items-center justify-center">
                     <div className={`absolute inset-0 rounded-full blur-[60px] opacity-20 ${
                        result?.risk_band === 'Minimal' ? 'bg-emerald-500' :
                        result?.risk_band === 'Elevated' ? 'bg-amber-500' :
                        'bg-rose-500'
                     }`}></div>
                     <svg className="w-56 h-56 transform -rotate-90">
                        <circle cx="112" cy="112" r="100" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
                        <motion.circle 
                           cx="112" cy="112" r="100" fill="transparent" 
                           stroke={result?.risk_band === 'Minimal' ? '#10b981' : result?.risk_band === 'Elevated' ? '#f59e0b' : '#f43f5e'} 
                           strokeWidth="16" strokeDasharray="628" 
                           initial={{ strokeDashoffset: 628 }}
                           animate={{ strokeDashoffset: 628 - (628 * (result?.confidence || 0)) }}
                           transition={{ duration: 2, ease: "easeOut" }}
                           strokeLinecap="round"
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Activity className="text-white/20 mb-2" size={32} />
                        <span className="text-xs font-black text-white/40 uppercase tracking-widest">Spectral</span>
                     </div>
                  </div>
               </div>

               <div className="mt-16 p-10 bg-white/5 border border-white/5 rounded-[48px] relative overflow-hidden">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-12 w-1 bg-saffron rounded-full"></div>
                  <MessageSquare className="absolute right-10 top-10 text-white/5" size={48} />
                  <div className="space-y-6 relative z-10">
                     <h4 className="text-[10px] font-black text-saffron uppercase tracking-[0.3em] font-display">Clinical Interpretation</h4>
                     <p className="text-white/80 font-display font-medium text-lg leading-relaxed italic pr-12">"{result?.interpretation}"</p>
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="glass-dark p-10 rounded-[48px] border border-white/5 space-y-6">
                  <TrendingUp className="text-saffron" size={24} />
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Metadata Audit</h4>
                  <p className="text-[10px] text-white/30 font-medium leading-relaxed uppercase tracking-[0.2em]">Biovariable vectors were cross-referenced against 10.4M data points from the South Asian demographic cohort.</p>
               </div>
               <div className="glass-dark p-10 rounded-[48px] border border-white/5 space-y-6">
                  <Database className="text-saffron" size={24} />
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Node Encryption</h4>
                  <p className="text-[10px] text-white/30 font-medium leading-relaxed uppercase tracking-[0.2em]">Diagnostic signatures are SHA-256 hashed and stored on Metascale nodal repositories.</p>
               </div>
            </div>
         </motion.div>

         {/* Intervention Pipeline */}
         <motion.div variants={itemVariants} className="lg:col-span-1 space-y-10">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-4">
               <Zap className="text-saffron" size={24} /> Action Mandates
            </h2>
            
            <div className="space-y-6">
               <Link to="/patient/appointments" className="block glass-dark p-10 rounded-[56px] border border-white/10 group hover:border-saffron/40 transition-all shadow-5xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-full bg-saffron opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="space-y-8 relative z-10">
                     <div className="w-14 h-14 bg-saffron rounded-full flex items-center justify-center text-slate-900 shadow-xl group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-xl font-display font-black text-white uppercase tracking-tight">Personnel Audit</h4>
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-loose">Synchronize with specialized personnel for a diagnostic mandate verification.</p>
                     </div>
                     <div className="flex items-center gap-4 text-[10px] font-black text-saffron uppercase tracking-widest group-hover:gap-6 transition-all">
                        Initiate Protocol <ArrowRight size={14} />
                     </div>
                  </div>
               </Link>

               <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center gap-4 py-8 px-6 glass-dark rounded-[40px] border border-white/5 text-white/20 hover:text-saffron transition-all hover:border-saffron/20 group">
                     <Download size={24} className="group-hover:-translate-y-1 transition-transform" />
                     <span className="text-[8px] font-black uppercase tracking-[0.3em]">Temporal Log</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-4 py-8 px-6 glass-dark rounded-[40px] border border-white/5 text-white/20 hover:text-saffron transition-all hover:border-saffron/20 group">
                     <Share2 size={24} className="group-hover:-translate-y-1 transition-transform" />
                     <span className="text-[8px] font-black uppercase tracking-[0.3em]">Secure Pipe</span>
                  </button>
               </div>

               <div className="p-10 rounded-[56px] bg-white/5 border border-white/5 grayscale opacity-30 select-none space-y-4">
                  <Globe size={24} className="mx-auto text-white/20" />
                  <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] leading-relaxed italic text-center">
                     All screenings are preventative awareness protocols. If Elevated Risk was detected, immediate synchronization with medical personnel is mandated.
                  </p>
               </div>
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
};

export default PredictionResult;
