import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, ShieldCheck, HeartPulse, ChevronLeft, User, Phone, Zap } from 'lucide-react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('app-dark-mode');
    return () => document.body.classList.remove('app-dark-mode');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.toLowerCase().trim();
      const cleanPassword = password.trim();
      const res = await login({ email: cleanEmail, password: cleanPassword });
      
      const role = res.role;
      if (role === 'patient') navigate('/patient/dashboard');
      else if (role === 'doctor') navigate('/doctor/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 md:p-12 overflow-hidden bg-transparent">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh-app-dark opacity-100"></div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] bg-saffron/10 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -left-[10%] w-[60vw] h-[60vw] bg-white/5 blur-[120px] rounded-full"
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
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-12 space-y-6">
           <div className="inline-flex flex-col items-center group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 rounded-[32px] bg-ink border border-white/10 shadow-4xl flex items-center justify-center relative overflow-hidden group-hover:shadow-saffron/20 transition-all"
              >
                 <div className="absolute inset-0 bg-mesh-saffron opacity-20"></div>
                 <HeartPulse className="text-saffron relative z-10" size={40} />
              </motion.div>
              <div className="mt-4">
                 <h2 className="font-display font-black text-white text-xl tracking-tight uppercase leading-none">Metascale</h2>
                 <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] mt-1">Application Hub</p>
              </div>
           </div>
        </div>

        <div className="glass-dark !bg-white/[0.03] backdrop-blur-3xl p-10 md:p-14 rounded-[56px] shadow-5xl border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-saffron/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
           
           <div className="mb-12 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-4 border border-white/5">
                 <ShieldCheck size={14} className="text-saffron" /> Secure Protocol Entry
              </div>
              <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase leading-none">
                 Sign <br />
                 <span className="text-saffron italic font-sans font-medium lowercase">In</span>
              </h1>
           </div>

           <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 rounded-[24px] bg-rose-500/10 border border-rose-500/20 flex items-center gap-4 text-rose-400 shadow-xl backdrop-blur-xl"
                  >
                     <AlertCircle size={20} className="shrink-0" />
                     <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                 <div className="space-y-2 relative group">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4 font-display">Communication Endpoint</label>
                    <div className="relative">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-saffron transition-colors" size={20} />
                       <input 
                         type="email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-medium transition-all shadow-inner text-white placeholder:text-white/10" 
                         placeholder="name@metascale.hub"
                         required
                       />
                    </div>
                 </div>

                 <div className="space-y-2 relative group">
                    <div className="flex items-center justify-between mx-4">
                       <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-display">Access Key</label>
                       <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-saffron/40 hover:text-saffron transition-all uppercase tracking-[0.3em]">Lost Key?</Link>
                    </div>
                    <div className="relative">
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-saffron transition-colors" size={20} />
                       <input 
                         type="password" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-[32px] outline-none focus:ring-8 focus:ring-saffron/5 focus:border-saffron/40 font-medium transition-all shadow-inner text-white placeholder:text-white/10" 
                         placeholder="••••••••"
                         required
                       />
                    </div>
                 </div>
              </div>

              <motion.button 
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-6 !text-[10px] !tracking-[0.4em] flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Initialize Connection <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </motion.button>
           </form>

           <div className="mt-12 pt-10 border-t border-white/5 text-center">
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] italic">
                 New Personnel Registry? <Link to="/register" className="text-saffron font-black hover:underline transition-all">Create Identity</Link>
              </p>
           </div>
        </div>
        
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="mt-12 flex items-center justify-center gap-8 text-white/20 select-none grayscale"
        >
           <ShieldCheck size={28} />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] max-w-[220px] text-center leading-relaxed">Cryptographic handshake active</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
