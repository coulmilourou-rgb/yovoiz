# 🧪 TESTS - Page Identifiants et Sécurité

## ⚡ PRÉREQUIS OBLIGATOIRE

**AVANT TOUT TEST**, exécuter le script SQL :

1. Dashboard Supabase → SQL Editor
2. Copier-coller : `supabase/functions/delete-user.sql`
3. Run ▶️
4. Vérifier : "✅ Fonction delete_user() créée avec succès"

---

## 📋 PLAN DE TESTS

### Test 1: Changement de mot de passe ✅

**Objectif** : Vérifier que le changement de mot de passe fonctionne

**Procédure** :
1. Se connecter avec un compte de test
2. Menu utilisateur → **Identifiants et sécurité**
3. Section "Mot de passe" :
   ```
   Mot de passe actuel : [votre_mot_de_passe_actuel]
   Nouveau mot de passe : TestPassword123
   Confirmation : TestPassword123
   ```
4. Cliquer sur "Modifier le mot de passe"

**Résultats attendus** :
- ✅ Toast vert : "Mot de passe modifié avec succès !"
- ✅ Formulaire réinitialisé (champs vides)
- ✅ Déconnexion puis reconnexion avec le nouveau mot de passe fonctionne

**Tests de validation** :
| Cas | Action | Résultat attendu |
|-----|--------|------------------|
| Mot de passe actuel vide | Soumettre | Toast orange : "Veuillez entrer votre mot de passe actuel" |
| Mot de passe actuel incorrect | Entrer mauvais mdp | Toast rouge : "Mot de passe actuel incorrect" |
| Nouveau < 8 caractères | Entrer "Test123" | Toast orange : "Le mot de passe doit contenir au moins 8 caractères" |
| Confirmation différente | Nouveau ≠ Confirmation | Toast orange : "Les mots de passe ne correspondent pas" |
| Nouveau = Ancien | Même mot de passe | Toast orange : "Le nouveau mot de passe doit être différent de l'ancien" |
| Tout correct | Valider | Toast vert : "Mot de passe modifié avec succès !" |

---

### Test 2: Changement d'adresse email ✅

**Objectif** : Vérifier que le changement d'email fonctionne avec confirmation

**Procédure** :
1. Menu utilisateur → **Identifiants et sécurité**
2. Section "Adresse email" :
   - Noter l'email actuel affiché
   ```
   Nouvelle adresse : test-nouveau@example.com
   Mot de passe : [votre_mot_de_passe]
   ```
3. Cliquer sur "Modifier l'adresse email"

**Résultats attendus** :
- ✅ Toast vert : "Un email de confirmation a été envoyé à votre nouvelle adresse"
- ✅ Formulaire réinitialisé
- ✅ Email de confirmation reçu dans la nouvelle boîte mail
- ✅ Clic sur le lien de confirmation active la nouvelle adresse
- ✅ Reconnexion avec la nouvelle adresse fonctionne

**Tests de validation** :
| Cas | Action | Résultat attendu |
|-----|--------|------------------|
| Email vide | Soumettre | Toast orange : "Veuillez entrer une nouvelle adresse email" |
| Email invalide | Entrer "test" | Toast orange : "Adresse email invalide" |
| Email = Actuel | Même email | Toast orange : "La nouvelle adresse doit être différente de l'actuelle" |
| Mot de passe vide | Sans mot de passe | Toast orange : "Veuillez entrer votre mot de passe pour confirmer" |
| Mot de passe incorrect | Mauvais mdp | Toast rouge : "Mot de passe incorrect" |
| Tout correct | Valider | Toast vert + Email envoyé |

---

### Test 3: Suppression de compte 🗑️

**⚠️ ATTENTION** : Utiliser un **COMPTE DE TEST** uniquement !

**Objectif** : Vérifier la suppression complète du compte avec phrase de confirmation

**Préparation** :
1. Créer un compte de test : `test-delete@example.com`
2. Se connecter avec ce compte
3. Noter l'ID utilisateur (visible dans Supabase → Authentication → Users)

**Procédure** :
1. Menu utilisateur → **Identifiants et sécurité**
2. Descendre jusqu'à "Zone dangereuse"
3. Cliquer sur "Supprimer mon compte"
4. **Modal de confirmation s'ouvre** :
   - Lire tous les avertissements
   - Dans le champ, saisir EXACTEMENT : `Oui, supprimez-moi`
   - Observer que le bouton "Supprimer définitivement" s'active
5. Cliquer sur "Supprimer définitivement"

**Résultats attendus** :
- ✅ Toast vert : "Compte supprimé avec succès. Au revoir !"
- ✅ Attente de 2 secondes
- ✅ Déconnexion automatique
- ✅ Redirection vers la page d'accueil (`/`)
- ✅ Aucune session active (boutons "Se connecter" / "S'inscrire" visibles)
- ✅ Impossible de se reconnecter avec les mêmes identifiants
- ✅ Données supprimées de Supabase :
  - Profile supprimé (`profiles`)
  - Utilisateur Auth supprimé (`auth.users`)
  - Demandes supprimées (`requests`)
  - Offres supprimées (`service_offers`)
  - Messages supprimés (`messages`)
  - Négociations supprimées (`negotiations`)

**Tests de validation** :
| Cas | Action | Résultat attendu |
|-----|--------|------------------|
| Phrase vide | Soumettre | Bouton "Supprimer" désactivé (grisé) |
| Phrase incorrecte | "Oui supprimer" | Message : "⚠️ La phrase ne correspond pas" + Bouton désactivé |
| Phrase partielle | "Oui, supp" | Bouton désactivé |
| Phrase exacte | "Oui, supprimez-moi" | Bouton activé (rouge) |
| Clic Annuler | Dans le modal | Modal se ferme, aucune action |
| Validation | Phrase correcte + Clic | Suppression + Toast + Déconnexion + Redirection |

---

## 🔍 VÉRIFICATIONS POST-TEST

### Après Test 1 (Mot de passe)

**Vérification connexion** :
```bash
1. Se déconnecter
2. Aller sur /auth/connexion
3. Essayer l'ancien mot de passe → ❌ Doit échouer
4. Essayer le nouveau mot de passe → ✅ Doit fonctionner
```

### Après Test 2 (Email)

**Vérification boîte mail** :
```
1. Ouvrir la boîte de la nouvelle adresse
2. Chercher email de Supabase
3. Sujet : "Confirm your email address"
4. Cliquer sur le lien de confirmation
5. Message de succès Supabase
```

**Vérification Supabase Dashboard** :
```bash
1. Authentication → Users
2. Chercher l'utilisateur
3. Vérifier que l'email est mis à jour
4. Vérifier "Email confirmed" = true (après clic sur le lien)
```

### Après Test 3 (Suppression)

**Vérification Supabase Dashboard** :

1. **Authentication → Users** :
   ```
   Rechercher : test-delete@example.com
   Résultat : ❌ Not found (utilisateur supprimé)
   ```

2. **Table Editor → profiles** :
   ```sql
   SELECT * FROM profiles WHERE id = '[USER_ID]';
   -- Résultat : 0 rows (profil supprimé)
   ```

3. **Table Editor → requests** :
   ```sql
   SELECT * FROM requests WHERE requester_id = '[USER_ID]';
   -- Résultat : 0 rows (demandes supprimées)
   ```

4. **Table Editor → service_offers** :
   ```sql
   SELECT * FROM service_offers WHERE provider_id = '[USER_ID]';
   -- Résultat : 0 rows (offres supprimées)
   ```

5. **Tentative de connexion** :
   ```
   Email : test-delete@example.com
   Password : [mot de passe]
   Résultat : ❌ "Invalid login credentials"
   ```

---

## 📊 CHECKLIST DE VALIDATION

### Changement de mot de passe
- [ ] Toast affiché après succès
- [ ] Formulaire réinitialisé
- [ ] Ancien mot de passe ne fonctionne plus
- [ ] Nouveau mot de passe fonctionne
- [ ] Validations fonctionnelles (< 8 car, différent, etc.)

### Changement d'email
- [ ] Toast affiché après succès
- [ ] Formulaire réinitialisé
- [ ] Email de confirmation reçu
- [ ] Lien de confirmation fonctionne
- [ ] Nouvelle adresse visible dans Supabase
- [ ] Connexion avec nouvelle adresse fonctionne
- [ ] Validations fonctionnelles (format, différent, etc.)

### Suppression de compte
- [ ] Modal s'ouvre avec avertissements
- [ ] Phrase de confirmation obligatoire
- [ ] Bouton désactivé si phrase incorrecte
- [ ] Toast affiché après validation
- [ ] Déconnexion automatique après 2 secondes
- [ ] Redirection vers `/` (accueil)
- [ ] Utilisateur supprimé de `auth.users`
- [ ] Profil supprimé de `profiles`
- [ ] Demandes supprimées de `requests`
- [ ] Offres supprimées de `service_offers`
- [ ] Messages supprimés de `messages`
- [ ] Négociations supprimées de `negotiations`
- [ ] Impossible de se reconnecter
- [ ] Session complètement détruite

---

## 🐛 DÉPANNAGE

### Test 1 échoue : "Mot de passe actuel incorrect"

**Causes possibles** :
1. Caps Lock activé
2. Erreur de frappe
3. Mot de passe oublié

**Solution** :
- Réinitialiser le mot de passe via "Mot de passe oublié"
- Ou créer un nouveau compte de test

### Test 2 échoue : Email de confirmation non reçu

**Causes possibles** :
1. Délai d'envoi (jusqu'à 5-10 minutes)
2. Dossier spam
3. Configuration Supabase Auth

**Vérifications** :
1. Attendre 10 minutes
2. Vérifier spam/courrier indésirable
3. Dashboard Supabase → Authentication → Email Templates
4. Vérifier que SMTP est configuré

### Test 3 échoue : "Could not find function delete_user()"

**Cause** : Le script SQL n'a pas été exécuté

**Solution** :
```sql
-- Exécuter dans Supabase SQL Editor
-- Copier-coller supabase/functions/delete-user.sql
-- Run ▶️
```

### Test 3 échoue : "Erreur lors de la suppression"

**Vérifications** :
1. Console navigateur (F12) → Copier l'erreur complète
2. Supabase Dashboard → Logs → Chercher l'erreur
3. Vérifier que la fonction existe :
   ```sql
   SELECT routine_name FROM information_schema.routines
   WHERE routine_name = 'delete_user';
   ```
4. Vérifier les permissions :
   ```sql
   SELECT grantee, privilege_type
   FROM information_schema.routine_privileges
   WHERE routine_name = 'delete_user';
   -- Devrait afficher : authenticated | EXECUTE
   ```

### Suppression partielle (profil supprimé mais Auth reste)

**Cause** : Droits insuffisants pour supprimer de `auth.users`

**Solution** : La fonction `delete_user()` utilise `SECURITY DEFINER` qui donne les droits nécessaires. Vérifier que le script SQL a bien été exécuté avec un compte admin Supabase.

---

## 📈 RAPPORT DE TEST

À remplir après les tests :

```
Date : ______________
Testeur : ______________

Test 1 - Changement de mot de passe :
[ ] Réussi  [ ] Échoué  [ ] Partiellement réussi
Notes : _______________________________________

Test 2 - Changement d'email :
[ ] Réussi  [ ] Échoué  [ ] Partiellement réussi
Notes : _______________________________________

Test 3 - Suppression de compte :
[ ] Réussi  [ ] Échoué  [ ] Partiellement réussi
Notes : _______________________________________

Bugs rencontrés :
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

Améliorations suggérées :
1. _____________________________________________
2. _____________________________________________
```

---

## ✅ RÉSUMÉ

Si tous les tests passent :
- ✅ La page est **100% fonctionnelle**
- ✅ Toutes les validations sont actives
- ✅ Les changements sont persistés en base
- ✅ La suppression est complète et sécurisée
- ✅ L'UX est fluide avec les notifications toast

**Prêt pour la production** 🚀
