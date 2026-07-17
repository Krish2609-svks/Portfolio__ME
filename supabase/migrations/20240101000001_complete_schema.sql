-- Phase A: Complete Database Schema

-- 1. Portfolio Settings (Singletons: Hero, About, SEO, Contact)
CREATE TABLE public.portfolio_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Hero Settings
  hero_title TEXT DEFAULT 'System Online // Initiating Sequence',
  hero_subtitle TEXT DEFAULT 'Nambi Krishnan',
  hero_description TEXT DEFAULT 'Mechanical Engineering Student',
  hero_resume_url TEXT,
  -- About Settings
  about_content TEXT,
  about_image_url TEXT,
  -- Contact Settings
  contact_email TEXT,
  contact_linkedin TEXT,
  contact_github TEXT,
  contact_location TEXT,
  contact_availability TEXT,
  -- SEO Settings
  seo_site_title TEXT,
  seo_site_description TEXT,
  seo_og_image_url TEXT,
  seo_twitter_handle TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert a default row for settings (since it's a singleton)
INSERT INTO public.portfolio_settings (id) VALUES ('00000000-0000-0000-0000-000000000000');

-- 2. Skills
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Experience
CREATE TABLE public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  current BOOLEAN DEFAULT false,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Education
CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Leadership
CREATE TABLE public.leadership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Achievements
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT,
  date TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Certifications
CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issuer TEXT,
  date TEXT,
  url TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Gallery
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can read portfolio settings" ON public.portfolio_settings FOR SELECT USING (true);
CREATE POLICY "Public can read published skills" ON public.skills FOR SELECT USING (published = true);
CREATE POLICY "Public can read published experience" ON public.experience FOR SELECT USING (published = true);
CREATE POLICY "Public can read published education" ON public.education FOR SELECT USING (published = true);
CREATE POLICY "Public can read published leadership" ON public.leadership FOR SELECT USING (published = true);
CREATE POLICY "Public can read published achievements" ON public.achievements FOR SELECT USING (published = true);
CREATE POLICY "Public can read published certifications" ON public.certifications FOR SELECT USING (published = true);
CREATE POLICY "Public can read published gallery" ON public.gallery FOR SELECT USING (published = true);

-- Admin All Access Policies
CREATE POLICY "Admins have full access to portfolio settings" ON public.portfolio_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to experience" ON public.experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to education" ON public.education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to leadership" ON public.leadership FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to achievements" ON public.achievements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to certifications" ON public.certifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to gallery" ON public.gallery FOR ALL USING (auth.role() = 'authenticated');

-- Triggers for updated_at
CREATE TRIGGER update_portfolio_settings_updated_at BEFORE UPDATE ON public.portfolio_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON public.experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leadership_updated_at BEFORE UPDATE ON public.leadership FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage Configuration
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');
