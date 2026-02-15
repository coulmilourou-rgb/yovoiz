-- ================================================
-- FIX : Corriger le trigger notify_profile_verified()
-- Le trigger utilise 'approved' mais l'enum est 'verified'
-- ================================================

-- ÉTAPE 1 : Vérifier les valeurs possibles de l'enum
DO $$
DECLARE
  enum_values TEXT;
BEGIN
  SELECT string_agg(enumlabel::TEXT, ', ' ORDER BY enumsortorder)
  INTO enum_values
  FROM pg_enum
  WHERE enumtypid = 'verification_status'::regtype;
  
  RAISE NOTICE '📋 Valeurs enum verification_status: %', enum_values;
END $$;

-- ÉTAPE 2 : Supprimer l'ancien trigger
DROP TRIGGER IF EXISTS profile_verified_trigger ON profiles;

-- ÉTAPE 3 : Recréer la fonction avec la bonne valeur
CREATE OR REPLACE FUNCTION notify_profile_verified()
RETURNS TRIGGER AS $$
BEGIN
  -- Utiliser 'verified' au lieu de 'approved'
  IF NEW.verification_status = 'verified' 
     AND (OLD.verification_status IS NULL OR OLD.verification_status != 'verified') 
  THEN
    RAISE NOTICE '📧 Profil vérifié : %', NEW.id;
    
    -- Appeler la fonction d'envoi d'email (si elle existe)
    -- PERFORM notify_user_profile_verified(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ÉTAPE 4 : Recréer le trigger
CREATE TRIGGER profile_verified_trigger
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_profile_verified();

DO $$
BEGIN
  RAISE NOTICE '✅ Trigger profile_verified_trigger corrigé';
END $$;

-- ================================================
-- MAINTENANT : Mettre à jour le profil tamoil@test.com
-- ================================================

-- Supprimer la contrainte profiles_role_check si elle existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_role_check' 
      AND conrelid = 'profiles'::regclass
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
    RAISE NOTICE '✅ Contrainte profiles_role_check supprimée';
  END IF;
END $$;

-- Mettre à jour le profil
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Utilisateur tamoil@test.com introuvable';
  END IF;
  
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
END $$;

-- Créer les offres de services
DO $$
DECLARE
  v_user_id UUID;
  v_count INT;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  DELETE FROM service_offers WHERE provider_id = v_user_id;
  
  INSERT INTO service_offers (
    provider_id, title, description, category, pricing_type, 
    price_fixed_min, price_fixed_max, price_hourly,
    communes, available_days, status
  ) 
  VALUES
    (v_user_id, 'Plomberie et dépannage urgent 24/7', 'Services de plomberie : fuite d''eau, installation sanitaire, débouchage, réparation chauffe-eau.', 'Bricolage', 'fixed', 15000, 20000, NULL, ARRAY['Cocody', 'Plateau', 'Marcory'], ARRAY['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'], 'active'),
    (v_user_id, 'Ménage et entretien de maison', 'Service de ménage complet : nettoyage, repassage, vaisselle. Produits fournis.', 'Ménage', 'hourly', NULL, NULL, 3000, ARRAY['Plateau', 'Cocody', 'Marcory'], ARRAY['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], 'active'),
    (v_user_id, 'Installation et dépannage électrique', 'Électricien professionnel pour installation, réparation, mise aux normes.', 'Bricolage', 'fixed', 20000, 30000, NULL, ARRAY['Marcory', 'Koumassi', 'Port-Bouët'], ARRAY['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'], 'active'),
    (v_user_id, 'Cours particuliers de Mathématiques', 'Cours de maths pour collège et lycée. Préparation aux examens (BEPC, BAC).', 'Cours particuliers', 'hourly', NULL, NULL, 5000, ARRAY['Yopougon', 'Abobo', 'Cocody'], ARRAY['mercredi', 'samedi', 'dimanche'], 'active'),
    (v_user_id, 'Coiffure africaine et tresses', 'Tous types de coiffures : tresses, vanilles, nattes collées, tissage.', 'Beauté', 'fixed', 8000, 15000, NULL, ARRAY['Adjamé', 'Cocody', 'Yopougon'], ARRAY['mardi', 'jeudi', 'samedi', 'dimanche'], 'active'),
    (v_user_id, 'Entretien de jardin et espaces verts', 'Taille de haies, tonte de pelouse, désherbage, plantation.', 'Jardinage', 'fixed', 12000, 18000, NULL, ARRAY['Cocody', 'Riviera'], ARRAY['lundi', 'mercredi', 'vendredi', 'samedi'], 'active'),
    (v_user_id, 'Peinture intérieure et extérieure', 'Peintre professionnel pour vos travaux de peinture.', 'Bricolage', 'fixed', 25000, 40000, NULL, ARRAY['Marcory', 'Koumassi'], ARRAY['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'], 'active'),
    (v_user_id, 'Cours d''anglais pour tous niveaux', 'Cours d''anglais débutant à avancé. Conversation, grammaire, préparation TOEFL.', 'Cours particuliers', 'hourly', NULL, NULL, 6000, ARRAY['Yopougon', 'Abobo', 'Cocody'], ARRAY['mardi', 'jeudi', 'samedi'], 'active');
  
  SELECT COUNT(*) INTO v_count FROM service_offers WHERE provider_id = v_user_id;
  RAISE NOTICE '✅ % offres de services créées', v_count;
END $$;

-- Créer les demandes
DO $$
DECLARE
  v_user_id UUID;
  v_count INT;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tamoil@test.com';
  
  INSERT INTO requests (
    requester_id, category_id, title, description, commune, 
    budget_min, budget_max, is_urgent, status, published_at
  ) 
  VALUES
    (v_user_id, 'bricolage', 'Réparation urgente fuite d''eau', 'J''ai une fuite d''eau importante sous mon évier de cuisine. Besoin d''intervention rapide.', 'Cocody', 15000, 25000, true, 'published', NOW() - INTERVAL '2 days'),
    (v_user_id, 'menage', 'Ménage hebdomadaire pour appartement', 'Recherche une personne de confiance pour faire le ménage tous les samedis. Appartement 3 pièces.', 'Cocody', 10000, 15000, false, 'published', NOW() - INTERVAL '5 days'),
    (v_user_id, 'cours-particuliers', 'Cours de maths niveau Terminale', 'Mon fils a besoin de soutien en maths pour préparer le BAC. 2 séances par semaine souhaitées.', 'Cocody', 30000, 50000, false, 'published', NOW() - INTERVAL '1 day'),
    (v_user_id, 'bricolage', 'Installation de climatiseurs', 'Installation de 2 climatiseurs avec câblage électrique. Matériel déjà acheté.', 'Marcory', 100000, 200000, false, 'published', NOW() - INTERVAL '3 days'),
    (v_user_id, 'beaute', 'Coiffure à domicile - tresses', 'Recherche coiffeuse pour des tresses à domicile ce weekend. Style africain.', 'Cocody', 10000, 20000, true, 'published', NOW() - INTERVAL '6 hours')
  ON CONFLICT DO NOTHING;
  
  SELECT COUNT(*) INTO v_count FROM requests WHERE requester_id = v_user_id;
  RAISE NOTICE '✅ % demandes créées', v_count;
END $$;

-- Vérification finale
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
  SELECT COUNT(*) INTO v_offres FROM service_offers WHERE provider_id = v_user_id AND status = 'active';
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
  RAISE NOTICE '🚀 TESTEZ MAINTENANT:';
  RAISE NOTICE '   • /missions → Voir vos 8 offres';
  RAISE NOTICE '   • /offreurs → Vous voir comme prestataire';
  RAISE NOTICE '   • /profile/requests → Vos demandes';
  RAISE NOTICE '   • /abonnement → Accès PRO activé';
END $$;
