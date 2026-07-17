"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, X, ShieldAlert, Cpu, Settings, PenTool, CheckCircle2, FlaskConical, LayoutGrid, Image as ImageIcon } from "lucide-react";
import { getPortfolioData, Project } from "@/utils/getData";
import Image from "next/image";
import { cn } from "@/lib/utils";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// Custom 3D Tilt Card wrapper
function TiltCard({ children, onClick, className, ariaLabel }: { children: React.ReactNode; onClick: () => void; className: string; ariaLabel: string }) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const rX = -(mouseY / height) * 8; // max 8deg tilt
    const rY = (mouseX / width) * 8;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.button
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
      aria-label={ariaLabel}
    >
      <div style={{ transform: "translateZ(15px)" }} className="w-full h-full">
        {children}
      </div>
    </motion.button>
  );
}

// Map project sections to nice icon chips
const sectionIcons: Record<string, any> = {
  overview: LayoutGrid,
  challenge: ShieldAlert,
  research: FlaskConical,
  cad: PenTool,
  electronics: Cpu,
  prototype: Settings,
  design: PenTool,
  manufacturing: Settings,
  assembly: Settings,
  testing: CheckCircle2,
  result: CheckCircle2,
  leaf_structure: FlaskConical,
  topology_optimization: PenTool,
  ntop_workflow: Cpu,
  "3d_printing": Settings,
  expected_results: CheckCircle2
};

export default function Projects() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [cadCategory, setCadCategory] = useState<string>("All");

  useEffect(() => {
    const data = getPortfolioData();
    if (data && data.projects) {
      setProjects(data.projects);
    }
  }, []);

  // Sync active project modal open and escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    if (activeProject) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent main body scrolling
      
      // Auto-set the first available key as active tab
      const project = projects.find(p => p.id === activeProject);
      if (project) {
        const availableTabs = getProjectTabs(project);
        if (availableTabs.length > 0) {
          setActiveTab(availableTabs[0].key);
        }
      }
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeProject, projects]);

  const getProjectTabs = (project: Project) => {
    if (project.isGalleryOnly) return [];
    
    const tabs: { key: string; label: string }[] = [];
    const fields: (keyof Project)[] = [
      "overview", "challenge", "research", "design", "cad", 
      "electronics", "prototype", "manufacturing", "assembly", 
      "testing", "result", "leaf_structure", "topology_optimization", 
      "ntop_workflow", "3d_printing", "expected_results"
    ];

    fields.forEach(field => {
      if (project[field] && typeof project[field] === "string") {
        tabs.push({
          key: field,
          label: field.replace("_", " ")
        });
      }
    });

    return tabs;
  };

  const getProjectTabContent = (project: Project, tabKey: string) => {
    return (project as any)[tabKey] || "";
  };

  const currentProject = projects.find(p => p.id === activeProject);
  const activeTabs = currentProject ? getProjectTabs(currentProject) : [];

  // CAD Showcase Categories
  const getCadCategories = (project: Project) => {
    const cats = new Set<string>(["All"]);
    project.gallery.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  };

  const filteredCadGallery = currentProject?.isGalleryOnly
    ? currentProject.gallery.filter(item => cadCategory === "All" || item.category === cadCategory)
    : [];

  return (
    <section id="projects" className="relative w-full bg-background-secondary py-40 px-6 lg:px-20 z-10 border-t border-white/5">
      <div className="absolute inset-0 blueprint-grid opacity-[0.01] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 flex flex-col items-start"
        >
          <span className="font-mono text-xs text-accent-primary/40 uppercase tracking-[0.3em] block mb-2">// Selected Works</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-highlight uppercase tracking-tighter">
            Engineering <span className="text-accent-primary">Case Studies</span>
          </h2>
        </motion.div>

        {/* Immersive tilt cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="w-full"
            >
              <TiltCard
                onClick={() => setActiveProject(project.id)}
                className="w-full text-left glass-panel p-8 md:p-12 rounded-3xl cursor-pointer hover:bg-white/[0.02] border-white/5 transition-all duration-500 overflow-hidden relative group h-full flex flex-col justify-between"
                ariaLabel={`Open case study: ${project.title}`}
              >
                <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Visual Image Mask Reveal */}
                <div className="relative w-full aspect-[16/9] mb-8 rounded-2xl overflow-hidden border border-white/5 bg-background">
                  {project.gallery && project.gallery[0] && (
                    <Image 
                      src={project.gallery[0].url} 
                      alt={project.title} 
                      fill
                      className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700 opacity-60 group-hover:opacity-85" 
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                  {/* Absolute subtle grid overlay inside the image */}
                  <div className="absolute inset-0 blueprint-grid opacity-[0.05] pointer-events-none" />
                  
                  {project.status && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary font-mono text-[9px] uppercase tracking-wider rounded-full backdrop-blur-md">
                      {project.status}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <span className="text-accent-secondary font-mono text-[10px] uppercase tracking-widest">
                    {project.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-highlight group-hover:text-accent-primary transition-colors uppercase tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-foreground/50 text-sm font-light mt-2 line-clamp-2 leading-relaxed">
                    {project.overview}
                  </p>

                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/5">
                    <span className="uppercase tracking-widest text-[10px] font-mono text-foreground/40 group-hover:text-highlight transition-colors">
                      View Case Study
                    </span>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent-primary group-hover:bg-accent-primary/10 transition-all duration-300">
                      <ArrowRight className="text-foreground/40 group-hover:text-accent-primary w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Case Study Overlay / Drawer */}
      <AnimatePresence>
        {activeProject && currentProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-2xl p-4 md:p-8 lg:p-12 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-6xl bg-surface border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh] glass-panel"
            >
              
              {/* Header / Hero */}
              <div className="w-full min-h-[22vh] bg-background-secondary relative flex flex-col justify-end p-8 md:p-12 border-b border-white/5">
                <div className="absolute inset-0 blueprint-grid opacity-[0.02] pointer-events-none" />
                <button 
                  onClick={() => setActiveProject(null)}
                  aria-label="Close case study"
                  className="absolute top-6 right-6 w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="relative z-10 max-w-4xl">
                  <span className="text-accent-secondary font-mono text-xs tracking-widest uppercase">
                    {currentProject.category}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black text-highlight mt-2 uppercase tracking-tight leading-none">
                    {currentProject.title}
                  </h2>
                </div>
              </div>

              {/* Case Study Content */}
              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col gap-10 bg-background/50">
                
                {/* 1. Case Study Tabbed Content */}
                {!currentProject.isGalleryOnly && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Tabs List */}
                    <div className="lg:col-span-4 flex flex-col gap-2">
                      <span className="font-mono text-[9px] text-foreground/35 uppercase tracking-widest mb-3 pl-4">
                        Case Study Roadmap //
                      </span>
                      {activeTabs.map((tab) => {
                        const Icon = sectionIcons[tab.key] || LayoutGrid;
                        const isCurrent = activeTab === tab.key;
                        return (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                              "w-full text-left px-5 py-4 rounded-xl font-mono text-[10px] uppercase tracking-wider flex items-center gap-3 transition-all border outline-none",
                              isCurrent 
                                ? "bg-white/5 border-white/10 text-highlight font-bold" 
                                : "bg-transparent border-transparent text-foreground/40 hover:bg-white/[0.02] hover:text-foreground/80"
                            )}
                          >
                            <Icon className={cn("w-4.5 h-4.5", isCurrent ? "text-accent-primary animate-pulse" : "text-foreground/40")} />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Tab Panel */}
                    <div className="lg:col-span-8 glass p-8 rounded-2xl border border-white/5 min-h-[300px] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                          <span className="font-mono text-xs text-accent-primary uppercase tracking-[0.2em]">
                            Section: {activeTab.replace("_", " ")}
                          </span>
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="text-base md:text-lg text-foreground/80 leading-relaxed font-light whitespace-pre-line"
                          >
                            {getProjectTabContent(currentProject, activeTab)}
                          </motion.p>
                        </AnimatePresence>
                      </div>

                      {/* GitHub Link for Code Projects */}
                      {currentProject.github && activeTab === "result" && (
                        <div className="mt-8 pt-6 border-t border-white/5 flex">
                          <a 
                            href={currentProject.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-highlight hover:text-accent-primary transition-colors bg-white/5 px-5 py-3.5 rounded-xl border border-white/10"
                          >
                            <GithubIcon className="w-4 h-4" /> Link to Repository
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. CAD Showcase view */}
                {currentProject.isGalleryOnly && (
                  <div className="flex flex-col gap-8">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2 justify-center border-b border-white/5 pb-6">
                      {getCadCategories(currentProject).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCadCategory(cat)}
                          className={cn(
                            "px-4 py-2 font-mono text-[9px] uppercase tracking-wider rounded-full border transition-all",
                            cadCategory === cat 
                              ? "bg-accent-primary text-background border-accent-primary font-bold"
                              : "bg-white/5 border-white/5 text-foreground/50 hover:border-white/10 hover:text-highlight"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Showcase Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCadGallery.map((item, index) => (
                        <motion.div
                          key={index}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          className="glass rounded-2xl overflow-hidden border border-white/5 group hover:border-white/10 transition-colors"
                        >
                          <div className="relative aspect-video w-full bg-background overflow-hidden">
                            <Image 
                              src={item.url} 
                              alt={item.title || "CAD Model"} 
                              fill
                              className="object-cover scale-105 group-hover:scale-100 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 blueprint-grid opacity-[0.04] pointer-events-none" />
                            {item.category && (
                              <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded font-mono text-[8px] tracking-widest text-accent-secondary uppercase">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <div className="p-5 flex flex-col gap-1.5">
                            <h4 className="text-sm font-bold text-highlight font-mono uppercase tracking-wide">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-foreground/50 font-light leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Project Media Gallery (Case Studies) */}
                {!currentProject.isGalleryOnly && currentProject.gallery && currentProject.gallery.length > 0 && (
                  <div className="flex flex-col gap-6 mt-6">
                    <h3 className="text-sm font-mono tracking-widest text-accent-primary/60 uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-accent-primary" /> Technical Media & Drawing sheets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentProject.gallery.map((img, idx) => (
                        <div 
                          key={idx} 
                          className="glass rounded-2xl overflow-hidden border border-white/5 flex flex-col group hover:border-white/10 transition-colors"
                        >
                          <div className="relative aspect-video w-full bg-background overflow-hidden">
                            <Image 
                              src={img.url} 
                              alt={img.caption || currentProject.title} 
                              fill
                              className="object-cover opacity-75 group-hover:scale-102 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />
                          </div>
                          {img.caption && (
                            <div className="p-4 bg-background-secondary border-t border-white/5">
                              <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/45 text-center">
                                {img.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

