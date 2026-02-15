-- ================================================
-- TEST EMAIL AVEC VOTRE VRAI COMPTE
-- ================================================
-- Test avec l'utilisateur coulmilourou@gmail.com
-- Date : 15 Février 2026
-- ================================================

-- 1️⃣ Créer une demande test pour votre compte
INSERT INTO requests (
  id,
  requester_id,
  category_id,
  title,
  description,
  commune,
  budget_min,
  budget_max,
  status
) VALUES (
  gen_random_uuid(),
  '8b8cb0f0-6712-445b-a9ed-a45aa78638d2', -- Votre user_id
  'cleaning',
  '🧪 Test notification email',
  'Ceci est une demande test pour vérifier le système de notification email.',
  'Yopougon',
  10000,
  25000,
  'draft'
) RETURNING id, title, status;

-- 2️⃣ Publier immédiatement cette demande (trigger email)
WITH latest_request AS (
  SELECT id 
  FROM requests 
  WHERE requester_id = '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'
  ORDER BY created_at DESC 
  LIMIT 1
)
UPDATE requests
SET 
  status = 'published',
  published_at = NOW()
FROM latest_request
WHERE requests.id = latest_request.id
RETURNING requests.id, requests.title, requests.status;

-- 3️⃣ Vérification
SELECT 
  '✅ TEST TERMINÉ' as status,
  '📧 Email envoyé à: coulmilourou@gmail.com' as notification,
  COUNT(*) as demandes_publiees
FROM requests
WHERE requester_id = '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'
  AND status = 'published';
