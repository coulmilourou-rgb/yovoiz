-- Migration simplifiée: Ajouter uniquement les colonnes Pro manquantes
-- Cette version vérifie d'abord la structure existante
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier la structure actuelle de la table profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Ajouter UNIQUEMENT les colonnes qui n'existent pas encore
-- Système d'abonnement Pro (colonnes minimales nécessaires)
DO $$ 
BEGIN
    -- is_pro
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'is_pro'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_pro BOOLEAN DEFAULT false;
        RAISE NOTICE '✅ Colonne is_pro ajoutée';
    ELSE
        RAISE NOTICE '⚠️  Colonne is_pro existe déjà';
    END IF;

    -- pro_started_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'pro_started_at'
    ) THEN
        ALTER TABLE profiles ADD COLUMN pro_started_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Colonne pro_started_at ajoutée';
    ELSE
        RAISE NOTICE '⚠️  Colonne pro_started_at existe déjà';
    END IF;

    -- pro_expires_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'pro_expires_at'
    ) THEN
        ALTER TABLE profiles ADD COLUMN pro_expires_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Colonne pro_expires_at ajoutée';
    ELSE
        RAISE NOTICE '⚠️  Colonne pro_expires_at existe déjà';
    END IF;

    -- commission_rate
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'commission_rate'
    ) THEN
        ALTER TABLE profiles ADD COLUMN commission_rate DECIMAL(4,3) DEFAULT 0.05;
        RAISE NOTICE '✅ Colonne commission_rate ajoutée';
    ELSE
        RAISE NOTICE '⚠️  Colonne commission_rate existe déjà';
    END IF;

    -- quartier
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'quartier'
    ) THEN
        ALTER TABLE profiles ADD COLUMN quartier VARCHAR(100);
        RAISE NOTICE '✅ Colonne quartier ajoutée';
    ELSE
        RAISE NOTICE '⚠️  Colonne quartier existe déjà';
    END IF;

    -- date_naissance
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'date_naissance'
    ) THEN
        ALTER TABLE profiles ADD COLUMN date_naissance DATE;
        RAISE NOTICE '✅ Colonne date_naissance ajoutée';
    ELSE
        RAISE NOTICE '⚠️  Colonne date_naissance existe déjà';
    END IF;

    -- service_zones
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'service_zones'
    ) THEN
        ALTER TABLE profiles ADD COLUMN service_zones TEXT[];
        RAISE NOTICE '✅ Colonne service_zones ajoutée';
    ELSE
        RAISE NOTICE '⚠️  Colonne service_zones existe déjà';
    END IF;

    -- categories
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'categories'
    ) THEN
        ALTER TABLE profiles ADD COLUMN categories TEXT[];
        RAISE NOTICE '✅ Colonne categories ajoutée';
    ELSE
        RAISE NOTICE '⚠️  Colonne categories existe déjà';
    END IF;

    -- total_ratings
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'total_ratings'
    ) THEN
        ALTER TABLE profiles ADD COLUMN total_ratings INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Colonne total_ratings ajoutée';
    ELSE
        RAISE NOTICE '⚠️  Colonne total_ratings existe déjà';
    END IF;

    -- response_time_avg
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'response_time_avg'
    ) THEN
        ALTER TABLE profiles ADD COLUMN response_time_avg INTEGER DEFAULT 24;
        RAISE NOTICE '✅ Colonne response_time_avg ajoutée';
    ELSE
        RAISE NOTICE '⚠️  Colonne response_time_avg existe déjà';
    END IF;

END $$;

-- 3. Créer les index (seulement s'ils n'existent pas)
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro ON profiles(is_pro) WHERE is_pro = true;
CREATE INDEX IF NOT EXISTS idx_profiles_pro_expires ON profiles(pro_expires_at) WHERE is_pro = true;
CREATE INDEX IF NOT EXISTS idx_profiles_quartier ON profiles(quartier);
CREATE INDEX IF NOT EXISTS idx_profiles_service_zones ON profiles USING GIN(service_zones);
CREATE INDEX IF NOT EXISTS idx_profiles_categories_new ON profiles USING GIN(categories);

-- 4. Activer le compte Pro pour tamoil@test.com (version simple)
UPDATE profiles
SET 
  is_pro = true,
  pro_started_at = NOW(),
  pro_expires_at = (NOW() + INTERVAL '1 year')::timestamp,
  commission_rate = 0.03,
  updated_at = NOW()
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'tamoil@test.com'
);

-- 5. Vérifier la mise à jour
SELECT 
  p.id,
  u.email,
  p.first_name,
  p.last_name,
  p.is_pro,
  p.pro_started_at,
  p.pro_expires_at,
  p.commission_rate
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'tamoil@test.com';

-- 6. Message de confirmation final
SELECT 
  '✅ Migration terminée avec succès!' as status,
  COUNT(*) FILTER (WHERE is_pro = true) as total_pro_users,
  COUNT(*) as total_users
FROM profiles;
