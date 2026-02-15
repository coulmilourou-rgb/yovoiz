# 🚨 CORRECTION URGENTE : Profil & Avatar

## ⚡ Action immédiate requise

Vous devez exécuter **1 seul script SQL** dans Supabase pour corriger les 2 erreurs.

---

## 📋 Procédure (5 minutes)

### Étape 1: Ouvrir Supabase

1. Aller sur https://supabase.com/dashboard
2. Sélectionner le projet **Yo!Voiz**
3. Cliquer sur **SQL Editor** dans le menu de gauche

### Étape 2: Exécuter le script de correction

1. Ouvrir le fichier : **`supabase/FIX-PROFIL-AVATAR-COLUMNS.sql`**
2. Copier TOUT le contenu du fichier
3. Coller dans l'éditeur SQL de Supabase
4. Cliquer sur **Run** (bouton ▶️ en haut à droite)

### Étape 3: Vérifier le résultat

Vous devriez voir dans les messages :
```
✅ Migration terminée !
✅ Bucket avatars: OK
✅ Colonnes profiles: OK
✅ Policies storage: OK
```

### Étape 4: Tester l'application

1. **Recharger la page** de votre application (F5)
2. **Test upload avatar** :
   - Menu utilisateur → Informations personnelles
   - Cliquer sur l'icône caméra 📷
   - Sélectionner une image
   - ✅ Devrait afficher : "Photo de profil mise à jour !"

3. **Test modification profil** :
   - Modifier le prénom ou la date de naissance
   - Cliquer sur "Enregistrer les modifications"
   - ✅ Devrait afficher : "Profil mis à jour avec succès !"

---

## 🔧 Ce que fait le script

### 1. Vérification des colonnes
- Vérifie si `provider_bio`, `provider_experience_years`, `date_naissance` existent
- Les crée si elles sont manquantes

### 2. Création du bucket avatars
- Crée le bucket `avatars` dans Storage
- Configure : Public, 5MB max, types image acceptés

### 3. Permissions (Policies)
- Tout le monde peut VOIR les avatars (lecture publique)
- Les utilisateurs connectés peuvent UPLOAD leur propre avatar
- Les utilisateurs connectés peuvent MODIFIER/SUPPRIMER leur avatar

---

## ❓ En cas de problème

### Si le script échoue

**Message d'erreur : "permission denied"**
→ Vous n'avez pas les droits admin sur Supabase
→ Solution : Se connecter avec le compte propriétaire du projet

**Message d'erreur : "relation does not exist"**
→ La table `profiles` n'existe pas
→ Solution : Exécuter d'abord `supabase/schema.sql`

### Si l'upload avatar ne marche toujours pas

1. Vérifier dans Dashboard Supabase → **Storage**
2. Le bucket `avatars` doit être présent
3. Cliquer sur `avatars` → Policies
4. Vous devriez voir 4 policies (SELECT, INSERT, UPDATE, DELETE)

### Si la modification profil ne marche toujours pas

1. Vérifier dans Dashboard Supabase → **Table Editor** → `profiles`
2. Les colonnes suivantes doivent exister :
   - `provider_bio` (text)
   - `provider_experience_years` (int4)
   - `date_naissance` (date)

---

## 📞 Besoin d'aide ?

Si après avoir suivi ces étapes les problèmes persistent :

1. Copier les messages d'erreur de la console (F12)
2. Faire une capture d'écran des erreurs
3. Vérifier les logs Supabase (Dashboard → Logs)

---

## ✅ Checklist finale

- [ ] Script SQL exécuté sans erreur
- [ ] Message "Migration terminée !" affiché
- [ ] Bucket `avatars` visible dans Storage
- [ ] Upload d'avatar fonctionne
- [ ] Modification profil fonctionne

Si tout est coché, vous pouvez continuer le développement ! 🎉
