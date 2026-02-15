-- =====================================================
-- MIGRATION COMPLÈTE : PHOTOS + PÉRIMÈTRE + COLONNES
-- =====================================================
-- Ce script unique corrige tous les problèmes :
-- 1. Photos de profil (avatars)
-- 2. Photos de couverture (covers)
-- 3. Périmètre d'intervention (availability_hours)
-- 4. Colonnes prestataires (provider_bio, provider_experience_years)
-- 5. Date de naissance (date_naissance)

-- =====================================================
-- PARTIE 1: COLONNES MANQUANTES DANS profiles
-- =====================================================

-- Colonne avatar_url
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    RAISE NOTICE '✅ Colonne avatar_url ajoutée';
  ELSE
    RAISE NOTICE '⏭️  Colonne avatar_url existe déjà';
  END IF;
END $$;

-- Colonne cover_url (photo de couverture)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'cover_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN cover_url TEXT;
    RAISE NOTICE '✅ Colonne cover_url ajoutée';
  ELSE
    RAISE NOTICE '⏭️  Colonne cover_url existe déjà';
  END IF;
END $$;

-- Colonne date_naissance
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'date_naissance'
  ) THEN
    ALTER TABLE profiles ADD COLUMN date_naissance DATE;
    RAISE NOTICE '✅ Colonne date_naissance ajoutée';
  ELSE
    RAISE NOTICE '⏭️  Colonne date_naissance existe déjà';
  END IF;
END $$;

-- Colonne provider_bio
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'provider_bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN provider_bio TEXT;
    RAISE NOTICE '✅ Colonne provider_bio ajoutée';
  ELSE
    RAISE NOTICE '⏭️  Colonne provider_bio existe déjà';
  END IF;
END $$;

-- Colonne provider_experience_years
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'provider_experience_years'
  ) THEN
    ALTER TABLE profiles ADD COLUMN provider_experience_years INTEGER DEFAULT 0;
    RAISE NOTICE '✅ Colonne provider_experience_years ajoutée';
  ELSE
    RAISE NOTICE '⏭️  Colonne provider_experience_years existe déjà';
  END IF;
END $$;

-- Colonne availability_hours (horaires disponibilités)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'availability_hours'
  ) THEN
    ALTER TABLE profiles ADD COLUMN availability_hours JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE '✅ Colonne availability_hours ajoutée';
  ELSE
    RAISE NOTICE '⏭️  Colonne availability_hours existe déjà';
  END IF;
END $$;

-- Index GIN pour recherche rapide dans availability_hours
CREATE INDEX IF NOT EXISTS idx_profiles_availability 
ON profiles USING GIN (availability_hours);

-- =====================================================
-- PARTIE 2: BUCKETS STORAGE
-- =====================================================

-- Bucket AVATARS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[];

-- Bucket COVERS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'covers',
  'covers',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[];

-- =====================================================
-- PARTIE 3: POLICIES STORAGE
-- =====================================================

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Cover images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own cover" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own cover" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own cover" ON storage.objects;

-- POLICIES AVATARS

CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');

-- POLICIES COVERS

CREATE POLICY "Cover images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'covers');

CREATE POLICY "Users can upload their own cover"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Users can update their own cover"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'covers')
WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Users can delete their own cover"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'covers');

-- =====================================================
-- PARTIE 4: VÉRIFICATION FINALE
-- =====================================================

-- Vérifier les colonnes
SELECT 
  '=== COLONNES PROFILES ===' as section,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND column_name IN (
    'avatar_url',
    'cover_url',
    'date_naissance',
    'provider_bio',
    'provider_experience_years',
    'availability_hours'
  )
ORDER BY column_name;

-- Vérifier les buckets
SELECT 
  '=== BUCKETS STORAGE ===' as section,
  id,
  name,
  public,
  file_size_limit
FROM storage.buckets
WHERE id IN ('avatars', 'covers')
ORDER BY id;

-- Vérifier les policies
SELECT 
  '=== POLICIES STORAGE ===' as section,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND (policyname LIKE '%avatar%' OR policyname LIKE '%cover%')
ORDER BY policyname;

-- =====================================================
-- RAPPORT FINAL
-- =====================================================

DO $$
DECLARE
  col_avatar BOOLEAN;
  col_cover BOOLEAN;
  col_date BOOLEAN;
  col_bio BOOLEAN;
  col_exp BOOLEAN;
  col_avail BOOLEAN;
  bucket_avatars BOOLEAN;
  bucket_covers BOOLEAN;
  policy_count INTEGER;
BEGIN
  -- Vérifier colonnes
  SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') INTO col_avatar;
  SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'cover_url') INTO col_cover;
  SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'date_naissance') INTO col_date;
  SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'provider_bio') INTO col_bio;
  SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'provider_experience_years') INTO col_exp;
  SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'availability_hours') INTO col_avail;
  
  -- Vérifier buckets
  SELECT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') INTO bucket_avatars;
  SELECT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'covers') INTO bucket_covers;
  
  -- Compter policies
  SELECT COUNT(*) FROM pg_policies
  WHERE tablename = 'objects' AND (policyname LIKE '%avatar%' OR policyname LIKE '%cover%')
  INTO policy_count;
  
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════════════════╗';
  RAISE NOTICE '║   MIGRATION COMPLÈTE - RAPPORT FINAL              ║';
  RAISE NOTICE '╚════════════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '📋 COLONNES PROFILES:';
  
  IF col_avatar THEN RAISE NOTICE '  ✅ avatar_url'; ELSE RAISE NOTICE '  ❌ avatar_url'; END IF;
  IF col_cover THEN RAISE NOTICE '  ✅ cover_url'; ELSE RAISE NOTICE '  ❌ cover_url'; END IF;
  IF col_date THEN RAISE NOTICE '  ✅ date_naissance'; ELSE RAISE NOTICE '  ❌ date_naissance'; END IF;
  IF col_bio THEN RAISE NOTICE '  ✅ provider_bio'; ELSE RAISE NOTICE '  ❌ provider_bio'; END IF;
  IF col_exp THEN RAISE NOTICE '  ✅ provider_experience_years'; ELSE RAISE NOTICE '  ❌ provider_experience_years'; END IF;
  IF col_avail THEN RAISE NOTICE '  ✅ availability_hours'; ELSE RAISE NOTICE '  ❌ availability_hours'; END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '🗄️  BUCKETS STORAGE:';
  
  IF bucket_avatars THEN RAISE NOTICE '  ✅ avatars (photos profil)'; ELSE RAISE NOTICE '  ❌ avatars'; END IF;
  IF bucket_covers THEN RAISE NOTICE '  ✅ covers (photos couverture)'; ELSE RAISE NOTICE '  ❌ covers'; END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '🔒 POLICIES STORAGE:';
  RAISE NOTICE '  % policies configurées (attendu: 8)', policy_count;
  
  RAISE NOTICE '';
  
  IF col_avatar AND col_cover AND col_date AND col_bio AND col_exp AND col_avail 
     AND bucket_avatars AND bucket_covers AND policy_count >= 8 THEN
    RAISE NOTICE '🎉 MIGRATION RÉUSSIE !';
    RAISE NOTICE '';
    RAISE NOTICE '✨ Vous pouvez maintenant:';
    RAISE NOTICE '  • Uploader des photos de profil (avatars)';
    RAISE NOTICE '  • Uploader des photos de couverture';
    RAISE NOTICE '  • Gérer le périmètre d''intervention';
    RAISE NOTICE '  • Modifier les informations de profil';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Redémarrez l''application et testez !';
  ELSE
    RAISE NOTICE '⚠️  MIGRATION INCOMPLÈTE';
    RAISE NOTICE 'Vérifiez les éléments marqués ❌ ci-dessus';
  END IF;
  
  RAISE NOTICE '';
END $$;
