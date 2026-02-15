-- ================================================
-- TEST DIRECT DES DEUX VERSIONS HTTP_POST
-- ================================================

-- TEST 1 : Avec net.http_post (pg_net)
SELECT 'TEST 1: net.http_post' as test;

SELECT * FROM net.http_post(
  url := 'https://hfrmctsvpszqdizritoe.supabase.co/functions/v1/send-email-notification',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmcm1jdHN2cHN6cWRpenJpdG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MTI2NjksImV4cCI6MjA1NDQ4ODY2OX0.FBDgcNMo3RM9ZMRPekKjlI2BqgJnJqPXcZNmHDmYikg"}'::jsonb,
  body := '{"type": "request_validated", "userId": "8b8cb0f0-6712-445b-a9ed-a45aa78638d2", "data": {"requestId": "test-123", "title": "Test net.http_post", "category": "test"}}'::jsonb
);
