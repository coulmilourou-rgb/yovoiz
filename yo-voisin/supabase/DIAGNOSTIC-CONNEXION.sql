-- ═══════════════════════════════════════════════════════════════
-- 🔍 DIAGNOSTIC COMPLET - Comprendre Pourquoi la Connexion Échoue
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ Voir TOUS les utilisateurs et leur statut
SELECT 
  u.id,
  u.email,
  u.encrypted_password IS NOT NULL as has_password,
  u.email_confirmed_at,
  u.confirmed_at,
  u.created_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmé'
    ELSE '❌ Email NON confirmé'
  END as statut_email,
  u.banned_until,
  u.is_sso_user
FROM auth.users u
ORDER BY u.created_at DESC;

-- 2️⃣ Voir les profils correspondants
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.phone,
  p.user_type,
  p.role,
  p.is_active,
  p.is_banned,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;

-- 3️⃣ Jointure : utilisateurs + profils
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  p.first_name,
  p.last_name,
  p.is_active,
  p.is_banned
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 4️⃣ Vérifier les triggers actifs
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema IN ('public', 'auth')
ORDER BY trigger_name;

-- 5️⃣ Forcer la confirmation de TOUS les utilisateurs
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmation_token = NULL,
  confirmation_sent_at = NULL
WHERE email_confirmed_at IS NULL;

-- 6️⃣ Vérification finale
SELECT 
  COUNT(*) as total_users,
  COUNT(email_confirmed_at) as confirmed_users,
  COUNT(*) - COUNT(email_confirmed_at) as pending_users
FROM auth.users;

-- ═══════════════════════════════════════════════════════════════
-- 📝 INSTRUCTIONS:
-- ═══════════════════════════════════════════════════════════════
-- Exécutez ce script et envoyez-moi TOUS les résultats.
-- En particulier, envoyez-moi :
-- - Le résultat de la requête 1 (liste des utilisateurs)
-- - Le résultat de la requête 6 (comptage)
-- ═══════════════════════════════════════════════════════════════
