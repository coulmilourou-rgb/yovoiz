-- ================================================
-- SCRIPT SIMPLIFIÉ - DONNÉES DE TEST
-- Email : tamoil@test.com
-- Date : 15 Février 2026
-- ================================================

-- Ce script insère uniquement les données essentielles
-- Compatible avec la structure actuelle de la base

-- ================================================
-- NETTOYAGE (optionnel - décommenter si besoin)
-- ================================================
/*
DELETE FROM profiles WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);
*/

-- ================================================
-- 1. CRÉER PROFILS PRESTATAIRES (VERSION SIMPLE)
-- ================================================

-- Méthode simplifiée : Ne spécifier que les colonnes essentielles
INSERT INTO profiles (id, first_name, last_name, phone, commune, role, provider_bio) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Jean', 'Kouassi', '+225 07 12 34 56 78', 'Cocody', 'provider', 'Plombier professionnel avec 10 ans d''expérience.'),
  ('22222222-2222-2222-2222-222222222222', 'Marie', 'Diallo', '+225 07 23 45 67 89', 'Plateau', 'provider', 'Spécialiste du ménage et entretien de maison.'),
  ('33333333-3333-3333-3333-333333333333', 'Ibrahim', 'Traoré', '+225 07 34 56 78 90', 'Marcory', 'provider', 'Électricien certifié, dépannage et installation électrique.'),
  ('44444444-4444-4444-4444-444444444444', 'Fatou', 'Koné', '+225 07 45 67 89 01', 'Yopougon', 'provider', 'Professeure de mathématiques, 8 ans d''expérience.'),
  ('55555555-5555-5555-5555-555555555555', 'Aya', 'Bamba', '+225 07 56 78 90 12', 'Adjamé', 'provider', 'Coiffeuse professionnelle, spécialisée en coiffure africaine.')
ON CONFLICT (id) DO UPDATE SET 
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  provider_bio = EXCLUDED.provider_bio,
  role = EXCLUDED.role;

-- Mettre Ibrahim en Gold
UPDATE profiles 
SET completed_missions = 35, average_rating = 4.5
WHERE id = '33333333-3333-3333-3333-333333333333';

-- ================================================
-- 2. OFFRES DE SERVICES
-- ================================================

INSERT INTO service_offers (profile_id, title, description, category, subcategory, price, price_type, communes, is_published, published_at) 
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Plomberie et dépannage urgent 24/7', 'Je propose des services de plomberie pour toute intervention : fuite d''eau, installation sanitaire, débouchage, réparation chauffe-eau.', 'Bricolage', 'Plomberie', 15000, 'fixed', ARRAY['Cocody', 'Plateau', 'Marcory'], true, NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Ménage et entretien de maison', 'Service de ménage complet : nettoyage, repassage, vaisselle. Produits fournis.', 'Ménage', 'Ménage complet', 3000, 'hourly', ARRAY['Plateau', 'Cocody', 'Marcory'], true, NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Installation et dépannage électrique', 'Électricien professionnel pour tous vos travaux : installation, réparation, mise aux normes.', 'Bricolage', 'Électricité', 20000, 'fixed', ARRAY['Marcory', 'Koumassi', 'Port-Bouët'], true, NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Cours particuliers de Mathématiques', 'Cours de maths pour collège et lycée. Préparation aux examens (BEPC, BAC).', 'Cours particuliers', 'Mathématiques', 5000, 'hourly', ARRAY['Yopougon', 'Abobo', 'Cocody'], true, NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Coiffure africaine et tresses', 'Tous types de coiffures : tresses, vanilles, nattes collées, tissage.', 'Beauté', 'Coiffure', 8000, 'fixed', ARRAY['Adjamé', 'Cocody', 'Yopougon'], true, NOW()),
  ('11111111-1111-1111-1111-111111111111', 'Entretien de jardin et espaces verts', 'Taille de haies, tonte de pelouse, désherbage, plantation.', 'Jardinage', 'Entretien jardin', 12000, 'fixed', ARRAY['Cocody', 'Riviera'], true, NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Peinture intérieure et extérieure', 'Peintre professionnel pour vos travaux de peinture.', 'Bricolage', 'Peinture', 25000, 'fixed', ARRAY['Marcory', 'Koumassi'], true, NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Cours d''anglais pour tous niveaux', 'Cours d''anglais débutant à avancé. Conversation, grammaire, préparation TOEFL.', 'Cours particuliers', 'Langues', 6000, 'hourly', ARRAY['Yopougon', 'Abobo', 'Cocody'], true, NOW())
ON CONFLICT DO NOTHING;

-- ================================================
-- 3. DEMANDES (avec votre email tamoil@test.com)
-- ================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur tamoil@test.com introuvable';
  END IF;

  INSERT INTO requests (requester_id, title, description, category, subcategory, budget, urgency, commune, status, published_at) VALUES
    (v_user_id, 'Réparation urgente fuite d''eau', 'J''ai une fuite d''eau importante sous mon évier de cuisine.', 'Bricolage', 'Plomberie', 20000, 'urgent', 'Cocody', 'published', NOW() - INTERVAL '2 days'),
    (v_user_id, 'Ménage hebdomadaire pour appartement', 'Recherche une personne de confiance pour faire le ménage tous les samedis.', 'Ménage', 'Ménage complet', 12000, 'flexible', 'Cocody', 'published', NOW() - INTERVAL '5 days'),
    (v_user_id, 'Cours de maths niveau Terminale', 'Mon fils a besoin de soutien en maths pour préparer le BAC.', 'Cours particuliers', 'Mathématiques', 40000, 'medium', 'Cocody', 'published', NOW() - INTERVAL '1 day'),
    (v_user_id, 'Installation de climatiseurs', 'Installation de 2 climatiseurs avec câblage électrique.', 'Bricolage', 'Électricité', 150000, 'flexible', 'Marcory', 'published', NOW() - INTERVAL '3 days'),
    (v_user_id, 'Coiffure à domicile - tresses', 'Recherche coiffeuse pour des tresses à domicile ce weekend.', 'Beauté', 'Coiffure', 15000, 'urgent', 'Cocody', 'published', NOW() - INTERVAL '6 hours');

  RAISE NOTICE '✅ 5 demandes créées pour tamoil@test.com';
END $$;

-- ================================================
-- 4. CONVERSATIONS
-- ================================================

DO $$
DECLARE
  v_user_id UUID;
  v_conv1 UUID;
  v_conv2 UUID;
  v_conv3 UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';

  INSERT INTO conversations (user1_id, user2_id, last_message_at) 
  VALUES (v_user_id, '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 hour')
  RETURNING id INTO v_conv1;

  INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES
    (v_conv1, '11111111-1111-1111-1111-111111111111', 'Bonjour ! J''ai vu votre demande pour la fuite d''eau. Je peux intervenir dès demain.', NOW() - INTERVAL '1 hour'),
    (v_conv1, v_user_id, 'Bonjour Jean, merci ! Vers quelle heure ?', NOW() - INTERVAL '50 minutes'),
    (v_conv1, '11111111-1111-1111-1111-111111111111', 'Entre 9h et 10h. Envoyez-moi votre adresse.', NOW() - INTERVAL '45 minutes'),
    (v_conv1, v_user_id, 'Cocody Riviera 3, Rue des Jardins, Villa 25. À demain !', NOW() - INTERVAL '40 minutes');

  INSERT INTO conversations (user1_id, user2_id, last_message_at) 
  VALUES (v_user_id, '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days')
  RETURNING id INTO v_conv2;

  INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES
    (v_conv2, '22222222-2222-2222-2222-222222222222', 'Bonjour ! Je suis disponible pour le ménage hebdomadaire. 3000 FCFA/heure.', NOW() - INTERVAL '2 days'),
    (v_conv2, v_user_id, 'Bonjour Marie, donc 12 000 FCFA par semaine ? Produits fournis ?', NOW() - INTERVAL '2 days' + INTERVAL '10 minutes'),
    (v_conv2, '22222222-2222-2222-2222-222222222222', 'Oui exactement. Je fournis tous les produits.', NOW() - INTERVAL '2 days' + INTERVAL '15 minutes'),
    (v_conv2, v_user_id, 'Super ! Ce samedi me convient.', NOW() - INTERVAL '2 days' + INTERVAL '20 minutes'),
    (v_conv2, '22222222-2222-2222-2222-222222222222', 'Parfait ! Samedi 8h. Envoyez-moi l''adresse.', NOW() - INTERVAL '2 days' + INTERVAL '25 minutes');

  INSERT INTO conversations (user1_id, user2_id, last_message_at) 
  VALUES (v_user_id, '44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '5 hours')
  RETURNING id INTO v_conv3;

  INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES
    (v_conv3, '44444444-4444-4444-4444-444444444444', 'Bonjour ! Je donne des cours de maths niveau Terminale. 5000 FCFA/heure.', NOW() - INTERVAL '5 hours'),
    (v_conv3, v_user_id, 'Quels sont vos horaires disponibles ?', NOW() - INTERVAL '4 hours 50 minutes'),
    (v_conv3, '44444444-4444-4444-4444-444444444444', 'Mercredis 14h-18h et samedis 9h-12h. 2 séances de 2h par semaine ?', NOW() - INTERVAL '4 hours 40 minutes'),
    (v_conv3, v_user_id, 'Parfait ! Mercredi 14h-16h et samedi 10h-12h.', NOW() - INTERVAL '4 hours 30 minutes');

  RAISE NOTICE '✅ 3 conversations créées';
END $$;

-- ================================================
-- 5. PROPOSITIONS
-- ================================================

DO $$
DECLARE
  v_user_id UUID;
  v_request_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  SELECT id INTO v_request_id FROM requests 
  WHERE requester_id = v_user_id AND category = 'Bricolage' LIMIT 1;

  IF v_request_id IS NOT NULL THEN
    INSERT INTO negotiations (request_id, provider_id, client_id, proposed_amount, message, status, created_at)
    VALUES (v_request_id, '11111111-1111-1111-1111-111111111111', v_user_id, 18000, 'Je peux intervenir rapidement. 18 000 FCFA tout compris.', 'pending', NOW() - INTERVAL '2 hours');
  END IF;

  SELECT id INTO v_request_id FROM requests 
  WHERE requester_id = v_user_id AND category = 'Ménage' LIMIT 1;

  IF v_request_id IS NOT NULL THEN
    INSERT INTO negotiations (request_id, provider_id, client_id, proposed_amount, message, status, created_at)
    VALUES (v_request_id, '22222222-2222-2222-2222-222222222222', v_user_id, 12000, 'Disponible pour le ménage hebdomadaire. Je fournis les produits.', 'accepted', NOW() - INTERVAL '3 days');
  END IF;

  RAISE NOTICE '✅ 2 propositions créées';
END $$;

-- ================================================
-- VÉRIFICATION
-- ================================================

SELECT '✅ Profils prestataires' AS type, COUNT(*) AS total FROM profiles WHERE role = 'provider';
SELECT '✅ Offres publiées' AS type, COUNT(*) AS total FROM service_offers WHERE is_published = true;
SELECT '✅ Demandes publiées' AS type, COUNT(*) AS total FROM requests WHERE requester_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com');
SELECT '✅ Conversations' AS type, COUNT(*) AS total FROM conversations WHERE user1_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com') OR user2_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com');
SELECT '✅ Messages' AS type, COUNT(*) AS total FROM messages;
SELECT '✅ Propositions' AS type, COUNT(*) AS total FROM negotiations WHERE client_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com');

-- Afficher votre UUID
SELECT '📧 Votre compte' AS info, id, email, created_at FROM auth.users WHERE email = 'tamoil@test.com';

-- ✅ TERMINÉ !
