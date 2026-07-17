import portfolioData from "@/config/portfolioData.json";

export interface Settings {
  name: string;
  title: string;
  roles: string[];
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  resume_url: string;
  email: string;
  linkedin: string;
  github: string;
  location: string;
  availability: string;
  about_content: string;
  about_image_url: string | null;
  philosophy_quote: string;
  philosophy_highlight: string;
  philosophy_subtext: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ProjectGalleryItem {
  type: "image" | "video";
  url: string;
  caption?: string;
  title?: string;
  category?: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  overview: string;
  challenge?: string;
  research?: string;
  cad?: string;
  electronics?: string;
  prototype?: string;
  testing?: string;
  result?: string;
  design?: string;
  manufacturing?: string;
  assembly?: string;
  github?: string;
  status?: string;
  leaf_structure?: string;
  topology_optimization?: string;
  ntop_workflow?: string;
  "3d_printing"?: string;
  expected_results?: string;
  isGalleryOnly?: boolean;
  gallery: ProjectGalleryItem[];
}

export interface ProcessStep {
  step: string;
  description: string;
}

export interface LeadershipItem {
  role: string;
  description: string;
}

export interface Certification {
  title: string;
  issuer: string;
  credential_id: string;
  url: string;
}

export interface ProfessionalMembership {
  organization: string;
  chapter: string;
  role: string;
  member_id: string;
  valid_thru: string;
}

export interface PortfolioData {
  settings: Settings;
  stats: Stat[];
  capabilities: Record<string, string[]>;
  projects: Project[];
  engineering_process: ProcessStep[];
  leadership: LeadershipItem[];
  certifications: Certification[];
  professional_membership: ProfessionalMembership;
}

export function getPortfolioData(): PortfolioData {
  return portfolioData as unknown as PortfolioData;
}
