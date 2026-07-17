"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Briefcase, MapPin, Loader2, CheckCircle, GitBranch, FileText } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WireframeBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      {/* TorusKnot represents complex CAD geometry paths */}
      <torusKnotGeometry args={[1.6, 0.4, 100, 12, 3, 5]} />
      <meshBasicMaterial
        color="#fafafa"
        wireframe
        transparent
        opacity={0.06}
      />
    </mesh>
  );
}

interface ContactProps {
  email?: string | null;
  linkedin?: string | null;
  github?: string | null;
  location?: string | null;
  availability?: string | null;
  resumeUrl?: string | null;
}

export default function Contact({
  email = "nambikrishnan2@gmail.com",
  linkedin = "https://linkedin.com/in/nambi-krishnan-m-156269310",
  github = "https://github.com/nambikrishnanm",
  location = "Tamil Nadu, India",
  availability = "Open to Internship & Entry-level Opportunities",
  resumeUrl = "/Nambi_Krishnan_Resume.pdf"
}: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!turnstileToken) {
      setError("Please complete the CAPTCHA.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      honeypot: formData.get("bot_field"),
      turnstileToken,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to send message. Please try again.");
      } else {
        setIsSuccess(true);
      }
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative w-full bg-background py-40 px-6 lg:px-20 overflow-hidden z-10 border-t border-white/5">
      
      {/* 3D Slowly Rotating Wireframe Mechanical Object Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <WireframeBackground />
        </Canvas>
      </div>

      <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-primary/5 via-background to-background pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16 justify-between items-start">
        
        {/* Contact Info column */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl flex-1"
        >
          <span className="font-mono text-xs text-accent-primary/40 uppercase tracking-[0.3em] block mb-2">// Transmission Input</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-highlight mb-8 uppercase tracking-tighter leading-none">
            Let&apos;s Build <br />
            <span className="text-accent-primary">Something Meaningful.</span>
          </h2>
          <p className="text-lg text-foreground/60 font-light mb-12 whitespace-pre-line leading-relaxed">
            {availability}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-highlight hover:text-accent-primary transition-colors bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl">
                <Mail className="w-4 h-4 text-accent-primary" /> Email
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-highlight hover:text-accent-primary transition-colors bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl">
                <Briefcase className="w-4 h-4 text-accent-primary" /> LinkedIn
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-highlight hover:text-accent-primary transition-colors bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl">
                <GitBranch className="w-4 h-4 text-accent-primary" /> GitHub
              </a>
            )}
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-highlight hover:text-accent-primary transition-colors bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl">
                <FileText className="w-4 h-4 text-accent-primary" /> Resume
              </a>
            )}
          </div>

          {location && (
            <div className="flex items-center gap-3 text-foreground/40 font-mono text-xs uppercase tracking-widest">
              <MapPin className="w-4 h-4 text-accent-primary" /> {location}
            </div>
          )}
        </motion.div>

        {/* Contact Form Column */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[500px] glass-panel p-8 md:p-10 rounded-3xl z-10"
        >
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-highlight uppercase tracking-wider font-mono">Transmission Complete</h3>
              <p className="text-sm text-foreground/50 leading-relaxed font-light">
                Your message has been received successfully.
                <br />
                I will review it and reply as soon as possible.
              </p>
              <button onClick={() => setIsSuccess(false)} className="mt-8 px-6 py-3 border border-white/10 hover:border-accent-primary rounded-xl font-mono text-xs uppercase tracking-widest transition-colors">
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Honeypot */}
              <div className="hidden">
                <input type="text" name="bot_field" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] text-foreground/45 ml-2 font-mono">Full Name *</label>
                <input id="name" name="name" type="text" required minLength={2} maxLength={100} className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-light" placeholder="John Doe" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-foreground/45 ml-2 font-mono">Email Address *</label>
                <input id="email" name="email" type="email" required className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-light" placeholder="john@company.com" />
              </div>

              <div className="flex gap-4 w-full">
                <div className="flex flex-col gap-2 w-1/2">
                  <label htmlFor="company" className="text-[10px] uppercase tracking-[0.2em] text-foreground/45 ml-2 font-mono">Company</label>
                  <input id="company" name="company" type="text" maxLength={100} className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-light" placeholder="Tesla" />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                  <label htmlFor="phone" className="text-[10px] uppercase tracking-[0.2em] text-foreground/45 ml-2 font-mono">Phone</label>
                  <input id="phone" name="phone" type="tel" maxLength={20} className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-light" placeholder="+1 234 567 8900" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-[10px] uppercase tracking-[0.2em] text-foreground/45 ml-2 font-mono">Subject *</label>
                <input id="subject" name="subject" type="text" required minLength={2} maxLength={150} className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-light" placeholder="Prototype Project Proposal" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] text-foreground/45 ml-2 font-mono">Message *</label>
                <textarea id="message" name="message" rows={3} required minLength={10} maxLength={5000} className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all resize-none font-light" placeholder="How can we collaborate?" />
              </div>
              
              <div className="flex justify-center my-1.5 scale-90">
                <Turnstile 
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                  onSuccess={(token) => setTurnstileToken(token)}
                  options={{ theme: "dark" }}
                />
              </div>

              {error && <div className="text-red-400 text-xs px-2 text-center font-mono">{error}</div>}
              
              <button disabled={isSubmitting || !turnstileToken} type="submit" className="w-full py-4 mt-1 bg-accent-primary text-background font-mono text-xs uppercase tracking-widest rounded-xl hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent-primary transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 font-bold">
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</>
                ) : (
                  "Initialize Transmission"
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

