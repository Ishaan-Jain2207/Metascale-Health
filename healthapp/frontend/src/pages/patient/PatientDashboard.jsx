/**
 * METASCALE HEALTH: PATIENT CONTROL CENTER (PatientDashboard.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component acts as the 'Primary Command Center' for the patient user. 
 * It provides a high-fidelity, synthesized view of their metabolic health 
 * status, clinical appointments, and diagnostic record volume.
 * 
 * ─── TELEMETRY AGGREGATION LOGIC ────────────────────────────────────────────
 * Upon entry, the dashboard initiates the 'Data Orchestration' flow:
 *   1. UCR SYNCHRONIZATION: Fetches the 'Universal Clinical Record' (history) 
 *      to isolate the most recent data points for Liver and Diabetes health.
 *   2. SESSION TRACKING: Queries the appointment manifest to identify 
 *      the next confirmed engagement with a specialist.
 *   3. AGGREGATE SUMMARY: Computes total screening volume to display 
 *      the patient's longitudinal participation level.
 * 
 * ─── CLINICAL MONITOR AESTHETIC ─────────────────────────────────────────────
 * The UI implements a 'Clinical Monitor' aesthetic:
 *   - HERO STATE: A high-contrast dark-mode banner provides immediate 
 *     situational awareness.
 *   - STATUS MARKERS: Utilizes 'Risk Tiers' (Minimal/Elevated/High) with 
 *     semantic coloring to facilitate instant heuristic interpretation.
 *   - LEGACY BRIDGE: Integrates the 'AngularAuditTool' for real-time 
 *     system transparency.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ClipboardCheck, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import AngularAuditTool from '../../components/clinical/AngularAuditTool';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // DASHBOARD STATE: Aggregated results for rapid UI hydration.
  const [stats, setStats] = useState({
    total: 0,
    latestLiver: null,
    latestDiabetes: null,
    upcomingAppt: null
  });
  const [loading, setLoading] = useState(true);

  // LIFECYCLE: Standard data synchronization on mount.
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * DATA ORCHESTRATION (fetchDashboardData)
   * 
   * Logic:
   *   - Performs a multi-node fetch to Backend APIs.
   *   - Heuristic Sorting: Locates the most recent 'liver' and 'diabetes' 
   *     records from the history array.
   *   - Schedule Management: Filters for 'confirmed' or 'pending' engagements.
   */
  const fetchDashboardData = async () => {
    try {
      const historyRes = await api.get('/predict/history');
      const apptRes = await api.get('/appointments/patient');
      
      const history = historyRes.data.data;
      const latestLiver = history.find(h => h.type === 'liver');
      const latestDiabetes = history.find(h => h.type === 'diabetes');
      const upcomingAppt = apptRes.data.data.find(a => a.status === 'confirmed' || a.status === 'pending');

      setStats({
        total: history.length,
        latestLiver,
        latestDiabetes,
        upcomingAppt
      });
    } catch (err) {
      console.error('[DASHBOARD FAULT] Data Sync Failure:', err);
    } finally {
      setLoading(false);
    }
  };

  const healthTips = [
    "Ensuring 7-8 hours of sound sleep is critical for hepatic homeostasis.",
    "A 30-minute brisk walk daily improves insulin sensitivity markers.",
    "Reducing processed sugar protects liver cells from oxidative stress."
  ];
  const [dailyTip] = useState(healthTips[Math.floor(Math.random() * healthTips.length)]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8 p-6">
        <div className="h-48 bg-slate-100 rounded-3xl w-full" />
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-50 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ─── STAGE 1: WELCOME HERO (COMMAND CENTER) ───────────────────────── */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl">
         <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 -mr-10"><Activity size={240} /></div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-saffron/20 text-saffron px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
               <Activity size={14} /> Clinical Active
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Salutations, {user?.full_name?.split(' ')[0]}</h1>
            <p className="text-slate-400 max-w-xl text-lg font-medium">
               Your identity is secure. There are {stats.total} diagnostic records in your Clinical Vault.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
               <Link to="/patient/screening" className="btn-primary">
                  <ClipboardCheck size={20} className="mr-2" /> Initiate Screening
               </Link>
               <Link to="/patient/appointments" className="btn-secondary !text-white !border-white/10 !bg-white/10 hover:!bg-white/20">
                  <Calendar size={20} className="mr-2" /> Book Consultation
               </Link>
            </div>
         </div>
      </div>

      {/* ─── STAGE 2: TELEMETRY SUMMARY ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard label="History Count" value={stats.total} icon={<Activity />} color="border-l-saffron" />
         <StatCard label="Latest Liver" value={stats.latestLiver?.risk_band || 'N/A'} icon={<TrendingUp />} color="border-l-indigo-500" />
         <StatCard label="Latest Diabetes" value={stats.latestDiabetes?.risk_band || 'N/A'} icon={<Activity />} color="border-l-saffron-deep" />
         <StatCard label="Next Session" value={stats.upcomingAppt?.appt_date ? new Date(stats.upcomingAppt.appt_date).toLocaleDateString() : 'None'} icon={<Calendar />} color="border-l-slate-900" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* ─── STAGE 3: DIAGNOSTIC RECAP ──────────────────────────────────── */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">Metabolic Risk Profile</h2>
               <Link to="/patient/history" className="text-primary-600 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1">Protocol Archive <ArrowRight size={14} /></Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
               <ResultCard type="liver" data={stats.latestLiver} navigate={navigate} />
               <ResultCard type="diabetes" data={stats.latestDiabetes} navigate={navigate} />
            </div>
         </div>

         {/* ─── STAGE 4: CLINICAL ENGAGEMENTS ──────────────────────────────── */}
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Engagements</h2>
            {stats.upcomingAppt ? (
               <div className="card bg-slate-900 text-white p-6 rounded-[32px]">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-saffron"><Calendar size={24} /></div>
                     <div>
                        <p className="font-bold text-sm">{stats.upcomingAppt.doctor_name}</p>
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{stats.upcomingAppt.specialization}</p>
                     </div>
                  </div>
                  <div className="space-y-2 mb-6 text-xs text-primary-400">
                     <p className="flex items-center gap-2"><Calendar size={14} /> {new Date(stats.upcomingAppt.appt_date).toLocaleDateString()}</p>
                     <p className="flex items-center gap-2"><Clock size={14} /> {stats.upcomingAppt.appt_time}</p>
                  </div>
                  <button onClick={() => navigate('/patient/appointments')} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                     Manage Schedule
                  </button>
               </div>
            ) : (
               <div className="card bg-slate-50 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center py-12 rounded-[32px]">
                  <p className="text-slate-400 text-sm font-bold">No sessions scheduled.</p>
               </div>
            )}
            
            {/* System Transparency Bridge */}
            <AngularAuditTool />
            
            {/* Daily Knowledge Seed */}
            <div className="bg-saffron/5 rounded-[32px] p-8 border border-saffron/10 group">
                <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                   <CheckCircle2 size={16} className="text-saffron-deep" /> Daily Insight
                </h3>
                <p className="text-sm text-slate-600 italic font-medium">"{dailyTip}"</p>
             </div>
         </div>
      </div>
    </div>
  );
};

/* --- SHARED SUB-COMPONENTS --- */

const StatCard = ({ label, value, icon, color }) => (
  <div className={`card border-l-4 ${color} p-5 rounded-2xl bg-white shadow-sm flex items-center gap-4`}>
    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center">{icon}</div>
    <div className="min-w-0">
      <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-slate-900 truncate">{value}</p>
    </div>
  </div>
);

const ResultCard = ({ type, data, navigate }) => {
  const isLiver = type === 'liver';
  const colorSet = isLiver ? 'border-l-indigo-500 bg-indigo-50/10' : 'border-l-saffron-deep bg-saffron-light/5';
  
  return (
    <div className={`card ${colorSet} p-6 rounded-3xl border-t border-r border-b border-slate-100`}>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{isLiver ? 'Liver Health' : 'Diabetes Profiling'}</h3>
      {data ? (
        <>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white shadow-sm mb-4">
            {data.risk_band} RISK TIER
          </span>
          <p className="text-slate-500 text-xs italic mb-6">"{data.interpretation}"</p>
          <button onClick={() => navigate(isLiver ? `/patient/history/detail/liver/${data.id}` : `/patient/history/detail/diabetes/${data.id}`)} className="text-[10px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-2">
             Detailed Analytics <ArrowRight size={14} />
          </button>
        </>
      ) : (
        <button onClick={() => navigate('/patient/screening')} className="btn-primary w-full py-3 text-[10px] font-black uppercase tracking-widest mt-4">Initiate Scan</button>
      )}
    </div>
  );
};

export default PatientDashboard;


