-- =====================================================
-- DONNÉES DE TEST - Clients, Devis, Factures
-- =====================================================
-- À exécuter dans Supabase SQL Editor

-- 1. Créer des clients test pour l'utilisateur tamoil@test.com (270013f1-2386-4601-a37f-4007ac213795)
INSERT INTO public.clients (user_id, name, email, phone, address, notes) VALUES
  ('270013f1-2386-4601-a37f-4007ac213795', 'Jean Martin', 'jean.martin@example.com', '0707070707', 'Yopougon, Ananeraie', 'Client régulier'),
  ('270013f1-2386-4601-a37f-4007ac213795', 'Marie Kouassi', 'marie.kouassi@example.com', '0708080808', 'Adjamé, Liberté', 'Nouveau client'),
  ('270013f1-2386-4601-a37f-4007ac213795', 'Yao Kouamé', 'yao.kouame@example.com', '0709090909', 'Cocody, Riviera', 'Client professionnel')
ON CONFLICT DO NOTHING;

-- 2. Récupérer les IDs des clients créés
DO $$
DECLARE
  client1_id UUID;
  client2_id UUID;
  client3_id UUID;
  user_test_id UUID := '270013f1-2386-4601-a37f-4007ac213795';
BEGIN
  -- Récupérer les IDs
  SELECT id INTO client1_id FROM public.clients WHERE email = 'jean.martin@example.com' AND user_id = user_test_id;
  SELECT id INTO client2_id FROM public.clients WHERE email = 'marie.kouassi@example.com' AND user_id = user_test_id;
  SELECT id INTO client3_id FROM public.clients WHERE email = 'yao.kouame@example.com' AND user_id = user_test_id;

  -- 3. Créer des devis test
  INSERT INTO public.devis (
    user_id, client_id, client_name, client_email, client_phone, client_address,
    items, subtotal, tax_rate, tax_amount, total,
    status, issue_date, expiry_date, notes
  ) VALUES
  (
    user_test_id, client1_id, 'Jean Martin', 'jean.martin@example.com', '0707070707', 'Yopougon, Ananeraie',
    '[
      {"name": "Plomberie - Réparation fuite", "quantity": 1, "unit_price": 25000, "total": 25000},
      {"name": "Remplacement robinet", "quantity": 2, "unit_price": 15000, "total": 30000}
    ]'::jsonb,
    55000, 0, 0, 55000,
    'draft', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Devis urgent'
  ),
  (
    user_test_id, client2_id, 'Marie Kouassi', 'marie.kouassi@example.com', '0708080808', 'Adjamé, Liberté',
    '[
      {"name": "Électricité - Installation tableau", "quantity": 1, "unit_price": 80000, "total": 80000},
      {"name": "Câblage complet", "quantity": 1, "unit_price": 120000, "total": 120000}
    ]'::jsonb,
    200000, 0, 0, 200000,
    'sent', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 'Projet maison'
  ),
  (
    user_test_id, client3_id, 'Yao Kouamé', 'yao.kouame@example.com', '0709090909', 'Cocody, Riviera',
    '[
      {"name": "Climatisation - Installation 2 unités", "quantity": 2, "unit_price": 150000, "total": 300000},
      {"name": "Entretien annuel", "quantity": 1, "unit_price": 50000, "total": 50000}
    ]'::jsonb,
    350000, 0, 0, 350000,
    'accepted', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'Client VIP'
  );

  -- 4. Créer des factures test
  INSERT INTO public.factures (
    user_id, client_id, client_name, client_email, client_phone, client_address,
    items, subtotal, tax_rate, tax_amount, total, amount_paid,
    status, issue_date, due_date, payment_method, notes
  ) VALUES
  (
    user_test_id, client1_id, 'Jean Martin', 'jean.martin@example.com', '0707070707', 'Yopougon, Ananeraie',
    '[
      {"name": "Plomberie - Réparation fuite", "quantity": 1, "unit_price": 25000, "total": 25000}
    ]'::jsonb,
    25000, 0, 0, 25000, 25000,
    'paid', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '5 days', 'cash', 'Payé comptant'
  ),
  (
    user_test_id, client2_id, 'Marie Kouassi', 'marie.kouassi@example.com', '0708080808', 'Adjamé, Liberté',
    '[
      {"name": "Électricité - Dépannage", "quantity": 1, "unit_price": 30000, "total": 30000}
    ]'::jsonb,
    30000, 0, 0, 30000, 0,
    'pending', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '7 days', NULL, 'En attente paiement'
  ),
  (
    user_test_id, client3_id, 'Yao Kouamé', 'yao.kouame@example.com', '0709090909', 'Cocody, Riviera',
    '[
      {"name": "Climatisation - Maintenance", "quantity": 1, "unit_price": 50000, "total": 50000}
    ]'::jsonb,
    50000, 0, 0, 50000, 0,
    'overdue', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '5 days', NULL, 'Relance nécessaire'
  );

  -- 5. Créer des articles catalogue
  INSERT INTO public.catalogue (
    user_id, name, description, unit_price, unit, category, tax_rate, is_active
  ) VALUES
  (user_test_id, 'Plomberie - Dépannage urgent', 'Intervention rapide sous 2h', 35000, 'intervention', 'Plomberie', 0, true),
  (user_test_id, 'Électricité - Installation tableau', 'Installation tableau électrique complet', 80000, 'unité', 'Électricité', 0, true),
  (user_test_id, 'Climatisation - Installation split', 'Installation climatiseur split system', 150000, 'unité', 'Climatisation', 0, true),
  (user_test_id, 'Peinture - Au m²', 'Peinture intérieure avec préparation', 5000, 'm²', 'Peinture', 0, true),
  (user_test_id, 'Maintenance - Visite mensuelle', 'Visite de maintenance préventive', 25000, 'visite', 'Entretien', 0, true);

  RAISE NOTICE '✅ Données de test créées avec succès !';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Résumé :';
  RAISE NOTICE '  • 3 clients créés';
  RAISE NOTICE '  • 3 devis créés (draft, sent, accepted)';
  RAISE NOTICE '  • 3 factures créées (paid, pending, overdue)';
  RAISE NOTICE '  • 5 articles catalogue créés';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Vous pouvez maintenant tester l''interface Abonnement Pro !';
END $$;

-- Vérification
SELECT 
  '=== CLIENTS ===' as section,
  name, email, phone
FROM public.clients
WHERE user_id = '270013f1-2386-4601-a37f-4007ac213795'
UNION ALL
SELECT 
  '=== DEVIS ===' as section,
  reference as name, 
  client_name as email, 
  status as phone
FROM public.devis
WHERE user_id = '270013f1-2386-4601-a37f-4007ac213795'
UNION ALL
SELECT 
  '=== FACTURES ===' as section,
  reference as name, 
  client_name as email, 
  status as phone
FROM public.factures
WHERE user_id = '270013f1-2386-4601-a37f-4007ac213795';
