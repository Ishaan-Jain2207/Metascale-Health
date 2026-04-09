/**
 * METASCALE HEALTH: IDENTITY VERIFICATION GATEWAY (LoginPage.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component orchestrates the 'Secure Entry' into the Clinical OS. 
 * It serves as the primary barrier and verification conduit for all 
 * platform roles (Patients, Doctors, Admins).
 * 
 * ─── DESIGN HEURISTICS: ROLE-AWARE UI ───────────────────────────────────────
 *   1. CONTEXTUAL DETECTION: The portal uses 'location.state' to detect 
 *      the user's intent. If a user arrived via the 'Practitioner' link, 
 *      the UI pivots its visual language and labeling to match professional 
 *      expectations.
 *   2. CREDENTIAL HANDSHAKE: Logic is decoupled via the 'useAuth' hook. 
 *      The component only manages input buffering and visual feedback, 
 *      while the business logic of token exchange is delegated to the 
 *      AuthContext provider.
 *   3. FAULT FEEDBACK: Implements high-visibility, persistent error 
 *      messaging to ensure users understand the nature of identity 
 *      failure (e.g., Expiry vs Credentials).
 * 
 * ─── AESTHETIC ORCHESTRATION ────────────────────────────────────────────────
 * Utilizes Framer Motion for 'Organic Motion'—blurred, animated background 
 * nodes that create a premium, modern medical dashboard atmosphere.
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const location = useLocation();
  
  // ROLE DETECTION: Pivot logic based on the user's navigational context.
  const isDoctorMode = location.state?.role === 'doctor';
  const isAdminMode = location.state?.role === 'admin';
  
  // LOCAL STATE: Manages the immediate UI lifecycle and input buffers.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * IDENTITY DISPATCHER (handleSubmit)
   * 
   * Logic:
   *   1. SANITIZATION: Normalizes identifiers (lowercase emails) before dispatch.
   *   2. HANDSHAKE: Invokes the global 'login' action from AuthContext.
   *   3. ROUTING: Redirects to the specialized dashboard home-node based 
   *      on the successfully verified RBAC role.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ 
        email: email.toLowerCase().trim(), 
        password: password.trim() 
      });
      
      if (res.success) {
        // Clinical Routing Dispatch
        const role = res.data.user.role;
        if (role === 'patient') navigate('/patient/dashboard');
        else if (role === 'doctor') navigate('/doctor/dashboard');
        else if (role === 'admin') navigate('/admin/dashboard');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Identity service unreachable. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-white">
      {/* 
        AESTHETIC FOUNDATION
        Animated background nodes using SVG filters and blur to create depth.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffb472]/10 via-[#f7f2ff]/30 to-white opacity-40"></div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-saffron-light blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 50, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-20 -left-20 w-[500px] h-[500px] bg-lavender-light/30 blur-[100px] rounded-full"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* BRAND IDENTITY: The Clinical Logo Block */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-8">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white via-saffron-light to-saffron-deep shadow-lg ring-4 ring-white/60"></div>
             <div className="text-left">
                <div className="font-bold text-[14px] uppercase tracking-[0.2em] text-slate-900 leading-none mb-1">Metascale Health</div>
                <div className="text-[10px] text-saffron-deep/80 font-black uppercase tracking-widest">Global Identity Gateway</div>
             </div>
          </Link>

          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
            {isDoctorMode ? 'Doctor Portal' : isAdminMode ? 'Admin Console' : 'Sign In'}
          </h1>
          <p className="text-slate-500 font-bold text-sm tracking-tight uppercase">
            {isDoctorMode ? 'Specialist Authentication' : 'Access your health dashboard'}
          </p>
        </div>

        {/* IDENTITY INPUT FORM */}
        <div className="backdrop-blur-3xl bg-white/40 p-10 rounded-[48px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] border border-white/60">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* IDENTITY: EMAIL */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identifier</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-5 bg-white/60 rounded-[24px] ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 outline-none font-bold text-slate-900" 
                  placeholder="name@clinical.com"
                  required
                />
              </div>
            </div>

            {/* PROTOCOL: PASSWORD */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Access Code</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-5 bg-white/60 rounded-[24px] ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 outline-none font-bold text-slate-900" 
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>Authorize Session <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-10 pt-8 border-t border-slate-100 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            New Practitioner? <Link to="/register" className="text-saffron-deep font-black underline underline-offset-4">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;


