-- Supabase SQL migration for school enrollment system
-- 1) Creates tables: formations, profiles, enrollments
-- 2) Enables RLS on profiles and enrollments with example policies

-- 1. Create formations table (publicly readable)
CREATE TABLE IF NOT EXISTS public.formations (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  capacity INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Create profiles table (one-to-one with auth.users)
-- profiles.id is the user's uuid from auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id BIGSERIAL PRIMARY KEY,
  formation_id BIGINT NOT NULL REFERENCES public.formations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Enable Row Level Security (RLS) on profiles and enrollments
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- 5. Policies for profiles
-- Allow authenticated users to insert their own profile (id must equal auth.uid())
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);

-- Allow authenticated users to select their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to delete their own profile
CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- 6. Policies for enrollments
-- Allow authenticated users to insert an enrollment for themselves (student_id must equal auth.uid())
CREATE POLICY "enrollments_insert_own" ON public.enrollments
  FOR INSERT
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = student_id);

-- Allow users to select their own enrollments
CREATE POLICY "enrollments_select_own" ON public.enrollments
  FOR SELECT
  USING (auth.uid() = student_id);

-- Allow users to update their own enrollments (e.g., cancel)
CREATE POLICY "enrollments_update_own" ON public.enrollments
  FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Allow users to delete their own enrollments
CREATE POLICY "enrollments_delete_own" ON public.enrollments
  FOR DELETE
  USING (auth.uid() = student_id);

-- 7. Make formations publicly readable (SELECT)
-- No RLS enabled on formations, so SELECT is allowed by default.

-- 8. Optional: Indexes
CREATE INDEX IF NOT EXISTS idx_formations_start_date ON public.formations(start_date);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);

-- End of migration
