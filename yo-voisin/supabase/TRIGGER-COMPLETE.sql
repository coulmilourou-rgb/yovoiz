-- ═══════════════════════════════════════════════════════════════
-- 🔧 TRIGGER COMPLET : Auto-confirmation + Création Profil
-- ═══════════════════════════════════════════════════════════════
-- Ce trigger gère TOUT lors de l'inscription :
-- 1. Auto-confirme l'email (pour le développement)
-- 2. Crée automatiquement le profil dans la table profiles
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ Confirmer tous les utilisateurs existants
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- 2️⃣ Créer la fonction qui gère inscription + profil
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type TEXT;
  v_full_name TEXT;
  v_first_name TEXT;
  v_last_name TEXT;
BEGIN
  -- Auto-confirmer l'email (développement uniquement)
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id 
    AND email_confirmed_at IS NULL;
  
  -- Extraire les données du metadata
  v_user_type := COALESCE(NEW.raw_user_meta_data->>'user_type', 'client');
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
  -- Séparer le nom complet en prénom/nom
  IF v_full_name != '' THEN
    v_first_name := SPLIT_PART(v_full_name, ' ', 1);
    v_last_name := SUBSTRING(v_full_name FROM LENGTH(v_first_name) + 2);
    IF v_last_name = '' THEN
      v_last_name := v_first_name;
    END IF;
  ELSE
    v_first_name := 'Utilisateur';
    v_last_name := SUBSTRING(NEW.id::TEXT FROM 1 FOR 8);
  END IF;
  
  -- Créer le profil dans la table profiles
  INSERT INTO public.profiles (
    id,
    user_type,
    full_name,
    phone,
    commune,
    quartier,
    verification_status,
    email_verified,
    phone_verified,
    profile_completed
  ) VALUES (
    NEW.id,
    CASE v_user_type
      WHEN 'demandeur' THEN 'client'
      WHEN 'prestataire' THEN 'provider'
      WHEN 'both' THEN 'both'
      ELSE 'client'
    END,
    v_full_name,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'commune', ''),
    COALESCE(NEW.raw_user_meta_data->>'quartier', ''),
    'pending',
    COALESCE((NEW.raw_user_meta_data->>'email_verified')::BOOLEAN, FALSE),
    COALESCE((NEW.raw_user_meta_data->>'phone_verified')::BOOLEAN, FALSE),
    COALESCE((NEW.raw_user_meta_data->>'profile_completed')::BOOLEAN, FALSE)
  )
  ON CONFLICT (id) DO UPDATE SET
    user_type = EXCLUDED.user_type,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    commune = EXCLUDED.commune,
    quartier = EXCLUDED.quartier,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3️⃣ Créer le trigger sur auth.users
DROP TRIGGER IF EXISTS trigger_handle_new_user ON auth.users;
CREATE TRIGGER trigger_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_signup();

-- 4️⃣ Vérification
SELECT 
  'Trigger créé avec succès!' as message,
  COUNT(*) as total_users,
  COUNT(email_confirmed_at) as confirmed_users
FROM auth.users;

-- ═══════════════════════════════════════════════════════════════
-- ✅ CE QUE CE TRIGGER FAIT:
-- ═══════════════════════════════════════════════════════════════
-- 1. Auto-confirme l'email instantanément (pas besoin d'attendre)
-- 2. Crée automatiquement le profil dans la table profiles
-- 3. Gère la conversion des types (demandeur->client, prestataire->provider)
-- 4. Sépare le full_name en first_name/last_name si nécessaire
-- 5. Supporte les inscriptions avec données incomplètes
-- ═══════════════════════════════════════════════════════════════
