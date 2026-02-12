# ⚡ Guide Rapide - Configuration Supabase OTP

## 🎯 Objectif
Créer les tables et fonctions SQL pour que le système OTP fonctionne.

---

## 📋 Étapes (5 minutes)

### 1️⃣ Ouvrir Supabase SQL Editor

1. Aller sur : **https://supabase.com**
2. Se connecter
3. Sélectionner votre projet **Yo! Voiz**
4. Cliquer sur **"SQL Editor"** (menu gauche, icône `</>`)

### 2️⃣ Copier le Script

1. Ouvrir le fichier : **`supabase/migration-otp-simple.sql`**
2. Sélectionner TOUT (Ctrl+A)
3. Copier (Ctrl+C)

### 3️⃣ Exécuter le Script

1. Dans Supabase SQL Editor, cliquer **"+ New query"**
2. Coller le script (Ctrl+V)
3. Cliquer **"Run"** (bouton vert en bas à droite)
4. Attendre 2-3 secondes

### 4️⃣ Vérifier

Si vous voyez :

```
Success. No rows returned
```

✅ **C'EST BON !** Passez à l'étape 5.

Si vous voyez une erreur, lisez la section "Erreurs Courantes" en bas.

### 5️⃣ Tester (Optionnel)

Dans le même éditeur, effacer tout et exécuter :

```sql
SELECT generate_otp_code('+2250123456789');
```

➡️ Vous devriez voir un code à 6 chiffres (ex: `123456`)

Ensuite :

```sql
SELECT * FROM otp_codes ORDER BY created_at DESC LIMIT 3;
```

➡️ Vous devriez voir la ligne avec votre code de test

### 6️⃣ Retester l'Application

1. Retourner sur : **http://localhost:3004/auth/inscription**
2. Rafraîchir la page (F5)
3. Remplir le formulaire
4. Cliquer "Suivant"

➡️ **L'alert avec le code OTP devrait apparaître !** 🎉

---

## ❌ Erreurs Courantes

### "relation already exists"
➡️ **Normal**, la table existait déjà. **Continuer quand même.**

### "function already exists"
➡️ **Normal**, le script utilise `CREATE OR REPLACE`. **C'est OK.**

### "policy already exists"
➡️ Le script supprime l'ancienne avant d'en créer une nouvelle. Si ça bloque :

```sql
DROP POLICY IF EXISTS "Users can view own OTP codes" ON otp_codes;
```

Puis réexécuter le script complet.

### "permission denied"
➡️ Vous n'êtes pas propriétaire du projet. Vérifiez que vous êtes connecté au bon compte Supabase.

---

## 🆘 Besoin d'Aide ?

Si le script ne passe toujours pas :

1. **Copier le message d'erreur COMPLET**
2. **Me le partager avec le numéro de ligne**

Je vous aiderai à résoudre le problème.

---

## ✅ Checklist

- [ ] Script copié depuis `migration-otp-simple.sql`
- [ ] Exécuté dans Supabase SQL Editor
- [ ] Aucune erreur bloquante
- [ ] Test généré un code (optionnel)
- [ ] Application retestée → Alert OTP s'affiche

---

**Exécutez maintenant et dites-moi si ça marche ! 🚀**
