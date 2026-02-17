# Backend & Database Setup Guide

## Overview

This guide covers the complete backend infrastructure using Supabase (PostgreSQL), Prisma ORM, Next.js API routes, and Supabase Storage for file uploads.

## Architecture

```
Frontend (Next.js 16, React 19)
    ↓
Next.js API Routes (/app/api/*)
    ↓
Prisma ORM
    ↓
Supabase PostgreSQL
    ↓
Supabase Storage (file uploads)
```

## Quick Start

### 1. Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account (create at https://supabase.com)
- Vercel account (for deployment)

### 2. Create Supabase Project

1. Go to https://app.supabase.com and create a new project
2. Note the following from **Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

3. Get the database connection string from **Settings > Database > Connection Strings** (URI format)

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the values:

```bash
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Storage buckets
NEXT_PUBLIC_PARTNER_LOGOS_BUCKET=partner-logos
NEXT_PUBLIC_STUDENT_DOCUMENTS_BUCKET=student-documents

# File sizes (in bytes)
MAX_LOGO_SIZE=5242880
MAX_DOCUMENT_SIZE=10485760

# Auth
JWT_SECRET=your-long-random-secret-key-here
SESSION_SECRET=your-session-secret-key

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Initialize Database

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm prisma:generate

# Push schema to Supabase
pnpm db:push

# Seed initial data
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm dev
```

Server runs on http://localhost:3000

## Database Schema

### Models

#### Admin
- User accounts for admin portal
- Email/password authentication
- Fields: id, email, name, password (hashed), timestamps

#### Formation (Courses/Programs)
- Training programs offered
- Fields: id, name, description, category, duration, status, timestamps

#### Student
- Individual or company enrolled
- Fields: id, type, firstName, lastName, email, phone, dateOfBirth
- Company fields: companyName, companyStudentCount
- Relations: formation, inscriptions, documents

#### Inscription (Enrollment Request)
- Enrollment request for a formation
- Fields: id, studentId, formationId, type, requestorName, requestorEmail
- Status: Pending, Approved, Rejected

#### Partner
- Brand partners for homepage
- Fields: id, name, website, logoUrl, featured

#### ContactMessage
- Public contact form submissions
- Fields: id, name, email, subject, message, status

#### StudentDocument
- Files uploaded by students
- Fields: id, studentId, fileName, fileType, fileSize, fileUrl

## API Routes

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create new admin

### Formations
- `GET /api/formations` - List all formations
- `GET /api/formations/[id]` - Get single formation
- `POST /api/formations/create` - Create formation (admin only)

### Students
- `GET /api/students` - List students (with filters)

### Inscriptions
- `POST /api/enroll` - Submit enrollment (public)
- `GET /api/inscriptions` - List inscriptions
- `PATCH /api/inscriptions/[id]` - Update status (admin only)

### Partners
- `GET /api/partners` - List partners
- `POST /api/partners` - Create partner (admin only)

### Contact
- `POST /api/contact` - Submit contact form (public)
- `GET /api/contact` - View messages (admin only)

### File Uploads
- `POST /api/upload/partner-logo` - Generate upload URL

## Security

### API Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Token obtained from login endpoint.

### Environment Variables

**Critical - Keep Secret:**
- `SUPABASE_SERVICE_ROLE_KEY` - Never expose to frontend
- `DATABASE_URL` - Database credentials
- `JWT_SECRET` - Token signing secret
- `SESSION_SECRET` - Session encryption key

**Safe - Public:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Limited-scope anon key

### Password Security

Passwords are hashed using PBKDF2-SHA512 with salt. For production, consider upgrading to bcrypt:

```bash
pnpm add bcryptjs
```

Update `lib/auth.ts`:

```typescript
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
```

### Row-Level Security (RLS)

To enable RLS on Supabase:

1. In Supabase dashboard, go to **SQL Editor**
2. Create policies for each table:

```sql
-- Example: Students can only see their own documents
CREATE POLICY "Users can view own documents"
ON student_document
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can see all
CREATE POLICY "Admins can view all documents"
ON student_document
FOR SELECT
USING (is_admin(auth.uid()));
```

## File Storage Setup

### Create Buckets

1. In Supabase, go to **Storage**
2. Create two buckets:
   - `partner-logos` (max 5MB per file)
   - `student-documents` (max 10MB per file)

3. Set bucket policies (Storage > Buckets > [bucket] > Policies):

**Partner Logos (Public Read, Auth Write):**
```sql
-- Allow public read
CREATE POLICY "Public read" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'partner-logos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'partner-logos' 
  AND auth.role() = 'authenticated'
);
```

**Student Documents (Private):**
```sql
-- Only owner can read
CREATE POLICY "Users can access own documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'student-documents' 
  AND owner = auth.uid());

-- Only owner and admins can upload
CREATE POLICY "Users can upload own documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'student-documents'
  AND (owner = auth.uid() OR is_admin(auth.uid()))
);
```

## Migrations

### Create New Migration

```bash
# Make schema changes in prisma/schema.prisma
pnpm prisma migrate dev --name add_new_field
```

### Apply to Production

```bash
# Generate migration SQL
pnpm prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datasource DATABASE_URL

# Run against production database
pnpm db:push
```

### Rollback

```bash
# Reset development database
pnpm prisma migrate reset

# For production, manually run migrations/[name]/migration.sql in reverse
```

## Development

### Run Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test --coverage
```

### View Database

```bash
# Open Prisma Studio
pnpm prisma:studio
```

### Seed Data

```bash
pnpm db:seed
```

## Deployment

### Vercel Deployment

1. Push code to GitHub main branch
2. Create Vercel project (auto-deploys via GitHub Actions)
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - All other secrets

4. Workflow runs automatically:
   - Tests run on PR
   - Deploy to production on push to main

### Manual Deployment

```bash
# Build
pnpm build

# Start production server
pnpm start

# Run migrations
pnpm db:push
```

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

- Verify `DATABASE_URL` in `.env.local`
- Check Supabase project is active
- Ensure IP whitelist settings allow your connection

### Prisma Generation Error

```bash
pnpm prisma:generate
```

### Migration Conflicts

```bash
# Reset development (wipes data!)
pnpm prisma migrate reset

# Resolve conflicts in prisma/migrations/
```

### File Upload Fails

- Check bucket exists in Supabase
- Verify `NEXT_PUBLIC_*_BUCKET` names match
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check file size limits

## Backup & Recovery

### Backup Database

Supabase automatic backups are enabled. To manual backup:

```bash
# Export via pg_dump (from Supabase terminal)
pg_dump postgresql://postgres:PASSWORD@HOST:5432/postgres > backup.sql

# Restore
psql postgresql://postgres:PASSWORD@HOST:5432/postgres < backup.sql
```

### Backup Storage Files

```bash
# Download via Supabase CLI
supabase storage download partner-logos --recursive
supabase storage download student-documents --recursive
```

## Performance Tips

1. **Database Indexes** - Already added to critical fields
2. **Connection Pooling** - Supabase handles automatically
3. **Caching** - Add Redis for session storage (optional)
4. **API Response** - Paginate list endpoints
5. **File Storage** - Use signed URLs (auto-expires in 1 hour)

## Monitoring

### Logs

```bash
# Vercel logs
vercel logs

# Local development logs
pnpm dev
```

### Database Monitoring

In Supabase dashboard:
- **Dashboard** - Query statistics
- **Database** - Real-time queries
- **Logs** - PostgreSQL logs

## Support & Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

**Last Updated:** February 17, 2026
**Backend Version:** 1.0.0
**Maintained by:** SLT Development Team
