# 🔧 Guide de Configuration .env.local

## 📋 Credentials à Récupérer

### 1️⃣ Twilio (WhatsApp OTP)

**Où ?** https://console.twilio.com/

**Que copier ?**

| Variable | Où la trouver ? | Exemple |
|----------|-----------------|---------|
| `TWILIO_ACCOUNT_SID` | Console → Account Info | `AC1234567890abcdef...` |
| `TWILIO_AUTH_TOKEN` | Console → Account Info → "Show" | `abcd1234efgh5678...` |
| `TWILIO_WHATSAPP_NUMBER` | Messaging → Try WhatsApp → "From" | `+14155238886` |

**⚠️ Important** : Rejoignez d'abord le sandbox WhatsApp !
- Sur votre WhatsApp, envoyez `join <votre-code>` au numéro Twilio

---

### 2️⃣ Supabase (Base de Données)

**Où ?** https://supabase.com/dashboard

**Étapes détaillées** :

1. **Connectez-vous** : https://supabase.com/dashboard
2. **Sélectionnez** votre projet Yo! Voiz
3. **Cliquez** sur ⚙️ **Settings** (menu gauche, en bas)
4. **Cliquez** sur **API** (sous-menu)
5. **Copiez** :

| Variable | Section | Quelle clé ? | Exemple |
|----------|---------|--------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** | Copiez l'URL complète | `https://abcdefgh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Project API keys** → `anon` `public` | Copiez la clé ANON (pas service_role !) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (très longue) |

**⚠️ Attention** :
- ✅ Utilisez la clé **`anon`** (publique)
- ❌ N'utilisez PAS la clé **`service_role`** (secrète, backend seulement)

---

## 📝 Créer le Fichier .env.local

### Option 1 : Avec l'Explorateur Windows

1. **Ouvrez** l'explorateur : `C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin`
2. **Clic droit** → **Nouveau** → **Document texte**
3. **Renommez** le fichier en `.env.local` (avec le point au début !)
   - Windows demandera confirmation : **OUI, je veux changer l'extension**
4. **Double-cliquez** pour ouvrir avec Notepad
5. **Collez** le contenu ci-dessous en remplaçant les valeurs

---

### Option 2 : Avec PowerShell

Ouvrez PowerShell dans le dossier du projet et exécutez :

```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
notepad .env.local
```

Si le fichier n'existe pas, Notepad demandera de le créer : cliquez **Oui**.

---

## 📄 Contenu du Fichier .env.local

Copiez-collez ce modèle et **remplacez** les valeurs par les vôtres :

```env
# ========================================
# Twilio WhatsApp OTP
# ========================================
# Récupéré depuis : https://console.twilio.com/

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=votre_auth_token_secret_ici
TWILIO_WHATSAPP_NUMBER=+14155238886

# ========================================
# Supabase (Base de Données)
# ========================================
# Récupéré depuis : https://supabase.com/dashboard → Settings → API

NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhYXXXXXXXXXX...

# ========================================
# Environment
# ========================================
NODE_ENV=development
```

---

## ✅ Exemple Rempli (Fictif)

Voici à quoi ressemble un fichier correctement rempli :

```env
# Twilio WhatsApp OTP
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=9876543210fedcba9876543210fedcba
TWILIO_WHATSAPP_NUMBER=+14155238886

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzEyMzQ1NjcsImV4cCI6MTk4NjgxMDU2N30.abcdefgh1234567890

# Environment
NODE_ENV=development
```

---

## 🔒 Sécurité

### ⚠️ À NE JAMAIS FAIRE :

- ❌ Commiter `.env.local` sur Git
- ❌ Partager vos credentials publiquement
- ❌ Utiliser `service_role` key dans le frontend

### ✅ Vérifications :

1. **Le fichier `.env.local` est-il dans .gitignore ?**

Ouvrez PowerShell et exécutez :

```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
Select-String -Path .gitignore -Pattern ".env.local"
```

Si aucun résultat, ajoutez-le :

```powershell
Add-Content .gitignore "`n.env.local"
```

2. **Vérifier que le fichier existe :**

```powershell
Test-Path .env.local
# Doit retourner : True
```

3. **Afficher le contenu (pour vérifier les variables) :**

```powershell
Get-Content .env.local
```

---

## 🚀 Redémarrer le Serveur

Après avoir modifié `.env.local`, redémarrez obligatoirement :

```powershell
# Arrêter le serveur actuel : Ctrl + C

# Puis relancer :
npm run dev
```

---

## 🎯 Checklist Finale

Avant de tester l'inscription :

- [ ] ✅ Fichier `.env.local` existe à la racine du projet
- [ ] ✅ `TWILIO_ACCOUNT_SID` rempli (commence par `AC`)
- [ ] ✅ `TWILIO_AUTH_TOKEN` rempli (32 caractères)
- [ ] ✅ `TWILIO_WHATSAPP_NUMBER` rempli (ex: `+14155238886`)
- [ ] ✅ Vous avez rejoint le sandbox WhatsApp depuis votre téléphone
- [ ] ✅ `NEXT_PUBLIC_SUPABASE_URL` rempli (ex: `https://xxx.supabase.co`)
- [ ] ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` rempli (longue clé JWT)
- [ ] ✅ Serveur redémarré (`npm run dev`)

---

## 🐛 Problèmes Courants

### "Cannot find module .env.local"

**Cause** : Le fichier n'est pas à la racine du projet

**Solution** :
```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
# Le fichier doit être ICI, pas dans un sous-dossier
```

---

### "Supabase client initialization failed"

**Cause** : URL ou Anon Key incorrecte

**Solution** :
1. Vérifiez que l'URL commence par `https://` et finit par `.supabase.co`
2. Vérifiez que la clé commence par `eyJhbGc...`
3. Pas d'espaces avant/après les valeurs
4. Pas de guillemets `"` autour des valeurs

---

### "Invalid credentials"

**Cause** : Twilio credentials incorrects

**Solution** :
1. Retournez sur https://console.twilio.com/
2. Vérifiez que vous avez copié les bonnes valeurs
3. Le Auth Token ne doit PAS contenir "Test Credentials"

---

## 📞 Besoin d'Aide ?

Si vous êtes bloqué, partagez une capture d'écran (en masquant les valeurs sensibles) de :
- La page Twilio Console → Account Info
- La page Supabase → Settings → API

**Prêt à tester ? Suivez ce guide étape par étape !** 🚀
