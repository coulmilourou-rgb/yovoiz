-- ================================================
-- DONNÉES DE TEST - VERSION ULTRA-SÉCURISÉE
-- Utilise UNIQUEMENT votre compte existant tamoil@test.com
-- ================================================

-- Ce script ne crée PAS de nouveaux profils
-- Il crée seulement des offres, demandes, conversations et messages
-- pour votre compte existant

-- ================================================
-- ÉTAPE 1 : VÉRIFIER VOTRE COMPTE
-- ================================================

DO $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
BEGIN
  SELECT id, role INTO v_user_id, v_role 
  FROM profiles 
  WHERE id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com');
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Compte tamoil@test.com introuvable dans profiles';
  END IF;
  
  RAISE NOTICE '✅ Compte trouvé: % (role: %)', v_user_id, v_role;
END $$;

-- ================================================
-- ÉTAPE 2 : METTRE À JOUR VOTRE PROFIL EN PROVIDER + PRO
-- ================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  -- Mise à jour progressive pour éviter les conflits de contraintes
  UPDATE profiles 
  SET 
    role = 'provider',
    provider_bio = 'Prestataire de services multi-compétences. Test account.',
    provider_experience_years = 5,
    is_pro = true,
    pro_started_at = NOW() - INTERVAL '30 days',
    pro_expires_at = NOW() + INTERVAL '335 days',
    commission_rate = 0.03,
    verification_status = 'verified',
    verified_at = NOW(),
    commune = COALESCE(commune, 'Cocody'),
    phone_verified = true,
    updated_at = NOW()
  WHERE id = v_user_id;
  
  RAISE NOTICE '✅ Profil tamoil@test.com mis à jour : provider + PRO';
END $$;

-- ================================================
-- ÉTAPE 3 : CRÉER VOS OFFRES DE SERVICES
-- ================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  INSERT INTO service_offers (profile_id, title, description, category, subcategory, price, price_type, communes, is_published, published_at) 
  VALUES
    (v_user_id, 'Plomberie et dépannage urgent 24/7', 'Services de plomberie : fuite d''eau, installation sanitaire, débouchage, réparation chauffe-eau.', 'Bricolage', 'Plomberie', 15000, 'fixed', ARRAY['Cocody', 'Plateau', 'Marcory'], true, NOW()),
    (v_user_id, 'Ménage et entretien de maison', 'Service de ménage complet : nettoyage, repassage, vaisselle. Produits fournis.', 'Ménage', 'Ménage complet', 3000, 'hourly', ARRAY['Plateau', 'Cocody', 'Marcory'], true, NOW()),
    (v_user_id, 'Installation et dépannage électrique', 'Électricien professionnel pour installation, réparation, mise aux normes.', 'Bricolage', 'Électricité', 20000, 'fixed', ARRAY['Marcory', 'Koumassi', 'Port-Bouët'], true, NOW()),
    (v_user_id, 'Cours particuliers de Mathématiques', 'Cours de maths pour collège et lycée. Préparation aux examens (BEPC, BAC).', 'Cours particuliers', 'Mathématiques', 5000, 'hourly', ARRAY['Yopougon', 'Abobo', 'Cocody'], true, NOW()),
    (v_user_id, 'Coiffure africaine et tresses', 'Tous types de coiffures : tresses, vanilles, nattes collées, tissage.', 'Beauté', 'Coiffure', 8000, 'fixed', ARRAY['Adjamé', 'Cocody', 'Yopougon'], true, NOW()),
    (v_user_id, 'Entretien de jardin et espaces verts', 'Taille de haies, tonte de pelouse, désherbage, plantation.', 'Jardinage', 'Entretien jardin', 12000, 'fixed', ARRAY['Cocody', 'Riviera'], true, NOW()),
    (v_user_id, 'Peinture intérieure et extérieure', 'Peintre professionnel pour vos travaux de peinture.', 'Bricolage', 'Peinture', 25000, 'fixed', ARRAY['Marcory', 'Koumassi'], true, NOW()),
    (v_user_id, 'Cours d''anglais pour tous niveaux', 'Cours d''anglais débutant à avancé. Conversation, grammaire, préparation TOEFL.', 'Cours particuliers', 'Langues', 6000, 'hourly', ARRAY['Yopougon', 'Abobo', 'Cocody'], true, NOW())
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE '✅ 8 offres de services créées';
END $$;

-- ================================================
-- ÉTAPE 4 : CRÉER VOS DEMANDES
-- ================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  INSERT INTO requests (requester_id, title, description, category, subcategory, budget, urgency, commune, status, published_at) 
  VALUES
    (v_user_id, 'Réparation urgente fuite d''eau', 'J''ai une fuite d''eau importante sous mon évier de cuisine.', 'Bricolage', 'Plomberie', 20000, 'urgent', 'Cocody', 'published', NOW() - INTERVAL '2 days'),
    (v_user_id, 'Ménage hebdomadaire pour appartement', 'Recherche une personne de confiance pour faire le ménage tous les samedis.', 'Ménage', 'Ménage complet', 12000, 'flexible', 'Cocody', 'published', NOW() - INTERVAL '5 days'),
    (v_user_id, 'Cours de maths niveau Terminale', 'Mon fils a besoin de soutien en maths pour préparer le BAC.', 'Cours particuliers', 'Mathématiques', 40000, 'medium', 'Cocody', 'published', NOW() - INTERVAL '1 day'),
    (v_user_id, 'Installation de climatiseurs', 'Installation de 2 climatiseurs avec câblage électrique.', 'Bricolage', 'Électricité', 150000, 'flexible', 'Marcory', 'published', NOW() - INTERVAL '3 days'),
    (v_user_id, 'Coiffure à domicile - tresses', 'Recherche coiffeuse pour des tresses à domicile ce weekend.', 'Beauté', 'Coiffure', 15000, 'urgent', 'Cocody', 'published', NOW() - INTERVAL '6 hours')
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE '✅ 5 demandes créées';
END $$;

-- ================================================
-- ÉTAPE 5 : CRÉER DES CONVERSATIONS DE TEST
-- ================================================

-- Note : Pour créer des conversations réalistes, il faudrait d'autres utilisateurs
-- Pour l'instant, on crée juste une structure vide que vous pourrez tester

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  RAISE NOTICE '⏭️  Conversations nécessitent d''autres utilisateurs (à créer manuellement via l''interface)';
END $$;

-- ================================================
-- VÉRIFICATION FINALE
-- ================================================

DO $$
DECLARE
  v_user_id UUID;
  v_offres INT;
  v_demandes INT;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  SELECT COUNT(*) INTO v_offres FROM service_offers WHERE profile_id = v_user_id AND is_published = true;
  SELECT COUNT(*) INTO v_demandes FROM requests WHERE requester_id = v_user_id AND status = 'published';
  
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '✅ RÉCAPITULATIF';
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '📧 Email: tamoil@test.com';
  RAISE NOTICE '🆔 UUID: %', v_user_id;
  RAISE NOTICE '🎯 Offres publiées: %', v_offres;
  RAISE NOTICE '📋 Demandes publiées: %', v_demandes;
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '✅ INSTALLATION TERMINÉE';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Vous pouvez maintenant tester:';
  RAISE NOTICE '   • Page /missions → voir vos 8 offres';
  RAISE NOTICE '   • Page /offreurs → vous voir comme prestataire';
  RAISE NOTICE '   • Page /profile/requests → voir vos 5 demandes';
  RAISE NOTICE '   • Abonnement Pro → actif (expires dans 335 jours)';
  RAISE NOTICE '═══════════════════════════════════════';
END $$;

-- Afficher les données créées
SELECT 
  '🎯 Offres' AS type,
  id,
  title,
  category,
  price,
  price_type
FROM service_offers 
WHERE profile_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com')
ORDER BY created_at DESC;

SELECT 
  '📋 Demandes' AS type,
  id,
  title,
  category,
  budget,
  status,
  published_at
FROM requests 
WHERE requester_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com')
ORDER BY created_at DESC;
