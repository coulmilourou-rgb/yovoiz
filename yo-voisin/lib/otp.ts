/**
 * Helpers pour l'envoi de codes OTP par WhatsApp ou SMS
 * En production, utiliser WhatsApp (moins cher) via Twilio
 */

/**
 * Envoie un code OTP par WhatsApp
 * @param phone Numéro de téléphone au format +225XXXXXXXXXX
 * @param code Code OTP à 6 chiffres
 */
export async function sendOTP(phone: string, code: string): Promise<void> {
  const message = `🔐 Yo! Voiz\n\nVotre code de vérification est : *${code}*\n\nValide pendant 10 minutes.\n\nNe partagez ce code avec personne.`;

  // En développement, simuler l'envoi
  if (process.env.NODE_ENV === 'development') {
    console.log(`📱 WhatsApp simulé vers ${phone}:\n${message}`);
    return;
  }

  // === PRODUCTION : WhatsApp via Twilio (RECOMMANDÉ) ===
  
  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: `whatsapp:${phone}`,  // Format WhatsApp
        From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,  // Votre numéro WhatsApp Business
        Body: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erreur Twilio WhatsApp:', error);
      throw new Error('Failed to send WhatsApp message via Twilio');
    }

    console.log('✅ WhatsApp OTP envoyé avec succès');
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    throw error;
  }

  // === ALTERNATIVE : Meta WhatsApp Business API ===
  // Décommenter si vous utilisez directement l'API Meta
  /*
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone.replace('+', ''),  // Sans le +
        type: 'text',
        text: {
          body: message
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erreur Meta WhatsApp:', error);
      throw new Error('Failed to send WhatsApp message via Meta');
    }

    console.log('✅ WhatsApp OTP envoyé avec succès');
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    throw error;
  }
  */

  // === FALLBACK SMS (Si WhatsApp échoue) ===
  // Décommenter pour activer le fallback SMS automatique
  /*
  try {
    // Tentative WhatsApp d'abord
    await sendWhatsAppOTP(phone, code);
  } catch (whatsappError) {
    console.warn('WhatsApp failed, falling back to SMS:', whatsappError);
    // Fallback vers SMS
    await sendSMSOTP(phone, code);
  }
  */
}

/**
 * Vérifie si un email ou un numéro de téléphone existe déjà
 * @param email Email à vérifier
 * @param phone Téléphone à vérifier (format +225XXXXXXXXXX)
 * @returns {emailExists: boolean, phoneExists: boolean}
 */
export async function checkDuplicateContact(
  email: string,
  phone: string
): Promise<{ emailExists: boolean; phoneExists: boolean }> {
  try {
    // Normaliser le téléphone au format international
    const normalizedPhone = phone.startsWith('+225') ? phone : `+225${phone.replace(/\s/g, '')}`;

    const response = await fetch('/api/auth/check-duplicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone: normalizedPhone }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la vérification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking duplicates:', error);
    throw error;
  }
}

/**
 * Génère un code OTP aléatoire à 6 chiffres
 * NOTE: Cette fonction n'est plus utilisée car la génération se fait en base de données
 * via la fonction PostgreSQL generate_otp_code()
 */
export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Vérifie un code OTP
 * @param phone Numéro de téléphone (+225XXXXXXXXXX)
 * @param code Code à 6 chiffres
 */
export async function verifyOTP(
  phone: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.error || 'Erreur de vérification' };
    }

    return { success: true, message: 'Code vérifié avec succès' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, message: 'Une erreur est survenue' };
  }
}

/**
 * Renvoie un code OTP
 * @param userId ID de l'utilisateur (non utilisé actuellement, mais requis par l'interface)
 * @param phone Numéro de téléphone (+225XXXXXXXXXX)
 */
export async function resendOTP(
  userId: string,
  phone: string
): Promise<{ success: boolean; message: string; code?: string }> {
  try {
    const response = await fetch('/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.error || "Erreur d'envoi" };
    }

    return {
      success: true,
      message: 'Code envoyé avec succès',
      code: data.code,
    };
  } catch (error) {
    console.error('Error resending OTP:', error);
    return { success: false, message: 'Une erreur est survenue' };
  }
}
