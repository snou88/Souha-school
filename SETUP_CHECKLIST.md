# Setup Checklist - Backend Integration

Complete step-by-step checklist to set up the production-ready backend.

## Phase 1: Project Setup (30 minutes)

### 1.1 Create Supabase Project
- [ ] Go to https://supabase.com and sign up/login
- [ ] Click "New Project"
- [ ] Select region closest to you
- [ ] Save database password securely (you'll need it)
- [ ] Wait for project to initialize (2-3 minutes)

### 1.2 Get Supabase Credentials
- [ ] Go to **Settings > API**
- [ ] Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy `Anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Click `Service Role` key → `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Go to **Settings > Database** → Copy connection string (URI) → `DATABASE_URL`

### 1.3 Get Database Password
- [ ] In Supabase, go to **Settings > Database**
- [ ] "Postgres Password" section
- [ ] Click "Reset password" if needed
- [ ] Copy password (for DATABASE_URL format)

### 1.4 Format DATABASE_URL Correctly
Original Supabase format:
```
postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
```

Example (replace brackets):
```
postgresql://postgres:MyPassword123@db.xyzdomain.supabase.co:5432/postgres
```

Database port is always `5432` for Supabase.

### 1.5 Create Storage Buckets
- [ ] In Supabase, go to **Storage**
- [ ] Click "New bucket"
- [ ] Create `partner-logos` bucket (public read)
- [ ] Create `student-documents` bucket (private)
- [ ] Set bucket policies (see BACKEND_SETUP.md)

## Phase 2: Local Configuration (15 minutes)

### 2.1 Create Environment File
```bash
cd c:\wamp64\www\SLT
cp .env.example .env.local
```

### 2.2 Fill in Environment Variables

Edit `.env.local` with values from Phase 1:

```bash
# Database URL (from Supabase)
DATABASE_URL=postgresql://postgres:YourPassword@db.xyz.supabase.co:5432/postgres

# Supabase URLs and Keys
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Storage Buckets
NEXT_PUBLIC_PARTNER_LOGOS_BUCKET=partner-logos
NEXT_PUBLIC_STUDENT_DOCUMENTS_BUCKET=student-documents

# File Limits
MAX_LOGO_SIZE=5242880
MAX_DOCUMENT_SIZE=10485760

# Secrets (generate with: openssl rand -base64 32)
JWT_SECRET=your-generated-secret-here
SESSION_SECRET=your-generated-secret-here

# App Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2.3 Generate Secret Keys

```bash
# On Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Copy output to JWT_SECRET and SESSION_SECRET in .env.local
```

### 2.4 Verify Environment File
```bash
# Check all variables are present
grep -E "^[A-Z_]+" .env.local | wc -l
# Should output: 14 (or more)
```

## Phase 3: Dependencies (10 minutes)

### 3.1 Install Dependencies
```bash
pnpm install --frozen-lockfile
```

### 3.2 Verify Installation
```bash
# Check key packages installed
pnpm list | grep -E "@supabase|@prisma|zod"
# Should show: @supabase/ssr, @supabase/supabase-js, @prisma/client, prisma, zod
```

## Phase 4: Database Setup (15 minutes)

### 4.1 Generate Prisma Client
```bash
pnpm prisma:generate
```

### 4.2 Create Database Schema
```bash
pnpm db:push
```

Expected output:
```
✔ Your database is now in sync with your schema.

✨ Prisma Client was successfully generated in ...
```

### 4.3 Verify Database Tables
- [ ] Go to Supabase > **SQL Editor**
- [ ] Run: `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'public';`
- [ ] You should see: Admin, Formation, Student, Inscription, Partner, ContactMessage, StudentDocument

### 4.4 Seed Example Data
```bash
pnpm db:seed
```

Expected output:
```
🌱 Starting database seed...
👨‍💼 Creating admin users...
✅ Created admins: admin@apexacademy.com, karim@apexacademy.com
📚 Creating formations...
✅ Created formations: Full-Stack Web Development, Data Science & Analytics, UX/UI Design Mastery, Cloud & DevOps Engineering
👥 Creating students...
✅ Created students: sarah.m@email.com, contact@techcorp.com, emily.c@email.com
📝 Creating inscriptions...
✅ Created inscriptions: 2
🤝 Creating partners...
✅ Created partners: Acme Corp, Atlas Partners, Bright Labs
✨ Seed completed successfully!
```

## Phase 5: Local Testing (30 minutes)

### 5.1 Start Development Server
```bash
pnpm dev
```

Server should start at: `http://localhost:3000`

### 5.2 Test Admin Login

**Via curl:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@apexacademy.com",
    "password": "admin123"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "admin": {
      "id": "...",
      "name": "Ahmed Senouci",
      "email": "admin@apexacademy.com"
    }
  }
}
```

**Via browser:**
1. Go to http://localhost:3000/admin/login
2. Enter email: `admin@apexacademy.com`
3. Password: `admin123`
4. Should login successfully

### 5.3 Test Enrollment Endpoint
```bash
curl -X POST http://localhost:3000/api/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "Individual",
    "firstName": "Test",
    "lastName": "User",
    "email": "test123@example.com",
    "phone": "+1234567890",
    "selectedProgram": "Full-Stack Web Development",
    "startDate": "2026-03-01",
    "agreeTerms": true
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Enrollment successful! We will review your application shortly.",
  "data": {
    "inscriptionId": "...",
    "studentId": "...",
    "status": "Pending"
  }
}
```

### 5.4 Verify Database Data
```bash
# Get auth token first
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@apexacademy.com","password":"admin123"}' | jq -r '.data.token')

# View inscriptions
curl http://localhost:3000/api/inscriptions \
  -H "Authorization: Bearer $TOKEN"

# Should return list of inscriptions including the new one
```

### 5.5 Run Tests
```bash
pnpm test
```

Expected: All tests pass ✅

## Phase 6: Production Deployment (1-2 hours)

### 6.1 Create Vercel Project
- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New" > "Project"
- [ ] Select your GitHub repository
- [ ] Framework: Next.js
- [ ] Click "Deploy"

### 6.2 Configure Vercel Environment Variables
- [ ] Go to project **Settings > Environment Variables**
- [ ] Add all variables from `.env.local` in **three environments**:
  - Production
  - Preview
  - Development
- [ ] **Key variables:**
  - `DATABASE_URL` ✅ REQUIRED
  - `NEXT_PUBLIC_SUPABASE_URL` ✅ REQUIRED
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ REQUIRED
  - `SUPABASE_SERVICE_ROLE_KEY` ✅ REQUIRED
  - All others from `.env.local`

### 6.3 Deploy
- [ ] Vercel automatically deploys when you push to main
- [ ] Monitor: **Deployments > [latest]**
- [ ] Wait for checkmark ✅ (takes 2-5 minutes)

### 6.4 Verify Production Deployment
```bash
# Replace YOUR_DOMAIN with your Vercel domain
curl https://YOUR_DOMAIN.vercel.app/api/health

# Should return: {"status":"ok",...}
```

### 6.5 Test Production Login
```bash
curl -X POST https://YOUR_DOMAIN.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@apexacademy.com",
    "password": "admin123"
  }'

# Should return token on success
```

## Phase 7: Database Backup Setup (15 minutes)

### 7.1 Enable Automatic Backups (Supabase)
- [ ] Go to Supabase > **Settings > Backups**
- [ ] Automatic backups are enabled by default (daily)
- [ ] Daily backups kept for 14 days

### 7.2 Create Manual Backup Script
```bash
# Create backups directory
mkdir -p backups

# Backup database
pg_dump postgresql://postgres:PASSWORD@HOST:5432/postgres > backups/db-backup-$(date +%Y%m%d).sql

# Backup storage
supabase storage download partner-logos --recursive --output backups/logos/
supabase storage download student-documents --recursive --output backups/docs/
```

## Phase 8: Security Review (20 minutes)

- [ ] `.env.local` is in `.gitignore` ✅
- [ ] No secrets in git history: `git log --all -S "SUPABASE_SERVICE_ROLE_KEY"`
- [ ] JWT_SECRET is 32+ characters
- [ ] SESSION_SECRET is 32+ characters
- [ ] SUPABASE_SERVICE_ROLE_KEY only in server-side code
- [ ] Vercel env vars are marked as "Sensitive" where applicable
- [ ] Database connection requires SSL (sslmode=require)
- [ ] All API routes validate input (email, phone, etc.)
- [ ] Password hashing enabled (PBKDF2 or bcrypt)

## Phase 9: Monitoring & Logs (10 minutes)

### 9.1 Setup Error Tracking (Optional)
```bash
pnpm add @sentry/nextjs
```

### 9.2 View Logs
```bash
# Vercel logs
vercel logs --follow

# Supabase logs
# Dashboard > Logs > Postgres Logs
```

### 9.3 Set Up Alerts (Optional)
- [ ] Vercel > Project Settings > Alerts
- [ ] Email on deployment failures
- [ ] Email on errors

## Phase 10: Documentation & Onboarding (30 minutes)

- [ ] Team reviews BACKEND_SETUP.md
- [ ] Team reviews SECURITY.md
- [ ] Team reviews DEPLOYMENT.md
- [ ] Team reviews API.md
- [ ] Slack announcement with setup details
- [ ] Create wiki page with database ER diagram

## Troubleshooting

### "Can't connect to database"
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Verify Supabase project is active in dashboard
```

### "Prisma client not generated"
```bash
pnpm prisma:generate
```

### "Migration fails"
```bash
# Reset development database (⚠️ WIPES DATA)
pnpm prisma migrate reset

# Or manually review migntions in: prisma/migrations/
```

### "API returns 404"
- [ ] Verify route file exists
- [ ] Check file naming: `route.ts` (not `page.ts`)
- [ ] Check path matches: `/app/api/enroll/route.ts` → `/api/enroll`

### "Login fails"
- [ ] Verify admin user exists: query database
- [ ] Check password hash format (salt:hash)
- [ ] Verify JWT_SECRET is set

### "Upload fails"
- [ ] Verify storage bucket exists
- [ ] Check bucket policy allows uploads
- [ ] Verify SUPABASE_SERVICE_ROLE_KEY is correct

## Success Criteria

You're ready for production when all of these pass:

- [ ] ✅ Admin login works
- [ ] ✅ Enrollment form submits successfully
- [ ] ✅ Database has seed data
- [ ] ✅ All API tests pass
- [ ] ✅ No console errors
- [ ] ✅ File uploads work
- [ ] ✅ Vercel deployment successful
- [ ] ✅ Production API responds correctly
- [ ] ✅ Backups enabled
- [ ] ✅ Team trained

## Next Steps (Post-Launch)

1. **Email integration**: Implement confirmation/notification emails
2. **Analytics**: Add Vercel Analytics or Google Analytics
3. **Monitoring**: Setup Sentry for error tracking
4. **Rate limiting**: Add express-rate-limit to prevent abuse
5. **Caching**: Redis for session storage (optional)
6. **Search**: Full-text search on formations/students (optional)
7. **Payments**: Stripe integration for paid courses (if needed)

---

**Setup Status:** [ ] Complete
**Date Started:** ___________
**Date Completed:** ___________
**Deployed By:** ___________
**Production URL:** ___________

**Estimated Total Time:** 3-4 hours

For issues, refer to:
- BACKEND_SETUP.md - Detailed setup guide
- SECURITY.md - Security checklist
- API.md - API endpoint reference
- Troubleshooting section above
