-- ═══════════════════════════════════════════════════════════════
-- 🔍 DIAGNOSTIC COMPLET - Vérifier Structure Base de Données
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ Vérifier la structure de la table profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2️⃣ Vérifier les triggers actifs
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema IN ('public', 'auth')
ORDER BY trigger_name;

-- 3️⃣ Vérifier les utilisateurs existants
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  u.raw_user_meta_data
FROM auth.users u
ORDER BY u.created_at DESC
LIMIT 5;

-- 4️⃣ Vérifier les profils existants
SELECT 
  p.id,
  p.user_type,
  p.full_name,
  p.phone,
  p.commune,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC
LIMIT 5;

-- 5️⃣ Vérifier les foreign keys
SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'profiles'
  AND tc.table_schema = 'public';

-- ═══════════════════════════════════════════════════════════════
-- 📝 INSTRUCTIONS:
-- ═══════════════════════════════════════════════════════════════
-- Exécutez ce script et envoyez-moi TOUS les résultats.
-- Cela me permettra de voir exactement quelle est la structure
-- actuelle de votre base de données et d'identifier le problème.
-- ═══════════════════════════════════════════════════════════════
