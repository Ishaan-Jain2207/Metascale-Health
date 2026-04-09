/**
 * METASCALE HEALTH: CLINICAL OS FRONT-END (LandingPage.jsx)
 * RESURRECTION VERSION: Parity with 'Image 2' Requirement.
 */

/* eslint-disable */
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Stethoscope, 
  HeartPulse 
} from 'lucide-react';

import useRipple from '../hooks/useRipple';
import useParallaxDirective from '../hooks/useParallaxDirective';
import AngularStatusWidget from '../components/clinical/AngularStatusWidget';

const LandingPage = () => {
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  
  useParallaxDirective(heroRef, 30);
  const ripples = useRipple(ctaRef);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  
  const gridRotateX = useTransform(springY, [-300, 300], [60, 50]);
  const gridTranslateZ = useTransform(springY, [-300, 300], [0, 50]);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen relative overflow-hidden"
    >
      {/* 3D PERSPECTIVE ENVIRONMENT */}
      <div className="absolute inset-0 pointer-events-none z-0 perspective-[1000px]">
        <motion.div 
          style={{ 
            rotateX: gridRotateX,
            translateZ: gridTranslateZ,
            backgroundImage: `linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
          className="absolute inset-0 origin-center w-[200%] h-[200%] -left-1/2 -top-1/2"
        ></motion.div>
      </div>

      {/* ─── STAGE 3: NAVIGATION OVERLAY (IMAGE 2 ALIGNMENT) ───────────────── */}
      <header className="fixed top-0 w-full z-50 py-6 px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             {/* ORANGE SPHERE LOGO FROM IMAGE 2 */}
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white via-saffron-light to-saffron shadow-lg ring-4 ring-white/80"></div>
             <div>
                <div className="font-bold text-lg uppercase tracking-tight text-slate-900 leading-none">Metascale Health</div>
                <div className="text-[10px] text-saffron-deep font-bold uppercase tracking-widest mt-1">Liver & Diabetes Screener</div>
             </div>
          </div>
          
          <div className="flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span className="cursor-pointer hover:text-saffron-deep transition-colors">Features</span>
            <Link to="/login" className="hover:text-saffron-deep transition-colors">Practitioner Portal</Link>
          </div>
        </div>
      </header>

      {/* ─── STAGE 4: HERO SECTION (IMAGE 2 PARITY) ─────────────────────── */}
      <section className="pt-56 pb-32 relative z-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
           <div className="saffron-badge mb-10 mx-auto w-fit">
              <HeartPulse size={14} /> Health Awareness Initiative
           </div>
           
           <div 
             ref={heroRef}
             className="text-6xl lg:text-[7.5rem] font-display font-bold text-slate-900 leading-[0.92] mb-14 tracking-[-0.04em]"
           >
              Health insight for India, <br />
              <span className="before-disease-highlight italic">before</span> disease.
           </div>
           
           <p className="text-xl text-slate-500 font-medium leading-relaxed mb-20 max-w-3xl mx-auto">
              A free, private risk screen for liver and diabetes — built for everyday Indians to understand their health markers.
           </p>
           
           <div className="flex flex-col items-center gap-6">
              <Link 
                ref={ctaRef}
                to="/register" 
                state={{ role: "patient" }} 
                className="btn-primary"
              >
                 {ripples}
                 Start free screening <ArrowRight className="ml-3" size={24} />
              </Link>
           </div>
        </div>
      </section>

      {/* ─── STAGE 5: FEATURE MATRIX ──────────────────────────────────────── */}
      <section id="features" className="py-40 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                title: 'Liver Health', 
                desc: 'Assess fatty liver risk using non-invasive clinical markers.', 
                icon: Database,
                color: 'text-saffron-deep'
              },
              { 
                title: 'Metabolic Profile', 
                desc: 'Screen for early symptoms of insulin resistance and blood glucose trends.', 
                icon: Stethoscope,
                color: 'text-saffron'
              },
              { 
                title: 'Doctor Portal', 
                desc: 'Dedicated interface for clinical audit and patient monitoring.', 
                icon: ShieldCheck,
                color: 'text-slate-900'
              }
            ].map((feature, i) => (
              <PerspectiveCard key={i} feature={feature} />
            ))}
          </div>
        </div>
      </section>
      
      {/* SYSTEM TELEMETRY (Legacy Bridge) */}
      <div className="max-w-4xl mx-auto px-6 mb-40">
        <AngularStatusWidget />
      </div>

      <footer className="py-24 bg-slate-900 text-white relative z-10 rounded-t-[80px]">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid md:grid-cols-2 gap-24 border-b border-white/5 pb-20 mb-12">
            <div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-saffron shadow-xl shadow-saffron/30"></div>
                  <span className="font-display font-bold text-3xl tracking-tight">Metascale Health</span>
               </div>
               <p className="text-slate-400 font-medium max-w-sm leading-relaxed text-lg">
                  Empowering every Indian with Clinical-Grade metabolic intelligence.
               </p>
            </div>
            <div className="grid grid-cols-2 gap-12">
               <ul className="space-y-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <li className="text-slate-300">Protocols</li>
                  <li className="hover:text-saffron transition-colors cursor-pointer">Liver Screening</li>
                  <li className="hover:text-saffron transition-colors cursor-pointer">Diabetes Audit</li>
               </ul>
               <ul className="space-y-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <li className="text-slate-300">Gateway</li>
                  <li><Link to="/login" className="hover:text-saffron">Log In</Link></li>
                  <li><Link to="/register" className="hover:text-saffron">Sign Up</Link></li>
               </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">© 2026 Metascale Health Clinical OS</p>
            <div className="flex gap-8 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
               <span>Privacy Policy</span>
               <span>Clinical Data Charter</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PerspectiveCard = ({ feature }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="card group cursor-pointer"
    >
      <div className={`p-5 rounded-2xl bg-slate-50 w-fit mb-8 transition-all group-hover:bg-saffron/10 group-hover:scale-110 ${feature.color}`}>
        <feature.icon size={32} />
      </div>
      <h3 className="text-3xl font-bold mb-5 tracking-tight">{feature.title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed mb-8">{feature.desc}</p>
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-saffron-deep opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
        Initiate Protocol <ArrowRight size={14} />
      </div>
    </motion.div>
  );
};

export default LandingPage;
