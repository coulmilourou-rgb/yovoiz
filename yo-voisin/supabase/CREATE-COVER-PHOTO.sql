-- =====================================================
-- AJOUT PHOTO DE COUVERTURE (COVER) - PROFILS
-- =====================================================
-- Permet aux prestataires d'ajouter une photo de couverture
-- sur leur page profil publique

-- 1. AJOUTER LA COLONNE cover_url DANS profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'cover_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN cover_url TEXT;
    RAISE NOTICE '✅ Colonne cover_url ajoutée';
  ELSE
    RAISE NOTICE '⚠️  Colonne cover_url existe déjà';
  END IF;
END $$;

-- 2. CRÉER LE BUCKET 'covers' DANS STORAGE
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'covers',
  'covers',
  true, -- Public
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[];

-- 3. POLICIES POUR LE BUCKET 'covers'

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Cover images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own cover" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own cover" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own cover" ON storage.objects;

-- Policy: Lecture publique des covers
CREATE POLICY "Cover images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'covers');

-- Policy: Upload par utilisateurs authentifiés
CREATE POLICY "Users can upload their own cover"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'covers');

-- Policy: Mise à jour par utilisateurs authentifiés
CREATE POLICY "Users can update their own cover"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'covers')
WITH CHECK (bucket_id = 'covers');

-- Policy: Suppression par utilisateurs authentifiés
CREATE POLICY "Users can delete their own cover"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'covers');

-- 4. VÉRIFICATION

-- Vérifier le bucket
SELECT 
  '=== BUCKET COVERS ===' as section,
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'covers';

-- Vérifier la colonne cover_url
SELECT 
  '=== COLONNE COVER_URL ===' as section,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND column_name = 'cover_url';

-- Vérifier les policies
SELECT 
  '=== POLICIES STORAGE ===' as section,
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%cover%'
ORDER BY cmd;

-- 5. RAPPORT FINAL
DO $$
DECLARE
  bucket_exists BOOLEAN;
  col_exists BOOLEAN;
  policy_count INTEGER;
BEGIN
  -- Vérifier bucket
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'covers'
  ) INTO bucket_exists;
  
  -- Vérifier colonne
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'cover_url'
  ) INTO col_exists;
  
  -- Compter policies
  SELECT COUNT(*) FROM pg_policies
  WHERE tablename = 'objects' AND policyname LIKE '%cover%'
  INTO policy_count;
  
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════════╗';
  RAISE NOTICE '║   PHOTO DE COUVERTURE - INSTALLATION      ║';
  RAISE NOTICE '╚════════════════════════════════════════════╝';
  RAISE NOTICE '';
  
  IF bucket_exists THEN
    RAISE NOTICE '✅ Bucket covers: OK';
  ELSE
    RAISE NOTICE '❌ Bucket covers: MANQUANT';
  END IF;
  
  IF col_exists THEN
    RAISE NOTICE '✅ Colonne cover_url: OK';
  ELSE
    RAISE NOTICE '❌ Colonne cover_url: MANQUANTE';
  END IF;
  
  IF policy_count >= 4 THEN
    RAISE NOTICE '✅ Policies storage: OK (% policies)', policy_count;
  ELSE
    RAISE NOTICE '⚠️  Policies storage: INCOMPLET (% policies)', policy_count;
  END IF;
  
  RAISE NOTICE '';
  
  IF bucket_exists AND col_exists AND policy_count >= 4 THEN
    RAISE NOTICE '🎉 INSTALLATION TERMINÉE ! Vous pouvez tester.';
  ELSE
    RAISE NOTICE '⚠️  INSTALLATION INCOMPLÈTE';
  END IF;
  
  RAISE NOTICE '';
END $$;
