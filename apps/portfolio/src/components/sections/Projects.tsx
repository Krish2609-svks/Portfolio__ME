"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Projects() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadProjects() {
      const { data } = await supabase.from('projects').select('*').eq('published', true).order('display_order', { ascending: true });
      if (data) setProjects(data);
    }
    loadProjects();
  }, [supabase]);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    if (activeProject) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  return (
    <section id="projects" className="relative w-full bg-background-secondary py-40 px-6 lg:px-20 z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 flex flex-col items-start"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-highlight mb-6 uppercase tracking-tighter">
            Engineering <span className="text-accent-primary">Case Studies</span>
          </h2>
          <div className="w-24 h-1 bg-accent-secondary" />
        </motion.div>

        <div className="flex flex-col gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className="group relative"
            >
              <button 
                className="w-full text-left glass-panel p-8 md:p-12 rounded-2xl cursor-pointer hover:bg-white/5 transition-all duration-500 overflow-hidden relative hover-trigger focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                onClick={() => setActiveProject(project.id)}
                aria-label={`View case study for ${project.title}`}
              >
                <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-accent-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="flex flex-col gap-2 max-w-3xl">
                    <span className="text-accent-secondary font-mono text-sm uppercase tracking-widest">Engineering</span>
                    <h3 className="text-3xl md:text-5xl font-bold text-highlight group-hover:text-accent-primary transition-colors">{project.title}</h3>
                    <p 
                      className="text-foreground/60 text-lg md:text-xl font-light mt-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: project.overview || '' }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-4 mt-6 md:mt-0">
                    <span className="uppercase tracking-widest text-sm font-medium text-foreground/50 group-hover:text-highlight transition-colors hidden sm:block">View Study</span>
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent-primary group-hover:bg-accent-primary/10 transition-all duration-300 flex-shrink-0">
                      <ArrowRight className="text-foreground/50 group-hover:text-accent-primary w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Case Study Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl p-4 md:p-12 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            {projects.filter(p => p.id === activeProject).map(project => (
              <motion.div 
                key="modal"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-6xl bg-surface border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]"
              >
                {/* Header / Hero */}
                <div className="w-full h-[30vh] md:h-[40vh] bg-background-secondary relative flex flex-col justify-end p-8 md:p-16 border-b border-white/5">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary/10 via-background to-background pointer-events-none" />
                  <button 
                    onClick={() => setActiveProject(null)}
                    aria-label="Close modal"
                    className="absolute top-6 right-6 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="relative z-10">
                    <span className="text-accent-secondary font-mono text-sm tracking-widest uppercase">{project.category}</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-highlight mt-4">{project.title}</h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-16 overflow-y-auto custom-scrollbar flex flex-col gap-12 bg-background">
                  
                  {/* Overview Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="flex flex-col gap-4">
                      <h4 className="text-sm font-mono tracking-widest text-accent-primary uppercase">Overview</h4>
                      <div className="prose prose-invert prose-zinc max-w-none text-foreground/70 font-light leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: project.overview || '' }} />
                    </div>
                    <div className="flex flex-col gap-4">
                      <h4 className="text-sm font-mono tracking-widest text-accent-primary uppercase">Problem Statement</h4>
                      <div className="prose prose-invert prose-zinc max-w-none text-foreground/70 font-light leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: project.problem_statement || '' }} />
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-white/5" />

                  {/* Placeholder for Gallery/Media */}

                  {/* Placeholder for Gallery/Media */}
                  <div className="w-full h-64 border border-dashed border-white/20 rounded-2xl flex items-center justify-center mt-12 bg-white/5">
                    <span className="text-foreground/40 font-mono text-sm tracking-widest">[TODO: INSERT PROJECT CAD RENDERS / PHOTOS HERE]</span>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
