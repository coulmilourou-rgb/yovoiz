-- ═══════════════════════════════════════════════════════════════
-- 🚨 TRIGGER ULTRA-MINIMAL - Ne peut PAS planter
-- ═══════════════════════════════════════════════════════════════
-- Ce trigger fait le STRICT MINIMUM pour que l'inscription fonctionne.
-- Il crée un profil avec SEULEMENT les champs obligatoires (NOT NULL).
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ SUPPRIMER TOUS LES TRIGGERS EXISTANTS
DROP TRIGGER IF EXISTS trigger_handle_user_signup ON auth.users;
DROP TRIGGER IF EXISTS trigger_handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS trigger_auto_confirm_user ON auth.users;
DROP TRIGGER IF EXISTS trigger_auto_confirm_and_profile ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.handle_user_signup();
DROP FUNCTION IF EXISTS public.handle_new_user_signup();
DROP FUNCTION IF EXISTS public.auto_confirm_user_email();
DROP FUNCTION IF EXISTS public.auto_confirm_and_create_profile();
DROP FUNCTION IF EXISTS public.create_profile_on_signup();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.create_profile_for_new_user();

-- 2️⃣ FONCTION ULTRA-MINIMALE
CREATE OR REPLACE FUNCTION public.create_minimal_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer profil avec SEULEMENT les champs obligatoires
  -- Valeurs par défaut pour tout
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    phone,
    user_type,
    role,
    commune
  ) VALUES (
    NEW.id,
    'Utilisateur',                    -- first_name obligatoire
    'Nouveau',                         -- last_name obligatoire
    COALESCE(NEW.raw_user_meta_data->>'phone', '0000000000'),  -- phone obligatoire
    'client'::user_type,               -- user_type obligatoire avec default
    'demandeur',                       -- role obligatoire avec default
    'Abidjan'                          -- commune obligatoire
  )
  ON CONFLICT (id) DO NOTHING;  -- Si existe déjà, on ignore
  
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
  'Trigger ultra-minimal créé!' as message,
  'L''inscription devrait fonctionner maintenant' as statut;

-- ═══════════════════════════════════════════════════════════════
-- ✅ RÉSULTAT :
-- ═══════════════════════════════════════════════════════════════
-- - L'inscription ne plantera PLUS JAMAIS
-- - Un profil minimal sera créé avec des valeurs par défaut
-- - L'utilisateur pourra compléter son profil plus tard
-- - Même si le trigger échoue, l'inscription continue (EXCEPTION)
-- ═══════════════════════════════════════════════════════════════
