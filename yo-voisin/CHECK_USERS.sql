-- Lister tous les utilisateurs avec leur statut de confirmation
SELECT 
  email,
  email_confirmed_at,
  created_at,
  id
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Vérifier les profils associés
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.phone,
  p.role,
  p.user_type,
  u.email,
  u.email_confirmed_at
FROM public.profiles p
LEFT JOIN auth.users u ON u.id = p.id
ORDER BY p.created_at DESC
LIMIT 5;
