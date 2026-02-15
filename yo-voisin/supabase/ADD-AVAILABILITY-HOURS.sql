-- =====================================================
-- AJOUT COLONNE availability_hours DANS profiles
-- =====================================================
-- Pour gérer les disponibilités des prestataires
-- (jours et horaires d'intervention)

-- Ajouter la colonne si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'availability_hours'
  ) THEN
    ALTER TABLE profiles ADD COLUMN availability_hours JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE '✅ Colonne availability_hours ajoutée';
  ELSE
    RAISE NOTICE '⚠️  Colonne availability_hours existe déjà';
  END IF;
END $$;

-- Créer un index GIN pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_profiles_availability 
ON profiles USING GIN (availability_hours);

-- Vérifier la structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND column_name = 'availability_hours';

-- Exemple de données
-- availability_hours format:
-- {
--   "jours": ["lundi", "mardi", "mercredi"],
--   "horaires": ["morning", "afternoon"],
--   "rayon": 10
-- }

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Migration terminée !';
  RAISE NOTICE 'Colonne availability_hours (JSONB) disponible dans profiles';
END $$;
