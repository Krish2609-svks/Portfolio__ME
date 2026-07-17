# Database Documentation

This document outlines the Supabase PostgreSQL schema, policies, and data structures driving the portfolio.

## Schema Overview

The database is divided into two primary concepts:
1. **Singletons**: Tables that inherently contain only ONE row. Used for global settings.
2. **Lists**: Tables that contain multiple rows, rendered as collections on the frontend.

### Singletons
- `portfolio_settings`: Global settings, Hero sections, Resume URLs, social links.
- `seo_settings`: Global Meta tags, OpenGraph data, and Twitter cards.

### Lists
- `skills`: Skills grouped by categories (e.g., CAD, Software).
- `experience`: Work/Internship experiences on a timeline.
- `education`: Academic history.
- `leadership`: Extracurriculars and leadership activities.
- `achievements`: Awards and distinctions.
- `certifications`: Professional certifications (rendered in the Leadership/Certs view).
- `gallery`: Featured project images (Masonry grid).
- `messages`: Incoming contact form submissions.

## Row Level Security (RLS)

Security is strictly enforced at the database level.
By default, all tables have RLS enabled.

**General Rules applied to all content tables:**
1. **Public Read Access**: Anonymous (`anon`) users can SELECT rows where `published = true`.
2. **Admin Full Access**: Authenticated (`authenticated`) users have `ALL` access (SELECT, INSERT, UPDATE, DELETE) to all rows, regardless of publish status.

**Messages Table:**
- Anonymous users CANNOT SELECT.
- Anonymous users CANNOT INSERT directly via PostgREST. The `service_role` key is used on the server in `/api/contact` to securely insert after validation.
- Admins can read and update (e.g., archive, mark read) messages.

## Storage Buckets

- `media`: The single bucket used for images and PDFs (resumes).
- **Policies**: 
  - Admins have full access to upload and delete.
  - Public has read-only access to download images.

## Backups & Point in Time Recovery
Supabase automatically handles daily backups. For production instances, it is recommended to enable Point in Time Recovery (PITR) to allow rolling back the database to any specific second in the event of accidental data deletion by an admin.
