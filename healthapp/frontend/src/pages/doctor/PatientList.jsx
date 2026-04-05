import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  ArrowLeft, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Loader2,
  Calendar,
  Activity,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPatients = useCallback(async () => {
    try {
      const res = await api.get('/doctor/patients');
      setPatients(res.data.data);
    } catch {
      console.error('Error fetching registry data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = patients.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id?.toString().includes(searchTerm)
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-6 text-white/20">
      <Zap className="animate-spin text-saffron" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Indexing Clinical Registry...</p>
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
      className="max-w-7xl mx-auto space-y-16 pb-24"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-10">
         <div className="space-y-4">
            <button 
               onClick={() => navigate('/doctor/dashboard')}
               className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-saffron transition-all"
            >
               <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Temporal Backlink
            </button>
            <h1 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter uppercase leading-none">
               Clinical <br />
               <span className="text-saffron italic font-sans font-medium lowercase">Registry</span>
            </h1>
         </div>
         <div className="flex items-center gap-6">
            <div className="relative group">
               <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-saffron transition-colors" />
               <input 
                  type="text"
                  placeholder="Search Identity Vector..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-inner w-[300px]"
               />
            </div>
            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center text-white/20 hover:text-saffron hover:shadow-xl transition-all shadow-md">
               <Download size={20} />
            </div>
         </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-10">
         {/* Registry Stats */}
         <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
            <div className="glass-dark p-10 rounded-[48px] border border-white/5 space-y-10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-mesh-saffron opacity-5 group-hover:opacity-10 transition-opacity"></div>
               <div className="relative z-10 space-y-8">
                  <div className="space-y-4">
                     <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Active Identifiers</p>
                     <p className="text-6xl font-display font-black text-white">{patients.length}</p>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        className="h-full bg-saffron rounded-full"
                     />
                  </div>
                  <div className="pt-4 space-y-6">
                     <div className="flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/5">
                        <TrendingUp size={16} className="text-saffron" /> Density: v4.1 Stable
                     </div>
                     <div className="flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/5">
                        <ShieldCheck size={16} className="text-saffron" /> Sync: Cluster #2
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 rounded-[40px] bg-saffron text-slate-900 space-y-4">
               <Users size={32} strokeWidth={2.5} />
               <p className="text-[11px] font-black uppercase tracking-[0.2em] leading-relaxed">System is performing sequential biometric audits on 4 clusters.</p>
            </div>
         </motion.div>

         {/* Patient Table - Modern High-Contrast */}
         <motion.div variants={itemVariants} className="lg:col-span-3 space-y-10">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-xl font-display font-black text-white flex items-center gap-4 uppercase tracking-tight">
                  <Activity size={20} className="text-saffron" /> Master Ledger
                  <div className="h-px w-24 bg-white/5"></div>
               </h3>
               <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">Temporal Pulse: OK</span>
            </div>

            <div className="space-y-6">
               <AnimatePresence mode="popLayout">
                  {filteredPatients.map((patient) => (
                     <motion.div 
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={patient.id} 
                        onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                        className="glass-dark p-8 rounded-[48px] border border-white/5 flex items-center justify-between shadow-5xl group cursor-pointer transition-all relative overflow-hidden"
                     >
                        <div className="absolute left-0 top-0 w-2 h-full bg-saffron opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex flex-col md:flex-row md:items-center gap-10">
                           <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center text-white font-display font-black text-2xl shadow-3xl text-saffron group-hover:scale-110 group-hover:rotate-6 transition-transform">
                              {patient.full_name?.charAt(0)}
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-3xl font-display font-black text-white uppercase tracking-tight leading-none">{patient.full_name}</h4>
                              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-white/20 uppercase tracking-widest">
                                 <span className="flex items-center gap-2"><Calendar size={12} className="text-saffron/40" /> ID_{patient.id}</span>
                                 <span className="flex items-center gap-2 truncate max-w-[200px]"><TrendingUp size={12} className="text-saffron/40" /> {patient.email}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-8 px-6 md:px-0">
                           <div className="text-right hidden md:block">
                              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1 italic">Nodal Index</p>
                              <p className="text-white font-display font-black text-lg uppercase tracking-tight">Active</p>
                           </div>
                           <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/20 group-hover:text-saffron group-hover:bg-saffron/10 group-hover:border-saffron/20 transition-all shadow-4xl">
                              <ArrowUpRight size={24} />
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>

               {filteredPatients.length === 0 && (
                  <div className="glass-dark border-dashed border-2 border-white/5 p-24 rounded-[64px] text-center space-y-8 flex flex-col items-center opacity-40">
                     <Search size={64} className="text-white/10" />
                     <div className="space-y-4">
                        <p className="text-white font-display font-black text-2xl uppercase tracking-tight">Signal Loss</p>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] max-w-sm mx-auto italic leading-relaxed">No biometric identifiers found matching your search parameters in this spectral cluster.</p>
                     </div>
                  </div>
               )}
            </div>
         </motion.div>
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/10 pt-10">
         <ArrowLeft size={14} /> Page Registry Index <ArrowRight size={14} />
      </div>
    </motion.div>
  );
};

export default PatientList;
