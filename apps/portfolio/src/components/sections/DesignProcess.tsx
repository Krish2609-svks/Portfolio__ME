"use client";

import { motion } from "framer-motion";

const defaultSteps = [
  {
    number: "01",
    title: "Ideation & Problem Definition",
    description: "Defining load requirements, kinematic constraints, and desired outcomes. Using mathematical sizing to establish theoretical feasibility before opening CAD software.",
  },
  {
    number: "02",
    title: "CAD & Simulation",
    description: "Iterative 3D modeling in SolidWorks or Fusion 360. Validating structural integrity and thermal management using FEA and CFD simulation tools.",
  },
  {
    number: "03",
    title: "Prototyping & Manufacturing",
    description: "Translating digital models into physical objects via additive manufacturing (FDM/SLA), CNC programming, and hand layup composite fabrication.",
  },
  {
    number: "04",
    title: "Testing & Refinement",
    description: "Conducting real-world load testing and embedded systems integration. Using data-driven feedback to optimize the design for final production.",
  }
];

interface DesignProcessStep {
  number: string;
  title: string;
  description: string;
}

export default function DesignProcess({ steps = [] }: { steps?: DesignProcessStep[] }) {
  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <section id="process" className="relative w-full bg-background py-40 px-6 lg:px-20 overflow-hidden z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-highlight mb-6 uppercase tracking-tighter">
            Design <span className="text-accent-primary">Process</span>
          </h2>
          <div className="w-24 h-1 bg-accent-primary" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displaySteps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
              className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:bg-white/5 transition-colors"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="text-6xl font-bold font-mono text-accent-primary">{step.number}</span>
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                <h3 className="text-xl md:text-2xl font-bold text-highlight leading-tight mt-8">{step.title}</h3>
                <p className="text-foreground/60 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Bottom line indicator */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (idx * 0.15), duration: 0.8, ease: "easeInOut" }}
                  className="h-full bg-accent-primary"
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
