# 📧 GUIDE COMPLET - SYSTÈME DE NOTIFICATIONS EMAIL YO!VOIZ

**Version** : 1.0  
**Date** : 15 Février 2026  
**Total de notifications** : 44 types

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Installation et configuration](#installation-et-configuration)
3. [Utilisation dans le code](#utilisation-dans-le-code)
4. [Référence des 44 notifications](#référence-des-44-notifications)
5. [Exemples pratiques](#exemples-pratiques)
6. [Tests et débogage](#tests-et-débogage)
7. [Bonnes pratiques](#bonnes-pratiques)

---

## 🎯 VUE D'ENSEMBLE

Le système de notifications email de Yo!Voiz couvre **l'intégralité du cycle de vie utilisateur** :

- ✅ **10 notifications** pour le cycle de vie des demandes
- ✅ **3 notifications** pour les offres de service
- ✅ **5 notifications** pour les négociations
- ✅ **5 notifications** pour les missions/prestations
- ✅ **3 notifications** pour les avis
- ✅ **6 notifications** pour les paiements
- ✅ **4 notifications** pour l'abonnement Pro
- ✅ **1 notification** pour la messagerie
- ✅ **7 notifications** pour la sécurité & compte
- ✅ **4 notifications** pour l'administration
- ✅ **3 notifications** pour le marketing

---

## ⚙️ INSTALLATION ET CONFIGURATION

### 1. Prérequis

```bash
# Le système utilise:
- Brevo (Sendinblue) pour l'envoi d'emails
- Supabase Edge Functions
- Next.js (côté application)
```

### 2. Variables d'environnement

Ajoutez dans `.env.local` :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hfrmctsvpszqdizritoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key  # IMPORTANT !
```

### 3. Configuration Brevo

La clé API Brevo est configurée comme secret Supabase :
```
BREVO_API_KEY=1RyY9PLWjc3G678D
```

---

## 💻 UTILISATION DANS LE CODE

### Import

```typescript
import {
  sendWelcomeEmail,
  sendRequestValidatedEmail,
  sendPaymentReceivedEmail,
  // ... autres fonctions
} from '@/lib/email-notifications';
```

### Exemple basique

```typescript
// Après la création d'un utilisateur
await sendWelcomeEmail(userId);

// Après la validation d'une demande
await sendRequestValidatedEmail(userId, {
  requestId: 'xxx',
  title: 'Nettoyage de maison',
  category: 'cleaning'
});
```

### Gestion des erreurs

```typescript
const result = await sendPaymentReceivedEmail(userId, {
  missionId: 'xxx',
  reference: 'PAY-12345',
  amount: 50000,
  providerName: 'Jean Kouadio',
  paidAt: new Date()
});

if (!result.success) {
  console.error('Erreur envoi email:', result.error);
  // Gérer l'erreur (retry, log, etc.)
}
```

---

## 📚 RÉFÉRENCE DES 44 NOTIFICATIONS

### 1. CYCLE DE VIE DES DEMANDES

#### 1.1 `request_submitted` - Demande soumise

**Quand** : L'utilisateur publie une demande (status: pending)  
**Destinataire** : Demandeur  
**Sujet** : "📝 Ta demande a bien été envoyée"

```typescript
await sendRequestSubmittedEmail(userId, {
  requestId: 'req_123',
  title: 'Réparation de plomberie',
  category: 'plumbing',
  createdAt: new Date()
});
```

**Exemple d'intégration** :
```typescript
// Dans app/missions/nouvelle/page.tsx
async function handleSubmit(data: FormData) {
  const request = await createRequest(data);
  
  // Envoyer notification
  await sendRequestSubmittedEmail(user.id, {
    requestId: request.id,
    title: request.title,
    category: request.category
  });
  
  router.push('/demande-envoyee');
}
```

---

#### 1.2 `request_validated` - Demande validée

**Quand** : Admin valide une demande (status: published)  
**Destinataire** : Demandeur  
**Sujet** : "🎉 Ta demande a été validée !"

```typescript
await sendRequestValidatedEmail(userId, {
  requestId: 'req_123',
  title: 'Réparation de plomberie',
  category: 'plumbing'
});
```

**Exemple d'intégration** :
```typescript
// Dans le back-office admin
async function validateRequest(requestId: string) {
  await supabase
    .from('requests')
    .update({ status: 'published' })
    .eq('id', requestId);
  
  const request = await getRequest(requestId);
  
  await sendRequestValidatedEmail(request.requester_id, {
    requestId: request.id,
    title: request.title,
    category: request.category
  });
}
```

---

#### 1.3 `request_rejected` - Demande rejetée

**Quand** : Admin rejette une demande  
**Destinataire** : Demandeur  
**Sujet** : "⚠️ Ta demande n'a pas pu être validée"

```typescript
await sendRequestRejectedEmail(userId, {
  requestId: 'req_123',
  title: 'Demande incorrecte',
  reason: 'La description est trop vague. Merci de préciser le type de réparation nécessaire.'
});
```

---

#### 1.4 `request_expired` - Demande expire bientôt

**Quand** : Demande non répondue après X jours  
**Destinataire** : Demandeur  
**Sujet** : "⏰ Ta demande expire bientôt"

```typescript
await sendRequestExpiredEmail(userId, {
  requestId: 'req_123',
  title: 'Réparation de plomberie',
  daysLeft: 3,
  proposalsCount: 5,
  viewsCount: 42
});
```

**Exemple d'implémentation (cron job)** :
```typescript
// Exécuter quotidiennement
async function checkExpiringRequests() {
  const expiringRequests = await supabase
    .from('requests')
    .select('*')
    .eq('status', 'published')
    .lt('expires_at', new Date(Date.now() + 3*24*60*60*1000));
  
  for (const request of expiringRequests) {
    await sendRequestExpiredEmail(request.requester_id, {
      requestId: request.id,
      title: request.title,
      daysLeft: Math.ceil((request.expires_at - Date.now()) / (24*60*60*1000)),
      proposalsCount: request.quotes_count,
      viewsCount: request.views_count
    });
  }
}
```

---

#### 1.5 `request_cancelled` - Demande annulée

**Quand** : Utilisateur annule sa demande  
**Destinataire** : Demandeur + Prestataires ayant proposé  
**Sujet** : "🚫 Demande annulée"

```typescript
await sendRequestCancelledEmail(userId, {
  requestId: 'req_123',
  title: 'Réparation de plomberie'
});
```

---

### 2. CYCLE DE VIE DES OFFRES

#### 2.1 `service_offer_submitted` - Offre soumise

**Quand** : Prestataire publie une offre (status: pending)  
**Destinataire** : Prestataire  
**Sujet** : "📝 Ton offre a bien été envoyée"

```typescript
await sendServiceOfferSubmittedEmail(userId, {
  offerId: 'offer_123',
  title: 'Plomberie professionnelle'
});
```

---

#### 2.2 `service_offer_validated` - Offre validée

**Quand** : Admin valide l'offre  
**Destinataire** : Prestataire  
**Sujet** : "🎉 Ton offre est maintenant visible !"

```typescript
await sendServiceOfferValidatedEmail(userId, {
  offerId: 'offer_123',
  title: 'Plomberie professionnelle'
});
```

---

#### 2.3 `service_offer_rejected` - Offre rejetée

**Quand** : Admin rejette l'offre  
**Destinataire** : Prestataire  
**Sujet** : "⚠️ Ton offre n'a pas pu être validée"

```typescript
await sendServiceOfferRejectedEmail(userId, {
  offerId: 'offer_123',
  title: 'Offre incomplète',
  reason: 'Merci d\'ajouter des photos de vos précédentes réalisations.'
});
```

---

### 3. NÉGOCIATIONS

#### 3.1 `new_proposal` - Nouvelle proposition reçue

**Quand** : Prestataire envoie un devis  
**Destinataire** : Demandeur  
**Sujet** : "💼 Nouvelle proposition reçue !"

```typescript
await sendNewProposalEmail(userId, {
  negotiationId: 'neg_123',
  providerName: 'Jean Kouadio',
  amount: 50000,
  message: 'Je peux intervenir dès demain matin. J\'ai 10 ans d\'expérience en plomberie.'
});
```

**Exemple d'intégration** :
```typescript
// Quand un prestataire envoie une proposition
async function createProposal(data: ProposalData) {
  const proposal = await supabase
    .from('negotiations')
    .insert(data)
    .select()
    .single();
  
  // Notifier le client
  await sendNewProposalEmail(data.client_id, {
    negotiationId: proposal.id,
    providerName: provider.name,
    amount: data.amount,
    message: data.message
  });
}
```

---

#### 3.2 `negotiation_accepted` - Proposition acceptée ⭐ CRITIQUE

**Quand** : Client accepte une proposition  
**Destinataire** : Prestataire  
**Sujet** : "✅ Ta proposition a été acceptée !"

```typescript
await sendNegotiationAcceptedEmail(providerId, {
  negotiationId: 'neg_123',
  missionId: 'mission_456',
  clientName: 'Marie Traoré',
  amount: 50000
});
```

**Exemple d'intégration** :
```typescript
async function acceptProposal(negotiationId: string) {
  const negotiation = await supabase
    .from('negotiations')
    .update({ status: 'accepted' })
    .eq('id', negotiationId)
    .select('*, provider:profiles(*), client:profiles(*)')
    .single();
  
  // Créer la mission
  const mission = await createMission(negotiation);
  
  // Notifier le prestataire
  await sendNegotiationAcceptedEmail(negotiation.provider_id, {
    negotiationId: negotiation.id,
    missionId: mission.id,
    clientName: `${negotiation.client.first_name} ${negotiation.client.last_name}`,
    amount: negotiation.amount
  });
}
```

---

#### 3.3 `negotiation_counter_offer` - Contre-proposition

**Quand** : Une partie fait une contre-offre  
**Destinataire** : L'autre partie  
**Sujet** : "💬 Nouvelle contre-proposition"

```typescript
await sendNegotiationCounterOfferEmail(userId, {
  negotiationId: 'neg_123',
  senderName: 'Jean Kouadio',
  amount: 45000,
  previousAmount: 50000,
  message: 'Je peux baisser à 45 000 FCFA si vous me confirmez rapidement.'
});
```

---

#### 3.4 `negotiation_declined` - Proposition refusée

**Quand** : Client refuse une proposition  
**Destinataire** : Prestataire  
**Sujet** : "🚫 Proposition non retenue"

```typescript
await sendNegotiationDeclinedEmail(providerId, {
  negotiationId: 'neg_123'
});
```

---

#### 3.5 `negotiation_expired` - Négociation expirée

**Quand** : Négociation sans réponse après X jours  
**Destinataire** : Les deux parties  
**Sujet** : "⏰ Négociation expirée"

```typescript
await sendNegotiationExpiredEmail(userId, {
  negotiationId: 'neg_123',
  title: 'Réparation de plomberie'
});
```

---

### 4. MISSIONS / PRESTATIONS

#### 4.1 `mission_started` - Mission démarrée

**Quand** : Prestataire marque "Mission démarrée"  
**Destinataire** : Client  
**Sujet** : "🚀 Ta prestation a démarré"

```typescript
await sendMissionStartedEmail(clientId, {
  missionId: 'mission_123',
  title: 'Réparation de plomberie',
  providerName: 'Jean Kouadio',
  providerPhone: '+225 07 12 34 56 78'
});
```

---

#### 4.2 `mission_completed` - Prestation terminée ⭐ CRITIQUE

**Quand** : Prestataire marque "Terminé"  
**Destinataire** : Client  
**Sujet** : "✅ Prestation terminée - Validation requise"

```typescript
await sendMissionCompletedEmail(clientId, {
  missionId: 'mission_123',
  providerName: 'Jean Kouadio'
});
```

**Exemple d'intégration** :
```typescript
async function completeMission(missionId: string, providerId: string) {
  await supabase
    .from('missions')
    .update({ 
      status: 'completed',
      completed_at: new Date()
    })
    .eq('id', missionId);
  
  const mission = await getMission(missionId);
  
  // Notifier le client pour validation
  await sendMissionCompletedEmail(mission.client_id, {
    missionId: mission.id,
    providerName: mission.provider.name
  });
}
```

---

#### 4.3 `mission_validated` - Prestation validée

**Quand** : Client valide la prestation  
**Destinataire** : Prestataire  
**Sujet** : "✅ Prestation validée - Paiement en cours"

```typescript
await sendMissionValidatedEmail(providerId, {
  missionId: 'mission_123',
  clientName: 'Marie Traoré',
  amount: 50000
});
```

**Exemple d'intégration** :
```typescript
async function validateMission(missionId: string, clientId: string) {
  await supabase
    .from('missions')
    .update({ 
      status: 'validated',
      validated_at: new Date()
    })
    .eq('id', missionId);
  
  const mission = await getMission(missionId);
  
  // Déclencher le paiement au prestataire
  await transferPaymentToProvider(mission);
  
  // Notifier le prestataire
  await sendMissionValidatedEmail(mission.provider_id, {
    missionId: mission.id,
    clientName: `${mission.client.first_name} ${mission.client.last_name}`,
    amount: mission.amount
  });
  
  // Demander un avis 24h plus tard
  setTimeout(async () => {
    await sendReviewRequestEmail(mission.client_id, {
      missionId: mission.id,
      providerName: mission.provider.name
    });
  }, 24 * 60 * 60 * 1000);
}
```

---

#### 4.4 `mission_disputed` - Litige ouvert

**Quand** : Client signale un problème  
**Destinataire** : Client + Prestataire + Admin  
**Sujet** : "⚠️ Litige ouvert sur la prestation"

```typescript
await sendMissionDisputedEmail(userId, {
  missionId: 'mission_123',
  title: 'Réparation de plomberie',
  reason: 'La fuite n\'est pas réparée et le prestataire ne répond plus.'
});
```

---

#### 4.5 `mission_cancelled` - Mission annulée

**Quand** : Annulation de mission  
**Destinataire** : Les deux parties  
**Sujet** : "🚫 Mission annulée"

```typescript
await sendMissionCancelledEmail(userId, {
  missionId: 'mission_123',
  title: 'Réparation de plomberie',
  reason: 'Le prestataire n\'est plus disponible',
  refundAmount: 50000
});
```

---

### 5. AVIS / RÉPUTATION

#### 5.1 `review_request` - Demande d'avis ⭐ IMPORTANT

**Quand** : 24h après validation de prestation  
**Destinataire** : Client  
**Sujet** : "⭐ Laisse ton avis sur la prestation"

```typescript
await sendReviewRequestEmail(clientId, {
  missionId: 'mission_123',
  providerName: 'Jean Kouadio'
});
```

**Implémentation automatique** :
```typescript
// Dans validateMission()
setTimeout(async () => {
  await sendReviewRequestEmail(mission.client_id, {
    missionId: mission.id,
    providerName: mission.provider.name
  });
}, 24 * 60 * 60 * 1000); // 24 heures
```

---

#### 5.2 `review_received` - Avis reçu

**Quand** : Quelqu'un laisse un avis  
**Destinataire** : Prestataire  
**Sujet** : "⭐ Nouvel avis sur ton profil"

```typescript
await sendReviewReceivedEmail(providerId, {
  reviewerName: 'Marie Traoré',
  rating: 5,
  comment: 'Excellent travail, très professionnel et ponctuel !'
});
```

---

#### 5.3 `review_response` - Réponse à un avis

**Quand** : Prestataire répond à un avis  
**Destinataire** : Auteur de l'avis  
**Sujet** : "💬 Réponse à ton avis"

```typescript
await sendReviewResponseEmail(clientId, {
  providerId: 'provider_123',
  providerName: 'Jean Kouadio',
  response: 'Merci beaucoup pour votre retour ! Ce fut un plaisir de travailler avec vous.'
});
```

---

### 6. PAIEMENTS & FACTURATION

#### 6.1 `payment_pending` - Paiement en attente ⭐ IMPORTANT

**Quand** : Proposition acceptée, en attente de paiement  
**Destinataire** : Client  
**Sujet** : "💳 Paiement requis pour confirmer"

```typescript
await sendPaymentPendingEmail(clientId, {
  paymentId: 'pay_123',
  providerName: 'Jean Kouadio',
  amount: 50000,
  expiryDate: new Date(Date.now() + 24*60*60*1000) // 24h
});
```

---

#### 6.2 `payment_received` - Paiement reçu

**Quand** : Paiement effectué avec succès  
**Destinataire** : Client  
**Sujet** : "✅ Paiement reçu avec succès"

```typescript
await sendPaymentReceivedEmail(clientId, {
  missionId: 'mission_123',
  reference: 'PAY-2026-001',
  amount: 50000,
  providerName: 'Jean Kouadio',
  paidAt: new Date()
});
```

---

#### 6.3 `payment_failed` - Paiement échoué ⭐ CRITIQUE

**Quand** : Échec de transaction  
**Destinataire** : Client  
**Sujet** : "❌ Échec du paiement"

```typescript
await sendPaymentFailedEmail(clientId, {
  paymentId: 'pay_123',
  amount: 50000,
  errorMessage: 'Fonds insuffisants sur la carte'
});
```

**Exemple d'intégration** :
```typescript
async function processPayment(paymentData: PaymentData) {
  try {
    const result = await stripeCharge(paymentData);
    
    if (result.status === 'succeeded') {
      await sendPaymentReceivedEmail(paymentData.userId, {...});
    }
  } catch (error) {
    // Notifier l'utilisateur de l'échec
    await sendPaymentFailedEmail(paymentData.userId, {
      paymentId: paymentData.id,
      amount: paymentData.amount,
      errorMessage: error.message
    });
  }
}
```

---

#### 6.4 `refund_initiated` - Remboursement initié

**Quand** : Admin/Système lance un remboursement  
**Destinataire** : Client  
**Sujet** : "💰 Remboursement en cours"

```typescript
await sendRefundInitiatedEmail(clientId, {
  reference: 'REF-2026-001',
  amount: 50000,
  reason: 'Prestation non réalisée'
});
```

---

#### 6.5 `refund_completed` - Remboursement effectué

**Quand** : Remboursement reçu  
**Destinataire** : Client  
**Sujet** : "✅ Remboursement effectué"

```typescript
await sendRefundCompletedEmail(clientId, {
  reference: 'REF-2026-001',
  amount: 50000,
  completedAt: new Date()
});
```

---

#### 6.6 `invoice_sent` - Facture disponible

**Quand** : Facture générée  
**Destinataire** : Client  
**Sujet** : "📄 Nouvelle facture disponible"

```typescript
await sendInvoiceSentEmail(clientId, {
  invoiceId: 'inv_123',
  invoiceNumber: 'FACT-2026-001',
  title: 'Réparation de plomberie',
  amount: 50000,
  date: new Date()
});
```

---

### 7. ABONNEMENT PRO

#### 7.1 `subscription_activated` - Abonnement Pro activé ⭐ IMPORTANT

**Quand** : Paiement abonnement Pro réussi  
**Destinataire** : Prestataire  
**Sujet** : "🎉 Bienvenue dans Yo!Voiz PRO !"

```typescript
await sendSubscriptionActivatedEmail(providerId, {
  subscriptionId: 'sub_123'
});
```

---

#### 7.2 `subscription_expiring` - Abonnement expire bientôt

**Quand** : 7 jours avant expiration  
**Destinataire** : Prestataire Pro  
**Sujet** : "⏰ Ton abonnement PRO expire dans 7 jours"

```typescript
await sendSubscriptionExpiringEmail(providerId, {
  expiryDate: new Date(Date.now() + 7*24*60*60*1000)
});
```

---

#### 7.3 `subscription_expired` - Abonnement expiré

**Quand** : Fin de l'abonnement  
**Destinataire** : Ex-Pro  
**Sujet** : "⚠️ Ton abonnement PRO a expiré"

```typescript
await sendSubscriptionExpiredEmail(providerId, {
  subscriptionId: 'sub_123'
});
```

---

#### 7.4 `subscription_renewed` - Renouvellement réussi

**Quand** : Renouvellement automatique  
**Destinataire** : Prestataire Pro  
**Sujet** : "✅ Abonnement PRO renouvelé"

```typescript
await sendSubscriptionRenewedEmail(providerId, {
  subscriptionId: 'sub_123',
  nextRenewalDate: new Date(Date.now() + 30*24*60*60*1000),
  amount: 25000
});
```

---

### 8. MESSAGERIE

#### 8.1 `new_message` - Nouveau message

**Quand** : Réception d'un message  
**Destinataire** : Destinataire du message  
**Sujet** : "💬 Nouveau message sur Yo!Voiz"

```typescript
await sendNewMessageEmail(receiverId, {
  messageId: 'msg_123',
  conversationId: 'conv_456',
  senderId: 'user_789',
  senderName: 'Jean Kouadio',
  content: 'Bonjour, je peux passer demain matin vers 9h. Est-ce que ça vous convient ?',
  createdAt: new Date()
});
```

---

### 9. SÉCURITÉ & COMPTE

#### 9.1 `welcome_email` - Email de bienvenue ⭐ CRITIQUE

**Quand** : Inscription terminée  
**Destinataire** : Nouvel utilisateur  
**Sujet** : "👋 Bienvenue sur Yo!Voiz !"

```typescript
await sendWelcomeEmail(userId);
```

**Exemple d'intégration** :
```typescript
// Dans la fonction d'inscription
async function signUp(data: SignUpData) {
  const user = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  });
  
  // Envoyer email de bienvenue
  await sendWelcomeEmail(user.id);
}
```

---

#### 9.2 `email_verification` - Vérification d'email

**Quand** : Inscription ou changement d'email  
**Destinataire** : Utilisateur  
**Sujet** : "📧 Confirme ton adresse email"

```typescript
await sendEmailVerificationEmail(userId, {
  verificationLink: 'https://yovoiz.ci/verify?token=abc123'
});
```

---

#### 9.3 `password_reset` - Réinitialisation mot de passe

**Quand** : Demande de réinitialisation  
**Destinataire** : Utilisateur  
**Sujet** : "🔑 Réinitialisation de mot de passe"

```typescript
await sendPasswordResetEmail(userId, {
  resetLink: 'https://yovoiz.ci/reset-password?token=xyz789'
});
```

---

#### 9.4 `password_changed` - Mot de passe modifié

**Quand** : Changement de mot de passe réussi  
**Destinataire** : Utilisateur  
**Sujet** : "✅ Mot de passe modifié"

```typescript
await sendPasswordChangedEmail(userId);
```

---

#### 9.5 `profile_verified` - Profil vérifié

**Quand** : Admin vérifie un profil  
**Destinataire** : Utilisateur  
**Sujet** : "✅ Ton profil est vérifié !"

```typescript
await sendProfileVerifiedEmail(userId, {
  firstName: 'Jean',
  lastName: 'Kouadio',
  verifiedAt: new Date()
});
```

---

#### 9.6 `suspicious_activity` - Activité suspecte

**Quand** : Connexion depuis nouveau device, etc.  
**Destinataire** : Utilisateur  
**Sujet** : "⚠️ Activité inhabituelle détectée"

```typescript
await sendSuspiciousActivityEmail(userId, {
  activityType: 'Connexion depuis nouvel appareil',
  detectedAt: new Date(),
  location: 'Abidjan, Côte d\'Ivoire'
});
```

---

#### 9.7 `account_deleted` - Compte supprimé

**Quand** : Suppression de compte  
**Destinataire** : Ex-utilisateur  
**Sujet** : "👋 Ton compte a été supprimé"

```typescript
await sendAccountDeletedEmail(userId);
```

---

### 10. ADMIN / MODÉRATION

#### 10.1 `new_user_registered` - Nouvel utilisateur

**Quand** : Inscription  
**Destinataire** : Admin  
**Sujet** : "🆕 Nouvel utilisateur inscrit"

```typescript
await sendNewUserRegisteredEmail(adminId, {
  userId: 'user_123',
  userName: 'Jean Kouadio',
  userEmail: 'jean@example.com'
});
```

---

#### 10.2 `new_request_pending` - Demande en attente

**Quand** : Nouvelle demande publiée  
**Destinataire** : Admin/Modérateurs  
**Sujet** : "📋 Nouvelle demande à valider"

```typescript
await sendNewRequestPendingEmail(adminId, {
  requestId: 'req_123',
  title: 'Réparation de plomberie',
  userName: 'Marie Traoré',
  createdAt: new Date()
});
```

---

#### 10.3 `new_service_offer_pending` - Offre en attente

**Quand** : Nouvelle offre publiée  
**Destinataire** : Admin/Modérateurs  
**Sujet** : "🛠️ Nouvelle offre à valider"

```typescript
await sendNewServiceOfferPendingEmail(adminId, {
  offerId: 'offer_123',
  title: 'Plomberie professionnelle',
  providerName: 'Jean Kouadio',
  createdAt: new Date()
});
```

---

#### 10.4 `dispute_opened` - Litige ouvert

**Quand** : Client/Prestataire ouvre un litige  
**Destinataire** : Admin  
**Sujet** : "⚠️ Nouveau litige à traiter"

```typescript
await sendDisputeOpenedEmail(adminId, {
  disputeId: 'dispute_123',
  missionTitle: 'Réparation de plomberie',
  clientName: 'Marie Traoré',
  providerName: 'Jean Kouadio',
  amount: 50000
});
```

---

### 11. MARKETING & ENGAGEMENT

#### 11.1 `inactive_user_reminder` - Rappel utilisateur inactif

**Quand** : Pas de connexion depuis 30 jours  
**Destinataire** : Utilisateur inactif  
**Sujet** : "👋 On t'a manqué sur Yo!Voiz"

```typescript
await sendInactiveUserReminderEmail(userId, {
  newRequestsCount: 42,
  newProvidersCount: 15
});
```

---

#### 11.2 `newsletter` - Newsletter

**Quand** : Envoi manuel ou automatique  
**Destinataire** : Utilisateurs abonnés  
**Sujet** : Variable

```typescript
await sendNewsletterEmail(userId, {
  subject: '📰 Nouveautés de février 2026',
  content: '<h1>Nouveautés du mois</h1><p>...</p>'
});
```

---

#### 11.3 `promo_code` - Code promo

**Quand** : Campagne marketing  
**Destinataire** : Utilisateurs ciblés  
**Sujet** : "🎁 Code promo exclusif pour toi !"

```typescript
await sendPromoCodeEmail(userId, {
  promoTitle: 'Offre Saint-Valentin',
  promoCode: 'LOVE2026',
  discount: '20%',
  expiryDate: new Date('2026-02-28')
});
```

---

### 12. TRANSACTIONS

#### 12.1 `transaction_completed_client` - Transaction validée (client)

**Quand** : Paiement effectué  
**Destinataire** : Client  
**Sujet** : "💰 Transaction effectuée avec succès"

```typescript
await sendTransactionCompletedClientEmail(clientId, {
  missionId: 'mission_123',
  transactionId: 'txn_456',
  providerName: 'Jean Kouadio',
  amount: 50000,
  reference: 'TXN-2026-001',
  completedAt: new Date()
});
```

---

#### 12.2 `transaction_completed_provider` - Paiement reçu (prestataire)

**Quand** : Paiement transféré au prestataire  
**Destinataire** : Prestataire  
**Sujet** : "💰 Paiement reçu pour ta prestation"

```typescript
await sendTransactionCompletedProviderEmail(providerId, {
  missionId: 'mission_123',
  transactionId: 'txn_456',
  clientName: 'Marie Traoré',
  amount: 50000,
  reference: 'TXN-2026-001',
  completedAt: new Date()
});
```

---

## 🧪 TESTS ET DÉBOGAGE

### Page de test

Une page de test est disponible : `/test-email`

```typescript
// Accéder à http://localhost:3000/test-email
// Cliquer sur "Envoyer un Email de Test"
```

### Test manuel dans le code

```typescript
import { testEmailNotification } from '@/lib/email-notifications';

// Tester l'envoi d'email
await testEmailNotification('8b8cb0f0-6712-445b-a9ed-a45aa78638d2');
```

### Vérifier les logs

1. **Console du navigateur** : Messages de succès/erreur
2. **Logs Supabase Functions** : https://supabase.com/dashboard/project/hfrmctsvpszqdizritoe/functions/send-email-notification/logs
3. **Dashboard Brevo** : Statistiques d'envoi

---

## ✅ BONNES PRATIQUES

### 1. Gestion des erreurs

```typescript
const result = await sendWelcomeEmail(userId);

if (!result.success) {
  // Logger l'erreur
  console.error('Erreur envoi email:', result.error);
  
  // Retry après 5 secondes
  setTimeout(() => sendWelcomeEmail(userId), 5000);
  
  // Ou sauvegarder dans une table de retry
  await saveFailedEmail({
    userId,
    type: 'welcome_email',
    error: result.error
  });
}
```

### 2. Ne pas bloquer l'exécution

```typescript
// ❌ Mauvais : Attend le résultat
await sendWelcomeEmail(userId);
res.json({ success: true });

// ✅ Bon : Fire and forget
sendWelcomeEmail(userId).catch(console.error);
res.json({ success: true });
```

### 3. Grouper les notifications

```typescript
// Lors de la validation d'une mission
async function validateMission(missionId: string) {
  // ... logique métier
  
  // Envoyer plusieurs emails en parallèle
  await Promise.all([
    sendMissionValidatedEmail(providerId, {...}),
    sendTransactionCompletedProviderEmail(providerId, {...}),
    sendTransactionCompletedClientEmail(clientId, {...})
  ]);
}
```

### 4. Respecter les préférences utilisateur

```typescript
// Vérifier si l'utilisateur a activé les notifications
const preferences = await getUserPreferences(userId);

if (preferences.emailNotifications.missions) {
  await sendMissionCompletedEmail(userId, {...});
}
```

### 5. Tester en local

Utilisez un email de test avant de déployer :

```typescript
const TEST_MODE = process.env.NODE_ENV === 'development';
const recipientEmail = TEST_MODE 
  ? 'test@yovoiz.ci' 
  : user.email;
```

---

## 📊 STATISTIQUES & MONITORING

### Suivi des envois

Créez une table de logs :

```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  email_type VARCHAR(50),
  status VARCHAR(20), -- 'sent', 'failed', 'pending'
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Dashboard de monitoring

```typescript
// Récupérer les statistiques
const stats = await supabase
  .from('email_logs')
  .select('email_type, status')
  .gte('sent_at', new Date(Date.now() - 7*24*60*60*1000));

// Calculer les taux de succès
const successRate = stats.filter(s => s.status === 'sent').length / stats.length;
```

---

## 🎯 ROADMAP FUTURE

### Phase 2 : Templates personnalisables

- Permettre aux admins de modifier les templates
- Variables dynamiques dans les emails
- Traductions multilingues

### Phase 3 : Notifications push

- Notifications mobiles (FCM)
- Notifications web (Web Push API)
- SMS pour événements critiques

### Phase 4 : Intelligence

- Fréquence optimale d'envoi (éviter spam)
- Personnalisation par machine learning
- A/B testing des templates

---

## 📞 SUPPORT

**Questions ?** Contactez l'équipe dev Yo!Voiz  
**Email** : dev@yovoiz.ci  
**Documentation** : https://docs.yovoiz.ci

---

**Document créé le 15 février 2026**  
**Version 1.0 - Système complet de 44 notifications**
