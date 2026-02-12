# 🔧 Configuration Supabase - Système OTP

## Problème Actuel

L'erreur **"Impossible de générer le code"** apparaît car les tables et fonctions SQL n'existent pas encore dans votre base de données Supabase.

---

## ✅ Solution : Exécuter le Script SQL

### Étape 1 : Accéder à Supabase SQL Editor

1. Ouvrir votre navigateur
2. Aller sur **https://supabase.com**
3. Se connecter à votre compte
4. Sélectionner votre projet **Yo! Voiz**
5. Dans le menu latéral gauche, cliquer sur **SQL Editor**

### Étape 2 : Copier le Script SQL

1. Ouvrir le fichier : **`supabase/migration-otp.sql`**
2. Copier **TOUT** le contenu (Ctrl+A puis Ctrl+C)

### Étape 3 : Exécuter le Script

1. Dans Supabase SQL Editor, cliquer sur **"+ New query"**
2. Coller le script SQL (Ctrl+V)
3. Cliquer sur le bouton **"Run"** (en bas à droite) ou appuyer sur **Ctrl+Enter**
4. Attendre la fin de l'exécution

### Étape 4 : Vérifier que ça fonctionne

Dans le même SQL Editor, exécuter cette commande de test :

```sql
SELECT generate_otp_code('+2250123456789');
```

**Résultat attendu** : Un code à 6 chiffres (ex: `123456`)

Puis vérifier que le code est bien enregistré :

```sql
SELECT * FROM otp_codes ORDER BY created_at DESC LIMIT 5;
```

**Résultat attendu** : Une ligne avec votre numéro de test et le code généré

---

## 🎯 Après l'Exécution

Une fois le script exécuté avec succès :

1. **Retourner sur votre application** : http://localhost:3004/auth/inscription
2. **Rafraîchir la page** (F5)
3. **Remplir le formulaire d'inscription**
4. **Cliquer "Suivant"**

➡️ Cette fois, le code OTP devrait être généré correctement et s'afficher dans un **alert()** automatique !

---

## 📋 Ce que le Script Crée

Le script `migration-otp.sql` crée :

1. ✅ **Table `otp_codes`** : Pour stocker les codes OTP
2. ✅ **Fonction `generate_otp_code()`** : Génère un code à 6 chiffres
3. ✅ **Fonction `verify_otp_code()`** : Vérifie un code saisi
4. ✅ **Index de performance** : Pour les recherches rapides
5. ✅ **Row Level Security** : Pour la sécurité des données

---

## ❌ Si Vous Avez une Erreur

### Erreur : "relation already exists"

➡️ **Signification** : Les tables existent déjà  
➡️ **Action** : Ignorer cette erreur, c'est normal

### Erreur : "permission denied"

➡️ **Signification** : Vous n'avez pas les droits  
➡️ **Action** : Vérifier que vous êtes propriétaire du projet Supabase

### Erreur : "function already exists"

➡️ **Signification** : Les fonctions existent déjà  
➡️ **Action** : Le script utilise `CREATE OR REPLACE`, donc ça devrait passer. Si ça bloque, supprimer manuellement les anciennes fonctions :

```sql
DROP FUNCTION IF EXISTS generate_otp_code(VARCHAR);
DROP FUNCTION IF EXISTS verify_otp_code(VARCHAR, VARCHAR);
```

Puis réexécuter le script complet.

---

## 🔍 Débogage

Si après l'exécution du script, l'erreur persiste :

1. **Vérifier que la table existe** :
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'otp_codes';
```

2. **Vérifier que les fonctions existent** :
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_name IN ('generate_otp_code', 'verify_otp_code');
```

3. **Vérifier les logs du serveur Next.js**  
Dans votre terminal PowerShell où `npm run dev` tourne, chercher des messages d'erreur détaillés.

---

## 📞 Besoin d'Aide ?

Si le problème persiste après avoir suivi ces étapes :

1. Copiez le message d'erreur COMPLET affiché dans Supabase SQL Editor
2. Copiez aussi les logs du terminal Next.js (s'il y en a)
3. Partagez-moi ces informations

---

**Exécutez le script maintenant et dites-moi comment ça se passe ! 🚀**
