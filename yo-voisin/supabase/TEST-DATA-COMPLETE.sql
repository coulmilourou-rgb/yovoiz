-- ================================================
-- DONNÉES DE TEST COMPLÈTES - YO!VOIZ
-- Sections : Missions, Offreurs, Messagerie
-- Date : 15 Février 2026
-- ================================================

-- NOTE: Remplacez les UUIDs des profils existants si nécessaire
-- Pour récupérer vos profils existants :
-- SELECT id, email, first_name FROM auth.users LIMIT 5;

-- ================================================
-- 1. CRÉER DES PROFILS DE TEST (PRESTATAIRES)
-- ================================================

-- Insérer quelques utilisateurs de test
INSERT INTO profiles (
  id, 
  first_name, 
  last_name, 
  phone, 
  commune,
  avatar_url,
  provider_bio,
  role,
  provider_level
) VALUES 
-- Prestataire 1 : Jean Kouassi (Plombier)
(
  '11111111-1111-1111-1111-111111111111',
  'Jean',
  'Kouassi',
  '+225 07 12 34 56 78',
  'Cocody',
  null,
  'Plombier professionnel avec 10 ans d''expérience. Intervention rapide à Cocody et environs.',
  'provider',
  'standard'
),
-- Prestataire 2 : Marie Diallo (Ménage)
(
  '22222222-2222-2222-2222-222222222222',
  'Marie',
  'Diallo',
  '+225 07 23 45 67 89',
  'Plateau',
  null,
  'Spécialiste du ménage et entretien de maison. Service de qualité garantie.',
  'provider',
  'standard'
),
-- Prestataire 3 : Ibrahim Traoré (Électricien)
(
  '33333333-3333-3333-3333-333333333333',
  'Ibrahim',
  'Traoré',
  '+225 07 34 56 78 90',
  'Marcory',
  null,
  'Électricien certifié, dépannage et installation électrique.',
  'provider',
  'gold'
),
-- Prestataire 4 : Fatou Koné (Cours particuliers)
(
  '44444444-4444-4444-4444-444444444444',
  'Fatou',
  'Koné',
  '+225 07 45 67 89 01',
  'Yopougon',
  null,
  'Professeure de mathématiques, 8 ans d''expérience en cours particuliers.',
  'provider',
  'standard'
),
-- Prestataire 5 : Aya Bamba (Coiffure)
(
  '55555555-5555-5555-5555-555555555555',
  'Aya',
  'Bamba',
  '+225 07 56 78 90 12',
  'Adjamé',
  null,
  'Coiffeuse professionnelle, spécialisée en coiffure africaine et tresses.',
  'provider',
  'standard'
)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 2. CRÉER DES OFFRES DE SERVICES (OFFREURS)
-- ================================================

INSERT INTO service_offers (
  profile_id,
  title,
  description,
  category,
  subcategory,
  price,
  price_type,
  communes,
  is_published,
  published_at
) VALUES
-- Offre 1 : Plomberie
(
  '11111111-1111-1111-1111-111111111111',
  'Plomberie et dépannage urgent 24/7',
  'Je propose des services de plomberie pour toute intervention : fuite d''eau, installation sanitaire, débouchage, réparation chauffe-eau. Intervention rapide et tarifs compétitifs.',
  'Bricolage',
  'Plomberie',
  15000,
  'fixed',
  ARRAY['Cocody', 'Plateau', 'Marcory', 'Adjamé'],
  true,
  NOW()
),
-- Offre 2 : Ménage
(
  '22222222-2222-2222-2222-222222222222',
  'Ménage et entretien de maison',
  'Service de ménage complet : nettoyage, repassage, vaisselle. Produits fournis. Disponible du lundi au samedi.',
  'Ménage',
  'Ménage complet',
  3000,
  'hourly',
  ARRAY['Plateau', 'Cocody', 'Marcory'],
  true,
  NOW()
),
-- Offre 3 : Électricité
(
  '33333333-3333-3333-3333-333333333333',
  'Installation et dépannage électrique',
  'Électricien professionnel pour tous vos travaux : installation électrique, réparation, mise aux normes, dépannage urgent. Devis gratuit.',
  'Bricolage',
  'Électricité',
  20000,
  'fixed',
  ARRAY['Marcory', 'Koumassi', 'Port-Bouët', 'Treichville'],
  true,
  NOW()
),
-- Offre 4 : Cours de maths
(
  '44444444-4444-4444-4444-444444444444',
  'Cours particuliers de Mathématiques',
  'Cours de maths pour collège et lycée. Préparation aux examens (BEPC, BAC). Méthode pédagogique adaptée à chaque élève.',
  'Cours particuliers',
  'Mathématiques',
  5000,
  'hourly',
  ARRAY['Yopougon', 'Abobo', 'Cocody'],
  true,
  NOW()
),
-- Offre 5 : Coiffure
(
  '55555555-5555-5555-5555-555555555555',
  'Coiffure africaine et tresses',
  'Tous types de coiffures : tresses, vanilles, nattes collées, tissage. À domicile ou dans mon salon. Produits de qualité.',
  'Beauté',
  'Coiffure',
  8000,
  'fixed',
  ARRAY['Adjamé', 'Cocody', 'Yopougon', 'Abobo'],
  true,
  NOW()
),
-- Offre 6 : Jardinage
(
  '11111111-1111-1111-1111-111111111111',
  'Entretien de jardin et espaces verts',
  'Taille de haies, tonte de pelouse, désherbage, plantation. Entretien régulier ou ponctuel.',
  'Jardinage',
  'Entretien jardin',
  12000,
  'fixed',
  ARRAY['Cocody', 'Riviera', 'Deux-Plateaux'],
  true,
  NOW()
),
-- Offre 7 : Peinture
(
  '33333333-3333-3333-3333-333333333333',
  'Peinture intérieure et extérieure',
  'Peintre professionnel pour vos travaux de peinture. Devis gratuit, finitions soignées.',
  'Bricolage',
  'Peinture',
  25000,
  'fixed',
  ARRAY['Marcory', 'Koumassi', 'Port-Bouët'],
  true,
  NOW()
),
-- Offre 8 : Cours d'anglais
(
  '44444444-4444-4444-4444-444444444444',
  'Cours d''anglais pour tous niveaux',
  'Cours d''anglais débutant à avancé. Conversation, grammaire, préparation TOEFL. Cours en ligne disponibles.',
  'Cours particuliers',
  'Langues',
  6000,
  'hourly',
  ARRAY['Yopougon', 'Abobo', 'Cocody', 'Plateau'],
  true,
  NOW()
);

-- ================================================
-- 3. CRÉER DES DEMANDES DE SERVICES (MISSIONS)
-- ================================================

-- D'abord, récupérons l'ID de l'utilisateur principal (vous)
-- Remplacez par votre vrai UUID si différent
DO $$
DECLARE
  main_user_id UUID := '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'; -- Votre ID
BEGIN

  -- Demande 1 : Réparation fuite d'eau
  INSERT INTO requests (
    requester_id,
    title,
    description,
    category,
    subcategory,
    budget,
    urgency,
    commune,
    status,
    published_at
  ) VALUES (
    main_user_id,
    'Réparation urgente fuite d''eau',
    'J''ai une fuite d''eau importante sous mon évier de cuisine. Besoin d''un plombier rapidement.',
    'Bricolage',
    'Plomberie',
    20000,
    'urgent',
    'Cocody',
    'published',
    NOW() - INTERVAL '2 days'
  );

  -- Demande 2 : Ménage hebdomadaire
  INSERT INTO requests (
    requester_id,
    title,
    description,
    category,
    subcategory,
    budget,
    urgency,
    commune,
    status,
    published_at
  ) VALUES (
    main_user_id,
    'Ménage hebdomadaire pour appartement',
    'Recherche une personne de confiance pour faire le ménage de mon appartement 3 pièces tous les samedis matin.',
    'Ménage',
    'Ménage complet',
    12000,
    'flexible',
    'Cocody',
    'published',
    NOW() - INTERVAL '5 days'
  );

  -- Demande 3 : Cours de maths
  INSERT INTO requests (
    requester_id,
    title,
    description,
    category,
    subcategory,
    budget,
    urgency,
    commune,
    status,
    published_at
  ) VALUES (
    main_user_id,
    'Cours de maths niveau Terminale',
    'Mon fils est en Terminale S et a besoin de soutien en mathématiques pour préparer le BAC. 2h par semaine.',
    'Cours particuliers',
    'Mathématiques',
    40000,
    'medium',
    'Cocody',
    'published',
    NOW() - INTERVAL '1 day'
  );

  -- Demande 4 : Installation électrique
  INSERT INTO requests (
    requester_id,
    title,
    description,
    category,
    subcategory,
    budget,
    urgency,
    commune,
    status,
    published_at
  ) VALUES (
    main_user_id,
    'Installation de climatiseurs',
    'Installation de 2 climatiseurs dans mon appartement, avec câblage électrique.',
    'Bricolage',
    'Électricité',
    150000,
    'flexible',
    'Marcory',
    'published',
    NOW() - INTERVAL '3 days'
  );

  -- Demande 5 : Coiffure à domicile
  INSERT INTO requests (
    requester_id,
    title,
    description,
    category,
    subcategory,
    budget,
    urgency,
    commune,
    status,
    published_at
  ) VALUES (
    main_user_id,
    'Coiffure à domicile - tresses',
    'Recherche coiffeuse pour des tresses à domicile ce weekend.',
    'Beauté',
    'Coiffure',
    15000,
    'urgent',
    'Cocody',
    'published',
    NOW() - INTERVAL '6 hours'
  );

END $$;

-- ================================================
-- 4. CRÉER DES CONVERSATIONS ET MESSAGES
-- ================================================

DO $$
DECLARE
  main_user_id UUID := '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'; -- Votre ID
  conversation_1 UUID;
  conversation_2 UUID;
  conversation_3 UUID;
BEGIN

  -- Conversation 1 : Avec Jean Kouassi (Plombier)
  INSERT INTO conversations (user1_id, user2_id, last_message_at)
  VALUES (main_user_id, '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 hour')
  RETURNING id INTO conversation_1;

  INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES
  (conversation_1, '11111111-1111-1111-1111-111111111111', 'Bonjour ! J''ai vu votre demande pour la fuite d''eau. Je peux intervenir dès demain matin. Mon tarif est de 15 000 FCFA pour le déplacement et diagnostic.', NOW() - INTERVAL '1 hour'),
  (conversation_1, main_user_id, 'Bonjour Jean, merci pour votre réponse rapide ! Demain matin ça me convient parfaitement. Vers quelle heure pouvez-vous passer ?', NOW() - INTERVAL '50 minutes'),
  (conversation_1, '11111111-1111-1111-1111-111111111111', 'Je peux être chez vous entre 9h et 10h. Envoyez-moi votre adresse exacte par message.', NOW() - INTERVAL '45 minutes'),
  (conversation_1, main_user_id, 'Parfait ! Mon adresse : Cocody Riviera 3, Rue des Jardins, Villa 25. À demain !', NOW() - INTERVAL '40 minutes');

  -- Conversation 2 : Avec Marie Diallo (Ménage)
  INSERT INTO conversations (user1_id, user2_id, last_message_at)
  VALUES (main_user_id, '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days')
  RETURNING id INTO conversation_2;

  INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES
  (conversation_2, '22222222-2222-2222-2222-222222222222', 'Bonjour ! Je suis disponible pour le ménage hebdomadaire de votre appartement. Mon tarif est de 3000 FCFA/heure. Pour un 3 pièces, il faut compter environ 4h.', NOW() - INTERVAL '2 days'),
  (conversation_2, main_user_id, 'Bonjour Marie, merci. Donc ça ferait 12 000 FCFA par semaine c''est ça ? Est-ce que vous fournissez les produits ?', NOW() - INTERVAL '2 days' + INTERVAL '10 minutes'),
  (conversation_2, '22222222-2222-2222-2222-222222222222', 'Oui exactement, 12 000 FCFA. Je fournis tous les produits d''entretien (détergents, désinfectants, etc.). Je peux commencer dès ce samedi si vous voulez.', NOW() - INTERVAL '2 days' + INTERVAL '15 minutes'),
  (conversation_2, main_user_id, 'Super ! Ce samedi me convient. Pouvez-vous venir vers 8h du matin ?', NOW() - INTERVAL '2 days' + INTERVAL '20 minutes'),
  (conversation_2, '22222222-2222-2222-2222-222222222222', 'Parfait ! Samedi 8h, c''est noté. Envoyez-moi l''adresse et votre numéro, je vous confirme la veille.', NOW() - INTERVAL '2 days' + INTERVAL '25 minutes');

  -- Conversation 3 : Avec Fatou Koné (Cours)
  INSERT INTO conversations (user1_id, user2_id, last_message_at)
  VALUES (main_user_id, '44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '5 hours')
  RETURNING id INTO conversation_3;

  INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES
  (conversation_3, '44444444-4444-4444-4444-444444444444', 'Bonjour ! Je donne des cours de maths niveau Terminale. Je peux aider votre fils à préparer le BAC. Mon tarif est de 5000 FCFA/heure.', NOW() - INTERVAL '5 hours'),
  (conversation_3, main_user_id, 'Bonjour Fatou, merci. Quels sont vos horaires disponibles ? Mon fils est libre les mercredis après-midi et les samedis.', NOW() - INTERVAL '4 hours 50 minutes'),
  (conversation_3, '44444444-4444-4444-4444-444444444444', 'Je suis disponible les mercredis de 14h à 18h et les samedis de 9h à 12h. On peut faire 2 séances de 2h par semaine. Ça vous convient ?', NOW() - INTERVAL '4 hours 40 minutes'),
  (conversation_3, main_user_id, 'Oui parfait ! Mercredi 14h-16h et samedi 10h-12h. Quand pouvez-vous commencer ?', NOW() - INTERVAL '4 hours 30 minutes'),
  (conversation_3, '44444444-4444-4444-4444-444444444444', 'Je peux commencer dès mercredi prochain. Je viens avec mes supports de cours. Est-ce que votre fils a des difficultés particulières ?', NOW() - INTERVAL '4 hours 20 minutes'),
  (conversation_3, main_user_id, 'Oui surtout les fonctions et les probabilités. Il a du mal avec ces chapitres.', NOW() - INTERVAL '4 hours 10 minutes'),
  (conversation_3, '44444444-4444-4444-4444-444444444444', 'Pas de souci, je vais préparer des exercices ciblés sur ces thèmes. À mercredi !', NOW() - INTERVAL '4 hours');

END $$;

-- ================================================
-- 5. CRÉER QUELQUES PROPOSITIONS (NÉGOCIATIONS)
-- ================================================

DO $$
DECLARE
  main_user_id UUID := '8b8cb0f0-6712-445b-a9ed-a45aa78638d2';
  request_plomberie UUID;
  request_menage UUID;
BEGIN

  -- Récupérer les IDs des demandes créées
  SELECT id INTO request_plomberie 
  FROM requests 
  WHERE requester_id = main_user_id 
  AND category = 'Bricolage' 
  AND subcategory = 'Plomberie' 
  LIMIT 1;

  SELECT id INTO request_menage 
  FROM requests 
  WHERE requester_id = main_user_id 
  AND category = 'Ménage' 
  LIMIT 1;

  -- Proposition 1 : Jean Kouassi pour plomberie
  IF request_plomberie IS NOT NULL THEN
    INSERT INTO negotiations (
      request_id,
      provider_id,
      client_id,
      proposed_amount,
      message,
      status,
      created_at
    ) VALUES (
      request_plomberie,
      '11111111-1111-1111-1111-111111111111',
      main_user_id,
      18000,
      'Bonjour, je peux intervenir rapidement pour réparer votre fuite. Mon tarif est de 18 000 FCFA tout compris (déplacement + réparation standard). Si besoin de pièces supplémentaires, je vous fais un devis sur place.',
      'pending',
      NOW() - INTERVAL '2 hours'
    );
  END IF;

  -- Proposition 2 : Marie Diallo pour ménage
  IF request_menage IS NOT NULL THEN
    INSERT INTO negotiations (
      request_id,
      provider_id,
      client_id,
      proposed_amount,
      message,
      status,
      created_at
    ) VALUES (
      request_menage,
      '22222222-2222-2222-2222-222222222222',
      main_user_id,
      12000,
      'Bonjour, je suis disponible pour le ménage hebdomadaire de votre appartement. Je fournis tous les produits. Mon tarif est de 12 000 FCFA par séance (environ 4h).',
      'accepted',
      NOW() - INTERVAL '3 days'
    );
  END IF;

END $$;

-- ================================================
-- VÉRIFICATION DES DONNÉES INSÉRÉES
-- ================================================

-- Compter les profils
SELECT 
  '✅ Profils prestataires' AS type,
  COUNT(*) AS total
FROM profiles
WHERE role = 'provider';

-- Compter les offres
SELECT 
  '✅ Offres de services' AS type,
  COUNT(*) AS total
FROM service_offers
WHERE is_published = true;

-- Compter les demandes
SELECT 
  '✅ Demandes publiées' AS type,
  COUNT(*) AS total
FROM requests
WHERE status = 'published';

-- Compter les conversations
SELECT 
  '✅ Conversations' AS type,
  COUNT(*) AS total
FROM conversations;

-- Compter les messages
SELECT 
  '✅ Messages' AS type,
  COUNT(*) AS total
FROM messages;

-- Compter les négociations
SELECT 
  '✅ Propositions' AS type,
  COUNT(*) AS total
FROM negotiations;

-- ================================================
-- INSTRUCTIONS IMPORTANTES
-- ================================================

/*
⚠️ AVANT D'EXÉCUTER CE SCRIPT :

1. Vérifiez votre UUID utilisateur :
   SELECT id, email FROM auth.users WHERE email = 'coulmilourou@gmail.com';

2. Remplacez la variable main_user_id dans les blocs DO $$ par votre vrai UUID

3. Si vous avez déjà des profils de test, adaptez les UUIDs des prestataires

4. Exécutez le script dans Supabase SQL Editor

5. Actualisez les pages :
   - /home (pour voir les offres)
   - /missions (pour voir les demandes)
   - /offreurs (pour voir les prestataires)
   - /messages (pour voir les conversations)

✅ RÉSULTAT ATTENDU :
- 5 profils prestataires
- 8 offres de services publiées
- 5 demandes de services publiées
- 3 conversations avec messages
- 2 propositions (négociations)
*/
