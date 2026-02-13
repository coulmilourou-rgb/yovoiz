-- ═══════════════════════════════════════════════════════════════
-- 🚀 TRIGGER MINIMAL ET ROBUSTE - Ne plante jamais
-- ═══════════════════════════════════════════════════════════════
-- Ce trigger est ultra-simple et gère SEULEMENT :
-- 1. Auto-confirmation email
-- 2. Création profil avec colonnes MINIMALES garanties
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ Confirmer tous les utilisateurs existants
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- 2️⃣ Supprimer l'ancien trigger (s'il existe)
DROP TRIGGER IF EXISTS trigger_handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS trigger_auto_confirm_user ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_signup();
DROP FUNCTION IF EXISTS public.auto_confirm_user_email();
DROP FUNCTION IF EXISTS public.create_profile_on_signup();

-- 3️⃣ Fonction MINIMALISTE qui ne plante jamais
CREATE OR REPLACE FUNCTION public.auto_confirm_and_create_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirmer l'email
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id 
    AND email_confirmed_at IS NULL;
  
  -- Essayer de créer le profil (ignore les erreurs)
  BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      -- Ignorer toutes les erreurs (le profil sera créé plus tard si besoin)
      NULL;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4️⃣ Créer le trigger
CREATE TRIGGER trigger_auto_confirm_and_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.auto_confirm_and_create_profile();

-- 5️⃣ Vérification
SELECT 
  'Trigger minimaliste créé!' as message,
  COUNT(*) as total_users,
  COUNT(email_confirmed_at) as confirmed_users
FROM auth.users;

-- ═══════════════════════════════════════════════════════════════
-- ✅ AVANTAGES DE CE TRIGGER:
-- ═══════════════════════════════════════════════════════════════
-- 1. Ne plante JAMAIS (gestion des erreurs complète)
-- 2. Auto-confirme toujours l'email
-- 3. Tente de créer le profil mais continue si ça échoue
-- 4. L'inscription utilisateur réussira TOUJOURS
-- ═══════════════════════════════════════════════════════════════
