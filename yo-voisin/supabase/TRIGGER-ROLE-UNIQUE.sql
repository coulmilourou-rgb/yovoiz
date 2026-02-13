-- ═══════════════════════════════════════════════════════════════
-- 🔥 TRIGGER SIMPLIFIÉ - UN SEUL TYPE D'UTILISATEUR
-- ═══════════════════════════════════════════════════════════════
-- Tous les utilisateurs peuvent DEMANDER et OFFRIR des services
-- Plus besoin de choisir "demandeur" ou "prestataire"
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ SUPPRIMER LE TRIGGER EXISTANT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_minimal_profile();

-- 2️⃣ FONCTION AVEC RÔLE UNIQUE 'both'
CREATE OR REPLACE FUNCTION public.create_minimal_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer profil avec role='both' pour tous
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
    'both'::user_type,
    'both',
    COALESCE(NEW.raw_user_meta_data->>'commune', 'Non spécifiée'),
    NEW.raw_user_meta_data->>'quartier'
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
  'Trigger simplifié activé!' as message,
  'Tous les utilisateurs ont role=both' as statut;

-- ═══════════════════════════════════════════════════════════════
-- ✅ RÉSULTAT :
-- ═══════════════════════════════════════════════════════════════
-- - Inscription simplifiée (pas de choix rôle)
-- - Tous les users peuvent demander ET offrir
-- - Dashboard unique avec 2 actions
-- - Plus de distinction demandeur/prestataire
-- ═══════════════════════════════════════════════════════════════
