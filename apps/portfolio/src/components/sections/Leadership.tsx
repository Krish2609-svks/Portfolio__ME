"use client";

import { motion } from "framer-motion";

export interface LeadershipItem {
  id: string;
  role: string;
  organization: string;
  start_date: string;
  end_date?: string | null;
  description: string;
  display_order: number;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string | null;
  display_order: number;
}

interface LeadershipProps {
  leadershipItems?: LeadershipItem[];
  certifications?: CertificationItem[];
}

const defaultActivities: LeadershipItem[] = [
  {
    id: "1",
    role: "Chief Engineer",
    organization: "SAE Aero Design Team",
    start_date: "2023-09-01",
    description: "Lead a team of students in the complete design cycle of an RC cargo aircraft, from conceptual sizing to manufacturing and test flights.",
    display_order: 1
  }
];

const defaultCertifications: CertificationItem[] = [
  {
    id: "1",
    name: "SOLIDWORKS CAD Design Associate",
    issuer: "Dassault Systèmes",
    date: "2024-10-01",
    display_order: 1
  }
];

export default function Leadership({ 
  leadershipItems = defaultActivities, 
  certifications = defaultCertifications 
}: LeadershipProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  };

  const displayLeadership = leadershipItems && leadershipItems.length > 0 ? leadershipItems : defaultActivities;
  const displayCertifications = certifications && certifications.length > 0 ? certifications : defaultCertifications;

  return (
    <section id="leadership" className="relative w-full bg-background-secondary py-40 px-6 lg:px-20 overflow-hidden z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-highlight mb-6 uppercase tracking-tighter">
            Leadership & <span className="text-accent-secondary">Activities</span>
          </h2>
          <div className="w-24 h-1 bg-accent-primary" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Leadership */}
          <div className="flex flex-col gap-12">
            <h3 className="text-2xl font-bold text-accent-secondary font-mono tracking-widest uppercase flex items-center gap-4">
              <span className="w-8 h-px bg-accent-secondary" /> Activities
            </h3>
            
            <div className="flex flex-col gap-8">
              {displayLeadership.map((act, i) => (
                <motion.div 
                  key={act.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="glass-panel p-8 rounded-2xl border-l-4 border-l-accent-primary group hover:bg-white/5 transition-colors"
                >
                  <span className="text-accent-primary font-mono text-sm tracking-widest">
                    {formatDate(act.start_date)} - {act.end_date ? formatDate(act.end_date) : 'Present'}
                  </span>
                  <h4 className="text-2xl font-bold text-highlight mt-2">{act.role}</h4>
                  <span className="text-foreground/60 uppercase tracking-widest text-sm block mt-1">{act.organization}</span>
                  <div className="text-foreground/80 font-light mt-4 leading-relaxed whitespace-pre-line">{act.description}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications Timeline */}
          <div className="flex flex-col gap-12">
            <h3 className="text-2xl font-bold text-accent-primary font-mono tracking-widest uppercase flex items-center gap-4">
              <span className="w-8 h-px bg-accent-primary" /> Certifications
            </h3>
            
            <div className="relative border-l border-white/10 ml-4 flex flex-col gap-10 py-4">
              {displayCertifications.map((cert, i) => (
                <motion.div 
                  key={cert.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="relative pl-8"
                >
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_10px_#00E5FF]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-accent-secondary font-mono text-xs tracking-widest">{formatDate(cert.date)}</span>
                    <h4 className="text-lg font-bold text-highlight">
                      {cert.url ? (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-primary transition-colors">
                          {cert.name}
                        </a>
                      ) : (
                        cert.name
                      )}
                    </h4>
                    <p className="text-foreground/60 text-sm">{cert.issuer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
