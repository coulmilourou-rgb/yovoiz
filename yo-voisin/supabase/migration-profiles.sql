-- ============================================
-- MIGRATION: Mise à jour table profiles existante
-- ============================================
-- À exécuter EN PREMIER avant schema-safe.sql
-- ============================================

-- 1. Créer les types ENUM s'ils n'existent pas
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('client', 'prestataire', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Ajouter les colonnes manquantes à profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_type user_type DEFAULT 'client';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ban_reason TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_missions_completed INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS premium_until TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Ajouter la contrainte UNIQUE sur referral_code (si pas déjà présente)
DO $$ BEGIN
  ALTER TABLE profiles ADD CONSTRAINT profiles_referral_code_key UNIQUE (referral_code);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. Ajouter la contrainte de clé étrangère pour referred_by (si pas déjà présente)
DO $$ BEGIN
  ALTER TABLE profiles ADD CONSTRAINT profiles_referred_by_fkey 
    FOREIGN KEY (referred_by) REFERENCES profiles(id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 5. Créer les index s'ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- Message de confirmation
DO $$ BEGIN
  RAISE NOTICE 'Migration profiles terminée avec succès!';
END $$;
