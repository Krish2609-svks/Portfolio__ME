"use client";

import { motion } from "framer-motion";

export default function Philosophy() {
  return (
    <section id="philosophy" className="relative w-full bg-background-secondary py-40 px-6 lg:px-20 overflow-hidden z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        {/* Left Side: Text */}
        <div className="flex-1 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-highlight mb-6 uppercase tracking-tighter">
              Engineering <span className="text-accent-secondary">Philosophy</span>
            </h2>
            <div className="w-24 h-1 bg-accent-secondary mb-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <p className="text-xl md:text-2xl font-light text-foreground/90 leading-relaxed italic border-l-2 border-accent-secondary pl-6">
              &quot;Engineering is not just about solving equations. It is about visualizing a better future and having the technical rigor to manufacture it into reality.&quot;
            </p>
            <p className="text-lg text-foreground/60 leading-relaxed font-light">
              I believe in a hands-on approach to mechanical design. Whether I am modeling a complex sheet metal enclosure in SolidWorks or programming an ESP32 for smart vehicle integration, my goal is always to reduce the friction between the initial concept and the final, functional prototype.
            </p>
            <p className="text-lg text-foreground/60 leading-relaxed font-light">
              True innovation happens at the intersection of mechanical design, embedded systems, and modern manufacturing techniques. By understanding all three, I aim to build products that are not only theoretically robust, but highly manufacturable and user-centric.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Abstract Visual (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex-1 w-full relative h-[400px] glass-panel rounded-3xl overflow-hidden flex items-center justify-center border border-white/10"
        >
          {/* Abstract Wireframe / Blueprint styling */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(0,229,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.2)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="w-48 h-48 border border-accent-primary rounded-full absolute animate-spin-slow opacity-30" />
          <div className="w-32 h-32 border-2 border-dashed border-accent-secondary rounded-full absolute animate-reverse-spin opacity-50" />
          <div className="w-16 h-16 bg-accent-primary/20 backdrop-blur-md rounded-lg absolute rotate-45 border border-accent-primary flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.5)]">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          <span className="absolute bottom-6 right-6 text-xs font-mono tracking-widest text-accent-primary uppercase opacity-50">FIG 1. Abstract Assembly</span>
        </motion.div>

      </div>
    </section>
  );
}
