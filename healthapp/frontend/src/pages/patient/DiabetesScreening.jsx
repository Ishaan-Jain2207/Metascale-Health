/**
 * METASCALE HEALTH: METABOLIC AUDIT PROTOCOL (DiabetesScreening.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component acts as the 'Metabolic Profiler' for Type 2 Diabetes (T2D) 
 * risk assessment. Unlike discrete lab-based audits, this protocol 
 * synthesizes behavioral, physiological, and hereditary data clusters.
 * 
 * ─── DATA COLLECTION: THE METABOLIC FEATURE VECTOR ──────────────────────────
 * The audit captures a multi-dimensional array of indicators:
 *   1. ANTHROPOMETRY: BMI Index (kg/m²) and Age-Horizon weighting.
 *   2. HEREDITARY PERIMETER: Family diabetes history and prior high BP.
 *   3. LIFESTYLE CLUSTERS: Physical activity pulse, sleep hygiene (Sound/Total), 
 *      and junk food frequency (Metabolic strain).
 *   4. SYSTEMIC AUDIT: BP Level (Hypo/Normo/Hyper) and Urinary Frequency 
 *      (Polyuria marker).
 * 
 * ─── CLINICAL DISPATCH LOGIC ────────────────────────────────────────────────
 *   - FIELD BINDING: Synchronizes high-density selection matrices into a 
 *     normalized feature set.
 *   - INFERENCE ROUTING: Dispatches the crystallized profile to the Metabolic 
 *     Inference Kernel and transitions to the 'PredictionResult' stage for 
 *     diagnostic synthesis.
 * 
 * ─── HIGH-FIDELITY UX ───────────────────────────────────────────────────────
 * Implements a 'Diagnostic Clean-Room' design with grouped semantic 
 * sections and micro-interactions for high data-entry accuracy.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const DiabetesScreening = () => {
  const navigate = useNavigate();
  
  // METABOLIC STATE: Buffering for the full T2D feature vector.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    ageGroup: '', gender: '', familyDiabetes: false, highBP: false,
    physicallyActive: 'none', bmi: '', smoking: false, alcohol: false,
    sleepHours: '', soundSleep: '', regularMedicine: false,
    junkFood: 'rarely', stress: 'none', bpLevel: 'normal',
    pregnancies: 0, prediabetes: false, urinationFreq: 'notMuch'
  });

  // HANDLER: Orchestrates real-time state synchronization.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  /**
   * DIAGNOSTIC EXECUTION (handleSubmit)
   * Logic: Dispatches vectors to the Metabolic Inference Kernel.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/predict/diabetes', formData);
      if (res.data.success) {
        navigate('/patient/screening/result', { 
          state: { result: res.data.data, type: 'diabetes' } 
        });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
       setError('Protocol Interrupted: Unable to reach metabolic kernel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* NAVIGATION CHANNEL */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/patient/screening')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-saffron-deep">
          <ArrowLeft size={20} /> Portal Back
        </button>
        <div className="flex items-center gap-2 text-saffron-deep font-black uppercase tracking-widest text-[10px]">
           <Stethoscope size={20} /> Metabolic Module v2.0
        </div>
      </div>

      <div className="card shadow-2xl p-8 lg:p-14 bg-white rounded-[48px]">
        {/* HEADER: CLINICAL CONTEXT */}
        <div className="mb-14 text-center">
          <div className="inline-block p-4 bg-saffron/10 text-saffron-deep rounded-[24px] mb-4">
             <Stethoscope size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Metabolic Audit</h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">Capture multi-factor biometric data for T2D risk stratification.</p>
        </div>

        {error && (
          <div className="mb-10 p-6 bg-red-50 text-red-600 rounded-[24px] flex items-center gap-4">
            <AlertCircle /> <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-16">
          {/* DOMAIN 1: PHYSIOLOGICAL BASELINE */}
          <div className="space-y-10">
             <SectionHeader title="Physiological Baseline" />
             <div className="grid md:grid-cols-3 gap-8">
                <FormField label="Age Horizon">
                   <select name="ageGroup" onChange={handleChange} required className="input-field">
                      <option value="">Select Level</option><option value="below 40">Below 40</option>
                      <option value="40-49">40-49</option><option value="50-59">50-59</option><option value="60 or above">60+</option>
                   </select>
                </FormField>
                <FormField label="Gender">
                   <select name="gender" onChange={handleChange} required className="input-field">
                      <option value="">Select</option><option value="male">Male</option><option value="female">Female</option>
                   </select>
                </FormField>
                <FormField label="BMI Index"><input type="number" step="0.1" name="bmi" onChange={handleChange} required className="input-field" placeholder="kg/m²" /></FormField>
             </div>
             
             <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[32px] italic">
                <Checkbox name="familyDiabetes" checked={formData.familyDiabetes} onChange={handleChange} label="Hereditary History" />
                <Checkbox name="highBP" checked={formData.highBP} onChange={handleChange} label="Hypertension History" />
                <Checkbox name="prediabetes" checked={formData.prediabetes} onChange={handleChange} label="Prior Prediabetes" />
                <Checkbox name="regularMedicine" checked={formData.regularMedicine} onChange={handleChange} label="Active Medication" />
             </div>
          </div>

          {/* DOMAIN 2: HABITS & STRESS */}
          <div className="space-y-10">
             <SectionHeader title="Habitual Clusters" />
             <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                   <FormField label="Physical Activity">
                      <select name="physicallyActive" onChange={handleChange} className="input-field">
                         <option value="none">Sedentary</option><option value="lt30">Low (&lt;30m)</option>
                         <option value="30-60">Moderate</option><option value="gt60">Active</option>
                      </select>
                   </FormField>
                   <div className="grid grid-cols-2 gap-4">
                      <FormField label="Sleep (H)"><input type="number" name="sleepHours" onChange={handleChange} required className="input-field" /></FormField>
                      <FormField label="Deep Sleep (H)"><input type="number" name="soundSleep" onChange={handleChange} required className="input-field" /></FormField>
                   </div>
                </div>
                <div className="space-y-8">
                   <FormField label="Nutritional Profile">
                      <select name="junkFood" onChange={handleChange} className="input-field">
                         <option value="rarely">Controlled</option><option value="occasionally">Occasional</option>
                         <option value="often">High</option><option value="veryOften">Chronic</option>
                      </select>
                   </FormField>
                   <FormField label="Stress Indicator">
                      <select name="stress" onChange={handleChange} className="input-field">
                         <option value="none">Stabilized</option><option value="sometimes">Episodic</option>
                         <option value="veryOften">High</option><option value="always">Chronic</option>
                      </select>
                   </FormField>
                </div>
             </div>
          </div>

          {/* DOMAIN 3: CLINICAL RESPONSE */}
          <div className="space-y-10">
             <SectionHeader title="Clinical Response Markers" />
             <div className="grid md:grid-cols-2 gap-10">
                <FormField label="BP Level">
                   <select name="bpLevel" onChange={handleChange} className="input-field">
                      <option value="low">Hypotensive</option><option value="normal">Normal</option><option value="high">Hypertensive</option>
                   </select>
                </FormField>
                <FormField label="Urinary Frequency">
                   <select name="urinationFreq" onChange={handleChange} className="input-field">
                      <option value="notMuch">Normative</option><option value="quiteOften">Hyper-frequent</option>
                   </select>
                </FormField>
             </div>
          </div>

          <div className="pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex gap-4 bg-slate-50 p-6 rounded-3xl md:max-w-md">
                <Info size={20} className="text-saffron-deep shrink-0" />
                <p className="text-xs text-slate-500 italic">Parameters are synthesized to calculate metabolic risk stratification.</p>
             </div>
             <button type="submit" disabled={loading} className="btn-primary px-14 py-5 font-black flex items-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : <>Execute Diagnostic <ArrowRight size={20} /></>}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* --- SHARED FORM FRAGMENTS --- */
const FormField = ({ label, children }) => (
  <div className="space-y-3">
     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
     {children}
  </div>
);

const SectionHeader = ({ title }) => (
  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-3 flex items-center gap-2">
     <CheckCircle2 size={14} className="text-saffron" /> {title}
  </h3>
);

const Checkbox = ({ name, checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group py-1">
     <input type="checkbox" name={name} checked={checked} onChange={onChange} className="w-5 h-5 rounded-lg accent-saffron-deep" />
     <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">{label}</span>
  </label>
);

export default DiabetesScreening;


