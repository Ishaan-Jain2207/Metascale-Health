import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  Info,
  Loader2,
  AlertCircle,
  FlaskConical,
  Beaker,
  Thermometer,
  Scale
} from 'lucide-react';
import api from '../../services/api';
import MaterialStepper from '../../components/MaterialStepper';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const DiabetesScreening = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    Pregnancies: '0',
    Glucose: '100',
    BloodPressure: '70',
    SkinThickness: '20',
    Insulin: '80',
    BMI: '25',
    DiabetesPedigreeFunction: '0.47',
    Age: '30'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = useMemo(() => [
    'Reproductive Context',
    'Glycemic Index',
    'Vascular Pulse',
    'Epidermal Depth',
    'Insulinic Vector',
    'Metabolic Mass',
    'Genetic Lineage',
    'Biological Age'
  ], []);

  useEffect(() => {
    document.body.classList.add('app-dark-mode');
    return () => document.body.classList.remove('app-dark-mode');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/predict/diabetes', formData);
      navigate(`/patient/result/diabetes/${res.data.data.id}`);
    } catch {
      setError('Signal Interruption: Neural synchronization failed. Verify biovariables.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    const configs = [
      { name: 'Pregnancies', label: 'Reproductive Cycles', icon: ShieldCheck, min: 0, max: 20, desc: 'Total count of gestations recorded in medical history.' },
      { name: 'Glucose', label: 'Plasma Glucose', icon: Activity, min: 0, max: 300, desc: 'Concentration of glycemic particles post-handshake.' },
      { name: 'BloodPressure', label: 'Diastolic Pressure', icon: Zap, min: 0, max: 200, desc: 'Internal vascular tension measured in mm Hg.' },
      { name: 'SkinThickness', label: 'Epidermal Fold', icon: FlaskConical, min: 0, max: 100, desc: 'Triceps skin fold density measured in mm.' },
      { name: 'Insulin', label: 'Serum Insulin', icon: Beaker, min: 0, max: 900, desc: '2-Hour serum insulin concentration (mu U/ml).' },
      { name: 'BMI', label: 'Body Mass Vector', icon: Scale, min: 0, max: 70, desc: 'Weight (kg) / Height (m)^2 biometric ratio.' },
      { name: 'DiabetesPedigreeFunction', label: 'Lineage Index', icon: Info, min: 0, max: 3, desc: 'Probabilistic likelihood of inherited glycemic dysfunction.' },
      { name: 'Age', label: 'Temporal Biological Age', icon: Thermometer, min: 0, max: 120, desc: 'Biological age at point of diagnostic audit.' }
    ];

    const config = configs[step];
    if (!config) return null;

    return (
      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-12 py-10"
      >
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-32 h-32 bg-saffron rounded-[48px] flex items-center justify-center text-ink shadow-5xl group-hover:rotate-12 transition-transform">
             <config.icon size={48} strokeWidth={2.5} />
          </div>
          <div className="space-y-4 text-center md:text-left flex-1">
             <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] mb-4">Diagnostic Step {step + 1} / 8</p>
             <h3 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tight">{config.label}</h3>
             <p className="text-[11px] text-white/30 font-black uppercase tracking-widest leading-loose italic max-w-xl">{config.desc}</p>
          </div>
        </div>

        <div className="space-y-8 max-w-2xl mx-auto pt-10">
           <div className="relative group">
              <input 
                type="number" 
                step={config.name === 'BMI' || config.name === 'DiabetesPedigreeFunction' ? '0.01' : '1'}
                name={config.name}
                value={formData[config.name]}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-10 bg-white/5 border border-white/10 rounded-[48px] outline-none focus:ring-12 focus:ring-saffron/5 focus:border-saffron/40 text-6xl font-display font-black text-white text-center shadow-5xl transition-all"
              />
              <div className="absolute top-1/2 left-8 -translate-y-1/2 text-white/10 group-focus-within:text-saffron transition-colors uppercase font-black text-[10px] tracking-widest">MIN_{config.min}</div>
              <div className="absolute top-1/2 right-8 -translate-y-1/2 text-white/10 group-focus-within:text-saffron transition-colors uppercase font-black text-[10px] tracking-widest">MAX_{config.max}</div>
           </div>
           
           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                 initial={{ width: "0%" }}
                 animate={{ width: `${(formData[config.name] / config.max) * 100}%` }}
                 className="h-full bg-saffron shadow-[0_0_20px_rgba(247,147,30,0.4)]"
              />
           </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-48 px-4 md:px-0 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
      
      <div className="mb-20 space-y-10 pt-16">
         <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 border-b border-white/5 pb-8">
            <Link to="/patient/screening" className="hover:text-saffron transition-all">Protocol Nexus</Link>
            <ArrowRight size={14} className="text-white/5" />
            <span className="text-saffron font-bold">Metabolic Audit</span>
            <div className="ml-auto flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></div>
               <span className="tracking-widest">Temporal Sync: OK</span>
            </div>
         </div>
         <h1 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-none uppercase">
            Glycemic <br />
            <span className="text-saffron italic font-sans font-medium lowercase">Protocol</span>
         </h1>
      </div>

      <div className="mb-20 glass-dark p-8 rounded-[48px] border border-white/5 shadow-2xl">
         <MaterialStepper steps={steps} activeStep={activeStep} onStepClick={setActiveStep} />
      </div>

      <div className="min-h-[400px]">
         <AnimatePresence mode="wait">
            {renderStepContent(activeStep)}
         </AnimatePresence>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="mt-12 p-8 rounded-[32px] bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-6 shadow-xl backdrop-blur-xl"
        >
           <AlertCircle size={32} strokeWidth={2.5} />
           <p className="text-xs md:text-[11px] font-black uppercase tracking-[0.2em] leading-loose">{error}</p>
        </motion.div>
      )}

      <div className="fixed bottom-12 left-0 w-full px-6 flex justify-center z-50">
         <div className="w-full max-w-xl glass-dark backdrop-blur-3xl p-5 rounded-[40px] flex items-center gap-5 border border-white/10 shadow-5xl">
            {activeStep > 0 && (
               <button 
                  onClick={handleBack} 
                  className="flex-1 py-6 bg-white/5 rounded-[30px] text-white/30 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 border border-white/5"
               >
                  <ArrowLeft size={16} /> Back Sequence
               </button>
            )}
            
            {activeStep < steps.length - 1 ? (
               <button 
                  onClick={handleNext} 
                  className="flex-[2] py-6 bg-saffron text-ink rounded-[30px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:shadow-saffron/20 shadow-xl transition-all"
               >
                  Advance Diagnostic <ArrowRight size={18} />
               </button>
            ) : (
               <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-[2] py-6 bg-saffron text-ink rounded-[30px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:shadow-saffron/20 shadow-xl transition-all disabled:opacity-50"
               >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                     <>
                        Execute Final Audit <Zap size={18} />
                     </>
                  )}
               </button>
            )}
         </div>
      </div>
    </div>
  );
};

export default DiabetesScreening;
