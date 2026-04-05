import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  ArrowRight, 
  Download, 
  Activity, 
  Stethoscope,
  ChevronRight,
  Loader2,
  AlertCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/predict/history');
      if (res.data.success) {
        setHistory(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to load screening history.');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!history.length) return;
    const headers = ['Type', 'Date', 'Risk Band', 'Confidence Score %', 'Recommendation Count'];
    const rows = history.map(item => [
      item.type,
      new Date(item.created_at).toLocaleDateString(),
      item.risk_band,
      (item.confidence * 100).toFixed(1),
      JSON.parse(item.recommendations || '[]').length
    ]);
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Metascale_Health_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = history.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.risk_band.toLowerCase().includes(search.toLowerCase()) || 
                         item.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-6">
        <div className="relative">
          <Loader2 className="animate-spin text-saffron-deep" size={48} />
          <div className="absolute inset-0 bg-saffron/20 blur-xl animate-pulse rounded-full"></div>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Synchronizing Clinical Records...</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >
      {/* Header Mesh Hero */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-mesh-saffron rounded-[40px] p-8 md:p-12 text-white shadow-3xl border border-white/20"
      >
         <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 animate-float">
            <History size={240} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
               <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/20">
                  <Clock size={14} /> Comprehensive Archive
               </div>
               <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 drop-shadow-md text-white">
                  Screening <br />
                  <span className="text-white/80 italic font-sans font-medium">History & Trends</span>
               </h1>
               <p className="text-white/70 max-w-lg text-lg font-medium leading-relaxed">
                  Monitor your clinical evolution and download validated reports for medical consultation.
               </p>
            </div>
            
            <div className="flex flex-col gap-4">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search records..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:ring-4 focus:ring-white/10 outline-none w-full md:w-80 text-white placeholder:text-white/40 transition-all font-medium"
                  />
               </div>
               <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5">
                  {['all', 'liver', 'diabetes'].map((type) => (
                    <button 
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === type ? 'bg-white text-saffron-deep shadow-xl' : 'text-white/60 hover:text-white'}`}
                    >
                      {type}
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </motion.div>

      {error ? (
        <motion.div variants={itemVariants} className="card bg-red-50/50 backdrop-blur-md border-red-100 p-8 flex items-center gap-6 text-red-700 rounded-[32px]">
           <AlertCircle size={32} />
           <p className="font-bold text-lg">{error}</p>
        </motion.div>
      ) : filteredHistory.length > 0 ? (
        <motion.div variants={itemVariants} className="card !bg-white/40 backdrop-blur-3xl border border-white/60 shadow-3xl rounded-[48px] overflow-hidden relative group">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-slate-100/50">
                       <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Vector & Date</th>
                       <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">AI Risk Assessment</th>
                       <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confidence Index</th>
                       <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Validated Report</th>
                    </tr>
                 </thead>
                  <tbody className="divide-y divide-slate-50/50">
                    <AnimatePresence>
                      {filteredHistory.map((item, index) => (
                        <motion.tr 
                            key={item.id} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-white/60 transition-all group/row cursor-default"
                        >
                            <td className="px-8 py-8">
                                <div className="flex items-center gap-5">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover/row:scale-110 group-hover/row:rotate-3 ${item.type === 'liver' ? 'bg-saffron text-white' : 'bg-saffron-deep text-white'}`}>
                                      {item.type === 'liver' ? <Activity size={24} /> : <Stethoscope size={24} />}
                                  </div>
                                  <div>
                                      <p className="font-display font-black text-slate-900 text-lg capitalize tracking-tight">{item.type} Analysis</p>
                                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                        <Calendar size={12} className="text-saffron" /> {new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                      </div>
                                  </div>
                                </div>
                            </td>
                            <td className="px-8 py-8">
                                <div className="flex items-center gap-3">
                                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                                      item.risk_band === 'Minimal' ? 'bg-emerald-500' :
                                      item.risk_band === 'Elevated' ? 'bg-amber-500' :
                                      item.risk_band === 'Severe' ? 'bg-orange-500' : 'bg-rose-500'
                                  }`}></span>
                                  <span className={`text-sm font-black uppercase tracking-widest ${
                                      item.risk_band === 'Minimal' ? 'text-emerald-700' :
                                      item.risk_band === 'Elevated' ? 'text-amber-700' :
                                      item.risk_band === 'Severe' ? 'text-orange-700' : 'text-rose-700'
                                  }`}>
                                      {item.risk_band}
                                  </span>
                                </div>
                            </td>
                            <td className="px-8 py-8">
                                <div className="space-y-2">
                                  <div className="flex items-end justify-between gap-4">
                                      <span className="font-display font-black text-slate-700 text-xl">{(item.confidence * 100).toFixed(0)}<span className="text-xs opacity-40">%</span></span>
                                  </div>
                                  <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.confidence * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full ${item.type === 'liver' ? 'bg-saffron' : 'bg-saffron-deep'}`}
                                      />
                                  </div>
                                </div>
                            </td>
                            <td className="px-8 py-8 text-right">
                                <Link 
                                  to={`/patient/history/detail/${item.type}/${item.id}`}
                                  className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-saffron-deep hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl active:scale-95"
                                >
                                    Full Insights <ChevronRight size={14} />
                                </Link>
                            </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
              </table>
           </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="card !bg-white/40 backdrop-blur-3xl border-dashed border-2 border-slate-200 py-32 flex flex-col items-center justify-center text-center rounded-[48px]">
           <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-slate-200 shadow-2xl mb-8 group-hover:scale-110 transition-transform">
              <History size={48} className="animate-spin-slow opacity-20" />
           </div>
           <h3 className="text-3xl font-display font-black text-slate-900 mb-2">No Records Found</h3>
           <p className="text-slate-400 max-w-sm mb-12 font-medium uppercase text-[10px] tracking-[0.2em]">Initiate your first screening to begin tracking your clinical baseline.</p>
           <Link to="/patient/screening" className="bg-mesh-saffron text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
              Sync Health Now <ArrowRight size={20} />
           </Link>
        </motion.div>
      )}

      {/* Footer Grid */}
      <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            variants={itemVariants}
            className="card !bg-white/40 backdrop-blur-3xl border border-white/60 p-10 rounded-[40px] flex flex-col justify-between min-h-[280px] shadow-3xl relative overflow-hidden group"
          >
             <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <TrendingUp size={200} />
             </div>
             <div className="flex items-start justify-between relative z-10">
                <div className="w-14 h-14 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center"><Activity size={28} /></div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Biological Drift</div>
             </div>
             <div className="relative z-10">
                <p className="text-4xl font-display font-black text-slate-900 mb-2">Systemic <br />Audit</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Cross-validating 12 clinical parameters.</p>
             </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="card md:col-span-2 !bg-white/40 backdrop-blur-3xl border border-white/60 p-10 rounded-[40px] shadow-3xl relative overflow-hidden group"
          >
             <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText size={200} />
             </div>
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                <div className="flex-1 space-y-8">
                   <h3 className="font-display font-black text-2xl text-slate-900 uppercase tracking-tight">Distribution Matrix</h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Liver Screening Cluster</span>
                            <span>{history.filter(h => h.type === 'liver').length} Records</span>
                         </div>
                         <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${(history.filter(h=>h.type==='liver').length / (history.length || 1)) * 100}%` }}
                               transition={{ duration: 1.5, delay: 0.5 }}
                               className="h-full bg-saffron shadow-lg shadow-saffron/20"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Metabolic Risk Profile</span>
                            <span>{history.filter(h => h.type === 'diabetes').length} Records</span>
                         </div>
                         <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${(history.filter(h=>h.type==='diabetes').length / (history.length || 1)) * 100}%` }}
                               transition={{ duration: 1.5, delay: 0.7 }}
                               className="h-full bg-saffron-deep shadow-lg shadow-saffron-deep/20"
                            />
                         </div>
                      </div>
                   </div>
                </div>
                <div className="shrink-0 pt-4">
                   <button 
                      onClick={exportToCSV}
                      className="group flex flex-col items-center gap-4 bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 active:scale-95 border-b-4 border-b-saffron"
                   >
                      <div className="w-16 h-16 bg-saffron-deep/5 text-saffron-deep rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Download size={28} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Export clinical sumary (.csv)</span>
                   </button>
                </div>
             </div>
          </motion.div>
      </div>
    </motion.div>
  );
};

export default HistoryPage;
