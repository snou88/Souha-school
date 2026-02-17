-- Supabase SQL migration for school enrollment system
-- Creates all necessary tables with proper schema

-- 1. Create admin table
CREATE TABLE IF NOT EXISTS public.admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Create formations table (training programs)
CREATE TABLE IF NOT EXISTS public.formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'Individual', -- 'Individual' or 'Company'
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  formation_id UUID REFERENCES public.formations(id),
  status TEXT DEFAULT 'Active',
  enrolled_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Create partners table
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Create inscriptions table
CREATE TABLE IF NOT EXISTS public.inscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'resolved'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_formations_status ON public.formations(status);
CREATE INDEX IF NOT EXISTS idx_formations_category ON public.formations(category);
CREATE INDEX IF NOT EXISTS idx_students_formation ON public.students(formation_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_partners_status ON public.partners(status);
CREATE INDEX IF NOT EXISTS idx_inscriptions_student ON public.inscriptions(student_id);
CREATE INDEX IF NOT EXISTS idx_inscriptions_formation ON public.inscriptions(formation_id);
CREATE INDEX IF NOT EXISTS idx_inscriptions_status ON public.inscriptions(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);

-- 8. Create default formation if it doesn't exist
INSERT INTO public.formations (name, category, duration, description, status)
VALUES 
  ('Web Development', 'Development', '6 months', 'Learn full-stack web development with modern frameworks', 'Active'),
  ('Data Science', 'Data', '6 months', 'Master data analysis and machine learning', 'Active'),
  ('UI/UX Design', 'Design', '4 months', 'Learn design principles and tools', 'Active'),
  ('Cloud Engineering', 'Infrastructure', '5 months', 'AWS and cloud architecture', 'Active'),
  ('Cybersecurity', 'Security', '6 months', 'Security fundamentals and best practices', 'Active')
ON CONFLICT (name) DO NOTHING;

-- End of migration
