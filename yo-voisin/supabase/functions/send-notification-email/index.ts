import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface EmailRequest {
  to: string
  subject: string
  type: 'devis' | 'facture' | 'relance'
  document: {
    reference: string
    amount: number
    provider_name: string
    provider_email: string
    items: Array<{
      name: string
      quantity: number
      unit_price: number
      total: number
    }>
    issue_date: string
    expiry_date?: string
    due_date?: string
  }
}

serve(async (req) => {
  try {
    const { to, subject, type, document }: EmailRequest = await req.json()

    // Vérifier que l'utilisateur est authentifié
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Non autorisé')
    }

    // Générer le contenu HTML selon le type
    let htmlContent = ''
    
    if (type === 'devis') {
      htmlContent = generateDevisEmail(document)
    } else if (type === 'facture') {
      htmlContent = generateFactureEmail(document)
    } else if (type === 'relance') {
      htmlContent = generateRelanceEmail(document)
    }

    // Envoi via Resend (ou autre service email)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'notifications@yovoiz.com',
        to: to,
        subject: subject,
        html: htmlContent
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erreur envoi email: ${error}`)
    }

    const result = await response.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email envoyé avec succès',
        email_id: result.id 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

function generateDevisEmail(document: any): string {
  const itemsHtml = document.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.unit_price.toLocaleString('fr-FR')} FCFA</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${item.total.toLocaleString('fr-FR')} FCFA</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #22c55e 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">📄 Nouveau Devis</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Référence: ${document.reference}</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
              Bonjour,
            </p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 30px 0;">
              <strong>${document.provider_name}</strong> vous a envoyé un devis sur <strong>Yo!Voiz</strong>. 
              Vous pouvez le consulter dans votre messagerie sur la plateforme.
            </p>

            <!-- Document Info -->
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date d'émission:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${new Date(document.issue_date).toLocaleDateString('fr-FR')}</td>
                </tr>
                ${document.expiry_date ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date d'expiration:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${new Date(document.expiry_date).toLocaleDateString('fr-FR')}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; font-size: 14px; color: #6b7280;">Prestation</th>
                  <th style="padding: 12px; text-align: center; font-size: 14px; color: #6b7280;">Qté</th>
                  <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280;">Prix unit.</th>
                  <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Total -->
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 18px; color: #92400e; font-weight: 600;">Montant total:</span>
                <span style="font-size: 24px; color: #92400e; font-weight: bold;">${document.amount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="https://yovoiz.vercel.app/messages" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                📨 Consulter dans ma messagerie
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0;">
              Pour toute question, vous pouvez contacter <strong>${document.provider_name}</strong> directement via la messagerie Yo!Voiz.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;">
              <strong>Yo!Voiz</strong> - La plateforme de services entre voisins
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

function generateFactureEmail(document: any): string {
  const itemsHtml = document.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.unit_price.toLocaleString('fr-FR')} FCFA</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${item.total.toLocaleString('fr-FR')} FCFA</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #22c55e 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🧾 Nouvelle Facture</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Référence: ${document.reference}</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
              Bonjour,
            </p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 30px 0;">
              <strong>${document.provider_name}</strong> vous a envoyé une facture sur <strong>Yo!Voiz</strong>. 
              Vous pouvez la consulter dans votre messagerie sur la plateforme.
            </p>

            <!-- Document Info -->
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date d'émission:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${new Date(document.issue_date).toLocaleDateString('fr-FR')}</td>
                </tr>
                ${document.due_date ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date d'échéance:</td>
                  <td style="padding: 8px 0; color: #dc2626; font-weight: 600; text-align: right;">${new Date(document.due_date).toLocaleDateString('fr-FR')}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; font-size: 14px; color: #6b7280;">Prestation</th>
                  <th style="padding: 12px; text-align: center; font-size: 14px; color: #6b7280;">Qté</th>
                  <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280;">Prix unit.</th>
                  <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Total -->
            <div style="background-color: #dcfce7; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 18px; color: #166534; font-weight: 600;">Montant à payer:</span>
                <span style="font-size: 24px; color: #166534; font-weight: bold;">${document.amount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="https://yovoiz.vercel.app/messages" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                📨 Consulter et payer
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0;">
              Pour toute question, vous pouvez contacter <strong>${document.provider_name}</strong> directement via la messagerie Yo!Voiz.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;">
              <strong>Yo!Voiz</strong> - La plateforme de services entre voisins
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

function generateRelanceEmail(document: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">⚠️ Relance de Facture</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Référence: ${document.reference}</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
              Bonjour,
            </p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 30px 0;">
              Nous vous rappelons que la facture <strong>${document.reference}</strong> de <strong>${document.provider_name}</strong> est toujours en attente de paiement.
            </p>

            <!-- Alert Box -->
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <p style="font-size: 16px; color: #991b1b; font-weight: 600; margin: 0 0 10px 0;">
                ⚠️ Paiement en attente
              </p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Montant dû:</td>
                  <td style="padding: 8px 0; color: #dc2626; font-weight: 700; text-align: right; font-size: 18px;">${document.amount.toLocaleString('fr-FR')} FCFA</td>
                </tr>
                ${document.due_date ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date d'échéance:</td>
                  <td style="padding: 8px 0; color: #dc2626; font-weight: 600; text-align: right;">${new Date(document.due_date).toLocaleDateString('fr-FR')}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="https://yovoiz.vercel.app/messages" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                💳 Payer maintenant
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0;">
              En cas de difficulté, n'hésitez pas à contacter <strong>${document.provider_name}</strong> via la messagerie Yo!Voiz pour trouver un arrangement.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;">
              <strong>Yo!Voiz</strong> - La plateforme de services entre voisins
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}
