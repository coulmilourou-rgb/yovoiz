-- ═══════════════════════════════════════════════════════════════
-- ✅ TRIGGER FINAL CORRIGÉ - Structure Exacte de Votre BDD
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ Confirmer tous les utilisateurs existants
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- 2️⃣ Supprimer tous les anciens triggers
DROP TRIGGER IF EXISTS trigger_handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS trigger_auto_confirm_user ON auth.users;
DROP TRIGGER IF EXISTS trigger_auto_confirm_and_profile ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_signup();
DROP FUNCTION IF EXISTS public.auto_confirm_user_email();
DROP FUNCTION IF EXISTS public.auto_confirm_and_create_profile();
DROP FUNCTION IF EXISTS public.create_profile_on_signup();

-- 3️⃣ Fonction ADAPTÉE à votre structure
CREATE OR REPLACE FUNCTION public.handle_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_first_name TEXT;
  v_last_name TEXT;
  v_user_type TEXT;
  v_role TEXT;
BEGIN
  -- Auto-confirmer l'email
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id 
    AND email_confirmed_at IS NULL;
  
  -- Extraire full_name depuis metadata
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
  -- Séparer en first_name et last_name
  IF v_full_name != '' AND position(' ' IN v_full_name) > 0 THEN
    v_first_name := SPLIT_PART(v_full_name, ' ', 1);
    v_last_name := SUBSTRING(v_full_name FROM LENGTH(v_first_name) + 2);
  ELSE
    v_first_name := COALESCE(v_full_name, 'Utilisateur');
    v_last_name := COALESCE(v_full_name, SUBSTRING(NEW.id::TEXT FROM 1 FOR 8));
  END IF;
  
  -- Extraire user_type et convertir en role
  v_user_type := COALESCE(NEW.raw_user_meta_data->>'user_type', 'client');
  
  -- Mapper user_type vers role
  CASE v_user_type
    WHEN 'client' THEN v_role := 'demandeur';
    WHEN 'provider' THEN v_role := 'prestataire';
    WHEN 'both' THEN v_role := 'both';
    ELSE v_role := 'demandeur';
  END CASE;
  
  -- Créer le profil avec TOUS les champs obligatoires
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    phone,
    phone_verified,
    user_type,
    role,
    commune,
    quartier,
    verification_status,
    is_active
  ) VALUES (
    NEW.id,
    v_first_name,
    v_last_name,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'phone_verified')::BOOLEAN, FALSE),
    v_user_type::user_type,
    v_role,
    COALESCE(NEW.raw_user_meta_data->>'commune', ''),
    COALESCE(NEW.raw_user_meta_data->>'quartier', ''),
    'pending'::verification_status,
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    phone_verified = EXCLUDED.phone_verified,
    user_type = EXCLUDED.user_type,
    role = EXCLUDED.role,
    commune = EXCLUDED.commune,
    quartier = EXCLUDED.quartier,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4️⃣ Créer le trigger
CREATE TRIGGER trigger_handle_user_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_user_signup();

-- 5️⃣ Vérification
SELECT 
  'Trigger créé avec succès!' as message,
  COUNT(*) as total_users,
  COUNT(email_confirmed_at) as confirmed_users
FROM auth.users;

-- ═══════════════════════════════════════════════════════════════
-- ✅ CE QUE CE TRIGGER FAIT:
-- ═══════════════════════════════════════════════════════════════
-- 1. Auto-confirme l'email instantanément
-- 2. Sépare full_name en first_name + last_name
-- 3. Convertit user_type (client/provider) vers role (demandeur/prestataire)
-- 4. Remplit TOUS les champs obligatoires de la table profiles
-- 5. Gère les données manquantes avec des valeurs par défaut
-- ═══════════════════════════════════════════════════════════════
