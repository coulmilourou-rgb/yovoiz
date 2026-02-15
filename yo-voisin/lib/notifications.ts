import { supabase } from './supabase';

export interface DevisNotificationData {
  client_id: string;
  client_email: string;
  client_name: string;
  devis_id: string;
  reference: string;
  amount: number;
  items: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  issue_date: string;
  expiry_date?: string;
}

export interface FactureNotificationData {
  client_id: string;
  client_email: string;
  client_name: string;
  facture_id: string;
  reference: string;
  amount: number;
  items: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  issue_date: string;
  due_date?: string;
}

/**
 * Envoie un devis au client : Message interne + Email de notification
 */
export async function sendDevisToClient(
  providerId: string,
  providerName: string,
  data: DevisNotificationData
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Créer le message dans la messagerie interne
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: providerId,
        receiver_id: data.client_id,
        content: `📄 **Nouveau Devis ${data.reference}**\n\nBonjour,\n\nVeuillez trouver ci-joint le devis pour un montant de **${data.amount.toLocaleString('fr-FR')} FCFA**.\n\nDate d'expiration: ${data.expiry_date ? new Date(data.expiry_date).toLocaleDateString('fr-FR') : 'Non spécifiée'}\n\nCordialement,\n${providerName}`,
        type: 'devis',
        metadata: {
          devis_id: data.devis_id,
          reference: data.reference,
          amount: data.amount,
          items: data.items
        }
      });

    if (messageError) {
      throw new Error(`Erreur envoi message: ${messageError.message}`);
    }

    // 2. Créer une notification interne
    await supabase.from('notifications').insert({
      user_id: data.client_id,
      title: `Nouveau devis de ${providerName}`,
      message: `Vous avez reçu un devis (${data.reference}) d'un montant de ${data.amount.toLocaleString('fr-FR')} FCFA`,
      type: 'devis',
      link: '/messages',
      metadata: {
        devis_id: data.devis_id,
        provider_id: providerId
      }
    });

    // 3. Envoyer l'email de notification
    const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to: data.client_email,
        subject: `📄 Nouveau devis de ${providerName} - ${data.reference}`,
        type: 'devis',
        document: {
          reference: data.reference,
          amount: data.amount,
          provider_name: providerName,
          provider_email: '', // Non nécessaire dans l'email
          items: data.items,
          issue_date: data.issue_date,
          expiry_date: data.expiry_date
        }
      }
    });

    if (emailError) {
      console.warn('⚠️ Email non envoyé:', emailError);
      // On ne bloque pas si l'email échoue, le message interne est envoyé
    }

    return {
      success: true,
      message: 'Devis envoyé avec succès dans la messagerie et par email'
    };

  } catch (error: any) {
    console.error('❌ Erreur sendDevisToClient:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de l\'envoi du devis'
    };
  }
}

/**
 * Envoie une facture au client : Message interne + Email de notification
 */
export async function sendFactureToClient(
  providerId: string,
  providerName: string,
  data: FactureNotificationData
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Créer le message dans la messagerie interne
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: providerId,
        receiver_id: data.client_id,
        content: `🧾 **Nouvelle Facture ${data.reference}**\n\nBonjour,\n\nVeuillez trouver ci-joint la facture pour un montant de **${data.amount.toLocaleString('fr-FR')} FCFA**.\n\nDate d'échéance: ${data.due_date ? new Date(data.due_date).toLocaleDateString('fr-FR') : 'Non spécifiée'}\n\nMerci de procéder au règlement dans les meilleurs délais.\n\nCordialement,\n${providerName}`,
        type: 'facture',
        metadata: {
          facture_id: data.facture_id,
          reference: data.reference,
          amount: data.amount,
          items: data.items
        }
      });

    if (messageError) {
      throw new Error(`Erreur envoi message: ${messageError.message}`);
    }

    // 2. Créer une notification interne
    await supabase.from('notifications').insert({
      user_id: data.client_id,
      title: `Nouvelle facture de ${providerName}`,
      message: `Vous avez reçu une facture (${data.reference}) d'un montant de ${data.amount.toLocaleString('fr-FR')} FCFA`,
      type: 'facture',
      link: '/messages',
      metadata: {
        facture_id: data.facture_id,
        provider_id: providerId
      }
    });

    // 3. Envoyer l'email de notification
    const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to: data.client_email,
        subject: `🧾 Nouvelle facture de ${providerName} - ${data.reference}`,
        type: 'facture',
        document: {
          reference: data.reference,
          amount: data.amount,
          provider_name: providerName,
          provider_email: '',
          items: data.items,
          issue_date: data.issue_date,
          due_date: data.due_date
        }
      }
    });

    if (emailError) {
      console.warn('⚠️ Email non envoyé:', emailError);
    }

    return {
      success: true,
      message: 'Facture envoyée avec succès dans la messagerie et par email'
    };

  } catch (error: any) {
    console.error('❌ Erreur sendFactureToClient:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de l\'envoi de la facture'
    };
  }
}

/**
 * Envoie une relance de facture
 */
export async function sendFactureRelance(
  providerId: string,
  providerName: string,
  data: FactureNotificationData
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Message dans la messagerie
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: providerId,
        receiver_id: data.client_id,
        content: `⚠️ **Relance Facture ${data.reference}**\n\nBonjour,\n\nNous vous rappelons que la facture d'un montant de **${data.amount.toLocaleString('fr-FR')} FCFA** est toujours en attente de règlement.\n\nDate d'échéance: ${data.due_date ? new Date(data.due_date).toLocaleDateString('fr-FR') : 'Dépassée'}\n\nMerci de régulariser votre situation.\n\nCordialement,\n${providerName}`,
        type: 'relance',
        metadata: {
          facture_id: data.facture_id,
          reference: data.reference,
          amount: data.amount
        }
      });

    if (messageError) {
      throw new Error(`Erreur envoi message: ${messageError.message}`);
    }

    // 2. Notification
    await supabase.from('notifications').insert({
      user_id: data.client_id,
      title: `⚠️ Relance de ${providerName}`,
      message: `Facture ${data.reference} en attente de paiement`,
      type: 'relance',
      link: '/messages',
      metadata: {
        facture_id: data.facture_id,
        provider_id: providerId
      }
    });

    // 3. Email
    const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to: data.client_email,
        subject: `⚠️ Relance facture ${data.reference} - ${providerName}`,
        type: 'relance',
        document: {
          reference: data.reference,
          amount: data.amount,
          provider_name: providerName,
          provider_email: '',
          items: data.items,
          issue_date: data.issue_date,
          due_date: data.due_date
        }
      }
    });

    if (emailError) {
      console.warn('⚠️ Email non envoyé:', emailError);
    }

    return {
      success: true,
      message: 'Relance envoyée avec succès'
    };

  } catch (error: any) {
    console.error('❌ Erreur sendFactureRelance:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de l\'envoi de la relance'
    };
  }
}

/**
 * Récupère les notifications d'un utilisateur
 */
export async function fetchNotifications(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur fetchNotifications:', error);
    return [];
  }
}

/**
 * Marque une notification comme lue
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erreur markNotificationAsRead:', error);
    return { success: false };
  }
}

/**
 * Marque toutes les notifications comme lues
 */
export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erreur markAllNotificationsAsRead:', error);
    return { success: false };
  }
}

/**
 * Compte le nombre de notifications non lues
 */
export async function countUnreadNotifications(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Erreur countUnreadNotifications:', error);
    return 0;
  }
}

/**
 * Supprime une notification
 */
export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur deleteNotification:', error);
    return false;
  }
}
