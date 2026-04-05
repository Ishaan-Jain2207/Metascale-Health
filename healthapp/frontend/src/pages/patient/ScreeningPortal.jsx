import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Zap, 
  FlaskConical, 
  Target,
  Globe,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const ScreeningPortal = () => {
  useEffect(() => {
    document.body.classList.add('app-dark-mode');
    return () => document.body.classList.remove('app-dark-mode');
  }, []);

  const screeningProtocols = [
    {
      id: 'liver',
      title: 'Liver Diagnostic',
      label: 'Enzymatic Vector Analysis',
      desc: 'Deep-learning audit of hepatic biovariables, enzymes, and metabolic markers.',
      icon: FlaskConical,
      path: '/patient/screening/liver',
      accent: 'saffron'
    },
    {
      id: 'diabetes',
      title: 'Metabolic Audit',
      label: 'Glycemic Spectrum Protocol',
      desc: 'Predictive modeling of glucose regulation and systemic metabolic load.',
      icon: Activity,
      path: '/patient/screening/diabetes',
      accent: 'white'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-16 pb-24 px-4 md:px-0"
    >
      <div className="text-center space-y-8 py-16 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-saffron/5 blur-[120px] rounded-full opacity-40"></div>
        <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-saffron text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl relative z-10">
           <ShieldCheck size={14} className="animate-pulse" /> Diagnostic Integrity: v4.1 STABLE
        </div>
        <h1 className="text-6xl md:text-[8rem] font-display font-black text-white tracking-tighter leading-none uppercase relative z-10">
           Screening <br />
           <span className="text-saffron italic font-sans font-medium lowercase">Nexus</span>
        </h1>
        <p className="text-white/20 text-[10px] md:text-xs max-w-2xl mx-auto font-black uppercase tracking-[0.3em] leading-relaxed relative z-10">
           Initialize high-fidelity clinical screening protocols. Our core neural net audits 40+ biovariable vectors for predictive accuracy.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 pt-10">
         {screeningProtocols.map((protocol) => (
            <Link 
               to={protocol.path} 
               key={protocol.id} 
               className="glass-dark p-12 rounded-[72px] border border-white/5 shadow-5xl group transition-all hover:border-saffron/40 hover:-translate-y-4 relative overflow-hidden"
            >
               <div className={`absolute -right-10 -top-10 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${protocol.accent === 'saffron' ? 'bg-saffron' : 'bg-white'}`}></div>
               <div className="space-y-10 relative z-10">
                  <div className={`w-20 h-20 rounded-[32px] border flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 ${protocol.accent === 'saffron' ? 'bg-saffron text-ink border-saffron shadow-4xl' : 'bg-white/5 text-white border-white/10'}`}>
                     <protocol.icon size={36} />
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] font-display">{protocol.label}</p>
                     <h3 className="text-5xl font-display font-black text-white uppercase tracking-tight leading-none">{protocol.title}</h3>
                     <p className="text-[11px] text-white/30 font-black uppercase tracking-widest leading-loose italic">{protocol.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black text-white/20 group-hover:text-saffron transition-all uppercase tracking-widest pt-4">
                     Initialize Protocol <ArrowUpRight size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                  </div>
               </div>
            </Link>
         ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 pt-10">
         {[
            { icon: Target, title: "Precision", desc: "98.4% predictive accuracy on Indian demographic clusters." },
            { icon: Zap, title: "Velocity", desc: "Real-time vector extraction via Metascale Nodal Repositories." },
            { icon: Globe, title: "Security", desc: "SHA-256 identity isolation protocols active." }
         ].map((card, i) => (
            <div key={i} className="glass-dark p-10 rounded-[48px] border border-white/5 space-y-6 group hover:border-white/10 transition-all">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-saffron shadow-xl group-hover:scale-110 transition-transform">
                  <card.icon size={20} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{card.title} Protocol</h4>
                  <p className="text-[9px] text-white/20 font-black uppercase tracking-widest leading-relaxed italic">{card.desc}</p>
               </div>
            </div>
         ))}
      </div>
    </motion.div>
  );
};

export default ScreeningPortal;
