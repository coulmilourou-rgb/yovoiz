-- ═══════════════════════════════════════════════════════════════
-- 🚀 SOLUTION CORRIGÉE : Auto-confirmation pour développement
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ Confirmer tous les utilisateurs existants (CORRECTION : sans confirmed_at)
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- Vérifier le résultat
SELECT 
  COUNT(*) as total_users,
  COUNT(email_confirmed_at) as confirmed_users,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as pending_users
FROM auth.users;

-- 2️⃣ Créer une fonction d'auto-confirmation (CORRIGÉE)
CREATE OR REPLACE FUNCTION public.auto_confirm_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirmer immédiatement après l'inscription
  -- Note: confirmed_at est une colonne générée, on ne la touche pas
  UPDATE auth.users
  SET email_confirmed_at = NOW()
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
-- ✅ VÉRIFICATION
-- ═══════════════════════════════════════════════════════════════
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name = 'trigger_auto_confirm_user';

-- ═══════════════════════════════════════════════════════════════
-- 📝 RÉSULTAT ATTENDU:
-- ═══════════════════════════════════════════════════════════════
-- - Tous les utilisateurs existants sont confirmés
-- - Les nouveaux utilisateurs seront auto-confirmés à l'inscription
-- - Connexion immédiate possible sans attendre l'email
-- ═══════════════════════════════════════════════════════════════
