-- Vérifier VOTRE profil en détail
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.role,
  p.is_pro,
  p.verification_status,
  p.commune,
  p.completed_missions,
  p.average_rating,
  u.email
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.email = 'tamoil@test.com';
