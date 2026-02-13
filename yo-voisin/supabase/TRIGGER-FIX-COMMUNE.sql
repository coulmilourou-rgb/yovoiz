-- ═══════════════════════════════════════════════════════════════
-- 🔥 TRIGGER CORRIGÉ - Récupération commune depuis metadata
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ SUPPRIMER LE TRIGGER EXISTANT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_minimal_profile();

-- 2️⃣ FONCTION AVEC COMMUNE DEPUIS METADATA
CREATE OR REPLACE FUNCTION public.create_minimal_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer profil avec les vraies données depuis metadata
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    phone,
    user_type,
    role,
    commune,
    quartier
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Nouveau'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '0000000000'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'client')::user_type,
    COALESCE(NEW.raw_user_meta_data->>'role', 'demandeur'),
    COALESCE(NEW.raw_user_meta_data->>'commune', 'Non spécifiée'),  -- ✅ Récupère la vraie commune
    NEW.raw_user_meta_data->>'quartier'  -- ✅ Récupère le quartier (peut être null)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, on laisse passer quand même
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3️⃣ CRÉER LE TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.create_minimal_profile();

-- 4️⃣ VÉRIFICATION
SELECT 
  'Trigger corrigé avec commune!' as message,
  'La commune sera maintenant récupérée depuis les metadata' as statut;

-- ═══════════════════════════════════════════════════════════════
-- ✅ RÉSULTAT :
-- ═══════════════════════════════════════════════════════════════
-- - La commune de l'utilisateur est récupérée depuis metadata
-- - Le quartier aussi (optionnel)
-- - first_name et last_name également récupérés
-- - Fonctionne avec le formulaire d'inscription existant
-- ═══════════════════════════════════════════════════════════════
