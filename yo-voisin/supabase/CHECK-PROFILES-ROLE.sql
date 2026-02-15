-- Vérifier votre profil et les autres profils
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  u.email,
  p.role,
  p.is_pro,
  p.verification_status,
  p.commune
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.email = 'tamoil@test.com';

-- Compter tous les profils par rôle
SELECT 
  role,
  COUNT(*) AS total
FROM profiles
GROUP BY role;

-- Voir tous les providers
SELECT 
  id,
  first_name,
  last_name,
  role,
  is_pro,
  verification_status
FROM profiles
WHERE role = 'provider';
