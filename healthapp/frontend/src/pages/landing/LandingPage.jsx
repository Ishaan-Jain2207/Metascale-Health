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

import useRipple from '../../hooks/useRipple';
import useParallaxDirective from '../../hooks/useParallaxDirective';
import AngularStatusWidget from '../../components/clinical/AngularStatusWidget';

const LandingPage = () => {
  // DIAGNOSTIC CORE: Simplicity is required to isolate the silent crash.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white">
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-black text-slate-900 mb-4 animate-pulse uppercase tracking-tighter">
          METASCALE <span className="text-saffron-deep">LIVE</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Diagnostic Surface Active • Component Isolation Phase
        </p>
      </div>
      
      {/* PERSISTENT GRADIENT BRIDGE */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-saffron-light/20 to-white opacity-40"></div>
      </div>
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


