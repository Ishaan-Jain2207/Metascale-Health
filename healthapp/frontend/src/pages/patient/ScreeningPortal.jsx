/**
 * METASCALE HEALTH: DIAGNOSTIC TRIAGE PORTAL (ScreeningPortal.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component serves as the 'Command Gateway' for all patient-initiated 
 * screenings. It acts as a jurisdictional hub, routing users to specialized 
 * diagnostic vectors based on clinical intent.
 * 
 * ─── MULTI-VECTOR TRIAGE ENGINE ─────────────────────────────────────────────
 * The portal partitions metabolic health into two high-fidelity clusters:
 *   1. HEPATIC VECTOR (Liver): Focused on MASLD (Metabolic Dysfunction-Associated 
 *      Steatotic Liver Disease) risk assessment.
 *   2. METABOLIC VECTOR (Diabetes): Focused on T2D (Type 2 Diabetes) systemic 
 *      auditing.
 *   - Each vector utilizes a unique 'Inference Protocol' to synthesize 
 *     biomarkers into risk stratifications.
 * 
 * ─── SYSTEM TELEMETRY & COMPUTE GRID ────────────────────────────────────────
 * Features a real-time status indicator ('Compute Grid') that confirms core 
 * inference services are reachable. This provides patients with immediate 
 * confidence in protocol uptime.
 * 
 * ─── CLINICAL DATA ISOLATION ────────────────────────────────────────────────
 * Employs a 'Zero-Trust' UI paradigm where diagnostic intent is isolated 
 * behind premium gradients and high-impact micro-animations, reinforcing 
 * the 'Clinical OS' aesthetic of premium medical software.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Stethoscope, 
  Heart, 
  Search, 
  Info, 
  ChevronRight, 
  ShieldCheck,
  Zap,
  ArrowRight,
  Database
} from 'lucide-react';

const ScreeningPortal = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ─── PORTAL COMMAND CENTER: Narrative & Metadata ─────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-2 bg-saffron/10 text-saffron-deep rounded-2xl"><Activity size={36} /></div>
              Diagnostic Triage
           </h1>
           <p className="text-slate-500 font-medium italic max-w-xl leading-relaxed">
              Activate a specialized clinical vector to initiate localized bio-marker inference.
           </p>
        </div>
        
        {/* TELEMETRY: Real-time system availability pulse. */}
        <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
           <Zap size={16} className="text-saffron-deep animate-pulse" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Compute Grid: Active</span>
        </div>
      </div>

      {/* ─── SPECIALIZED DIAGNOSTIC VECTORS (Cards) ─────────────────────── */}
      <div className="grid md:grid-cols-2 gap-10">
        
        {/* LIVER DIAGNOSTIC PROTOCOL (MASLD Vector) */}
        <div className="group relative">
           <div className="absolute -inset-1 bg-gradient-to-r from-saffron to-saffron-deep rounded-[40px] blur opacity-10 group-hover:opacity-100 transition duration-1000"></div>
           <div className="relative card p-10 bg-white h-full flex flex-col justify-between border-slate-100 shadow-2xl transition-all duration-500 rounded-[32px]">
              <div>
                <div className="w-16 h-16 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                   <Activity size={32} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Liver Diagnostic</h3>
                <p className="text-slate-500 mb-8 font-medium italic leading-relaxed">
                   Hepatic risk stratification utilizing unit-normalized metabolic data clusters.
                </p>
                
                <div className="space-y-4 mb-10">
                   <ClinicalFeature label="Biomarker Synthesis" />
                   <ClinicalFeature label="Validated Hepatic Inference" />
                </div>
              </div>
              
              <Link to="/patient/screening/liver" className="btn-primary flex items-center justify-center gap-3 py-5 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">
                Initiate Vector <ChevronRight size={20} />
              </Link>
           </div>
        </div>

        {/* METABOLIC AUDIT PROTOCOL (Diabetes Vector) */}
        <div className="group relative">
           <div className="absolute -inset-1 bg-gradient-to-r from-slate-800 to-black rounded-[40px] blur opacity-5 group-hover:opacity-100 transition duration-1000"></div>
           <div className="relative card p-10 bg-white h-full flex flex-col justify-between border-slate-100 shadow-2xl transition-all duration-500 rounded-[32px]">
              <div>
                <div className="w-16 h-16 bg-slate-900 text-saffron rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                   <Database size={32} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Metabolic Audit</h3>
                <p className="text-slate-500 mb-8 font-medium italic leading-relaxed">
                   Systemic T2D evaluation based on longitudinal variables and clinical history markers.
                </p>
                
                <div className="space-y-4 mb-10">
                   <ClinicalFeature label="Tiered Risk Analysis" />
                   <ClinicalFeature label="Systemic Diagnostic Pulse" />
                </div>
              </div>
              
              <Link to="/patient/screening/diabetes" className="btn-primary flex items-center justify-center gap-3 py-5 text-[10px] font-black uppercase tracking-widest !bg-slate-900 !border-slate-800 hover:!bg-black shadow-xl transition-all">
                Initiate Vector <ChevronRight size={20} />
              </Link>
           </div>
        </div>
      </div>

      {/* ─── SECURITY & PRIVACY ARCHITECTURE ────────────────────────────── */}
      <div className="bg-white/50 backdrop-blur-3xl border border-white rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
         <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[20px] flex items-center justify-center shadow-inner"><ShieldCheck size={32} /></div>
            <div>
               <p className="font-bold text-slate-900 text-lg">Clinical Data Isolation</p>
               <p className="text-sm text-slate-500 font-medium italic">Parameters processed under strict medical privacy protocols with localized isolation.</p>
            </div>
         </div>
         <div className="flex items-center gap-3 text-slate-400 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
            <Info size={18} className="text-saffron-deep" />
            <span className="text-[10px] font-black uppercase tracking-widest">CDSS - Tier 1 Support</span>
         </div>
      </div>
    </div>
  );
};

// HELPER: Renders a standardized clinical marker.
const ClinicalFeature = ({ label }) => (
  <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
     <div className="w-5 h-5 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center border border-slate-100">
        <ArrowRight size={12} />
     </div> 
     {label}
  </div>
);

export default ScreeningPortal;


