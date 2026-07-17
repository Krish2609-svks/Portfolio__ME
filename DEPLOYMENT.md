# Deployment Guide

The Mech Portfolio monorepo is designed to be easily deployed to Vercel (recommended) or any Next.js-compatible hosting provider.

## Vercel Deployment

1. **Push to GitHub**: Ensure your code is on a GitHub repository.
2. **Import Project**: Log into Vercel and import the repository.
3. **Configure Monorepo Settings**:
   - Vercel automatically detects Turborepo.
   - You will need to deploy two separate Vercel projects from the same repository (one for `portfolio` and one for `cms`).
   
### Deploying the Portfolio App
- **Project Name**: `mech-portfolio-web`
- **Root Directory**: `apps/portfolio`
- **Build Command**: `npm run build`
- **Environment Variables**: Add all variables from `ENVIRONMENT.md` (specifically URL, Anon Key, Turnstile, Redis, Email, and Twilio).

### Deploying the CMS App
- **Project Name**: `mech-portfolio-cms`
- **Root Directory**: `apps/cms`
- **Build Command**: `npm run build`
- **Environment Variables**: Add Supabase URL and Anon Key.

## Pre-Flight Checklist
- [ ] Database migrations executed in the Production Supabase project.
- [ ] RLS Policies active.
- [ ] Production Domain configured in Supabase Auth (Redirect URLs).
- [ ] `NEXT_PUBLIC_SITE_URL` correctly set to the production domain.
- [ ] Turnstile configured for the production domain in the Cloudflare dashboard.

## Rollback Plan
If a deployment causes critical issues:
1. **Frontend Rollback**: Vercel allows instant rollbacks to previous deployments via the deployment dashboard.
2. **Database Rollback**: If a schema change caused data corruption, utilize Supabase Point In Time Recovery (PITR) to revert the database to the exact minute before the deployment.

## Backup & Restore
- The database is continuously backed up by Supabase.
- Files uploaded to the `media` bucket should be periodically backed up if you are not using Supabase Pro/Enterprise plans with extended retention.
