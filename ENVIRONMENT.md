# Environment Variables

Both `portfolio` and `cms` apps share the same `.env.local` file at the monorepo root (if you configure turbo to hoist envs) or they must be defined in your CI/CD pipeline or deployment platform (Vercel/Netlify).

## Core Supabase Variables
These are required for both `cms` (Auth, Data Writing) and `portfolio` (Data Reading).

```env
# Your Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co

# Your Supabase Anon Key (Safe for client side, restricted by RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Security & Integrations (Required for Portfolio API Routes)

```env
# Cloudflare Turnstile Secret Key (Server-side validation)
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# Upstash Redis (For Contact Form Rate Limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Resend (For Email Notifications)
RESEND_API_KEY=re_...
CONTACT_EMAIL_TO=you@example.com
CONTACT_EMAIL_FROM=onboarding@resend.dev # Or your verified domain

# Twilio (For WhatsApp Notifications)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
ADMIN_PHONE_NUMBER=whatsapp:+1234567890
```

## SEO & Application Settings

```env
# The canonical URL of your deployed site
NEXT_PUBLIC_SITE_URL=https://nambikrishnan.com
```
