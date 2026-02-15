// ================================================
// SYSTÈME DE NOTIFICATIONS EMAIL COMPLET - YO!VOIZ
// ================================================
// 44 types de notifications implémentées
// Date : 15 Février 2026
// ================================================

const EDGE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email-notification`;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ================================================
// TYPES
// ================================================
type NotificationType = 
  // Cycle de vie des demandes
  | 'request_submitted'
  | 'request_validated'
  | 'request_rejected'
  | 'request_expired'
  | 'request_cancelled'
  
  // Cycle de vie des offres
  | 'service_offer_submitted'
  | 'service_offer_validated'
  | 'service_offer_rejected'
  
  // Négociations
  | 'new_proposal'
  | 'negotiation_accepted'
  | 'negotiation_counter_offer'
  | 'negotiation_declined'
  | 'negotiation_expired'
  
  // Missions/Prestations
  | 'mission_started'
  | 'mission_completed'
  | 'mission_validated'
  | 'mission_disputed'
  | 'mission_cancelled'
  
  // Avis
  | 'review_request'
  | 'review_received'
  | 'review_response'
  
  // Paiements
  | 'payment_pending'
  | 'payment_received'
  | 'payment_failed'
  | 'refund_initiated'
  | 'refund_completed'
  | 'invoice_sent'
  
  // Abonnement Pro
  | 'subscription_activated'
  | 'subscription_expiring'
  | 'subscription_expired'
  | 'subscription_renewed'
  
  // Messagerie
  | 'new_message'
  
  // Sécurité & Compte
  | 'welcome_email'
  | 'email_verification'
  | 'password_reset'
  | 'password_changed'
  | 'profile_verified'
  | 'suspicious_activity'
  | 'account_deleted'
  
  // Admin
  | 'new_user_registered'
  | 'new_request_pending'
  | 'new_service_offer_pending'
  | 'dispute_opened'
  
  // Marketing
  | 'inactive_user_reminder'
  | 'newsletter'
  | 'promo_code'
  
  // Transactions
  | 'transaction_completed_client'
  | 'transaction_completed_provider';

interface EmailNotificationData {
  type: NotificationType;
  userId: string;
  data: Record<string, any>;
}

// ================================================
// FONCTION GÉNÉRIQUE D'ENVOI
// ================================================
async function sendEmailNotification(
  type: NotificationType,
  userId: string,
  data: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`📧 Envoi notification email: ${type} pour ${userId}`);

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ type, userId, data })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur envoi email (${response.status}):`, errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    console.log(`✅ Email envoyé avec succès:`, result);
    return { success: true };

  } catch (error: any) {
    console.error('❌ Erreur appel Edge Function:', error);
    return { success: false, error: error.message };
  }
}

// ================================================
// 1. CYCLE DE VIE DES DEMANDES
// ================================================

export async function sendRequestSubmittedEmail(userId: string, data: {
  requestId: string;
  title: string;
  category: string;
  createdAt?: Date | string;
}) {
  return sendEmailNotification('request_submitted', userId, data);
}

export async function sendRequestValidatedEmail(userId: string, data: {
  requestId: string;
  title: string;
  category: string;
  createdAt?: Date | string;
}) {
  return sendEmailNotification('request_validated', userId, data);
}

export async function sendRequestRejectedEmail(userId: string, data: {
  requestId: string;
  title: string;
  reason?: string;
}) {
  return sendEmailNotification('request_rejected', userId, data);
}

export async function sendRequestExpiredEmail(userId: string, data: {
  requestId: string;
  title: string;
  daysLeft: number;
  proposalsCount?: number;
  viewsCount?: number;
}) {
  return sendEmailNotification('request_expired', userId, data);
}

export async function sendRequestCancelledEmail(userId: string, data: {
  requestId: string;
  title: string;
}) {
  return sendEmailNotification('request_cancelled', userId, data);
}

// ================================================
// 2. CYCLE DE VIE DES OFFRES
// ================================================

export async function sendServiceOfferSubmittedEmail(userId: string, data: {
  offerId: string;
  title: string;
}) {
  return sendEmailNotification('service_offer_submitted', userId, data);
}

export async function sendServiceOfferValidatedEmail(userId: string, data: {
  offerId: string;
  title: string;
}) {
  return sendEmailNotification('service_offer_validated', userId, data);
}

export async function sendServiceOfferRejectedEmail(userId: string, data: {
  offerId: string;
  title: string;
  reason?: string;
}) {
  return sendEmailNotification('service_offer_rejected', userId, data);
}

// ================================================
// 3. NÉGOCIATIONS
// ================================================

export async function sendNewProposalEmail(userId: string, data: {
  negotiationId: string;
  providerName: string;
  amount: number;
  message?: string;
}) {
  return sendEmailNotification('new_proposal', userId, data);
}

export async function sendNegotiationAcceptedEmail(userId: string, data: {
  negotiationId: string;
  missionId: string;
  clientName: string;
  amount: number;
}) {
  return sendEmailNotification('negotiation_accepted', userId, data);
}

export async function sendNegotiationCounterOfferEmail(userId: string, data: {
  negotiationId: string;
  senderName: string;
  amount: number;
  previousAmount?: number;
  message?: string;
}) {
  return sendEmailNotification('negotiation_counter_offer', userId, data);
}

export async function sendNegotiationDeclinedEmail(userId: string, data: {
  negotiationId: string;
}) {
  return sendEmailNotification('negotiation_declined', userId, data);
}

export async function sendNegotiationExpiredEmail(userId: string, data: {
  negotiationId: string;
  title: string;
}) {
  return sendEmailNotification('negotiation_expired', userId, data);
}

// ================================================
// 4. MISSIONS / PRESTATIONS
// ================================================

export async function sendMissionStartedEmail(userId: string, data: {
  missionId: string;
  title: string;
  providerName: string;
  providerPhone?: string;
}) {
  return sendEmailNotification('mission_started', userId, data);
}

export async function sendMissionCompletedEmail(userId: string, data: {
  missionId: string;
  providerName: string;
}) {
  return sendEmailNotification('mission_completed', userId, data);
}

export async function sendMissionValidatedEmail(userId: string, data: {
  missionId: string;
  clientName: string;
  amount: number;
}) {
  return sendEmailNotification('mission_validated', userId, data);
}

export async function sendMissionDisputedEmail(userId: string, data: {
  missionId: string;
  title: string;
  reason?: string;
}) {
  return sendEmailNotification('mission_disputed', userId, data);
}

export async function sendMissionCancelledEmail(userId: string, data: {
  missionId: string;
  title: string;
  reason?: string;
  refundAmount?: number;
}) {
  return sendEmailNotification('mission_cancelled', userId, data);
}

// ================================================
// 5. AVIS / RÉPUTATION
// ================================================

export async function sendReviewRequestEmail(userId: string, data: {
  missionId: string;
  providerName: string;
}) {
  return sendEmailNotification('review_request', userId, data);
}

export async function sendReviewReceivedEmail(userId: string, data: {
  reviewerName: string;
  rating: number;
  comment?: string;
}) {
  return sendEmailNotification('review_received', userId, data);
}

export async function sendReviewResponseEmail(userId: string, data: {
  providerId: string;
  providerName: string;
  response: string;
}) {
  return sendEmailNotification('review_response', userId, data);
}

// ================================================
// 6. PAIEMENTS & FACTURATION
// ================================================

export async function sendPaymentPendingEmail(userId: string, data: {
  paymentId: string;
  providerName: string;
  amount: number;
  expiryDate?: Date | string;
}) {
  return sendEmailNotification('payment_pending', userId, data);
}

export async function sendPaymentReceivedEmail(userId: string, data: {
  missionId: string;
  reference: string;
  amount: number;
  providerName: string;
  paidAt: Date | string;
}) {
  return sendEmailNotification('payment_received', userId, data);
}

export async function sendPaymentFailedEmail(userId: string, data: {
  paymentId: string;
  amount: number;
  errorMessage?: string;
}) {
  return sendEmailNotification('payment_failed', userId, data);
}

export async function sendRefundInitiatedEmail(userId: string, data: {
  reference: string;
  amount: number;
  reason: string;
}) {
  return sendEmailNotification('refund_initiated', userId, data);
}

export async function sendRefundCompletedEmail(userId: string, data: {
  reference: string;
  amount: number;
  completedAt: Date | string;
}) {
  return sendEmailNotification('refund_completed', userId, data);
}

export async function sendInvoiceSentEmail(userId: string, data: {
  invoiceId: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  date: Date | string;
}) {
  return sendEmailNotification('invoice_sent', userId, data);
}

// ================================================
// 7. ABONNEMENT PRO
// ================================================

export async function sendSubscriptionActivatedEmail(userId: string, data: {
  subscriptionId: string;
}) {
  return sendEmailNotification('subscription_activated', userId, data);
}

export async function sendSubscriptionExpiringEmail(userId: string, data: {
  expiryDate: Date | string;
}) {
  return sendEmailNotification('subscription_expiring', userId, data);
}

export async function sendSubscriptionExpiredEmail(userId: string, data: {
  subscriptionId: string;
}) {
  return sendEmailNotification('subscription_expired', userId, data);
}

export async function sendSubscriptionRenewedEmail(userId: string, data: {
  subscriptionId: string;
  nextRenewalDate: Date | string;
  amount: number;
}) {
  return sendEmailNotification('subscription_renewed', userId, data);
}

// ================================================
// 8. MESSAGERIE
// ================================================

export async function sendNewMessageEmail(userId: string, data: {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt?: Date | string;
}) {
  return sendEmailNotification('new_message', userId, {
    ...data,
    content: data.content.substring(0, 150),
    createdAt: data.createdAt || new Date().toISOString()
  });
}

// ================================================
// 9. SÉCURITÉ & COMPTE
// ================================================

export async function sendWelcomeEmail(userId: string, data?: {}) {
  return sendEmailNotification('welcome_email', userId, data || {});
}

export async function sendEmailVerificationEmail(userId: string, data: {
  verificationLink: string;
}) {
  return sendEmailNotification('email_verification', userId, data);
}

export async function sendPasswordResetEmail(userId: string, data: {
  resetLink: string;
}) {
  return sendEmailNotification('password_reset', userId, data);
}

export async function sendPasswordChangedEmail(userId: string, data?: {}) {
  return sendEmailNotification('password_changed', userId, data || {});
}

export async function sendProfileVerifiedEmail(userId: string, data: {
  firstName: string;
  lastName: string;
  verifiedAt?: Date | string;
}) {
  return sendEmailNotification('profile_verified', userId, {
    firstName: data.firstName,
    lastName: data.lastName,
    verifiedAt: data.verifiedAt || new Date().toISOString()
  });
}

export async function sendSuspiciousActivityEmail(userId: string, data: {
  activityType: string;
  detectedAt: Date | string;
  location?: string;
}) {
  return sendEmailNotification('suspicious_activity', userId, data);
}

export async function sendAccountDeletedEmail(userId: string, data?: {}) {
  return sendEmailNotification('account_deleted', userId, data || {});
}

// ================================================
// 10. ADMIN / MODÉRATION
// ================================================

export async function sendNewUserRegisteredEmail(adminUserId: string, data: {
  userId: string;
  userName: string;
  userEmail: string;
}) {
  return sendEmailNotification('new_user_registered', adminUserId, data);
}

export async function sendNewRequestPendingEmail(adminUserId: string, data: {
  requestId: string;
  title: string;
  userName: string;
  createdAt: Date | string;
}) {
  return sendEmailNotification('new_request_pending', adminUserId, data);
}

export async function sendNewServiceOfferPendingEmail(adminUserId: string, data: {
  offerId: string;
  title: string;
  providerName: string;
  createdAt: Date | string;
}) {
  return sendEmailNotification('new_service_offer_pending', adminUserId, data);
}

export async function sendDisputeOpenedEmail(adminUserId: string, data: {
  disputeId: string;
  missionTitle: string;
  clientName: string;
  providerName: string;
  amount: number;
}) {
  return sendEmailNotification('dispute_opened', adminUserId, data);
}

// ================================================
// 11. MARKETING & ENGAGEMENT
// ================================================

export async function sendInactiveUserReminderEmail(userId: string, data: {
  newRequestsCount?: number;
  newProvidersCount?: number;
}) {
  return sendEmailNotification('inactive_user_reminder', userId, data);
}

export async function sendNewsletterEmail(userId: string, data: {
  subject: string;
  content: string;
}) {
  return sendEmailNotification('newsletter', userId, data);
}

export async function sendPromoCodeEmail(userId: string, data: {
  promoTitle: string;
  promoCode: string;
  discount: string;
  expiryDate: Date | string;
}) {
  return sendEmailNotification('promo_code', userId, data);
}

// ================================================
// 12. TRANSACTIONS
// ================================================

export async function sendTransactionCompletedClientEmail(userId: string, data: {
  missionId: string;
  transactionId: string;
  providerName: string;
  amount: number;
  reference: string;
  completedAt?: Date | string;
}) {
  return sendEmailNotification('transaction_completed_client', userId, {
    ...data,
    completedAt: data.completedAt || new Date().toISOString()
  });
}

export async function sendTransactionCompletedProviderEmail(userId: string, data: {
  missionId: string;
  transactionId: string;
  clientName: string;
  amount: number;
  reference: string;
  completedAt?: Date | string;
}) {
  return sendEmailNotification('transaction_completed_provider', userId, {
    ...data,
    completedAt: data.completedAt || new Date().toISOString()
  });
}

// ================================================
// FONCTION DE TEST
// ================================================
export async function testEmailNotification(userId: string) {
  console.log('🧪 Test de notification email...');
  
  const result = await sendWelcomeEmail(userId);

  if (result.success) {
    console.log('✅ Test réussi ! Vérifiez votre email.');
  } else {
    console.error('❌ Test échoué:', result.error);
  }

  return result;
}
