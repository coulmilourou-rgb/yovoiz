# 🚀 MIGRATION COMPLÈTE - GUIDE RAPIDE

## ⚡ UN SEUL SCRIPT À EXÉCUTER

Ce script corrige **TOUS** les problèmes en une seule fois :

- ❌ Erreur upload photo de profil → ✅ Corrigé
- ❌ Erreur upload photo de couverture → ✅ Corrigé
- ❌ Erreur modification profil → ✅ Corrigé
- ❌ Erreur périmètre d'intervention → ✅ Corrigé

---

## 📋 PROCÉDURE (5 minutes)

### Étape 1: Ouvrir Supabase

1. Aller sur https://supabase.com/dashboard
2. Sélectionner le projet **Yo!Voiz**
3. Cliquer sur **SQL Editor** dans le menu de gauche

### Étape 2: Exécuter le script

1. Ouvrir le fichier : **`MIGRATION-COMPLETE-PROFILES.sql`**
2. **Copier TOUT** le contenu du fichier (Ctrl+A puis Ctrl+C)
3. **Coller** dans l'éditeur SQL de Supabase
4. Cliquer sur **Run** (bouton ▶️ en haut à droite)
5. Attendre 5-10 secondes

### Étape 3: Vérifier le résultat

Vous devriez voir dans les messages :

```
🎉 MIGRATION RÉUSSIE !

✨ Vous pouvez maintenant:
  • Uploader des photos de profil (avatars)
  • Uploader des photos de couverture
  • Gérer le périmètre d'intervention
  • Modifier les informations de profil

🚀 Redémarrez l'application et testez !
```

---

## ✅ CE QUE FAIT LE SCRIPT

### 1. Colonnes ajoutées dans `profiles` :
- ✅ `avatar_url` (TEXT) - URL photo de profil
- ✅ `cover_url` (TEXT) - URL photo de couverture
- ✅ `date_naissance` (DATE) - Date de naissance
- ✅ `provider_bio` (TEXT) - Bio prestataire
- ✅ `provider_experience_years` (INTEGER) - Années d'expérience
- ✅ `availability_hours` (JSONB) - Disponibilités (jours/horaires)

### 2. Buckets créés dans Storage :
- ✅ `avatars` - Photos de profil (public, 5MB max)
- ✅ `covers` - Photos de couverture (public, 5MB max)

### 3. Permissions configurées :
- ✅ 8 policies (4 pour avatars + 4 pour covers)
- ✅ Lecture publique (tout le monde peut voir)
- ✅ Upload/modification/suppression (utilisateurs authentifiés uniquement)

---

## 🧪 TESTS À FAIRE APRÈS

### Test 1: Photo de profil ✅

1. Se connecter à l'application
2. Menu utilisateur → **Informations personnelles**
3. Cliquer sur l'icône 📷 sur la photo
4. Sélectionner une image
5. **Résultat attendu**: "✅ Photo de profil mise à jour !"

### Test 2: Photo de couverture ✅

1. **Abonnement Pro** → **Modifier ma page**
2. Section "Photo de couverture" → Cliquer sur 📷
3. Sélectionner une image
4. **Résultat attendu**: "✅ Photo de couverture mise à jour !"
5. **Voir Ma Page** → La photo doit s'afficher en haut

### Test 3: Modification profil ✅

1. **Informations personnelles**
2. Modifier n'importe quel champ (prénom, date de naissance, etc.)
3. Cliquer sur "Enregistrer les modifications"
4. **Résultat attendu**: "✅ Profil mis à jour avec succès !"

### Test 4: Périmètre d'intervention ✅

1. Menu utilisateur → **Gérer mon périmètre**
2. Sélectionner au moins 1 commune + 1 catégorie
3. (Optionnel) Sélectionner jours/horaires
4. Cliquer sur "Enregistrer mes préférences"
5. **Résultat attendu**: "✅ Périmètre d'intervention sauvegardé !"

---

## ❓ EN CAS DE PROBLÈME

### Le script affiche "MIGRATION INCOMPLÈTE"

**Vérifier** :
1. Avez-vous exécuté le script complet ? (pas juste une partie)
2. Y a-t-il des erreurs dans les messages ?
3. Avez-vous les droits administrateur sur le projet Supabase ?

**Solution** : Copier le message d'erreur complet et vérifier.

### Une fonctionnalité ne marche toujours pas

**Vérifier dans Supabase Dashboard** :

**A. Colonnes** :
1. Table Editor → `profiles`
2. Vérifier que toutes les colonnes listées ci-dessus existent

**B. Buckets** :
1. Storage → Vérifier que `avatars` et `covers` existent
2. Cliquer sur chaque bucket → Settings → Vérifier "Public: Yes"

**C. Policies** :
1. Storage → `avatars` ou `covers` → Policies
2. Vous devriez voir 4 policies pour chaque bucket

---

## 📊 VÉRIFICATION MANUELLE

Si vous voulez vérifier manuellement avant le script, exécutez :

```sql
-- Vérifier colonnes
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN (
    'avatar_url', 'cover_url', 'date_naissance',
    'provider_bio', 'provider_experience_years', 'availability_hours'
  );

-- Vérifier buckets
SELECT id, name, public 
FROM storage.buckets
WHERE id IN ('avatars', 'covers');

-- Vérifier policies
SELECT policyname 
FROM pg_policies
WHERE tablename = 'objects'
  AND (policyname LIKE '%avatar%' OR policyname LIKE '%cover%');
```

---

## 🎯 RÉSUMÉ

| Avant | Après |
|-------|-------|
| ❌ Upload avatar échoue | ✅ Fonctionne |
| ❌ Upload cover échoue | ✅ Fonctionne |
| ❌ Modification profil échoue | ✅ Fonctionne |
| ❌ Périmètre ne s'enregistre pas | ✅ Fonctionne |
| ❌ Dégradé orange-vert fixe | ✅ Photo de couverture |

---

## 💡 ASTUCE

Une fois tout testé et fonctionnel :
- Les photos sont stockées dans Supabase Storage
- Elles sont servies via CDN (rapide)
- Elles sont publiques (visibles par tous)
- Elles sont sécurisées (seul le propriétaire peut modifier)

---

## 📞 SUPPORT

Si le script échoue complètement :
1. Copier le message d'erreur COMPLET
2. Vérifier dans Supabase → Logs
3. S'assurer d'avoir les droits admin sur le projet
4. Essayer de copier-coller à nouveau (erreur de copie possible)

**Important** : Le script est idempotent = vous pouvez l'exécuter plusieurs fois sans problème. S'il échoue, corrigez l'erreur et relancez-le.
