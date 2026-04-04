import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for Tailwind classes (re-use exists)
const cn = (...inputs) => twMerge(clsx(inputs));

/**
 * MaterialStepper — Angular Material-inspired Multi-step logic.
 * Features a linear/non-linear stepper UI with smooth animations.
 * Provides a structured UX for the 8-step healthcare screening.
 */
const MaterialStepper = ({ 
  steps, 
  activeStep, 
  completedSteps, 
  onStepClick 
}) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative max-w-3xl mx-auto px-4">
        {/* Connector Line (The "Angular" Way) */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 -z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            className="h-full bg-saffron transition-all duration-500"
          ></motion.div>
        </div>

        {steps.map((label, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep || completedSteps?.includes(index);
          
          return (
            <div key={index} className="flex flex-col items-center gap-3 relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStepClick?.(index)}
                disabled={!isCompleted && !isActive}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2",
                  isActive ? "bg-saffron text-white border-saffron shadow-lg scale-110 shadow-saffron/30" :
                  isCompleted ? "bg-white text-saffron border-saffron" :
                  "bg-white text-slate-300 border-slate-100 hover:border-slate-200"
                )}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : index + 1}
              </motion.button>
              
              {/* Stepper Label (Visible only on larger screens, common in Angular Material desktop) */}
              <span className={cn(
                "hidden md:block absolute top-12 text-[10px] font-black uppercase tracking-widest whitespace-nowrap text-center transition-colors duration-300",
                isActive ? "text-slate-900" : "text-slate-400"
              )}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialStepper;
