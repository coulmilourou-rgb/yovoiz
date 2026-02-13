-- Vérifier si le profil existe pour l'utilisateur tamoil@test.com
SELECT 
  u.email,
  u.id as user_id,
  u.email_confirmed_at,
  p.id as profile_id,
  p.first_name,
  p.last_name,
  p.user_type,
  p.role,
  p.phone,
  p.commune
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'tamoil@test.com';

-- Si le profil existe, vérifier tous les champs
SELECT * FROM public.profiles WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'tamoil@test.com'
);
