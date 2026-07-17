"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Briefcase, MapPin, Loader2, CheckCircle, GitBranch } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

interface ContactProps {
  email?: string | null;
  linkedin?: string | null;
  github?: string | null;
  location?: string | null;
  availability?: string | null;
}

export default function Contact({
  email = "nambikrishnan2@gmail.com",
  linkedin = "https://linkedin.com/in/nambi-krishnan-m-156269310",
  github,
  location = "Sivakasi, Tamil Nadu",
  availability = "Currently seeking full-time Design Engineer roles in automotive, EV, or general mechanical industries. Open to collaborative innovation and hardware engineering projects."
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
      <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-primary/10 via-background to-background pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-16 justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-highlight mb-6 uppercase tracking-tighter">
            Initialize <span className="text-accent-secondary">Contact</span>
          </h2>
          <div className="w-24 h-1 bg-accent-primary mb-12" />
          <p className="text-xl text-foreground/60 font-light mb-12 whitespace-pre-line">
            {availability}
          </p>

          <div className="flex flex-col gap-6">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-4 text-foreground hover:text-accent-primary transition-colors group">
                <div className="w-12 h-12 glass rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  <Mail className="w-5 h-5 text-accent-primary" />
                </div>
                <span className="font-mono tracking-widest text-sm md:text-base">{email}</span>
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground hover:text-accent-primary transition-colors group">
                <div className="w-12 h-12 glass rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  <Briefcase className="w-5 h-5 text-accent-primary" />
                </div>
                <span className="font-mono tracking-widest text-sm md:text-base">LinkedIn Profile</span>
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground hover:text-accent-primary transition-colors group">
                <div className="w-12 h-12 glass rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  <GitBranch className="w-5 h-5 text-accent-primary" />
                </div>
                <span className="font-mono tracking-widest text-sm md:text-base">GitHub Profile</span>
              </a>
            )}
            {location && (
              <div className="flex items-center gap-4 text-foreground/60">
                <div className="w-12 h-12 glass rounded-full flex items-center justify-center border-white/5">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-mono tracking-widest text-sm md:text-base">{location}</span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full md:w-[500px] glass-panel p-8 md:p-10 rounded-3xl"
        >
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-highlight uppercase tracking-wider">Thank you for reaching out.</h3>
              <p className="text-foreground/70 leading-relaxed">
                Your message has been received successfully.
                <br />
                I'll review it and get back to you as soon as possible.
              </p>
              <button onClick={() => setIsSuccess(false)} className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest transition-colors text-sm">
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Honeypot */}
              <div className="hidden">
                <input type="text" name="bot_field" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-foreground/50 ml-2">Full Name *</label>
                <input id="name" name="name" type="text" required minLength={2} maxLength={100} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors" placeholder="John Doe" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-foreground/50 ml-2">Email Address *</label>
                <input id="email" name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors" placeholder="john@company.com" />
              </div>

              <div className="flex gap-4 w-full">
                <div className="flex flex-col gap-2 w-1/2">
                  <label htmlFor="company" className="text-xs uppercase tracking-[0.2em] text-foreground/50 ml-2">Company</label>
                  <input id="company" name="company" type="text" maxLength={100} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors" placeholder="Tesla" />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                  <label htmlFor="phone" className="text-xs uppercase tracking-[0.2em] text-foreground/50 ml-2">Phone</label>
                  <input id="phone" name="phone" type="tel" maxLength={20} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors" placeholder="+1 234 567 8900" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-xs uppercase tracking-[0.2em] text-foreground/50 ml-2">Subject *</label>
                <input id="subject" name="subject" type="text" required minLength={2} maxLength={150} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors" placeholder="Prototype Engineer Position" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs uppercase tracking-[0.2em] text-foreground/50 ml-2">Message *</label>
                <textarea id="message" name="message" rows={4} required minLength={10} maxLength={5000} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors resize-none" placeholder="How can we collaborate?" />
              </div>
              
              <div className="flex justify-center my-2">
                <Turnstile 
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                  onSuccess={(token) => setTurnstileToken(token)}
                  options={{ theme: "dark" }}
                />
              </div>

              {error && <div className="text-red-400 text-sm px-2 text-center">{error}</div>}
              
              <button disabled={isSubmitting || !turnstileToken} type="submit" className="w-full py-4 mt-2 bg-accent-primary text-background font-bold uppercase tracking-widest rounded-xl hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent-primary transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Transmitting...</>
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
