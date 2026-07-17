"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const defaultStats = [
  { value: "4", label: "Projects Completed" },
  { value: "7.8", label: "CGPA" },
  { value: "15+", label: "CAD Assemblies" },
  { value: "3+", label: "Years CAD Experience" },
];

interface AboutProps {
  content?: string;
  imageUrl?: string | null;
}

export default function About({
  content = "I specialize in transforming complex engineering challenges into elegant, manufacturable solutions. With a foundation in mechanical principles and an eye for industrial design, I bridge the gap between aesthetic intent and functional reality. My approach is rooted in the belief that the best designs are both beautiful and infinitely practical.\n\nMy goal is to build innovative products by combining CAD design, rapid prototyping, embedded systems, and practical manufacturing knowledge while continuously learning modern engineering technologies.",
  imageUrl
}: AboutProps) {
  return (
    <section id="about" className="relative w-full bg-background-secondary py-40 px-6 lg:px-20 overflow-hidden z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-highlight mb-6 uppercase tracking-tighter">
            The <span className="text-accent-primary">Engineer</span>
          </h2>
          <div className="w-24 h-1 bg-accent-secondary" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Mission */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-accent-primary mb-6 font-mono tracking-widest uppercase">Mission</h3>
            <div className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light mb-12 whitespace-pre-line">
              {content}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {defaultStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="glass p-6 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-colors"
                >
                  <span className="text-3xl md:text-4xl font-bold text-accent-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </span>
                  <span className="text-[10px] md:text-xs text-foreground/60 uppercase tracking-widest">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image or Highlight */}
          <div className="relative flex justify-center items-center">
            {imageUrl ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/10"
              >
                <Image 
                  src={imageUrl} 
                  alt="About Me" 
                  fill
                  className="object-cover" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              </motion.div>
            ) : (
              <div className="relative border-l border-white/10 pl-8 md:pl-12 flex flex-col gap-12 justify-center h-full">
                {/* Fallback Timeline if no image is provided */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute -left-[37px] md:-left-[53px] top-1 w-4 h-4 rounded-full bg-accent-secondary shadow-[0_0_15px_#00B4D8]" />
                  <span className="text-accent-secondary font-mono text-sm tracking-widest">2023 - 2027</span>
                  <h4 className="text-2xl font-bold text-highlight mt-2">B.E. Mechanical Engineering</h4>
                  <p className="text-foreground/60 mt-2">AAA College of Engineering & Technology, Anna University. Ranked 3rd in 1st Year (CGPA 8.23/10.0). Current CGPA: 7.8.</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative"
                >
                  <div className="absolute -left-[37px] md:-left-[53px] top-1 w-4 h-4 rounded-full bg-background border-2 border-accent-secondary" />
                  <span className="text-accent-primary font-mono text-sm tracking-widest">Oct 2024</span>
                  <h4 className="text-2xl font-bold text-highlight mt-2">CSWA Certified</h4>
                  <p className="text-foreground/60 mt-2">SOLIDWORKS CAD Design Associate — Dassault Systèmes.</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="relative"
                >
                  <div className="absolute -left-[37px] md:-left-[53px] top-1 w-4 h-4 rounded-full bg-background border-2 border-accent-secondary" />
                  <span className="text-accent-primary font-mono text-sm tracking-widest">2025 - 2026</span>
                  <h4 className="text-2xl font-bold text-highlight mt-2">Student Coordinator</h4>
                  <p className="text-foreground/60 mt-2">Institution&apos;s Innovation Council (IIC) — Organized campus events and technical workshops.</p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
