-- Migration: Ajouter les colonnes pour le système d'abonnement Pro
-- À exécuter dans Supabase SQL Editor

-- 1. Ajouter les colonnes Pro à la table profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pro_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(4,3) DEFAULT 0.05; -- 5% par défaut, 3% pour Pro

-- 2. Ajouter des colonnes supplémentaires utiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS quartier VARCHAR(100),
ADD COLUMN IF NOT EXISTS date_naissance DATE,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS service_zones TEXT[], -- Zones d'intervention pour prestataires
ADD COLUMN IF NOT EXISTS categories TEXT[], -- Catégories de services
ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_time_avg INTEGER DEFAULT 24; -- Temps de réponse moyen en heures

-- 3. Ajouter des index pour les nouvelles colonnes
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro ON profiles(is_pro) WHERE is_pro = true;
CREATE INDEX IF NOT EXISTS idx_profiles_pro_expires ON profiles(pro_expires_at) WHERE is_pro = true;
CREATE INDEX IF NOT EXISTS idx_profiles_quartier ON profiles(quartier);
CREATE INDEX IF NOT EXISTS idx_profiles_service_zones ON profiles USING GIN(service_zones);
CREATE INDEX IF NOT EXISTS idx_profiles_categories ON profiles USING GIN(categories);

-- 4. Mettre à jour la contrainte pour le taux de commission
ALTER TABLE profiles
ADD CONSTRAINT valid_commission_rate CHECK (commission_rate >= 0 AND commission_rate <= 1);

-- 5. Activer le compte Pro pour tamoil@test.com
UPDATE profiles
SET 
  is_pro = true,
  pro_started_at = NOW(),
  pro_expires_at = (NOW() + INTERVAL '1 year')::timestamp,
  provider_level = 'gold',
  commission_rate = 0.03,
  updated_at = NOW()
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'tamoil@test.com'
);

-- 6. Vérifier la mise à jour
SELECT 
  p.id,
  u.email,
  p.first_name,
  p.last_name,
  p.is_pro,
  p.pro_started_at,
  p.pro_expires_at,
  p.provider_level,
  p.commission_rate
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'tamoil@test.com';

-- 7. Message de confirmation
SELECT 
  '✅ Colonnes Pro ajoutées avec succès!' as status,
  COUNT(*) FILTER (WHERE is_pro = true) as total_pro_users
FROM profiles;
