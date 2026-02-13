-- ═══════════════════════════════════════════════════════════════
-- 🧪 TEST DIRECT : Vérifier si l'utilisateur peut lire son profil
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ Tester en tant que service_role (devrait fonctionner)
SELECT 'Test service_role:' as test;
SELECT * FROM public.profiles WHERE id = '270013f1-2386-4601-a37f-4007ac213795';

-- 2️⃣ Voir l'état actuel de RLS
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'profiles';

-- 3️⃣ Voir toutes les policies actuelles
SELECT 
  policyname,
  cmd,
  qual::text as using_clause,
  with_check::text as with_check_clause
FROM pg_policies
WHERE tablename = 'profiles';

-- 4️⃣ DÉSACTIVER RLS temporairement pour débugger
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

SELECT '⚠️ RLS DÉSACTIVÉ pour debug - Tout le monde peut lire maintenant' as warning;

-- 5️⃣ Vérifier
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- ═══════════════════════════════════════════════════════════════
-- ⚠️ ATTENTION : RLS est maintenant DÉSACTIVÉ
-- ═══════════════════════════════════════════════════════════════
-- Cela signifie que tous les utilisateurs authentifiés peuvent lire
-- tous les profils. C'est TEMPORAIRE pour débugger.
-- Une fois que la connexion fonctionne, nous réactiverons RLS avec
-- les bonnes policies.
-- ═══════════════════════════════════════════════════════════════
