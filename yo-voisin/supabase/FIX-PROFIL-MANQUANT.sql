-- ================================================
-- FIX DÉFINITIF : Supprimer la contrainte problématique
-- puis mettre à jour le profil tamoil@test.com
-- ================================================

-- ÉTAPE 1 : Identifier et supprimer la contrainte profiles_role_check
DO $$
BEGIN
  -- Supprimer la contrainte si elle existe
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_role_check' 
      AND conrelid = 'profiles'::regclass
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
    RAISE NOTICE '✅ Contrainte profiles_role_check supprimée';
  ELSE
    RAISE NOTICE '⚠️  Contrainte profiles_role_check introuvable';
  END IF;
END $$;

-- ÉTAPE 2 : Mettre à jour votre profil en provider + PRO
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Utilisateur tamoil@test.com introuvable';
  END IF;
  
  -- Mise à jour du profil
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
    phone_verified = true,
    updated_at = NOW()
  WHERE id = v_user_id;
  
  RAISE NOTICE '✅ Profil tamoil@test.com mis à jour : provider + PRO activé';
  RAISE NOTICE '📧 UUID: %', v_user_id;
END $$;

-- ÉTAPE 3 : Créer les offres de services
DO $$
DECLARE
  v_user_id UUID;
  v_count INT;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  -- Supprimer les anciennes offres si elles existent
  DELETE FROM service_offers WHERE profile_id = v_user_id;
  
  INSERT INTO service_offers (profile_id, title, description, category, subcategory, price, price_type, communes, is_published, published_at) 
  VALUES
    (v_user_id, 'Plomberie et dépannage urgent 24/7', 'Services de plomberie : fuite d''eau, installation sanitaire, débouchage, réparation chauffe-eau.', 'Bricolage', 'Plomberie', 15000, 'fixed', ARRAY['Cocody', 'Plateau', 'Marcory'], true, NOW()),
    (v_user_id, 'Ménage et entretien de maison', 'Service de ménage complet : nettoyage, repassage, vaisselle. Produits fournis.', 'Ménage', 'Ménage complet', 3000, 'hourly', ARRAY['Plateau', 'Cocody', 'Marcory'], true, NOW()),
    (v_user_id, 'Installation et dépannage électrique', 'Électricien professionnel pour installation, réparation, mise aux normes.', 'Bricolage', 'Électricité', 20000, 'fixed', ARRAY['Marcory', 'Koumassi', 'Port-Bouët'], true, NOW()),
    (v_user_id, 'Cours particuliers de Mathématiques', 'Cours de maths pour collège et lycée. Préparation aux examens (BEPC, BAC).', 'Cours particuliers', 'Mathématiques', 5000, 'hourly', ARRAY['Yopougon', 'Abobo', 'Cocody'], true, NOW()),
    (v_user_id, 'Coiffure africaine et tresses', 'Tous types de coiffures : tresses, vanilles, nattes collées, tissage.', 'Beauté', 'Coiffure', 8000, 'fixed', ARRAY['Adjamé', 'Cocody', 'Yopougon'], true, NOW()),
    (v_user_id, 'Entretien de jardin et espaces verts', 'Taille de haies, tonte de pelouse, désherbage, plantation.', 'Jardinage', 'Entretien jardin', 12000, 'fixed', ARRAY['Cocody', 'Riviera'], true, NOW()),
    (v_user_id, 'Peinture intérieure et extérieure', 'Peintre professionnel pour vos travaux de peinture.', 'Bricolage', 'Peinture', 25000, 'fixed', ARRAY['Marcory', 'Koumassi'], true, NOW()),
    (v_user_id, 'Cours d''anglais pour tous niveaux', 'Cours d''anglais débutant à avancé. Conversation, grammaire, préparation TOEFL.', 'Cours particuliers', 'Langues', 6000, 'hourly', ARRAY['Yopougon', 'Abobo', 'Cocody'], true, NOW());
  
  SELECT COUNT(*) INTO v_count FROM service_offers WHERE profile_id = v_user_id;
  RAISE NOTICE '✅ % offres de services créées', v_count;
END $$;

-- ÉTAPE 4 : Créer les demandes
DO $$
DECLARE
  v_user_id UUID;
  v_count INT;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  -- Supprimer les anciennes demandes de test si elles existent
  DELETE FROM requests WHERE requester_id = v_user_id AND title LIKE '%test%';
  
  INSERT INTO requests (requester_id, title, description, category, subcategory, budget, urgency, commune, status, published_at) 
  VALUES
    (v_user_id, 'Réparation urgente fuite d''eau', 'J''ai une fuite d''eau importante sous mon évier de cuisine.', 'Bricolage', 'Plomberie', 20000, 'urgent', 'Cocody', 'published', NOW() - INTERVAL '2 days'),
    (v_user_id, 'Ménage hebdomadaire pour appartement', 'Recherche une personne de confiance pour faire le ménage tous les samedis.', 'Ménage', 'Ménage complet', 12000, 'flexible', 'Cocody', 'published', NOW() - INTERVAL '5 days'),
    (v_user_id, 'Cours de maths niveau Terminale', 'Mon fils a besoin de soutien en maths pour préparer le BAC.', 'Cours particuliers', 'Mathématiques', 40000, 'medium', 'Cocody', 'published', NOW() - INTERVAL '1 day'),
    (v_user_id, 'Installation de climatiseurs', 'Installation de 2 climatiseurs avec câblage électrique.', 'Bricolage', 'Électricité', 150000, 'flexible', 'Marcory', 'published', NOW() - INTERVAL '3 days'),
    (v_user_id, 'Coiffure à domicile - tresses', 'Recherche coiffeuse pour des tresses à domicile ce weekend.', 'Beauté', 'Coiffure', 15000, 'urgent', 'Cocody', 'published', NOW() - INTERVAL '6 hours')
  ON CONFLICT DO NOTHING;
  
  SELECT COUNT(*) INTO v_count FROM requests WHERE requester_id = v_user_id;
  RAISE NOTICE '✅ % demandes créées', v_count;
END $$;

-- ================================================
-- VÉRIFICATION FINALE
-- ================================================

DO $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
  v_is_pro BOOLEAN;
  v_offres INT;
  v_demandes INT;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  SELECT role, is_pro INTO v_role, v_is_pro FROM profiles WHERE id = v_user_id;
  SELECT COUNT(*) INTO v_offres FROM service_offers WHERE profile_id = v_user_id AND is_published = true;
  SELECT COUNT(*) INTO v_demandes FROM requests WHERE requester_id = v_user_id;
  
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '✅ INSTALLATION TERMINÉE AVEC SUCCÈS!';
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '📧 Email: tamoil@test.com';
  RAISE NOTICE '🆔 UUID: %', v_user_id;
  RAISE NOTICE '👤 Rôle: %', v_role;
  RAISE NOTICE '💎 Pro: %', CASE WHEN v_is_pro THEN 'OUI' ELSE 'NON' END;
  RAISE NOTICE '🎯 Offres publiées: %', v_offres;
  RAISE NOTICE '📋 Demandes: %', v_demandes;
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Testez maintenant:';
  RAISE NOTICE '   • /missions → Voir vos 8 offres';
  RAISE NOTICE '   • /offreurs → Vous voir comme prestataire';
  RAISE NOTICE '   • /profile/requests → Vos demandes';
  RAISE NOTICE '   • /abonnement → Accès PRO activé';
  RAISE NOTICE '';
END $$;

-- Afficher les données créées
SELECT 
  '🎯 OFFRES' AS "═══ TYPE ═══",
  LEFT(title, 40) AS "Titre",
  category AS "Catégorie",
  price AS "Prix (FCFA)",
  price_type AS "Type"
FROM service_offers 
WHERE profile_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com')
ORDER BY created_at DESC;

SELECT 
  '📋 DEMANDES' AS "═══ TYPE ═══",
  LEFT(title, 40) AS "Titre",
  category AS "Catégorie",
  budget AS "Budget (FCFA)",
  status AS "Statut"
FROM requests 
WHERE requester_id = (SELECT id FROM auth.users WHERE email = 'tamoil@test.com')
ORDER BY created_at DESC;
