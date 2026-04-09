/**
 * METASCALE HEALTH: CLINICAL LANDING EXPERIENCE (LandingPage.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component serves as the 'Entry Node' for the Clinical OS. 
 * It is engineered to create a high-trust, premium first impression 
 * for patients and practitioners alike.
 * 
 * ─── EXPERIENCE DESIGN: TACTILE HUD ─────────────────────────────────────────
 * We utilize a 'Tactile HUD' (Heads-Up Display) aesthetic:
 *   1. 3D PERSPECTIVE ENGINE: Leveraging 'Framer Motion' and mouse-tracking, 
 *      the background grid and feature cards react to user movement, 
 *      simulating a virtual laboratory environment.
 *   2. CLINICAL TRANSPARENCY: Features the 'AngularStatusWidget'—a bridge to 
 *      the system's legacy telemetry—to demonstrate real-time infrastructure health.
 *   3. ANONYMOUS CONVERSION: The primary CTA initiates the 'Zero-Friction' 
 *      screening pipeline, where anonymity and clinical safety are prioritized.
 * 
 * ─── INTERACTIVE DIRECTIVES ─────────────────────────────────────────────────
 *   - useParallaxDirective: Attaches 3D rotation to the hero section.
 *   - useRipple: Provides Material-style feedback on the primary CTAs.
 */

/* eslint-disable */
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Database, 
  ArrowRight, 
  Stethoscope,
  HeartPulse
} from 'lucide-react';
import { useMotionValue, useTransform, useSpring, motion } from 'framer-motion';

import { useRipple } from '../../hooks/useRipple';
import { useParallaxDirective } from '../../hooks/useParallaxDirective';
import AngularStatusWidget from '../../components/clinical/AngularStatusWidget';

const LandingPage = () => {
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  
  // ─── STAGE 1: TACTILE ORCHESTRATION ────────────────────────────────────

  // Hero Depth: Attaches a 30-degree rotation vector to the main headline.
  useParallaxDirective(heroRef, 30);
  
  // Ripple Feedback: Provides tactile confirmation for the primary conversion button.
  const ripples = useRipple(ctaRef);

  // ─── STAGE 2: MOUSE TRACKING ENGINE ────────────────────────────────────
  // Logic: Normalized cursor vectors drive the background environmental depth.
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
      className="min-h-screen relative overflow-hidden bg-white"
    >
      {/* 
        3D PERSPECTIVE ENVIRONMENT
        A dynamic, floor-bound grid that simulates a clinical laboratory plane.
      */}
      <div className="absolute inset-0 pointer-events-none z-0 perspective-[1000px]">
        <motion.div 
          style={{ 
            rotateX: gridRotateX,
            translateZ: gridTranslateZ,
            backgroundImage: `linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
          className="absolute inset-0 origin-center w-[200%] h-[200%] -left-1/2 -top-1/2"
        ></motion.div>
      </div>

      {/* ─── STAGE 3: NAVIGATION OVERLAY ──────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 py-4 px-6 bg-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white via-saffron-light to-saffron-deep shadow-lg ring-2 ring-white/60 flex-shrink-0"></div>
             <div>
                <div className="font-bold text-[13px] uppercase tracking-[0.1em] text-slate-900 leading-none mb-1">Metascale Health</div>
                <div className="text-[10px] text-saffron-deep/80 font-bold uppercase tracking-tight">Clinical OS v1.0</div>
             </div>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <Link to="/login" className="hover:text-primary-600 transition-colors">Practitioner Portal</Link>
            <Link to="/register" className="btn-primary-lite py-2 px-6">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ─── STAGE 4: VALUE PROPOSITION (HERO) ────────────────────────────── */}
      <section className="pt-48 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 bg-saffron-light/20 text-saffron-deep px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8"
           >
              <HeartPulse size={14} /> Clinical Awareness Protocol
           </motion.div>
           
           <motion.div 
             ref={heroRef}
             className="text-5xl lg:text-[6.5rem] font-display font-bold text-slate-900 leading-[0.95] mb-12 tracking-[-0.04em]"
           >
              Health insight for India, <br />
              <span className="text-saffron-deep relative inline-block">
                before
                <span className="absolute -inset-2 bg-saffron-light/40 blur-2xl rounded-full -z-10 animate-pulse"></span>
              </span> disease.
           </motion.div>
           
           <p className="text-xl text-slate-600 font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
              Precision risk assessment for metabolic longevity. Built with clinical heuristics for the modern Indian demographic.
           </p>
           
           <div className="flex flex-col items-center gap-6">
              <Link 
                ref={ctaRef}
                to="/register" 
                state={{ role: "patient" }} 
                className="btn-primary min-w-[280px] text-lg py-5 shadow-2xl transition-all transform hover:-translate-y-1 relative overflow-hidden"
              >
                 {ripples}
                 Initiate Screening <ArrowRight className="ml-2" size={24} />
              </Link>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Anonymous • Clinical-Grade Heuristics • Instant Outcome</p>
           </div>
        </div>
      </section>

      {/* ─── STAGE 5: FEATURE MATRIX ──────────────────────────────────────── */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: 'Liver Assessment', 
                desc: 'Multi-variate analysis of hepatic biomarkers to monitor metabolic stress.', 
                icon: Database,
                color: 'text-saffron-deep'
              },
              { 
                title: 'Diabetes Profiling', 
                desc: 'Risk stratification using dietary vectors and genomic predisposition heuristics.', 
                icon: Stethoscope,
                color: 'text-primary-600'
              },
              { 
                title: 'Practitioner Interface', 
                desc: 'Bridges verified healthcare providers with high-risk patient screening audits.', 
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
      <div className="max-w-2xl mx-auto px-6 mb-32">
        <AngularStatusWidget />
      </div>

      <footer className="py-20 bg-slate-900 text-white relative z-10 rounded-t-[64px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 border-b border-white/5 pb-16 mb-12 text-center md:text-left">
            <div>
               <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                  <div className="w-8 h-8 rounded-lg bg-saffron shadow-lg shadow-saffron/20"></div>
                  <span className="font-display font-bold text-2xl tracking-tight">Metascale Health</span>
               </div>
               <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
                  Protecting metabolic health through automated clinical awareness and precision heuristics.
               </p>
            </div>
            <div className="grid grid-cols-2 gap-10">
               <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <li className="text-slate-300">Resouces</li>
                  <li className="hover:text-saffron cursor-pointer">Whitepaper</li>
                  <li className="hover:text-saffron cursor-pointer">Privacy Charter</li>
               </ul>
               <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <li className="text-slate-300">Access</li>
                  <li><Link to="/login" className="hover:text-saffron">Doctor Portal</Link></li>
                  <li><Link to="/login" className="hover:text-saffron">Admin Console</Link></li>
               </ul>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest text-center">© 2026 Metascale Health. Clinical-grade Heuristic Platform.</p>
        </div>
      </footer>
    </div>
  );
};

/**
 * FEATURE COMPONENT: 3D PERSPECTIVE CARD
 * Purpose: Provides a reactive surface for core feature highlights.
 */
const PerspectiveCard = ({ feature }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

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
      className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 cursor-default group hover:border-saffron-light/50 transition-colors"
    >
      <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 ${feature.color} group-hover:scale-110 transition-transform`}>
        <feature.icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
};

export default LandingPage;


