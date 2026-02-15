# 📧 AUDIT COMPLET DES NOTIFICATIONS EMAIL - YO!VOIZ

**Date**: 15 Février 2026  
**Objectif**: Identifier TOUTES les notifications nécessaires

---

## ✅ NOTIFICATIONS DÉJÀ IMPLÉMENTÉES (6)

### 1. **`request_validated`** - Demande validée
- **Déclencheur**: Back-office approuve une demande
- **Destinataire**: Demandeur
- **Sujet**: "🎉 Ta demande a été validée sur Yo!Voiz"

### 2. **`new_proposal`** - Nouvelle proposition reçue
- **Déclencheur**: Prestataire envoie un devis/négociation
- **Destinataire**: Demandeur
- **Sujet**: "💼 Nouveau devis reçu pour ta demande"

### 3. **`new_message`** - Nouveau message
- **Déclencheur**: Réception d'un message dans la messagerie
- **Destinataire**: Destinataire du message
- **Sujet**: "💬 Nouveau message sur Yo!Voiz"

### 4. **`profile_verified`** - Profil vérifié
- **Déclencheur**: Back-office vérifie un profil
- **Destinataire**: Utilisateur vérifié
- **Sujet**: "✅ Ton profil Yo!Voiz est maintenant vérifié"

### 5. **`transaction_completed_client`** - Transaction validée (vue client)
- **Déclencheur**: Paiement effectué avec succès
- **Destinataire**: Client/Demandeur
- **Sujet**: "💰 Transaction effectuée avec succès"

### 6. **`transaction_completed_provider`** - Paiement reçu (vue prestataire)
- **Déclencheur**: Paiement reçu
- **Destinataire**: Prestataire
- **Sujet**: "💰 Paiement reçu pour ta prestation"

---

## 🔴 NOTIFICATIONS CRITIQUES MANQUANTES

### **CYCLE DE VIE DES DEMANDES**

#### 7. **`request_submitted`** - Demande soumise pour validation ⭐ IMPORTANT
- **Déclencheur**: Utilisateur publie une demande (status: pending)
- **Destinataire**: Demandeur
- **Sujet**: "📝 Ta demande a bien été envoyée"
- **Contenu**: 
  - Confirmation de soumission
  - Temps d'attente estimé pour validation
  - Prochaines étapes
- **Pourquoi**: Rassurer l'utilisateur que sa demande est en cours de traitement

#### 8. **`request_rejected`** - Demande rejetée ⭐ IMPORTANT
- **Déclencheur**: Back-office rejette une demande
- **Destinataire**: Demandeur
- **Sujet**: "⚠️ Ta demande n'a pas pu être validée"
- **Contenu**:
  - Raison du rejet
  - Conseils pour la modifier
  - Lien pour créer une nouvelle demande
- **Pourquoi**: Expliquer le rejet et guider vers la solution

#### 9. **`request_expired`** - Demande expirée
- **Déclencheur**: Demande non répondue après X jours
- **Destinataire**: Demandeur
- **Sujet**: "⏰ Ta demande expire bientôt"
- **Contenu**:
  - Date d'expiration
  - Option pour prolonger
  - Récapitulatif des propositions reçues
- **Pourquoi**: Relancer l'utilisateur pour éviter perte d'opportunités

#### 10. **`request_cancelled`** - Demande annulée
- **Déclencheur**: Utilisateur annule sa demande
- **Destinataire**: Demandeur + Prestataires ayant proposé
- **Sujet**: "🚫 Demande annulée"
- **Contenu**: Confirmation d'annulation
- **Pourquoi**: Informer toutes les parties concernées

---

### **CYCLE DE VIE DES OFFRES DE SERVICE**

#### 11. **`service_offer_submitted`** - Offre soumise pour validation ⭐ IMPORTANT
- **Déclencheur**: Prestataire publie une offre (status: pending)
- **Destinataire**: Prestataire
- **Sujet**: "📝 Ton offre a bien été envoyée"
- **Pourquoi**: Confirmer la soumission

#### 12. **`service_offer_validated`** - Offre validée ⭐ IMPORTANT
- **Déclencheur**: Back-office approuve une offre
- **Destinataire**: Prestataire
- **Sujet**: "🎉 Ton offre est maintenant visible"
- **Pourquoi**: Informer que l'offre est en ligne

#### 13. **`service_offer_rejected`** - Offre rejetée
- **Déclencheur**: Back-office rejette une offre
- **Destinataire**: Prestataire
- **Sujet**: "⚠️ Ton offre n'a pas pu être validée"
- **Pourquoi**: Expliquer le rejet

---

### **CYCLE DE NÉGOCIATION**

#### 14. **`negotiation_accepted`** - Proposition acceptée ⭐ CRITIQUE
- **Déclencheur**: Client accepte une proposition
- **Destinataire**: Prestataire
- **Sujet**: "✅ Ta proposition a été acceptée !"
- **Contenu**:
  - Détails du client
  - Montant convenu
  - Prochaines étapes (paiement, rendez-vous)
- **Pourquoi**: Informer le prestataire qu'il a décroché le contrat

#### 15. **`negotiation_counter_offer`** - Contre-proposition reçue ⭐ IMPORTANT
- **Déclencheur**: Une partie fait une contre-offre
- **Destinataire**: L'autre partie
- **Sujet**: "💬 Nouvelle contre-proposition reçue"
- **Contenu**: Nouveau montant proposé
- **Pourquoi**: Faciliter la négociation

#### 16. **`negotiation_declined`** - Proposition refusée
- **Déclencheur**: Client refuse une proposition
- **Destinataire**: Prestataire
- **Sujet**: "🚫 Proposition non retenue"
- **Pourquoi**: Informer le prestataire pour qu'il passe à autre chose

---

### **CYCLE DE MISSION / PRESTATION**

#### 17. **`mission_started`** - Mission démarrée ⭐ IMPORTANT
- **Déclencheur**: Prestataire marque "Mission démarrée"
- **Destinataire**: Client
- **Sujet**: "🚀 Ta prestation a démarré"
- **Contenu**:
  - Nom du prestataire
  - Détails de la mission
  - Coordonnées de contact
- **Pourquoi**: Tenir le client informé

#### 18. **`mission_completed`** - Prestation terminée ⭐ CRITIQUE
- **Déclencheur**: Prestataire marque "Terminé"
- **Destinataire**: Client
- **Sujet**: "✅ Prestation terminée - Validation requise"
- **Contenu**:
  - Demande de validation
  - Lien pour valider ou signaler un problème
  - Rappel : paiement sera libéré après validation
- **Pourquoi**: Déclencher la validation et le paiement

#### 19. **`mission_validated`** - Prestation validée par le client
- **Déclencheur**: Client valide la prestation
- **Destinataire**: Prestataire
- **Sujet**: "✅ Prestation validée - Paiement en cours"
- **Contenu**: Confirmation, paiement sera transféré sous 2-3 jours
- **Pourquoi**: Rassurer le prestataire

#### 20. **`mission_disputed`** - Litige ouvert
- **Déclencheur**: Client signale un problème
- **Destinataire**: Client + Prestataire + Admin
- **Sujet**: "⚠️ Litige ouvert sur la prestation"
- **Pourquoi**: Alerter toutes les parties

---

### **AVIS ET RÉPUTATION**

#### 21. **`review_request`** - Demande d'avis ⭐ IMPORTANT
- **Déclencheur**: 24h après validation de prestation
- **Destinataire**: Client
- **Sujet**: "⭐ Laisse un avis sur ta prestation"
- **Contenu**:
  - Lien vers formulaire d'avis
  - Importance des avis pour la communauté
- **Pourquoi**: Augmenter le taux d'avis (crucial pour la confiance)

#### 22. **`review_received`** - Avis reçu
- **Déclencheur**: Quelqu'un laisse un avis sur le profil
- **Destinataire**: Prestataire
- **Sujet**: "⭐ Nouvel avis sur ton profil"
- **Pourquoi**: Notifier le prestataire

#### 23. **`review_response`** - Réponse à un avis
- **Déclencheur**: Prestataire répond à un avis
- **Destinataire**: Auteur de l'avis
- **Sujet**: "💬 Réponse à ton avis"
- **Pourquoi**: Engager la conversation

---

### **PAIEMENTS & FACTURATION**

#### 24. **`payment_pending`** - Paiement en attente ⭐ IMPORTANT
- **Déclencheur**: Proposition acceptée, en attente de paiement
- **Destinataire**: Client
- **Sujet**: "💳 Paiement requis pour confirmer ta réservation"
- **Contenu**:
  - Montant à payer
  - Lien vers page de paiement
  - Date limite (si applicable)
- **Pourquoi**: Relancer le paiement

#### 25. **`payment_failed`** - Paiement échoué ⭐ CRITIQUE
- **Déclencheur**: Échec de transaction
- **Destinataire**: Client
- **Sujet**: "❌ Échec du paiement"
- **Contenu**:
  - Raison de l'échec
  - Lien pour réessayer
  - Alternatives de paiement
- **Pourquoi**: Ne pas perdre la transaction

#### 26. **`refund_initiated`** - Remboursement initié
- **Déclencheur**: Admin/Système lance un remboursement
- **Destinataire**: Client
- **Sujet**: "💰 Remboursement en cours"
- **Pourquoi**: Tenir informé

#### 27. **`refund_completed`** - Remboursement effectué
- **Déclencheur**: Remboursement reçu
- **Destinataire**: Client
- **Sujet**: "✅ Remboursement effectué"
- **Pourquoi**: Confirmer la réception

---

### **ABONNEMENT PRO**

#### 28. **`subscription_activated`** - Abonnement Pro activé ⭐ IMPORTANT
- **Déclencheur**: Paiement abonnement Pro réussi
- **Destinataire**: Prestataire
- **Sujet**: "🎉 Bienvenue dans Yo!Voiz PRO !"
- **Contenu**:
  - Fonctionnalités débloquées
  - Guide de démarrage
  - Avantages exclusifs
- **Pourquoi**: Onboarding des utilisateurs Pro

#### 29. **`subscription_expiring`** - Abonnement expire bientôt
- **Déclencheur**: 7 jours avant expiration
- **Destinataire**: Prestataire Pro
- **Sujet**: "⏰ Ton abonnement Pro expire dans 7 jours"
- **Pourquoi**: Relancer le renouvellement

#### 30. **`subscription_expired`** - Abonnement expiré
- **Déclencheur**: Fin de l'abonnement
- **Destinataire**: Ex-Pro
- **Sujet**: "⚠️ Ton abonnement Pro a expiré"
- **Contenu**: Lien pour renouveler
- **Pourquoi**: Récupérer les utilisateurs

#### 31. **`subscription_renewed`** - Renouvellement réussi
- **Déclencheur**: Renouvellement automatique
- **Destinataire**: Prestataire Pro
- **Sujet**: "✅ Abonnement Pro renouvelé"
- **Pourquoi**: Confirmer le prélèvement

---

### **SÉCURITÉ & COMPTE**

#### 32. **`welcome_email`** - Email de bienvenue ⭐ CRITIQUE
- **Déclencheur**: Inscription terminée
- **Destinataire**: Nouvel utilisateur
- **Sujet**: "👋 Bienvenue sur Yo!Voiz !"
- **Contenu**:
  - Guide de démarrage
  - Premiers pas
  - Ressources utiles
- **Pourquoi**: Onboarding des nouveaux utilisateurs (crucial pour rétention)

#### 33. **`email_verification`** - Vérification d'email
- **Déclencheur**: Inscription ou changement d'email
- **Destinataire**: Utilisateur
- **Sujet**: "📧 Confirme ton adresse email"
- **Pourquoi**: Sécurité

#### 34. **`password_reset`** - Réinitialisation mot de passe
- **Déclencheur**: Demande de réinitialisation
- **Destinataire**: Utilisateur
- **Sujet**: "🔑 Réinitialisation de mot de passe"
- **Pourquoi**: Sécurité

#### 35. **`password_changed`** - Mot de passe modifié
- **Déclencheur**: Changement de mot de passe réussi
- **Destinataire**: Utilisateur
- **Sujet**: "✅ Mot de passe modifié"
- **Pourquoi**: Alerte sécurité

#### 36. **`suspicious_activity`** - Activité suspecte
- **Déclencheur**: Connexion depuis nouveau device, etc.
- **Destinataire**: Utilisateur
- **Sujet**: "⚠️ Activité inhabituelle détectée"
- **Pourquoi**: Sécurité

#### 37. **`account_deleted`** - Compte supprimé
- **Déclencheur**: Suppression de compte
- **Destinataire**: Ex-utilisateur
- **Sujet**: "👋 Ton compte a été supprimé"
- **Contenu**: Confirmation + option de récupération (30 jours)
- **Pourquoi**: Confirmation + possibilité de revenir

---

### **NOTIFICATIONS ADMIN / MODÉRATION**

#### 38. **`new_user_registered`** - Nouvel utilisateur
- **Déclencheur**: Inscription
- **Destinataire**: Admin
- **Sujet**: "🆕 Nouvel utilisateur inscrit"

#### 39. **`new_request_pending`** - Demande en attente de validation
- **Déclencheur**: Nouvelle demande publiée
- **Destinataire**: Admin/Modérateurs
- **Sujet**: "📋 Nouvelle demande à valider"

#### 40. **`new_service_offer_pending`** - Offre en attente
- **Déclencheur**: Nouvelle offre publiée
- **Destinataire**: Admin/Modérateurs
- **Sujet**: "🛠️ Nouvelle offre à valider"

#### 41. **`dispute_opened`** - Litige ouvert
- **Déclencheur**: Client/Prestataire ouvre un litige
- **Destinataire**: Admin
- **Sujet**: "⚠️ Nouveau litige à traiter"

---

### **MARKETING & ENGAGEMENT**

#### 42. **`inactive_user_reminder`** - Rappel utilisateur inactif
- **Déclencheur**: Pas de connexion depuis 30 jours
- **Destinataire**: Utilisateur inactif
- **Sujet**: "👋 On t'a manqué sur Yo!Voiz"

#### 43. **`newsletter`** - Newsletter
- **Déclencheur**: Envoi manuel ou automatique
- **Destinataire**: Utilisateurs abonnés
- **Sujet**: Variable

#### 44. **`promo_code`** - Code promo
- **Déclencheur**: Campagne marketing
- **Destinataire**: Utilisateurs ciblés
- **Sujet**: "🎁 Code promo exclusif pour toi !"

---

## 📊 RÉCAPITULATIF

### **Notifications implémentées** : 6
### **Notifications manquantes** : 38
### **TOTAL** : 44 types de notifications

### **Priorité CRITIQUE** (à implémenter en premier) :
1. ⭐ `welcome_email` (onboarding)
2. ⭐ `request_submitted` (rassurer)
3. ⭐ `request_rejected` (feedback)
4. ⭐ `service_offer_validated` (feedback prestataire)
5. ⭐ `negotiation_accepted` (deal conclu !)
6. ⭐ `mission_completed` (validation prestation)
7. ⭐ `payment_pending` (relance paiement)
8. ⭐ `payment_failed` (récupération transaction)
9. ⭐ `review_request` (augmenter avis)
10. ⭐ `subscription_activated` (onboarding Pro)

---

## 🎯 RECOMMANDATION

**Phase 1** (Immédiat) : Implémenter les 10 notifications critiques ci-dessus  
**Phase 2** (Court terme) : Cycle complet demandes + négociations  
**Phase 3** (Moyen terme) : Paiements + Litiges  
**Phase 4** (Long terme) : Marketing + Engagement

**Temps estimé Phase 1** : 2-3 heures de développement
