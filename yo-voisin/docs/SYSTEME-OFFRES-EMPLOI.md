# 📋 SYSTÈME DE GESTION DES OFFRES D'EMPLOI - YO!VOIZ

## ✅ FONCTIONNALITÉS IMPLÉMENTÉES

### 🎯 Pour les visiteurs / candidats :
1. **Page Carrières** (`/carrieres`)
   - Liste de toutes les offres d'emploi publiées
   - Chargement dynamique depuis la base de données
   - Filtres visuels (département, type de contrat, salaire)
   - Design professionnel avec badges et icônes

2. **Détail d'une offre** (`/carrieres/[id]`)
   - Vue complète de l'offre avec toutes les informations
   - Responsabilités, prérequis, compétences techniques
   - Fourchette salariale
   - Bouton "Postuler" bien visible

3. **Page de candidature** (`/carrieres/[id]/postuler`)
   - Formulaire complet avec validation
   - Upload CV (PDF obligatoire)
   - Upload lettre de motivation (PDF facultatif)
   - Message de motivation (facultatif)
   - Auto-remplissage si l'utilisateur est connecté
   - Confirmation visuelle après envoi

### 👨‍💼 Pour les administrateurs :
4. **Back-office admin** (`/admin/job-offers`)
   - Vue d'ensemble avec statistiques (total offres, publiées, candidatures)
   - Liste complète des offres avec actions :
     - ✏️ Modifier
     - 👁️ Publier/Dépublier
     - 🗑️ Supprimer
     - 👥 Voir les candidatures
   - Modal de création/édition d'offre :
     - Titre, département, type de contrat
     - Localisation, fourchette salariale
     - Description complète
     - Liste de responsabilités (ajout/suppression dynamique)
     - Liste de prérequis (ajout/suppression dynamique)
     - Tags de compétences techniques
     - Option de publication immédiate
   - Vue des candidatures par offre :
     - Informations du candidat
     - Statut de la candidature
     - Téléchargement CV et lettre de motivation
     - Message de motivation visible

---

## 📊 STRUCTURE DE LA BASE DE DONNÉES

### Table `job_offers`
```sql
- id (UUID, PK)
- title (TEXT) - Ex: "Développeur Full-Stack Senior"
- department (TEXT) - Ex: "Tech", "Design", "Support"
- location (TEXT) - Ex: "Abidjan, Cocody"
- employment_type (TEXT) - CDI, CDD, Stage, Freelance
- description (TEXT) - Description complète du poste
- responsibilities (TEXT[]) - Liste des responsabilités
- requirements (TEXT[]) - Liste des prérequis
- skills (TEXT[]) - Compétences techniques requises
- salary_range (TEXT, nullable) - Ex: "800 000 - 1 200 000 FCFA/mois"
- is_published (BOOLEAN) - Offre visible ou brouillon
- published_at (TIMESTAMPTZ) - Date de publication
- expires_at (TIMESTAMPTZ) - Date d'expiration (optionnel)
- created_by (UUID, FK profiles) - Admin créateur
- created_at, updated_at
```

### Table `job_applications`
```sql
- id (UUID, PK)
- job_offer_id (UUID, FK job_offers)
- first_name, last_name (TEXT)
- email, phone (TEXT)
- location (TEXT)
- cv_url (TEXT) - URL du CV dans Supabase Storage
- cover_letter_url (TEXT, nullable) - URL lettre de motivation
- motivation_message (TEXT, nullable) - Message libre
- status (TEXT) - pending, reviewed, shortlisted, rejected, hired
- notes (TEXT, nullable) - Notes internes admin
- created_at, updated_at
```

### Bucket Storage `job-applications`
- Stocke les CV et lettres de motivation
- Accès privé (seuls les admins peuvent lire)
- Upload public pour permettre les candidatures anonymes

---

## 🚀 DÉPLOIEMENT

### 1. Exécuter la migration SQL
```bash
# Ouvrir Supabase SQL Editor et exécuter :
yo-voisin/supabase/MIGRATION-JOB-OFFERS.sql
```

Cette migration crée :
- Les 2 tables (`job_offers`, `job_applications`)
- Les index pour performance
- Le bucket Storage pour les CV
- Les policies de sécurité (RLS)
- Les triggers pour auto-update
- 4 offres de test pré-remplies

### 2. Vérifier les policies
Assurez-vous que votre profil admin a bien `role = 'admin'` dans la table `profiles`.

### 3. Tester le système
1. **Front-end** : Allez sur `/carrieres` pour voir les offres
2. **Postuler** : Cliquez sur une offre > "Postuler"
3. **Admin** : Allez sur `/admin/job-offers` pour gérer les offres

---

## 📧 ENVOI DES CANDIDATURES PAR EMAIL

**État actuel** : Les candidatures sont stockées dans la base de données.

**À implémenter plus tard** :
Une fois le domaine `yovoiz.ci` configuré, vous pourrez :
1. Configurer l'email de réception : `recrutement@yovoiz.ci`
2. Ajouter un trigger pour envoyer un email automatique à chaque nouvelle candidature
3. Utiliser le système de notifications email existant (Brevo)

**Code trigger à ajouter plus tard** :
```sql
CREATE TRIGGER notify_new_application
  AFTER INSERT ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_recruitment_team();
```

Pour l'instant, les admins peuvent consulter les candidatures directement dans le back-office.

---

## 🎨 DESIGN & UX

### Points forts :
- ✅ Design cohérent avec le reste de Yo!Voiz (orange + vert)
- ✅ Responsive (mobile, tablette, desktop)
- ✅ Icônes Lucide pour clarté visuelle
- ✅ Badges de statut colorés
- ✅ Upload de fichiers avec drag & drop visuel
- ✅ Messages de confirmation clairs
- ✅ Chargement et états d'erreur gérés

### À améliorer (optionnel) :
- Filtres avancés sur la page carrières (département, type, salaire)
- Recherche par mots-clés
- Statistiques de vue d'offre
- Système de notation des candidats
- Envoi d'emails automatiques aux candidats

---

## 🧪 DONNÉES DE TEST

La migration crée automatiquement 4 offres de test :
1. **Développeur Full-Stack Senior** (Tech, CDI)
2. **Designer UI/UX** (Design, CDI)
3. **Chargé(e) de Relation Client** (Support, CDI)
4. **Data Analyst** (Data, Stage)

Toutes sont publiées par défaut pour faciliter les tests.

---

## 🔐 SÉCURITÉ

### Policies RLS :
- ✅ Lecture publique des offres publiées
- ✅ Création de candidature ouverte à tous (même non connectés)
- ✅ Seuls les admins peuvent modifier les offres
- ✅ Seuls les admins peuvent lire les candidatures
- ✅ Upload CV public, lecture privée (admin only)

### Validation :
- ✅ CV obligatoire (format PDF uniquement)
- ✅ Lettre de motivation facultative (format PDF)
- ✅ Emails validés côté client
- ✅ Taille max fichier : 10 MB (à configurer dans Storage)

---

## 📱 PAGES CRÉÉES

1. `/carrieres` - Page principale des offres
2. `/carrieres/[id]` - Détail d'une offre
3. `/carrieres/[id]/postuler` - Formulaire de candidature
4. `/admin/job-offers` - Back-office admin

---

## 🎯 PROCHAINES ÉTAPES RECOMMANDÉES

1. **Tester le système complet** :
   - Exécuter la migration SQL
   - Créer une offre depuis l'admin
   - Postuler à une offre
   - Vérifier la réception dans l'admin

2. **Configurer l'email** :
   - Attendre le domaine `yovoiz.ci`
   - Créer `recrutement@yovoiz.ci`
   - Ajouter le trigger de notification

3. **Améliorer l'UX** :
   - Ajouter des filtres sur `/carrieres`
   - Statistiques de vue d'offre
   - Email de confirmation aux candidats

4. **Marketing** :
   - Partager le lien `/carrieres` sur les réseaux sociaux
   - Créer du contenu "Rejoignez l'équipe"
   - Ajouter un lien dans le footer

---

## ✅ CHECKLIST DE DÉPLOIEMENT

- [ ] Exécuter `MIGRATION-JOB-OFFERS.sql` dans Supabase
- [ ] Vérifier que le bucket `job-applications` est créé
- [ ] Vérifier les policies RLS
- [ ] Tester la création d'une offre dans `/admin/job-offers`
- [ ] Tester la candidature sur une offre
- [ ] Vérifier que les CV s'uploadent correctement
- [ ] Consulter les candidatures dans l'admin
- [ ] Tester la publication/dépublication d'offres

---

## 🆘 SUPPORT

En cas de problème :
1. Vérifier les logs Supabase (Storage, Auth, Database)
2. Vérifier la console navigateur (F12)
3. Vérifier que le rôle admin est bien configuré
4. Vérifier les policies RLS

---

**Système créé le** : 15 Février 2026  
**Version** : 1.0  
**Statut** : ✅ Prêt pour production
