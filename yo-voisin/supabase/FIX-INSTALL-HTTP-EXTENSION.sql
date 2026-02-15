-- ================================================
-- INSTALLATION COMPLÈTE DE L'EXTENSION HTTP
-- ================================================
-- Résout le problème "schema net does not exist"
-- ================================================

-- 1️⃣ Créer l'extension HTTP (avec pg_net)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Alternative si pg_net n'existe pas
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- 2️⃣ Vérifier que l'extension est installée
SELECT 
  extname as "Extension",
  extversion as "Version",
  nspname as "Schema"
FROM pg_extension e
JOIN pg_namespace n ON n.oid = e.extnamespace
WHERE extname IN ('http', 'pg_net');

-- 3️⃣ Vérifier les fonctions disponibles
SELECT 
  n.nspname as schema,
  p.proname as function_name
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname LIKE '%http%';

-- 4️⃣ TEST après installation
DO $$
DECLARE
  test_response record;
BEGIN
  -- Essayer avec net.http_post (si pg_net est installé)
  BEGIN
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
          'requestId', gen_random_uuid(),
          'title', 'Test après installation',
          'category', 'test'
        )
      )::text
    );
    
    RAISE NOTICE '✅ net.http_post fonctionne - Status: %', test_response.status;
    RAISE NOTICE '📧 Response: %', test_response.content;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Erreur avec net.http_post: %', SQLERRM;
  END;
  
END $$;
