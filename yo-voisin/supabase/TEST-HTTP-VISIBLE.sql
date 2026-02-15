-- ================================================
-- TEST HTTP AVEC RÉSULTATS VISIBLES
-- ================================================
-- Capture le résultat dans une table temporaire
-- ================================================

-- Créer une table temporaire pour les résultats
CREATE TEMP TABLE IF NOT EXISTS http_test_results (
  test_id SERIAL,
  test_time TIMESTAMPTZ DEFAULT NOW(),
  http_status INTEGER,
  http_content TEXT,
  success BOOLEAN
);

-- Effectuer le test et stocker le résultat
DO $$
DECLARE
  test_response record;
BEGIN
  -- Appel HTTP
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
        'title', 'Test direct HTTP',
        'category', 'cleaning',
        'createdAt', NOW()
      )
    )::text
  );
  
  -- Sauvegarder le résultat
  INSERT INTO http_test_results (http_status, http_content, success)
  VALUES (
    test_response.status,
    test_response.content,
    test_response.status BETWEEN 200 AND 299
  );
  
EXCEPTION WHEN OTHERS THEN
  INSERT INTO http_test_results (http_status, http_content, success)
  VALUES (-1, SQLERRM, false);
END $$;

-- Afficher les résultats
SELECT 
  test_time as "⏰ Heure du test",
  http_status as "📊 Status HTTP",
  CASE 
    WHEN success THEN '✅ SUCCÈS'
    ELSE '❌ ÉCHEC'
  END as "Résultat",
  http_content as "📄 Réponse complète"
FROM http_test_results
ORDER BY test_id DESC
LIMIT 1;
