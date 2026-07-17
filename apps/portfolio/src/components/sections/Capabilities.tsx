"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, 
  Cpu, 
  Code2, 
  Layers, 
  Video, 
  Binary, 
  Plus, 
  Minus,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CapabilityItem {
  id: string;
  category: string;
  icon: any;
  skills: string[];
  description: string;
  applications: string;
}

const capabilityData: CapabilityItem[] = [
  {
    id: "CAP-01",
    category: "Mechanical Engineering",
    icon: Wrench,
    skills: ["CAD Modeling", "Assembly Design", "Technical Drawing"],
    description: "Designing complex components and multi-part assemblies using industry-standard geometric parameterization.",
    applications: "Applied in planetary gearbox assembly optimization and CSWA validation."
  },
  {
    id: "CAP-02",
    category: "Prototype Development",
    icon: Layers,
    skills: ["3D Printing (FDM/SLA)", "Material Selection", "DFM (Design for Mfg)"],
    description: "Rapid physical translation of digital concepts with structural polymers and additive optimizations.",
    applications: "Used for PETG smart keyless bike lock enclosure and PLA structural housings."
  },
  {
    id: "CAP-03",
    category: "Programming",
    icon: Code2,
    skills: ["Python", "Arduino (C++)", "ESP32 Firmware"],
    description: "Writing efficient, hardware-level firmware and automation scripts for system control and sensor parsing.",
    applications: "Coded BLE pairing protocols and ESP32 low-power deep-sleep state management."
  },
  {
    id: "CAP-04",
    category: "Electronics",
    icon: Cpu,
    skills: ["Soldering", "Circuit Assembly", "Sensor Integration"],
    description: "Designing, soldering, and troubleshooting custom wiring harnesses, power distribution shields, and sensors.",
    applications: "Wired high-torque servos, Li-Po chargers, and pedal assist sensors for E-Bike retrofit."
  },
  {
    id: "CAP-05",
    category: "Creative",
    icon: Video,
    skills: ["DaVinci Resolve", "Photography", "Videography", "Canva"],
    description: "Creating professional product trailers, documentation videos, and high-impact graphic design reports.",
    applications: "Produced design diaries and assembly videos for electric bicycle fabrication."
  },
  {
    id: "CAP-06",
    category: "Professional Tools",
    icon: FileSpreadsheet,
    skills: ["Microsoft Office", "Google Workspace", "Git / GitHub", "VS Code"],
    description: "Maintaining proper version control for design files and programming scripts alongside formal documentation.",
    applications: "Managed collaborative project repositories and formulated technical engineering reports."
  },
  {
    id: "CAP-07",
    category: "Learning Focus",
    icon: Binary,
    skills: ["nTop Platform", "Topology Optimization", "Generative Lattice design"],
    description: "Exploring state-of-the-art computational design systems to develop density-graded and biomimetic lattices.",
    applications: "Creating leaf-venation bracket weight-reduction workflows."
  }
];

export default function Capabilities() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  return (
    <section id="capabilities" className="relative w-full bg-background py-40 px-6 lg:px-20 overflow-hidden z-10">
      <div className="absolute inset-0 blueprint-grid opacity-[0.015] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <span className="font-mono text-xs text-accent-primary/40 uppercase tracking-[0.3em] block mb-2">// Skills & Domains</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-highlight uppercase tracking-tighter">
            Core <span className="text-accent-primary">Capabilities</span>
          </h2>
        </motion.div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {capabilityData.map((cap, idx) => {
            const Icon = cap.icon;
            const isExpanded = expandedCard === cap.id;

            return (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className={cn(
                  "glass-panel rounded-2xl p-8 cursor-pointer border border-white/5 transition-all duration-300 relative select-none hover-trigger",
                  isExpanded ? "md:col-span-2 lg:col-span-2 bg-white/[0.02] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "hover:bg-white/[0.02]"
                )}
                onClick={() => toggleExpand(cap.id)}
              >
                {/* Header info */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[10px] text-accent-primary/40 tracking-wider">
                    {cap.id}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-foreground/40 group-hover:text-highlight transition-colors">
                    {isExpanded ? (
                      <Minus className="w-4 h-4 text-accent-primary" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-accent-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-highlight tracking-tight">
                      {cap.category}
                    </h3>
                    <p className="text-xs text-foreground/40 mt-1 font-mono uppercase tracking-widest">
                      {cap.skills.slice(0, 2).join(" // ")}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-foreground/60 font-light leading-relaxed mt-4">
                  {cap.description}
                </p>

                {/* Sub-skills chips */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {cap.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-foreground/70 uppercase tracking-wider"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden mt-6 pt-6 border-t border-white/5"
                    >
                      <div className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-wider">
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                          <span className="text-accent-primary/40 w-24">Focus Area:</span>
                          <span className="text-foreground/80 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-accent-primary" /> Ready for Production Deployments
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                          <span className="text-accent-primary/40 w-24 flex-shrink-0">Applied in:</span>
                          <span className="text-foreground/75 font-sans normal-case tracking-normal text-sm leading-relaxed">
                            {cap.applications}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
