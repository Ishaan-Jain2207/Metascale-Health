import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  ArrowLeft, 
  CheckCircle2, 
  Info,
  Loader2,
  AlertCircle,
  Activity,
  Zap,
  Globe
} from 'lucide-react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const LiverScreening = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    totalBilirubin: '',
    directBilirubin: '',
    alkalinePhosphotase: '',
    alamineAminotransferase: '',
    aspartateAminotransferase: '',
    totalProteins: '',
    albumin: '',
    albuminGlobulinRatio: '',
    alcoholPattern: 'none',
    priorLiverDiagnosis: false,
    liverTestResult: 'notsure'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/predict/liver', formData);
      if (res.data.success) {
        navigate('/patient/screening/result', { state: { result: res.data.data, type: 'liver' } });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit screening. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      className="max-w-5xl mx-auto space-y-10 pb-16"
    >
      {/* Header Mini-Hero */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-mesh-saffron rounded-[40px] p-8 md:p-12 text-white shadow-3xl border border-white/20"
      >
         <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 animate-float">
            <Activity size={240} />
         </div>
         <div className="relative z-10">
            <button 
              onClick={() => navigate('/patient/screening')} 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/20 hover:bg-white/20 transition-all"
            >
               <ArrowLeft size={14} /> Back to Screening Portal
            </button>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 drop-shadow-md text-white">
               Liver Health <br />
               <span className="text-white/80 italic font-sans font-medium">Diagnostic Assistant</span>
            </h1>
            <p className="text-white/70 max-w-lg text-lg font-medium leading-relaxed">
               Please enter your clinical parameters accurately to ensure precise AI risk assessment.
            </p>
         </div>
      </motion.div>

      <motion.div variants={itemVariants} className="card !bg-white/40 backdrop-blur-3xl border border-white/60 shadow-3xl p-8 md:p-14 rounded-[48px] relative overflow-hidden">
        {error && (
          <div className="mb-10 p-6 bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-600 rounded-[24px] flex items-start gap-4">
            <AlertCircle className="shrink-0 mt-0.5" />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Demographics */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-saffron/10 text-saffron-deep rounded-xl flex items-center justify-center font-bold">01</div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Patient Profile</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium" placeholder="Years" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Lifestyle Pattern</label>
                 <select name="alcoholPattern" value={formData.alcoholPattern} onChange={handleChange} className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium">
                    <option value="none">Never Consumed</option>
                    <option value="social">Social Exposure</option>
                    <option value="regular">Moderate Practice</option>
                    <option value="heavy">Critical/Daily</option>
                 </select>
              </div>
            </div>

            {/* Biomarkers */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-saffron/10 text-saffron-deep rounded-xl flex items-center justify-center font-bold">02</div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Core Biomarkers</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Total Bilirubin</label>
                  <input type="number" step="0.01" name="totalBilirubin" value={formData.totalBilirubin} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Direct Bilirubin</label>
                  <input type="number" step="0.01" name="directBilirubin" value={formData.directBilirubin} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Proteins</label>
                   <input type="number" step="0.01" name="totalProteins" value={formData.totalProteins} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium" />
                 </div>
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Albumin</label>
                   <input type="number" step="0.01" name="albumin" value={formData.albumin} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium" />
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
            {/* Enzymes */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-saffron/10 text-saffron-deep rounded-xl flex items-center justify-center font-bold">03</div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Enzymatic Profile</h3>
              </div>
              <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Phosphotase (ALP)</label>
                  <input type="number" name="alkalinePhosphotase" value={formData.alkalinePhosphotase} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">SGPT / ALT</label>
                  <input type="number" name="alamineAminotransferase" value={formData.alamineAminotransferase} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">SGOT / AST</label>
                  <input type="number" name="aspartateAminotransferase" value={formData.aspartateAminotransferase} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium" />
                </div>
              </div>
            </div>

            {/* Submission */}
            <div className="space-y-8 flex flex-col justify-end pb-2">
               <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 flex items-start gap-4 mb-4">
                  <Info size={20} className="text-saffron-deep shrink-0 mt-1" />
                  <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">AI Diagnostic Note: All parameters are cross-validated against validated clinical datasets. Ensure labs are within the last 6 months.</p>
               </div>
               <button 
                 type="submit" 
                 disabled={loading} 
                 className="w-full py-6 rounded-[24px] bg-mesh-saffron text-white font-display font-black text-lg uppercase tracking-widest shadow-3xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
               >
                  {loading ? <Loader2 className="animate-spin" /> : <Database size={24} />}
                  {loading ? 'Processing Insights...' : 'Analyze Health Baseline'}
               </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LiverScreening;
