"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Award, GraduationCap, Calendar, BookOpen } from "lucide-react";

interface StatItem {
  value: string;
  label: string;
}

interface AboutProps {
  content?: string;
  imageUrl?: string | null;
  stats?: StatItem[];
}

function AnimatedCounter({ value, label }: StatItem) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Parse the numerical part of the stat value (e.g. "15+" -> 15, "7.8" -> 7.8)
    const isFloat = value.includes(".");
    const cleanNum = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");

    if (isNaN(cleanNum)) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 1500; // ms
    const steps = 40;
    const stepTime = duration / steps;
    const increment = cleanNum / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= cleanNum) {
        clearInterval(timer);
        setDisplayValue(value);
      } else {
        setDisplayValue((isFloat ? start.toFixed(1) : Math.floor(start).toString()) + suffix);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span ref={ref} className="text-3xl md:text-5xl font-black font-mono text-highlight mb-2 group-hover:scale-105 transition-transform duration-300">
        {displayValue}
      </span>
      <span className="text-[10px] md:text-xs text-foreground/40 font-mono uppercase tracking-widest leading-normal">
        {label}
      </span>
    </motion.div>
  );
}

export default function About({
  content = "I specialize in transforming complex engineering challenges into elegant, manufacturable solutions. With a foundation in mechanical principles and an eye for industrial design, I bridge the gap between aesthetic intent and functional reality. My approach is rooted in the belief that the best designs are both beautiful and infinitely practical.\n\nMy goal is to build innovative products by combining CAD design, rapid prototyping, embedded systems, and practical manufacturing knowledge while continuously learning modern engineering technologies.",
  imageUrl,
  stats = [
    { value: "4", label: "Projects Completed" },
    { value: "7.8", label: "CGPA" },
    { value: "15+", label: "CAD Assemblies" },
    { value: "3+", label: "Years CAD Experience" }
  ]
}: AboutProps) {
  return (
    <section id="about" className="relative w-full bg-background-secondary py-40 px-6 lg:px-20 overflow-hidden z-10 border-b border-white/5">
      <div className="absolute inset-0 blueprint-grid opacity-[0.015] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <span className="font-mono text-xs text-accent-primary/40 uppercase tracking-[0.3em] block mb-2">// Profile</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-highlight uppercase tracking-tighter">
            The <span className="text-accent-primary">Engineer</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-stretch">
          
          {/* Left Column: Mission Bio & Quick Stats */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-12">
            <div>
              <h3 className="text-sm font-mono tracking-widest text-accent-primary/60 uppercase mb-6 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent-primary" /> Biography
              </h3>
              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed font-light whitespace-pre-line">
                {content}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <AnimatedCounter key={i} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>

          {/* Right Column: Timeline / Education & Certifications */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.01] rounded-full blur-[100px] pointer-events-none" />
            
            <h3 className="text-sm font-mono tracking-widest text-accent-primary/60 uppercase mb-10 flex items-center gap-2">
              <GraduationCap className="w-4.5 h-4.5 text-accent-primary" /> Education & Milestones
            </h3>

            {/* Timeline */}
            <div className="relative border-l border-white/10 pl-6 md:pl-8 flex flex-col gap-10">
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative group"
              >
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-accent-primary ring-4 ring-background-secondary transition-transform group-hover:scale-125 duration-300" />
                <span className="text-accent-secondary font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> 2023 - 2027
                </span>
                <h4 className="text-xl md:text-2xl font-bold text-highlight mt-2">B.E. Mechanical Engineering</h4>
                <p className="text-sm text-foreground/50 mt-2 font-light leading-relaxed">
                  AAA College of Engineering & Technology, Anna University. Ranked 3rd in 1st Year (CGPA 8.23/10.0). Current CGPA: 7.8. Specializing in design engineering and digital fabrication.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative group"
              >
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-background border-2 border-accent-secondary ring-4 ring-background-secondary transition-transform group-hover:scale-125 duration-300" />
                <span className="text-accent-secondary font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5">
                  <Award className="w-3 h-3" /> Oct 2024
                </span>
                <h4 className="text-xl md:text-2xl font-bold text-highlight mt-2">CSWA Certified Professional</h4>
                <p className="text-sm text-foreground/50 mt-2 font-light leading-relaxed">
                  SOLIDWORKS CAD Design Associate — Dassault Systèmes. Validates core competence in parametric solid modeling, coordinate systems, and engineering blueprint design.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative group"
              >
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-background border-2 border-accent-secondary ring-4 ring-background-secondary transition-transform group-hover:scale-125 duration-300" />
                <span className="text-accent-secondary font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> 2024 - Present
                </span>
                <h4 className="text-xl md:text-2xl font-bold text-highlight mt-2">IIC Coordinator</h4>
                <p className="text-sm text-foreground/50 mt-2 font-light leading-relaxed">
                  Institution&apos;s Innovation Council Coordinator. Organizes technical workshops, startup incubation events, and coordinates guest speaker logistics on design innovation.
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

