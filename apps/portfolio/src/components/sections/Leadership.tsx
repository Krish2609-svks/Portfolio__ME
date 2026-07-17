"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Award, Calendar, UserCheck } from "lucide-react";
import { getPortfolioData, LeadershipItem, Certification, ProfessionalMembership } from "@/utils/getData";
import { cn } from "@/lib/utils";

// 3D Flipping Certificate Card
function FlippingCertCard({ cert }: { cert: Certification }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-full h-44 cursor-pointer relative"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        className="w-full h-full relative transition-all duration-500"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 glass-panel p-6 rounded-2xl flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="font-mono text-[9px] text-accent-primary/40 uppercase tracking-widest">
                Certification
              </span>
              <Award className="w-4 h-4 text-accent-primary" />
            </div>
            <h4 className="text-lg font-bold text-highlight mt-3 leading-snug uppercase font-mono tracking-wide">
              {cert.title}
            </h4>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-foreground/45 border-t border-white/5 pt-4">
            <span>{cert.issuer}</span>
            <span>ID: {cert.credential_id}</span>
          </div>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 glass-panel p-6 rounded-2xl flex flex-col justify-center items-center text-center bg-white/[0.03]"
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)" 
          }}
        >
          <span className="font-mono text-[9px] text-accent-primary/45 uppercase tracking-widest mb-4">
            Verified Credential
          </span>
          <a 
            href={cert.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-4 py-2 border border-white/20 hover:border-accent-primary hover:bg-accent-primary hover:text-background text-[10px] font-mono tracking-widest uppercase transition-all duration-300 rounded-full"
          >
            Verify Credential
          </a>
        </div>
      </motion.div>
    </div>
  );
}

// SAE India Membership Card
function SaeMembershipCard({ membership }: { membership: ProfessionalMembership }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const rX = -(mouseY / height) * 15;
    const rY = (mouseX / width) * 15;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        className="w-full max-w-sm aspect-[1.586/1] rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-[#1c1c22] via-[#0d0d0f] to-[#141416] border border-white/10 shadow-2xl select-none"
      >
        {/* Metal shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
        
        {/* Card blueprint grid */}
        <div className="absolute inset-0 blueprint-grid opacity-[0.02] pointer-events-none" />
        
        <div style={{ transform: "translateZ(30px)" }} className="h-full flex flex-col justify-between relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-black font-mono tracking-tighter text-highlight">
                {membership.organization}
              </h4>
              <span className="text-[7px] tracking-[0.2em] font-mono text-accent-secondary uppercase">
                {membership.chapter} Chapter
              </span>
            </div>
            <div className="px-2 py-0.5 border border-accent-primary/20 bg-accent-primary/10 text-accent-primary text-[8px] font-mono tracking-widest uppercase rounded">
              Active
            </div>
          </div>

          {/* Chip visual representation */}
          <div className="w-8 h-6 bg-gradient-to-r from-yellow-600/35 to-yellow-500/20 rounded-md border border-yellow-600/30 overflow-hidden relative">
            <div className="absolute inset-x-2 top-0 bottom-0 border-x border-yellow-600/20" />
            <div className="absolute inset-y-1.5 left-0 right-0 border-y border-yellow-600/20" />
          </div>

          {/* Details */}
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[7px] text-foreground/40 font-mono uppercase tracking-widest">
                Cardholder
              </span>
              <p className="text-xs font-mono font-bold text-highlight uppercase tracking-wider mt-0.5">
                Nambi Krishnan M
              </p>
              <span className="text-[7px] text-foreground/40 font-mono uppercase tracking-widest block mt-2">
                Member ID
              </span>
              <p className="text-[10px] font-mono text-foreground/80 mt-0.5">
                {membership.member_id}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[7px] text-foreground/40 font-mono uppercase tracking-widest block">
                Valid Thru
              </span>
              <p className="text-[9px] font-mono text-highlight mt-0.5">
                {membership.valid_thru}
              </p>
              <span className="text-[7px] text-foreground/30 font-mono uppercase tracking-widest block mt-2">
                {membership.role}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Leadership() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [leadership, setLeadership] = useState<LeadershipItem[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [membership, setMembership] = useState<ProfessionalMembership | null>(null);

  useEffect(() => {
    const data = getPortfolioData();
    if (data) {
      setLeadership(data.leadership);
      setCertifications(data.certifications);
      setMembership(data.professional_membership);
    }
  }, []);

  return (
    <section id="leadership" className="relative w-full bg-background py-40 px-6 lg:px-20 overflow-hidden z-10 border-b border-white/5">
      <div className="absolute inset-0 blueprint-grid opacity-[0.01]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <span className="font-mono text-xs text-accent-primary/40 uppercase tracking-[0.3em] block mb-2">// Beyond Academics</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-highlight uppercase tracking-tighter">
            Leadership & <span className="text-accent-primary">Certs</span>
          </h2>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Leadership Roles */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <h3 className="text-sm font-mono tracking-widest text-accent-primary/60 uppercase mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-primary" /> Extracurricular Leadership
            </h3>

            <div className="flex flex-col gap-4">
              {leadership.map((item, idx) => {
                const isHovered = hoveredRole === item.role;
                return (
                  <motion.div
                    key={idx}
                    onMouseEnter={() => setHoveredRole(item.role)}
                    onMouseLeave={() => setHoveredRole(null)}
                    className="glass-panel p-6 rounded-2xl cursor-pointer transition-all duration-300 border border-white/5 overflow-hidden"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-bold text-highlight uppercase font-mono tracking-wide">
                        {item.role}
                      </h4>
                      <span className="text-xs text-foreground/30 font-mono">
                        [ {isHovered ? "-" : "+"} ]
                      </span>
                    </div>

                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-sm text-foreground/60 font-light leading-relaxed border-l border-white/10 pl-4">
                            {item.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Certs & Professional Membership Card */}
          <div className="lg:col-span-6 flex flex-col gap-12">
            
            {/* Certifications */}
            <div>
              <h3 className="text-sm font-mono tracking-widest text-accent-primary/60 uppercase mb-8 flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-accent-primary" /> Technical Certifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.map((cert, idx) => (
                  <FlippingCertCard key={idx} cert={cert} />
                ))}
              </div>
            </div>

            {/* Membership */}
            {membership && (
              <div className="border-t border-white/5 pt-10">
                <h3 className="text-sm font-mono tracking-widest text-accent-primary/60 uppercase mb-8 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-accent-primary" /> Professional Guild
                </h3>
                <SaeMembershipCard membership={membership} />
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

