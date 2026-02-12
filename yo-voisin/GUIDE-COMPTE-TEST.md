# 🧪 CRÉER UN COMPTE TEST POUR YO! VOIZ

## Méthode la plus simple : Via l'interface d'inscription

### 📝 Étapes :

1. **Ouvre ton navigateur** et va sur :
   ```
   http://localhost:3001/auth/inscription
   ```

2. **Remplis le formulaire** avec ces informations :

   **Étape 1 - Type de compte** :
   - ✅ Je cherche un service (Client)

   **Étape 2 - Informations personnelles** :
   - Nom complet : `Test Utilisateur`
   - Téléphone : `0700000000`
   - Email : `test@yovoiz.com`
   - Mot de passe : `Test1234!`

   **Étape 2.5 - Vérification téléphone** :
   - Un code OTP sera affiché dans un popup (mode DEV)
   - Copie et colle le code

   **Étape 3 - Localisation** :
   - Commune : `Cocody`
   - Quartier : `Riviera Palmeraie`

   **Étape 4 - Vérification identité** :
   - Clique sur "Terminer plus tard"

3. **C'est fait !** 🎉
   - Tu seras redirigé vers le dashboard client
   - Tu pourras te reconnecter avec :
     - Email : `test@yovoiz.com`
     - Mot de passe : `Test1234!`

---

## Alternative : Utilise la page de connexion si déjà inscrit

Si tu as déjà un compte :
```
http://localhost:3001/auth/connexion
```

---

## 🔧 Résolution de problèmes

### Problème : "Erreur lors de la vérification"
- ✅ Vérifie que Supabase est bien configuré dans `.env.local`
- ✅ Vérifie que la table `profiles` existe dans Supabase

### Problème : "Format de téléphone invalide"
- ✅ Utilise le format : `0700000000` (10 chiffres)
- ✅ Ou avec indicatif : `+2250700000000`

### Problème : "Email déjà utilisé"
- ✅ Utilise un autre email : `test2@yovoiz.com`
- ✅ Ou supprime l'utilisateur existant via le Dashboard Supabase

---

## 📋 Identifiants de test recommandés

**Client Test** :
- 📧 Email : `test@yovoiz.com`
- 🔒 Mot de passe : `Test1234!`
- 📍 Commune : Cocody, Riviera Palmeraie

**Prestataire Test** (à créer plus tard) :
- 📧 Email : `prestataire@yovoiz.com`
- 🔒 Mot de passe : `Test1234!`
- 🔧 Catégorie : Plomberie

---

🚀 **Le serveur tourne sur http://localhost:3001**
