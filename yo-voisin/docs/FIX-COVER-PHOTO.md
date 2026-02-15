# FIX: Photo de couverture - Installation complète

## Problèmes résolus

1. ❌ La photo de couverture ne s'affiche pas (dégradé orange-vert affiché à la place)
2. ❌ Erreur lors de l'upload de la photo de couverture
3. ❌ Erreur lors de l'upload de la photo de profil (avatar)

---

## Cause

- La colonne `cover_url` n'existe pas dans la table `profiles`
- Le bucket `covers` n'existe pas dans Supabase Storage  
- Le code utilisait un mauvais bucket (`profiles` au lieu de `covers` et `avatars`)

---

## Solution (3 étapes)

### Étape 1: Exécuter les scripts SQL (OBLIGATOIRE)

#### A. Photo de couverture

1. Dashboard Supabase → SQL Editor
2. Copier-coller : `supabase/CREATE-COVER-PHOTO.sql`
3. Run ▶️

**Ce script fait** :
- ✅ Ajoute la colonne `cover_url` (TEXT) dans `profiles`
- ✅ Crée le bucket `covers` (public, 5MB max)
- ✅ Configure les policies (lecture publique, upload/update/delete authentifié)

#### B. Photo de profil (si erreur avatar persiste)

1. Dashboard Supabase → SQL Editor
2. Copier-coller : `supabase/FIX-PROFIL-AVATAR-COLUMNS.sql`
3. Run ▶️

**Ce script fait** :
- ✅ Crée le bucket `avatars` (public, 5MB max)
- ✅ Configure les policies pour avatars

### Étape 2: Code corrigé automatiquement

#### Fichiers modifiés :

**1. `components/abonnement/ProfileEditEmbed.tsx`**

**Photo de couverture (lignes 47-109)** :
```typescript
// ❌ AVANT
.from('profiles') // Mauvais bucket

// ✅ APRÈS
await supabase.storage.createBucket('covers', {
  public: true,
  fileSizeLimit: 5242880
}).catch(() => {}); // Crée auto si manquant

.from('covers') // Bon bucket
.upload(filePath, file, {
  cacheControl: '3600',
  upsert: true
});
```

**Photo de profil (lignes 111-166)** :
```typescript
// ❌ AVANT
.from('profiles') // Mauvais bucket

// ✅ APRÈS
await supabase.storage.createBucket('avatars', {
  public: true,
  fileSizeLimit: 5242880
}).catch(() => {});

.from('avatars') // Bon bucket
```

**2. `components/abonnement/ProfilePublicEmbed.tsx`**

Affichage de la photo de couverture (lignes 116-126) :
```typescript
{profile.cover_url ? (
  <img
    src={profile.cover_url}
    alt="Photo de couverture"
    className="w-full h-full object-cover"
  />
) : (
  <div className="bg-gradient-to-r from-yo-orange via-yo-orange-light to-yo-green"></div>
)}
```

### Étape 3: Vérification dans Supabase Dashboard

#### A. Vérifier les buckets

1. Dashboard → **Storage**
2. Vous devriez voir :
   - ✅ `avatars` (public, 5MB)
   - ✅ `covers` (public, 5MB)

#### B. Vérifier la colonne

1. Dashboard → **Table Editor** → `profiles`
2. Vérifier la colonne :
   - ✅ `cover_url` (text, nullable)

---

## Test

### Test 1: Upload photo de couverture

1. Se connecter à l'application
2. Aller dans **Abonnement Pro**
3. Cliquer sur **Modifier ma page**
4. Section "Photo de couverture" :
   - Cliquer sur **Choisir une image** ou icône 📷
   - Sélectionner une image (JPG, PNG, WEBP, max 5MB)
5. **Résultat attendu** : `✅ Photo de couverture mise à jour avec succès !`

### Test 2: Affichage de la couverture

1. Aller dans **Abonnement Pro**
2. Cliquer sur **Voir Ma Page**
3. **Résultat attendu** : Votre photo de couverture s'affiche en haut (au lieu du dégradé orange-vert)

### Test 3: Upload photo de profil

1. **Abonnement Pro** → **Modifier ma page**
2. Section "Photo de profil" :
   - Cliquer sur l'icône 📷 sur la photo de profil
   - Sélectionner une image
3. **Résultat attendu** : `✅ Photo de profil mise à jour avec succès !`

---

## Structure finale

### Table `profiles`

| Colonne | Type | Description |
|---------|------|-------------|
| `avatar_url` | TEXT | URL de la photo de profil |
| `cover_url` | TEXT | URL de la photo de couverture ⚠️ **Nouvelle** |

### Buckets Storage

| Bucket | Public | Taille max | Types |
|--------|--------|------------|-------|
| `avatars` | ✅ Oui | 5MB | JPEG, PNG, WEBP, GIF |
| `covers` | ✅ Oui | 5MB | JPEG, PNG, WEBP, GIF |

### Policies Storage

**Bucket `covers`** :
- ✅ SELECT (public) - Tout le monde peut voir
- ✅ INSERT (authenticated) - Upload par utilisateurs connectés
- ✅ UPDATE (authenticated) - Modification par utilisateurs connectés
- ✅ DELETE (authenticated) - Suppression par utilisateurs connectés

**Bucket `avatars`** :
- ✅ SELECT (public)
- ✅ INSERT (authenticated)
- ✅ UPDATE (authenticated)
- ✅ DELETE (authenticated)

---

## Dépannage

### Erreur : "Bucket not found"

**Cause** : Le bucket `covers` ou `avatars` n'existe pas.

**Solution** :
1. Exécuter `supabase/CREATE-COVER-PHOTO.sql`
2. OU créer manuellement dans Dashboard → Storage → New bucket

### Erreur : "Column 'cover_url' does not exist"

**Cause** : La colonne n'a pas été créée.

**Solution** : Exécuter `supabase/CREATE-COVER-PHOTO.sql`

### La photo ne s'affiche pas après upload

**Vérifications** :
1. Console du navigateur (F12) → Vérifier les erreurs
2. Dashboard Supabase → Storage → `covers` → Vérifier si le fichier est présent
3. Dashboard Supabase → Table Editor → `profiles` → Vérifier si `cover_url` est renseigné

**Possible problème de CORS** :
- Vérifier dans Dashboard Supabase → Settings → Storage → CORS
- Ajouter `*` dans les origines autorisées si nécessaire

### L'upload fonctionne mais l'image ne s'affiche pas

**Vérifier les permissions** :
1. Dashboard → Storage → `covers` → Policies
2. S'assurer que la policy "Cover images are publicly accessible" existe
3. Elle doit avoir : `USING (bucket_id = 'covers')` sans restriction

---

## Amélioration : Rendre les noms de prestataires cliquables

Pour que les noms de prestataires soient cliquables et redirigent vers leur page profil :

### Dans les listes de demandes/offres :

```typescript
// Au lieu de juste afficher le nom
<span>{provider.first_name} {provider.last_name}</span>

// Rendre cliquable vers la page profil publique
<a 
  href={`/profile/public/${provider.id}`}
  className="font-semibold text-yo-orange hover:underline cursor-pointer"
>
  {provider.first_name} {provider.last_name}
</a>
```

### Créer la route dynamique :

Fichier : `app/profile/public/[id]/page.tsx`

```typescript
'use client';

import { useParams } from 'next/navigation';
import ProfilePublicEmbed from '@/components/abonnement/ProfilePublicEmbed';

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params?.id as string;
  
  return <ProfilePublicEmbed userId={userId} />;
}
```

Puis modifier `ProfilePublicEmbed.tsx` pour accepter un prop `userId` optionnel.

---

## Checklist finale

- [ ] Script SQL `CREATE-COVER-PHOTO.sql` exécuté
- [ ] Bucket `covers` créé dans Storage
- [ ] Bucket `avatars` créé dans Storage
- [ ] Colonne `cover_url` existe dans `profiles`
- [ ] Upload photo de couverture fonctionne
- [ ] Upload photo de profil fonctionne
- [ ] Photo de couverture s'affiche dans "Voir Ma Page"
- [ ] (Bonus) Noms de prestataires cliquables

---

## Prochaines étapes

Une fois tout fonctionnel :

1. ✅ Les prestataires peuvent personnaliser leur page avec une belle photo de couverture
2. ✅ Les profils sont plus professionnels et visuellement attractifs
3. ✅ Les demandeurs peuvent cliquer sur les noms des prestataires pour voir leur page complète
4. ✅ Les photos de couverture et avatars sont hébergées de manière sécurisée sur Supabase Storage

---

## Support

Si les problèmes persistent :
1. Vérifier les logs Supabase (Dashboard → Logs)
2. Vérifier la console navigateur (F12)
3. S'assurer que les scripts SQL ont été exécutés sans erreur
4. Copier les messages d'erreur complets pour diagnostic
