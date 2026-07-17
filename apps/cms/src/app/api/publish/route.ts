import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const PORTFOLIO_JSON_PATH = path.resolve(
  process.cwd(),
  "../portfolio/src/config/portfolioData.json"
);

// Helper to seed empty database tables from the static portfolio JSON
async function seedDbFromStaticJson() {
  if (!fs.existsSync(PORTFOLIO_JSON_PATH)) return;

  const raw = fs.readFileSync(PORTFOLIO_JSON_PATH, "utf8");
  const data = JSON.parse(raw);

  const { settings, stats, experience, education, capabilities, projects, leadership, certifications, professional_membership } = data;

  // 1. Profile / Hero / Settings
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Nambi Krishnan M",
      title: "Mechanical Engineering Student",
      subtitle: settings.hero_subtitle || "CAD Designer & Prototyper",
      shortBio: settings.hero_description || "Specializing in rapid product development.",
      longBio: settings.about_content || "Passionate about mechanical design and mechatronics.",
      location: settings.location || "Tamil Nadu, India",
      email: settings.email || "nambikrishnan2@gmail.com",
      phone: "+91 94883 23412",
      linkedin: settings.linkedin || "",
      github: settings.github || "",
      portfolioUrl: "https://nambikrishnan.dev",
      profilePicture: "/images/nambi-avatar.jpg",
      coverImage: "/images/blueprint-banner.jpg",
      model3D: "gearbox",
    },
  });

  await prisma.hero.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heading: settings.hero_title || "NAMBI KRISHNAN",
      subheading: settings.hero_subtitle || "Mechanical Design Engineer",
      bgType: "model",
      model3D: "gearbox",
      animSpeed: 1.0,
      videoUrl: "",
      imageUrl: "",
      ctaText: "Explore Projects",
      ctaUrl: "#projects",
    },
  });

  await prisma.about.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      introduction: settings.about_content || "Design Engineer driven by manufacturing constraints.",
      education: JSON.stringify(education || []),
      careerObj: "Seeking full-time Mechanical Design Engineer roles.",
      interests: JSON.stringify(["CAD/CAM", "Rapid Prototyping", "Mechatronics", "Automotive Design"]),
      quickFacts: JSON.stringify(["SolidWorks Associate Certified", "Planetary Gearbox Specialist", "Additive Manufacturing Expert"]),
      stats: JSON.stringify(stats || []),
    },
  });

  // 2. Capabilities / Skills
  const categoryCount = await prisma.skillCategory.count();
  if (categoryCount === 0 && capabilities) {
    for (let i = 0; i < capabilities.length; i++) {
      const cap = capabilities[i];
      const cat = await prisma.skillCategory.create({
        data: {
          name: cap.category,
          displayOrder: i,
        },
      });

      for (const skillName of cap.skills) {
        await prisma.skill.create({
          data: {
            name: skillName,
            level: 85,
            learningBadge: false,
            icon: "Settings",
            description: `Expertise in ${skillName}`,
            categoryId: cat.id,
          },
        });
      }
    }
  }

  // 3. Projects
  const projectCount = await prisma.project.count();
  if (projectCount === 0 && projects) {
    for (let i = 0; i < projects.length; i++) {
      const proj = projects[i];
      if (proj.isGalleryOnly) continue; // Skip static image gallery placeholders
      
      const createdProj = await prisma.project.create({
        data: {
          title: proj.title,
          slug: proj.id,
          category: proj.category,
          status: "published",
          featured: true,
          displayOrder: i,
          thumbnail: proj.thumbnail || "/placeholder.jpg",
          heroImage: proj.heroImage || "/placeholder-hero.jpg",
          videoUrl: proj.videoUrl || "",
          github: proj.github || "",
          liveDemo: proj.liveDemo || "",
          youtubeUrl: proj.youtubeUrl || "",
          projectPdf: proj.projectPdf || "",
          presentationPdf: proj.presentationPdf || "",
          overview: proj.overview || "",
          challenge: proj.challenge || "",
          research: proj.research || "",
          cad: proj.cad || "",
          electronics: proj.electronics || "",
          prototype: proj.prototype || "",
          testing: proj.testing || "",
          result: proj.result || "",
          technologies: "SolidWorks, KeyShot, 3D Printing",
          software: "SolidWorks, Fusion 360",
          hardware: "FDM 3D Printers, CNC",
          tags: proj.category,
        },
      });

      if (proj.gallery) {
        for (const item of proj.gallery) {
          await prisma.projectGallery.create({
            data: {
              url: item.url,
              caption: item.caption || "",
              projectId: createdProj.id,
            },
          });
        }
      }
    }
  }

  // 4. Certifications
  const certCount = await prisma.certification.count();
  if (certCount === 0 && certifications) {
    for (const cert of certifications) {
      await prisma.certification.create({
        data: {
          title: cert.title,
          issuer: cert.issuer,
          issueDate: new Date(),
          credentialId: cert.credential_id,
          imageUrl: "/placeholder-cert.jpg",
          verificationUrl: cert.url || "",
          featured: true,
        },
      });
    }
  }

  // 5. Leadership
  const leadCount = await prisma.leadership.count();
  if (leadCount === 0 && leadership) {
    for (const item of leadership) {
      await prisma.leadership.create({
        data: {
          role: item.role,
          organization: "Student Council / Campus Clubs",
          description: item.description,
          startDate: new Date(),
          achievements: JSON.stringify([item.description]),
        },
      });
    }
  }

  // 6. Experience / Timeline
  const expCount = await prisma.experience.count();
  if (expCount === 0 && experience) {
    for (const exp of experience) {
      await prisma.experience.create({
        data: {
          company: exp.company || "Mechanical Lab",
          role: exp.role || "Design Intern",
          description: exp.description || "",
          startDate: new Date(exp.start_date || Date.now()),
          endDate: exp.end_date ? new Date(exp.end_date) : null,
          skills: "SolidWorks, GD&T",
        },
      });
    }
  }

  // 7. Timeline Events
  const timelineCount = await prisma.timelineEvent.count();
  if (timelineCount === 0) {
    const timelineData = [
      { date: "2021", title: "Entered Mechanical Engineering", description: "Began academic study specializing in design tools and kinematic systems." },
      { date: "2022", title: "CAD / Modeling Specialization", description: "Mastered SolidWorks parametric modeling and structural drawings." },
      { date: "2023", title: "Mechatronics Integration", description: "Expanded research to electrical actuators, Arduino micro-controllers, and sensor arrays." }
    ];
    for (let i = 0; i < timelineData.length; i++) {
      await prisma.timelineEvent.create({
        data: {
          ...timelineData[i],
          icon: "Calendar",
          displayOrder: i,
        },
      });
    }
  }

  // 8. Professional Membership
  const memberSettings = await prisma.contactSettings.count();
  if (memberSettings === 0) {
    await prisma.contactSettings.create({
      data: {
        id: "singleton",
        email: settings.email || "nambikrishnan2@gmail.com",
        phone: "+91 94883 23412",
        linkedin: settings.linkedin || "",
        github: settings.github || "",
        instagram: "",
        location: settings.location || "Tamil Nadu, India",
      },
    });
  }

  // 9. SEO & Website Settings
  const seoSettings = await prisma.sEOSettings.count();
  if (seoSettings === 0) {
    await prisma.sEOSettings.create({
      data: {
        id: "singleton",
        metaTitle: "Nambi Krishnan M | Mechanical Design Portfolio",
        description: "CAD modeling, finite element stress analysis, rapid prototyping, and planetary gearbox design portfolio.",
        keywords: "mechanical, cad, solidworks, engineering, gearbox, prototyping",
        ogImage: "/images/og-share.jpg",
        twitterCard: "summary_large_image",
        robots: "index, follow",
        canonicalUrl: "https://nambikrishnan.dev",
      },
    });
  }

  const webSettings = await prisma.websiteSettings.count();
  if (webSettings === 0) {
    await prisma.websiteSettings.create({
      data: {
        id: "singleton",
        logo: "NK",
        favicon: "/favicon.ico",
        theme: "dark",
        accentColor: "#fafafa",
        fonts: "Inter",
        loaderAnim: "NK",
        cursorStyle: "default",
        sections: JSON.stringify({
          hero: true,
          about: true,
          capabilities: true,
          projects: true,
          timeline: true,
          leadership: true,
          contact: true,
        }),
        maintMode: false,
      },
    });
  }
}

export async function POST() {
  try {
    // Seed initial table contents if empty
    const profileCount = await prisma.profile.count();
    if (profileCount === 0) {
      await seedDbFromStaticJson();
    }

    // Read full database state
    const profile = await prisma.profile.findUnique({ where: { id: "singleton" } });
    const hero = await prisma.hero.findUnique({ where: { id: "singleton" } });
    const about = await prisma.about.findUnique({ where: { id: "singleton" } });
    const categories = await prisma.skillCategory.findMany({
      include: { skills: true },
      orderBy: { displayOrder: "asc" },
    });
    const projects = await prisma.project.findMany({
      include: { gallery: true },
      orderBy: { displayOrder: "asc" },
    });
    const certifications = await prisma.certification.findMany({
      orderBy: { issueDate: "desc" },
    });
    const leadership = await prisma.leadership.findMany({
      orderBy: { startDate: "desc" },
    });
    const experience = await prisma.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    const seo = await prisma.sEOSettings.findUnique({ where: { id: "singleton" } });
    
    // Structure data matching apps/portfolio/src/config/portfolioData.json
    const formattedData = {
      settings: {
        hero_title: hero?.heading || "NAMBI KRISHNAN",
        hero_subtitle: hero?.subheading || "Mechanical Design Engineer",
        roles: [profile?.title || "Mechanical Engineering Student", "CAD Designer", "Product Prototyper"],
        hero_description: profile?.shortBio || "",
        resume_url: "/Nambi_Krishnan_Resume.pdf",
        about_content: profile?.longBio || "",
        philosophy_quote: "I don't just create CAD models.",
        philosophy_highlight: "I design products that solve real engineering problems.",
        philosophy_subtext: "Driven by manufacturing constraints, kinematics, and structural efficiency.",
        email: profile?.email || "nambikrishnan2@gmail.com",
        linkedin: profile?.linkedin || "",
        github: profile?.github || "",
        location: profile?.location || "Tamil Nadu, India",
        availability: "Open to Internship & Entry-level Opportunities"
      },
      stats: about ? JSON.parse(about.stats) : [
        { value: 12, label: "Mechanical Projects" },
        { value: 500, label: "CAD Hours" },
        { value: 95, label: "FEA Accuracy" }
      ],
      experience: experience.map((exp) => ({
        company: exp.company,
        role: exp.role,
        start_date: exp.startDate.toISOString().split("T")[0],
        end_date: exp.endDate ? exp.endDate.toISOString().split("T")[0] : null,
        description: exp.description
      })),
      education: about ? JSON.parse(about.education) : [
        {
          degree: "B.Tech in Mechanical Engineering",
          institution: "Kalasalingam Academy of Research and Education",
          start_date: "2021-08-01",
          end_date: "2025-05-01",
          description: "Focus on machine design, FEA methods, robotics, and composite layout."
        }
      ],
      capabilities: categories.map((cat) => ({
        category: cat.name,
        skills: cat.skills.map((s) => s.name)
      })),
      projects: projects.map((proj) => ({
        id: proj.slug,
        title: proj.title,
        category: proj.category,
        thumbnail: proj.thumbnail,
        heroImage: proj.heroImage,
        videoUrl: proj.videoUrl || undefined,
        github: proj.github || undefined,
        liveDemo: proj.liveDemo || undefined,
        overview: proj.overview,
        challenge: proj.challenge || undefined,
        research: proj.research || undefined,
        cad: proj.cad || undefined,
        electronics: proj.electronics || undefined,
        prototype: proj.prototype || undefined,
        testing: proj.testing || undefined,
        result: proj.result || undefined,
        gallery: proj.gallery.map((g) => ({
          url: g.url,
          caption: g.caption || undefined
        }))
      })),
      leadership: leadership.map((l) => ({
        role: l.role,
        description: l.description
      })),
      certifications: certifications.map((c) => ({
        title: c.title,
        issuer: c.issuer,
        credential_id: c.credentialId,
        url: c.verificationUrl
      })),
      professional_membership: {
        organization: "SAE INDIA",
        chapter: "Kalasalingam University",
        role: "Student Member",
        member_id: "SAE-ST-2024-902",
        valid_thru: "12/2027"
      }
    };

    // Ensure directory exists before writing
    const dir = path.dirname(PORTFOLIO_JSON_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write to client file
    fs.writeFileSync(PORTFOLIO_JSON_PATH, JSON.stringify(formattedData, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: "Portfolio data compiled and published successfully.",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
