-- =====================================================
-- CRÉATION DU BUCKET POUR AVATARS
-- =====================================================
-- Ce script crée le bucket de stockage pour les photos de profil
-- Exécuter dans l'éditeur SQL de Supabase

-- Créer le bucket 'avatars' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Bucket public
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Politique: Tout le monde peut voir les avatars (lecture publique)
CREATE POLICY IF NOT EXISTS "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Politique: Les utilisateurs authentifiés peuvent uploader leur propre avatar
CREATE POLICY IF NOT EXISTS "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = (storage.filename(name))::text
);

-- Politique: Les utilisateurs peuvent mettre à jour leur propre avatar
CREATE POLICY IF NOT EXISTS "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'avatars'
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Politique: Les utilisateurs peuvent supprimer leur propre avatar
CREATE POLICY IF NOT EXISTS "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Vérification
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'avatars';
