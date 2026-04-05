import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  ArrowLeft, 
  ArrowRight, 
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

const DiabetesScreening = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    familyDiabetes: false,
    highBP: false,
    physicallyActive: 'none',
    bmi: '',
    smoking: false,
    alcohol: false,
    sleepHours: '',
    soundSleep: '',
    regularMedicine: false,
    junkFood: 'rarely',
    stress: 'none',
    bpLevel: 'normal',
    pregnancies: 0,
    prediabetes: false,
    urinationFreq: 'notMuch'
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
    
    const ageGroup = 
      formData.age < 40 ? 'below 40' :
      formData.age <= 49 ? '40-49' :
      formData.age <= 59 ? '50-59' : '60 or above';

    const submissionData = {
      ...formData,
      ageGroup
    };

    try {
      const res = await api.post('/predict/diabetes', submissionData);
      if (res.data.success) {
        navigate('/patient/screening/result', { state: { result: res.data.data, type: 'diabetes' } });
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
            <Stethoscope size={240} />
         </div>
         <div className="relative z-10">
            <button 
              onClick={() => navigate('/patient/screening')} 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/20 hover:bg-white/20 transition-all"
            >
               <ArrowLeft size={14} /> Back to Screening Portal
            </button>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 drop-shadow-md text-white">
               Metabolic <br />
               <span className="text-white/80 italic font-sans font-medium">Risk Analysis</span>
            </h1>
            <p className="text-white/70 max-w-lg text-lg font-medium leading-relaxed">
               Analyze your systemic health parameters to detect early-stage metabolic variations.
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
          {/* Section 1: Clinical & Demo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-saffron/10 text-saffron-deep rounded-xl flex items-center justify-center font-bold">01</div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Baseline</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium" />
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
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">BMI (Index Value)</label>
                 <input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-6 pt-12">
               {[
                 { name: 'familyDiabetes', label: 'Genetic Predisposition (Family)' },
                 { name: 'highBP', label: 'History of Hypertension' },
                 { name: 'prediabetes', label: 'Prior Metabolic Diagnosis' },
                 { name: 'regularMedicine', label: 'Maintenance Medication Usage' }
               ].map((field) => (
                 <label key={field.name} className="flex items-center gap-4 cursor-pointer group bg-slate-50/50 p-4 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                    <input type="checkbox" name={field.name} checked={formData[field.name]} onChange={handleChange} className="w-5 h-5 rounded-md accent-saffron-deep border-slate-300" />
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-saffron-deep transition-colors">{field.label}</span>
                 </label>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
            {/* Lifestyle */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-saffron/10 text-saffron-deep rounded-xl flex items-center justify-center font-bold">02</div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Lifestyle Vector</h3>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Physical Activity</label>
                 <select name="physicallyActive" value={formData.physicallyActive} onChange={handleChange} className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium font-sans">
                    <option value="none">Sedentary Profile</option>
                    <option value="lt30">&lt; 30 mins Maintenance</option>
                    <option value="30-60">High Physical Activity</option>
                    <option value="gt60">Athlete / Peak Activity</option>
                 </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Sleep (Hrs)</label>
                  <input type="number" name="sleepHours" value={formData.sleepHours} onChange={handleChange} required className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Dietary Pattern</label>
                  <select name="junkFood" value={formData.junkFood} onChange={handleChange} className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium">
                     <option value="rarely">Clean / Controlled</option>
                     <option value="occasionally">Moderate Processed</option>
                     <option value="often">High Processed Exposure</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Metabolic Indicators */}
            <div className="space-y-8">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-saffron/10 text-saffron-deep rounded-xl flex items-center justify-center font-bold">03</div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Risk Indicators</h3>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Systemic BP</label>
                     <select name="bpLevel" value={formData.bpLevel} onChange={handleChange} className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium font-sans">
                        <option value="low">Hypotensive</option>
                        <option value="normal">Normotensive</option>
                        <option value="high">Hypertensive</option>
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Urination Index</label>
                     <select name="urinationFreq" value={formData.urinationFreq} onChange={handleChange} className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep outline-none transition-all font-medium font-sans">
                        <option value="notMuch">Normal Range</option>
                        <option value="quiteOften">Frequency Deviation</option>
                     </select>
                  </div>
               </div>
               <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full py-6 rounded-[24px] bg-mesh-saffron text-white font-display font-black text-lg uppercase tracking-widest shadow-3xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                     {loading ? <Loader2 className="animate-spin" /> : <Zap size={24} />}
                     {loading ? 'Analyzing Vector...' : 'Execute Risk Analysis'}
                  </button>
               </div>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DiabetesScreening;
