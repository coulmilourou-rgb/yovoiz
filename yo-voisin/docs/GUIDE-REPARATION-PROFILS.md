# GUIDE: Résolution erreurs Profil et Avatar

## Problèmes rencontrés

### 1. ❌ Erreur "Bucket not found" lors de l'upload d'avatar
### 2. ❌ Erreur "Could not find the 'provider_bio' column" lors de la mise à jour du profil

---

## Solution rapide (RECOMMANDÉE)

### Étape 1: Exécuter le script SQL de correction

1. Aller dans votre dashboard Supabase : https://supabase.com/dashboard
2. Sélectionner votre projet `Yo!Voiz`
3. Aller dans **SQL Editor** (menu de gauche)
4. Copier-coller le contenu du fichier : `supabase/FIX-PROFIL-AVATAR-COLUMNS.sql`
5. Cliquer sur **Run** (▶️)

Le script va :
- ✅ Vérifier et créer les colonnes manquantes dans `profiles`
- ✅ Créer le bucket `avatars` dans Storage
- ✅ Configurer les permissions (RLS policies)
- ✅ Afficher un rapport de vérification

### Étape 2: Vérifier dans le dashboard

#### A. Vérifier le bucket avatars
1. Aller dans **Storage** (menu de gauche)
2. Vous devriez voir le bucket `avatars`
3. Paramètres du bucket :
   - Public: ✅ Oui
   - Taille max: 5 MB
   - Types acceptés: JPEG, PNG, WEBP, GIF

#### B. Vérifier les colonnes de la table profiles
1. Aller dans **Table Editor** → `profiles`
2. Vérifier la présence des colonnes :
   - `avatar_url` (text)
   - `date_naissance` (date)
   - `provider_bio` (text)
   - `provider_experience_years` (integer)

---

## Modifications du code apportées

### 1. Upload avatar - Gestion robuste

**Fichier**: `app/profile/info/page.tsx` (lignes 51-114)

**Changements**:
```typescript
// ❌ AVANT (bucket qui n'existe pas)
.from('public')

// ✅ APRÈS (bucket créé avec fallback)
await supabase.storage.createBucket('avatars', {
  public: true,
  fileSizeLimit: 5242880
}).catch(() => {}); // Ignorer si existe déjà

.from('avatars')
```

### 2. Mise à jour profil - Colonnes conditionnelles

**Fichier**: `app/profile/info/page.tsx` (lignes 116-164)

**Changements**:
```typescript
// ❌ AVANT (envoi de toutes les colonnes, même manquantes)
.update({
  first_name: formData.first_name,
  provider_bio: formData.provider_bio, // ❌ Peut ne pas exister
  // ...
})

// ✅ APRÈS (ajout conditionnel des colonnes)
const updateData: any = {
  first_name: formData.first_name,
  last_name: formData.last_name,
  phone: formData.phone,
  commune: formData.commune,
};

// Ajouter seulement si renseigné
if (formData.provider_bio) updateData.provider_bio = formData.provider_bio;
if (formData.date_naissance) updateData.date_naissance = formData.date_naissance;
```

---

## Test après correction

### Test 1: Upload avatar

1. Se connecter à l'application
2. Menu utilisateur → **Informations personnelles**
3. Cliquer sur l'icône 📷 (caméra)
4. Sélectionner une image (JPG, PNG, WEBP, GIF, max 5MB)
5. **Résultat attendu**: ✅ "Photo de profil mise à jour !"

**Si l'erreur persiste**:
- Vérifier dans Supabase Dashboard → Storage → que le bucket `avatars` existe
- Vérifier les policies dans Storage → `avatars` → Policies

### Test 2: Modification profil

1. Menu utilisateur → **Informations personnelles**
2. Modifier n'importe quel champ (prénom, nom, téléphone, date de naissance, etc.)
3. Cliquer sur **Enregistrer les modifications**
4. **Résultat attendu**: ✅ "Profil mis à jour avec succès !"

**Si l'erreur persiste**:
- Vérifier dans Supabase Dashboard → Table Editor → `profiles`
- Vérifier que les colonnes existent : `provider_bio`, `provider_experience_years`, `date_naissance`

---

## Dépannage avancé

### Erreur: "Bucket not found" persiste

**Solution manuelle** :

1. Dashboard Supabase → **Storage**
2. Cliquer sur **New bucket**
3. Paramètres :
   - Name: `avatars`
   - Public: ✅ Oui
   - File size limit: `5242880` (5MB)
   - Allowed MIME types: `image/jpeg,image/jpg,image/png,image/webp,image/gif`
4. Sauvegarder

### Erreur: "Column not found" persiste

**Vérification SQL** :

```sql
-- Lister toutes les colonnes de profiles
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

**Ajout manuel des colonnes manquantes** :

```sql
-- Si provider_bio n'existe pas
ALTER TABLE profiles ADD COLUMN provider_bio TEXT;

-- Si provider_experience_years n'existe pas
ALTER TABLE profiles ADD COLUMN provider_experience_years INTEGER DEFAULT 0;

-- Si date_naissance n'existe pas
ALTER TABLE profiles ADD COLUMN date_naissance DATE;
```

---

## Colonnes de la table `profiles` (référence complète)

### Colonnes obligatoires
- `id` (UUID, PK)
- `first_name` (VARCHAR 100) ✅
- `last_name` (VARCHAR 100) ✅
- `phone` (VARCHAR 20, UNIQUE) ✅
- `commune` (VARCHAR 100) ✅

### Colonnes optionnelles utilisées
- `address` (TEXT)
- `bio` (TEXT)
- `avatar_url` (TEXT) ⚠️ **Important pour l'upload**
- `date_naissance` (DATE) ⚠️ **Peut manquer**
- `provider_bio` (TEXT) ⚠️ **Peut manquer**
- `provider_experience_years` (INTEGER) ⚠️ **Peut manquer**

### Colonnes système
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

---

## Prochaines étapes si tout fonctionne

✅ Upload d'avatar : OK  
✅ Modification profil : OK  
✅ Bucket avatars créé : OK  
✅ Colonnes profiles synchronisées : OK  

Vous pouvez maintenant :
1. Tester l'upload d'avatar en production (Vercel)
2. Tester la modification du profil
3. Passer aux fonctionnalités suivantes

---

## Logs de débogage

En cas d'erreur, vérifier la console du navigateur (F12) :

```
🔍 Pour upload avatar:
- "Erreur upload avatar:" → Vérifier Storage/bucket
- "Bucket not found" → Exécuter CREATE-AVATAR-BUCKET.sql

🔍 Pour mise à jour profil:
- "Erreur Supabase:" → Vérifier colonnes de la table
- "Column not found" → Exécuter FIX-PROFIL-AVATAR-COLUMNS.sql
```

---

## Support

Si les problèmes persistent après avoir suivi ce guide :
1. Vérifier les logs Supabase (Dashboard → Logs)
2. Vérifier les permissions RLS (Dashboard → Authentication → Policies)
3. Contacter le support technique avec les logs d'erreur
