"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Disable scrolling while preloader is active
    document.body.style.overflow = "hidden";
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsComplete(true);
            document.body.style.overflow = "";
          }, 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 2;
      });
    }, 150);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (isComplete) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[999] bg-background flex flex-col items-center justify-center"
      initial={{ y: 0 }}
      animate={progress >= 100 ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
    >
      <div className="w-full max-w-md px-6 flex flex-col gap-4">
        <div className="flex justify-between text-accent-primary font-mono text-sm tracking-widest uppercase">
          <span>System Boot</span>
          <span>{progress > 100 ? 100 : progress}%</span>
        </div>
        <div className="w-full h-[2px] bg-white/10 overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-accent-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.15 }}
          />
        </div>
        <div className="text-foreground/40 font-mono text-[10px] mt-2 uppercase text-center animate-pulse">
          Loading CAD Assets // Compiling Geometry // Initializing Physics
        </div>
      </div>
    </motion.div>
  );
}
