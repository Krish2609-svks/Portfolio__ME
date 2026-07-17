"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export interface AchievementItem {
  id: string;
  title: string;
  issuer?: string | null;
  date: string;
  description: string;
  display_order: number;
}

interface AchievementsProps {
  items?: AchievementItem[];
}

const defaultAchievements: AchievementItem[] = [
  {
    id: "1",
    title: "Best Project Award",
    issuer: "National Engineering Symposium",
    date: "2024-05-15",
    description: "Awarded for the most innovative UAV cargo design out of 50 participating teams.",
    display_order: 1
  }
];

export default function Achievements({ items = defaultAchievements }: AchievementsProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  };

  const displayItems = items && items.length > 0 ? items : defaultAchievements;

  return (
    <section id="achievements" className="relative w-full bg-background py-40 px-6 lg:px-20 overflow-hidden z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-highlight mb-6 uppercase tracking-tighter">
            Notable <span className="text-accent-primary">Achievements</span>
          </h2>
          <div className="w-24 h-1 bg-accent-secondary" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((achievement, i) => (
            <motion.div 
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-panel p-8 rounded-2xl flex flex-col group hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
              
              <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center mb-6 text-accent-primary group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-6 h-6" />
              </div>

              <span className="text-accent-secondary font-mono text-xs tracking-widest mb-3 block">
                {formatDate(achievement.date)}
              </span>
              
              <h3 className="text-xl font-bold text-highlight mb-2 group-hover:text-white transition-colors">
                {achievement.title}
              </h3>
              
              {achievement.issuer && (
                <span className="text-foreground/60 text-sm uppercase tracking-wider mb-4 block">
                  {achievement.issuer}
                </span>
              )}
              
              <div className="text-foreground/80 font-light leading-relaxed whitespace-pre-line text-sm flex-1">
                {achievement.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
