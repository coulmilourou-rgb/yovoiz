-- ═══════════════════════════════════════════════════════════════
-- 🚀 SOLUTION RADICALE : Créer Utilisateur Test Complet
-- ═══════════════════════════════════════════════════════════════
-- Cette approche crée un utilisateur de test directement en base
-- avec TOUTES les données nécessaires, sans passer par l'inscription.
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ Supprimer l'ancien utilisateur test si existe
DELETE FROM auth.users WHERE email = 'test@yovoiz.com';
DELETE FROM public.profiles WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'test@yovoiz.com'
);

-- 2️⃣ Créer l'utilisateur directement dans auth.users
-- Mot de passe : Test123456
-- (hash bcrypt de "Test123456")
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  last_sign_in_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@yovoiz.com',
  '$2a$10$gTfP8qGXWNBLqVq6P6e9yOLvVbAqxdZ8ZM5nW3ZvVwX4YqT2WzFJ2', -- "Test123456"
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Utilisateur","phone":"0700000000","user_type":"client","commune":"Abidjan","quartier":"Cocody"}',
  false,
  NOW()
) RETURNING id;

-- 3️⃣ Créer le profil correspondant
-- Note: Utilisez l'ID retourné ci-dessus
WITH new_user AS (
  SELECT id FROM auth.users WHERE email = 'test@yovoiz.com'
)
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  phone,
  phone_verified,
  user_type,
  role,
  commune,
  quartier,
  verification_status,
  is_active
)
SELECT
  id,
  'Test',
  'Utilisateur',
  '0700000000',
  true,
  'client'::user_type,
  'demandeur',
  'Abidjan',
  'Cocody',
  'pending'::verification_status,
  true
FROM new_user;

-- 4️⃣ Vérifier que tout est OK
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  p.first_name,
  p.last_name,
  p.user_type,
  p.role,
  p.is_active
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'test@yovoiz.com';

SELECT '✅ Utilisateur test créé : test@yovoiz.com / Test123456' as message;

-- ═══════════════════════════════════════════════════════════════
-- 📝 IDENTIFIANTS DE TEST:
-- ═══════════════════════════════════════════════════════════════
-- Email: test@yovoiz.com
-- Mot de passe: Test123456
-- 
-- Cet utilisateur a TOUT configuré :
-- - Email confirmé
-- - Profil complet
-- - Toutes les permissions
-- ═══════════════════════════════════════════════════════════════
