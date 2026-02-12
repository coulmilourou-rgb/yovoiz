-- ✅ CONFIRMER MANUELLEMENT LES UTILISATEURS EXISTANTS

-- 1️⃣ Voir les utilisateurs non confirmés
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '⏳ NON CONFIRMÉ'
    ELSE '✅ CONFIRMÉ'
  END as statut
FROM auth.users
ORDER BY created_at DESC
LIMIT 20;

-- 2️⃣ Confirmer TOUS les utilisateurs existants (DEV uniquement)
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 3️⃣ Vérifier que tout le monde est confirmé
SELECT 
  COUNT(*) as total_users,
  COUNT(email_confirmed_at) as confirmed_users,
  COUNT(*) - COUNT(email_confirmed_at) as pending_users
FROM auth.users;

-- ══════════════════════════════════════════════════════════
-- 📝 NOTES :
-- ══════════════════════════════════════════════════════════
-- Ce script confirme manuellement les emails pour le développement.
-- En production, les utilisateurs devront confirmer via l'email.
