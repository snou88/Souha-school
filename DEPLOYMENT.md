# Deployment & Production Runbook

Complete checklist and procedures for deploying to production.

## Pre-Deployment Checklist (1-2 weeks before)

### Code Review
- [ ] All PR reviews completed
- [ ] Tests passing (100% coverage for critical paths)
- [ ] Linting clean (`pnpm lint`)
- [ ] No console.log() statements left in production code
- [ ] Deprecated dependencies removed

### Database
- [ ] Schema finalized
- [ ] All migrations tested locally
- [ ] Migration rollback plan documented
- [ ] Data backup strategy confirmed
- [ ] Performance indexes added

### Security
- [ ] All secure keys rotated
- [ ] `.env.local` added to `.gitignore`
- [ ] No secrets in git history
- [ ] CORS headers configured
- [ ] Rate limiting tested
- [ ] File upload validation working

### Documentation
- [ ] API documentation up to date
- [ ] Deployment procedure tested
- [ ] Runbook reviewed
- [ ] Team trained on procedures

## Week-Of Deployment

### Day 1: Final Testing

```bash
# 1. Build and test locally
pnpm install
pnpm build
pnpm test
pnpm lint

# 2. Test database operations
export DATABASE_URL="production-connection-string"
pnpm db:push
pnpm db:seed

# 3. Verify all environment variables
cat .env.example | grep -i "^[a-z]" | while read var; do
  key=$(echo "$var" | cut -d= -f1)
  if [ -z "${!key}" ]; then
    echo "Missing: $key"
  fi
done
```

### Day 2: Staging Deployment

```bash
# Deploy to staging environment
git checkout -b release/v1.0.0
git commit -m "Release v1.0.0"
git push origin release/v1.0.0

# Monitor staging for 24 hours
# Test all critical flows:
# - Admin login
# - Student enrollment
# - File upload
# - Form submissions
```

### Day 3: Production Deployment

See "Production Deployment Steps" below

## Production Deployment Steps

### 1. Pre-Deployment

```bash
# Ensure main branch is clean
git status
# Should be: "nothing to commit, working tree clean"

# Verify production env vars
vercel env ls
# Cross-check with BACKEND_SETUP.md

# Check database backups are current
# Supabase Dashboard > Backups
```

### 2. Create Release

```bash
# Create release commit
git checkout main
git pull origin main

echo "1.0.0" > VERSION
git add VERSION
git commit -m "chore: release v1.0.0"
git tag -a v1.0.0 -m "Release version 1.0.0"

git push origin main --tags
```

### 3. Verify GitHub Actions

```bash
# Check workflow status
# GitHub > Actions > Tests & Quality
# All tests must PASS green ✅
```

### 4. Deploy to Vercel

```bash
# Automatic: Merging to main triggers deployment

# Manual deployment (if needed):
vercel --prod --token=$VERCEL_TOKEN

# Verify deployment
curl https://your-app.vercel.app/api/health
# Expected: {"ok": true}
```

### 5. Post-Deployment Validation

```bash
# Smoke test critical endpoints
curl -X POST https://your-app.vercel.app/api/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "Individual",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "selectedProgram": "Full-Stack Web Development",
    "startDate": "2026-03-01",
    "agreeTerms": true
  }'

# Check logs
vercel logs --since 10m

# Verify database connection
curl https://your-app.vercel.app/api/formations
# Should return list of formations
```

### 6. Notify Team

```bash
# Announce deployment
Slack message template:
---
🚀 **Production Deployment Successful**

Version: 1.0.0
Time: [timestamp]
Status: ✅ All systems operational

Changes:
- Added Supabase backend integration
- Implemented enrollment API
- File upload support

Next steps:
- Monitor error logs for 24h
- Run daily health checks
---
```

## Monitoring (Post-Deployment)

### First 24 Hours

```bash
# Check hourly
- Error rate (Vercel > Error reports)
- API response times (Vercel > Analytics)
- Database connections (Supabase > Dashboard)
- Storage usage (Supabase > Storage > Buckets)

# Critical searches in logs
vercel logs | grep ERROR
vercel logs | grep "Fatal\|Exception\|Failed"

# Database checks
SELECT COUNT(*) FROM inscription;  # Should be > 0
SELECT COUNT(*) FROM student;      # Should be > 0
```

### Days 2-7

```bash
# Daily monitoring
- Health check endpoint
- New user registrations
- File uploads
- Email delivery (if implemented)

# Performance metrics
- API response times (target: < 200ms)
- Database query times (target: < 100ms)
- Error rate (target: < 0.1%)

# Database maintenance
- Vacuum analyze
- Check index fragmentation
- Monitor slow queries
```

### Ongoing

```bash
# Weekly
- Review error logs
- Check storage quota
- Verify backups completed
- Test disaster recovery

# Monthly
- Database statistics
- Performance analysis
- Security audit
- Cost review
```

## Rollback Procedure

If critical issue found:

### Quick Rollback (< 5 minutes)

```bash
# GitHub > Deployments
# Find previous working deployment
# Click "Re-deploy" next to it

# OR via CLI
git revert HEAD --no-edit
git push origin main
# Vercel auto-deploys and rollsback

# Time: ~2 minutes
```

### Database Rollback

```bash
# If bad migration applied

# 1. Restore from backup
vercel env pull  # Get current env
supabase db reset

# 2. Or manually
psql $DATABASE_URL < backup.sql

# 3. Verify
SELECT COUNT(*) FROM admin;
```

### Full Rollback Plan

If need to completely revert:

```bash
# 1. Point to previous version
git checkout v0.9.0
git tag v0.9.0-hotfix
git push origin v0.9.0-hotfix

# 2. Redeploy
vercel --prod

# 3. Monitor
# Wait 5 minutes for stability

# 4. Investigate
# Create incident report
# Root cause analysis
# Fix and test thoroughly before next attempt
```

## Disaster Recovery

### Complete System Restore

```bash
# 1. Database from backup (< 1 hour)
vercel env pull
supabase db restore

# 2. Files from backup (< 30 minutes)
supabase storage download partner-logos --recursive
supabase storage download student-documents --recursive

# 3. Redeploy application
git push origin main

# 4. Verify
# Run smoke tests
# Check data integrity
```

### Daily Backup Verification

```bash
# Supabase backups (automatic)
# Verify in: Settings > Backups > Daily

# Storage backup (manual)
# Run weekly:
for bucket in partner-logos student-documents; do
  echo "Backing up $bucket..."
  supabase storage download "$bucket" \
    --recursive \
    --output "./backups/$bucket"
done
```

## Performance Optimization

### Before Going Too Slow

```typescript
// 1. Add pagination
const paginated = students.slice(0, 50)

// 2. Add indexes (already done)
// Check: Supabase > SQL Editor > Inspect Indexes

// 3. Cache responses
import { cache } from 'react'

export const getFormations = cache(async () => {
  return prisma.formation.findMany()
})

// 4. Compress responses
// Already enabled by Vercel
```

### Database Performance

```sql
-- Check slow queries
SELECT query, calls, mean_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Add missing indexes
CREATE INDEX idx_student_email ON student(email);
CREATE INDEX idx_inscription_status ON inscription(status);

-- View query plan
EXPLAIN ANALYZE 
SELECT * FROM inscription 
WHERE status = 'Pending';
```

## Hotfix Release

For critical production bug:

```bash
# Create hotfix branch
git checkout -b hotfix/critical-bug main

# Make fix
# Test locally
pnpm test

# Commit
git commit -m "fix: critical bug fix"
git push origin hotfix/critical-bug

# Pull request to main
# After review/tests pass:
git checkout main
git merge hotfix/critical-bug
git push origin main

# Cleanup
git branch -d hotfix/critical-bug
```

## Maintenance Windows

Schedule maintenance during low-traffic hours:

```
Planned Maintenance Window
Date: Every 2nd Sunday
Time: 2:00 AM - 4:00 AM UTC
Duration: Up to 2 hours
Services: Database migration, backups, monitoring

Before:
- Announce via email/dashboard
- Schedule: 1 week notice

During:
- Monitor continuously
- Keep logs open

After:
- Verify all systems
- Clear cache if applicable
- Notify completion
```

## Incident Response

### Critical Issue (P1)

**Response time: 5 minutes**

1. **Page on-call engineer**
2. **Assess impact** (users affected, data loss?)
3. **Implement quick fix or rollback**
4. **Communicate status** to team
5. **Post-mortem** within 24 hours

### Major Issue (P2)

**Response time: 1 hour**

1. **Create incident ticket**
2. **Gather logs and data**
3. **Root cause analysis**
4. **Fix and test**
5. **Deploy and monitor**

### Minor Issue (P3)

**Response time: 24 hours**

1. **File GitHub issue**
2. **Plan fix in sprint**
3. **Fix in next release**

## Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'checking...',
    storage: 'checking...',
  }

  try {
    // Check database
    await prisma.admin.findFirst()
    health.database = 'ok'
  } catch {
    health.database = 'error'
    health.status = 'degraded'
  }

  try {
    // Check storage (optional)
    const supabase = createAdminSupabaseClient()
    await supabase.storage.listBuckets()
    health.storage = 'ok'
  } catch {
    health.storage = 'error'
  }

  const status = health.status === 'ok' ? 200 : 503
  return Response.json(health, { status })
}
```

Monitor via:
```bash
while true; do
  curl https://your-app.vercel.app/api/health | jq .
  sleep 60
done
```

---

**Last Updated:** February 17, 2026
**Runbook Version:** 1.0
**Next Review:** May 17, 2026
