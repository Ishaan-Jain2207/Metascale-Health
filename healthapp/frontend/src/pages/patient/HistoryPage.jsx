import React, { useState, useEffect, useCallback } from 'react';
import { 
  History, 
  Activity, 
  ArrowLeft, 
  ArrowUpRight, 
  Search,
  MessageSquare,
  ShieldCheck,
  Zap,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get('/predict/history');
      setHistory(res.data.data);
    } catch {
      console.error('Error fetching clinical history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.body.classList.add('app-dark-mode');
    fetchHistory();
    return () => document.body.classList.remove('app-dark-mode');
  }, [fetchHistory]);

  const filteredHistory = history.filter(item => 
    item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.interpretation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-6 text-white/20">
      <Zap className="animate-spin text-saffron" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Retrieving Temporal Vectors...</p>
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
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-10">
         <div className="space-y-4">
            <button 
               onClick={() => navigate('/patient/dashboard')}
               className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-saffron transition-all"
            >
               <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Temporal Hub
            </button>
            <h1 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter uppercase leading-none">
               Clinical <br />
               <span className="text-saffron italic font-sans font-medium lowercase">History</span>
            </h1>
         </div>
         <div className="flex items-center gap-6">
            <div className="relative group">
               <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-saffron transition-colors" />
               <input 
                  type="text"
                  placeholder="Filter Diagnostic Logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-inner w-[300px]"
               />
            </div>
         </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-12">
         {/* History Overview */}
         <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
            <div className="glass-dark p-10 rounded-[48px] border border-white/5 space-y-10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-mesh-saffron opacity-5 group-hover:opacity-10 transition-opacity"></div>
               <div className="relative z-10 space-y-8 text-center">
                  <div className="w-20 h-20 bg-saffron rounded-full mx-auto flex items-center justify-center text-slate-900 shadow-5xl group-hover:rotate-12 transition-transform">
                     <History size={36} />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Diagnostic Density</p>
                     <p className="text-5xl font-display font-black text-white">{history.length}</p>
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-white/10 px-4">
                     <span>Temporal Range</span>
                     <span>v4.1.2_STABLE</span>
                  </div>
               </div>
            </div>

            <div className="p-8 rounded-[40px] bg-white/5 border border-white/5 space-y-6">
               <div className="flex items-center gap-4 text-saffron">
                  <Zap size={24} />
                  <h4 className="text-[11px] font-black uppercase tracking-widest">Session Logic</h4>
               </div>
               <p className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-relaxed italic">All clinical vectors are synchronized via encrypted nodal handshakes for diagnostic integrity.</p>
            </div>
         </motion.div>

         {/* Temporal Ledger */}
         <motion.div variants={itemVariants} className="lg:col-span-3 space-y-10">
            <div className="space-y-6">
               <AnimatePresence mode="popLayout">
                  {filteredHistory.map((item) => (
                     <motion.div 
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.id} 
                        className="glass-dark p-8 rounded-[48px] border border-white/5 flex items-center justify-between shadow-5xl group transition-all relative overflow-hidden"
                     >
                        <div className="absolute left-0 top-0 w-2 h-full bg-saffron opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex flex-col md:flex-row md:items-start gap-10">
                           <div className={`w-16 h-16 rounded-[28px] flex items-center justify-center border shadow-3xl group-hover:scale-110 transition-transform ${
                              item.type === 'liver' ? 'bg-saffron/10 text-saffron border-saffron/20' : 'bg-white/5 text-white/40 border-white/10'
                           }`}>
                              {item.type === 'liver' ? <Activity size={32} /> : <ShieldCheck size={32} />}
                           </div>
                           <div className="space-y-4 max-w-xl">
                              <div className="flex items-center gap-4">
                                 <h4 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none">{item.type} Screening</h4>
                                 <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                    item.risk_band === 'Minimal' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                                    'border-rose-500/20 text-rose-400 bg-rose-500/5'
                                 }`}>
                                    {item.risk_band}
                                 </span>
                              </div>
                              <div className="relative">
                                 <MessageSquare className="absolute -left-6 top-1 text-white/5" size={14} />
                                 <p className="text-[10px] text-white/40 font-medium leading-relaxed italic pr-4 pl-2">"{item.interpretation}"</p>
                              </div>
                              <div className="flex items-center gap-6 text-[9px] font-black text-white/10 uppercase tracking-widest">
                                 <span className="flex items-center gap-2"><Calendar size={10} className="text-saffron/40" /> {new Date(item.created_at).toLocaleDateString()}</span>
                                 <span className="flex items-center gap-2"><Zap size={10} className="text-saffron/40" /> {(item.confidence * 100).toFixed(0)}% Conf.</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-8 px-6 md:px-0">
                           <div className="text-right hidden md:block">
                              <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-1 italic">Diagnostic Index</p>
                              <p className="text-white font-display font-black text-lg uppercase tracking-tight">#{item.id}</p>
                           </div>
                           <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/20 group-hover:text-saffron group-hover:bg-saffron/10 group-hover:border-saffron/20 transition-all shadow-4xl cursor-pointer">
                              <ArrowUpRight size={24} />
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>

               {filteredHistory.length === 0 && (
                  <div className="glass-dark border-dashed border-2 border-white/5 p-24 rounded-[64px] text-center space-y-8 flex flex-col items-center opacity-40">
                     <AlertCircle size={64} className="text-white/10" />
                     <div className="space-y-4">
                        <p className="text-white font-display font-black text-2xl uppercase tracking-tight">Signal Loss</p>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] max-w-sm mx-auto italic leading-relaxed">No clinical vectors match your search parameters in this temporal sector.</p>
                     </div>
                  </div>
               )}
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
};

export default HistoryPage;
