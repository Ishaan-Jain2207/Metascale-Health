import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Calendar, 
  ShieldCheck, 
  HeartPulse, 
  ChevronLeft,
  BriefcaseMedical,
  Globe,
  Database
} from 'lucide-react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const RegisterPage = () => {
  const location = useLocation();
  const initialRole = location.state?.role || 'patient';

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    role: initialRole,
    license_number: '',
    medical_council: '',
    years_of_experience: '',
    qualification: '',
    specialization: '',
    hospital: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('app-dark-mode');
    return () => document.body.classList.remove('app-dark-mode');
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await register({
        full_name: formData.full_name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password.trim(),
        age: formData.age,
        gender: formData.gender,
        role: formData.role,
        specialization: formData.specialization,
        hospital: formData.hospital,
        license_number: formData.license_number,
        medical_council: formData.medical_council,
        years_of_experience: formData.years_of_experience,
        qualification: formData.qualification
      });
      
      const role = res.role;
      if (role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 md:p-12 overflow-hidden bg-transparent py-24">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh-app-dark opacity-100"></div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[90vw] h-[90vw] bg-saffron/5 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] bg-white/[0.02] blur-[120px] rounded-full"
        />
      </div>

      <div className="fixed top-10 left-10 z-50">
         <Link to="/" className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors group">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
               <ChevronLeft size={16} />
            </div>
            Public Terminal
         </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-12 space-y-6">
           <div className="inline-flex flex-col items-center group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-16 h-16 rounded-[28px] bg-ink border border-white/10 shadow-4xl flex items-center justify-center relative overflow-hidden transition-all"
              >
                 <div className="absolute inset-0 bg-mesh-saffron opacity-20"></div>
                 <HeartPulse className="text-saffron relative z-10" size={32} />
              </motion.div>
              <div className="mt-4">
                 <h2 className="font-display font-black text-white text-lg tracking-tight uppercase leading-none">Metascale</h2>
                 <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.4em] mt-1">Personnel Integration</p>
              </div>
           </div>
           <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase leading-none">Create Identity</h1>
        </div>

        <div className="glass-dark !bg-white/[0.03] backdrop-blur-3xl p-8 md:p-14 rounded-[60px] shadow-5xl border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-32 h-32 bg-saffron/10 rounded-full -ml-16 -mt-16 blur-3xl"></div>

           <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-[32px] mb-12 max-w-[340px] mx-auto border border-white/5">
              <button 
                 type="button"
                 onClick={() => setRole('patient')}
                 className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-[26px] transition-all duration-500 flex items-center justify-center gap-3 ${formData.role === 'patient' ? 'bg-white shadow-xl text-ink' : 'text-white/30 hover:text-white/60'}`}
              >
                 <User size={14} /> Patient
              </button>
              <button 
                 type="button"
                 onClick={() => setRole('doctor')}
                 className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-[26px] transition-all duration-500 flex items-center justify-center gap-3 ${formData.role === 'doctor' ? 'bg-white shadow-xl text-ink' : 'text-white/30 hover:text-white/60'}`}
              >
                 <BriefcaseMedical size={14} /> Personnel
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="p-6 rounded-[28px] bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 backdrop-blur-xl shadow-xl"
                  >
                     <AlertCircle size={20} className="shrink-0" />
                     {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2 relative group">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4 font-display">Full Identity</label>
                    <div className="relative">
                       <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-saffron transition-colors" size={20} />
                       <input 
                         type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                         className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-medium transition-all shadow-inner text-white placeholder:text-white/10" 
                         placeholder="Legal Name" required
                       />
                    </div>
                 </div>

                 <div className="space-y-2 relative group">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4 font-display">Communication Endpoint</label>
                    <div className="relative">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-saffron transition-colors" size={20} />
                       <input 
                         type="email" name="email" value={formData.email} onChange={handleChange}
                         className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-medium transition-all shadow-inner text-white placeholder:text-white/10" 
                         placeholder="name@metascale.hub" required
                       />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2 relative group">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Biological Age</label>
                    <input 
                       type="number" name="age" value={formData.age} onChange={handleChange}
                       className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-medium transition-all shadow-inner text-white placeholder:text-white/10" 
                       placeholder="Years" required
                    />
                 </div>
                 <div className="space-y-2 relative group">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Gender Domain</label>
                    <div className="relative">
                       <select 
                         name="gender" value={formData.gender} onChange={handleChange}
                         className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-black text-[10px] uppercase tracking-widest text-white appearance-none shadow-inner"
                         required
                       >
                         <option value="" className="bg-ink text-white">Select Vector</option>
                         <option value="male" className="bg-ink text-white">Male Vector</option>
                         <option value="female" className="bg-ink text-white">Female Vector</option>
                         <option value="other" className="bg-ink text-white">Agnostic Identity</option>
                       </select>
                       <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                          <ArrowRight className="rotate-90" size={16} />
                       </div>
                    </div>
                 </div>
              </div>

              <AnimatePresence>
                {formData.role === 'doctor' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8 pt-8 border-t border-white/5 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">License Protocol ID</label>
                          <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none text-white font-medium shadow-inner" placeholder="License #" required />
                       </div>
                       <div className="space-y-2">
                          <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Medical Board</label>
                          <input type="text" name="medical_council" value={formData.medical_council} onChange={handleChange} className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none text-white font-medium shadow-inner" placeholder="Board Authority" required />
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2 relative group">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Access Handshake</label>
                    <div className="relative">
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-saffron transition-colors" size={20} />
                       <input 
                         type="password" name="password" value={formData.password} onChange={handleChange}
                         className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-medium transition-all shadow-inner text-white placeholder:text-white/10" 
                         placeholder="••••••••" required
                       />
                    </div>
                 </div>
                 <div className="space-y-2 relative group">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Confirm Protocol</label>
                    <div className="relative">
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-saffron transition-colors" size={20} />
                       <input 
                         type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                         className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-medium transition-all shadow-inner text-white placeholder:text-white/10" 
                         placeholder="••••••••" required
                       />
                    </div>
                 </div>
              </div>

              <motion.button 
                whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                className="btn-primary w-full py-6 !text-[10px] !tracking-[0.4em] flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Initialize Core Protocol <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </motion.button>
           </form>

           <div className="mt-12 pt-10 border-t border-white/5 text-center">
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] italic">
                 Already Integrated? <Link to="/login" className="text-saffron font-black hover:underline transition-all">Hub Gateway</Link>
              </p>
           </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 select-none grayscale">
           <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10 shadow-sm">
              <ShieldCheck size={16} className="text-saffron" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">ISO Protocol v3.0</span>
           </div>
           <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10 shadow-sm">
              <Database size={16} className="text-white" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Metadata Vault</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
