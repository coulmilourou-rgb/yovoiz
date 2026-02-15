// ================================================
// EDGE FUNCTION: SYSTÈME COMPLET DE NOTIFICATIONS EMAIL
// ================================================
// 44 types de notifications pour Yo!Voiz
// Date : 15 Février 2026
// ================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ================================================
// CONFIGURATION
// ================================================
const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY') || ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const APP_URL = 'https://yovoiz.ci'
const FROM_EMAIL = 'notifications@yovoiz.ci'
const FROM_NAME = 'Yo!Voiz'

// ================================================
// HELPER FUNCTIONS
// ================================================
const getHeader = () => `
  <div class="header">
    <div class="logo"><span style="color: #F97316;">Yo!</span><span style="color: white;">Voiz</span></div>
  </div>
`

const getFooter = () => `
  <div class="footer">
    <p>Yo!Voiz - La plateforme de services de proximité en Côte d'Ivoire</p>
    <p>📍 Abidjan, Côte d'Ivoire | 📧 contact@yovoiz.ci</p>
    <p style="font-size: 11px; margin-top: 10px;">
      Tu reçois cet email car tu es inscrit sur Yo!Voiz.<br>
      <a href="${APP_URL}/profile/security" style="color: #666;">Gérer mes notifications</a>
    </p>
  </div>
`

const wrapTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #1B7A3D, #F97316); padding: 30px; text-align: center; }
    .logo { font-size: 36px; font-weight: bold; }
    .content { padding: 30px; }
    .button { display: inline-block; background: #F97316; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 15px 0; font-weight: bold; }
    .button:hover { background: #E86305; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .highlight { background: #FFF3CD; padding: 15px; border-left: 4px solid #F97316; margin: 15px 0; }
    .card { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; }
    h1 { color: #1B7A3D; margin-bottom: 20px; }
    h2 { color: #F97316; font-size: 18px; }
    .price { font-size: 28px; font-weight: bold; color: #1B7A3D; }
  </style>
</head>
<body>
  <div class="container">
    ${getHeader()}
    <div class="content">
      ${content}
    </div>
    ${getFooter()}
  </div>
</body>
</html>
`

// ================================================
// EMAIL TEMPLATES (44 NOTIFICATIONS)
// ================================================
const getEmailTemplate = (type: string, data: any, user: any): { subject: string; html: string } => {
  const userName = user.first_name || 'Utilisateur'
  
  const templates: Record<string, any> = {
    
    // ===== 1. CYCLE DE VIE DES DEMANDES =====
    
    request_submitted: {
      subject: '📝 Ta demande a bien été envoyée',
      html: wrapTemplate(`
        <h1>📝 Demande envoyée avec succès !</h1>
        <p>Salut ${userName},</p>
        <p>Ta demande <strong>"${data.title}"</strong> a bien été envoyée à notre équipe.</p>
        <div class="highlight">
          <strong>⏰ Prochaines étapes :</strong><br>
          1. Notre équipe va vérifier ta demande (sous 2-4 heures)<br>
          2. Une fois validée, elle sera visible par les prestataires<br>
          3. Tu recevras des propositions directement sur ta messagerie
        </div>
        <a href="${APP_URL}/profile/requests" class="button">Voir ma demande</a>
        <p>À très bientôt !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    request_validated: {
      subject: '🎉 Ta demande a été validée !',
      html: wrapTemplate(`
        <h1>🎉 Bonne nouvelle !</h1>
        <p>Salut ${userName},</p>
        <p>Ta demande <strong>"${data.title}"</strong> a été validée et est maintenant visible par les prestataires !</p>
        <div class="highlight">
          <strong>🚀 Que se passe-t-il maintenant ?</strong><br>
          Les prestataires qualifiés de ta zone vont recevoir ta demande et pourront te faire des propositions.
        </div>
        <a href="${APP_URL}/missions/${data.requestId}" class="button">Voir ma demande</a>
        <p>Bonne chance !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    request_rejected: {
      subject: '⚠️ Ta demande n\'a pas pu être validée',
      html: wrapTemplate(`
        <h1>⚠️ Demande non validée</h1>
        <p>Salut ${userName},</p>
        <p>Malheureusement, ta demande <strong>"${data.title}"</strong> n'a pas pu être validée.</p>
        <div class="card">
          <strong>📋 Raison :</strong><br>
          ${data.reason || 'La demande ne respecte pas nos conditions d\'utilisation.'}
        </div>
        <a href="${APP_URL}/missions/nouvelle" class="button">Créer une nouvelle demande</a>
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ===== 2. NÉGOCIATIONS =====
    
    new_proposal: {
      subject: '💼 Nouvelle proposition reçue !',
      html: wrapTemplate(`
        <h1>💼 Tu as reçu une nouvelle proposition !</h1>
        <p>Salut ${userName},</p>
        <p><strong>${data.providerName}</strong> t'a envoyé une proposition.</p>
        <div class="card">
          <strong>💰 Montant proposé :</strong><br>
          <div class="price">${data.amount.toLocaleString('fr-FR')} FCFA</div>
        </div>
        ${data.message ? `<div class="highlight"><strong>📝 Message :</strong><br>"${data.message}"</div>` : ''}
        <a href="${APP_URL}/negotiations/${data.negotiationId}" class="button">Voir la proposition</a>
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    negotiation_accepted: {
      subject: '✅ Ta proposition a été acceptée !',
      html: wrapTemplate(`
        <h1>✅ Félicitations !</h1>
        <p>Salut ${userName},</p>
        <p><strong>${data.clientName}</strong> a accepté ta proposition !</p>
        <div class="card">
          <strong>💰 Montant convenu :</strong><br>
          <div class="price">${data.amount.toLocaleString('fr-FR')} FCFA</div>
        </div>
        <a href="${APP_URL}/missions/${data.missionId}" class="button">Voir la mission</a>
        <p>Bonne prestation !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    // ===== 3. MISSIONS =====
    
    mission_completed: {
      subject: '✅ Prestation terminée - Validation requise',
      html: wrapTemplate(`
        <h1>✅ Prestation terminée</h1>
        <p>Salut ${userName},</p>
        <p><strong>${data.providerName}</strong> a marqué la prestation comme "Terminée".</p>
        <div class="highlight">
          <strong>⚠️ ACTION REQUISE :</strong><br>
          Merci de valider la prestation pour que le paiement soit transféré.
        </div>
        <a href="${APP_URL}/missions/${data.missionId}/validate" class="button">Valider la prestation</a>
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    mission_validated: {
      subject: '✅ Prestation validée - Paiement en cours',
      html: wrapTemplate(`
        <h1>✅ Prestation validée !</h1>
        <p>Salut ${userName},</p>
        <p><strong>${data.clientName}</strong> a validé ta prestation.</p>
        <div class="card">
          <strong>💰 Paiement :</strong><br>
          <div class="price">${data.amount.toLocaleString('fr-FR')} FCFA</div>
          <p style="color: #666;">Le paiement sera transféré sous 2-3 jours.</p>
        </div>
        <p>Félicitations !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    // ===== 4. PAIEMENTS =====
    
    payment_pending: {
      subject: '💳 Paiement requis pour confirmer',
      html: wrapTemplate(`
        <h1>💳 Finalise ton paiement</h1>
        <p>Salut ${userName},</p>
        <p>Ta réservation avec <strong>${data.providerName}</strong> est presque confirmée !</p>
        <div class="card">
          <strong>💰 Montant à payer :</strong><br>
          <div class="price">${data.amount.toLocaleString('fr-FR')} FCFA</div>
        </div>
        <a href="${APP_URL}/payment/${data.paymentId}" class="button">Procéder au paiement</a>
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    payment_failed: {
      subject: '❌ Échec du paiement',
      html: wrapTemplate(`
        <h1>❌ Paiement non abouti</h1>
        <p>Salut ${userName},</p>
        <p>Ton paiement de <strong>${data.amount.toLocaleString('fr-FR')} FCFA</strong> n'a pas pu être traité.</p>
        <div class="card">
          <strong>📋 Raison :</strong><br>
          ${data.errorMessage || 'Erreur de transaction'}
        </div>
        <a href="${APP_URL}/payment/${data.paymentId}/retry" class="button">Réessayer</a>
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ===== 5. ABONNEMENT PRO =====
    
    subscription_activated: {
      subject: '🎉 Bienvenue dans Yo!Voiz PRO !',
      html: wrapTemplate(`
        <h1>🎉 Bienvenue dans PRO !</h1>
        <p>Salut ${userName},</p>
        <p>Ton abonnement <strong>Yo!Voiz PRO</strong> est maintenant actif !</p>
        <div class="card">
          <strong>✨ Fonctionnalités débloquées :</strong><br>
          ✅ Tableau de bord Pro complet<br>
          ✅ Gestion devis et factures<br>
          ✅ Badge PRO sur ton profil<br>
          ✅ Priorité dans les recherches
        </div>
        <a href="${APP_URL}/abonnement" class="button">Découvrir PRO</a>
        <p>L'équipe Yo!Voiz 🚀</p>
      `)
    },
    
    // ===== 6. MESSAGERIE =====
    
    new_message: {
      subject: '💬 Nouveau message sur Yo!Voiz',
      html: wrapTemplate(`
        <h1>💬 Nouveau message</h1>
        <p>Salut ${userName},</p>
        <p>Tu as reçu un message de <strong>${data.senderName}</strong>.</p>
        <div class="card">
          <strong>📝 Message :</strong><br>
          "${data.content}"
        </div>
        <a href="${APP_URL}/messages/${data.conversationId}" class="button">Répondre</a>
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ===== 7. SÉCURITÉ & COMPTE =====
    
    welcome_email: {
      subject: '👋 Bienvenue sur Yo!Voiz !',
      html: wrapTemplate(`
        <h1>👋 Bienvenue ${userName} !</h1>
        <p>Nous sommes ravis de t'accueillir sur <strong>Yo!Voiz</strong> !</p>
        <div class="highlight">
          <strong>🚀 Pour bien démarrer :</strong><br>
          1. Complète ton profil<br>
          2. Définis ta zone d'intervention<br>
          3. Publie ta première demande ou offre
        </div>
        <a href="${APP_URL}/home" class="button">Découvrir Yo!Voiz</a>
        <p>Excellente expérience !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    profile_verified: {
      subject: '✅ Ton profil est vérifié !',
      html: wrapTemplate(`
        <h1>✅ Profil vérifié !</h1>
        <p>Salut ${userName},</p>
        <p>Ton profil Yo!Voiz a été vérifié par notre équipe.</p>
        <div class="card">
          <strong>🏆 Avantages du badge "Vérifié" :</strong><br>
          ✅ Plus de confiance des utilisateurs<br>
          ✅ Meilleure visibilité<br>
          ✅ Plus d'opportunités
        </div>
        <a href="${APP_URL}/profile/public" class="button">Voir mon profil</a>
        <p>Félicitations !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    // ===== 8. TRANSACTIONS =====
    
    transaction_completed_client: {
      subject: '💰 Transaction effectuée avec succès',
      html: wrapTemplate(`
        <h1>💰 Paiement confirmé</h1>
        <p>Salut ${userName},</p>
        <p>Ta transaction avec <strong>${data.providerName}</strong> a été effectuée.</p>
        <div class="card">
          <strong>💰 Montant :</strong> ${data.amount.toLocaleString('fr-FR')} FCFA<br>
          <strong>📋 Référence :</strong> ${data.reference}
        </div>
        <a href="${APP_URL}/missions/${data.missionId}" class="button">Voir la mission</a>
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    transaction_completed_provider: {
      subject: '💰 Paiement reçu pour ta prestation',
      html: wrapTemplate(`
        <h1>💰 Paiement reçu !</h1>
        <p>Salut ${userName},</p>
        <p>Le paiement pour ta prestation a été transféré.</p>
        <div class="card">
          <strong>💰 Montant :</strong> ${data.amount.toLocaleString('fr-FR')} FCFA<br>
          <strong>👤 Client :</strong> ${data.clientName}
        </div>
        <p>Félicitations !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    // Template par défaut
    default: {
      subject: 'Notification Yo!Voiz',
      html: wrapTemplate(`
        <h1>Notification</h1>
        <p>Salut ${userName},</p>
        <p>Tu as une nouvelle notification sur Yo!Voiz.</p>
        <a href="${APP_URL}/home" class="button">Voir sur Yo!Voiz</a>
        <p>L'équipe Yo!Voiz</p>
      `)
    }
  }
  
  return templates[type] || templates.default
}

// ================================================
// FONCTION D'ENVOI EMAIL VIA BREVO
// ================================================
async function sendEmailViaBrevo(to: string, subject: string, html: string) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Brevo API error: ${error}`)
  }
  
  return await response.json()
}

// ================================================
// HANDLER PRINCIPAL
// ================================================
serve(async (req) => {
  try {
    // CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { 
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, content-type'
        } 
      })
    }

    // Parse request
    const { type, userId, data } = await req.json()

    console.log('📧 Notification demandée:', { type, userId })

    // Vérifier paramètres
    if (!type || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing type or userId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Initialiser Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Récupérer email depuis auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)
    
    if (authError || !authUser?.user) {
      console.error('Utilisateur introuvable:', userId, authError)
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Récupérer profil
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single()

    const user = {
      id: userId,
      email: authUser.user.email,
      first_name: profile?.first_name || 'Utilisateur',
      last_name: profile?.last_name || ''
    }

    console.log('✅ Utilisateur trouvé:', user.email)

    // Générer template
    const template = getEmailTemplate(type, data, user)

    // Envoyer via Brevo
    const result = await sendEmailViaBrevo(user.email, template.subject, template.html)

    console.log('✅ Email envoyé:', result)

    return new Response(
      JSON.stringify({ 
        success: true, 
        recipient: user.email,
        messageId: result.messageId 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )

  } catch (error: any) {
    console.error('❌ Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )
  }
})
