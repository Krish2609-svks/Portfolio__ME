"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Image as ImageIcon, 
  MessageSquare, 
  Settings, 
  LogOut,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Users,
  Trophy,
  Scroll,
  Images,
  PenTool,
  Sparkles,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Media Library", href: "/media", icon: ImageIcon },
  { name: "Experience", href: "/experience", icon: Briefcase },
  { name: "Education", href: "/education", icon: GraduationCap },
  { name: "Leadership", href: "/leadership", icon: Users },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Certifications", href: "/certifications", icon: Scroll },
  { name: "Skills", href: "/skills", icon: Award },
  { name: "Design Process", href: "/design-process", icon: PenTool },
  { name: "Gallery", href: "/gallery", icon: Images },
  { name: "Inbox", href: "/inbox", icon: MessageSquare },
  { name: "Audit Logs", href: "/audit", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishStatus(null);
    try {
      const res = await fetch("/api/publish", { method: "POST" });
      if (res.ok) {
        setPublishStatus("Success!");
        setTimeout(() => setPublishStatus(null), 3000);
      } else {
        setPublishStatus("Error");
      }
    } catch {
      setPublishStatus("Failed");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-64 bg-zinc-950 border-r border-zinc-800 text-zinc-300">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white tracking-tight">CMS<span className="text-blue-500">.Admin</span></h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              )}
            >
              <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-blue-500" : "text-zinc-500")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Control Actions & Signout at the bottom */}
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <button 
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex items-center w-full px-3 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPublishing ? (
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-3 h-5 w-5" />
          )}
          {publishStatus ? publishStatus : isPublishing ? "Publishing..." : "Publish Changes"}
        </button>

        <button 
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-zinc-400 rounded-md hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-zinc-500" />
          Sign out
        </button>
      </div>
    </div>
  );
}
