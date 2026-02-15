-- Migration: Ajouter colonne availability_hours à la table profiles
-- Date: 2026-02-14
-- Description: Permet de stocker les jours et plages horaires de disponibilité

BEGIN;

-- Ajouter la colonne availability_hours (JSONB pour flexibilité)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS availability_hours JSONB DEFAULT '{}'::jsonb;

-- Créer un index GIN pour recherches rapides
CREATE INDEX IF NOT EXISTS idx_profiles_availability_hours 
ON profiles USING GIN(availability_hours);

-- Commentaire
COMMENT ON COLUMN profiles.availability_hours IS 'Disponibilités du prestataire: jours, horaires, rayon';

-- Exemple de structure JSON attendue:
-- {
--   "jours": ["lundi", "mardi", "mercredi"],
--   "horaires": ["morning", "afternoon"],
--   "rayon": 10
-- }

COMMIT;

-- Vérification
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'availability_hours';
