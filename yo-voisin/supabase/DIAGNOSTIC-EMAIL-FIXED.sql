-- ================================================
-- DIAGNOSTIC CORRIGÉ + TEST AVEC LOGS DÉTAILLÉS
-- ================================================

-- 1️⃣ Vérifier l'extension HTTP
SELECT 
  '✅ Extension HTTP' as check_name,
  CASE WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'http') 
    THEN 'INSTALLÉE' 
    ELSE '❌ MANQUANTE' 
  END as status;

-- 2️⃣ Vérifier les fonctions
SELECT 
  proname as fonction,
  prosrc as code_source
FROM pg_proc 
WHERE proname = 'call_email_notification';

-- 3️⃣ Vérifier les triggers
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name LIKE '%email%' OR trigger_name LIKE '%notification%' OR trigger_name IN ('request_validated_trigger', 'new_message_trigger');

-- 4️⃣ Vérifier votre profil (TABLE PROFILES, pas auth.users)
SELECT 
  id,
  email,
  first_name,
  last_name
FROM profiles
WHERE id = '8b8cb0f0-6712-445b-a9ed-a45aa78638d2';

-- 5️⃣ TEST MANUEL AVEC LOGS DÉTAILLÉS
DO $$
DECLARE
  test_response record;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🧪 ========================================';
  RAISE NOTICE '🧪 TEST MANUEL ENVOI EMAIL';
  RAISE NOTICE '🧪 ========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Destinataire: 8b8cb0f0-6712-445b-a9ed-a45aa78638d2';
  RAISE NOTICE '📧 Type: request_validated';
  RAISE NOTICE '';
  
  -- Appel avec récupération de la réponse
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
  
  RAISE NOTICE '📊 HTTP Status: %', test_response.status;
  RAISE NOTICE '📄 Response Body: %', test_response.content;
  RAISE NOTICE '';
  
  IF test_response.status = 200 THEN
    RAISE NOTICE '✅ SUCCÈS - Email envoyé';
  ELSE
    RAISE NOTICE '❌ ÉCHEC - Code: %', test_response.status;
    RAISE NOTICE '❌ Erreur: %', test_response.content;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '🧪 ========================================';
  RAISE NOTICE '🧪 FIN DU TEST';
  RAISE NOTICE '🧪 ========================================';
  RAISE NOTICE '';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ ERREUR CRITIQUE: %', SQLERRM;
  RAISE NOTICE '❌ Détails: %', SQLSTATE;
END $$;

-- 6️⃣ Vérifier les demandes récentes
SELECT 
  id,
  title,
  status,
  created_at,
  published_at
FROM requests
WHERE requester_id = '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'
ORDER BY created_at DESC
LIMIT 3;
