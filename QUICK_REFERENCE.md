# Quick Reference Card

Fast lookup for common tasks and API calls.

## Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
SESSION_SECRET=...

# Optional
NODE_ENV=development|production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| Admin | User accounts | id, email, password (hashed), name |
| Formation | Programs/Courses | id, name, category, duration, status |
| Student | Enrolled users | id, type, email, firstName, lastName, companyName |
| Inscription | Enrollment requests | id, studentId, formationId, status |
| Partner | Brand partners | id, name, website, logoUrl, featured |
| ContactMessage | Form submissions | id, name, email, subject, message, status |
| StudentDocument | File uploads | id, studentId, fileName, fileUrl |

## API Endpoints

### Auth (Public)
```
POST   /api/auth/login      - Login (returns token)
POST   /api/auth/register   - Create admin (requires token)
```

### Formations
```
GET    /api/formations      - List all
GET    /api/formations/[id] - Get one
POST   /api/formations/create - Create (requires token)
```

### Enrollment
```
POST   /api/enroll          - Public enrollment
GET    /api/inscriptions    - List (requires token)
PATCH  /api/inscriptions/[id] - Update status (requires token)
```

### Students
```
GET    /api/students        - List (requires token)
```

### Partners
```
GET    /api/partners        - List (public)
POST   /api/partners        - Create (requires token)
```

### Contact
```
POST   /api/contact         - Submit form (public)
GET    /api/contact         - View messages (requires token)
```

### Files
```
POST   /api/upload/partner-logo - Get upload URL
```

## Test Data (Seeds)

### Admin Login
```
Email:    admin@apexacademy.com
Password: admin123
```

### Formations
- Full-Stack Web Development
- Data Science & Analytics
- UX/UI Design Mastery
- Cloud & DevOps Engineering

### Sample Curl Commands

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@apexacademy.com","password":"admin123"}'
```

### Enroll (Public)
```bash
curl -X POST http://localhost:3000/api/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "Individual",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "selectedProgram": "Full-Stack Web Development",
    "startDate": "2026-03-01",
    "agreeTerms": true
  }'
```

### Get Formations
```bash
curl http://localhost:3000/api/formations
```

### Get Token & View Inscriptions
```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@apexacademy.com","password":"admin123"}' \
  | jq -r '.data.token')

# 2. View inscriptions
curl http://localhost:3000/api/inscriptions \
  -H "Authorization: Bearer $TOKEN"
```

## npm Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run linter
pnpm test             # Run tests
pnpm test:watch       # Tests with watch mode

# Database
pnpm db:push          # Push schema to database
pnpm db:seed          # Seed example data
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Create new migration
pnpm prisma:studio    # Open Prisma Studio (GUI)
pnpm supabase:push    # Deploy migrations

# Production
pnpm build            # Build
pnpm start            # Start server
```

## Deployment URLs

```
Development: http://localhost:3000
Staging:     https://staging-YOUR_APP.vercel.app
Production:  https://YOUR_APP.vercel.app
API:         https://YOUR_APP.vercel.app/api
```

## Authentication Header

```
Authorization: Bearer <your-jwt-token>
```

## Common Validations

| Field | Rules |
|-------|-------|
| Email | Must be valid format (user@example.com) |
| Phone | Min 7 digits, can include +, -, (), spaces |
| Password | Min 8 characters (in login/register) |
| File Size | Logos: 5MB, Documents: 10MB |
| File Type | PNG, JPG, WEBP, SVG (logos) |

## Status Values

```
Formation Status:   Active | Draft | Archived
Student Status:     Active | Inactive | Graduated
Inscription Status: Pending | Approved | Rejected
Message Status:     Unread | Read | Replied
Account Type:       Individual | Company
```

## Database Connection

```bash
# Using psql directly
psql postgresql://postgres:PASSWORD@HOST:5432/postgres

# Via Supabase CLI
supabase db connect

# Via Vercel (production)
vercel env pull
psql $DATABASE_URL
```

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| "Cannot connect to DB" | Check DATABASE_URL format |
| "Prisma not generated" | Run `pnpm prisma:generate` |
| "Route returns 404" | File must be `/app/api/[route]/route.ts` |
| "Login fails" | Run `pnpm db:seed` to create test admin |
| "Upload fails" | Check bucket exists + file size/type |
| "Secret error" | Verify `JWT_SECRET` & `SESSION_SECRET` in .env |

## File Locations

```
Database Schema:       prisma/schema.prisma
Seed Data:            prisma/seed.ts
Migrations:           prisma/migrations/
Auth Logic:           lib/auth.ts
API Middleware:       lib/api-middleware.ts
Supabase Client:      lib/supabase.ts
File Upload:          lib/storage.ts
Database Utils:       lib/db.ts
API Routes:           app/api/*/route.ts
Tests:                __tests__/unit/*.test.ts
Workflows:            .github/workflows/*.yml
Documentation:        *.md files (root)
```

## Performance Tips

```
# View slow queries
EXPLAIN ANALYZE SELECT * FROM inscription WHERE status = 'Pending';

# Check indexes
SELECT * FROM pg_stat_user_indexes;

# Enable connection pooling (Supabase default)
# Use transaction mode for better performance

# Cache responses in Next.js
import { cache } from 'react'
export const getFormations = cache(() => prisma.formation.findMany())
```

## Security Checklist

- [ ] `.env.local` in `.gitignore`
- [ ] No secrets in git: `git log --all -S "PASSWORD"`
- [ ] JWT_SECRET min 32 chars
- [ ] SUPABASE_SERVICE_ROLE_KEY NOT in frontend code
- [ ] Input validation on all endpoints
- [ ] Password hashing before storage
- [ ] CORS headers configured
- [ ] Rate limiting (recommended)

## Cost Estimation (Supabase)

- **Free Tier:** Up to 500MB database, 1GB storage, good for dev
- **Pro Tier:** $25/month, unlimited storage, better for production
- Check: Supabase > Team Settings > Billing

## Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JWT.io](https://jwt.io) - Decode/verify tokens
- [PostgreSQL Docs](https://www.postgresql.org/docs)

## Generated JWT Structure

```
Header: {"alg":"HS256","typ":"JWT"}
Payload: {"sub":"admin-id","email":"admin@example.com","iat":..,"exp":...}
Signature: HMACSHA256(base64(header)+"."+base64(payload), SECRET)

Full Token: header.payload.signature
```

## Debugging

```bash
# View logs
pnpm dev
# Or: vercel logs

# View database live
pnpm prisma:studio

# Check what was just seeded
psql postgresql://postgres:pwd@host/postgres
SELECT COUNT(*) FROM admin;

# Verify token
curl https://jwt.io ?token=YOUR_TOKEN

# Test API locally
curl http://localhost:3000/api/health

# Monitor Supabase
# Dashboard > Logs > Postgres Logs
```

## Response Format

All successful responses:
```json
{
  "success": true,
  "message": "Description",
  "data": { ...response data... }
}
```

All error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

Status codes: 200 (ok), 201 (created), 400 (bad), 401 (auth), 404 (notfound), 500 (error)

## Secrets Checklist

Keep these SAFE (never in git):
- `DATABASE_URL` - Database password
- `SUPABASE_SERVICE_ROLE_KEY` - Admin API key
- `JWT_SECRET` - Token signing key
- `SESSION_SECRET` - Session encryption key

Safe to commit (but not in code):
- `NEXT_PUBLIC_SUPABASE_URL` - Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Limited API key

## Time Zones (PostgreSQL)

Default: UTC timezone  
Set explicit: `TIMEZONE 'America/New_York'`  
Current time: `SELECT now();`  
Convert: `now() AT TIME ZONE 'UTC' AT TIME ZONE 'America/New_York'`

---

**Updated:** February 17, 2026  
**For:** SLT Backend Team  
Print & post on desk for quick reference! 📌
