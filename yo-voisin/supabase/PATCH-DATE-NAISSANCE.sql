-- =====================================================
-- PATCH: Ajout date de naissance + Assouplissement format téléphone
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- 1. Ajouter colonne date_of_birth
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- 2. Supprimer la contrainte stricte sur le téléphone
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS phone_format;

-- 3. Ajouter contrainte plus souple (8-15 chiffres)
ALTER TABLE profiles 
ADD CONSTRAINT phone_format_flexible CHECK (
  phone ~ '^(\+225)?[0-9]{8,15}$'
);

-- 4. Commentaire
COMMENT ON COLUMN profiles.date_of_birth IS 'Date de naissance de l\'utilisateur';

-- 5. Vérifier
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('date_of_birth', 'phone');
