import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Stethoscope, 
  ArrowRight, 
  Info,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Globe,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

const ScreeningPortal = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-16 pb-20"
    >
      {/* Dynamic Hero Section */}
      <motion.div variants={itemVariants} className="text-center space-y-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-64 h-64 bg-saffron/10 blur-[100px] animate-pulse"></div>
        <div className="inline-flex items-center gap-3 bg-saffron/10 px-6 py-2 rounded-full text-saffron-deep text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-saffron/20 shadow-lg shadow-saffron/5">
           <Zap size={14} /> Diagnostic Engine v3.0
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 tracking-tighter leading-[0.9]">
          Precision AI <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-saffron-deep italic font-sans font-medium">Health Screening</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium uppercase tracking-widest text-xs">
          Select a specialized module to evaluate clinical biomarkers against validated population datasets.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Liver Card */}
        <motion.div 
          variants={itemVariants}
          className="group relative !bg-white/40 backdrop-blur-3xl rounded-[48px] border border-white/60 p-10 shadow-3xl hover:shadow-4xl transition-all duration-500 overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
              <Database size={240} />
           </div>
           
           <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-[28px] shadow-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform text-saffron-deep border border-slate-50">
                <Database size={36} />
              </div>
              
              <h2 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tight uppercase">Liver Health <br/>Synchronization</h2>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium text-sm">Detailed analysis using ILPD parameters including Bilirubin, Enzyme markers (ALT/AST), and Protein ratios to detect sub-clinical liver variations.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-12">
                 <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                    <Activity size={16} className="text-saffron" /> Biomarker Match
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                    <ShieldCheck size={16} className="text-saffron" /> Clinical Validated
                 </div>
              </div>

              <Link to="/patient/screening/liver" className="w-full bg-slate-900 text-white py-6 px-8 rounded-[24px] flex items-center justify-between shadow-3xl hover:bg-saffron hover:shadow-saffron/20 transition-all active:scale-95 group/btn">
                 <span className="font-display font-black uppercase tracking-widest text-sm">Initiate Liver Protocol</span>
                 <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
              </Link>
           </div>
        </motion.div>

        {/* Diabetes Card */}
        <motion.div 
          variants={itemVariants}
          className="group relative !bg-white/40 backdrop-blur-3xl rounded-[48px] border border-white/60 p-10 shadow-3xl hover:shadow-4xl transition-all duration-500 overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
              <Stethoscope size={240} />
           </div>
           
           <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-[28px] shadow-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform text-saffron-deep border border-slate-50">
                <Stethoscope size={36} />
              </div>
              
              <h2 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tight uppercase">Metabolic Risk <br/>Analysis</h2>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium text-sm">Multi-vector evaluation of glycemic history, lifestyle habits, and physiological indicators to predict metabolic drift and Type-2 susceptibility.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-12">
                 <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                    <Zap size={16} className="text-saffron" /> Real-time Synthesis
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                    <Globe size={16} className="text-saffron" /> Global Dataset
                 </div>
              </div>

              <Link to="/patient/screening/diabetes" className="w-full bg-slate-900 text-white py-6 px-8 rounded-[24px] flex items-center justify-between shadow-3xl hover:bg-saffron hover:shadow-saffron/20 transition-all active:scale-95 group/btn">
                 <span className="font-display font-black uppercase tracking-widest text-sm">Initiate Metabolic Protocol</span>
                 <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
              </Link>
           </div>
        </motion.div>
      </div>

      <motion.div 
        variants={itemVariants}
        className="bg-slate-900 rounded-[40px] p-10 md:p-14 flex flex-col md:flex-row items-center gap-10 border border-white/5 shadow-4xl relative overflow-hidden group"
      >
         <div className="absolute inset-0 bg-mesh-clinical opacity-20 group-hover:opacity-30 transition-opacity"></div>
         <div className="shrink-0 w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[28px] border border-white/10 flex items-center justify-center text-saffron relative z-10 shadow-3xl">
            <ShieldCheck size={40} className="animate-pulse" />
         </div>
         <div className="relative z-10 space-y-4">
            <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">Security & Clinical Integrity</h3>
            <p className="text-white/50 text-xs font-medium leading-relaxed uppercase tracking-[0.1em] max-w-3xl">Screening parameters are processed via Zero-Knowledge architectures. These results provide risk awareness and do not substitute clinical diagnosis. Please coordinate with an expert specialist for formal diagnostic sessions.</p>
            <div className="pt-4 flex items-center gap-6">
               <div className="flex -space-x-4">
                  {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-white/10 border-2 border-slate-900 backdrop-blur-md"></div>)}
                  <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center text-slate-900 text-[10px] font-black border-2 border-slate-900">+5k</div>
               </div>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Clinical Sessions Monitored</p>
            </div>
         </div>
      </motion.div>
    </motion.div>
  );
};

export default ScreeningPortal;
