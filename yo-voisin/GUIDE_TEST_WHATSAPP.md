# 🧪 Guide de Test WhatsApp OTP

## 📊 Statut Actuel

✅ **Serveur**: Démarré sur http://localhost:3000  
✅ **Mode**: PRODUCTION (envoi WhatsApp réel)  
✅ **Credentials**: Configurés dans .env.local  

---

## 🎯 Ce Qui Va Se Passer

### Mode PRODUCTION (ACTUEL) :

1. Vous vous inscrivez avec votre numéro
2. ❌ **AUCUN popup** ne s'affiche
3. ✅ **Le code est envoyé sur WhatsApp**
4. Vous recevez le message WhatsApp avec le code
5. Vous saisissez le code dans l'interface

### Logs à Surveiller (dans le terminal du serveur) :

```
🔧 NODE_ENV: production
📱 Envoi OTP vers: +225...
🔍 Mode DEV? false - Code retourné? NON
✅ WhatsApp OTP envoyé avec succès
```

---

## ⚠️ ÉTAPE OBLIGATOIRE AVANT DE TESTER

### Rejoindre le Sandbox WhatsApp

1. **Allez sur**: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

2. **Notez votre code** (exemple: `join happy-tiger`)

3. **Sur WhatsApp**:
   - Ajoutez le contact: `+1 830 494 0577`
   - Envoyez: `join <votre-code>`
   - Attendez: "✅ You are all set!"

4. **IMPORTANT**: Utilisez le MÊME numéro pour rejoindre ET pour l'inscription

---

## 🧪 Test de l'Inscription

### Étape 1: Ouvrir l'Application

👉 http://localhost:3000/auth/inscription

### Étape 2: Remplir le Formulaire

- **Nom**: Votre nom
- **Prénom**: Votre prénom
- **Email**: Un email valide
- **Téléphone**: 
  - ⚠️ **Le MÊME numéro** qui a rejoint le sandbox
  - Format CI: `+225 XX XX XX XX XX`
  - Ou le numéro que vous avez utilisé pour rejoindre (peut être +33, +1, etc.)
- **Mot de passe**: Au moins 8 caractères

### Étape 3: Cliquer "Suivant"

### Étape 4: Vérifier les Logs

**Dans le terminal où le serveur tourne**, vous devriez voir:

```
🔧 NODE_ENV: production
📱 Envoi OTP vers: +225XXXXXXXXXX
🔍 Mode DEV? false - Code retourné? NON
✅ WhatsApp OTP envoyé avec succès
```

Si vous voyez `Mode DEV? true`, alors le serveur est encore en mode développement.

### Étape 5: Recevoir le Code sur WhatsApp

**Sur votre téléphone**, vous recevrez un message WhatsApp de `+1 830 494 0577`:

```
🔐 Yo! Voiz

Votre code de vérification est : *123456*

Valide pendant 10 minutes.

Ne partagez ce code avec personne.
```

### Étape 6: Saisir le Code

Dans l'interface web:
1. Tapez les 6 chiffres du code
2. Le code sera automatiquement vérifié
3. Vous passerez à l'étape suivante

---

## 🐛 Problèmes Courants

### 1. Le popup s'affiche toujours

**Cause**: Le serveur est encore en mode development

**Solution**:
```powershell
# Vérifier le NODE_ENV
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
Select-String -Path .env.local -Pattern "NODE_ENV"

# Doit afficher: NODE_ENV=production
# Si NODE_ENV=development, modifiez-le manuellement dans .env.local
```

Puis **redémarrez obligatoirement** le serveur:
- Ctrl+C dans le terminal
- `npm run dev`

---

### 2. Erreur "To number is not a valid WhatsApp number"

**Cause**: Votre numéro n'a pas rejoint le sandbox

**Solution**:
1. Sur WhatsApp, envoyez `join <code>` au `+1 830 494 0577`
2. Attendez "You are all set!"
3. Réessayez l'inscription

**Vérifier dans Twilio Console**:
- https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
- Section "Sandbox Participants": votre numéro doit être listé

---

### 3. Erreur "Unable to create record"

**Cause**: Le numéro sandbox dans .env.local est incorrect

**Vérification**:
```powershell
Select-String -Path .env.local -Pattern "TWILIO_WHATSAPP_NUMBER"
# Doit afficher: TWILIO_WHATSAPP_NUMBER=+18304940577
```

Si différent, corrigez dans `.env.local` et redémarrez.

---

### 4. Je ne reçois rien sur WhatsApp

**Checklist**:
- [ ] Sandbox rejoint ? (message "You are all set!" reçu ?)
- [ ] Même numéro utilisé pour rejoindre et pour l'inscription ?
- [ ] NODE_ENV=production dans .env.local ?
- [ ] Serveur redémarré après modification ?
- [ ] Logs montrent "Mode DEV? false" ?

**Debug dans Twilio**:
1. Allez sur: https://console.twilio.com/us1/monitor/logs/messaging
2. Cherchez votre message
3. Cliquez dessus pour voir l'erreur détaillée

---

### 5. Les logs montrent "Mode DEV? true"

**Problème**: La variable d'environnement n'est pas correctement lue

**Solution 1 - Modification Manuelle**:

Ouvrez `.env.local` avec Notepad:
```powershell
notepad .env.local
```

Trouvez la ligne:
```
NODE_ENV=development
```

Changez en:
```
NODE_ENV=production
```

Sauvegardez (Ctrl+S) et fermez.

**Solution 2 - Via PowerShell**:
```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
(Get-Content .env.local) -replace 'NODE_ENV=development', 'NODE_ENV=production' | Set-Content .env.local -Force
```

**Puis redémarrez OBLIGATOIREMENT**:
- Ctrl+C dans le terminal du serveur
- `npm run dev`

---

## 🔄 Basculer en Mode Développement (pour debug)

Si vous voulez revenir au mode avec popup:

### Option 1: Manuel
```powershell
# Ouvrir .env.local
notepad .env.local

# Changer:
NODE_ENV=production
# En:
NODE_ENV=development

# Sauvegarder et redémarrer le serveur
```

### Option 2: PowerShell
```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
(Get-Content .env.local) -replace 'NODE_ENV=production', 'NODE_ENV=development' | Set-Content .env.local -Force

# Redémarrer le serveur
```

---

## ✅ Checklist Complète Avant Test

- [ ] Fichier `.env.local` existe et contient les credentials Twilio
- [ ] `NODE_ENV=production` dans `.env.local`
- [ ] Serveur redémarré après modification
- [ ] Sandbox WhatsApp rejoint depuis votre téléphone
- [ ] Confirmation "You are all set!" reçue
- [ ] Vous utilisez le MÊME numéro pour rejoindre et pour l'inscription
- [ ] Logs du serveur montrent "Mode DEV? false"

---

## 📞 Vérification Finale

Avant de tester, exécutez dans PowerShell:

```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"

# Vérifier le NODE_ENV
Write-Host "NODE_ENV actuel:" -ForegroundColor Yellow
Select-String -Path .env.local -Pattern "NODE_ENV"

# Vérifier le numéro WhatsApp
Write-Host "`nNuméro WhatsApp Sandbox:" -ForegroundColor Yellow
Select-String -Path .env.local -Pattern "TWILIO_WHATSAPP_NUMBER"

# Vérifier que le serveur tourne
Write-Host "`nServeur Node.js:" -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Select-Object Id, ProcessName
```

Résultat attendu:
```
NODE_ENV actuel:
NODE_ENV=production

Numéro WhatsApp Sandbox:
TWILIO_WHATSAPP_NUMBER=+18304940577

Serveur Node.js:
  Id ProcessName
  -- -----------
XXXX node
```

---

**🚀 Prêt à tester ? Rejoignez d'abord le sandbox, puis testez l'inscription !**
