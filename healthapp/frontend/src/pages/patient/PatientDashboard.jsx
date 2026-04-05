import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  ClipboardCheck, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HeartPulse
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    latestLiver: null,
    latestDiabetes: null,
    upcomingAppt: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const healthTips = [
    "Monitoring your water intake and ensuring 7-8 hours of sound sleep are critical for metabolic health.",
    "A 30-minute brisk walk daily can significantly reduce your diabetes risk markers.",
    "Reducing processed sugar is the fastest way to improve your liver's detoxification efficiency.",
    "Regular protein intake helps maintain lean muscle mass, which improves insulin sensitivity.",
    "Green leafy vegetables are rich in antioxidants that protect liver cells from oxidative stress."
  ];
  const [dailyTip] = useState(healthTips[Math.floor(Math.random() * healthTips.length)]);

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="h-40 bg-slate-200 rounded-2xl"></div>
        <div className="h-40 bg-slate-200 rounded-2xl"></div>
        <div className="h-40 bg-slate-200 rounded-2xl"></div>
      </div>
    </div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-10"
    >
      {/* Welcome Card - Energetic Mesh Gradient */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-mesh-saffron rounded-[40px] p-8 md:p-12 text-white shadow-[0_20px_60px_rgba(247,147,30,0.3)] border border-white/20"
      >
         <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12 animate-float">
            <HeartPulse size={200} />
         </div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/30">
               <Activity size={14} className="animate-pulse" /> Live Health Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white drop-shadow-md">
               Good morning, <br />
               <span className="text-white/90">{user?.full_name?.split(' ')[0]}</span>
            </h1>
            <p className="text-white/80 max-w-xl text-lg font-medium leading-relaxed mb-10">
               Your biometric profile is secure. We've synthesized {stats.total} data points to keep you ahead of your metabolic health.
            </p>
            <div className="flex flex-wrap gap-4">
               <Link to="/patient/screening" className="btn-primary !bg-white !text-saffron-deep hover:!scale-105 transition-transform px-10">
                  <ClipboardCheck size={20} className="mr-2" /> Start Screening
               </Link>
               <Link to="/patient/appointments" className="btn-secondary !text-white !border-white/40 !bg-white/10 hover:!bg-white/20 px-10 backdrop-blur-md">
                  <Calendar size={20} className="mr-2" /> Book Consultation
               </Link>
            </div>
         </div>
      </motion.div>

      {/* Summary Stats - Premium Glass */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Records', val: stats.total, icon: Activity, color: 'saffron' },
           { label: 'Liver Risk', val: stats.latestLiver?.risk_band || 'N/A', icon: TrendingUp, color: 'saffron-deep' },
           { label: 'Diabetes Risk', val: stats.latestDiabetes?.risk_band || 'N/A', icon: Activity, color: 'orange-500' },
           { label: 'Next Visit', val: stats.upcomingAppt?.appt_date ? new Date(stats.upcomingAppt.appt_date).toLocaleDateString() : 'N/A', icon: Calendar, color: 'slate-900' }
         ].map((stat, i) => (
           <div key={i} className="card group hover:border-saffron/40 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                   <stat.icon size={24} />
                </div>
                <div>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className="text-2xl font-display font-bold text-slate-900">{stat.val}</p>
                </div>
              </div>
           </div>
         ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Recent Screening Snapshot */}
         <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2 h-8 bg-saffron rounded-full"></span> Recent Insights
               </h2>
               <Link to="/patient/history" className="text-saffron-deep font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">View All <ArrowRight size={16} /></Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               {/* Liver Result Card */}
               <div className="card-accent group relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-5 text-saffron group-hover:scale-110 transition-transform"><Activity size={120} /></div>
                  <div className="flex items-start justify-between mb-6">
                     <div className="bg-saffron/10 text-saffron p-3 rounded-2xl"><Activity size={24} /></div>
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stats.latestLiver ? new Date(stats.latestLiver.created_at).toLocaleDateString() : 'NO DATA'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Liver Assessment</h3>
                  {stats.latestLiver ? (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          stats.latestLiver.risk_band === 'Minimal' ? 'bg-green-100 text-green-700' :
                          stats.latestLiver.risk_band === 'Elevated' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {stats.latestLiver.risk_band} RISK
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed line-clamp-3">{stats.latestLiver.interpretation}</p>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm font-medium mb-8">No specific markers detected. Start a new screening to analyze liver parameters.</p>
                  )}
                  <Link to={stats.latestLiver? `/patient/history/detail/liver/${stats.latestLiver.id}` : "/patient/screening"} className="btn-secondary w-full text-xs uppercase tracking-widest font-black">
                     {stats.latestLiver ? 'Full Report' : 'Screen Now'}
                  </Link>
               </div>

               {/* Diabetes Result Card */}
               <div className="card-accent !border-t-saffron-deep group relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-5 text-saffron-deep group-hover:scale-110 transition-transform"><Activity size={120} /></div>
                  <div className="flex items-start justify-between mb-6">
                     <div className="bg-saffron-deep/10 text-saffron-deep p-3 rounded-2xl"><Activity size={24} /></div>
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stats.latestDiabetes? new Date(stats.latestDiabetes.created_at).toLocaleDateString() : 'NO DATA'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Diabetes Profile</h3>
                  {stats.latestDiabetes ? (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          stats.latestDiabetes.risk_band === 'Minimal' ? 'bg-green-100 text-green-700' :
                          stats.latestDiabetes.risk_band === 'Elevated' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {stats.latestDiabetes.risk_band} RISK
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed line-clamp-3">{stats.latestDiabetes.interpretation}</p>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm font-medium mb-8">No metabolic records found. We recommend a baseline screening this week.</p>
                  )}
                  <Link to={stats.latestDiabetes? `/patient/history/detail/diabetes/${stats.latestDiabetes.id}` : "/patient/screening"} className="btn-secondary w-full text-xs uppercase tracking-widest font-black">
                     {stats.latestDiabetes ? 'Full Report' : 'Screen Now'}
                  </Link>
               </div>
            </div>
         </motion.div>

         {/* Sidebar Actions */}
         <motion.div variants={itemVariants} className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Focus</h2>
            {stats.upcomingAppt ? (
               <div className="bg-ink rounded-[32px] p-8 text-white shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 rotate-45 transform translate-x-1/4 -translate-y-1/4">
                     <Calendar size={120} />
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md"><Calendar /></div>
                     <div>
                        <p className="font-bold text-lg leading-tight">{stats.upcomingAppt.doctor_name}</p>
                        <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">{stats.upcomingAppt.specialization}</p>
                     </div>
                  </div>
                  <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3 text-sm font-medium">
                        <div className="bg-white/10 p-1.5 rounded-lg"><Calendar size={14} className="text-saffron" /></div>
                        <span>{new Date(stats.upcomingAppt.appt_date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm font-medium">
                        <div className="bg-white/10 p-1.5 rounded-lg"><Clock size={14} className="text-saffron" /></div>
                        <span>{stats.upcomingAppt.appt_time}</span>
                     </div>
                  </div>
                   <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95">
                     Manage Appointment
                   </button>
                </div>
            ) : (
               <div className="card border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-6"><Calendar size={32} /></div>
                  <p className="text-slate-500 font-bold mb-2">Rest Day</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">No scheduled visits</p>
                  <Link to="/patient/appointments" className="btn-secondary !py-2 !text-xs font-black uppercase tracking-widest">Schedule Visit</Link>
               </div>
            )}
            
            <div className="bg-mesh-saffron/5 rounded-3xl p-8 border border-saffron/10 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                <div className="absolute -top-4 -right-4 p-4 opacity-5 text-saffron group-hover:scale-110 transition-transform">
                   <Activity size={80} />
                </div>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-saffron-deep flex items-center gap-2 mb-4">
                  <HeartPulse size={16} /> Clinical Wisdom
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed font-bold italic relative z-10">"{dailyTip}"</p>
             </div>
         </motion.div>
      </div>
    </motion.div>
  );
};

// Simple Icon fallback
const HeartPulse = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
  </svg>
);

export default PatientDashboard;
