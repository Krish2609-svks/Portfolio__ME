"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  resumeUrl?: string | null;
}

export default function Hero({
  title = "System Online // Initiating Sequence",
  subtitle = "Nambi Krishnan",
  description = "Final-year Mechanical Engineering student passionate about CAD design, prototype development, additive manufacturing, UAV systems, and engineering innovation.",
  resumeUrl
}: HeroProps) {
  return (
    <section id="home" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden z-10 px-6 lg:px-20">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start justify-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <h2 className="text-accent-primary font-mono text-xs md:text-sm mb-4 tracking-[0.3em] uppercase">
            {title}
          </h2>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[9rem] font-bold leading-[0.85] tracking-tighter text-highlight mb-8 uppercase"
        >
          {subtitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.1 }}
          className="text-base md:text-xl text-foreground/50 max-w-2xl mb-14 leading-relaxed whitespace-pre-line"
        >
          {description}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.3 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <MagneticButton variant="primary">
            View Projects
          </MagneticButton>
          {resumeUrl && (
            <MagneticButton variant="glass" onClick={() => window.open(resumeUrl, '_blank')}>
              Download Resume
            </MagneticButton>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/40">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-accent-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
