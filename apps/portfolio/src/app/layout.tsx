import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollWrapper from "@/components/layout/SmoothScrollWrapper";
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/ui/Preloader";
import Navigation from "@/components/ui/Navigation";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: seo } = await supabase
    .from('seo_settings')
    .select('*')
    .single();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nambikrishnan.com";

  return {
    metadataBase: new URL(siteUrl),
    title: seo?.meta_title || "Nambi Krishnan M | Mechanical Engineering Student",
    description: seo?.meta_description || "Portfolio of Nambi Krishnan M, a Mechanical Engineering student specializing in CAD design, prototype development, UAV systems, additive manufacturing, and product engineering.",
    keywords: seo?.meta_keywords?.split(',').map((k: string) => k.trim()) || ["Mechanical Engineer", "CAD Designer", "Prototype Engineer", "SolidWorks", "UAV", "Product Design"],
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: seo?.meta_title || "Nambi Krishnan Portfolio",
      title: seo?.og_title || seo?.meta_title || "Nambi Krishnan M | Mechanical Engineering Portfolio",
      description: seo?.og_description || seo?.meta_description || "Mechanical Engineering student specializing in CAD design, prototype development, and product engineering.",
      images: [
        {
          url: seo?.og_image_url || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: seo?.meta_title || "Nambi Krishnan M - Mechanical Engineering Portfolio",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitter_title || seo?.og_title || seo?.meta_title || "Nambi Krishnan M | Mechanical Engineer",
      description: seo?.twitter_description || seo?.og_description || seo?.meta_description || "Mechanical Engineering student specializing in CAD design and prototype development.",
      images: [seo?.twitter_image_url || seo?.og_image_url || "/og-image.jpg"],
    },
    manifest: "/manifest.json",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: contact } = await supabase.from('portfolio_settings').select('contact_linkedin').single();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nambi Krishnan M",
    "jobTitle": "Mechanical Engineering Student",
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "AAA College of Engineering & Technology, Anna University"
    },
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://nambikrishnan.com",
    "sameAs": contact?.contact_linkedin ? [contact.contact_linkedin] : ["https://linkedin.com/in/nambi-krishnan-m-156269310"]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-accent-primary selection:text-background no-scrollbar bg-background text-foreground">
        <Preloader />
        <CustomCursor />
        <Navigation />
        <SmoothScrollWrapper>
          {children}
        </SmoothScrollWrapper>
      </body>
    </html>
  );
}
