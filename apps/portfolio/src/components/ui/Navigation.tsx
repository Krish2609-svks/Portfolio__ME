"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const sections = [
  { id: "home", label: "Home" },
  { id: "philosophy", label: "Philosophy" },
  { id: "about", label: "About" },
  { id: "leadership", label: "Leadership" },
  { id: "skills", label: "Skills" },
  { id: "process", label: "Process" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" }
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500",
          isScrolled ? "py-4 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-2xl" : "py-6 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-20 flex items-center justify-between">
          
          <button 
            onClick={() => scrollToSection("home")}
            className="text-2xl font-bold font-mono tracking-tighter text-highlight hover:text-accent-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent-primary outline-none"
            aria-label="Back to home"
          >
            NK.
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="relative px-4 py-2 text-sm font-mono tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-primary outline-none rounded-full"
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={cn("relative z-10 transition-colors duration-300", isActive ? "text-background font-bold" : "text-foreground/60 hover:text-highlight")}>
                    {section.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-accent-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-accent-primary outline-none z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <motion.span animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 8 : 0 }} className="w-6 h-[2px] bg-highlight block transition-all" />
            <motion.span animate={{ opacity: isMobileMenuOpen ? 0 : 1 }} className="w-6 h-[2px] bg-highlight block transition-all" />
            <motion.span animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -8 : 0 }} className="w-6 h-[2px] bg-highlight block transition-all" />
          </button>

        </div>
      </motion.nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl lg:hidden flex flex-col items-center justify-center gap-6"
          >
            {sections.map((section, idx) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "text-2xl font-mono tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-primary outline-none",
                  activeSection === section.id ? "text-accent-primary font-bold" : "text-foreground/60 hover:text-highlight"
                )}
              >
                {section.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
