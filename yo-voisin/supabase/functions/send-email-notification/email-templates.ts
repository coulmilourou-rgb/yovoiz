// ================================================
// TEMPLATES EMAIL COMPLETS - 44 NOTIFICATIONS
// ================================================
// Tous les templates d'emails pour Yo!Voiz
// Date : 15 Février 2026
// ================================================

export interface EmailTemplate {
  subject: string;
  html: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

// Fonction helper pour générer le header
const getHeader = () => `
  <div class="header">
    <div class="logo"><span style="color: #F97316;">Yo!</span><span style="color: white;">Voiz</span></div>
  </div>
`;

// Fonction helper pour générer le footer
const getFooter = () => `
  <div class="footer">
    <p>Yo!Voiz - La plateforme de services de proximité en Côte d'Ivoire</p>
    <p>📍 Abidjan, Côte d'Ivoire | 📧 contact@yovoiz.ci</p>
    <p style="font-size: 11px; margin-top: 10px;">
      Tu reçois cet email car tu es inscrit sur Yo!Voiz.<br>
      <a href="{{APP_URL}}/profile/security" style="color: #666;">Gérer mes notifications</a>
    </p>
  </div>
`;

// Template HTML de base
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
    .status { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; }
    .status-success { background: #D1FAE5; color: #065F46; }
    .status-warning { background: #FEF3C7; color: #92400E; }
    .status-error { background: #FEE2E2; color: #991B1B; }
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
`;

// ================================================
// TEMPLATES DES 44 NOTIFICATIONS
// ================================================

export const getEmailTemplate = (type: string, data: any, user: User, appUrl: string): EmailTemplate => {
  const userName = user.first_name || 'Utilisateur';
  
  const templates: Record<string, EmailTemplate> = {
    
    // ================================================
    // 1. CYCLE DE VIE DES DEMANDES (10 notifications)
    // ================================================
    
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
        
        <div class="card">
          <strong>Récapitulatif :</strong><br>
          <strong>Catégorie :</strong> ${data.category}<br>
          <strong>Date :</strong> ${new Date(data.createdAt).toLocaleDateString('fr-FR')}
        </div>
        
        <a href="${appUrl}/profile/requests" class="button">Voir ma demande</a>
        
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
        
        <a href="${appUrl}/missions/${data.requestId}" class="button">Voir ma demande</a>
        
        <p>Tu recevras une notification dès qu'un prestataire te fera une proposition.</p>
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
        
        <div class="highlight">
          <strong>💡 Que faire ?</strong><br>
          • Vérifie que ta demande est claire et détaillée<br>
          • Assure-toi qu'elle respecte nos conditions d'utilisation<br>
          • Modifie ta demande et republie-la
        </div>
        
        <a href="${appUrl}/missions/nouvelle" class="button">Créer une nouvelle demande</a>
        
        <p>Notre équipe reste à ta disposition pour toute question.</p>
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    request_expired: {
      subject: '⏰ Ta demande expire bientôt',
      html: wrapTemplate(`
        <h1>⏰ Attention : Demande expirante</h1>
        <p>Salut ${userName},</p>
        <p>Ta demande <strong>"${data.title}"</strong> expire dans ${data.daysLeft} jours.</p>
        
        <div class="card">
          <strong>📊 Statistiques :</strong><br>
          Propositions reçues : <strong>${data.proposalsCount || 0}</strong><br>
          Vues : <strong>${data.viewsCount || 0}</strong>
        </div>
        
        <div class="highlight">
          <strong>💡 Options :</strong><br>
          • Accepte une des propositions reçues<br>
          • Prolonge ta demande de 7 jours<br>
          • Modifie ta demande pour attirer plus de prestataires
        </div>
        
        <a href="${appUrl}/missions/${data.requestId}" class="button">Voir ma demande</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    request_cancelled: {
      subject: '🚫 Demande annulée',
      html: wrapTemplate(`
        <h1>🚫 Demande annulée</h1>
        <p>Salut ${userName},</p>
        <p>Ta demande <strong>"${data.title}"</strong> a bien été annulée.</p>
        
        <p>Les prestataires qui avaient fait des propositions ont été informés.</p>
        
        <a href="${appUrl}/missions/nouvelle" class="button">Créer une nouvelle demande</a>
        
        <p>À bientôt !<br>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ================================================
    // 2. CYCLE DE VIE DES OFFRES (3 notifications)
    // ================================================
    
    service_offer_submitted: {
      subject: '📝 Ton offre a bien été envoyée',
      html: wrapTemplate(`
        <h1>📝 Offre envoyée avec succès !</h1>
        <p>Salut ${userName},</p>
        <p>Ton offre de service <strong>"${data.title}"</strong> a bien été envoyée.</p>
        
        <div class="highlight">
          <strong>⏰ Prochaines étapes :</strong><br>
          Notre équipe va vérifier ton offre sous 2-4 heures.<br>
          Une fois validée, elle sera visible par tous les utilisateurs de ta zone.
        </div>
        
        <a href="${appUrl}/services/mes-offres" class="button">Voir mes offres</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    service_offer_validated: {
      subject: '🎉 Ton offre est maintenant visible !',
      html: wrapTemplate(`
        <h1>🎉 Offre validée !</h1>
        <p>Salut ${userName},</p>
        <p>Excellente nouvelle ! Ton offre <strong>"${data.title}"</strong> a été validée.</p>
        
        <div class="highlight">
          <strong>🚀 Ton offre est maintenant :</strong><br>
          ✅ Visible par tous les utilisateurs de ta zone<br>
          ✅ Référencée dans les résultats de recherche<br>
          ✅ Prête à recevoir des demandes
        </div>
        
        <a href="${appUrl}/services/mes-offres" class="button">Voir mon offre</a>
        
        <p>Bonne chance !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    service_offer_rejected: {
      subject: '⚠️ Ton offre n\'a pas pu être validée',
      html: wrapTemplate(`
        <h1>⚠️ Offre non validée</h1>
        <p>Salut ${userName},</p>
        <p>Ton offre <strong>"${data.title}"</strong> n'a pas pu être validée.</p>
        
        <div class="card">
          <strong>📋 Raison :</strong><br>
          ${data.reason || 'L\'offre ne respecte pas nos conditions d\'utilisation.'}
        </div>
        
        <a href="${appUrl}/services/nouvelle-offre" class="button">Modifier mon offre</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ================================================
    // 3. NÉGOCIATIONS (6 notifications)
    // ================================================
    
    new_proposal: {
      subject: '💼 Nouvelle proposition reçue !',
      html: wrapTemplate(`
        <h1>💼 Tu as reçu une nouvelle proposition !</h1>
        <p>Salut ${userName},</p>
        <p><strong>${data.providerName}</strong> t'a envoyé une proposition pour ta demande.</p>
        
        <div class="card">
          <strong>💰 Montant proposé :</strong><br>
          <div class="price">${data.amount.toLocaleString('fr-FR')} FCFA</div>
        </div>
        
        ${data.message ? `
        <div class="highlight">
          <strong>📝 Message du prestataire :</strong><br>
          "${data.message}"
        </div>
        ` : ''}
        
        <a href="${appUrl}/negotiations/${data.negotiationId}" class="button">Voir la proposition</a>
        
        <p>💡 Tu peux accepter, refuser ou faire une contre-proposition.</p>
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
        
        <div class="highlight">
          <strong>🚀 Prochaines étapes :</strong><br>
          1. Le client va effectuer le paiement<br>
          2. Contacte-le pour organiser la prestation<br>
          3. Une fois terminé, marque la mission comme "Terminée"<br>
          4. Le paiement te sera versé après validation du client
        </div>
        
        <a href="${appUrl}/missions/${data.missionId}" class="button">Voir la mission</a>
        
        <p>Bonne prestation !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    negotiation_counter_offer: {
      subject: '💬 Nouvelle contre-proposition',
      html: wrapTemplate(`
        <h1>💬 Contre-proposition reçue</h1>
        <p>Salut ${userName},</p>
        <p><strong>${data.senderName}</strong> a fait une contre-proposition.</p>
        
        <div class="card">
          <strong>💰 Nouveau montant proposé :</strong><br>
          <div class="price">${data.amount.toLocaleString('fr-FR')} FCFA</div>
          ${data.previousAmount ? `<p style="color: #666; font-size: 14px;">Précédent : ${data.previousAmount.toLocaleString('fr-FR')} FCFA</p>` : ''}
        </div>
        
        ${data.message ? `
        <div class="highlight">
          <strong>📝 Message :</strong><br>
          "${data.message}"
        </div>
        ` : ''}
        
        <a href="${appUrl}/negotiations/${data.negotiationId}" class="button">Voir la négociation</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    negotiation_declined: {
      subject: '🚫 Proposition non retenue',
      html: wrapTemplate(`
        <h1>🚫 Proposition refusée</h1>
        <p>Salut ${userName},</p>
        <p>Malheureusement, ta proposition n'a pas été retenue pour cette demande.</p>
        
        <div class="highlight">
          💡 Ne te décourage pas ! D'autres opportunités t'attendent sur Yo!Voiz.
        </div>
        
        <a href="${appUrl}/home" class="button">Voir d'autres demandes</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    negotiation_expired: {
      subject: '⏰ Négociation expirée',
      html: wrapTemplate(`
        <h1>⏰ Négociation expirée</h1>
        <p>Salut ${userName},</p>
        <p>La négociation pour <strong>"${data.title}"</strong> a expiré sans accord.</p>
        
        <p>Tu peux toujours contacter l'autre partie si tu souhaites reprendre les discussions.</p>
        
        <a href="${appUrl}/home" class="button">Voir d'autres opportunités</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ================================================
    // 4. MISSIONS / PRESTATIONS (7 notifications)
    // ================================================
    
    mission_started: {
      subject: '🚀 Ta prestation a démarré',
      html: wrapTemplate(`
        <h1>🚀 Prestation en cours</h1>
        <p>Salut ${userName},</p>
        <p><strong>${data.providerName}</strong> a marqué la prestation comme "Démarrée".</p>
        
        <div class="card">
          <strong>📋 Mission :</strong> ${data.title}<br>
          <strong>👤 Prestataire :</strong> ${data.providerName}<br>
          <strong>📞 Contact :</strong> ${data.providerPhone || 'Via messagerie'}
        </div>
        
        <a href="${appUrl}/missions/${data.missionId}" class="button">Suivre la mission</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    mission_completed: {
      subject: '✅ Prestation terminée - Validation requise',
      html: wrapTemplate(`
        <h1>✅ Prestation terminée</h1>
        <p>Salut ${userName},</p>
        <p><strong>${data.providerName}</strong> a marqué la prestation comme "Terminée".</p>
        
        <div class="highlight">
          <strong>⚠️ ACTION REQUISE :</strong><br>
          Merci de valider la prestation pour que le paiement soit transféré au prestataire.
        </div>
        
        <div class="card">
          <strong>📋 Options :</strong><br>
          ✅ Valider la prestation (si tout est OK)<br>
          ⚠️ Signaler un problème (si quelque chose ne va pas)
        </div>
        
        <a href="${appUrl}/missions/${data.missionId}/validate" class="button">Valider la prestation</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    mission_validated: {
      subject: '✅ Prestation validée - Paiement en cours',
      html: wrapTemplate(`
        <h1>✅ Prestation validée !</h1>
        <p>Salut ${userName},</p>
        <p>Excellente nouvelle ! <strong>${data.clientName}</strong> a validé ta prestation.</p>
        
        <div class="card">
          <strong>💰 Paiement :</strong><br>
          <div class="price">${data.amount.toLocaleString('fr-FR')} FCFA</div>
          <p style="color: #666; font-size: 14px;">Le paiement sera transféré sur ton compte sous 2-3 jours ouvrés.</p>
        </div>
        
        <div class="highlight">
          💡 N'oublie pas de laisser un avis au client !
        </div>
        
        <a href="${appUrl}/missions/${data.missionId}" class="button">Voir la mission</a>
        
        <p>Félicitations !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    mission_disputed: {
      subject: '⚠️ Litige ouvert sur la prestation',
      html: wrapTemplate(`
        <h1>⚠️ Litige signalé</h1>
        <p>Salut ${userName},</p>
        <p>Un litige a été ouvert concernant la prestation <strong>"${data.title}"</strong>.</p>
        
        <div class="card">
          <strong>📋 Raison :</strong><br>
          ${data.reason || 'Problème signalé par le client'}
        </div>
        
        <div class="highlight">
          <strong>🔍 Prochaines étapes :</strong><br>
          Notre équipe va examiner le litige et contacter les deux parties.<br>
          Réponse sous 24-48 heures.
        </div>
        
        <a href="${appUrl}/missions/${data.missionId}" class="button">Voir le litige</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    mission_cancelled: {
      subject: '🚫 Mission annulée',
      html: wrapTemplate(`
        <h1>🚫 Mission annulée</h1>
        <p>Salut ${userName},</p>
        <p>La mission <strong>"${data.title}"</strong> a été annulée.</p>
        
        ${data.reason ? `
        <div class="card">
          <strong>📋 Raison :</strong><br>
          ${data.reason}
        </div>
        ` : ''}
        
        <div class="highlight">
          ${data.refundAmount ? `💰 Un remboursement de ${data.refundAmount.toLocaleString('fr-FR')} FCFA sera effectué sous 3-5 jours.` : ''}
        </div>
        
        <a href="${appUrl}/home" class="button">Retour à l'accueil</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ================================================
    // 5. AVIS / RÉPUTATION (3 notifications)
    // ================================================
    
    review_request: {
      subject: '⭐ Laisse ton avis sur la prestation',
      html: wrapTemplate(`
        <h1>⭐ Ton avis compte !</h1>
        <p>Salut ${userName},</p>
        <p>Ta prestation avec <strong>${data.providerName}</strong> est maintenant terminée.</p>
        
        <div class="highlight">
          <strong>💡 Pourquoi laisser un avis ?</strong><br>
          • Aide les autres utilisateurs à faire le bon choix<br>
          • Améliore la qualité des services sur la plateforme<br>
          • Permet aux prestataires de progresser
        </div>
        
        <a href="${appUrl}/missions/${data.missionId}/review" class="button">Laisser mon avis</a>
        
        <p>Merci de ta contribution !<br>L'équipe Yo!Voiz</p>
      `)
    },
    
    review_received: {
      subject: '⭐ Nouvel avis sur ton profil',
      html: wrapTemplate(`
        <h1>⭐ Nouvel avis reçu !</h1>
        <p>Salut ${userName},</p>
        <p><strong>${data.reviewerName}</strong> a laissé un avis sur ton profil.</p>
        
        <div class="card">
          <strong>⭐ Note :</strong> ${data.rating}/5<br>
          ${data.comment ? `<br><strong>📝 Commentaire :</strong><br>"${data.comment}"` : ''}
        </div>
        
        <a href="${appUrl}/profile/public" class="button">Voir mon profil</a>
        
        <p>💡 Tu peux répondre à cet avis pour remercier ou apporter des précisions.</p>
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    review_response: {
      subject: '💬 Réponse à ton avis',
      html: wrapTemplate(`
        <h1>💬 Réponse à ton avis</h1>
        <p>Salut ${userName},</p>
        <p><strong>${data.providerName}</strong> a répondu à ton avis.</p>
        
        <div class="card">
          <strong>📝 Sa réponse :</strong><br>
          "${data.response}"
        </div>
        
        <a href="${appUrl}/profile/public/${data.providerId}" class="button">Voir la réponse</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ================================================
    // 6. PAIEMENTS & FACTURATION (8 notifications)
    // ================================================
    
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
        
        <div class="highlight">
          <strong>🔒 Paiement sécurisé :</strong><br>
          Le montant sera conservé jusqu'à la fin de la prestation.<br>
          Le prestataire ne sera payé qu'après ta validation.
        </div>
        
        <a href="${appUrl}/payment/${data.paymentId}" class="button">Procéder au paiement</a>
        
        ${data.expiryDate ? `<p style="color: #E86305;">⏰ Expiration : ${new Date(data.expiryDate).toLocaleDateString('fr-FR')}</p>` : ''}
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    payment_received: {
      subject: '✅ Paiement reçu avec succès',
      html: wrapTemplate(`
        <h1>✅ Paiement confirmé !</h1>
        <p>Salut ${userName},</p>
        <p>Ton paiement de <strong>${data.amount.toLocaleString('fr-FR')} FCFA</strong> a bien été reçu.</p>
        
        <div class="card">
          <strong>📋 Détails :</strong><br>
          <strong>Référence :</strong> ${data.reference}<br>
          <strong>Date :</strong> ${new Date(data.paidAt).toLocaleDateString('fr-FR')}<br>
          <strong>Prestataire :</strong> ${data.providerName}
        </div>
        
        <div class="highlight">
          <strong>🚀 Prochaines étapes :</strong><br>
          Le prestataire a été informé. Il va te contacter pour organiser la prestation.
        </div>
        
        <a href="${appUrl}/missions/${data.missionId}" class="button">Voir la mission</a>
        
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
          ${data.errorMessage || 'Erreur de transaction bancaire'}
        </div>
        
        <div class="highlight">
          <strong>💡 Que faire ?</strong><br>
          • Vérifie que ta carte a suffisamment de fonds<br>
          • Essaie avec une autre carte<br>
          • Contacte ta banque si le problème persiste
        </div>
        
        <a href="${appUrl}/payment/${data.paymentId}/retry" class="button">Réessayer le paiement</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    refund_initiated: {
      subject: '💰 Remboursement en cours',
      html: wrapTemplate(`
        <h1>💰 Remboursement initié</h1>
        <p>Salut ${userName},</p>
        <p>Un remboursement de <strong>${data.amount.toLocaleString('fr-FR')} FCFA</strong> a été initié.</p>
        
        <div class="card">
          <strong>📋 Détails :</strong><br>
          <strong>Référence :</strong> ${data.reference}<br>
          <strong>Raison :</strong> ${data.reason}
        </div>
        
        <div class="highlight">
          ⏰ Le remboursement sera effectif sous 3-5 jours ouvrés selon ta banque.
        </div>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    refund_completed: {
      subject: '✅ Remboursement effectué',
      html: wrapTemplate(`
        <h1>✅ Remboursement reçu</h1>
        <p>Salut ${userName},</p>
        <p>Le remboursement de <strong>${data.amount.toLocaleString('fr-FR')} FCFA</strong> a été effectué avec succès.</p>
        
        <div class="card">
          <strong>📋 Référence :</strong> ${data.reference}<br>
          <strong>Date :</strong> ${new Date(data.completedAt).toLocaleDateString('fr-FR')}
        </div>
        
        <p>Le montant devrait apparaître sur ton compte sous 1-3 jours.</p>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    invoice_sent: {
      subject: '📄 Nouvelle facture disponible',
      html: wrapTemplate(`
        <h1>📄 Facture disponible</h1>
        <p>Salut ${userName},</p>
        <p>Ta facture pour la prestation <strong>"${data.title}"</strong> est disponible.</p>
        
        <div class="card">
          <strong>💰 Montant :</strong> ${data.amount.toLocaleString('fr-FR')} FCFA<br>
          <strong>📅 Date :</strong> ${new Date(data.date).toLocaleDateString('fr-FR')}<br>
          <strong>📋 N° Facture :</strong> ${data.invoiceNumber}
        </div>
        
        <a href="${appUrl}/invoices/${data.invoiceId}/download" class="button">Télécharger la facture</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ================================================
    // 7. ABONNEMENT PRO (4 notifications)
    // ================================================
    
    subscription_activated: {
      subject: '🎉 Bienvenue dans Yo!Voiz PRO !',
      html: wrapTemplate(`
        <h1>🎉 Bienvenue dans PRO !</h1>
        <p>Salut ${userName},</p>
        <p>Ton abonnement <strong>Yo!Voiz PRO</strong> est maintenant actif !</p>
        
        <div class="card">
          <strong>✨ Fonctionnalités débloquées :</strong><br>
          ✅ Tableau de bord Pro complet<br>
          ✅ Gestion des devis et factures<br>
          ✅ Suivi des encaissements<br>
          ✅ Répertoire clients<br>
          ✅ Catalogue d'articles<br>
          ✅ Badge "PRO" sur ton profil<br>
          ✅ Priorité dans les résultats de recherche
        </div>
        
        <a href="${appUrl}/abonnement" class="button">Découvrir mon espace PRO</a>
        
        <p>Excellente prestation !<br>L'équipe Yo!Voiz 🚀</p>
      `)
    },
    
    subscription_expiring: {
      subject: '⏰ Ton abonnement PRO expire dans 7 jours',
      html: wrapTemplate(`
        <h1>⏰ Renouvelle ton abonnement PRO</h1>
        <p>Salut ${userName},</p>
        <p>Ton abonnement <strong>Yo!Voiz PRO</strong> expire le <strong>${new Date(data.expiryDate).toLocaleDateString('fr-FR')}</strong>.</p>
        
        <div class="highlight">
          <strong>⚠️ Dans 7 jours, tu perdras l'accès à :</strong><br>
          • Tableau de bord Pro<br>
          • Gestion devis/factures<br>
          • Badge PRO<br>
          • Priorité dans les recherches
        </div>
        
        <a href="${appUrl}/abonnement/renew" class="button">Renouveler maintenant</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    subscription_expired: {
      subject: '⚠️ Ton abonnement PRO a expiré',
      html: wrapTemplate(`
        <h1>⚠️ Abonnement expiré</h1>
        <p>Salut ${userName},</p>
        <p>Ton abonnement <strong>Yo!Voiz PRO</strong> a expiré.</p>
        
        <div class="highlight">
          💡 Renouvelle ton abonnement pour retrouver toutes les fonctionnalités PRO !
        </div>
        
        <a href="${appUrl}/abonnement/renew" class="button">Renouveler mon abonnement</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    subscription_renewed: {
      subject: '✅ Abonnement PRO renouvelé',
      html: wrapTemplate(`
        <h1>✅ Renouvellement confirmé</h1>
        <p>Salut ${userName},</p>
        <p>Ton abonnement <strong>Yo!Voiz PRO</strong> a été renouvelé avec succès !</p>
        
        <div class="card">
          <strong>📅 Valable jusqu'au :</strong> ${new Date(data.nextRenewalDate).toLocaleDateString('fr-FR')}<br>
          <strong>💰 Montant :</strong> ${data.amount.toLocaleString('fr-FR')} FCFA
        </div>
        
        <a href="${appUrl}/abonnement" class="button">Mon espace PRO</a>
        
        <p>Merci de ta confiance !<br>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ================================================
    // 8. MESSAGERIE (1 notification)
    // ================================================
    
    new_message: {
      subject: '💬 Nouveau message sur Yo!Voiz',
      html: wrapTemplate(`
        <h1>💬 Nouveau message</h1>
        <p>Salut ${userName},</p>
        <p>Tu as reçu un nouveau message de <strong>${data.senderName}</strong>.</p>
        
        <div class="card">
          <strong>📝 Message :</strong><br>
          "${data.content.substring(0, 150)}${data.content.length > 150 ? '...' : ''}"
        </div>
        
        <a href="${appUrl}/messages/${data.conversationId}" class="button">Répondre au message</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ================================================
    // 9. SÉCURITÉ & COMPTE (7 notifications)
    // ================================================
    
    welcome_email: {
      subject: '👋 Bienvenue sur Yo!Voiz !',
      html: wrapTemplate(`
        <h1>👋 Bienvenue ${userName} !</h1>
        <p>Nous sommes ravis de t'accueillir sur <strong>Yo!Voiz</strong>, la plateforme de services de proximité en Côte d'Ivoire !</p>
        
        <div class="highlight">
          <strong>🚀 Pour bien démarrer :</strong><br>
          1. Complète ton profil<br>
          2. Définis ta zone d'intervention<br>
          3. Publie ta première demande ou offre de service
        </div>
        
        <div class="card">
          <strong>💡 Que peux-tu faire sur Yo!Voiz ?</strong><br>
          ✅ Trouver des prestataires qualifiés près de chez toi<br>
          ✅ Proposer tes services dans ta zone<br>
          ✅ Négocier les tarifs directement<br>
          ✅ Payer en toute sécurité<br>
          ✅ Laisser et consulter des avis
        </div>
        
        <a href="${appUrl}/home" class="button">Découvrir Yo!Voiz</a>
        
        <p>Besoin d'aide ? Notre équipe est là pour toi !</p>
        <p>Excellente expérience sur Yo!Voiz !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    email_verification: {
      subject: '📧 Confirme ton adresse email',
      html: wrapTemplate(`
        <h1>📧 Vérifie ton email</h1>
        <p>Salut ${userName},</p>
        <p>Pour activer ton compte Yo!Voiz, merci de confirmer ton adresse email.</p>
        
        <a href="${data.verificationLink}" class="button">Confirmer mon email</a>
        
        <p style="font-size: 12px; color: #666;">
          Si tu n'as pas créé de compte, ignore cet email.<br>
          Le lien expire dans 24 heures.
        </p>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    password_reset: {
      subject: '🔑 Réinitialisation de mot de passe',
      html: wrapTemplate(`
        <h1>🔑 Réinitialise ton mot de passe</h1>
        <p>Salut ${userName},</p>
        <p>Tu as demandé la réinitialisation de ton mot de passe.</p>
        
        <a href="${data.resetLink}" class="button">Réinitialiser mon mot de passe</a>
        
        <p style="font-size: 12px; color: #666;">
          Si tu n'as pas fait cette demande, ignore cet email.<br>
          Le lien expire dans 1 heure.
        </p>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    password_changed: {
      subject: '✅ Mot de passe modifié',
      html: wrapTemplate(`
        <h1>✅ Mot de passe modifié</h1>
        <p>Salut ${userName},</p>
        <p>Ton mot de passe a été modifié avec succès.</p>
        
        <div class="highlight">
          ⚠️ Si tu n'es pas à l'origine de ce changement, contacte-nous immédiatement !
        </div>
        
        <a href="${appUrl}/aide" class="button">Contacter le support</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    profile_verified: {
      subject: '✅ Ton profil est vérifié !',
      html: wrapTemplate(`
        <h1>✅ Profil vérifié !</h1>
        <p>Salut ${userName},</p>
        <p>Excellente nouvelle ! Ton profil Yo!Voiz a été vérifié par notre équipe.</p>
        
        <div class="card">
          <strong>🏆 Avantages du badge "Vérifié" :</strong><br>
          ✅ Plus de confiance des utilisateurs<br>
          ✅ Meilleure visibilité dans les recherches<br>
          ✅ Augmentation des opportunités
        </div>
        
        <a href="${appUrl}/profile/public" class="button">Voir mon profil</a>
        
        <p>Félicitations !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    suspicious_activity: {
      subject: '⚠️ Activité inhabituelle détectée',
      html: wrapTemplate(`
        <h1>⚠️ Activité suspecte</h1>
        <p>Salut ${userName},</p>
        <p>Nous avons détecté une activité inhabituelle sur ton compte :</p>
        
        <div class="card">
          <strong>📋 Détails :</strong><br>
          <strong>Type :</strong> ${data.activityType}<br>
          <strong>Date :</strong> ${new Date(data.detectedAt).toLocaleDateString('fr-FR')}<br>
          <strong>Localisation :</strong> ${data.location || 'Inconnue'}
        </div>
        
        <div class="highlight">
          <strong>🔒 C'était toi ?</strong><br>
          Si oui, ignore cet email.<br>
          Sinon, change ton mot de passe immédiatement.
        </div>
        
        <a href="${appUrl}/profile/security" class="button">Sécuriser mon compte</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    account_deleted: {
      subject: '👋 Ton compte a été supprimé',
      html: wrapTemplate(`
        <h1>👋 Compte supprimé</h1>
        <p>Salut ${userName},</p>
        <p>Ton compte Yo!Voiz a bien été supprimé.</p>
        
        <div class="highlight">
          <strong>💡 Tu as 30 jours pour changer d'avis !</strong><br>
          Si tu veux revenir, contacte-nous avant le <strong>${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('fr-FR')}</strong>.
        </div>
        
        <p>Nous espérons te revoir bientôt sur Yo!Voiz !</p>
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    // ================================================
    // 10. ADMIN / MODÉRATION (4 notifications)
    // ================================================
    
    new_user_registered: {
      subject: '🆕 Nouvel utilisateur inscrit',
      html: wrapTemplate(`
        <h1>🆕 Nouvel utilisateur</h1>
        <p><strong>${user.first_name} ${user.last_name}</strong> vient de s'inscrire.</p>
        
        <div class="card">
          <strong>📧 Email :</strong> ${user.email}<br>
          <strong>📅 Date :</strong> ${new Date().toLocaleDateString('fr-FR')}<br>
          <strong>🆔 ID :</strong> ${user.id}
        </div>
        
        <a href="${appUrl}/admin/users/${user.id}" class="button">Voir le profil</a>
      `)
    },
    
    new_request_pending: {
      subject: '📋 Nouvelle demande à valider',
      html: wrapTemplate(`
        <h1>📋 Demande en attente</h1>
        <p>Une nouvelle demande nécessite validation.</p>
        
        <div class="card">
          <strong>📝 Titre :</strong> ${data.title}<br>
          <strong>👤 Utilisateur :</strong> ${data.userName}<br>
          <strong>📅 Date :</strong> ${new Date(data.createdAt).toLocaleDateString('fr-FR')}
        </div>
        
        <a href="${appUrl}/admin/requests/${data.requestId}" class="button">Valider la demande</a>
      `)
    },
    
    new_service_offer_pending: {
      subject: '🛠️ Nouvelle offre à valider',
      html: wrapTemplate(`
        <h1>🛠️ Offre en attente</h1>
        <p>Une nouvelle offre de service nécessite validation.</p>
        
        <div class="card">
          <strong>📝 Titre :</strong> ${data.title}<br>
          <strong>👤 Prestataire :</strong> ${data.providerName}<br>
          <strong>📅 Date :</strong> ${new Date(data.createdAt).toLocaleDateString('fr-FR')}
        </div>
        
        <a href="${appUrl}/admin/offers/${data.offerId}" class="button">Valider l'offre</a>
      `)
    },
    
    dispute_opened: {
      subject: '⚠️ Nouveau litige à traiter',
      html: wrapTemplate(`
        <h1>⚠️ Litige ouvert</h1>
        <p>Un litige a été ouvert et nécessite votre intervention.</p>
        
        <div class="card">
          <strong>📋 Mission :</strong> ${data.missionTitle}<br>
          <strong>👤 Client :</strong> ${data.clientName}<br>
          <strong>👤 Prestataire :</strong> ${data.providerName}<br>
          <strong>💰 Montant :</strong> ${data.amount.toLocaleString('fr-FR')} FCFA
        </div>
        
        <a href="${appUrl}/admin/disputes/${data.disputeId}" class="button">Gérer le litige</a>
      `)
    },
    
    // ================================================
    // 11. MARKETING & ENGAGEMENT (3 notifications)
    // ================================================
    
    inactive_user_reminder: {
      subject: '👋 On t\'a manqué sur Yo!Voiz',
      html: wrapTemplate(`
        <h1>👋 Tu nous manques ${userName} !</h1>
        <p>Cela fait un moment qu'on ne t'a pas vu sur Yo!Voiz.</p>
        
        <div class="highlight">
          <strong>🎯 Pendant ton absence :</strong><br>
          • ${data.newRequestsCount || 0} nouvelles demandes dans ta zone<br>
          • ${data.newProvidersCount || 0} nouveaux prestataires inscrits<br>
          • Des améliorations de la plateforme
        </div>
        
        <a href="${appUrl}/home" class="button">Revenir sur Yo!Voiz</a>
        
        <p>À très bientôt !<br>L'équipe Yo!Voiz</p>
      `)
    },
    
    newsletter: {
      subject: data.subject || '📰 Nouveautés Yo!Voiz',
      html: wrapTemplate(`
        ${data.content || '<p>Contenu de la newsletter</p>'}
      `)
    },
    
    promo_code: {
      subject: '🎁 Code promo exclusif pour toi !',
      html: wrapTemplate(`
        <h1>🎁 Offre spéciale !</h1>
        <p>Salut ${userName},</p>
        <p>Profite de cette offre exclusive :</p>
        
        <div class="card" style="background: linear-gradient(135deg, #FEF3C7, #FED7AA); border: 2px dashed #F97316;">
          <h2 style="color: #1B7A3D; font-size: 24px; margin: 0;">${data.promoTitle}</h2>
          <div style="margin: 20px 0;">
            <div style="background: white; padding: 15px; border-radius: 8px; display: inline-block;">
              <strong style="font-size: 32px; color: #F97316; letter-spacing: 2px;">${data.promoCode}</strong>
            </div>
          </div>
          <p style="margin: 10px 0; font-size: 16px;"><strong>${data.discount}</strong> de réduction</p>
          <p style="margin: 5px 0; color: #666;">Valable jusqu'au ${new Date(data.expiryDate).toLocaleDateString('fr-FR')}</p>
        </div>
        
        <a href="${appUrl}/home" class="button">Utiliser mon code</a>
        
        <p>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
    // ================================================
    // TRANSACTION COMPLÉTÉE (déjà implémentées)
    // ================================================
    
    transaction_completed_client: {
      subject: '💰 Transaction effectuée avec succès',
      html: wrapTemplate(`
        <h1>💰 Paiement confirmé</h1>
        <p>Salut ${userName},</p>
        <p>Ta transaction avec <strong>${data.providerName}</strong> a été effectuée avec succès.</p>
        
        <div class="card">
          <strong>💰 Montant :</strong> ${data.amount.toLocaleString('fr-FR')} FCFA<br>
          <strong>📋 Référence :</strong> ${data.reference}<br>
          <strong>📅 Date :</strong> ${new Date(data.completedAt).toLocaleDateString('fr-FR')}
        </div>
        
        <a href="${appUrl}/missions/${data.missionId}" class="button">Voir la mission</a>
        
        <p>L'équipe Yo!Voiz</p>
      `)
    },
    
    transaction_completed_provider: {
      subject: '💰 Paiement reçu pour ta prestation',
      html: wrapTemplate(`
        <h1>💰 Paiement reçu !</h1>
        <p>Salut ${userName},</p>
        <p>Le paiement pour ta prestation a été transféré sur ton compte.</p>
        
        <div class="card">
          <strong>💰 Montant :</strong> ${data.amount.toLocaleString('fr-FR')} FCFA<br>
          <strong>📋 Référence :</strong> ${data.reference}<br>
          <strong>👤 Client :</strong> ${data.clientName}<br>
          <strong>📅 Date :</strong> ${new Date(data.completedAt).toLocaleDateString('fr-FR')}
        </div>
        
        <a href="${appUrl}/abonnement/encaissements" class="button">Voir mes encaissements</a>
        
        <p>Félicitations !<br>L'équipe Yo!Voiz 🎉</p>
      `)
    },
    
  };
  
  // Récupérer le template ou retourner une erreur
  const template = templates[type];
  
  if (!template) {
    throw new Error(`Template email inconnu: ${type}`);
  }
  
  // Remplacer {{APP_URL}} dans le contenu
  return {
    subject: template.subject,
    html: template.html.replace(/{{APP_URL}}/g, appUrl)
  };
};
