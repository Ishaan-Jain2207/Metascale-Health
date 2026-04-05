import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ArrowLeft, 
  Activity, 
  Stethoscope, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  Calendar, 
  Phone, 
  Mail,
  Loader2,
  AlertCircle,
  TrendingUp,
  Download,
  Info
} from 'lucide-react';
import api from '../../services/api';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  const fetchPatientData = useCallback(async () => {
    try {
      const [patientRes, historyRes] = await Promise.all([
        api.get(`/doctor/patients/${id}`),
        api.get(`/predict/history/${id}`)
      ]);
      setPatient(patientRes.data.data);
      setHistory(historyRes.data.data);
    } catch {
      console.error('Error fetching patient data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  const handleReview = async (type, screeningId) => {
    if (!reviewNote.trim()) return;
    setReviewLoading(true);
    try {
      await api.post(`/doctor/review/${type}/${screeningId}`, { doctor_notes: reviewNote });
      fetchPatientData();
      setReviewNote('');
    } catch (err) {
      console.error('Error reviewing screening:', err);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <button onClick={() => navigate('/doctor/patients')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary-600 mb-2 transition-colors">
              <ArrowLeft size={18} /> Back to Patient List
           </button>
           <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Clinical Profile Review</h1>
        </div>
        <div className="flex items-center gap-3">
           <button className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
              <Download size={16} /> Export EMR
           </button>
           <Link to="/doctor/appointments" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm shadow-md">
              <Calendar size={16} /> Schedule Follow-up
           </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Patient Identity Card */}
         <div className="lg:col-span-1 space-y-6">
            <div className="card space-y-8 relative overflow-hidden bg-white">
               <div className="absolute top-0 left-0 w-full h-2 bg-primary-600"></div>
               <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-4xl mx-auto shadow-xl border-4 border-white shadow-primary-50">
                     {patient?.full_name?.charAt(0)}
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold text-slate-900">{patient?.full_name}</h2>
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Patient Identity: #{patient?.id}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div className="text-center border-r border-slate-200">
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Age</p>
                     <p className="text-xl font-bold text-slate-900">{patient?.age} Years</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gender</p>
                     <p className="text-xl font-bold text-slate-900 capitalize">{patient?.gender}</p>
                  </div>
               </div>

               <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                     <Mail size={18} className="text-slate-400" /> <span className="truncate">{patient?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                     <Phone size={18} className="text-slate-400" /> <span>{patient?.phone || 'Not Provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                     <Calendar size={18} className="text-slate-400" /> <span>Registered {new Date(patient?.created_at).toLocaleDateString()}</span>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6">
               <div className="flex items-center gap-3">
                  <TrendingUp className="text-primary-400" />
                  <h3 className="font-bold">Health Trajectory</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                     <span>Screening Density</span>
                     <span>{history.length} Assessments</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-primary-500 w-[65%] rounded-full shadow-lg shadow-primary-500/50"></div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium pt-2">Frequent screenings indicate proactive health monitoring from the patient side.</p>
               </div>
            </div>
         </div>

         {/* Screening History & Review */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <History className="text-primary-600" /> Analysis History
               </h2>
               <div className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                  <Activity size={14} /> Critical Markers First
               </div>
            </div>

            {history.length > 0 ? (
               <div className="space-y-6">
                  {history.map((screening) => (
                     <div key={`${screening.type}-${screening.id}`} className="card border-l-4 group transition-shadow hover:shadow-xl" style={{ borderLeftColor: screening.risk_band === 'Minimal' ? '#22c55e' : screening.risk_band === 'Elevated' ? '#eab308' : '#ef4444' }}>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                           <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-3">
                                 <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                                    screening.risk_band === 'Minimal' ? 'bg-green-100 text-green-700' :
                                    screening.risk_band === 'Elevated' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                 }`}>
                                    {screening.risk_band} Risk
                                 </span>
                                 <div className={`p-1.5 rounded-lg ${screening.type === 'liver' ? 'bg-saffron/10 text-saffron' : 'bg-saffron-deep/10 text-saffron-deep'}`}>
                                    {screening.type === 'liver' ? <Activity size={18} /> : <Stethoscope size={18} />}
                                 </div>
                                 <p className="font-bold text-slate-900 capitalize">{screening.type} Screening</p>
                              </div>
                              <p className="text-slate-600 font-medium leading-relaxed max-w-lg">"{screening.interpretation}"</p>
                           </div>
                           <div className="text-right">
                              <p className="text-2xl font-display font-black text-slate-900">{(screening.confidence * 100).toFixed(1)}%</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Confidence</p>
                              <p className="text-xs text-slate-400 font-bold mt-2">{new Date(screening.created_at).toLocaleDateString()}</p>
                           </div>
                        </div>

                        {screening.is_reviewed ? (
                           <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm border border-slate-200 shrink-0"><CheckCircle2 /></div>
                              <div className="space-y-1">
                                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Clinical Physician's Review</p>
                                 <p className="text-slate-700 font-medium leading-relaxed italic">"{screening.doctor_notes}"</p>
                              </div>
                           </div>
                        ) : (
                           <div className="space-y-4 pt-4 border-t border-slate-100">
                              <label className="text-xs font-bold text-primary-600 uppercase tracking-widest">Clinical Consultation Notes</label>
                              <div className="flex gap-4">
                                 <textarea 
                                   value={reviewNote}
                                   onChange={(e) => setReviewNote(e.target.value)}
                                   placeholder="Enter detailed medical assessment or recommendations for this patient..."
                                   className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600 h-24 font-medium transition-all"
                                 />
                                 <button 
                                   onClick={() => handleReview(screening.type, screening.id)}
                                   disabled={reviewLoading || !reviewNote.trim()}
                                   className="btn-primary w-16 h-24 flex flex-col items-center justify-center gap-2"
                                 >
                                    {reviewLoading ? <Loader2 size={24} className="animate-spin" /> : <ArrowLeft className="rotate-180" size={24} />}
                                    <span className="text-[10px] font-black uppercase">Post</span>
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            ) : (
               <div className="card bg-slate-50 border-dashed border-2 border-slate-200 py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-300 mb-4"><History size={32} /></div>
                  <h3 className="text-xl font-bold text-slate-900">Clean Medical Record</h3>
                  <p className="text-slate-500 max-w-xs font-medium">This patient currently has no active AI risk screenings recorded in the database.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default PatientDetail;
