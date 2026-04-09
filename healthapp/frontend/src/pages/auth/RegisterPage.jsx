/**
 * METASCALE HEALTH: IDENTITY PROVISIONING GATEWAY (RegisterPage.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component handles the 'First Handshake' between a new user and 
 * the Clinical OS. It is designed to capture both Patient and Practitioner 
 * telemetry with high precision.
 * 
 * ─── POLYMORPHIC FORM DESIGN ────────────────────────────────────────────────
 * We implement a 'Role-Responsive Schema' that mutates based on the selected 
 * identity tier:
 *   1. PATIENT MODE: Minimalist data entry—focusing on age, gender, and 
 *      basic identification.
 *   2. DOCTOR MODE: Expands the form to include critical professional 
 *      vectors including License Numbers, Medical Councils, and 
 *      Clinical Experience metrics.
 * 
 * ─── SECURITY & ENTROPY PROTOCOLS ───────────────────────────────────────────
 *   - ENTROPY ANALYSIS: Integrates 'AngularPasswordStrength'—a real-time 
 *     validator that provides visual feedback on the cryptographic strength 
 *     of the chosen access key.
 *   - IDENTOTY BINDING: Once registration succeeds, the system automatically 
 *     performs a 'Post-Provisioning Handshake', binds the session, and 
 *     routes the user to their dashboard.
 * 
 * ─── AESTHETIC INTEGRITY ────────────────────────────────────────────────────
 * Features 'Metascale Blobs'—moving, blurred gradient nodes that pulse 
 * slowly, creating a living, organic feel to the registration ritual.
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2, Calendar, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AngularPasswordStrength from '../../components/auth/AngularPasswordStrength';

const RegisterPage = () => {
  const location = useLocation();
  const initialRole = location.state?.role || 'patient';

  // POLYMORPHIC STATE: Unified buffer for all potential identity attributes.
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
  const [showPassword, setShowPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const setRole = (selectedRole) => setFormData({ ...formData, role: selectedRole });

  /**
   * PROVISIONING PIPELINE (handleSubmit)
   * 
   * Logic:
   *   1. VALIDATION: Ensures password parity before network transmission.
   *   2. BINDING: Dispatches the full telemetry vector to the backend registry.
   *   3. DISPATCH: Automatically transitions to the Dashbaord upon success.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Access keys must match.');
    
    setLoading(true);
    try {
      const res = await register({
        ...formData,
        email: formData.email.toLowerCase().trim(),
        full_name: formData.full_name.trim()
      });

      if (res.success) {
        navigate(formData.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Provisioning failed. Service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 py-20 overflow-hidden bg-white">
      {/* 
        ORGANIC MOTION BACKGROUND
        Logic: Pulsing 'Living Blobs' using Framer Motion.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden text-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffb472]/10 via-[#f7f2ff]/30 to-white opacity-40"></div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-saffron-light blur-[150px] rounded-full"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-8">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white via-saffron-light to-saffron-deep shadow-lg ring-4 ring-white/60"></div>
             <div className="text-left">
                <div className="font-bold text-[14px] uppercase tracking-[0.2em] text-slate-900 leading-none mb-1">Metascale Health</div>
                <div className="text-[10px] text-saffron-deep/80 font-black uppercase tracking-widest">Identity Protocol Registration</div>
             </div>
          </Link>

          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Clinical Registration</h1>
          
          {/* TIER SELECTOR */}
          <div className="flex bg-slate-900/5 p-1.5 rounded-[24px] mb-10 max-w-[280px] mx-auto">
             <button 
                type="button" onClick={() => setRole('patient')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-[20px] transition-all ${formData.role === 'patient' ? 'bg-white shadow-xl text-saffron-deep' : 'text-slate-400'}`}
             >Patient</button>
             <button 
                type="button" onClick={() => setRole('doctor')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-[20px] transition-all ${formData.role === 'doctor' ? 'bg-white shadow-xl text-saffron-deep' : 'text-slate-400'}`}
             >Specialist</button>
          </div>
        </div>

        <div className="backdrop-blur-3xl bg-white/50 p-10 md:p-14 rounded-[56px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] border border-white/80 transition-all duration-500">
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-red-50/80 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                >
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BASE TELEMETRY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Legal Identity</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="input-field-clinical pl-14" placeholder="Full Name" required />
                </div>
              </div>
              <div className="space-y-2 text-slate-900">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field-clinical pl-14" placeholder="name@clinical.com" required />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-slate-900">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Age Vector</label>
                <div className="relative group">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field-clinical pl-14" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Physiological Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-field-clinical h-[58px] cursor-pointer" required>
                  <option value="">Select Paradigm</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* SPECIALIST TIER (Conditional) */}
            <AnimatePresence>
            {formData.role === 'doctor' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6 pt-8 mt-8 border-t border-slate-100 overflow-hidden text-slate-900"
              >
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" name="license_number" onChange={handleChange} className="input-field-clinical" placeholder="License #" required />
                  <input type="text" name="medical_council" onChange={handleChange} className="input-field-clinical" placeholder="Council Body" required />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" name="specialization" onChange={handleChange} className="input-field-clinical" placeholder="Specialization" required />
                  <input type="number" name="years_of_experience" onChange={handleChange} className="input-field-clinical" placeholder="Exp (Yrs)" required />
                </div>
              </motion.div>
            )}
            </AnimatePresence>

            {/* ACCESS KEYS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-900">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Access Protocol</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="input-field-clinical pl-14 pr-14" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <AngularPasswordStrength password={formData.password} />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confirm Check</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field-clinical pl-14" placeholder="••••••••" required />
                </div>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Provision Identity <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            Already Encoded? <Link to="/login" className="text-saffron-deep font-black underline underline-offset-4 ml-1">Portal Entry</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;


