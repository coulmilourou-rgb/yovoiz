-- ═══════════════════════════════════════════════════════════════
-- 🔍 DIAGNOSTIC RLS - Row Level Security
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ Voir les policies RLS actuelles sur profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 2️⃣ Vérifier si RLS est activé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- 3️⃣ SOLUTION : Activer les bonnes policies
-- Supprimer toutes les anciennes policies
DROP POLICY IF EXISTS "Public profiles viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles viewable by authenticated" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Créer les policies correctes
CREATE POLICY "Enable read for authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4️⃣ Vérification
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'profiles';

SELECT '✅ Policies RLS configurées correctement!' as status;
