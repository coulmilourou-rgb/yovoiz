# 📧 Configuration Email de Confirmation - Supabase

## ⚙️ Étapes de Configuration dans Supabase Dashboard

### 1. **Activer les Emails de Confirmation**

1. Ouvrir **Supabase Dashboard** : https://supabase.com/dashboard
2. Sélectionner votre projet : `hfrmctsvpszqdizritoe`
3. Aller dans : **Authentication** → **Providers** → **Email**
4. Configuration recommandée :

```
✅ Enable email provider: ON
✅ Enable email confirmations: ON (ACTIVÉ)
✅ Secure email change: ON (recommandé)
```

---

### 2. **Configurer l'URL de Redirection**

Dans **Authentication** → **URL Configuration** :

**Site URL** (Production) :
```
https://yovoiz.vercel.app
```

**Redirect URLs** (Authorized) :
```
https://yovoiz.vercel.app/auth/confirm-email
https://yovoiz.vercel.app/auth/reset-password
http://localhost:3000/auth/confirm-email
http://localhost:3000/auth/reset-password
```

---

### 3. **Personnaliser le Template d'Email**

Dans **Authentication** → **Email Templates** → **Confirm signup** :

#### Sujet :
```
Confirmez votre email - Yo! Voiz
```

#### Corps de l'email :
```html
<h2>Bienvenue sur Yo! Voiz ! 👋</h2>

<p>Merci de vous être inscrit. Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>

<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #00B894; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Confirmer mon email</a></p>

<p>Ou copiez ce lien dans votre navigateur :</p>
<p style="word-break: break-all; color: #666;">{{ .ConfirmationURL }}</p>

<p style="margin-top: 24px; color: #666; font-size: 12px;">
  Si vous n'avez pas créé de compte sur Yo! Voiz, ignorez cet email.
</p>

<p style="margin-top: 16px;">
  À bientôt sur Yo! Voiz ! 🚀<br>
  L'équipe Yo! Voiz
</p>
```

---

### 4. **Variables d'Environnement Vercel**

Vérifier que ces variables sont bien configurées dans **Vercel** → **Settings** → **Environment Variables** :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hfrmctsvpszqdizritoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=https://yovoiz.vercel.app
```

---

## 🔄 Flux de Confirmation d'Email

### Parcours Utilisateur :

1. **Inscription** (`/auth/inscription`)
   - L'utilisateur remplit le formulaire
   - Clique sur "Créer mon compte"
   - Le trigger PostgreSQL crée automatiquement le profil

2. **Page de Bienvenue** (Step 5)
   - Message de félicitations
   - Instruction claire : "Confirmez votre email maintenant"
   - Redirection automatique après 3 secondes

3. **Page de Confirmation** (`/auth/confirm-email`)
   - Instructions détaillées
   - Bouton "Renvoyer l'email" si besoin
   - Vérification des spams

4. **Réception de l'Email**
   - Objet : "Confirmez votre email - Yo! Voiz"
   - Bouton "Confirmer mon email"
   - Lien manuel de secours

5. **Clic sur le Lien**
   - Redirection vers `/auth/confirm-email?token_hash=...&type=email`
   - Vérification automatique du token
   - Message de succès

6. **Connexion** (`/auth/connexion`)
   - L'utilisateur peut maintenant se connecter
   - Accès complet au dashboard

---

## 🧪 Tests à Effectuer

### Test 1 : Inscription Complète
```
1. Aller sur https://yovoiz.vercel.app/auth/inscription
2. Remplir tous les champs
3. Cliquer sur "Créer mon compte"
4. Vérifier la redirection vers /auth/confirm-email
5. ✅ RÉSULTAT : Page de confirmation affichée
```

### Test 2 : Réception Email
```
1. Vérifier la boîte de réception (email utilisé)
2. Chercher "Yo! Voiz" ou "Confirmez votre email"
3. Vérifier aussi les SPAMS
4. ✅ RÉSULTAT : Email reçu dans les 1-2 minutes
```

### Test 3 : Confirmation
```
1. Ouvrir l'email reçu
2. Cliquer sur "Confirmer mon email"
3. Vérifier la redirection
4. Message "Email confirmé ! 🎉"
5. ✅ RÉSULTAT : Confirmation réussie
```

### Test 4 : Connexion
```
1. Aller sur /auth/connexion
2. Entrer email + mot de passe
3. Cliquer "Se connecter"
4. ✅ RÉSULTAT : Connexion réussie → Dashboard
```

---

## ❌ Problèmes Fréquents

### Problème 1 : Aucun Email Reçu

**Causes possibles :**
- Email confirmations désactivé dans Supabase
- Email dans les spams
- Délai d'envoi (attendre 2-5 minutes)
- Rate limit Supabase (max 3-4 emails/heure en dev)

**Solutions :**
1. Vérifier Authentication → Providers → Email
2. Vérifier les spams
3. Utiliser "Renvoyer l'email" sur /auth/confirm-email
4. Attendre 10 minutes entre les tentatives

---

### Problème 2 : Lien Expiré

**Cause :** Token valide 1 heure seulement

**Solution :**
1. Cliquer sur "Renvoyer l'email de confirmation"
2. Utiliser le nouveau lien immédiatement

---

### Problème 3 : Erreur "Email not confirmed"

**Cause :** Tentative de connexion sans avoir confirmé

**Solution :**
1. Vérifier l'email de confirmation
2. Cliquer sur le lien dans l'email
3. Attendre le message de succès
4. Puis se connecter

---

## 🚀 Commandes de Déploiement

```powershell
# Commit et push des changements
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
git add .
git commit -m "Feat: Système complet de validation email"
git push origin main
```

Vercel déploiera automatiquement les changements.

---

## 📊 Vérification en Base de Données

Pour vérifier si un email est confirmé, exécuter dans **Supabase SQL Editor** :

```sql
-- Voir les utilisateurs et leur statut de confirmation
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmé'
    ELSE '⏳ En attente'
  END as statut
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
```

---

## 📞 Support

Si les emails ne sont toujours pas reçus après configuration :
1. Vérifier les logs Supabase : Dashboard → Logs → Auth
2. Tester avec un autre email (Gmail, Outlook, etc.)
3. Contacter le support Supabase si problème persistant
