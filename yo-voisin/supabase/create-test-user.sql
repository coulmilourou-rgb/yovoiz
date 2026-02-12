-- ===================================================================
-- CRÉER UN UTILISATEUR TEST POUR YO! VOIZ
-- ===================================================================
-- Email: test@yovoiz.com
-- Mot de passe: Test1234!
-- ===================================================================

-- Créer l'utilisateur dans auth.users (table système Supabase)
-- Note: Le hash correspond au mot de passe "Test1234!" 
-- bcrypt hash: $2a$10$XYZ... (Supabase gère le hashing automatiquement)

-- IMPORTANT: Cette insertion doit être faite via l'interface Supabase
-- ou via l'API d'administration Supabase, pas directement en SQL.

-- Pour créer l'utilisateur TEST, utilise une des méthodes suivantes:

-- MÉTHODE 1: Via le Dashboard Supabase
-- 1. Va sur https://supabase.com/dashboard
-- 2. Sélectionne ton projet
-- 3. Authentication > Users > Add User
-- 4. Email: test@yovoiz.com
-- 5. Password: Test1234!
-- 6. Auto Confirm User: OUI (important!)

-- MÉTHODE 2: Via code Node.js (à exécuter localement)
-- const { createClient } = require('@supabase/supabase-js');
-- const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
-- 
-- await supabase.auth.admin.createUser({
--   email: 'test@yovoiz.com',
--   password: 'Test1234!',
--   email_confirm: true,
--   user_metadata: {
--     full_name: 'Utilisateur Test',
--     phone: '+2250700000000'
--   }
-- });

-- ===================================================================
-- APRÈS CRÉATION DE L'UTILISATEUR, CRÉER SON PROFIL
-- ===================================================================

-- Récupérer l'UUID de l'utilisateur créé
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Chercher l'utilisateur test (remplace par son vrai UUID après création)
  SELECT id INTO test_user_id 
  FROM auth.users 
  WHERE email = 'test@yovoiz.com' 
  LIMIT 1;

  -- Si l'utilisateur existe, créer son profil
  IF test_user_id IS NOT NULL THEN
    
    -- Créer le profil client
    INSERT INTO public.profiles (
      id,
      full_name,
      phone,
      commune,
      quartier,
      address_details,
      verification_status,
      email_verified,
      phone_verified,
      profile_completed
    ) VALUES (
      test_user_id,
      'Utilisateur Test Yo! Voiz',
      '+2250700000000',
      'Cocody',
      'Riviera Palmeraie',
      'Adresse de test',
      'verified',
      true,
      true,
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      verification_status = 'verified',
      email_verified = true,
      phone_verified = true,
      profile_completed = true;

    RAISE NOTICE '✅ Profil créé pour l''utilisateur test: %', test_user_id;
  ELSE
    RAISE NOTICE '❌ Utilisateur test@yovoiz.com non trouvé. Crée-le d''abord via le Dashboard Supabase.';
  END IF;
END $$;

-- ===================================================================
-- INSTRUCTIONS FINALES
-- ===================================================================

/*
📋 ÉTAPES À SUIVRE:

1️⃣ Va sur ton Dashboard Supabase:
   https://supabase.com/dashboard/project/YOUR_PROJECT/auth/users

2️⃣ Clique sur "Add User" (en haut à droite)

3️⃣ Remplis:
   - Email: test@yovoiz.com
   - Password: Test1234!
   - ✅ Coche "Auto Confirm User"

4️⃣ Clique sur "Create User"

5️⃣ Ensuite, reviens ici et exécute ce script SQL pour créer le profil

6️⃣ Tu pourras te connecter avec:
   📧 Email: test@yovoiz.com
   🔒 Mot de passe: Test1234!

✨ C'est prêt !
*/
