import { createSupabaseServiceRoleClient } from './supabaseClient'

/**
 * Runtime database initialization - automatically creates tables if they don't exist
 * 
 * Requires DATABASE_URL environment variable:
 * - Find it in: Supabase Dashboard > Settings > Database > Connection string (URI)
 * - Format: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
 * - Add to .env.local as: DATABASE_URL=postgresql://...
 */

/**
 * Get SQL for creating all required tables
 */
function getTableCreationSQL(): string {
  return `
-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  status      TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FORMATIONS TABLE
CREATE TABLE IF NOT EXISTS public.formations (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT,
  category    TEXT,
  duration    TEXT,
  status      TEXT NOT NULL DEFAULT 'Active',
  description TEXT,
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id                   BIGSERIAL PRIMARY KEY,
  type                 TEXT NOT NULL CHECK (type IN ('Individual', 'Company')),
  email                TEXT NOT NULL,
  phone                TEXT,
  "firstName"          TEXT,
  "lastName"           TEXT,
  "dateOfBirth"        DATE,
  "companyName"        TEXT,
  "companyStudentCount" INTEGER,
  "formationId"       BIGINT REFERENCES public.formations(id) ON DELETE SET NULL,
  status               TEXT NOT NULL DEFAULT 'Active',
  enrolled_date        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS students_email_idx ON public.students (LOWER(email));

-- INSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.inscriptions (
  id               BIGSERIAL PRIMARY KEY,
  "studentId"      BIGINT REFERENCES public.students(id) ON DELETE CASCADE,
  "formationId"   BIGINT REFERENCES public.formations(id) ON DELETE CASCADE,
  type             TEXT NOT NULL,
  "requestorName"  TEXT NOT NULL,
  "requestorEmail" TEXT NOT NULL,
  "requestorPhone" TEXT,
  "startDate"      DATE NOT NULL,
  "numberOfStudents" INTEGER NOT NULL DEFAULT 1,
  status           TEXT NOT NULL DEFAULT 'Pending',
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PARTNERS TABLE
CREATE TABLE IF NOT EXISTS public.partners (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  website    TEXT,
  logo_url   TEXT,
  featured   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ADMIN TABLE
CREATE TABLE IF NOT EXISTS public.admin (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CONTACT_MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY,
  full_name  TEXT,
  phone      TEXT,
  bio        TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
  `.trim()
}

/**
 * Create tables using direct PostgreSQL connection
 */
async function createTablesViaPostgres(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
  
  if (!dbUrl) {
    console.error('[DB INIT] ⚠️  DATABASE_URL not found in environment variables.')
    console.error('[DB INIT] To enable automatic table creation, add DATABASE_URL to .env.local')
    console.error('[DB INIT] Find it in: Supabase Dashboard > Settings > Database > Connection string (URI)')
    console.error('[DB INIT] Format: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres')
    throw new Error('DATABASE_URL environment variable is required for automatic table creation. Add it to .env.local')
  }
  
  // Dynamically import pg (PostgreSQL client)
  let Client: any
  try {
    const pgModule = await import('pg')
    Client = pgModule.Client
  } catch (importError) {
    console.error('[DB INIT] pg library not found.')
    console.error('[DB INIT] Run: npm install pg @types/pg')
    throw new Error('pg library is required. Install it with: npm install pg @types/pg')
  }
  
  const client = new Client({ connectionString: dbUrl })
  
  try {
    await client.connect()
    console.log('[DB INIT] ✅ Connected to PostgreSQL database')
    console.log('[DB INIT] Creating tables...')
    
    const sql = getTableCreationSQL()
    await client.query(sql)
    
    console.log('[DB INIT] ✅ All tables created successfully!')
  } catch (error: any) {
    console.error('[DB INIT] ❌ Error creating tables:', error.message)
    // If tables already exist, that's fine - don't throw
    if (error.message && !error.message.includes('already exists') && !error.message.includes('duplicate')) {
      throw error
    }
    console.log('[DB INIT] Tables may already exist, continuing...')
  } finally {
    await client.end()
  }
}

const REQUIRED_TABLES = [
  'categories',
  'formations',
  'students',
  'inscriptions',
  'partners',
  'admin',
  'contact_messages',
  'profiles',
] as const

let initialized = false

/**
 * Runtime database initialization - automatically creates tables if they don't exist
 */
export async function ensureMigrations(): Promise<void> {
  if (initialized) return
  
  const supabase = createSupabaseServiceRoleClient()
  
  console.log('[DB INIT] Checking for required tables in Supabase...')
  
  const missingTables: string[] = []
  
  // Check which tables are missing
  for (const table of REQUIRED_TABLES) {
    const { error } = await supabase.from(table).select('*').limit(1)
    
    if (error) {
      const code = (error as any).code
      const message = (error as any).message as string | undefined
      
      if (code === '42P01' || (message && message.toLowerCase().includes('does not exist'))) {
        missingTables.push(table)
      } else {
        console.warn(`[DB INIT] Unexpected error checking table "${table}":`, error)
      }
    }
  }
  
  if (missingTables.length > 0) {
    console.log(`[DB INIT] Found ${missingTables.length} missing table(s):`, missingTables.join(', '))
    console.log('[DB INIT] Attempting to create tables automatically...')
    
    try {
      await createTablesViaPostgres()
      
      // Verify tables were created
      console.log('[DB INIT] Verifying tables were created...')
      for (const table of missingTables) {
        const { error } = await supabase.from(table).select('*').limit(1)
        if (error) {
          const code = (error as any).code
          const message = (error as any).message as string | undefined
          if (code === '42P01' || (message && message.toLowerCase().includes('does not exist'))) {
            console.error(`[DB INIT] ❌ Table "${table}" still missing after creation attempt`)
            throw new Error(`Failed to create table "${table}"`)
          }
        }
      }
      
      console.log('[DB INIT] ✅ All tables created and verified successfully!')
    } catch (error: any) {
      console.error('[DB INIT] ❌ Failed to create tables automatically:', error.message)
      console.error('[DB INIT] Make sure DATABASE_URL is set in .env.local')
      console.error('[DB INIT] You can find it in: Supabase Dashboard > Settings > Database > Connection string (URI)')
      throw error
    }
  } else {
    console.log('[DB INIT] ✅ All required tables are present.')
  }
  
  initialized = true
}
