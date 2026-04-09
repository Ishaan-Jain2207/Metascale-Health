/**
 * METASCALE HEALTH: CLINICAL PATIENT REGISTRY (PatientList.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component serves as the 'Relational Hub' for healthcare providers. 
 * It manages the Clinical Registry—a central archive of all patients associated 
 * with the practitioner, providing a unified view of their longitudinal 
 * health journeys and metabolic screening frequencies.
 * 
 * ─── UNIFIED AUDIT VIEW ─────────────────────────────────────────────────────
 * Each patient in the registry is presented with a 'Diagnostic Index':
 *   - SCREENING COUNT: Cumulative audit of Liver/Diabetes assessments.
 *   - VECTOR FLAGS: Visual indicators for specific completed screening types 
 *     (Liver Activity vs. Metabolic Pulse).
 *   - DEMOGRAPHIC METADATA: Synchronized age/gender info for immediate clinical 
 *     context.
 * 
 * ─── SEARCH-DRIVEN TRIAGE ───────────────────────────────────────────────────
 * Implements a 'Zero-Lag' search engine that filters the registry in real-time. 
 * This allows clinicians to instantly locate specific diagnostic records 
 * amid high patient volumes, improving workflow throughput.
 * 
 * ─── DESIGN SYSTEM: CLINICAL OS (SAFFRON) ───────────────────────────────────
 * Leverages the 'Metascale Saffron' and 'Slate' system to ensure high-fidelity 
 * visual hierarchy and a premium medical software experience.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Mail, 
  Activity, 
  Stethoscope,
  Loader2,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import api from '../../services/api';

const PatientList = () => {
  // ─── STATE MANAGEMENT: Registry Buffers ───────────────────────────────────
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  /**
   * REPOSITORY SYNCHRONIZATION (fetchPatients)
   * Logic: Dispatches a request to the specialized doctor-patient mapping.
   */
  const fetchPatients = async () => {
    try {
      const res = await api.get('/doctor/patients');
      if (res.data.success) {
        setPatients(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch {
      setError('Critical Fault: Failed to synchronize with patient registry.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * REAL-TIME TRIAGE LOGIC
   * Logic: Filters the patient manifest based on the search vector (Name/Email).
   */
  const filteredPatients = patients.filter(p => 
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* COMMAND CENTER HEADER & SEARCH GATEWAY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-2 bg-saffron/10 text-saffron-deep rounded-2xl"><Users size={36} /></div>
              Clinical Registry
           </h1>
           <p className="text-slate-500 font-medium italic mt-1">Unified repository of patient metabolic audit trails.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-saffron-deep transition-colors" size={18} />
              <input 
                type="text" placeholder="Search Identity (Name/Email)..." 
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-saffron/5 w-full md:w-80 font-bold text-sm shadow-sm"
              />
           </div>
           <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-saffron-deep transition-all shadow-sm"><Filter size={20} /></button>
        </div>
      </div>

      {error ? <ErrorDisplay error={error} /> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredPatients.map((patient) => (
              <PatientRegistryCard key={patient.id} patient={patient} />
           ))}
           
           {filteredPatients.length === 0 && <EmptyRegistryState />}
        </div>
      )}
    </div>
  );
};

/* --- SHARED FRAGMENTS & ATOMS --- */

const PatientRegistryCard = ({ patient }) => (
  <div className="bg-white rounded-[40px] p-8 hover:shadow-2xl hover:-translate-y-1 transition-all border border-slate-50 group">
     <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-[24px] flex items-center justify-center font-black text-xl shadow-inner group-hover:bg-saffron group-hover:text-white transition-all">
              {patient.full_name?.charAt(0)}
           </div>
           <div>
              <h3 className="font-black text-slate-900 text-lg leading-tight">{patient.full_name}</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{patient.age}Y • {patient.gender}</p>
           </div>
        </div>
        <button className="p-2 text-slate-300 hover:text-slate-400"><MoreVertical size={20} /></button>
     </div>
     
     <div className="space-y-4 mb-10">
        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-tight truncate">
           <Mail size={16} className="text-saffron" /> {patient.email}
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <Activity size={16} className="text-saffron" /> {patient.total_screenings || 0} TOTAL AUDITS
        </div>
     </div>

     <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
        <div className="flex gap-2">
           {patient.has_liver && <div className="p-2 bg-saffron/10 text-saffron-deep rounded-xl" title="Liver Active"><Activity size={14} /></div>}
           {patient.has_diabetes && <div className="p-2 bg-slate-900 text-saffron rounded-xl" title="Metabolic Active"><Stethoscope size={14} /></div>}
        </div>
        <Link 
          to={`/doctor/patients/${patient.id}`} 
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-saffron transition-all shadow-xl active:scale-95 flex items-center gap-2"
        >
           Review History <ChevronRight size={14} />
        </Link>
     </div>
  </div>
);

const LoadingState = () => <div className="flex justify-center py-40"><Loader2 className="animate-spin text-saffron" size={40} /></div>;

const ErrorDisplay = ({ error }) => (
  <div className="bg-red-50 border border-red-100 p-8 rounded-[40px] flex items-center gap-6 text-red-700">
     <AlertCircle size={32} />
     <p className="font-black uppercase tracking-widest text-xs">{error}</p>
  </div>
);

const EmptyRegistryState = () => (
   <div className="col-span-full bg-slate-50 border-dashed border-2 py-32 flex flex-col items-center justify-center text-center rounded-[60px]">
      <Users size={48} className="text-slate-200 mb-8" />
      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Registry: Empty</h3>
      <p className="text-slate-500 text-xs font-medium italic mt-4 max-w-xs uppercase tracking-widest leading-loose">No clinical matches found in the active patient manifest.</p>
   </div>
);

export default PatientList;
t;
