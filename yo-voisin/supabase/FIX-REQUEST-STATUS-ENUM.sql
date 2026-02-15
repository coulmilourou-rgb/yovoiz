-- ⚠️ CRITIQUE: Script SQL à exécuter IMMÉDIATEMENT
-- Résout l'erreur: invalid input value for enum request_status: "pending"

-- Ce script doit être exécuté dans Supabase SQL Editor AVANT de pouvoir créer des demandes

-- ==================================================================
-- ÉTAPE 1: Vérifier les valeurs actuelles de l'enum
-- ==================================================================

SELECT 
  t.typname as enum_name,
  e.enumlabel as enum_value,
  e.enumsortorder as position
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'request_status'
ORDER BY e.enumsortorder;

-- ==================================================================
-- ÉTAPE 2: Ajouter la valeur 'pending' si elle n'existe pas
-- ==================================================================

-- Note: On ne peut pas utiliser IF NOT EXISTS avec ALTER TYPE ADD VALUE
-- On doit donc utiliser une transaction conditionnelle

DO $$
DECLARE
  pending_exists BOOLEAN;
BEGIN
  -- Vérifier si 'pending' existe déjà
  SELECT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'request_status' AND e.enumlabel = 'pending'
  ) INTO pending_exists;

  -- Ajouter 'pending' seulement s'il n'existe pas
  IF NOT pending_exists THEN
    -- En PostgreSQL, on ne peut pas utiliser ADD VALUE dans une transaction
    -- Donc on lève une exception qui sera capturée par le bloc principal
    RAISE NOTICE 'La valeur pending doit être ajoutée manuellement';
  ELSE
    RAISE NOTICE '✅ La valeur pending existe déjà dans request_status';
  END IF;
END $$;

-- ==================================================================
-- ÉTAPE 3: Ajouter manuellement les valeurs manquantes
-- ==================================================================

-- Si vous voyez le message "doit être ajoutée manuellement" ci-dessus,
-- exécutez ces commandes UNE PAR UNE:

-- Ajouter 'pending' (pour modération avant publication)
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'pending';

-- Ajouter 'rejected' (si une demande est rejetée par admin)
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'rejected';

-- Ajouter 'disputed' (si litige entre parties)
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'disputed';

-- ==================================================================
-- ÉTAPE 4: Vérifier que toutes les valeurs sont présentes
-- ==================================================================

SELECT 
  t.typname as enum_name,
  e.enumlabel as enum_value,
  e.enumsortorder as position,
  CASE e.enumlabel
    WHEN 'pending' THEN '🟡 En attente de validation (NOUVEAU)'
    WHEN 'draft' THEN '📝 Brouillon'
    WHEN 'published' THEN '✅ Publié et visible'
    WHEN 'in_progress' THEN '🚀 En cours'
    WHEN 'completed' THEN '✔️ Terminé'
    WHEN 'cancelled' THEN '❌ Annulé'
    WHEN 'rejected' THEN '🚫 Rejeté (NOUVEAU)'
    WHEN 'disputed' THEN '⚠️ Litige (NOUVEAU)'
    ELSE '❓ Inconnu'
  END as description
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'request_status'
ORDER BY e.enumsortorder;

-- ==================================================================
-- ÉTAPE 5: Message de confirmation
-- ==================================================================

SELECT 
  '✅ Enum request_status vérifié et mis à jour!' as status,
  COUNT(*) as total_values
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'request_status';

-- ==================================================================
-- EXPLICATION DES STATUTS
-- ==================================================================

/*
Workflow complet des demandes:

1. DRAFT (brouillon)
   - L'utilisateur est en train de créer sa demande
   - Pas encore soumise
   
2. PENDING (en attente) ⭐ NOUVEAU
   - Demande soumise par l'utilisateur
   - En attente de validation par un administrateur
   - Pas encore visible publiquement
   - C'est le statut par défaut à la création
   
3. PUBLISHED (publié)
   - Demande validée par l'admin
   - Visible publiquement
   - Les prestataires peuvent proposer leurs services
   
4. IN_PROGRESS (en cours)
   - Un prestataire a été choisi
   - La mission est en cours de réalisation
   
5. COMPLETED (terminé)
   - Mission terminée avec succès
   - Paiement effectué
   
6. CANCELLED (annulé)
   - Annulé par le demandeur ou le prestataire
   - Avant le début de la mission
   
7. REJECTED (rejeté) ⭐ NOUVEAU
   - Rejeté par l'administrateur
   - Raison: contenu inapproprié, spam, violation des CGU, etc.
   
8. DISPUTED (litige) ⭐ NOUVEAU
   - Litige ouvert entre demandeur et prestataire
   - Nécessite une intervention de l'équipe Yo!Voiz
*/

-- ==================================================================
-- TEST: Créer une demande avec le statut 'pending'
-- ==================================================================

-- ⚠️ NE PAS EXÉCUTER CETTE PARTIE - JUSTE POUR RÉFÉRENCE
-- Le frontend fera automatiquement ceci lors de la création d'une demande:

/*
INSERT INTO requests (
  requester_id,
  title,
  description,
  category_id,
  commune,
  status,  -- 'pending' au lieu de 'published'
  created_at
) VALUES (
  'USER_ID',
  'Titre de la demande',
  'Description détaillée',
  'plomberie',
  'Yopougon',
  'pending',  -- ✅ Cette valeur doit maintenant fonctionner!
  NOW()
);
*/

-- ==================================================================
-- EN CAS D'ERREUR
-- ==================================================================

/*
Si vous obtenez toujours l'erreur après avoir exécuté ce script:

1. Vérifiez que 'pending' apparaît bien dans le résultat de l'ÉTAPE 4
2. Redémarrez votre serveur Next.js (Ctrl+C puis npm run dev)
3. Videz le cache Supabase dans le Dashboard
4. Réessayez de créer une demande

Si l'erreur persiste, contactez le support avec:
- Le résultat complet de l'ÉTAPE 4
- Les logs d'erreur du serveur Next.js
- Les logs Supabase (Dashboard → Logs)
*/
