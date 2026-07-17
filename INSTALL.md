# Installation Guide

Follow these steps to set up the Mech Portfolio system locally.

## Prerequisites
- Node.js 18+ or 20+ (LTS recommended)
- npm or pnpm or yarn
- Supabase CLI (optional, but recommended for local DB work)
- A Supabase Project (Cloud or Local)

## 1. Clone & Install
```bash
git clone <repository_url>
cd mech-portfolio
npm install
```

## 2. Environment Variables
Copy the example environment files and fill them in according to the [ENVIRONMENT.md](./ENVIRONMENT.md) guide.

```bash
cp .env.example .env.local
```

## 3. Database Setup
Ensure you run the database migrations. In your Supabase SQL editor (or locally):
Execute the provided SQL schema in `supabase/migrations/20240101000001_complete_schema.sql` and `20240101000002_contact_system.sql`.

## 4. Running the Development Server

The project uses Turborepo to run multiple apps concurrently.

```bash
npm run dev
```

This will spin up:
- `portfolio` at `http://localhost:3000`
- `cms` at `http://localhost:3001`

## 5. First Time Login (CMS)
You must create a user in your Supabase Auth dashboard.
Once created, log into the CMS via `http://localhost:3001/login`.
By default, any user you create in Auth will have access to the CMS. If you want to restrict it, implement an admin check in `middleware.ts`.
