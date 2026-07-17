import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FolderKanban, Scroll, MessageSquare, Award } from "lucide-react";

export default async function Home() {
  let projectsCount = 0;
  let certificationsCount = 0;
  let unreadMessagesCount = 0;
  let skillsCount = 0;
  
  try {
    projectsCount = await prisma.project.count();
    certificationsCount = await prisma.certification.count();
    unreadMessagesCount = await prisma.contactMessage.count({ where: { isRead: false } });
    skillsCount = await prisma.skill.count();
  } catch (err) {
    // Database might not be initialized yet
  }

  const stats = [
    { label: "Total Projects", value: projectsCount, icon: FolderKanban, color: "text-blue-500" },
    { label: "Certifications", value: certificationsCount, icon: Scroll, color: "text-green-500" },
    { label: "Unread Messages", value: unreadMessagesCount, icon: MessageSquare, color: "text-yellow-500" },
    { label: "Technical Skills", value: skillsCount, icon: Award, color: "text-purple-500" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-xs text-zinc-500 mt-1 font-mono">// System Metrics Dashboard</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white font-mono">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-zinc-900 border border-zinc-800 ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white font-mono uppercase tracking-wider">// Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/projects" className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl group transition-all">
              <Plus className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Add Project</span>
            </Link>
            <Link href="/certifications" className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl group transition-all">
              <Plus className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Add Certificate</span>
            </Link>
            <Link href="/skills" className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl group transition-all">
              <Plus className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Manage Skills</span>
            </Link>
            <Link href="/media" className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl group transition-all">
              <Plus className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Upload Media</span>
            </Link>
          </div>
        </div>

        {/* Sync Info */}
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white font-mono uppercase tracking-wider">// Publishing Pipeline</h2>
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-400 text-sm leading-relaxed space-y-3 font-light">
            <p>
              Your portfolio leverages a high-performance **static JSON database** for fast client loading and 100+ Lighthouse scoring.
            </p>
            <p>
              When you perform edits inside the admin panel, they are saved to your PostgreSQL database. To push these updates live to your portfolio, click the **"Publish Changes"** button in the sidebar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
