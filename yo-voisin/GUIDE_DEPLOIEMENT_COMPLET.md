# 🚀 Guide Complet de Déploiement - Yo! Voiz

---

## 📋 Prérequis et Coûts Estimés

### 🌐 1. Nom de Domaine (OBLIGATOIRE)

**Options recommandées pour la Côte d'Ivoire** :

#### Option A : Domaine .ci (Recommandé)
- **Nom** : `yovoiz.ci` ou `yo-voiz.ci`
- **Prix** : ~30,000 - 50,000 FCFA/an (~45-75€/an)
- **Fournisseurs** :
  - **NIC Côte d'Ivoire** : https://nic.ci/
  - **Ivoirhost** : https://ivoirhost.com/
  - **Afriregister** : https://www.afriregister.com/

#### Option B : Domaine international (.com, .net)
- **Nom** : `yovoiz.com` ou `yo-voiz.com`
- **Prix** : ~10-15€/an
- **Fournisseurs** :
  - **Namecheap** : https://www.namecheap.com/
  - **OVH** : https://www.ovh.com/
  - **Gandi** : https://www.gandi.net/

**Recommandation** : Prenez les DEUX pour protéger votre marque :
- `.ci` comme domaine principal (pour la Côte d'Ivoire)
- `.com` pour rediriger vers le `.ci`

---

### ☁️ 2. Hébergement Application (Vercel - GRATUIT !)

**✅ Vercel (Recommandé pour Next.js)** :
- **Prix** : GRATUIT pour commencer (Hobby Plan)
- **Inclus** :
  - Hébergement Next.js
  - SSL automatique (HTTPS)
  - Déploiement automatique depuis GitHub
  - Bande passante : Illimitée
  - Build time : 100h/mois
- **Limite** : 1 projet gratuit
- **Site** : https://vercel.com/

**Upgrade si nécessaire** :
- **Pro Plan** : 20$/mois (~19€/mois)
  - Projets illimités
  - 400h build time
  - Analytics avancés
  - Support prioritaire

---

### 🗄️ 3. Base de Données (Supabase)

**Votre projet Supabase actuel** :
- **Plan actuel** : Free (gratuit)
- **Limites Free** :
  - 500 MB de stockage
  - 2 GB de bande passante/mois
  - 50,000 requêtes par jour

**Upgrade si nécessaire** :
- **Pro Plan** : 25$/mois (~23€/mois)
  - 8 GB de stockage
  - 50 GB de bande passante
  - Backups automatiques quotidiens
  - Support email

**Recommandation** : Commencez avec le plan gratuit, upgradez si vous dépassez 100-200 utilisateurs actifs/jour.

---

### 📱 4. WhatsApp OTP (Twilio)

**Configuration en 2 phases** :

#### Phase 1 : Sandbox (GRATUIT - Tests)
- ✅ Déjà configuré dans votre .env.local
- Usage : Tests en développement
- Limite : Utilisateurs doivent rejoindre le sandbox

#### Phase 2 : Production (PAYANT)
- **Coût** :
  - Setup : 0€ (gratuit)
  - Abonnement Twilio : ~20€/mois
  - Messages WhatsApp : 0.005€/message
- **Total 1000 utilisateurs** : ~30€/mois (20€ + 10€ messages)

**Vous pouvez reporter ça après le déploiement !**

---

### 📧 5. Email (Supabase SMTP par défaut)

**Déjà inclus dans Supabase gratuit** :
- Emails d'authentification
- Réinitialisation mot de passe
- Vérification email

**Optionnel - SendGrid (meilleur taux de délivrance)** :
- **Free Plan** : 100 emails/jour (gratuit)
- **Essentials** : 15$/mois pour 50,000 emails/mois

**Recommandation** : Utilisez Supabase SMTP au début (gratuit), passez à SendGrid si taux de délivrance faible.

---

### 💳 6. Paiement Mobile Money (À venir)

**Pas nécessaire pour le déploiement initial**, mais pour plus tard :

Options pour Côte d'Ivoire :
- **Fedapay** : https://fedapay.com/
  - Orange Money, MTN Money, Moov Money
  - Commission : ~3-5% par transaction
- **CinetPay** : https://cinetpay.com/
  - Tous les opérateurs CI
  - Commission : ~2-4%

---

## 💰 Tableau Récapitulatif des Coûts

### Déploiement Initial (Minimum)

| Poste | Fournisseur | Coût | Fréquence |
|-------|-------------|------|-----------|
| **Domaine .ci** | NIC CI / Ivoirhost | 40,000 FCFA | /an |
| **Hébergement** | Vercel Free | **0€** | Gratuit |
| **Base de données** | Supabase Free | **0€** | Gratuit |
| **Email** | Supabase SMTP | **0€** | Inclus |
| **WhatsApp** | Reporter plus tard | **0€** | - |
| **TOTAL INITIAL** | | **~60€/an** | Juste le domaine ! |

---

### Après 100-500 Utilisateurs Actifs

| Poste | Fournisseur | Coût | Fréquence |
|-------|-------------|------|-----------|
| Domaine .ci | NIC CI | 40,000 FCFA | /an |
| Hébergement | Vercel Free | 0€ | Gratuit |
| Base de données | Supabase Pro | 25€ | /mois |
| WhatsApp | Twilio | 30€ | /mois |
| Email | SendGrid Essentials | 15€ | /mois |
| **TOTAL** | | **~60€/an + 70€/mois** | **~900€/an** |

---

### Après 1000+ Utilisateurs Actifs

| Poste | Coût Mensuel |
|-------|--------------|
| Domaine | 5€/mois |
| Hébergement (Vercel Pro) | 20€/mois |
| Base de données (Supabase Pro) | 25€/mois |
| WhatsApp (2000 messages/mois) | 30€/mois |
| Email (SendGrid) | 15€/mois |
| **TOTAL** | **~95€/mois (~1,200€/an)** |

---

## 🎯 Plan de Déploiement (Phase par Phase)

### Phase 1 : Préparation (2 jours) ⏰

#### Jour 1 : Acheter le Domaine
- [ ] Choisir entre .ci ou .com (ou les deux)
- [ ] Acheter le domaine
- [ ] Configurer les DNS (on fera ça ensemble)

#### Jour 2 : Setup Vercel + GitHub
- [ ] Créer compte GitHub (si pas déjà fait)
- [ ] Pousser le code sur GitHub
- [ ] Créer compte Vercel
- [ ] Connecter Vercel à GitHub

---

### Phase 2 : Déploiement (1 jour) 🚀

#### Matin : Configuration Vercel
- [ ] Importer le projet depuis GitHub
- [ ] Ajouter les variables d'environnement
- [ ] Lancer le premier build

#### Après-midi : Configuration Domaine
- [ ] Ajouter le domaine custom dans Vercel
- [ ] Configurer les DNS du domaine
- [ ] Attendre propagation (1-24h)
- [ ] Vérifier HTTPS automatique

---

### Phase 3 : Configuration Production (1 jour) ⚙️

#### Configuration Supabase
- [ ] Ajouter l'URL de production dans les URLs autorisées
- [ ] Configurer les emails de production
- [ ] Tester l'authentification

#### Tests Finaux
- [ ] Inscription avec email réel
- [ ] Connexion
- [ ] Mot de passe oublié
- [ ] Test sur mobile (iOS + Android)

---

### Phase 4 : WhatsApp Production (Optionnel - À reporter) 📱

Cette phase peut être faite **APRÈS** le déploiement initial.

- [ ] Demander numéro WhatsApp Business Twilio
- [ ] Créer templates de messages Meta
- [ ] Attendre approbation (2-7 jours)
- [ ] Configurer les variables en production
- [ ] Tester l'envoi WhatsApp réel

---

## 📝 Checklist Complète Avant Déploiement

### ✅ Code & Projet

- [x] Code fonctionne en local
- [x] Système d'authentification complet
- [x] Base de données Supabase configurée
- [x] Variables d'environnement documentées
- [ ] Code poussé sur GitHub (à faire)

### ✅ Comptes à Créer

- [ ] Compte GitHub (si pas déjà fait)
- [ ] Compte Vercel
- [ ] Domaine acheté et configuré

### ✅ Configuration

- [ ] Variables d'environnement prêtes pour Vercel
- [ ] URLs Supabase à mettre à jour
- [ ] DNS du domaine à configurer

---

## 🛠️ Ce Dont Vous Avez Besoin MAINTENANT

### Immédiatement (pour démarrer) :

1. **Domaine** :
   - Choisir le nom : `yovoiz.ci` ou `yo-voiz.ci` ?
   - Budget : ~40,000 FCFA (~60€)

2. **Compte GitHub** :
   - Gratuit : https://github.com/
   - Créer un compte si pas déjà fait

3. **Compte Vercel** :
   - Gratuit : https://vercel.com/
   - S'inscrire avec GitHub

### Plus tard (après déploiement) :

4. **WhatsApp Production** :
   - On configurera ça une fois le site en ligne
   - Pas urgent pour le lancement

5. **Paiement Mobile Money** :
   - Quand les fonctionnalités métier seront développées
   - Pas nécessaire pour l'authentification

---

## ❓ Questions Fréquentes

### Q1 : Ai-je besoin d'un hébergeur classique (OVH, Hostinger, etc.) ?

**Non !** Vercel héberge GRATUITEMENT votre application Next.js. Pas besoin d'un hébergeur web traditionnel.

---

### Q2 : Puis-je déployer sans acheter de domaine ?

**Oui temporairement**, Vercel vous donne un domaine gratuit :
- `yo-voiz.vercel.app` (gratuit)

Mais pour un site professionnel, un vrai domaine est recommandé :
- `yovoiz.ci` (professionnel)

---

### Q3 : Combien de temps prend le déploiement ?

**Temps estimé** :
- Achat domaine : 1-2 heures (validation)
- Setup GitHub + Vercel : 1 heure
- Premier déploiement : 30 minutes
- Configuration DNS : 1-24 heures (propagation)
- Tests : 2 heures

**Total : 1-2 jours** (principalement attente DNS)

---

### Q4 : Le site sera-t-il rapide depuis la Côte d'Ivoire ?

**Oui !** Vercel utilise un CDN mondial :
- Serveurs en Europe (proche de l'Afrique)
- Temps de chargement : < 2 secondes
- Optimisations automatiques

---

### Q5 : Puis-je changer d'hébergeur plus tard ?

**Oui**, votre code est portable. Mais Vercel est idéal pour Next.js :
- Déploiement automatique
- HTTPS gratuit
- Optimisations Next.js intégrées
- Pas de configuration serveur

---

### Q6 : Que se passe-t-il si je dépasse les limites gratuites ?

**Vercel Free** :
- Illimité en bande passante
- Limite : 100h build/mois (largement suffisant)

**Supabase Free** :
- 500 MB stockage
- 2 GB bande passante/mois
- ~500-1000 utilisateurs sans problème

Si dépassement → Upgrade automatique ou le service s'arrête (vous êtes prévenu à l'avance).

---

## 🚀 Prochaines Étapes

### Ce Que Nous Allons Faire Ensemble :

1. **Maintenant** : Vous décidez du nom de domaine
2. **Ensuite** : Je vous guide pour :
   - Acheter le domaine
   - Créer les comptes nécessaires
   - Pousser le code sur GitHub
   - Déployer sur Vercel
   - Configurer le domaine

3. **Après déploiement** :
   - Tester le site en production
   - Configurer WhatsApp (optionnel)
   - Développer les fonctionnalités métier

---

## 💡 Ma Recommandation

### Configuration Initiale (Budget Minimum) :

**Maintenant** :
- ✅ Domaine `.ci` : `yovoiz.ci` (~60€/an)
- ✅ Vercel Free (gratuit)
- ✅ Supabase Free (gratuit)
- ✅ Email via Supabase (gratuit)

**Total : ~60€/an** (juste le domaine !)

**Plus tard** (quand vous aurez 100+ utilisateurs) :
- Upgrade Supabase Pro : +25€/mois
- Activer WhatsApp Production : +30€/mois
- Email SendGrid : +15€/mois

---

## 📞 Support & Aide

**Besoin d'aide pour** :
- Choisir le nom de domaine ?
- Acheter le domaine ?
- Créer les comptes ?
- Configurer le déploiement ?

**Je suis là pour vous guider à chaque étape !** 🚀

---

**Êtes-vous prêt à acheter le domaine ? Quel nom préférez-vous : `yovoiz.ci` ou `yo-voiz.ci` ?**
