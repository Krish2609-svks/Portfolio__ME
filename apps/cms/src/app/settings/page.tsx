"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";

interface Settings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_resume_url: string;
  about_content: string;
  about_image_url: string;
  contact_email: string;
  contact_linkedin: string;
  contact_github: string;
  contact_location: string;
  contact_availability: string;
  seo_site_title: string;
  seo_site_description: string;
  seo_og_image_url: string;
  seo_twitter_handle: string;
  philosophy_quote: string;
  philosophy_paragraph_1: string;
  philosophy_paragraph_2: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('*')
      .maybeSingle();
    
    if (data) {
      setSettings(data);
    } else {
      // Auto-initialize if missing
      const defaultSettings = {
        id: '00000000-0000-0000-0000-000000000000',
        hero_title: 'System Online // Initiating Sequence',
        hero_subtitle: 'Nambi Krishnan',
        hero_description: 'Mechanical Engineering Student',
      };
      
      const { data: insertedData, error: insertError } = await supabase
        .from('portfolio_settings')
        .insert([defaultSettings])
        .select()
        .single();
        
      if (insertedData) {
        setSettings(insertedData);
      } else if (insertError) {
        console.error("Error creating default settings:", insertError);
      }
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('portfolio_settings')
      .update(settings)
      .eq('id', settings.id);
      
    if (error) {
      alert('Error saving settings');
    }
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  if (!settings) {
    return <div className="h-full flex items-center justify-center text-zinc-500">No settings found in DB.</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSave} className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex-none flex justify-between items-center p-8 pb-4 border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Portfolio Settings</h1>
            <p className="text-sm text-zinc-400">Manage global settings, hero text, and SEO configuration.</p>
          </div>
          <button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          
          {/* Hero Section */}
          <section className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-sm max-w-4xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Hero Section
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
                <input type="text" name="hero_title" value={settings.hero_title || ""} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Subtitle (Your Name)</label>
                <input type="text" name="hero_subtitle" value={settings.hero_subtitle || ""} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Resume URL (PDF Link)</label>
                <input type="text" name="hero_resume_url" value={settings.hero_resume_url || ""} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                <textarea name="hero_description" value={settings.hero_description || ""} onChange={handleChange} rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-sm max-w-4xl">
            <h2 className="text-xl font-bold text-white mb-6">About Section</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">About Image URL</label>
                <input type="text" name="about_image_url" value={settings.about_image_url || ""} onChange={handleChange} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">About Content</label>
                <textarea name="about_content" value={settings.about_content || ""} onChange={handleChange} rows={6} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </section>

          {/* Philosophy Section */}
          <section className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-sm max-w-4xl">
            <h2 className="text-xl font-bold text-white mb-6">Philosophy Section</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Quote</label>
                <textarea name="philosophy_quote" value={settings.philosophy_quote || ""} onChange={handleChange} rows={2} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Paragraph 1</label>
                <textarea name="philosophy_paragraph_1" value={settings.philosophy_paragraph_1 || ""} onChange={handleChange} rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Paragraph 2</label>
                <textarea name="philosophy_paragraph_2" value={settings.philosophy_paragraph_2 || ""} onChange={handleChange} rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </section>

          {/* Contact Details */}
          <section className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-sm max-w-4xl">
            <h2 className="text-xl font-bold text-white mb-6">Contact & Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                <input type="email" name="contact_email" value={settings.contact_email || ""} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">LinkedIn URL</label>
                <input type="text" name="contact_linkedin" value={settings.contact_linkedin || ""} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">GitHub URL</label>
                <input type="text" name="contact_github" value={settings.contact_github || ""} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Location</label>
                <input type="text" name="contact_location" value={settings.contact_location || ""} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Availability Status</label>
                <input type="text" name="contact_availability" value={settings.contact_availability || ""} onChange={handleChange} placeholder="e.g. Open to full-time roles" className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </section>

          {/* SEO Details */}
          <section className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-sm max-w-4xl">
            <h2 className="text-xl font-bold text-white mb-6">SEO Configuration</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Site Title</label>
                  <input type="text" name="seo_site_title" value={settings.seo_site_title || ""} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Twitter Handle</label>
                  <input type="text" name="seo_twitter_handle" value={settings.seo_twitter_handle || ""} onChange={handleChange} placeholder="@username" className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Site Description</label>
                <textarea name="seo_site_description" value={settings.seo_site_description || ""} onChange={handleChange} rows={2} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Open Graph Image URL</label>
                <input type="text" name="seo_og_image_url" value={settings.seo_og_image_url || ""} onChange={handleChange} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </section>
          
        </div>
      </form>
    </div>
  );
}
