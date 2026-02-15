# ✅ GUIDE DE TEST COMPLET - YO!VOIZ
## Tests à effectuer après l'audit

---

## 🎯 OBJECTIF
Tester toutes les fonctionnalités du site de manière systématique

**Durée estimée** : 30-45 minutes

---

## 📋 PRÉPARATION

### 1. Lancer le serveur
```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
npm run dev
```
✅ Serveur sur http://localhost:3000 ou 3001

### 2. Créer données de test
1. Ouvrir https://supabase.com/dashboard/project/hfrmctsvpszqdizritoe/editor
2. Copier le contenu de `yo-voisin/supabase/TEST-DATA-PRO.sql`
3. Coller et RUN
4. Vérifier message : ✅ Données de test créées avec succès !

### 3. Identifiants de test
- **Email** : tamoil@test.com
- **Mot de passe** : (votre mot de passe actuel)

---

## 🧪 TESTS PAR MODULE

### MODULE 1 : AUTHENTIFICATION

#### Test 1.1 : Connexion
- [ ] Aller sur http://localhost:3000/auth/connexion
- [ ] Saisir email : tamoil@test.com
- [ ] Saisir mot de passe
- [ ] Cliquer "Se connecter"
- [ ] ✅ Redirection vers /home
- [ ] ✅ Menu utilisateur visible (nom + avatar)
- [ ] ✅ Boutons "Se connecter" et "S'inscrire" cachés

#### Test 1.2 : Navigation connecté
- [ ] Navbar affiche : Accueil, Missions, Offreurs, Demande, Abonnement Pro, Messages
- [ ] Logo redirige vers /
- [ ] Notifications 🔔 fonctionnelle
- [ ] Menu utilisateur s'ouvre au clic
- [ ] Menu utilisateur se ferme si clic ailleurs

#### Test 1.3 : Déconnexion
- [ ] Cliquer menu utilisateur
- [ ] Cliquer "Se déconnecter"
- [ ] ✅ Redirection vers /
- [ ] ✅ Boutons "Se connecter" et "S'inscrire" visibles

---

### MODULE 2 : PAGE HOME

#### Test 2.1 : Affichage
- [ ] Se connecter
- [ ] Aller sur /home
- [ ] ✅ Barre de recherche "Bonjour [Prénom], Que recherchez-vous aujourd'hui ?"
- [ ] ✅ Section "Services près de chez vous" avec zone : Yopougon • Ananeraie
- [ ] ✅ Cartes de demandes affichées (scroll infini)

#### Test 2.2 : Recherche
- [ ] Saisir "plomberie" dans barre recherche
- [ ] ✅ Résultats filtrés
- [ ] Cliquer sur une carte demande
- [ ] ✅ Détail demande affiché

---

### MODULE 3 : DEMANDES (MISSIONS)

#### Test 3.1 : Liste demandes
- [ ] Cliquer "Missions" dans navbar
- [ ] ✅ Liste de toutes les demandes
- [ ] ✅ Filtres fonctionnels

#### Test 3.2 : Créer une demande
- [ ] Cliquer bouton "Demande" (navbar) ou "+ Nouvelle demande"
- [ ] **Étape 1** : Choisir catégorie (ex: Plomberie)
- [ ] **Étape 2** : Titre "Réparation fuite" + Description
- [ ] **Étape 3** : Adresse "Yopougon, Ananeraie"
- [ ] **Étape 4** : Date + Urgence
- [ ] **Étape 5** : Budget 30000 FCFA
- [ ] **Étape 6** : Vérifier récapitulatif
- [ ] Cliquer "Publier ma demande"
- [ ] ✅ Page confirmation "Demande en attente d'approbation"
- [ ] ✅ Bouton "Mes demandes" visible et fonctionne
- [ ] ✅ Bouton "Retour à l'accueil" visible (pas blanc sur blanc)

#### Test 3.3 : Mes demandes
- [ ] Menu utilisateur → Mes demandes
- [ ] ✅ Liste des demandes créées
- [ ] ✅ Onglets : Toutes, Publiées, Terminées, Annulées (interconnectés)
- [ ] ✅ Bouton "+ Nouvelle demande" visible (pas blanc)
- [ ] Cliquer "Voir détails" sur une demande
- [ ] ✅ Détail affiché (pas "Demande introuvable")

#### Test 3.4 : Modifier demande
- [ ] Dans "Mes demandes", cliquer "Modifier"
- [ ] Changer titre
- [ ] Cliquer "Enregistrer"
- [ ] ✅ Popup professionnel "Demande modifiée avec succès"
- [ ] ✅ Modification visible dans la liste

#### Test 3.5 : Supprimer demande
- [ ] Cliquer "Supprimer" sur une demande
- [ ] Confirmer
- [ ] ✅ Demande supprimée

---

### MODULE 4 : OFFRES DE SERVICES

#### Test 4.1 : Créer offre
- [ ] Menu utilisateur → Mes services
- [ ] Cliquer "+ Nouvelle offre"
- [ ] Remplir formulaire (catégorie, titre, description, prix, zones)
- [ ] ✅ Toutes les communes d'Abidjan listées
- [ ] Publier
- [ ] ✅ Offre créée

#### Test 4.2 : Modifier offre
- [ ] Dans "Mes services", cliquer "Modifier"
- [ ] Changer description
- [ ] Sauvegarder
- [ ] ✅ Modification appliquée

#### Test 4.3 : Page Offreurs
- [ ] Navbar → Offreurs
- [ ] ✅ Liste prestataires dans la zone
- [ ] Cliquer sur nom prestataire
- [ ] ✅ Redirection vers page profil public

---

### MODULE 5 : PROFIL UTILISATEUR

#### Test 5.1 : Informations personnelles
- [ ] Menu utilisateur → Informations personnelles
- [ ] ✅ Formulaire pré-rempli
- [ ] ✅ Upload photo de profil fonctionne (pas "Bucket not found")
- [ ] Modifier nom, prénom, téléphone
- [ ] ✅ Date de naissance présente
- [ ] Cliquer "Enregistrer"
- [ ] ✅ Modifications sauvegardées (pas "Erreur lors de la mise à jour")

#### Test 5.2 : Identifiants & sécurité
- [ ] Menu utilisateur → Identifiants et mot de passe
- [ ] **Changer email** :
  - [ ] Saisir nouveau email
  - [ ] Confirmer
  - [ ] ✅ Email changé
- [ ] **Changer mot de passe** :
  - [ ] Ancien mot de passe
  - [ ] Nouveau mot de passe
  - [ ] Confirmer
  - [ ] ✅ Mot de passe changé
- [ ] **Supprimer compte** :
  - [ ] Cliquer "Supprimer mon compte"
  - [ ] Saisir "Oui, supprimez-moi"
  - [ ] ✅ Compte supprimé + redirection /
  - [ ] ⚠️ NE PAS TESTER avec compte principal !

#### Test 5.3 : Mes paiements
- [ ] Menu utilisateur → Mes paiements reçus
- [ ] ✅ Page affichée (pas d'erreur)
- [ ] ✅ Historique paiements visible

#### Test 5.4 : Gérer périmètre
- [ ] Menu utilisateur ou Abonnement → Gérer mon périmètre
- [ ] Sélectionner commune, quartiers
- [ ] Sélectionner catégories de services
- [ ] Rayon : 100 km max
- [ ] Cliquer "Enregistrer mes préférences"
- [ ] ✅ Préférences sauvegardées (pas "Erreur lors de la sauvegarde")

#### Test 5.5 : Ma page publique
- [ ] Abonnement Pro → Voir ma page
- [ ] ✅ Photo de couverture (dégradé orange-vert ou image uploadée)
- [ ] ✅ Profil complet affiché
- [ ] ✅ Bouton "Contacter" visible

#### Test 5.6 : Modifier ma page
- [ ] Abonnement Pro → Modifier ma page
- [ ] ✅ Upload photo de couverture fonctionne
- [ ] Modifier bio, compétences
- [ ] Sauvegarder
- [ ] ✅ Modifications appliquées

---

### MODULE 6 : ABONNEMENT PRO

#### Test 6.1 : Navigation
- [ ] Navbar → Abonnement Pro
- [ ] ✅ Menu gauche fixe
- [ ] ✅ Contenu à droite change selon sélection
- [ ] ✅ Pas de double navbar dans contenu
- [ ] ✅ Scroll menu indépendant du contenu

#### Test 6.2 : Voir grille tarifaire
- [ ] Cliquer "Voir la grille tarifaire"
- [ ] ✅ S'affiche à droite (pas nouvelle page)
- [ ] ✅ Bouton "Voir l'offre actuelle" fonctionne
- [ ] ✅ Plans Standard/Pro/Premium affichés

#### Test 6.3 : Voir les demandes
- [ ] Cliquer "Voir les demandes"
- [ ] ✅ Demandes dans ma zone affichées
- [ ] ✅ S'affiche à droite

---

### MODULE 7 : DEVIS

#### Test 7.1 : Créer client
- [ ] Abonnement Pro → Répertoire clients
- [ ] Cliquer "Nouveau client"
- [ ] Remplir : Nom, Email, Téléphone, Adresse
- [ ] Sauvegarder
- [ ] ✅ Client créé

#### Test 7.2 : Créer devis
- [ ] Abonnement Pro → Devis
- [ ] Cliquer "Nouveau devis"
- [ ] Sélectionner client (email pré-rempli et **grisé**)
- [ ] Ajouter prestations :
  - [ ] Nom, quantité, prix (0 effaçable)
  - [ ] Total calculé automatiquement
- [ ] Sauvegarder
- [ ] ✅ Devis créé avec référence DEV-YYYYMMDD-XXXX
- [ ] ✅ Montant en FCFA (pas €)

#### Test 7.3 : Modifier devis
- [ ] Cliquer "Modifier" sur un devis
- [ ] Changer montant
- [ ] Sauvegarder
- [ ] ✅ Popup professionnel
- [ ] ✅ Modification appliquée

#### Test 7.4 : Envoyer devis
- [ ] Cliquer "Envoyer" sur un devis
- [ ] ✅ Email client pré-rempli (non modifiable)
- [ ] Personnaliser message
- [ ] Envoyer
- [ ] ✅ "Devis envoyé dans la messagerie et par email"
- [ ] ✅ Vérifier dans /messages : message visible
- [ ] ⏳ Email reçu si Resend configuré

#### Test 7.5 : Générer PDF
- [ ] Cliquer "PDF" sur un devis
- [ ] ✅ PDF téléchargé
- [ ] Ouvrir PDF
- [ ] ✅ Infos prestataire visibles
- [ ] ✅ Tableau prestations
- [ ] ✅ Montant en FCFA

---

### MODULE 8 : FACTURES

#### Test 8.1 : Créer facture
- [ ] Abonnement Pro → Factures
- [ ] "Nouvelle facture"
- [ ] Sélectionner client
- [ ] Ajouter prestations (0 effaçable)
- [ ] Sauvegarder
- [ ] ✅ Facture créée FACT-YYYYMMDD-XXXX
- [ ] ✅ Montant en FCFA

#### Test 8.2 : Marquer payée
- [ ] Cliquer "Marquer payée"
- [ ] Confirmer
- [ ] ✅ Popup professionnel
- [ ] ✅ Statut "Payée" visible (pas toujours "En attente")

#### Test 8.3 : Relancer client
- [ ] Cliquer "Relancer" sur facture impayée
- [ ] ✅ Popup taille correcte (bouton visible)
- [ ] Personnaliser message
- [ ] Envoyer
- [ ] ✅ Relance envoyée dans messagerie
- [ ] ⏳ Email si Resend configuré

---

### MODULE 9 : RÉPERTOIRE CLIENTS

#### Test 9.1 : Voir historique
- [ ] Abonnement Pro → Répertoire clients
- [ ] Cliquer "Voir l'historique" sur un client
- [ ] ✅ Popup professionnel
- [ ] ✅ Liste devis/factures du client

#### Test 9.2 : Nouveau devis depuis client
- [ ] Cliquer "Nouveau devis" sur un client
- [ ] ✅ Formulaire devis pré-rempli avec infos client
- [ ] ✅ Fonctionnel

#### Test 9.3 : Modifier client
- [ ] Cliquer "Modifier" (icône crayon)
- [ ] Changer téléphone
- [ ] Sauvegarder
- [ ] ✅ Modification prise en compte

#### Test 9.4 : Supprimer client
- [ ] Cliquer bouton "Supprimer"
- [ ] Confirmer
- [ ] ✅ Client supprimé

---

### MODULE 10 : CATALOGUE

#### Test 10.1 : Créer service
- [ ] Abonnement Pro → Catalogue d'articles
- [ ] "Nouveau service"
- [ ] Nom, description, prix, unité, catégorie
- [ ] Sauvegarder
- [ ] ✅ Service créé

#### Test 10.2 : Modifier service
- [ ] Cliquer "Modifier"
- [ ] Changer prix
- [ ] Sauvegarder
- [ ] ✅ Action réalisée (pas juste popup)

#### Test 10.3 : Dupliquer service
- [ ] Cliquer "Dupliquer"
- [ ] ✅ Copie créée avec "(copie)" dans le nom

#### Test 10.4 : Supprimer service
- [ ] Cliquer "Supprimer"
- [ ] ✅ Bouton ne déborde pas du cadre
- [ ] Confirmer
- [ ] ✅ Service supprimé

---

### MODULE 11 : ENCAISSEMENTS

#### Test 11.1 : Voir historique
- [ ] Abonnement Pro → Encaissements
- [ ] ✅ Graphique visible
- [ ] ✅ Répartition par méthode (barres dans les limites)
- [ ] ✅ Liste encaissements

#### Test 11.2 : Exporter
- [ ] Cliquer "Exporter"
- [ ] Choisir PDF
- [ ] ✅ PDF téléchargé
- [ ] Choisir Excel
- [ ] ✅ XLSX téléchargé

---

### MODULE 12 : TABLEAU DE BORD PRO

#### Test 12.1 : Vue d'ensemble
- [ ] Abonnement Pro → Tableau de bord
- [ ] ✅ Pas de double navbar
- [ ] ✅ Statistiques affichées (CA, devis, factures)
- [ ] ✅ Graphiques visibles
- [ ] ✅ Activité récente

#### Test 12.2 : Bouton "Tout voir"
- [ ] Cliquer "Tout voir" dans activité récente
- [ ] ✅ Page détaillée activités affichée

---

### MODULE 13 : PARAMÈTRES PRO

#### Test 13.1 : Informations entreprise
- [ ] Abonnement Pro → Paramètres
- [ ] ✅ Pas d'erreur "Mail is not defined"
- [ ] Remplir nom société, email pro, téléphone
- [ ] ✅ Pas de champs SIRET/TVA (adapté Côte d'Ivoire)
- [ ] Sauvegarder
- [ ] ✅ Sauvegardé

#### Test 13.2 : Inviter membre
- [ ] Section "Équipe"
- [ ] Cliquer "Inviter un membre"
- [ ] ✅ Popup "Fonctionnalité à venir"
- [ ] ✅ Bouton "J'ai compris" ferme modal

---

### MODULE 14 : MESSAGERIE

#### Test 14.1 : Liste conversations
- [ ] Navbar → Messages
- [ ] ✅ Liste conversations affichée
- [ ] ✅ Notifications visibles

#### Test 14.2 : Envoyer message
- [ ] Ouvrir conversation
- [ ] Saisir message
- [ ] Envoyer
- [ ] ✅ Message envoyé

#### Test 14.3 : Recevoir devis/facture
- [ ] Vérifier messages après envoi devis
- [ ] ✅ Message avec détails devis visible
- [ ] ✅ Bouton "Voir le devis"

---

### MODULE 15 : NOTIFICATIONS

#### Test 15.1 : Cloche notifications
- [ ] Cliquer 🔔 dans navbar
- [ ] ✅ Dropdown s'ouvre
- [ ] ✅ Notifications affichées
- [ ] ✅ Lues vs non lues différenciées
- [ ] ✅ "Marquer tout lu" fonctionne

---

### MODULE 16 : AIDE

#### Test 16.1 : Page aide
- [ ] Menu utilisateur → Aide
- [ ] ✅ Page professionnelle affichée
- [ ] ✅ FAQ visible
- [ ] ✅ Formulaire contact fonctionne

---

### MODULE 17 : RESPONSIVE

#### Test 17.1 : Mobile (F12 → Device Toolbar)
- [ ] Vue mobile (375px)
- [ ] ✅ Navbar burger menu fonctionne
- [ ] ✅ Cartes empilées
- [ ] ✅ Formulaires scrollables
- [ ] ✅ Boutons tactiles (min 44px)

#### Test 17.2 : Tablet (768px)
- [ ] Grilles 2 colonnes
- [ ] ✅ Menu latéral visible

---

## 📊 RÉSUMÉ DES TESTS

### Checklist globale
- [ ] 0 erreur console critique
- [ ] 0 page 404
- [ ] 0 bouton inactif
- [ ] Toutes redirections OK
- [ ] Tous formulaires OK
- [ ] Toutes modals OK
- [ ] Tous popups pro
- [ ] Tous montants en FCFA
- [ ] Upload images OK
- [ ] PDFs générés OK
- [ ] Emails envoyés (si Resend configuré)

### Bugs critiques identifiés
| Bug | Page | Priorité | Statut |
|-----|------|----------|--------|
| - | - | - | ✅/❌ |

### Bugs mineurs identifiés
| Bug | Page | Priorité | Statut |
|-----|------|----------|--------|
| - | - | - | ✅/❌ |

---

## 🎯 APRÈS LES TESTS

### Si tout fonctionne ✅
1. Commiter les changements :
```powershell
git add .
git commit -m "✅ Audit complet + corrections + optimisations"
git push
```

2. Déployer sur Vercel :
```powershell
npx vercel --prod
```

### Si bugs trouvés ❌
1. Noter tous les bugs dans la section ci-dessus
2. Me les communiquer
3. Je corrige en priorité

---

## 📞 SUPPORT

En cas de problème pendant les tests :
1. **Console navigateur** (F12) → Copier erreur
2. **Terminal** → Copier log serveur
3. **Screenshot** de l'erreur
4. Me transmettre les 3 éléments

---

**Bonne chance pour les tests ! 🚀**

*Durée estimée : 30-45 minutes*
*Prenez une pause café pendant les tests 😉☕*
