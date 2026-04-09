/**
 * METASCALE HEALTH: CONSULTATION LIFECYCLE HUB (PatientAppointments.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component orchestrates the 'Consultation Lifecycle'—the bridge between 
 * digital screenings and professional clinical review. It enables patients 
 * to secure dedicated compute/consultation time with verified specialists.
 * 
 * ─── SCHEDULING ORCHESTRATION & GUARDRAILS ──────────────────────────────────
 * Implements strict clinical constraints to ensure protocol integrity:
 *   1. TEMPORAL HORIZON: Consultations are restricted to the 'Current Active Year'. 
 *      Patients can book from [Today] to [Dec 31, Current Year].
 *   2. CLINICAL HOURS: Enforces an 08:00 to 22:00 (8 AM - 10 PM) window, 
 *      synchronizing with standard hospital operational telemetry.
 * 
 * ─── DATA SYNCHRONIZATION FLOW ──────────────────────────────────────────────
 *   - SPECIALIST DISCOVERY: Pulls verified healthcare providers from the 
 *     clinical registry.
 *   - SCHEDULE BUFFERING: Fetches the patient's existing audit trail of 
 *     appointments (Confirmed/Pending/Cancelled).
 * 
 * ─── DESIGN SYSTEM: CLINICAL OS (SAFFRON) ───────────────────────────────────
 * Utilizes the 'Metascale Saffron' palette for primary actions and 'Slate' 
 * for secondary informational layers, maintaining the high-fidelity 
 * 'Clinical OS' aesthetic.
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  XCircle,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';

const PatientAppointments = () => {
  // ─── STATE MANAGEMENT: Clinical Buffers ───────────────────────────────────
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // FORM STATE: Initialized with default clinical parameters.
  const [newAppt, setNewAppt] = useState({
    doctor_id: '',
    appt_date: '',
    appt_time: '',
    reason: '',
    type: 'in-person'
  });

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * REPOSITORY SYNCHRONIZATION (fetchData)
   * logic: Simultaneously retrieves the patient's schedule and the 
   * centralized specialist manifest.
   */
  const fetchData = async () => {
    try {
      const [apptRes, doctorRes] = await Promise.all([
        api.get('/appointments/patient'),
        api.get('/auth/doctors')
      ]);
      setAppointments(apptRes.data.data);
      setDoctors(doctorRes.data.data);
    } catch {
      setErrorMessage('Critical Error: Failed to synchronize with clinical schedule.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * BOOKING VALIDATION & TRANSMISSION (handleBook)
   * logic: Enforces clinical guardrails before protocol transmission.
   */
  const handleBook = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // ENFORCEMENT: Clinical Hours (08:00 - 22:00)
    const [hours, minutes] = newAppt.appt_time.split(':').map(Number);
    if (hours < 8 || hours >= 22) {
      return setErrorMessage('Protocol Violation: Consultations must be within 08:00 - 22:00 window.');
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/appointments/book', newAppt);
      if (res.data.success) {
        setShowBooking(false);
        fetchData(); // Re-sync local schedule.
        setNewAppt({ doctor_id: '', appt_date: '', appt_time: '', reason: '', type: 'in-person' });
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Booking transmission failure.');
    } finally {
      setBookingLoading(false);
    }
  };

  /**
   * TEMPORAL CALCULATIONS (Date Guardrails)
   */
  const today = new Date().toISOString().split('T')[0];
  const yearEnd = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ─── COMMAND CENTER HEADER ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-2 bg-saffron/10 text-saffron-deep rounded-2xl"><Calendar size={36} /></div>
              Consultations
           </h1>
           <p className="text-slate-500 font-medium italic mt-1">Orchestrating professional medical engagements.</p>
        </div>
        
        <button 
          onClick={() => setShowBooking(!showBooking)}
          className="btn-primary flex items-center gap-3 px-8 shadow-2xl shadow-saffron/20 transition-all hover:scale-105"
        >
          {showBooking ? <XCircle size={20} /> : <Plus size={20} />}
          {showBooking ? 'Terminate Request' : 'Schedule Engagement'}
        </button>
      </div>

      {/* ─── BOOKING INTERFACE (Conditional Modal Layer) ──────────────────── */}
      {showBooking && (
        <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-saffron/10 animate-in zoom-in-95 duration-200">
           <div className="flex items-center gap-4 mb-8">
              <div className="h-8 w-1 bg-saffron rounded-full"></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Protocol Initiation</h2>
           </div>
           
           {errorMessage && (
             <div className="mb-8 p-6 bg-red-50 text-red-700 rounded-3xl border border-red-100 flex items-center gap-4 font-bold text-xs uppercase tracking-widest">
                <AlertCircle size={24} /> {errorMessage}
             </div>
           )}

           <form onSubmit={handleBook} className="grid md:grid-cols-2 gap-8">
              {/* SPECIALIST SELECTION */}
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Specialist Provider</label>
                 <select 
                   value={newAppt.doctor_id}
                   onChange={(e) => setNewAppt({...newAppt, doctor_id: e.target.value})}
                   required
                   className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-4 focus:ring-saffron/10 font-bold text-sm"
                 >
                    <option value="">Select Clinical Authority</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.full_name} ({d.specialization})</option>
                    ))}
                 </select>
              </div>

              {/* TEMPORAL VECTORS */}
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Date Horizon</label>
                    <input 
                      type="date" min={today} max={yearEnd}
                      value={newAppt.appt_date}
                      onChange={(e) => setNewAppt({...newAppt, appt_date: e.target.value})}
                      required
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-sm outline-none"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Slot Vector</label>
                    <input 
                      type="time" 
                      value={newAppt.appt_time}
                      onChange={(e) => setNewAppt({...newAppt, appt_time: e.target.value})}
                      required
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-sm outline-none"
                    />
                 </div>
              </div>

              {/* ENGAGEMENT FORMAT */}
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Manifest Format</label>
                 <div className="flex gap-4 p-1.5 bg-slate-100 rounded-[24px]">
                    <FormatOption active={newAppt.type === 'in-person'} label="In-Person" onClick={() => setNewAppt({...newAppt, type: 'in-person'})} />
                    <FormatOption active={newAppt.type === 'virtual'} label="Virtual" onClick={() => setNewAppt({...newAppt, type: 'virtual'})} />
                 </div>
              </div>

              {/* CONTEXTUAL REASONING */}
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Clinical Context</label>
                 <input 
                   type="text" value={newAppt.reason}
                   onChange={(e) => setNewAppt({...newAppt, reason: e.target.value})}
                   placeholder="e.g. Metabolic Screening Review" required
                   className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-sm outline-none"
                 />
              </div>

              <div className="md:col-span-2 pt-6">
                 <button 
                   type="submit" disabled={bookingLoading}
                   className="w-full btn-primary py-6 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-saffron/30 active:scale-[0.98] transition-all"
                 >
                   {bookingLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                   {bookingLoading ? 'Transmitting Request...' : 'Authorize Clinical Booking'}
                 </button>
              </div>
           </form>
        </div>
      )}

      {/* ─── SCHEDULE MANIFEST ────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Longitudinal Schedule</h2>
            {appointments.length > 0 ? (
               <div className="space-y-6">
                  {appointments.map(appt => (
                     <AppointmentCard key={appt.id} appt={appt} />
                  ))}
               </div>
            ) : <EmptyScheduleState />}
         </div>

         {/* ─── SIDEBAR: SPECIALIST DIRECTORY ────────────────────────────────── */}
         <div className="space-y-8">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Authority Directory</h2>
            <div className="space-y-4">
               {doctors.slice(0, 3).map(doctor => (
                  <DoctorQuickView key={doctor.id} doctor={doctor} />
               ))}
            </div>
            
            <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-saffron/10 blur-[80px]"></div>
               <div className="relative z-10 flex gap-6">
                  <div className="p-3 bg-white/10 rounded-2xl h-fit text-saffron"><Info size={24} /></div>
                  <div className="space-y-4">
                     <h4 className="font-black text-sm uppercase tracking-widest text-saffron">Engagement Protocol</h4>
                     <p className="text-[10px] leading-relaxed font-medium text-slate-400 uppercase tracking-widest leading-loose">
                        Ensure all diagnostic vectors (Liver/Diabetes) are synchronized to the 'Audit Vault' before the consultation trigger.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

/* --- SHARED FRAGMENTS & ATOMS --- */

const FormatOption = ({ active, label, onClick }) => (
  <button 
    type="button" onClick={onClick}
    className={`flex-1 py-4 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-saffron-deep shadow-lg ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {label}
  </button>
);

const AppointmentCard = ({ appt }) => (
  <div className="bg-white rounded-[40px] p-8 hover:shadow-2xl transition-all border border-slate-50 border-l-8" style={{ borderLeftColor: getStatusColor(appt.status) }}>
     <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shadow-inner group-hover:text-saffron transition-colors">
              <User size={32} />
           </div>
           <div>
              <p className="font-black text-slate-900 text-lg">{appt.doctor_name}</p>
              <p className="text-[10px] text-saffron-deep font-black uppercase tracking-widest mt-1">{appt.specialization}</p>
           </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <Calendar size={18} className="text-saffron" /> {new Date(appt.appt_date).toLocaleDateString()}
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <Clock size={18} className="text-saffron" /> {appt.appt_time}
           </div>
           <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg ${getStatusBg(appt.status)}`}>
              {appt.status}
           </div>
        </div>
     </div>
     {appt.doctor_notes && (
        <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-sm text-slate-600 font-medium italic relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5"><Plus size={32}/></div>
          " {appt.doctor_notes} "
        </div>
     )}
  </div>
);

const DoctorQuickView = ({ doctor }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all">
     <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-saffron text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">
           {doctor.full_name?.charAt(0)}
        </div>
        <div>
           <p className="font-bold text-slate-900 leading-tight">{doctor.full_name}</p>
           <p className="text-[9px] text-saffron-deep font-black uppercase tracking-widest">{doctor.specialization}</p>
        </div>
     </div>
     <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2"><MapPin size={12} /> {doctor.hospital || 'Metascale Center'}</p>
  </div>
);

const EmptyScheduleState = () => (
   <div className="bg-slate-50 border-dashed border-2 py-24 flex flex-col items-center text-center rounded-[48px]">
      <Calendar size={48} className="text-slate-200 mb-6" />
      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Schedule Empty</h3>
      <p className="text-slate-500 text-xs font-medium italic mt-4 max-w-xs uppercase tracking-widest leading-loose">No active consultations detected. Secure your medical engagement now.</p>
   </div>
);

const LoadingState = () => <div className="flex justify-center py-40"><Loader2 className="animate-spin text-saffron" size={40} /></div>;

const getStatusColor = (status) => status === 'confirmed' ? '#22c55e' : status === 'pending' ? '#f59e0b' : '#ef4444';
const getStatusBg = (status) => status === 'confirmed' ? 'bg-emerald-500' : status === 'pending' ? 'bg-saffron' : 'bg-rose-500';

export default PatientAppointments;


