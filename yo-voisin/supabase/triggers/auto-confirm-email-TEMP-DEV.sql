-- ⚠️ SOLUTION TEMPORAIRE : Auto-confirmer les emails en développement
-- À SUPPRIMER EN PRODUCTION !

-- Fonction pour auto-confirmer automatiquement
CREATE OR REPLACE FUNCTION public.auto_confirm_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirmer l'email immédiatement
  UPDATE auth.users
  SET email_confirmed_at = NOW(),
      confirmed_at = NOW()
  WHERE id = NEW.id 
    AND email_confirmed_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_auto_confirm_email ON auth.users;
CREATE TRIGGER trigger_auto_confirm_email
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.auto_confirm_new_user();

-- ✅ Maintenant les utilisateurs seront auto-confirmés lors de l'inscription

-- ═══════════════════════════════════════════════════════════════
-- 🔴 AVANT LA MISE EN PRODUCTION, SUPPRIMER CE TRIGGER :
-- ═══════════════════════════════════════════════════════════════
-- DROP TRIGGER IF EXISTS trigger_auto_confirm_email ON auth.users;
-- DROP FUNCTION IF EXISTS public.auto_confirm_new_user();
