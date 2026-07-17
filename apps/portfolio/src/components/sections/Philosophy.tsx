"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface PhilosophyProps {
  quote?: string;
  highlight?: string;
  subtext?: string;
}

export default function Philosophy({
  quote = "I don't just create CAD models.",
  highlight = "I design products that solve real engineering problems.",
  subtext = "Every line drawn and assembly mated has a functional purpose: ease of manufacturing, structural integrity, and ergonomic refinement."
}: PhilosophyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Slow, cinematic background color transition while scrolling
  const backgroundColor = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    ["#09090b", "#141417", "#09090b"]
  );

  // Translate vertical positions and opacity for cinematic reveals
  const opacity1 = useTransform(scrollYProgress, [0.25, 0.38], [0.15, 1]);
  const y1 = useTransform(scrollYProgress, [0.25, 0.38], [30, 0]);

  const opacity2 = useTransform(scrollYProgress, [0.42, 0.55], [0.15, 1]);
  const y2 = useTransform(scrollYProgress, [0.42, 0.55], [30, 0]);

  const opacity3 = useTransform(scrollYProgress, [0.58, 0.72], [0.1, 1]);
  const y3 = useTransform(scrollYProgress, [0.58, 0.72], [30, 0]);

  return (
    <motion.section 
      id="philosophy" 
      ref={containerRef}
      style={{ backgroundColor }}
      className="relative w-full min-h-screen flex flex-col justify-center py-40 px-6 lg:px-20 z-10 overflow-hidden border-t border-b border-white/5 transition-colors duration-1000"
    >
      {/* Subtle blueprints overlay */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.01]" />
      
      <div className="max-w-7xl mx-auto flex flex-col justify-center min-h-[60vh] gap-12 select-none">
        
        <span className="font-mono text-xs text-accent-primary/40 uppercase tracking-[0.3em] block mb-4">
          Engineering Philosophy //
        </span>

        {/* Sentence 1 */}
        <motion.h2 
          style={{ opacity: opacity1, y: y1 }}
          className="text-4xl md:text-7xl lg:text-8xl font-black text-foreground/40 leading-none uppercase tracking-tighter"
        >
          {quote}
        </motion.h2>

        {/* Sentence 2 - Accent highlighted */}
        <motion.h2 
          style={{ opacity: opacity2, y: y2 }}
          className="text-4xl md:text-7xl lg:text-8xl font-black text-highlight leading-none uppercase tracking-tighter"
        >
          {highlight}
        </motion.h2>

        {/* Sentence 3 - Subtext explanatory */}
        <motion.p 
          style={{ opacity: opacity3, y: y3 }}
          className="text-lg md:text-2xl text-foreground/40 font-light max-w-3xl mt-8 leading-relaxed"
        >
          {subtext}
        </motion.p>

      </div>
    </motion.section>
  );
}

