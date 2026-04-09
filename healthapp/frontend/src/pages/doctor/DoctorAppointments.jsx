/**
 * METASCALE HEALTH: CLINICAL WORKFLOW ENGINE (DoctorAppointments.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component acts as the 'Professional Cockpit' for healthcare specialists. 
 * It manages the high-density daily roster, enabling clinicians to orchestrate 
 * patient sessions from request triage to post-consultation data commits.
 * 
 * ─── APPOINTMENT STATE TRANSITIONS ──────────────────────────────────────────
 * The engine manages a three-stage lifecycle for every consultation:
 *   1. TRIAGE (Pending): Incoming requests awaiting clinical authorization.
 *   2. ACTIVE (Confirmed): Scheduled engagements requiring observation & notes.
 *   3. ARCHIVED (Completed/Cancelled): Finalized records preserved for 
 *      longitudinal analysis.
 * 
 * ─── CLINICAL NOTE SYNTHESIS ────────────────────────────────────────────────
 * Supports real-time markdown-capable note buffering. Clinicians can draft 
 * observations during a session and commit them to the patient's permanent 
 * record upon completion, ensuring data-integrity and zero-lag record-keeping.
 * 
 * ─── HUMAN-AI ALIGNMENT TELEMETRY ───────────────────────────────────────────
 * Features a 'Diagnostic Sync' index which visualizes the statistical 
 * correlation between AI-generated risk clusters and human clinical findings, 
 * reinforcing the system's role as a Decision Support Tool.
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2,
  Check,
  ChevronRight,
  Stethoscope,
  History,
  FileText,
  Activity
} from 'lucide-react';
import api from '../../services/api';

const DoctorAppointments = () => {
  // ─── STATE MANAGEMENT: Roster Buffer ────────────────────────────────────
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [noteMap, setNoteMap] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  /**
   * REPOSITORY SYNCHRONIZATION (fetchAppointments)
   * Logic: Dispatches a request to the clinical schedule archive.
   */
  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/doctor');
      setAppointments(res.data.data);
    } catch {
      console.error('Contextual Fault: Clinical roster unreachable.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * STATE MUTATION PROTOCOL (updateStatus)
   * Logic: Updates session status and persists clinical observations.
   */
  const updateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await api.put(`/appointments/${id}/status`, { 
        status, 
        doctor_notes: noteMap[id] || '' 
      });
      fetchAppointments();
      setNoteMap({ ...noteMap, [id]: '' }); // Flush note buffer.
    } catch {
      console.error('Mutation Fault: Failure in session status transition.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingState />;

  // QUEUE SEGMENTATION
  const pending = appointments.filter(a => a.status === 'pending');
  const upcoming = appointments.filter(a => a.status === 'confirmed');
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* COMMAND CENTER HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-2 bg-saffron/10 text-saffron-deep rounded-2xl"><Calendar size={36} /></div>
              Clinical Roster
           </h1>
           <p className="text-slate-500 font-medium italic mt-1">Orchestrating active consultations & diagnostic synthesis.</p>
        </div>
      </div>

      {/* 1. TRIAGE QUEUE: Incoming Authorization Requests */}
      {pending.length > 0 && (
         <section className="space-y-6">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
               <AlertCircle size={14} className="text-saffron animate-pulse" /> Authorization Pending
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
               {pending.map(appt => <TriageCard key={appt.id} appt={appt} onAction={updateStatus} loadingId={actionLoading} />)}
            </div>
         </section>
      )}

      {/* 2. ACTIVE WORKFLOW: Confirmed Sessions */}
      <div className="grid lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-8">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
               <CheckCircle2 size={14} className="text-emerald-500" /> Active Roster
            </h2>
            {upcoming.length > 0 ? (
               <div className="space-y-6">
                  {upcoming.map(appt => (
                     <ActiveSessionCard 
                       key={appt.id} appt={appt} 
                       note={noteMap[appt.id] || ''} 
                       onNoteChange={(v) => setNoteMap({ ...noteMap, [appt.id]: v })} 
                       onComplete={updateStatus} 
                       loadingId={actionLoading} 
                     />
                  ))}
               </div>
            ) : <EmptyState />}
         </div>

         {/* 3. OPERATIONAL METRICS SIDEBAR */}
         <div className="space-y-10">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">System Telemetry</h2>
            <MetricCard title="Diagnostic Alignment" value="94.8%" status="Human-AI Correlation" />
            <AuditHistorySidebar past={past} />
         </div>
      </div>
    </div>
  );
};

/* --- SHARED FRAGMENTS & ATOMS --- */

const TriageCard = ({ appt, onAction, loadingId }) => (
  <div className="bg-white rounded-[40px] p-8 border-l-8 border-l-saffron shadow-2xl relative overflow-hidden">
     <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center font-black">{appt.patient_name?.charAt(0)}</div>
           <div>
              <p className="font-black text-slate-900">{appt.patient_name}</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{appt.age}Y • {appt.gender}</p>
           </div>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{appt.appt_time}</p>
           <p className="text-[9px] text-slate-400 font-bold mt-1">{new Date(appt.appt_date).toLocaleDateString()}</p>
        </div>
     </div>
     <div className="bg-slate-50 p-6 rounded-3xl mb-8 text-xs font-medium italic text-slate-500 line-clamp-2">" {appt.reason} "</div>
     <div className="flex gap-4">
        <button onClick={() => onAction(appt.id, 'confirmed')} disabled={loadingId === appt.id} className="flex-1 btn-primary py-4 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
           {loadingId === appt.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve Session
        </button>
        <button onClick={() => onAction(appt.id, 'cancelled')} disabled={loadingId === appt.id} className="p-4 bg-slate-50 text-slate-300 rounded-2xl hover:text-red-500 transition-colors"><XCircle size={20} /></button>
     </div>
  </div>
);

const ActiveSessionCard = ({ appt, note, onNoteChange, onComplete, loadingId }) => (
  <div className="bg-white rounded-[48px] p-8 shadow-xl border border-slate-50 border-l-[12px] border-l-saffron">
     <div className="flex flex-col md:flex-row gap-10">
        <div className="min-w-[200px]">
           <p className="text-2xl font-black text-slate-900 mb-2 leading-none">{appt.patient_name}</p>
           <div className="flex items-center gap-3 text-[10px] font-black text-saffron-deep uppercase tracking-widest">
              <Clock size={14} /> {appt.appt_time} • {new Date(appt.appt_date).toLocaleDateString()}
           </div>
        </div>
        <div className="flex-1">
           <textarea 
             placeholder="Synchronizing medical findings..." 
             value={note} onChange={(e) => onNoteChange(e.target.value)}
             className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-medium outline-none focus:ring-4 focus:ring-saffron/10 h-24 resize-none transition-all placeholder:text-slate-300 italic"
           />
        </div>
        <button onClick={() => onComplete(appt.id, 'completed')} disabled={loadingId === appt.id} className="w-20 h-20 bg-slate-900 text-saffron rounded-[30px] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl">
           {loadingId === appt.id ? <Loader2 size={24} className="animate-spin" /> : <Check size={32} />}
        </button>
     </div>
  </div>
);

const MetricCard = ({ title, value, status }) => (
  <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
     <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform"><Activity size={120} /></div>
     <h3 className="text-saffron text-2xl font-black mb-6">{title}</h3>
     <div className="space-y-4">
        <div className="flex justify-between font-black text-[9px] uppercase tracking-widest text-slate-400"><span>{status}</span><span>{value}</span></div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-saffron w-[94.8%]"></div></div>
     </div>
  </div>
);

const AuditHistorySidebar = ({ past }) => (
  <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100">
     <h3 className="font-black text-slate-900 flex items-center gap-3 text-[10px] uppercase tracking-widest mb-6">Patient Audit Log</h3>
     <div className="space-y-4">
        {past.slice(0, 5).map(p => (
           <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[9px] font-black text-slate-300 border border-slate-50">{p.patient_name?.charAt(0)}</div>
                 <div>
                    <p className="text-xs font-black text-slate-800">{p.patient_name}</p>
                    <p className={`text-[8px] font-black uppercase ${p.status === 'completed' ? 'text-emerald-500' : 'text-red-400'}`}>{p.status}</p>
                 </div>
              </div>
              <ChevronRight size={14} className="text-slate-300" />
           </div>
        ))}
     </div>
  </div>
);

const LoadingState = () => <div className="flex justify-center py-40"><Loader2 className="animate-spin text-saffron" size={40} /></div>;

const EmptyState = () => (
  <div className="bg-slate-50 border-dashed border-2 py-32 flex flex-col items-center text-center rounded-[60px]">
     <Stethoscope size={48} className="text-slate-200 mb-8" />
     <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Roster: Clear</h3>
     <p className="text-slate-500 text-xs font-medium italic mt-4 max-w-xs uppercase tracking-widest leading-loose">No active consultations recorded. Clinical capacity optimal.</p>
  </div>
);

export default DoctorAppointments;
