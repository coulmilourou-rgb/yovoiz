-- ⚠️ DÉVELOPPEMENT SEULEMENT : Auto-confirmer les emails
-- À DÉSACTIVER EN PRODUCTION !

-- Fonction pour auto-confirmer les emails en développement
CREATE OR REPLACE FUNCTION public.auto_confirm_email_dev()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirmer l'email immédiatement (dev uniquement)
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id 
    AND email_confirmed_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur la création d'utilisateur
DROP TRIGGER IF EXISTS on_auth_user_auto_confirm_email ON auth.users;
CREATE TRIGGER on_auth_user_auto_confirm_email
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_email_dev();

-- ⚠️ ATTENTION : Supprimer ce trigger avant la production !
-- DROP TRIGGER IF EXISTS on_auth_user_auto_confirm_email ON auth.users;
-- DROP FUNCTION IF EXISTS public.auto_confirm_email_dev();
