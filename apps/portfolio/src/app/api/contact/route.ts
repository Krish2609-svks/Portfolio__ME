import { NextResponse } from "next/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import twilio from "twilio";
import { createClient } from "@/utils/supabase/server";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  subject: z.string().min(2).max(150).trim(),
  message: z.string().min(10).max(5000).trim(),
  turnstileToken: z.string().min(1, "CAPTCHA verification failed"),
  honeypot: z.string().max(0, "Spam detected").optional(),
});

// Rate limiting and clients will be initialized inside the request handler
// to prevent build errors when environment variables are missing at build time.

async function verifyTurnstile(token: string, ip: string) {
  const formData = new FormData();
  formData.append("secret", process.env.TURNSTILE_SECRET_KEY!);
  formData.append("response", token);
  formData.append("remoteip", ip);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, { body: formData, method: "POST" });
  const outcome = await result.json();
  return outcome.success;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const userAgent = req.headers.get("user-agent") ?? "Unknown";

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(3, "10 m"),
      analytics: true,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // 1. Rate Limiting
    const { success: rateLimitSuccess } = await ratelimit.limit(ip);
    if (!rateLimitSuccess) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // 2. Parse & Validate
    const body = await req.json();
    const validatedData = contactSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.issues[0].message }, { status: 400 });
    }

    if (validatedData.data.honeypot) {
      return NextResponse.json({ error: "Spam detected." }, { status: 400 });
    }

    // 3. Verify Turnstile
    const isHuman = await verifyTurnstile(validatedData.data.turnstileToken, ip);
    if (!isHuman) {
      return NextResponse.json({ error: "CAPTCHA verification failed. Please try again." }, { status: 400 });
    }

    // 4. Save to Supabase
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("messages").insert([
      {
        name: validatedData.data.name,
        email: validatedData.data.email,
        company: validatedData.data.company || null,
        phone: validatedData.data.phone || null,
        subject: validatedData.data.subject,
        message: validatedData.data.message,
        ip_address: ip, // Note: IP addresses are typically hashed in production for GDPR
        user_agent: userAgent,
        source_page: req.headers.get("referer") || "Direct API",
        status: "unread",
      },
    ]);

    if (dbError) {
      console.error("Supabase Insert Error:", dbError);
      return NextResponse.json({ error: "Failed to save message. Please try again later." }, { status: 500 });
    }

    // 5. Send Email via Resend
    try {
      await resend.emails.send({
        from: "Portfolio Contact <contact@your-domain.com>", // Update with verified domain
        to: [process.env.ADMIN_EMAIL!],
        replyTo: validatedData.data.email,
        subject: `New Contact: ${validatedData.data.subject}`,
        text: `Name: ${validatedData.data.name}\nEmail: ${validatedData.data.email}\nPhone: ${validatedData.data.phone}\nCompany: ${validatedData.data.company}\n\nMessage:\n${validatedData.data.message}`,
      });
    } catch (emailError) {
      console.error("Resend Error:", emailError);
      // We don't block the user response if email fails, it's already in Supabase
    }

    // 6. Send WhatsApp Notification via Twilio
    try {
      const waMessage = `📩 *New Portfolio Contact*\n\nName: ${validatedData.data.name}\nCompany: ${validatedData.data.company || 'N/A'}\nSubject: ${validatedData.data.subject}\nEmail: ${validatedData.data.email}\nTime: ${new Date().toLocaleString()}\n\nOpen CMS: https://your-domain.com/cms/inbox`;
      
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER!,
        to: process.env.ADMIN_WHATSAPP_NUMBER!,
        body: waMessage,
      });
    } catch (waError) {
      console.error("Twilio Error:", waError);
      // We don't block the user response if WA fails
    }

    return NextResponse.json({ success: true, message: "Your message has been received successfully." });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
