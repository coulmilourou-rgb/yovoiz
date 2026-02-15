-- ============================================
-- SCRIPT DE MIGRATION COMPLET
-- Date: 2026-02-14
-- Description: Correctifs périmètre + profil pro
-- ============================================

-- ============================================
-- MIGRATION 1: Ajouter availability_hours
-- ============================================

BEGIN;

-- Ajouter la colonne availability_hours (JSONB pour flexibilité)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS availability_hours JSONB DEFAULT '{}'::jsonb;

-- Créer un index GIN pour recherches rapides
CREATE INDEX IF NOT EXISTS idx_profiles_availability_hours 
ON profiles USING GIN(availability_hours);

-- Commentaire
COMMENT ON COLUMN profiles.availability_hours IS 'Disponibilités du prestataire: jours, horaires, rayon';

COMMIT;

RAISE NOTICE '✅ Migration 1 terminée: availability_hours ajoutée';

-- ============================================
-- MIGRATION 2: Ajouter colonnes entreprise
-- ============================================

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

RAISE NOTICE '✅ Migration 2 terminée: colonnes entreprise ajoutées';

-- ============================================
-- VÉRIFICATION FINALE
-- ============================================

-- Vérifier que toutes les colonnes existent
DO $$
DECLARE
    col_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name IN (
        'availability_hours', 
        'company_name', 
        'company_description', 
        'website', 
        'cover_url'
    );
    
    IF col_count = 5 THEN
        RAISE NOTICE '✅ VÉRIFICATION RÉUSSIE: Toutes les 5 colonnes existent';
        RAISE NOTICE '   - availability_hours';
        RAISE NOTICE '   - company_name';
        RAISE NOTICE '   - company_description';
        RAISE NOTICE '   - website';
        RAISE NOTICE '   - cover_url';
    ELSE
        RAISE WARNING '⚠️  ATTENTION: Seulement % colonne(s) trouvée(s) sur 5', col_count;
    END IF;
END $$;

-- Afficher les colonnes ajoutées
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN (
    'availability_hours', 
    'company_name', 
    'company_description', 
    'website', 
    'cover_url'
)
ORDER BY column_name;
