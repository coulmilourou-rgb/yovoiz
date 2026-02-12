# ⚙️ Configuration Supabase - URLs de Redirection

## 🚨 Erreur "Une erreur est survenue. Vérifiez votre email."

Cette erreur apparaît quand l'URL de redirection **n'est pas autorisée** dans Supabase.

---

## ✅ Solution : Ajouter l'URL dans Supabase

### Étape 1 : Aller dans les Paramètres Supabase

1. **Ouvrir** : https://supabase.com
2. **Se connecter** et sélectionner le projet **Yo! Voiz**
3. **Cliquer** sur l'icône ⚙️ (Settings) en bas à gauche
4. **Aller dans** : Authentication → URL Configuration

### Étape 2 : Ajouter les URLs Autorisées

Dans la section **"Redirect URLs"**, ajouter :

```
http://localhost:3007/auth/reset-password
http://localhost:3000/auth/reset-password
http://localhost:3001/auth/reset-password
http://localhost:3002/auth/reset-password
http://localhost:3003/auth/reset-password
http://localhost:3004/auth/reset-password
http://localhost:3005/auth/reset-password
http://localhost:3006/auth/reset-password
```

**Pourquoi plusieurs ports ?**  
Parce que Next.js choisit automatiquement un port disponible si 3000 est occupé.

### Étape 3 : Ajouter Votre Domaine de Production

Quand vous déploierez en production, ajouter aussi :

```
https://votre-domaine.com/auth/reset-password
```

### Étape 4 : Sauvegarder

1. **Cliquer** sur "Save" en bas de la page
2. **Attendre** 10-20 secondes pour que les changements soient appliqués

---

## 🧪 Retester Maintenant

### Serveur : **http://localhost:3007**

1. **Aller sur** : http://localhost:3007/auth/mot-de-passe-oublie
2. **Entrer** votre email
3. **Cliquer** "Envoyer le lien"
4. **Ouvrir** la console du navigateur (F12)

### Dans la Console, vous verrez :

```javascript
Appel resetPassword avec email: votre@email.com
Demande de réinitialisation pour: votre@email.com
URL de redirection: http://localhost:3007/auth/reset-password
Résultat resetPasswordForEmail: { error: null }
Retour de resetPassword: { resetError: null }
Email de réinitialisation envoyé avec succès
```

**Si `error: null`** → ✅ **Ça fonctionne !** Vérifiez votre boîte email.

**Si une erreur apparaît** → Copiez le message d'erreur complet et partagez-le-moi.

---

## 🔍 Messages d'Erreur Possibles

### "Invalid Redirect URL"
➡️ L'URL n'est pas dans la liste autorisée de Supabase  
➡️ **Solution** : Ajouter l'URL dans Authentication → URL Configuration

### "Email not confirmed"
➡️ Le compte existe mais l'email n'est pas confirmé  
➡️ **Solution** : Confirmer l'email d'abord (vérifier l'email d'inscription)

### "User not found"
➡️ L'email n'existe pas dans la base de données  
➡️ **Note** : Par sécurité, Supabase devrait quand même retourner succès

### "Rate limit exceeded"
➡️ Trop de demandes en peu de temps  
➡️ **Solution** : Attendre 1-2 minutes avant de réessayer

---

## 📧 Vérifier les Emails

### En Développement

Supabase envoie des emails via leur service par défaut.

**Délai** : 10 secondes à 2 minutes  
**Spam** : Vérifiez votre dossier spam/indésirables

### Tester l'Envoi d'Email

Dans Supabase Dashboard :

1. **Aller dans** : Authentication → Users
2. **Trouver** votre utilisateur
3. **Cliquer** sur "..." → "Send password reset email"
4. **Vérifier** que l'email arrive

Si aucun email n'arrive :
- Vérifier que les emails sont activés dans Supabase
- Vérifier les logs dans Supabase Dashboard → Logs

---

## ✅ Checklist Configuration

- [ ] URLs de redirection ajoutées dans Supabase
- [ ] Changements sauvegardés
- [ ] Serveur relancé sur http://localhost:3007
- [ ] Page /auth/mot-de-passe-oublie accessible
- [ ] Console navigateur ouverte (F12)
- [ ] Email de test saisi
- [ ] Bouton "Envoyer" cliqué
- [ ] Console affiche "error: null"
- [ ] Email reçu (vérifier spam)

---

**Configurez Supabase maintenant et retestez ! Les logs dans la console vous diront exactement ce qui ne va pas. 🚀**
