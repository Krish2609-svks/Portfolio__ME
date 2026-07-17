import EngineeringBackground from "@/components/canvas/EngineeringBackground";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Philosophy from "@/components/sections/Philosophy";
import Capabilities from "@/components/sections/Capabilities";
import DesignProcess from "@/components/sections/DesignProcess";
import Projects from "@/components/sections/Projects";
import Leadership from "@/components/sections/Leadership";
import Contact from "@/components/sections/Contact";
import { getPortfolioData } from "@/utils/getData";

export default async function Home() {
  const data = getPortfolioData();
  const { settings, stats } = data;

  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-accent-primary selection:text-background overflow-x-hidden">
      {/* Blueprint particle background */}
      <EngineeringBackground />

      {/* Hero Section */}
      <Hero 
        title={settings.hero_title}
        subtitle={settings.hero_subtitle}
        roles={settings.roles}
        description={settings.hero_description}
        resumeUrl={settings.resume_url}
      />

      {/* Philosophy Section */}
      <Philosophy 
        quote={settings.philosophy_quote}
        highlight={settings.philosophy_highlight}
        subtext={settings.philosophy_subtext}
      />

      {/* About Profile Section */}
      <About 
        content={settings.about_content}
        stats={stats}
      />
      
      {/* Capabilities Section */}
      <Capabilities />
      
      {/* Selected Case Studies */}
      <Projects />

      {/* Engineering Timeline Process */}
      <DesignProcess />
      
      {/* Leadership & Activities */}
      <Leadership />
      
      {/* Contact Section */}
      <Contact 
        email={settings.email}
        linkedin={settings.linkedin}
        github={settings.github}
        location={settings.location}
        availability={settings.availability}
        resumeUrl={settings.resume_url}
      />

      {/* Minimal Footer */}
      <footer className="relative w-full py-12 px-6 lg:px-20 border-t border-white/5 bg-background z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 text-center md:text-left">
            Designed & Developed by Nambi Krishnan. &copy; {new Date().getFullYear()}
          </p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 text-center md:text-right">
            Built using Next.js // React Three Fiber // GSAP // Tailwind CSS
          </p>
        </div>
      </footer>
    </main>
  );
}

