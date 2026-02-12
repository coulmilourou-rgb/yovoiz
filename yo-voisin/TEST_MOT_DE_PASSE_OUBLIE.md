# 🔐 Test du Système "Mot de passe oublié"

## Serveur : http://localhost:3006

---

## ⚠️ Important : Flux Complet Requis

La page `/auth/reset-password` **ne fonctionne QUE** si vous arrivez via le lien de l'email de réinitialisation. 

**Si vous accédez directement** à `/auth/reset-password` sans passer par l'email, le bouton restera bloqué sur "Réinitialisation..." car **il n'y a pas de session de réinitialisation active**.

---

## ✅ Flux de Test Complet

### Étape 1 : Configuration Email Supabase

Avant de tester, assurez-vous que Supabase est configuré pour envoyer des emails :

1. **Aller sur** : https://supabase.com
2. **Sélectionner** votre projet Yo! Voiz
3. **Aller dans** : Authentication → Email Templates
4. **Vérifier** que "Reset Password" est configuré
5. **Template par défaut** :
   ```
   <h2>Reset Password</h2>
   <p>Follow this link to reset the password for your user:</p>
   <p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
   ```

### Étape 2 : Demander la Réinitialisation

1. **Aller sur** : http://localhost:3006/auth/connexion
2. **Cliquer** sur "Mot de passe oublié ?"
3. **Entrer** votre email (celui utilisé pour l'inscription)
4. **Cliquer** "Envoyer le lien de réinitialisation"
5. **Voir** le message de succès : "Email envoyé !"

### Étape 3 : Vérifier l'Email

1. **Ouvrir** votre boîte email
2. **Chercher** un email de Supabase (vérifiez aussi les spams)
3. **Sujet** : "Reset Your Password" ou similaire
4. **Contenu** : Un lien "Reset Password"

### Étape 4 : Cliquer sur le Lien

Le lien ressemblera à :
```
http://localhost:3006/auth/reset-password?token=xxx&type=recovery
```

**Important** : Ce lien contient un `token` de récupération qui :
- ✅ Valide votre identité
- ✅ Autorise le changement de mot de passe
- ⏰ Expire après **1 heure**

### Étape 5 : Changer le Mot de Passe

1. **Saisir** un nouveau mot de passe (min 8 caractères)
2. **Observer** l'indicateur de force :
   - 🔴 Faible (< 2 critères)
   - 🟡 Moyen (2 critères)
   - 🔵 Bon (3 critères)
   - 🟢 Excellent (4 critères)
3. **Confirmer** le mot de passe
4. **Cliquer** "Réinitialiser le mot de passe"

### Étape 6 : Succès et Redirection

1. **Message** : "Mot de passe réinitialisé !"
2. **Redirection automatique** vers `/auth/connexion` après 3 secondes
3. **Se connecter** avec le nouveau mot de passe

---

## 🧪 Scénarios de Test

### ✅ Test 1 : Flux Complet Réussi

**Étapes** :
1. Demander réinitialisation avec email valide
2. Recevoir l'email
3. Cliquer sur le lien
4. Changer le mot de passe
5. Se connecter avec le nouveau mot de passe

**Résultat attendu** :
- ✅ Email reçu dans les 1-2 minutes
- ✅ Lien fonctionne et ouvre la page reset-password
- ✅ Mot de passe mis à jour
- ✅ Connexion réussie avec nouveau mot de passe

### ❌ Test 2 : Email Invalide

**Étapes** :
1. Entrer un email qui n'existe pas : `inexistant@example.com`
2. Cliquer "Envoyer"

**Résultat attendu** :
- ✅ Message "Email envoyé !" (même si l'email n'existe pas, pour des raisons de sécurité)
- ❌ Aucun email reçu (normal)

### ❌ Test 3 : Mots de Passe Non Correspondants

**Étapes** :
1. Arriver sur /auth/reset-password via le lien email
2. Nouveau mot de passe : `Password123!`
3. Confirmation : `Different123!`
4. Cliquer "Réinitialiser"

**Résultat attendu** :
- ❌ Message d'erreur : "Les mots de passe ne correspondent pas"
- 🔒 Bouton reste cliquable pour réessayer

### ❌ Test 4 : Mot de Passe Trop Court

**Étapes** :
1. Nouveau mot de passe : `Pass1!`
2. Confirmation : `Pass1!`
3. Cliquer "Réinitialiser"

**Résultat attendu** :
- ❌ Message d'erreur : "Le mot de passe doit contenir au moins 8 caractères"

### ⏰ Test 5 : Token Expiré

**Étapes** :
1. Demander une réinitialisation
2. Attendre **plus de 1 heure**
3. Cliquer sur le lien dans l'email

**Résultat attendu** :
- ❌ Message d'erreur : "Impossible de réinitialiser le mot de passe: Token has expired"
- 🔄 Besoin de redemander une réinitialisation

### 🔄 Test 6 : Renvoyer l'Email

**Étapes** :
1. Sur la page de succès (après "Envoyer le lien")
2. Cliquer "Renvoyer l'email"
3. Formulaire s'affiche à nouveau
4. Cliquer "Envoyer"

**Résultat attendu** :
- ✅ Nouveau lien envoyé
- ⚠️ L'ancien lien reste valide (si pas encore expiré)

---

## 🔍 Débogage

### Console Navigateur (F12)

Avec les logs ajoutés, vous verrez :

```javascript
Tentative de mise à jour du mot de passe...
Résultat updatePassword: { updateError: null }
Mot de passe mis à jour avec succès
```

Si erreur :
```javascript
Erreur lors de la mise à jour: { 
  message: "User not found",
  status: 400
}
```

### Erreurs Courantes

**"User not found"** :
- ➡️ Vous n'avez pas cliqué sur le lien de l'email
- ➡️ Vous accédez directement à `/auth/reset-password`
- ➡️ Solution : Passer par le flux complet

**"Token has expired"** :
- ➡️ Plus de 1 heure depuis la demande
- ➡️ Solution : Redemander une réinitialisation

**"Invalid credentials"** :
- ➡️ Session de récupération invalide
- ➡️ Solution : Redemander une réinitialisation

**Aucun email reçu** :
- ➡️ Vérifier les spams
- ➡️ Attendre 2-3 minutes
- ➡️ Vérifier que l'email est bien configuré dans Supabase

---

## 📧 Configuration Email Production

En développement, Supabase envoie des emails via leur service.

En production, vous devrez peut-être configurer votre propre SMTP :

1. Supabase Dashboard → Project Settings → Authentication
2. SMTP Settings → Custom SMTP
3. Configurer avec SendGrid, Mailgun, ou autre

---

## ✅ Checklist

- [ ] Page /auth/mot-de-passe-oublie accessible
- [ ] Formulaire envoie l'email
- [ ] Message de succès affiché
- [ ] Email reçu (vérifier spams)
- [ ] Lien dans l'email fonctionne
- [ ] Page /auth/reset-password s'ouvre
- [ ] Indicateur de force du mot de passe fonctionne
- [ ] Validation des mots de passe fonctionne
- [ ] Mot de passe mis à jour avec succès
- [ ] Redirection automatique vers connexion
- [ ] Connexion avec nouveau mot de passe réussie

---

**Testez maintenant le flux complet et dites-moi à quelle étape ça bloque ! 🚀**
