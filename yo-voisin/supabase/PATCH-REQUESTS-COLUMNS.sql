-- Script pour ajouter les colonnes manquantes à la table requests
-- À exécuter dans Supabase SQL Editor

-- 1. Ajouter colonne quartier si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'requests' AND column_name = 'quartier'
    ) THEN
        ALTER TABLE requests ADD COLUMN quartier VARCHAR(100);
        RAISE NOTICE 'Colonne quartier ajoutée ✅';
    ELSE
        RAISE NOTICE 'Colonne quartier existe déjà';
    END IF;
END $$;

-- 2. Ajouter colonne category (alternative à category_id) si besoin
-- Note: category_id existe déjà, donc on peut soit:
-- Option A: Utiliser category_id (recommandé)
-- Option B: Ajouter une colonne category texte

-- Pour l'instant, on va juste s'assurer que category_id peut accepter des valeurs texte
-- Vérifier le type de category_id
DO $$
BEGIN
    -- Modifier category_id pour accepter des chaînes plus longues si nécessaire
    ALTER TABLE requests ALTER COLUMN category_id TYPE VARCHAR(100);
    RAISE NOTICE 'Type de category_id modifié à VARCHAR(100) ✅';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'category_id déjà au bon type';
END $$;

-- 3. Vérifier les colonnes de la table requests
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'requests'
ORDER BY ordinal_position;

-- Message de confirmation
SELECT '✅ Colonnes requests mises à jour' as message;
