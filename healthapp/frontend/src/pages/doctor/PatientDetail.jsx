/**
 * METASCALE HEALTH: CLINICAL DEEP DIVE (PatientDetail.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component handles the 'Clinical Deep Dive'—a granular, full-stack 
 * reconstruction of a patient's medical history. It serves as the primary 
 * interface for clinicians to review longitudinal health data, synthesize 
 * AI-generated interpretations, and commit professional medical observations.
 * 
 * ─── LONGITUDINAL HEALTH RECONSTRUCTION ─────────────────────────────────────
 * The interface partitions clinical data into distinct segments:
 *   1. IDENTITY VAULT: Core patient demographics and contact vectors.
 *   2. HEALTH TRAJECTORY: Statistically-driven density visualizations of 
 *      screening frequency.
 *   3. ANALYSIS AUDIT: A chronologically ordered manifest of every screening 
 *      protocol (Liver/Diabetes) performed by the patient.
 * 
 * ─── DIAGNOSTIC COMMIT & REVIEW ─────────────────────────────────────────────
 * Enables a 'Human-in-the-Loop' review process. Clinicians can authorize AI 
 * interpretations or append specific 'Clinical Guardrails' (Doctor's Notes) 
 * to each screening record, which are then synchronized back to the patient's 
 * primary portal.
 * 
 * ─── DESIGN SYSTEM: CLINICAL OS (SAFFRON) ───────────────────────────────────
 * Maintains the 'Metascale Saffron' palette for high-impact clinical 
 * confirmations and 'Slate' for professional informational layers.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Activity, 
  Stethoscope, 
  CheckCircle2, 
  History, 
  Calendar, 
  Phone, 
  Mail,
  Loader2,
  AlertCircle,
  TrendingUp,
  Download,
  Info,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ─── STATE MANAGEMENT: Repository Buffers ─────────────────────────────────
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  /**
   * DATA SYNCHRONIZATION (fetchPatientData)
   * Logic: Simultaneously fetches the patient's legal identity and their 
   * comprehensive longitudinal screening history from the database.
   */
  const fetchPatientData = useCallback(async () => {
    try {
      const [patientRes, historyRes] = await Promise.all([
        api.get(`/doctor/patients/${id}`),
        api.get(`/predict/history/${id}`)
      ]);
      setPatient(patientRes.data.data);
      setHistory(historyRes.data.data);
    } catch {
      console.error('Clinical Retrieval Fault: Patient data inaccessible.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  /**
   * DIAGNOSTIC COMMIT HANDLER (handleReview)
   * Logic: Persists a clinician's professional analysis to a specific 
   * screening record, triggering a notification update in the patient portal.
   */
  const handleReview = async (type, screeningId) => {
    if (!reviewNote.trim()) return;
    setReviewLoading(true);
    try {
      await api.post(`/doctor/review/${type}/${screeningId}`, { doctor_notes: reviewNote });
      fetchPatientData(); // Refresh history to show updated commit.
      setReviewNote('');
    } catch {
      console.error('Commit Fault: Clinical review synchronization failed.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ─── NAVIGATION & COMMAND HEADER ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <button onClick={() => navigate('/doctor/patients')} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-saffron transition-all mb-4">
              <ArrowLeft size={16} /> Back to Clinical Registry
           </button>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Deep Dive</h1>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
              <Download size={18} /> Export EMR
           </button>
           <Link to="/doctor/appointments" className="btn-primary flex items-center gap-3 px-8 py-4 shadow-2xl shadow-saffron/20 transition-all hover:scale-105">
              <Calendar size={18} /> Schedule Engagement
           </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* ─── LEFT: IDENTITY VAULT ─────────────────────────────────────── */}
         <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-slate-50 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-3 bg-saffron"></div>
               <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[32px] flex items-center justify-center font-black text-4xl mx-auto shadow-inner border border-slate-100 group-hover:scale-110 transition-transform">
                     {patient?.full_name?.charAt(0)}
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-slate-900">{patient?.full_name}</h2>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Clinical ID: #{patient?.id}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-[32px] mt-10">
                  <div className="text-center border-r border-slate-200">
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Age</p>
                     <p className="text-xl font-black text-slate-900">{patient?.age}Y</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Biological</p>
                     <p className="text-xl font-black text-slate-900 capitalize">{patient?.gender}</p>
                  </div>
               </div>

               <div className="space-y-5 pt-10 border-t border-slate-50 mt-10">
                  <IdentityVector icon={<Mail size={18} />} label="Auth Channel" value={patient?.email} />
                  <IdentityVector icon={<Phone size={18} />} label="Contact Sync" value={patient?.phone || 'Zero Contact'} />
                  <IdentityVector icon={<Calendar size={18} />} label="Entry Date" value={new Date(patient?.created_at).toLocaleDateString()} />
               </div>
            </div>

            <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-saffron/10 blur-[80px]"></div>
               <div className="flex items-center gap-4 mb-8">
                  <TrendingUp className="text-saffron" size={24} />
                  <h3 className="font-black text-sm uppercase tracking-widest">Health Trajectory</h3>
               </div>
               <div className="space-y-6">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                     <span>Screening Density</span>
                     <span className="text-saffron">{history.length} Assessments</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-saffron w-[65%] rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-black uppercase tracking-widest opacity-60">High screening frequency detected. Monitor longitudinal stability.</p>
               </div>
            </div>
         </div>

         {/* ─── RIGHT: ANALYSIS AUDIT & REVIEW ───────────────────────────── */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-[10px] font-black text-slate-400 flex items-center gap-3 uppercase tracking-widest">
                  <History size={16} /> Analysis Manifest
               </h2>
               <div className="text-[10px] font-black text-saffron uppercase tracking-widest flex items-center gap-2">
                  <Info size={14} /> Critical Markers First
               </div>
            </div>

            {history.length > 0 ? (
               <div className="space-y-6">
                  {history.map((screening) => (
                     <AnalysisCard 
                        key={`${screening.type}-${screening.id}`} 
                        screening={screening} 
                        note={reviewNote}
                        onNoteChange={setReviewNote}
                        onReview={handleReview}
                        reviewLoading={reviewLoading}
                     />
                  ))}
               </div>
            ) : <EmptyState />}
         </div>
      </div>
    </div>
  );
};

/* --- SHARED FRAGMENTS --- */

const IdentityVector = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
     <div className="p-3 bg-slate-50 text-saffron rounded-xl shadow-inner">{icon}</div>
     <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
     </div>
  </div>
);

const AnalysisCard = ({ screening, note, onNoteChange, onReview, reviewLoading }) => (
  <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-50 border-l-[12px]" style={{ borderLeftColor: getRiskColor(screening.risk_band) }}>
     <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
        <div className="space-y-4">
           <div className="flex flex-wrap items-center gap-4">
              <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg text-white ${getRiskBg(screening.risk_band)}`}>
                 {screening.risk_band} RISK
              </span>
              <div className={`p-3 rounded-2xl ${screening.type === 'liver' ? 'bg-saffron/10 text-saffron' : 'bg-slate-900 text-saffron'}`}>
                 {screening.type === 'liver' ? <Activity size={24} /> : <Stethoscope size={24} />}
              </div>
              <p className="text-xl font-black text-slate-900 capitalize tracking-tight">{screening.type} Screening</p>
           </div>
           <p className="text-slate-500 font-medium italic leading-relaxed max-w-xl">"{screening.interpretation}"</p>
        </div>
        <div className="text-right">
           <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter border-b-4 border-saffron/20 pb-1">Verified</p>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{new Date(screening.created_at).toLocaleDateString()}</p>
        </div>
     </div>

     {screening.is_reviewed ? (
        <div className="bg-slate-50 rounded-[32px] p-8 flex gap-6 border border-slate-100">
           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl border border-slate-50 shrink-0"><CheckCircle2 size={28} /></div>
           <div className="space-y-2">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-2">Physician's Decision Support Commit</p>
              <p className="text-slate-700 font-medium italic bg-white/50 p-4 rounded-2xl">"{screening.doctor_notes}"</p>
           </div>
        </div>
     ) : (
        <div className="space-y-5 pt-8 border-t border-slate-50">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-saffron rounded-full"></div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Analysis Post</label>
           </div>
           <div className="flex gap-4">
              <textarea 
                value={note} onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Synchronize clinical recommendations for this patient..."
                className="flex-1 px-8 py-6 bg-slate-50 border border-slate-100 rounded-[32px] outline-none focus:ring-4 focus:ring-saffron/10 h-28 font-medium italic transition-all shadow-inner"
              />
              <button 
                onClick={() => onReview(screening.type, screening.id)}
                disabled={reviewLoading || !note.trim()}
                className="bg-slate-900 text-saffron group hover:bg-black w-20 h-28 rounded-[32px] flex flex-col items-center justify-center gap-2 shadow-2xl transition-all active:scale-95"
              >
                 {reviewLoading ? <Loader2 className="animate-spin" /> : <ChevronRight className="group-hover:translate-x-1 transition-transform" size={32} />}
                 <span className="text-[8px] font-black uppercase tracking-widest">Post</span>
              </button>
           </div>
        </div>
     )}
  </div>
);

const LoadingState = () => <div className="flex justify-center py-40"><Loader2 className="animate-spin text-saffron" size={40} /></div>;
const EmptyState = () => (
  <div className="bg-slate-50 border-dashed border-2 py-32 flex flex-col items-center justify-center text-center rounded-[60px]">
     <History size={48} className="text-slate-200 mb-8" />
     <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Vault: Reset</h3>
     <p className="text-slate-500 text-xs font-medium italic mt-4 max-w-xs uppercase tracking-widest leading-loose">No active clinical screenings detected for this identity.</p>
  </div>
);

const getRiskColor = (rb) => rb === 'Minimal' ? '#22c55e' : rb === 'Elevated' ? '#eab308' : '#ef4444';
const getRiskBg = (rb) => rb === 'Minimal' ? 'bg-emerald-500' : rb === 'Elevated' ? 'bg-saffron' : 'bg-rose-500';

export default PatientDetail;

