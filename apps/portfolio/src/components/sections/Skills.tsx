"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, PenTool, Wrench, FileCode, MonitorPlay, Code, Award, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  category: string;
  display_order: number;
}

interface SkillsProps {
  skills?: Skill[];
}

const defaultCategories = [
  {
    id: "cad",
    title: "CAD & Design",
    icon: PenTool,
    skills: ["SolidWorks (CSWA)", "Fusion 360", "Assembly Design", "Part Modeling", "Sheet Metal", "Engineering Drawings"]
  },
  {
    id: "simulation",
    title: "Simulation",
    icon: MonitorPlay,
    skills: ["MATLAB", "Simulink"]
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    icon: Wrench,
    skills: ["CNC Programming", "GD&T", "Rapid Prototyping", "Additive Manufacturing"]
  },
  {
    id: "programming",
    title: "Programming",
    icon: FileCode,
    skills: ["Python", "C/C++"]
  },
  {
    id: "embedded",
    title: "Embedded Systems",
    icon: Cpu,
    skills: ["ESP32", "Arduino", "Raspberry Pi", "FreeRTOS"]
  }
];

const categoryIconMap: Record<string, any> = {
  "cad": PenTool,
  "cad & design": PenTool,
  "simulation": MonitorPlay,
  "manufacturing": Wrench,
  "programming": FileCode,
  "frontend": Code,
  "backend": FileCode,
  "embedded": Cpu,
  "embedded systems": Cpu,
  "default": CheckCircle
};

export default function Skills({ skills }: SkillsProps) {
  // If we have skills from DB, group them by category
  const skillCategories = useMemo(() => {
    if (!skills || skills.length === 0) return defaultCategories;

    const grouped = skills.reduce((acc, skill) => {
      const cat = skill.category.trim();
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    return Object.entries(grouped).map(([title, items]) => {
      const normalizedTitle = title.toLowerCase();
      const Icon = categoryIconMap[normalizedTitle] || categoryIconMap["default"];
      return {
        id: title,
        title,
        icon: Icon,
        // Sort items by display_order
        skills: items.sort((a, b) => a.display_order - b.display_order).map(s => s.name)
      };
    });
  }, [skills]);

  const [activeCategory, setActiveCategory] = useState(skillCategories[0]?.id || "");

  if (skillCategories.length === 0) return null;

  return (
    <section id="skills" className="relative w-full bg-background py-40 px-6 lg:px-20 overflow-hidden z-10">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-primary/5 via-background to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-highlight mb-6 uppercase tracking-tighter">
            Technical <span className="text-accent-secondary">Arsenal</span>
          </h2>
          <div className="w-24 h-1 bg-accent-primary" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 h-full min-h-[500px]">
          {/* Categories Sidebar */}
          <div className="flex flex-col gap-4 lg:w-1/3">
            {skillCategories.map((cat, i) => {
              const Icon = cat.icon;
              // If activeCategory was not set, fallback to the first
              const currentActive = activeCategory || skillCategories[0].id;
              const isActive = currentActive === cat.id;
              
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-4 px-6 py-5 rounded-xl text-left transition-all duration-300 relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary hover-trigger",
                    isActive ? "bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeCategory"
                      className="absolute left-0 top-0 w-1 h-full bg-accent-primary"
                    />
                  )}
                  <Icon className={cn("w-6 h-6 transition-colors", isActive ? "text-accent-primary" : "text-foreground/50 group-hover:text-foreground/80")} />
                  <span className={cn("font-bold tracking-widest uppercase text-sm transition-colors", isActive ? "text-highlight" : "text-foreground/60 group-hover:text-foreground/90")}>
                    {cat.title}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Skills Grid */}
          <div className="lg:w-2/3 glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory || skillCategories[0]?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10"
              >
                {skillCategories.find(c => c.id === (activeCategory || skillCategories[0]?.id))?.skills.map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent-secondary group-hover:scale-150 group-hover:shadow-[0_0_10px_#00B4D8] transition-all" />
                    <span className="text-lg text-foreground/80 group-hover:text-highlight transition-colors font-light">
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
