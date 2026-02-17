import { Pool } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  // Migration runner requires DATABASE_URL. If not present, migrations will be skipped.
}

let pool: Pool | null = null
let migrated = false

function getPool() {
  if (!pool) {
    if (!DATABASE_URL) throw new Error('DATABASE_URL is not defined for migrations')
    pool = new Pool({ connectionString: DATABASE_URL })
  }
  return pool
}

const MIGRATION_SQL = `
-- Create formations
CREATE TABLE IF NOT EXISTS public.formations (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  capacity INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
  id BIGSERIAL PRIMARY KEY,
  formation_id BIGINT NOT NULL REFERENCES public.formations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Policies: profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'profiles_insert_own') THEN
    CREATE POLICY profiles_insert_own ON public.profiles
      FOR INSERT
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'profiles_select_own') THEN
    CREATE POLICY profiles_select_own ON public.profiles
      FOR SELECT
      USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'profiles_update_own') THEN
    CREATE POLICY profiles_update_own ON public.profiles
      FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'profiles_delete_own') THEN
    CREATE POLICY profiles_delete_own ON public.profiles
      FOR DELETE
      USING (auth.uid() = id);
  END IF;
END $$;

-- Policies: enrollments
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'enrollments_insert_own') THEN
    CREATE POLICY enrollments_insert_own ON public.enrollments
      FOR INSERT
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = student_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'enrollments_select_own') THEN
    CREATE POLICY enrollments_select_own ON public.enrollments
      FOR SELECT
      USING (auth.uid() = student_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'enrollments_update_own') THEN
    CREATE POLICY enrollments_update_own ON public.enrollments
      FOR UPDATE
      USING (auth.uid() = student_id)
      WITH CHECK (auth.uid() = student_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'enrollments_delete_own') THEN
    CREATE POLICY enrollments_delete_own ON public.enrollments
      FOR DELETE
      USING (auth.uid() = student_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_formations_start_date ON public.formations(start_date);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
`

/**
 * Ensure migration applied once per process. Throws on fatal errors.
 */
export async function ensureMigrations(): Promise<void> {
  if (migrated) return
  if (!DATABASE_URL) {
    // No DATABASE_URL: nothing to do (Supabase SQL editor should be used instead)
    migrated = true
    return
  }

  const pool = getPool()
  const client = await pool.connect()
  try {
    // check for formations table
    const { rows } = await client.query(`SELECT to_regclass('public.formations') as exists`)
    const exists = rows?.[0]?.exists
    if (!exists) {
      // run migration SQL
      await client.query('BEGIN')
      await client.query(MIGRATION_SQL)
      await client.query('COMMIT')
    }
    migrated = true
  } catch (err) {
    try {
      await client.query('ROLLBACK')
    } catch (_) {}
    console.error('Migration error', err)
    throw err
  } finally {
    client.release()
  }
}
