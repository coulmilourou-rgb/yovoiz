-- ================================================
-- TEST FINAL APRÈS CORRECTION
-- ================================================
-- Teste l'envoi d'email avec la fonction corrigée
-- ================================================

SELECT * FROM net.http_post(
  url := 'https://hfrmctsvpszqdizritoe.supabase.co/functions/v1/send-email-notification',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmcm1jdHN2cHN6cWRpenJpdG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MTI2NjksImV4cCI6MjA1NDQ4ODY2OX0.FBDgcNMo3RM9ZMRPekKjlI2BqgJnJqPXcZNmHDmYikg"}'::jsonb,
  body := '{"type": "request_validated", "userId": "8b8cb0f0-6712-445b-a9ed-a45aa78638d2", "data": {"requestId": "test-final", "title": "Test email après correction", "category": "test"}}'::jsonb
);

-- Message d'information
SELECT '✅ Test lancé ! Vérifiez:' as info
UNION ALL
SELECT '1. Votre email coulmilourou@gmail.com (et spam)'
UNION ALL
SELECT '2. Les logs: https://supabase.com/dashboard/project/hfrmctsvpszqdizritoe/functions/send-email-notification/logs';
