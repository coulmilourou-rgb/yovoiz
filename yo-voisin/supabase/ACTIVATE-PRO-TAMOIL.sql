-- Script pour activer le compte Pro pour tamoil@test.com
-- À exécuter dans Supabase SQL Editor

-- Mettre à jour le profil pour activer Pro
UPDATE profiles
SET 
  is_pro = true,
  pro_expires_at = (NOW() + INTERVAL '1 year')::timestamp,
  provider_level = 'gold',
  commission_rate = 0.03,
  updated_at = NOW()
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'tamoil@test.com'
);

-- Vérifier la mise à jour
SELECT 
  p.id,
  u.email,
  p.first_name,
  p.last_name,
  p.is_pro,
  p.pro_expires_at,
  p.provider_level,
  p.commission_rate
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'tamoil@test.com';

-- Message de confirmation
SELECT '✅ Compte Pro activé pour tamoil@test.com' as message;
