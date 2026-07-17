# Nambi Krishnan M | Mechanical Engineering Portfolio

A premium, highly-interactive, data-driven portfolio designed for an aspiring Mechanical Engineer. Built as a monorepo containing a blazing fast Next.js static portfolio and a secure Next.js Supabase CMS.

## Architecture

- **Framework**: Next.js 14+ (App Router)
- **Monorepo**: Turborepo (apps: `portfolio`, `cms`)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Cookie-based Sessions)
- **Styling**: Tailwind CSS
- **Forms & Validation**: Zod, React Hook Form
- **Security**: Cloudflare Turnstile, Upstash Redis Rate Limiting
- **Notifications**: Resend (Email), Twilio (WhatsApp)

## Project Structure

```
mech-portfolio/
├── apps/
│   ├── cms/         # Secured Admin Dashboard (Supabase Auth)
│   └── portfolio/   # Public Static Generation Portfolio
├── turbo.json       # Monorepo task orchestration
└── package.json     # Root dependencies
```

## Documentation Map

To understand different aspects of the system, please refer to the following guides:

- **[INSTALL.md](./INSTALL.md)**: Steps to run the system locally.
- **[ENVIRONMENT.md](./ENVIRONMENT.md)**: Detailed breakdown of required environment variables.
- **[DATABASE.md](./DATABASE.md)**: Schema overview and RLS documentation.
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Production deployment instructions, checklists, and rollback plans.
- **[CMS_GUIDE.md](./CMS_GUIDE.md)**: User manual for operating the Admin Dashboard.

## Key Features

- **100% Data-Driven**: No hardcoded text. Every component (Hero, About, Skills, Projects, Contact) is managed by the CMS.
- **Highly Secure**: Contact forms are protected by Turnstile, Rate limiting, and server-side Zod validation. Database access is strictly governed by PostgreSQL Row Level Security (RLS).
- **SEO Optimized**: Fully dynamic OpenGraph tags, dynamic sitemaps, and robots.txt generation.
- **Beautiful UX**: Smooth scrolling, custom cursors, pre-loaders, and dark-mode optimization tailored for an engineering aesthetic.
