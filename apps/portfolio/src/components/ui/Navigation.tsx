"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "capabilities", label: "Capabilities" },
  { id: "projects", label: "Projects" },
  { id: "leadership", label: "Leadership" },
  { id: "contact", label: "Contact" }
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 50);

      // Hide on scroll down, show on scroll up
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -60% 0px",
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
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full transition-all duration-300",
          isScrolled 
            ? "glass py-3 px-6 shadow-2xl border border-white/10" 
            : "bg-transparent py-4 px-6 border border-transparent"
        )}
      >
        <div className="flex items-center justify-between">
          
          <button 
            onClick={() => scrollToSection("home")}
            className="text-xl font-bold font-mono tracking-tighter text-highlight hover:text-accent-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent-primary outline-none"
            aria-label="Back to home"
          >
            NK<span className="text-accent-primary">.</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "relative px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all focus-visible:ring-2 focus-visible:ring-accent-primary outline-none rounded-full"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={cn(
                    "relative z-10 transition-colors duration-300", 
                    isActive ? "text-background font-bold" : "text-foreground/50 hover:text-highlight"
                  )}>
                    {section.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-accent-primary rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-accent-primary outline-none z-50 rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <motion.span 
              animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 5.5 : 0 }} 
              className="w-5 h-[1.5px] bg-highlight block transition-all" 
            />
            <motion.span 
              animate={{ opacity: isMobileMenuOpen ? 0 : 1 }} 
              className="w-5 h-[1.5px] bg-highlight block transition-all" 
            />
            <motion.span 
              animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -5.5 : 0 }} 
              className="w-5 h-[1.5px] bg-highlight block transition-all" 
            />
          </button>

        </div>
      </motion.nav>

      {/* Mobile Nav Overlay / Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            <div className="absolute inset-0 blueprint-grid opacity-[0.02]" />
            {sections.map((section, idx) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "text-xl font-mono tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-primary outline-none py-2 px-6 rounded-full",
                  activeSection === section.id ? "text-accent-primary font-bold bg-white/5 border border-white/10" : "text-foreground/50 hover:text-highlight"
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
