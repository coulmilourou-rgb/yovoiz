# FIX: Upload Avatar et Mise à jour Profil

## Problèmes corrigés

### 1. Erreur "Bucket not found" lors de l'upload d'avatar

**Cause**: Le bucket `public` n'existait pas dans Supabase Storage

**Solution**:
- Changé le bucket de `public` vers `avatars`
- Ajout de création automatique du bucket lors du premier upload
- Créé le script SQL `CREATE-AVATAR-BUCKET.sql` pour configuration manuelle si nécessaire

### 2. Erreur "Erreur lors de la mise à jour" du profil

**Cause**: Le champ utilisé était `date_of_birth` mais la colonne dans la base s'appelle `date_naissance`

**Solution**:
- Renommé tous les `date_of_birth` en `date_naissance` dans le formulaire
- Ajout de messages d'erreur détaillés pour faciliter le débogage
- Ajout de logging console pour tracer les erreurs Supabase

## Modifications apportées

### `app/profile/info/page.tsx`

1. **État du formulaire** (ligne 22-32):
   ```typescript
   date_of_birth → date_naissance
   ```

2. **Upload avatar** (ligne 51-114):
   - Changé `from('public')` → `from('avatars')`
   - Ajout de `createBucket()` avec catch silencieux
   - Limite de taille: 5MB
   - Types acceptés: JPEG, PNG, WEBP, GIF

3. **Mise à jour profil** (ligne 116-155):
   - Corrigé `date_of_birth` → `date_naissance`
   - Ajout de messages d'erreur détaillés
   - Logging console pour débogage

4. **Formulaire** (ligne 325-338):
   - Input `date_naissance` au lieu de `date_of_birth`

## Configuration Supabase requise

### Option A: Automatique (déjà implémenté)
Le code tente de créer le bucket automatiquement au premier upload.

### Option B: Manuel (recommandé pour production)

1. Aller dans le dashboard Supabase
2. Storage → Create bucket
3. Nom: `avatars`
4. Public: ✅ Oui
5. Ou exécuter le script SQL:

```bash
# Dans l'éditeur SQL de Supabase
supabase/CREATE-AVATAR-BUCKET.sql
```

## Test

1. **Upload avatar**:
   - Connectez-vous
   - Menu utilisateur → Informations personnelles
   - Cliquer sur l'icône de caméra
   - Sélectionner une image (max 5MB)
   - ✅ Devrait afficher "Photo de profil mise à jour !"

2. **Mise à jour profil**:
   - Modifier n'importe quel champ (prénom, nom, téléphone, etc.)
   - Cliquer sur "Enregistrer les modifications"
   - ✅ Devrait afficher "Profil mis à jour avec succès !"

## Logs de débogage

En cas d'erreur, vérifier la console du navigateur :
- `Erreur upload avatar:` → Problème de Storage
- `Erreur Supabase:` → Problème de requête ou de colonne
- `Erreur mise à jour profil:` → Erreur générale

## Colonnes de la table `profiles`

Colonnes utilisées dans le formulaire :
- `first_name` VARCHAR(100) ✅
- `last_name` VARCHAR(100) ✅
- `phone` VARCHAR(20) ✅
- `date_naissance` DATE ✅ (Attention: pas `date_of_birth`)
- `commune` VARCHAR(100) ✅
- `address` TEXT ✅
- `bio` TEXT ✅
- `provider_bio` TEXT ✅
- `provider_experience_years` INTEGER ✅
- `avatar_url` TEXT ✅

## Prochaines étapes

Si l'erreur persiste :
1. Vérifier que le bucket `avatars` existe dans Supabase Storage
2. Vérifier les permissions RLS sur `storage.objects`
3. Vérifier que la colonne `date_naissance` existe dans `profiles`
4. Exécuter `CREATE-AVATAR-BUCKET.sql` manuellement
