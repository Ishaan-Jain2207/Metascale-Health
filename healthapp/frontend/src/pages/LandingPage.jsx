import React, { useRef, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Activity, 
  Database, 
  ArrowRight, 
  Stethoscope,
  HeartPulse,
  Radar,
  ChevronRight,
  Globe,
  Zap
} from 'lucide-react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
/* eslint-enable no-unused-vars */

// Mock/Hooks for demo consistency
import { useRipple } from '../hooks/useRipple';
import { useParallaxDirective } from '../hooks/useParallaxDirective';

const LandingPage = () => {
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Parallax Logic
  useParallaxDirective(heroRef, 30);
  
  // Ripple Effect
  const ripples = useRipple(ctaRef);
  
  // Mouse Tracking for 3D Effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const gridRotateX = useTransform(mouseY, [-300, 300], [60, 50]);
  const gridTranslateZ = useTransform(mouseY, [-300, 300], [0, 50]);

  // Clinical parallax vectors
  const orbY1 = useTransform(smoothProgress, [0, 1], [0, -200]);
  const orbY2 = useTransform(smoothProgress, [0, 1], [0, -400]);

  // Apply application light theme to body for landing page
  useEffect(() => {
    document.body.classList.remove('app-dark-mode');
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const featureCards = useMemo(() => [
    { 
      title: 'Liver Shield', 
      desc: 'Evaluates enzymatic vectors and protein markers for structural clinical resilience.', 
      icon: Database,
      color: 'bg-saffron'
    },
    { 
      title: 'Metabolic Audit', 
      desc: 'Deep-audit of glucose trajectories and lifestyle data through risk modeling.', 
      icon: Stethoscope,
      color: 'bg-saffron-deep'
    },
    { 
      title: 'Clinical Sync', 
      desc: 'Advanced dashboarding for healthcare providers to review and audit patient screenings.', 
      icon: ShieldCheck,
      color: 'bg-slate-900'
    }
  ], []);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen relative overflow-hidden bg-transparent"
    >
      {/* 3D Grid Floor Background - Energetic Saffron Pulse */}
      <div className="absolute inset-0 pointer-events-none z-0 perspective-[1000px]">
        <motion.div 
          style={{ 
            rotateX: gridRotateX,
            translateZ: gridTranslateZ,
            backgroundImage: `linear-gradient(to right, rgba(247, 147, 30, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(247, 147, 30, 0.08) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
          className="absolute inset-0 origin-center w-[200%] h-[200%] -left-1/2 -top-1/2 opacity-60"
        ></motion.div>
      </div>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 py-6 px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-4 cursor-pointer"
          >
             <div className="w-12 h-12 rounded-[18px] bg-slate-900 shadow-2xl flex items-center justify-center relative overflow-hidden border border-white/10 group">
                <div className="absolute inset-0 bg-mesh-saffron opacity-40 group-hover:opacity-100 transition-opacity"></div>
                <HeartPulse className="text-white relative z-10" size={24} />
             </div>
             <div>
                <div className="font-display font-black text-lg uppercase tracking-tight text-slate-900 leading-none mb-1">Metascale</div>
                <div className="text-[9px] text-saffron-deep font-black uppercase tracking-[0.3em]">Health Intelligence</div>
             </div>
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <a href="#features" className="hover:text-saffron-deep transition-colors">Features</a>
            <Link to="/login" className="btn-primary !px-8 !py-3.5 !text-[10px] !tracking-widest">
               Sign In <ChevronRight size={14} className="ml-2" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-56 pb-40 relative z-10">
        <div className="max-w-5xl mx-auto px-10 text-center relative">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-3 bg-saffron/5 text-saffron-deep px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-12 border border-saffron/20 shadow-sm"
           >
              <ShieldCheck size={16} className="text-emerald-500" /> Clinical Diagnostic Protocol v3.1
           </motion.div>
           
           <motion.div 
             ref={heroRef}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-6xl lg:text-[7.5rem] font-display font-black text-slate-900 leading-[0.9] mb-16 tracking-tighter"
           >
              Metabolic <br />
              <span className="text-transparent bg-clip-text bg-mesh-saffron relative inline-block">
                intelligence
                <motion.span 
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -inset-4 bg-saffron-light/40 blur-3xl rounded-full -z-10"
                ></motion.span>
              </span> simplified.
           </motion.div>
           
           <motion.p 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed mb-20 italic font-sans"
           >
              Metascale harnesses metabolic markers and clinical deep-learning to predict health trajectories with professional precision. Free, private, and built for everyone.
           </motion.p>
           
           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col md:flex-row items-center justify-center gap-8"
           >
              <div className="relative group/cta">
                <Link 
                  ref={ctaRef}
                  to="/register" 
                   className="btn-primary min-w-[320px] text-lg py-6"
                >
                   {ripples}
                   Start Assessment <ArrowRight className="ml-4 group-hover/cta:translate-x-2 transition-transform" size={24} />
                </Link>
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] text-saffron-deep font-black uppercase tracking-widest opacity-0 group-hover/cta:opacity-100 transition-opacity">
                  <Radar size={14} className="text-saffron animate-ping" /> Analyzing Indian Demographic Vectors
                </div>
              </div>
           </motion.div>
        </div>

        {/* Decorative Orbs */}
        <motion.div 
          animate={{ y: [0, -30, 0], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/3 left-0 w-96 h-96 bg-saffron-light/20 rounded-full blur-[120px] -z-10"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-saffron/10 rounded-full blur-[150px] -z-10"
        ></motion.div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-40 relative z-10">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid md:grid-cols-2 gap-20 items-end mb-24">
             <div className="space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-saffron-deep">Core Capabilities</div>
                <h2 className="text-5xl lg:text-7xl font-display font-black text-slate-900 leading-tight">Biological Insights</h2>
             </div>
             <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg pb-2">We provide a high-fidelity audit of metabolic health through precision predictive modeling and board-certified data protocols.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {featureCards.map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="card group hover:shadow-4xl !p-12"
              >
                 <div className={`w-16 h-16 ${feature.color} text-white rounded-3xl flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 transition-transform`}>
                    <feature.icon size={28} />
                 </div>
                 <h3 className="text-3xl font-display font-black text-slate-900 mb-6 tracking-tight uppercase">{feature.title}</h3>
                 <p className="text-slate-400 font-medium leading-relaxed mb-10 text-sm tracking-tight">{feature.desc}</p>
                 <Link to="/register" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-saffron-deep hover:text-saffron transition-colors">
                    Explore Terminal <ChevronRight size={14} />
                 </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div style={{ y: orbY1 }} className="absolute -top-40 -right-40 w-[60vw] h-[60vw] bg-saffron/5 blur-[150px] rounded-full opacity-30"></motion.div>
        <motion.div style={{ y: orbY2 }} className="absolute -bottom-40 -left-40 w-[50vw] h-[50vw] bg-white/[0.02] blur-[150px] rounded-full opacity-20"></motion.div>
      </div>
      <footer className="py-32 bg-slate-900 text-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-saffron opacity-5"></div>
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between gap-20 border-b border-white/10 pb-20 mb-20">
            <div className="max-w-md space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl">
                     <HeartPulse size={24} />
                  </div>
                  <span className="font-display font-black text-3xl tracking-tighter uppercase">Metascale</span>
               </div>
               <p className="text-white/40 text-sm font-medium leading-relaxed uppercase tracking-wider">
                  Engineered for a new era of metabolic health awareness. We empower 1.4 billion people with board-certified clinical intelligence.
               </p>
               <div className="flex items-center gap-8 pt-4 grayscale opacity-40">
                  <Globe size={24} />
                  <Zap size={24} />
                  <ShieldCheck size={24} />
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
               <div className="space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Protocol</h4>
                  <ul className="space-y-4 text-sm font-bold text-white/60">
                     <li className="hover:text-white transition-colors cursor-pointer">Clinical FAQ</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Security Audit</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Privacy</li>
                  </ul>
               </div>
               <div className="space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Registry</h4>
                  <ul className="space-y-4 text-sm font-bold text-white/60">
                     <li><Link to="/login" state={{ role: 'doctor' }} className="hover:text-white transition-colors">Personnel Login</Link></li>
                     <li><Link to="/login" state={{ role: 'admin' }} className="hover:text-white transition-colors">Admin Dashboard</Link></li>
                     <li><Link to="/register" state={{ role: 'patient' }} className="hover:text-white transition-colors">Patient Screening</Link></li>
                  </ul>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
             <p className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-loose max-w-lg text-center md:text-left italic">
                © 2026 Metascale Health Clinical Group. All screening analyses are preventative awareness tools and not clinical diagnoses.
             </p>
             <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-full flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Core Stable: Node-4.1.2</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
