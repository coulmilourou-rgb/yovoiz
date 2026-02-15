-- ================================================
-- DIAGNOSTIC : Vérifier les contraintes de profiles
-- ================================================

-- 1. Lister toutes les contraintes CHECK sur profiles
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass
  AND contype = 'c';

-- 2. Afficher toutes les colonnes de profiles
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Vérifier s'il existe une colonne user_type
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('user_type', 'role', 'is_provider');

-- 4. Afficher les triggers sur profiles
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'profiles';
