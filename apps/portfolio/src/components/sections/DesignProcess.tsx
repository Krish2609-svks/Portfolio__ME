"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lightbulb, Pencil, Laptop, Hammer, ClipboardCheck, Factory, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Research",
    icon: Search,
    description: "Analyzing mechanical constraints, surveying structural standards, searching patents, and formulating user requirements."
  },
  {
    number: "02",
    title: "Concept",
    icon: Lightbulb,
    description: "Brainstorming kinematic structures, layout options, and conducting trade-off matrix calculations to identify the best architecture."
  },
  {
    number: "03",
    title: "Sketch",
    icon: Pencil,
    description: "Creating hand-drawn layout sheets and spatial sketches to verify ergonomic sizing, styling, and general system constraints."
  },
  {
    number: "04",
    title: "CAD",
    icon: Laptop,
    description: "Parametric 3D solid part modeling, standard mate configurations, motion study simulation, and FEA/stress analyses in SolidWorks."
  },
  {
    number: "05",
    title: "Prototype",
    icon: Hammer,
    description: "Translating digital geometry into hardware using SLA/FDM 3D printers, CNC cutting, PCB assembly, and breadboard testing."
  },
  {
    number: "06",
    title: "Testing",
    icon: ClipboardCheck,
    description: "Rigorous thermal testing, fatigue cycling, waterproof test simulations (IP rating targets), and micro-controller calibration."
  },
  {
    number: "07",
    title: "Manufacturing",
    icon: Factory,
    description: "Drafting complete GD&T manufacturing blueprint sheets, sourcing materials, organizing assembly workflows, and final production."
  }
];

export default function DesignProcess() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="capabilities" className="relative w-full bg-background-secondary py-40 px-6 lg:px-20 overflow-hidden z-10 border-t border-b border-white/5">
      <div className="absolute inset-0 blueprint-grid opacity-[0.01] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 flex flex-col items-start"
        >
          <span className="font-mono text-xs text-accent-primary/40 uppercase tracking-[0.3em] block mb-2">// Engineering Workflow</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-highlight uppercase tracking-tighter">
            Product <span className="text-accent-primary">Development Cycle</span>
          </h2>
        </motion.div>

        {/* Timeline Navigation - Desktop */}
        <div className="hidden lg:flex items-center justify-between relative mb-20 px-8">
          {/* Connecting Line */}
          <div className="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 h-[1px] bg-white/10 z-0">
            <motion.div 
              className="h-full bg-accent-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            const isCompleted = idx < activeStep;

            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className="relative z-10 flex flex-col items-center group outline-none focus:outline-none"
                aria-label={`Go to step ${step.title}`}
              >
                <motion.div 
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300",
                    isActive 
                      ? "bg-accent-primary text-background border-accent-primary shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                      : isCompleted 
                        ? "bg-white/10 text-highlight border-accent-primary/50" 
                        : "bg-surface text-foreground/40 border-white/5 group-hover:border-white/20 group-hover:text-foreground/80"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                <span className={cn(
                  "font-mono text-[9px] uppercase tracking-widest mt-3 transition-colors absolute -bottom-6 whitespace-nowrap",
                  isActive ? "text-highlight font-bold" : "text-foreground/30 group-hover:text-foreground/60"
                )}>
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Timeline Navigation - Mobile & Tablet Grid */}
        <div className="flex flex-wrap gap-2 justify-center lg:hidden mb-12">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "px-4 py-2 rounded-full border text-[10px] font-mono uppercase tracking-wider transition-all",
                  isActive 
                    ? "bg-accent-primary text-background border-accent-primary font-bold"
                    : "bg-white/5 border-white/5 text-foreground/40"
                )}
              >
                {step.number}. {step.title}
              </button>
            );
          })}
        </div>

        {/* Active Stage Details display */}
        <div className="w-full max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none select-none">
            <span className="text-[12rem] font-black font-mono leading-none">
              {steps[activeStep].number}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-accent-primary flex-shrink-0">
                {(() => {
                  const ActiveIcon = steps[activeStep].icon;
                  return <ActiveIcon className="w-8 h-8" />;
                })()}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-accent-secondary">
                    Phase {steps[activeStep].number}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-foreground/20" />
                  <span className="font-mono text-xs uppercase tracking-widest text-highlight">
                    {steps[activeStep].title} Stage
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-highlight mt-4 uppercase tracking-tight font-mono">
                  {steps[activeStep].title}
                </h3>
                <p className="text-base md:text-lg text-foreground/60 font-light leading-relaxed mt-6">
                  {steps[activeStep].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

