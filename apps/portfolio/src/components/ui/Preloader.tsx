"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const steps = [
  "Initializing Portfolio...",
  "Loading CAD Workspace...",
  "Loading Projects...",
  "Loading Experience...",
  "System Ready // Entering Port"
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(steps[0]);

  useEffect(() => {
    // Disable scrolling while preloader is active
    document.body.style.overflow = "hidden";
    
    const intervalTime = 80;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 2;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsComplete(true);
            document.body.style.overflow = "";
          }, 800);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const stepIndex = Math.min(
      Math.floor((progress / 100) * steps.length),
      steps.length - 1
    );
    setCurrentStep(steps[stepIndex]);
  }, [progress]);

  if (isComplete) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[999] bg-background flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={progress >= 100 ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
    >
      {/* Blueprint Grid Backgrounds */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 blueprint-grid-sub opacity-[0.02] pointer-events-none" />
      
      {/* Cinematic grid line overlay */}
      <div className="absolute left-[15%] top-0 w-[1px] h-full bg-white/[0.02] pointer-events-none" />
      <div className="absolute left-[50%] top-0 w-[1px] h-full bg-white/[0.02] pointer-events-none" />
      <div className="absolute left-[85%] top-0 w-[1px] h-full bg-white/[0.02] pointer-events-none" />
      
      <div className="w-full max-w-lg px-8 flex flex-col items-center relative z-10">
        
        {/* Monogram / Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-black font-mono tracking-tighter text-highlight mb-16 relative"
        >
          NK<span className="text-accent-secondary opacity-50">.</span>
          
          {/* Subtle cursor box */}
          <motion.span 
            className="inline-block w-4 h-10 bg-accent-primary ml-2 bottom-1 position-relative"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </motion.div>

        {/* Status Messages */}
        <div className="w-full mb-4 flex justify-between items-end font-mono text-[10px] md:text-xs tracking-widest uppercase">
          <div className="text-accent-secondary/60 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="text-highlight font-bold">{progress}%</span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-[2px] bg-white/5 overflow-hidden relative rounded-full">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-accent-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 0.1 }}
          />
        </div>

        <div className="mt-8 text-[9px] md:text-[10px] text-foreground/20 font-mono tracking-wider uppercase text-center max-w-[280px]">
          Nambi Krishnan M // Mechanical Engineering Portfolio v1.0
        </div>
      </div>
    </motion.div>
  );
}

