-- Désactiver la confirmation email pour TOUS les utilisateurs existants
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- Modifier le trigger pour auto-confirmer les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role text;
BEGIN
  -- Auto-confirmer l'email immédiatement (DEV MODE)
  UPDATE auth.users 
  SET email_confirmed_at = NOW() 
  WHERE id = NEW.id;

  -- Mapper user_type vers role
  v_role := COALESCE(NEW.raw_user_meta_data->>'user_type', 'client');
  IF v_role = 'provider' THEN
    v_role := 'prestataire';
  ELSIF v_role = 'both' THEN
    v_role := 'both';
  ELSE
    v_role := 'demandeur';
  END IF;

  -- Créer le profil
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    phone,
    commune,
    quartier,
    user_type,
    role,
    verification_status
  ) VALUES (
    NEW.id,
    COALESCE(SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 1), 'Utilisateur'),
    COALESCE(SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 2), 'Nouveau'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '0000000000'),
    COALESCE(NEW.raw_user_meta_data->>'commune', 'Non défini'),
    NEW.raw_user_meta_data->>'quartier',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'client'),
    v_role,
    'pending'
  );

  RETURN NEW;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE WARNING 'Erreur création profil: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vérifier que le trigger existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
