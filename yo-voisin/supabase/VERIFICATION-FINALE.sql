-- ================================================
-- VÉRIFICATION : Afficher toutes les données créées
-- ================================================

-- 1. Vérifier le profil
SELECT 
  '👤 PROFIL' AS "Type",
  id,
  first_name || ' ' || last_name AS "Nom complet",
  role AS "Rôle",
  is_pro AS "Pro?",
  provider_experience_years AS "Années exp.",
  verification_status AS "Statut vérif"
FROM profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com');

-- 2. Vérifier les offres de services
SELECT 
  '🎯 OFFRES' AS "Type",
  id,
  LEFT(title, 40) AS "Titre",
  category AS "Catégorie",
  pricing_type AS "Type prix",
  COALESCE(price_fixed_min, price_hourly) AS "Prix min/horaire",
  status AS "Statut"
FROM service_offers 
WHERE provider_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com')
ORDER BY created_at DESC;

-- 3. Vérifier les demandes
SELECT 
  '📋 DEMANDES' AS "Type",
  id,
  LEFT(title, 40) AS "Titre",
  category_id AS "Catégorie",
  budget_min AS "Budget min",
  budget_max AS "Budget max",
  is_urgent AS "Urgent?",
  status AS "Statut"
FROM requests 
WHERE requester_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com')
ORDER BY created_at DESC;

-- 4. Récapitulatif
SELECT 
  '📊 RÉCAPITULATIF' AS "══════════════",
  (SELECT COUNT(*) FROM service_offers WHERE provider_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com')) AS "Offres",
  (SELECT COUNT(*) FROM requests WHERE requester_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com')) AS "Demandes";
