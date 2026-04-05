import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft, 
  Download, 
  Printer, 
  Share2,
  Calendar,
  ClipboardList,
  Info,
  ChevronRight,
  Activity,
  Loader2,
  Zap,
  ShieldCheck,
  FileText,
  TrendUp
} from 'lucide-react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const PredictionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};
  const type = location.state?.type;
  const [aiInsights, setAiInsights] = React.useState('');
  const [loadingAi, setLoadingAi] = React.useState(false);
  const [aiError, setAiError] = React.useState('');

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-in fade-in duration-700">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-200 shadow-inner"
        >
           <ClipboardList size={64} />
        </motion.div>
        <div className="space-y-4">
           <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight uppercase">Session Expired</h2>
           <p className="text-slate-400 max-w-sm font-medium uppercase text-[10px] tracking-[0.2em]">No screening vector found in cache. Re-initiate analysis.</p>
        </div>
        <Link to="/patient/screening" className="bg-mesh-saffron text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
           <ArrowLeft size={18} /> Restart Protocol
        </Link>
      </div>
    );
  }

  const getRiskTheme = (band) => {
    switch (band) {
      case 'Minimal': return {
        bg: 'bg-emerald-500',
        mesh: 'bg-mesh-saffron', // Using saffron for "positive energy"
        text: 'text-emerald-500',
        border: 'border-emerald-500/20',
        pill: 'bg-emerald-500/10 text-emerald-600',
        icon: <CheckCircle2 className="text-emerald-500" size={48} />
      };
      case 'Elevated': return {
        bg: 'bg-amber-500',
        mesh: 'bg-mesh-saffron',
        text: 'text-amber-500',
        border: 'border-amber-500/20',
        pill: 'bg-amber-500/10 text-amber-600',
        icon: <AlertTriangle className="text-amber-500" size={48} />
      };
      case 'Severe': return {
        bg: 'bg-orange-500',
        mesh: 'bg-mesh-saffron opacity-80',
        text: 'text-orange-500',
        border: 'border-orange-500/20',
        pill: 'bg-orange-500/10 text-orange-600',
        icon: <AlertTriangle className="text-orange-500" size={48} />
      };
      case 'Critical': return {
        bg: 'bg-rose-500',
        mesh: 'bg-mesh-clinical hue-rotate-[180deg]', // Dark blue/red feel
        text: 'text-rose-500',
        border: 'border-rose-500/20',
        pill: 'bg-rose-500/10 text-rose-600',
        icon: <XCircle className="text-rose-500" size={48} />
      };
      default: return {
        bg: 'bg-slate-500',
        mesh: 'bg-mesh-clinical',
        text: 'text-slate-500',
        border: 'border-slate-500/20',
        pill: 'bg-slate-500/10 text-slate-600',
        icon: <Info className="text-slate-500" size={48} />
      };
    }
  };

  const theme = getRiskTheme(result.riskBand);

  const handlePrint = () => window.print();

  const handleGenerateAI = async () => {
    setLoadingAi(true);
    setAiError('');
    try {
       const res = await api.post('/predict/explain', {
          type,
          data: result.features || {},
          result: {
             riskBand: result.riskBand,
             interpretation: result.interpretation,
             confidence: result.confidence
          }
       });
       setAiInsights(res.data.data.explanation);
    } catch (err) {
       setAiError('Failed to generate clinical AI review. Please try again later.');
    } finally {
       setLoadingAi(false);
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-12 pb-20 print:p-0"
    >
      <div className="flex items-center justify-between print:hidden">
        <Link to="/patient/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-saffron-deep flex items-center gap-3 transition-colors group">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-all shadow-sm">
            <ArrowLeft size={14} />
          </div>
          Return to Hub
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={handlePrint} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-saffron hover:shadow-xl transition-all shadow-md">
             <Printer size={20} />
          </button>
          <button onClick={handlePrint} className="bg-slate-900 text-white px-8 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-3">
             <Download size={16} className="text-saffron" /> Generate PDF Report
          </button>
        </div>
      </div>

      {/* Main Result Hero */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-slate-900 rounded-[56px] text-white shadow-3xl border border-white/5"
      >
         <div className={`absolute inset-0 ${theme.mesh} opacity-40`}></div>
         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
            <Activity size={320} />
         </div>

         <div className="relative z-10 p-10 md:p-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-saffron text-[10px] font-black uppercase tracking-[0.3em]">
                     <ShieldCheck size={14} /> Diagnostic Vector Captured
                  </div>
                  <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.9]">
                    Metascale <br/> 
                    <span className="text-white/40 italic font-sans font-medium">Health Insights</span>
                  </h1>
                  <p className="text-white/40 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                    {type} Screening Analysis <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span> {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
               </div>
               
               <div className="relative group">
                  <div className="w-48 h-48 md:w-56 md:h-56 bg-white/5 backdrop-blur-3xl rounded-[60px] flex flex-col items-center justify-center border border-white/10 shadow-4xl relative overflow-hidden">
                     <div className="absolute inset-0 bg-mesh-saffron opacity-0 group-hover:opacity-10 transition-opacity"></div>
                     <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-2">Confidence Index</p>
                     <p className="text-6xl md:text-7xl font-display font-black text-saffron drop-shadow-2xl">
                        {(result.confidence * 100).toFixed(0)}<span className="text-2xl opacity-40">%</span>
                     </p>
                     <div className="absolute bottom-6 flex gap-1">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-saffron/20 animate-pulse" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
         {/* Risk Assessment Column */}
         <div className="lg:col-span-1 space-y-8">
            <motion.div variants={itemVariants} className="card !bg-white/40 backdrop-blur-3xl border border-white/60 p-10 rounded-[48px] shadow-3xl text-center space-y-8">
               <div className="relative mx-auto w-24 h-24">
                  <div className={`absolute inset-0 ${theme.bg} opacity-20 blur-2xl rounded-full scale-150`}></div>
                  <div className="relative w-24 h-24 bg-white rounded-[32px] shadow-2xl flex items-center justify-center">
                     {theme.icon}
                  </div>
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Risk Status</p>
                  <p className={`text-4xl font-display font-black p-4 rounded-[24px] uppercase tracking-tighter ${theme.text}`}>
                     {result.riskBand}
                  </p>
               </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-slate-900 rounded-[40px] p-10 text-white shadow-3xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <FileText size={200} />
               </div>
               <h3 className="text-xl font-display font-black uppercase tracking-tight mb-6">Expert <br/>Consultation</h3>
               <p className="text-white/50 text-[10px] font-black uppercase tracking-widest leading-relaxed mb-10">Sync this report with a board-certified specialist for a clinical diagnostic review.</p>
               <Link 
                  to="/patient/appointments" 
                  state={{ prefill: { type, risk: result.riskBand } }}
                  className="w-full flex items-center justify-center gap-3 bg-mesh-saffron px-8 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:shadow-2xl transition-all shadow-xl active:scale-95"
               >
                  Connect with Specialist <ChevronRight size={14} />
               </Link>
            </motion.div>
         </div>

         {/* Interpretation & AI Column */}
         <div className="lg:col-span-2 space-y-12">
            <motion.section variants={itemVariants} className="space-y-6">
               <h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                  Clinical Interpretation
                  <div className="h-px flex-1 bg-slate-100"></div>
               </h3>
               <div className="card !bg-white/40 backdrop-blur-3xl border border-white/60 p-10 rounded-[48px] shadow-3xl">
                  <div className={`p-8 rounded-[32px] border ${theme.border} ${theme.pill} text-lg font-medium leading-relaxed italic relative`}>
                     <span className="absolute top-2 left-4 text-6xl opacity-10">"</span>
                     {result.interpretation}
                  </div>

                  <div className="mt-12 space-y-8">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Zap size={14} className="text-saffron-deep" /> Strategic Interventions
                     </h4>
                     <div className="grid md:grid-cols-2 gap-4">
                        {result.recommendations && result.recommendations.map((rec, i) => (
                           <motion.div 
                              key={i} 
                              whileHover={{ x: 5 }}
                              className="flex items-start gap-4 p-5 rounded-[24px] bg-white border border-slate-50 shadow-sm hover:shadow-xl transition-all group border-b-4 border-b-saffron/10 hover:border-b-saffron"
                           >
                              <div className="shrink-0 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-display font-black text-sm">
                                 {i + 1}
                              </div>
                              <p className="text-slate-500 font-bold text-xs leading-relaxed uppercase tracking-tight group-hover:text-slate-900 transition-colors pt-1">
                                {rec}
                              </p>
                           </motion.div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-6">
               <h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                  AI Deep Insights
                  <div className="h-px flex-1 bg-slate-100"></div>
               </h3>
               
               <AnimatePresence mode="wait">
                  {loadingAi ? (
                     <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="card !bg-white p-12 rounded-[48px] shadow-3xl text-center space-y-6"
                     >
                        <div className="relative mx-auto w-20 h-20">
                           <Loader2 className="animate-spin text-saffron-deep" size={80} />
                           <div className="absolute inset-0 bg-saffron/10 blur-2xl animate-pulse rounded-full"></div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-display">Parsing Biological Vectors...</p>
                     </motion.div>
                  ) : aiInsights ? (
                     <motion.div 
                        key="insights"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="card !bg-slate-900 border border-white/5 p-12 rounded-[56px] shadow-4xl relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                           <Zap size={120} className="text-saffron" />
                        </div>
                        <div className="relative z-10 space-y-8">
                           <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-saffron text-slate-900 rounded-2xl flex items-center justify-center shadow-2xl">
                                 <ShieldCheck size={24} />
                              </div>
                              <h4 className="text-xl font-display font-black text-white uppercase tracking-tight">Validated Synthetic Review</h4>
                           </div>
                           <div className="prose prose-invert prose-slate max-w-none">
                              <pre className="whitespace-pre-wrap font-sans text-white/70 leading-relaxed text-sm font-medium">
                                 {aiInsights}
                              </pre>
                           </div>
                        </div>
                     </motion.div>
                  ) : (
                     <motion.div 
                        key="cta"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="card !bg-white/40 backdrop-blur-3xl border-dashed border-2 border-slate-200 p-12 rounded-[48px] text-center space-y-8"
                     >
                        <div className="w-20 h-20 bg-white rounded-[32px] shadow-xl mx-auto flex items-center justify-center text-slate-200">
                           <Activity size={40} className="animate-pulse" />
                        </div>
                        <div className="space-y-4">
                           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto">Generate a detailed biological explanation of these results using our clinical LLM engine.</p>
                           <button 
                             onClick={handleGenerateAI}
                             className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-saffron hover:shadow-2xl transition-all shadow-xl active:scale-95"
                           >
                              Synthesize Detailed Review
                           </button>
                        </div>
                        {aiError && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">{aiError}</p>}
                     </motion.div>
                  )}
               </AnimatePresence>
            </motion.section>
         </div>
      </div>

      {/* Security Footer */}
      <motion.div 
         variants={itemVariants}
         className="flex items-center gap-6 p-8 bg-slate-900/5 rounded-[32px] border border-slate-900/5 backdrop-blur-sm"
      >
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl text-saffron shrink-0">
            <ShieldCheck size={24} />
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-relaxed italic">
           Metascale Security Provision: This report is cryptographically signed and immutable. It is provided for informational purposes as a clinical support tool and does not constitute a definitive medical diagnosis.
         </p>
      </motion.div>
    </motion.div>
  );
};

export default PredictionResult;
