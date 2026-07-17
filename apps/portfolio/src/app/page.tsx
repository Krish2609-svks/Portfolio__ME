import EngineeringBackground from "@/components/canvas/EngineeringBackground";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Philosophy from "@/components/sections/Philosophy";
import Skills from "@/components/sections/Skills";
import DesignProcess from "@/components/sections/DesignProcess";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Leadership from "@/components/sections/Leadership";
import Achievements from "@/components/sections/Achievements";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contact";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch singleton settings
  const { data: settings } = await supabase
    .from('portfolio_settings')
    .select('*')
    .maybeSingle();

  // Fetch all lists concurrently
  const [
    { data: skills },
    { data: experience },
    { data: education },
    { data: leadership },
    { data: achievements },
    { data: certifications },
    { data: gallery }
  ] = await Promise.all([
    supabase.from('skills').select('*').eq('published', true).order('display_order', { ascending: true }),
    supabase.from('experience').select('*').eq('published', true).order('display_order', { ascending: true }),
    supabase.from('education').select('*').eq('published', true).order('display_order', { ascending: true }),
    supabase.from('leadership').select('*').eq('published', true).order('display_order', { ascending: true }),
    supabase.from('achievements').select('*').eq('published', true).order('display_order', { ascending: true }),
    supabase.from('certifications').select('*').eq('published', true).order('display_order', { ascending: true }),
    supabase.from('gallery').select('*').eq('published', true).order('display_order', { ascending: true })
  ]);

  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-accent-primary selection:text-background overflow-x-hidden">
      <EngineeringBackground />
      <Hero 
        title={settings?.hero_title}
        subtitle={settings?.hero_subtitle}
        description={settings?.hero_description}
        resumeUrl={settings?.hero_resume_url}
      />
      <About 
        content={settings?.about_content}
        imageUrl={settings?.about_image_url}
      />
      <Philosophy />
      
      {/* Dynamic DB Sections */}
      <Skills skills={skills || []} />
      <Experience items={experience || []} />
      <Education items={education || []} />
      <Leadership leadershipItems={leadership || []} certifications={certifications || []} />
      <Achievements items={achievements || []} />
      
      <DesignProcess />
      <Projects />
      
      <Gallery items={gallery || []} />
      <Contact 
        email={settings?.contact_email}
        linkedin={settings?.contact_linkedin}
        github={settings?.contact_github}
        location={settings?.contact_location}
        availability={settings?.contact_availability}
      />
    </main>
  );
}
