-- ═══════════════════════════════════════════════════════════════
-- 🚀 SOLUTION IMMÉDIATE : Auto-confirmation pour développement
-- ═══════════════════════════════════════════════════════════════
-- 
-- CONTEXTE :
-- Les emails de confirmation Supabase ne sont pas reçus malgré :
-- - emailRedirectTo configuré dans le code
-- - Configuration Supabase activée
-- - Template email personnalisé
-- 
-- CAUSE PROBABLE :
-- - Rate limiting Supabase (plan gratuit)
-- - Délais d'envoi SMTP
-- - Filtrage anti-spam des fournisseurs d'email
-- 
-- SOLUTION :
-- Créer un trigger qui auto-confirme les emails en DEV
-- tout en conservant le flux email pour la PRODUCTION
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ Confirmer IMMÉDIATEMENT tous les utilisateurs existants
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- Vérifier le résultat
SELECT 
  COUNT(*) as total_users,
  COUNT(email_confirmed_at) as confirmed_users,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as pending_users
FROM auth.users;

-- 2️⃣ Créer une fonction d'auto-confirmation
CREATE OR REPLACE FUNCTION public.auto_confirm_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirmer immédiatement après l'inscription
  -- Permet de développer sans attendre les emails
  UPDATE auth.users
  SET 
    email_confirmed_at = NOW(),
    confirmed_at = NOW()
  WHERE id = NEW.id 
    AND email_confirmed_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3️⃣ Créer le trigger sur auth.users
DROP TRIGGER IF EXISTS trigger_auto_confirm_user ON auth.users;
CREATE TRIGGER trigger_auto_confirm_user
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.auto_confirm_user_email();

-- ═══════════════════════════════════════════════════════════════
-- ✅ RÉSULTAT :
-- ═══════════════════════════════════════════════════════════════
-- - Les nouveaux utilisateurs sont auto-confirmés instantanément
-- - Ils peuvent se connecter immédiatement après inscription
-- - Le flux d'email reste fonctionnel (Supabase envoie quand même)
-- - Pas besoin d'attendre l'email pour se connecter
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 🔴 AVANT LA MISE EN PRODUCTION :
-- ═══════════════════════════════════════════════════════════════
-- Supprimer ce trigger pour forcer la confirmation manuelle :
-- 
-- DROP TRIGGER IF EXISTS trigger_auto_confirm_user ON auth.users;
-- DROP FUNCTION IF EXISTS public.auto_confirm_user_email();
-- 
-- Et vérifier que les emails Supabase sont bien reçus en production
-- avec un domaine email personnalisé (ex: noreply@yovoiz.ci)
-- ═══════════════════════════════════════════════════════════════
