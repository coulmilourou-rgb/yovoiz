-- ================================================
-- DIAGNOSTIC COMPLET DU SYSTÈME DE NOTIFICATION
-- ================================================

-- 1. Vérifier que les triggers existent
SELECT 
  'TRIGGERS' as check_type,
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name IN ('request_validated_trigger', 'new_message_trigger', 'profile_verified_trigger');

-- 2. Vérifier que la fonction call_email_notification existe
SELECT 
  'FONCTION' as check_type,
  proname as function_name,
  pg_get_functiondef(oid) as function_code
FROM pg_proc
WHERE proname = 'call_email_notification';

-- 3. Vérifier l'état de pg_net
SELECT 
  'PG_NET' as check_type,
  extname,
  extversion
FROM pg_extension
WHERE extname = 'pg_net';

-- 4. Tester MANUELLEMENT le trigger
DO $$
DECLARE
  test_request_id UUID;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST MANUEL DU TRIGGER';
  RAISE NOTICE '========================================';
  
  -- Récupérer l'ID de la dernière demande
  SELECT id INTO test_request_id
  FROM requests
  WHERE title LIKE '%Test notification%'
  ORDER BY created_at DESC
  LIMIT 1;
  
  RAISE NOTICE 'Demande test ID: %', test_request_id;
  
  -- Appeler MANUELLEMENT la fonction du trigger
  RAISE NOTICE 'Appel manuel de call_email_notification...';
  
  PERFORM call_email_notification(
    'request_validated',
    '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'::uuid,
    jsonb_build_object(
      'requestId', test_request_id,
      'title', 'Test manuel direct',
      'category', 'cleaning',
      'createdAt', NOW()
    )
  );
  
  RAISE NOTICE 'Appel terminé. Vérifiez les logs Edge Function dans 10 secondes.';
  RAISE NOTICE '========================================';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'ERREUR: %', SQLERRM;
END $$;

-- 5. Vérifier les demandes récentes
SELECT 
  'DEMANDES' as check_type,
  id,
  title,
  status,
  published_at,
  created_at
FROM requests
WHERE requester_id = '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'
ORDER BY created_at DESC
LIMIT 5;
