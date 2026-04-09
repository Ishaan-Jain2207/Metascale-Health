/**
 * METASCALE HEALTH: DIAGNOSTIC SYNTHESIS ENGINE (PredictionResult.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component acts as the 'Clinical Reporting Hub'. It visualizes the 
 * results of an AI-driven screening (Liver/Diabetes), synthesizing raw risk 
 * scores into actionable medical insights and longitudinal recommendations.
 * 
 * ─── DATA ORCHESTRATION: DUAL-SYNCHRONIZATION ───────────────────────────────
 * The component implements a robust 'Dual-Path Sync' strategy:
 *   1. FAST-PATH (State-Driven): If the user is redirected immediately post-screening, 
 *      data is hydrated from the React Router 'location.state'.
 *   2. REFRESH-PATH (API-Driven): If the page is reloaded or accessed via direct Link, 
 *      the 'fetchResult' engine synchronizes with the clinical repository via 
 *      the record ID and vector type.
 * 
 * ─── RISK VISUALIZATION & INTERVENTION ──────────────────────────────────────
 *   - RISK BANDING: Maps 100-point probabilistic scores to semantic tiers 
 *     (Minimal, Elevated, Severe, Critical) using high-contrast iconography.
 *   - ASSESSMENT REVIEW (AI-Powered): Leverages the Gemini-driven 
 *     'AssessmentInsights' service to generate deep narrative explanations 
 *     based on the specific feature vector inputs.
 *   - INTERVENTION LOGIC: Decouples the recommendation manifest from the 
 *     main result to provide a structured, prioritized task list for the patient.
 * 
 * ─── HIGH-FIDELITY DESIGN ───────────────────────────────────────────────────
 * Utilizes a 'Legal Report' aesthetic with high-density typography, 
 * shadow-blur elevation, and print-optimized CSS for physician handoffs.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft, 
  Download, 
  Printer, 
  ChevronRight,
  Activity,
  Loader2,
  FileText,
  Info
} from 'lucide-react';
import api from '../../services/api';

const PredictionResult = () => {
  const location = useLocation();
  const { id: paramId, type: paramType } = useParams();
  
  // DIAGNOSTIC STATE: Buffering for the crystallized report.
  const [result, setResult] = useState(location.state?.result || null);
  const [type, setType] = useState(location.state?.type || paramType);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState('');
  
  const [assessmentInsights, setAssessmentInsights] = useState('');
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [assessmentError, setAssessmentError] = useState('');

  useEffect(() => {
    // SYNC LOGIC: Hydrate from repository if state is empty.
    if (!result && paramId && paramType) { fetchResult(); }
  }, [paramId, paramType]);

  const fetchResult = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/predict/detail/${paramType}/${paramId}`);
      setResult(res.data.data);
      setType(paramType);
    } catch (err) {
      setError('Screening record not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * CLINICAL ASSESSMENT (handleGenerateInsights)
   * Logic: Orchestrates LLM synthesis of the biometric findings.
   */
  const handleGenerateInsights = async () => {
    setLoadingAssessment(true);
    setAssessmentError('');
    try {
       const res = await api.post('/predict/explain', {
          type,
          data: result.features || {},
          result: {
             riskBand: result.risk_band || result.riskBand,
             interpretation: result.interpretation
          }
       });
       setAssessmentInsights(res.data.data.explanation);
    } catch (err) {
      setAssessmentError('Metascale insight engine is currently undergoing maintenance.');
    } finally {
       setLoadingAssessment(false);
    }
  };

  if (loading) return <div className="flex flex-col items-center justify-center py-40 gap-4"><Loader2 className="animate-spin text-saffron" size={40}/><p className="text-[10px] font-black tracking-widest uppercase">Synthesizing Diagnostic Record...</p></div>;

  if (error || !result) return <ErrorState message={error} />;

  const riskBand = result.risk_band || result.riskBand;
  const recommendations = result.recommendations && (typeof result.recommendations === 'string' ? JSON.parse(result.recommendations) : result.recommendations);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 print:p-0">
      
      {/* ─── ACTION CONTROL BAR ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between print:hidden">
        <Link to="/patient/dashboard" className="text-slate-500 font-bold hover:text-saffron-deep flex items-center gap-2">
          <ArrowLeft size={18} /> Dash Access
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={() => window.print()} className="btn-secondary px-4 py-2 text-[10px] uppercase font-black tracking-widest border-slate-300 flex items-center gap-2">
             <Printer size={16} /> Print
          </button>
          <button onClick={() => window.print()} className="btn-primary px-6 py-2 text-[10px] uppercase font-black tracking-widest bg-saffron border-saffron-deep flex items-center gap-2">
             <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* ─── CLINICAL SYNTHESIS CARD ───────────────────────────────────────── */}
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl print:shadow-none">
         {/* HEADER: REPORT IDENTITY */}
         <div className="bg-slate-900 text-white p-10 lg:p-14 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
               <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-saffron text-[9px] font-black uppercase tracking-widest mb-3">
                     Diagnostic v4.0.0 (Verified)
                  </div>
                  <h1 className="text-4xl font-black tracking-tight">Clinical Report</h1>
                  <p className="text-slate-400 font-medium">Vector: <span className="text-white capitalize">{type}</span> • {new Date(result.created_at).toLocaleDateString()}</p>
               </div>
               <div className="bg-white/5 rounded-3xl p-6 border border-white/10 text-center backdrop-blur-md">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Audit Chain</p>
                  <p className="text-2xl font-black text-saffron">INTEGRITY</p>
               </div>
            </div>
         </div>

         <div className="p-10 lg:p-14 space-y-14 bg-white">
            {/* STAGE 1: RISK STRATIFICATION */}
            <div className="grid md:grid-cols-5 gap-10 items-center">
               <div className="md:col-span-2 flex flex-col items-center text-center p-10 rounded-[40px] border-2 border-dashed border-slate-100 bg-slate-50/50">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-2xl flex items-center justify-center mb-4">
                     {riskBand === 'Minimal' ? <CheckCircle2 className="text-green-500" size={32} /> : <AlertTriangle className="text-red-500" size={32} />}
                  </div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">Clinical Tier</p>
                  <p className={`text-xl font-black px-6 py-2 rounded-xl border-2 ${getRiskStyle(riskBand)}`}>{riskBand}</p>
               </div>
               
               <div className="md:col-span-3 space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                     <Activity size={20} className="text-saffron-deep" /> Executive Interpretation
                  </h2>
                  <div className="p-8 bg-slate-50 rounded-[32px] border italic text-slate-700 font-medium text-lg leading-relaxed">
                     "{result.interpretation}"
                  </div>
               </div>
            </div>

            {/* STAGE 2: ACTIONABLE RECOMMENDATIONS */}
            <div className="space-y-8">
               <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-saffron-deep" /> Strategic Intervention
               </h3>
               <div className="grid md:grid-cols-2 gap-4">
                  {recommendations?.map((rec, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-white">
                       <span className="shrink-0 w-8 h-8 rounded-lg bg-slate-900 text-saffron flex items-center justify-center font-black text-[10px]">0{i + 1}</span>
                       <p className="text-slate-700 font-bold text-xs">{rec}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* STAGE 3: AI DIAGNOSTIC REVIEW */}
            <div className="space-y-8 pt-10 border-t">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                     <FileText size={20} className="text-saffron-deep" /> Diagnostic Audit
                  </h3>
                  {!assessmentInsights && !loadingAssessment && (
                    <button onClick={handleGenerateInsights} className="text-[9px] font-black uppercase tracking-widest text-white bg-slate-900 px-6 py-3 rounded-xl hover:bg-saffron-deep transition-all shadow-xl">
                       Deep Assessment
                    </button>
                  )}
               </div>

               {loadingAssessment ? <AssessmentLoading /> : assessmentInsights ? <AssessmentDoc insights={assessmentInsights} /> : <AssessmentPlaceholder type={type} />}
            </div>

            {/* STAGE 4: CLINICAL NOTICE */}
            <div className="p-8 bg-saffron/5 rounded-3xl border flex gap-4">
               <Info className="text-saffron-deep shrink-0" />
               <p className="text-xs font-bold italic text-slate-600">
                  <span className="block uppercase tracking-widest mb-1 text-slate-900 not-italic">Clinical Protocol:</span> 
                  Generated analysis based on biometric inputs. To be verified by a medical professional.
               </p>
            </div>
         </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between py-10 print:hidden">
         <div className="flex gap-8">
            <Link to="/patient/appointments" className="text-[10px] font-black uppercase tracking-widest text-saffron-deep flex items-center gap-2">Book Expert <ChevronRight size={14} /></Link>
            <Link to="/patient/history" className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">History Log <ChevronRight size={14} /></Link>
         </div>
         <Link to="/patient/dashboard" className="btn-primary px-10 py-4 font-black shadow-xl">Return to Dashboard</Link>
      </div>
    </div>
  );
};

/* --- SHARED FRAGMENTS --- */

const getRiskStyle = (band) => {
  if (band === 'Minimal') return 'bg-green-50 text-green-700 border-green-200';
  if (band === 'Elevated') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  return 'bg-red-50 text-red-700 border-red-200';
};

const AssessmentLoading = () => (
  <div className="bg-slate-50 rounded-[40px] p-12 border border-slate-100 flex flex-col items-center gap-4">
     <Loader2 className="animate-spin text-saffron" size={40} />
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Synthesizing Observations...</p>
  </div>
);

const AssessmentDoc = ({ insights }) => (
  <div className="bg-ink text-slate-100 p-10 rounded-[40px] border shadow-2xl relative overflow-hidden">
     <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={100}/></div>
     <div className="flex gap-2 text-saffron text-[9px] font-black uppercase tracking-widest mb-6"><CheckCircle2 size={14} /> Audit Complete</div>
     <p className="whitespace-pre-wrap font-sans text-slate-300 text-lg leading-loose italic">{insights}</p>
  </div>
);

const AssessmentPlaceholder = ({ type }) => (
  <div className="bg-slate-50 rounded-[40px] p-10 border border-dashed text-center">
     <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Advanced Review Available for {type} Profile</p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="text-center py-40 space-y-6">
     <h2 className="text-2xl font-black text-slate-900">{message || 'Result Not Found'}</h2>
     <Link to="/patient/history" className="btn-primary px-8 py-3 inline-flex items-center gap-2">History Portal <ArrowLeft size={18} /></Link>
  </div>
);

export default PredictionResult;

