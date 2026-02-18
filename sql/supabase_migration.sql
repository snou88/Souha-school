/* ---------------------------
   Migration propre pour Supabase
   - utilise UUID partout (gen_random_uuid())
   - crée extension pgcrypto si nécessaire
   - recrée toutes les tables avec clés étrangères cohérentes
   --------------------------- */

-- 0) Activation de l'extension pour gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) (Optionnel / destructif) -- supprimer les anciennes tables conflictuelles
-- Exécute seulement si tu acceptes la perte des données existantes
DROP TABLE IF EXISTS public.inscriptions CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.partners CASCADE;
DROP TABLE IF EXISTS public.formations CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.admin CASCADE;

-- 2) Table categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3) Table formations (programmes) référencée sur categories(id)
CREATE TABLE IF NOT EXISTS public.formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  duration TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4) Table students
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'Individual', -- 'Individual' ou 'Company'
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  number INT DEFAULT 1, -- nombre de places / participants (si company)
  formation_id UUID REFERENCES public.formations(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Active',
  enrolled_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5) Table partners
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6) Table inscriptions (inscriptions aux formations)
CREATE TABLE IF NOT EXISTS public.inscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  formation_id UUID NOT NULL REFERENCES public.formations(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7) Table contact_messages
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

-- 8) Table admin
CREATE TABLE IF NOT EXISTS public.admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9) Indexes pour performances
CREATE INDEX IF NOT EXISTS idx_formations_status ON public.formations(status);
CREATE INDEX IF NOT EXISTS idx_formations_category ON public.formations(category_id);
CREATE INDEX IF NOT EXISTS idx_students_formation ON public.students(formation_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_partners_status ON public.partners(status);
CREATE INDEX IF NOT EXISTS idx_inscriptions_student ON public.inscriptions(student_id);
CREATE INDEX IF NOT EXISTS idx_inscriptions_formation ON public.inscriptions(formation_id);
CREATE INDEX IF NOT EXISTS idx_inscriptions_status ON public.inscriptions(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);

-- 10) Insertions par défaut (categories puis formations)
INSERT INTO public.categories (name, slug, status)
VALUES
  ('Development', 'development', 'Active'),
  ('Data', 'data', 'Active'),
  ('Design', 'design', 'Active'),
  ('Infrastructure', 'infrastructure', 'Active'),
  ('Security', 'security', 'Active')
ON CONFLICT (name) DO NOTHING;

-- Insertions de formations en utilisant l'id de category correspondant
INSERT INTO public.formations (name, category_id, duration, description, status)
VALUES
  (
    'Web Development',
    (SELECT id FROM public.categories WHERE name = 'Development'),
    '6 months',
    'Learn full-stack web development with modern frameworks',
    'Active'
  ),
  (
    'Data Science',
    (SELECT id FROM public.categories WHERE name = 'Data'),
    '6 months',
    'Master data analysis and machine learning',
    'Active'
  ),
  (
    'UI/UX Design',
    (SELECT id FROM public.categories WHERE name = 'Design'),
    '4 months',
    'Learn design principles and tools',
    'Active'
  ),
  (
    'Cloud Engineering',
    (SELECT id FROM public.categories WHERE name = 'Infrastructure'),
    '5 months',
    'AWS and cloud architecture',
    'Active'
  ),
  (
    'Cybersecurity',
    (SELECT id FROM public.categories WHERE name = 'Security'),
    '6 months',
    'Security fundamentals and best practices',
    'Active'
  )
ON CONFLICT (name) DO NOTHING;

-- Fin du script
