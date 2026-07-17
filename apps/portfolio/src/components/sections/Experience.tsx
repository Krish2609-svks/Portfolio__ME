"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  current: boolean;
  description: string;
  display_order: number;
}

interface ExperienceProps {
  items?: ExperienceItem[];
}

const defaultExperiences: ExperienceItem[] = [
  {
    id: "1",
    role: "Student Trainee",
    company: "Hitachi Pumps & Division, Coimbatore",
    location: "Coimbatore",
    start_date: "2024-01-01",
    current: false,
    description: "Observed live CNC machining operations (turning and milling), gaining exposure to G-code execution and tool setup procedures. Studied quality inspection techniques including dimensional tolerance checking using Vernier calipers and gauges, and learned production floor workflow and preventive maintenance practices.",
    display_order: 1
  }
];

export default function Experience({ items = defaultExperiences }: ExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const displayItems = items && items.length > 0 ? items : defaultExperiences;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  };

  return (
    <section id="experience" ref={containerRef} className="relative w-full bg-background py-40 px-6 lg:px-20 overflow-hidden z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-highlight mb-4 uppercase tracking-tighter">
            Industrial <span className="text-accent-primary">Exposure</span>
          </h2>
          <div className="w-20 h-1 bg-accent-primary" />
        </motion.div>

        <div className="relative ml-4 md:ml-8">
          {/* Static background line */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10" />
          
          {/* Glowing animated line */}
          <motion.div 
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent-primary origin-top shadow-[0_0_15px_rgba(0,229,255,0.8)]"
            style={{ scaleY }}
          />

          {displayItems.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-20 relative pl-12 md:pl-20 group"
            >
              {/* Node */}
              <div className="absolute -left-[7px] top-2 w-4 h-4 rounded-full bg-background border-2 border-accent-secondary group-hover:bg-accent-secondary group-hover:shadow-[0_0_20px_#00B4D8] transition-all duration-500 z-10" />
              
              <div className="flex flex-col gap-2">
                <span className="text-accent-primary font-mono text-sm tracking-widest">
                  {formatDate(exp.start_date)} - {exp.current ? 'Present' : (exp.end_date ? formatDate(exp.end_date) : '')}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-highlight group-hover:text-white transition-colors">{exp.role}</h3>
                <h4 className="text-lg text-foreground/60 uppercase tracking-widest">{exp.company} {exp.location ? `• ${exp.location}` : ''}</h4>
                <div className="mt-4 text-foreground/80 font-light leading-relaxed max-w-2xl whitespace-pre-line">
                  {exp.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
