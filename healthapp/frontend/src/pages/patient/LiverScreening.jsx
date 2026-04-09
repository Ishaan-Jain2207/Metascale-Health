/**
 * METASCALE HEALTH: HEPATIC DIAGNOSTIC PROTOCOL (LiverScreening.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component provides a specialized 'Clinical Interface' for hepatic 
 * risk assessment. It is designed to capture a multi-dimensional array 
 * of biomarkers required for accurate metabolic liver analysis.
 * 
 * ─── DATA COLLECTION: THE HEPATIC FEATURE VECTOR ────────────────────────────
 * The form is partitioned into specialized physiological domains:
 *   1. EXCRETORY MARKERS: Total/Direct Bilirubin (mg/dL)—indicator of 
 *      filtration efficiency.
 *   2. CELLULAR INTEGRITY: Alkaline Phosphotase (ALP), SGPT (ALT), and 
 *      SGOT (AST) (U/L)—indicator of acute hepatocyte stress.
 *   3. SYNTHESIS CAPACITY: Total Proteins and Albumin (g/dL)—indicator 
 *      of long-term functional health.
 *   4. LIFESTYLE CORRELATIONS: Alcohol patterns and prior clinical history.
 * 
 * ─── PROTOCOL FLOW & INFERENCE ──────────────────────────────────────────────
 *   - FIELD ADAPTATION: Implements a 'Feature Binder' that synchronizes 
 *     diverse inputs into a crystallized JSON payload.
 *   - CLINICAL DISPATCH: Transmits the vector to the Backend Inference Kernel 
 *     and routes the user to the 'PredictionResult' stage upon successful 
 *     risk computation.
 * 
 * ─── AESTHETIC HIGH-FIDELITY ────────────────────────────────────────────────
 * Utilizes a 'Clean-Room' layout with high-contrast grouping and 
 * semantic checkmarks to ensure clarity during lab-data entry.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Loader2,
  AlertCircle,
  Activity
} from 'lucide-react';
import api from '../../services/api';

const LiverScreening = () => {
  const navigate = useNavigate();
  
  // CLINICAL STATE: Buffering for the full hepatic feature vector.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    age: '', gender: '',
    totalBilirubin: '', directBilirubin: '',
    alkalinePhosphotase: '', alamineAminotransferase: '', aspartateAminotransferase: '',
    totalProteins: '', albumin: '', albuminGlobulinRatio: '',
    alcoholPattern: 'none', priorLiverDiagnosis: false, liverTestResult: 'notsure'
  });

  // HANDLER: Orchestrates real-time state synchronization.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  /**
   * DIAGNOSTIC EXECUTION (handleSubmit)
   * Logic: Dispatches vectors to the Inference Kernel.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/predict/liver', formData);
      if (res.data.success) {
        navigate('/patient/screening/result', { 
          state: { result: res.data.data, type: 'liver' } 
        });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
       setError('Protocol Interrupted: Unable to reach inference kernel.');
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
           <Database size={20} /> Hepatic Module v2.0
        </div>
      </div>

      <div className="card shadow-2xl p-8 lg:p-14 bg-white rounded-[48px]">
        {/* HEADER: CLINICAL CONTEXT */}
        <div className="mb-14 text-center">
          <div className="inline-block p-4 bg-saffron/10 text-saffron-deep rounded-[24px] mb-4">
             <Activity size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hepatic Audit</h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">Input parameters from your lab report for AI-Risk analysis.</p>
        </div>

        {error && (
          <div className="mb-10 p-6 bg-red-50 text-red-600 rounded-[24px] flex items-center gap-4">
            <AlertCircle /> <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* DOMAIN 1: DEMOGRAPHICS */}
            <div className="space-y-10">
              <SectionHeader title="Basic Demographics" />
              <div className="grid grid-cols-2 gap-6">
                <FormField label="Age (Yrs)"><input type="number" name="age" onChange={handleChange} required className="input-field" /></FormField>
                <FormField label="Gender">
                  <select name="gender" onChange={handleChange} required className="input-field">
                    <option value="">Select</option><option value="male">Male</option><option value="female">Female</option>
                  </select>
                </FormField>
              </div>
              <FormField label="Alcohol Pattern">
                 <select name="alcoholPattern" onChange={handleChange} className="input-field">
                    <option value="none">Abstinent</option><option value="social">Social</option>
                    <option value="regular">Regular</option><option value="heavy">Critical</option>
                 </select>
              </FormField>
            </div>

            {/* DOMAIN 2: BILIRUBIN & PROTEINS */}
            <div className="space-y-10">
              <SectionHeader title="Bilirubin & Proteins" />
              <div className="grid grid-cols-2 gap-6">
                <FormField label="Total Bilirubin"><input type="number" step="0.01" name="totalBilirubin" onChange={handleChange} required className="input-field" placeholder="mg/dL" /></FormField>
                <FormField label="Direct Bilirubin"><input type="number" step="0.01" name="directBilirubin" onChange={handleChange} required className="input-field" placeholder="mg/dL" /></FormField>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <FormField label="Total Proteins"><input type="number" step="0.01" name="totalProteins" onChange={handleChange} required className="input-field" placeholder="g/dL" /></FormField>
                <FormField label="Albumin"><input type="number" step="0.01" name="albumin" onChange={handleChange} required className="input-field" placeholder="g/dL" /></FormField>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* DOMAIN 3: ENZYMES */}
            <div className="space-y-10">
              <SectionHeader title="Hepatic Enzymes (U/L)" />
              <FormField label="ALP"><input type="number" name="alkalinePhosphotase" onChange={handleChange} required className="input-field" /></FormField>
              <div className="grid grid-cols-2 gap-6">
                <FormField label="SGPT/ALT"><input type="number" name="alamineAminotransferase" onChange={handleChange} required className="input-field" /></FormField>
                <FormField label="SGOT/AST"><input type="number" name="aspartateAminotransferase" onChange={handleChange} required className="input-field" /></FormField>
              </div>
            </div>

            {/* DOMAIN 4: RATIOS & HISTORY */}
            <div className="space-y-10">
              <SectionHeader title="Audit Markers" />
              <FormField label="Albumin/Globulin Ratio"><input type="number" step="0.01" name="albuminGlobulinRatio" onChange={handleChange} required className="input-field" /></FormField>
              <FormField label="Prior Liver Issue?">
                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                  <label className="flex gap-2">
                    <input type="radio" name="priorLiverDiagnosis" checked={formData.priorLiverDiagnosis} onChange={() => setFormData({...formData, priorLiverDiagnosis: true})} /> Yes
                  </label>
                  <label className="flex gap-2">
                    <input type="radio" name="priorLiverDiagnosis" checked={!formData.priorLiverDiagnosis} onChange={() => setFormData({...formData, priorLiverDiagnosis: false})} /> No
                  </label>
                </div>
              </FormField>
            </div>
          </div>

          <div className="pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex gap-4 bg-slate-50 p-6 rounded-3xl md:max-w-md">
                <Info size={20} className="text-saffron-deep shrink-0" />
                <p className="text-xs text-slate-500 italic">Parameters are cross-calibrated for MASLD risk analysis.</p>
             </div>
             <button type="submit" disabled={loading} className="btn-primary px-14 py-5 font-black flex items-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : <>Execute Analysis <ArrowRight size={20} /></>}
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

export default LiverScreening;

