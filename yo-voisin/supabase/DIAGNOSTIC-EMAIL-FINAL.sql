-- ================================================
-- DIAGNOSTIC FINAL - VERSION CORRIGÉE
-- ================================================

-- 1️⃣ Vérifier l'extension HTTP
SELECT 
  '✅ Extension HTTP' as check_name,
  CASE WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'http') 
    THEN 'INSTALLÉE' 
    ELSE '❌ MANQUANTE' 
  END as status;

-- 2️⃣ Vérifier que la fonction existe
SELECT 
  '✅ Fonction call_email_notification' as check_name,
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'call_email_notification') 
    THEN 'EXISTE' 
    ELSE '❌ MANQUANTE' 
  END as status;

-- 3️⃣ Vérifier les triggers
SELECT 
  trigger_name,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name IN ('request_validated_trigger', 'new_message_trigger', 'profile_verified_trigger');

-- 4️⃣ Vérifier votre profil
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  u.email
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.id = '8b8cb0f0-6712-445b-a9ed-a45aa78638d2';

-- 5️⃣ TEST DIRECT HTTP AVEC LOGS
DO $$
DECLARE
  test_response record;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST MANUEL ENVOI EMAIL';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Appel Edge Function en cours...';
  RAISE NOTICE '';
  
  -- Appel HTTP direct
  SELECT INTO test_response * FROM net.http_post(
    url := 'https://hfrmctsvpszqdizritoe.supabase.co/functions/v1/send-email-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmcm1jdHN2cHN6cWRpenJpdG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MTI2NjksImV4cCI6MjA1NDQ4ODY2OX0.FBDgcNMo3RM9ZMRPekKjlI2BqgJnJqPXcZNmHDmYikg'
    ),
    body := jsonb_build_object(
      'type', 'request_validated',
      'userId', '8b8cb0f0-6712-445b-a9ed-a45aa78638d2',
      'data', jsonb_build_object(
        'requestId', '00000000-0000-0000-0000-000000000000',
        'title', 'Test diagnostic manuel',
        'category', 'test',
        'createdAt', NOW()
      )
    )::text
  );
  
  RAISE NOTICE 'HTTP Status: %', test_response.status;
  RAISE NOTICE 'Response: %', test_response.content;
  RAISE NOTICE '';
  
  IF test_response.status BETWEEN 200 AND 299 THEN
    RAISE NOTICE '✅ SUCCÈS';
  ELSE
    RAISE NOTICE '❌ ÉCHEC - Status: %', test_response.status;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ ERREUR: %', SQLERRM;
END $$;
