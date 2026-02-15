-- ================================================
-- DIAGNOSTIC COMPLET DU SYSTÈME EMAIL
-- ================================================
-- Vérifie que tout est correctement configuré
-- ================================================

-- 1️⃣ Vérifier que l'extension HTTP existe
SELECT 
  '✅ Extension HTTP' as check_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'http'
  ) THEN 'INSTALLÉE' ELSE '❌ MANQUANTE' END as status;

-- 2️⃣ Vérifier que les fonctions existent
SELECT 
  '✅ Fonction call_email_notification' as check_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'call_email_notification'
  ) THEN 'EXISTE' ELSE '❌ MANQUANTE' END as status;

-- 3️⃣ Vérifier que les triggers existent
SELECT 
  trigger_name,
  event_object_table as table_name,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name IN ('request_validated_trigger', 'new_message_trigger', 'profile_verified_trigger');

-- 4️⃣ Tester MANUELLEMENT l'appel de la fonction
DO $$
BEGIN
  RAISE NOTICE '🧪 Test manuel de l''envoi email...';
  
  PERFORM call_email_notification(
    'request_validated',
    '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'::uuid,
    jsonb_build_object(
      'requestId', '00000000-0000-0000-0000-000000000000',
      'title', 'Test manuel direct',
      'category', 'test',
      'createdAt', NOW()
    )
  );
  
  RAISE NOTICE '✅ Appel fonction terminé (vérifier logs Edge Function)';
END $$;

-- 5️⃣ Vérifier les demandes récentes
SELECT 
  id,
  title,
  status,
  requester_id,
  created_at,
  published_at
FROM requests
WHERE requester_id = '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'
ORDER BY created_at DESC
LIMIT 5;

-- 6️⃣ Vérifier le profil utilisateur (email)
SELECT 
  id,
  email,
  first_name,
  last_name
FROM auth.users
WHERE id = '8b8cb0f0-6712-445b-a9ed-a45aa78638d2';
