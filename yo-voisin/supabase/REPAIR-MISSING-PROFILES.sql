-- Script de réparation complète pour les profils manquants
-- À exécuter dans Supabase SQL Editor

-- ÉTAPE 1: Trouver tous les utilisateurs sans profil
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT 
      au.id,
      au.email,
      au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN profiles p ON au.id = p.id
    WHERE p.id IS NULL
  LOOP
    RAISE NOTICE 'Création profil pour: % (%)', user_record.email, user_record.id;
    
    INSERT INTO profiles (
      id,
      email,
      first_name,
      last_name,
      phone,
      commune,
      quartier,
      user_type,
      role
    )
    VALUES (
      user_record.id,
      user_record.email,
      COALESCE(user_record.raw_user_meta_data->>'first_name', 'Utilisateur'),
      COALESCE(user_record.raw_user_meta_data->>'last_name', 'Nouveau'),
      COALESCE(user_record.raw_user_meta_data->>'phone', '0000000000'),
      COALESCE(user_record.raw_user_meta_data->>'commune', 'Abidjan'),
      COALESCE(user_record.raw_user_meta_data->>'quartier', ''),
      COALESCE(user_record.raw_user_meta_data->>'user_type', 'client'),
      COALESCE(user_record.raw_user_meta_data->>'role', 'demandeur')
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;

-- ÉTAPE 2: Vérifier que tous les profils ont été créés
SELECT 
  COUNT(*) as users_sans_profil
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- ÉTAPE 3: Lister tous les profils créés
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.role,
  p.created_at
FROM profiles p
ORDER BY p.created_at DESC
LIMIT 10;

-- Message de confirmation
SELECT 'Réparation des profils terminée ✅' as message;
