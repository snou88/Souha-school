# Security & Environment Configuration

## Environment Variables Checklist

This document lists all environment variables and where they should be configured.

### 1. Local Development (`.env.local`)

Create this file locally - **NEVER commit to Git**:

```bash
# Database Connection (from Supabase > Settings > Database)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres

# Supabase Configuration (from Supabase > Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # KEEP SECRET!

# Storage Configuration
NEXT_PUBLIC_PARTNER_LOGOS_BUCKET=partner-logos
NEXT_PUBLIC_STUDENT_DOCUMENTS_BUCKET=student-documents
MAX_LOGO_SIZE=5242880              # 5MB
MAX_DOCUMENT_SIZE=10485760         # 10MB

# Authentication Secrets (generate with: openssl rand -base64 32)
JWT_SECRET=your-long-random-secret-key-minimum-32-chars
SESSION_SECRET=your-session-secret-key-minimum-32-chars

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Vercel Production (Vercel Dashboard Environment Variables)

Go to:
`Settings > Environment Variables`

Add all variables from above in three environments:
- **Production** (main branch)
- **Preview** (pull requests)
- **Development** (local development)

### 3. GitHub Secrets (for CI/CD)

For GitHub Actions workflows:

```bash
VERCEL_TOKEN=...           # Vercel CLI token
VERCEL_ORG_ID=...          # Vercel organization ID
VERCEL_PROJECT_ID=...      # Vercel project ID
```

## Secret Generation

### Generate Random Secrets (use in production)

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Environment Variable Details

| Variable | Type | Required | Description | Where to Get |
|----------|------|----------|-------------|--------------|
| `DATABASE_URL` | Secret | ✅ | PostgreSQL connection string | Supabase > Settings > Database > URI |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | ✅ | Supabase project URL | Supabase > Settings > API > URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | ✅ | Limited-scope public key | Supabase > Settings > API > Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | ✅ | Full-access admin key (server-only) | Supabase > Settings > API > Service Role Key |
| `NEXT_PUBLIC_PARTNER_LOGOS_BUCKET` | Public | ✅ | Storage bucket for logos | Supabase > Storage (create manually) |
| `NEXT_PUBLIC_STUDENT_DOCUMENTS_BUCKET` | Public | ✅ | Storage bucket for documents | Supabase > Storage (create manually) |
| `MAX_LOGO_SIZE` | Public | ✅ | Max logo file size in bytes | Default: 5242880 (5MB) |
| `MAX_DOCUMENT_SIZE` | Public | ✅ | Max document file size in bytes | Default: 10485760 (10MB) |
| `JWT_SECRET` | Secret | ✅ | Token signing key | Generate with `openssl` |
| `SESSION_SECRET` | Secret | ✅ | Session encryption key | Generate with `openssl` |
| `NODE_ENV` | Public | ⚠️ | Environment (development/production) | Set by deployment platform |
| `NEXT_PUBLIC_APP_URL` | Public | ⚠️ | Frontend URL | http://localhost:3000 (dev) |

**Legend:**
- ✅ = Critical for production
- ⚠️ = Important for proper behavior
- **Public** = Safe to expose to frontend
- **Secret** = Keep server-side only

## Security Best Practices

### 1. Database Security

```sql
-- Create dedicated database user (not postgres)
CREATE ROLE app_user WITH LOGIN PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE postgres TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- Enable SSL
SET sslmode = require
```

### 2. API Security

```typescript
// Use CORS headers carefully
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Validate all inputs
if (!isValidEmail(email)) throw new Error('Invalid email')

// Rate limiting (consider adding)
// npm install express-rate-limit
```

### 3. Password Hashing

For production, upgrade from PBKDF2 to bcrypt:

```bash
npm install bcryptjs
```

Update `lib/auth.ts`:

```typescript
import * as bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
```

### 4. JWT Token Security

```typescript
// Use RS256 (RSA) instead of HS256 for better security
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function generateToken(adminId: string, email: string) {
  return new SignJWT({ sub: adminId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload
}
```

### 5. File Upload Security

```typescript
// Always validate file type on server
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error('Invalid file type')
}

// Check file size
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
if (file.size > MAX_SIZE) {
  throw new Error('File too large')
}

// Store in non-public bucket or with signed URLs
```

### 6. SQL Injection Prevention

```typescript
// Use Prisma (safe by default)
const user = await prisma.admin.findUnique({
  where: { email: userInput } // Parameterized query
})

// Avoid raw SQL unless necessary
// If you must: prisma.$queryRaw`SELECT * FROM Admin WHERE email = ${email}`
```

### 7. XSS Prevention

```typescript
// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')  // Remove HTML tags
    .slice(0, 500)         // Limit length
}

// Use html-entities for encoding if needed
npm install html-entities
```

### 8. CSRF Protection

For POST/PUT/DELETE requests:

```typescript
// In Next.js, use SameSite cookies (auto-configured)
// Verify Origin/Referer headers
if (req.headers.origin !== process.env.NEXT_PUBLIC_APP_URL) {
  return NextResponse.json({ error: 'CSRF' }, { status: 403 })
}
```

## Monitoring & Logging

### Error Tracking

Add error tracking service (optional):

```bash
npm install @sentry/nextjs
```

### Audit Logging

Track admin actions:

```typescript
// Create audit_log table
model AuditLog {
  id        String   @id @default(cuid())
  adminId   String
  action    String   // "CREATE", "UPDATE", "DELETE"
  tableName String
  recordId  String
  changes   Json
  createdAt DateTime @default(now())
}

// Log every mutation
await prisma.auditLog.create({
  data: {
    adminId: admin.id,
    action: 'UPDATE',
    tableName: 'Partner',
    recordId: partner.id,
    changes: { name: oldName, website: oldWebsite },
  },
})
```

## Compliance Checklist

- [ ] All secrets in environment variables (not hardcoded)
- [ ] `.env.local` in `.gitignore`
- [ ] HTTPS enforced in production
- [ ] CORS headers configured correctly
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens have expiration
- [ ] File uploads validated (type, size)
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (sanitization)
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Error logging/monitoring enabled
- [ ] Database backups scheduled
- [ ] Audit logs maintained

## Emergency Contacts

If security issue detected:

1. **Do not commit** the problematic code
2. **Rotate secrets** immediately:
   ```bash
   # Regenerate JWT_SECRET
   # Regenerate SUPABASE_SERVICE_ROLE_KEY
   # Change admin passwords
   ```
3. **Review logs** for unauthorized access
4. **Notify users** if user data compromised
5. **Document incident** for future reference

---

**Last Updated:** February 17, 2026
**Security Level:** Production-Ready
**Review Schedule:** Quarterly (Feb, May, Aug, Nov)
