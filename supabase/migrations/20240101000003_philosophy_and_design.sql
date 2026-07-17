-- Phase B: Add Philosophy and Design Process sections

-- 1. Add Philosophy fields to portfolio_settings
ALTER TABLE public.portfolio_settings
ADD COLUMN philosophy_quote TEXT,
ADD COLUMN philosophy_paragraph_1 TEXT,
ADD COLUMN philosophy_paragraph_2 TEXT;

-- 2. Create Design Process table
CREATE TABLE public.design_process (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.design_process ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can read published design process" ON public.design_process FOR SELECT USING (published = true);
CREATE POLICY "Admins have full access to design process" ON public.design_process FOR ALL USING (auth.role() = 'authenticated');

-- Trigger
CREATE TRIGGER update_design_process_updated_at BEFORE UPDATE ON public.design_process FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
