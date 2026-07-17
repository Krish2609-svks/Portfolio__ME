"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import dynamic from "next/dynamic";

// Dynamic import for 3D engine to optimize bundle size and Lighthouse score
const Gearbox3D = dynamic(() => import("@/components/canvas/Gearbox3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center font-mono text-[9px] text-foreground/20 uppercase tracking-widest animate-pulse">
      [ Initializing 3D Assemblies // ]
    </div>
  ),
});

interface HeroProps {
  title?: string;
  subtitle?: string;
  roles?: string[];
  description?: string;
  resumeUrl?: string | null;
}

export default function Hero({
  title = "System Online // Initiating Sequence",
  subtitle = "Nambi Krishnan",
  roles = ["Mechanical Engineer", "Product Designer", "Prototype Developer"],
  description = "Designing products, building prototypes and continuously learning new engineering technologies.",
  resumeUrl
}: HeroProps) {
  
  const scrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden z-10 px-6 lg:px-20 pt-24 pb-12">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Info */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
            className="overflow-hidden mb-4"
          >
            <h2 className="text-accent-primary font-mono text-xs md:text-sm tracking-[0.3em] uppercase">
              {title}
            </h2>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="huge-title text-highlight mb-4 uppercase"
          >
            {subtitle}
          </motion.h1>

          {/* Roles Sequence */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-8">
            {roles.map((role, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.3 + idx * 0.1 }}
                className="font-mono text-[10px] md:text-xs tracking-wider uppercase text-foreground/50 flex items-center gap-2"
              >
                {idx > 0 && <span className="w-1 h-1 rounded-full bg-accent-secondary opacity-35" />}
                {role}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-lg md:text-xl text-foreground/60 max-w-xl mb-12 leading-relaxed font-light"
          >
            {description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-wrap gap-4"
          >
            <MagneticButton variant="primary" onClick={scrollToProjects}>
              Explore Projects
            </MagneticButton>
            {resumeUrl && (
              <MagneticButton variant="glass" onClick={() => window.open(resumeUrl, '_blank')}>
                Download Resume
              </MagneticButton>
            )}
          </motion.div>
        </div>

        {/* Right Side 3D interactive assembly */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 w-full h-[400px] lg:h-[600px] relative rounded-3xl overflow-hidden glass border border-white/5 shadow-inner"
        >
          <Gearbox3D />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/30">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="w-3.5 h-3.5 text-accent-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}

