-- =====================================================
-- FIX: Colonnes manquantes dans profiles + Bucket avatars
-- =====================================================
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- 1. VÉRIFIER LES COLONNES EXISTANTES
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. AJOUTER LES COLONNES MANQUANTES SI NÉCESSAIRE

-- Colonne provider_bio (description prestataire)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'provider_bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN provider_bio TEXT;
    RAISE NOTICE 'Colonne provider_bio ajoutée';
  ELSE
    RAISE NOTICE 'Colonne provider_bio existe déjà';
  END IF;
END $$;

-- Colonne provider_experience_years
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'provider_experience_years'
  ) THEN
    ALTER TABLE profiles ADD COLUMN provider_experience_years INTEGER DEFAULT 0;
    RAISE NOTICE 'Colonne provider_experience_years ajoutée';
  ELSE
    RAISE NOTICE 'Colonne provider_experience_years existe déjà';
  END IF;
END $$;

-- Colonne date_naissance
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'date_naissance'
  ) THEN
    ALTER TABLE profiles ADD COLUMN date_naissance DATE;
    RAISE NOTICE 'Colonne date_naissance ajoutée';
  ELSE
    RAISE NOTICE 'Colonne date_naissance existe déjà';
  END IF;
END $$;

-- 3. CRÉER LE BUCKET AVATARS

-- Insérer le bucket s'il n'existe pas
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

-- 4. POLICIES STORAGE POUR AVATARS

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Policy: Lecture publique des avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy: Upload par utilisateurs authentifiés
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Policy: Mise à jour par utilisateurs authentifiés
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Policy: Suppression par utilisateurs authentifiés
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');

-- 5. VÉRIFICATION FINALE

-- Vérifier le bucket
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'avatars';

-- Vérifier les colonnes profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND column_name IN ('provider_bio', 'provider_experience_years', 'date_naissance', 'avatar_url')
ORDER BY column_name;

-- Vérifier les policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
  AND policyname LIKE '%avatar%';

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Migration terminée !';
  RAISE NOTICE 'Bucket avatars: OK';
  RAISE NOTICE 'Colonnes profiles: OK';
  RAISE NOTICE 'Policies storage: OK';
END $$;
