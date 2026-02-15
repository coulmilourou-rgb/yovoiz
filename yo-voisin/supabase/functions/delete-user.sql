-- =====================================================
-- FONCTION: Suppression de compte utilisateur
-- =====================================================
-- Permet aux utilisateurs de supprimer leur propre compte
-- en toute sécurité (avec cascade delete)

-- 1. Créer la fonction de suppression
CREATE OR REPLACE FUNCTION delete_user()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  result json;
BEGIN
  -- Récupérer l'ID de l'utilisateur authentifié
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  -- Log de la suppression
  RAISE NOTICE 'Suppression du compte: %', user_id;

  -- Supprimer toutes les données liées manuellement
  -- (au cas où CASCADE ne fonctionne pas correctement)
  
  -- Supprimer les demandes
  DELETE FROM public.requests WHERE requester_id = user_id;
  RAISE NOTICE '  - Demandes supprimées';
  
  -- Supprimer les offres
  DELETE FROM public.service_offers WHERE provider_id = user_id;
  RAISE NOTICE '  - Offres supprimées';
  
  -- Supprimer les candidatures
  DELETE FROM public.mission_candidates WHERE provider_id = user_id;
  RAISE NOTICE '  - Candidatures supprimées';
  
  -- Supprimer les messages
  DELETE FROM public.messages WHERE sender_id = user_id OR receiver_id = user_id;
  RAISE NOTICE '  - Messages supprimés';
  
  -- Supprimer les négociations
  DELETE FROM public.negotiations WHERE requester_id = user_id OR provider_id = user_id;
  RAISE NOTICE '  - Négociations supprimées';
  
  -- Supprimer le profil
  DELETE FROM public.profiles WHERE id = user_id;
  RAISE NOTICE '  - Profil supprimé';
  
  -- Supprimer l'utilisateur Auth (nécessite elevated privileges via SECURITY DEFINER)
  DELETE FROM auth.users WHERE id = user_id;
  RAISE NOTICE '  - Utilisateur Auth supprimé';
  
  result := json_build_object(
    'success', true,
    'message', 'Compte supprimé avec succès',
    'user_id', user_id
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, log et retour erreur
    RAISE NOTICE 'Erreur suppression: %', SQLERRM;
    RAISE EXCEPTION 'Erreur lors de la suppression: %', SQLERRM;
END;
$$;

-- 2. Donner les permissions
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;
REVOKE EXECUTE ON FUNCTION delete_user() FROM anon, public;

-- 3. Vérifier la fonction
SELECT 
  routine_name, 
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name = 'delete_user'
  AND routine_schema = 'public';

-- 4. Test de sécurité (vérifie que la fonction existe)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'delete_user'
  ) THEN
    RAISE NOTICE '✅ Fonction delete_user() créée avec succès';
  ELSE
    RAISE NOTICE '❌ Erreur: fonction delete_user() non créée';
  END IF;
END $$;

-- =====================================================
-- NOTES IMPORTANTES
-- =====================================================
-- Cette fonction :
-- 1. Vérifie que l'utilisateur est authentifié
-- 2. Supprime explicitement toutes les données liées :
--    - requests (demandes)
--    - service_offers (offres)
--    - mission_candidates (candidatures)
--    - messages (messagerie)
--    - negotiations (négociations)
-- 3. Supprime le profil
-- 4. Supprime l'utilisateur Auth
-- 5. Est sécurisée (SECURITY DEFINER = exécution avec droits du créateur)
-- 6. Ne peut supprimer QUE le compte de l'utilisateur authentifié
-- 7. Retourne un JSON avec le résultat

-- Permissions :
-- - authenticated : PEUT exécuter (utilisateurs connectés)
-- - anon, public : NE PEUT PAS exécuter (sécurité)

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════════════════╗';
  RAISE NOTICE '║   FONCTION delete_user() - INSTALLATION           ║';
  RAISE NOTICE '╚════════════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Fonction créée avec SECURITY DEFINER';
  RAISE NOTICE '🔒 Sécurité: Seul l''utilisateur authentifié peut supprimer son compte';
  RAISE NOTICE '🗑️  Suppression explicite de toutes les données liées';
  RAISE NOTICE '📊 Retour JSON avec confirmation';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Tables supprimées dans l''ordre:';
  RAISE NOTICE '  1. requests (demandes)';
  RAISE NOTICE '  2. service_offers (offres)';
  RAISE NOTICE '  3. mission_candidates (candidatures)';
  RAISE NOTICE '  4. messages (messagerie)';
  RAISE NOTICE '  5. negotiations (négociations)';
  RAISE NOTICE '  6. profiles (profil)';
  RAISE NOTICE '  7. auth.users (utilisateur Auth)';
  RAISE NOTICE '';
END $$;

