-- Migration: Ajouter colonnes professionnelles au profil
-- Date: 2026-02-14
-- Description: Ajoute les colonnes pour les profils pros (entreprise, site web, photo de couverture)

BEGIN;

-- Ajouter les colonnes manquantes
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS company_description TEXT,
ADD COLUMN IF NOT EXISTS website VARCHAR(500),
ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Commentaires
COMMENT ON COLUMN profiles.company_name IS 'Nom de l''entreprise pour les pros';
COMMENT ON COLUMN profiles.company_description IS 'Description de l''entreprise';
COMMENT ON COLUMN profiles.website IS 'Site web de l''entreprise';
COMMENT ON COLUMN profiles.cover_url IS 'URL de la photo de couverture du profil';

COMMIT;

-- Vérification
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('company_name', 'company_description', 'website', 'cover_url');
