// lib/negotiations.ts
// Fonctions de gestion des négociations de prix

import { supabase } from '@/lib/supabase';
import type {
  Negotiation,
  NegotiationWithProfiles,
  CreateNegotiationParams,
  CounterProposalParams,
  AcceptProposalParams,
  RejectProposalParams,
  Proposal
} from '@/lib/types/negotiations';

/**
 * 1. Créer une négociation (prestataire envoie devis initial)
 */
export const createNegotiation = async ({
  missionId,
  offerId,
  providerId,
  clientId,
  initialAmount,
  message = ''
}: CreateNegotiationParams): Promise<Negotiation> => {
  try {
    const proposal: Proposal = {
      amount: initialAmount,
      proposer: 'provider',
      message,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString() // 72h
    };

    const { data, error } = await supabase
      .from('negotiations')
      .insert({
        mission_id: missionId,
        offer_id: offerId,
        client_id: clientId,
        provider_id: providerId,
        proposals: [proposal],
        current_amount: initialAmount,
        current_proposer: 'provider',
        status: 'pending',
        round_count: 1,
        expires_at: proposal.expires_at
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Notifier le client
    console.log('✅ Négociation créée:', data.id);

    return data as Negotiation;
  } catch (error) {
    console.error('❌ Erreur createNegotiation:', error);
    throw error;
  }
};

/**
 * 2. Envoyer une contre-proposition
 */
export const counterProposal = async ({
  negotiationId,
  newAmount,
  message = '',
  userId
}: CounterProposalParams): Promise<Negotiation> => {
  try {
    // Récupérer négociation actuelle
    const { data: nego, error: fetchError } = await supabase
      .from('negotiations')
      .select('*')
      .eq('id', negotiationId)
      .single();

    if (fetchError) throw fetchError;
    if (!nego) throw new Error('Négociation introuvable');

    // Validations
    if (nego.status !== 'pending' && nego.status !== 'countered') {
      throw new Error('Cette négociation est déjà terminée');
    }

    if (nego.round_count >= nego.max_rounds) {
      throw new Error(`Limite de ${nego.max_rounds} rounds atteinte`);
    }

    // Vérifier expiration
    if (new Date() > new Date(nego.expires_at)) {
      throw new Error('Cette proposition a expiré');
    }

    // Déterminer qui propose
    const proposer = userId === nego.client_id ? 'client' : 'provider';
    const isMyTurn = (
      (nego.current_proposer === 'client' && userId === nego.provider_id) ||
      (nego.current_proposer === 'provider' && userId === nego.client_id)
    );

    if (!isMyTurn) {
      throw new Error('Ce n\'est pas votre tour de proposer');
    }

    // Valider montant
    if (newAmount < 500) {
      throw new Error('Le montant minimum est de 500 FCFA');
    }

    if (newAmount > 1000000) {
      throw new Error('Le montant maximum est de 1 000 000 FCFA');
    }

    // Nouvelle proposition
    const newProposal: Proposal = {
      amount: newAmount,
      proposer,
      message,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
    };

    // Mettre à jour
    const { data, error } = await supabase
      .from('negotiations')
      .update({
        proposals: [...nego.proposals, newProposal],
        current_proposal_index: nego.proposals.length,
        current_amount: newAmount,
        current_proposer: proposer,
        status: 'countered',
        round_count: nego.round_count + 1,
        expires_at: newProposal.expires_at
      })
      .eq('id', negotiationId)
      .select()
      .single();

    if (error) throw error;

    // TODO: Notifier l'autre partie
    console.log('✅ Contre-proposition envoyée:', newAmount, 'FCFA');

    return data as Negotiation;
  } catch (error) {
    console.error('❌ Erreur counterProposal:', error);
    throw error;
  }
};

/**
 * 3. Accepter une proposition
 */
export const acceptProposal = async ({
  negotiationId,
  userId
}: AcceptProposalParams): Promise<Negotiation> => {
  try {
    // Récupérer négociation
    const { data: nego, error: fetchError } = await supabase
      .from('negotiations')
      .select('*')
      .eq('id', negotiationId)
      .single();

    if (fetchError) throw fetchError;
    if (!nego) throw new Error('Négociation introuvable');

    // Validations
    if (nego.status === 'accepted') {
      throw new Error('Cette proposition a déjà été acceptée');
    }

    if (nego.status === 'rejected') {
      throw new Error('Cette négociation a été rejetée');
    }

    if (nego.status === 'expired') {
      throw new Error('Cette négociation a expiré');
    }

    // Vérifier que c'est bien le receveur qui accepte
    const isReceiver = (
      (nego.current_proposer === 'client' && userId === nego.provider_id) ||
      (nego.current_proposer === 'provider' && userId === nego.client_id)
    );

    if (!isReceiver) {
      throw new Error('Vous ne pouvez pas accepter votre propre proposition');
    }

    // Accepter
    const { data, error } = await supabase
      .from('negotiations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', negotiationId)
      .select()
      .single();

    if (error) throw error;

    // Mettre à jour la mission
    await supabase
      .from('missions')
      .update({
        status: 'accepted',
        assigned_to: nego.provider_id,
        assigned_at: new Date().toISOString()
      })
      .eq('id', nego.mission_id);

    // TODO: Déclencher le paiement escrow
    console.log('✅ Proposition acceptée ! Montant:', nego.current_amount, 'FCFA');
    console.log('🔐 TODO: Bloquer paiement escrow');

    return data as Negotiation;
  } catch (error) {
    console.error('❌ Erreur acceptProposal:', error);
    throw error;
  }
};

/**
 * 4. Rejeter une proposition
 */
export const rejectProposal = async ({
  negotiationId,
  userId,
  reason = ''
}: RejectProposalParams): Promise<Negotiation> => {
  try {
    // Récupérer négociation
    const { data: nego, error: fetchError } = await supabase
      .from('negotiations')
      .select('*')
      .eq('id', negotiationId)
      .single();

    if (fetchError) throw fetchError;
    if (!nego) throw new Error('Négociation introuvable');

    // Validations
    if (nego.status === 'accepted') {
      throw new Error('Cette proposition a déjà été acceptée');
    }

    if (nego.status === 'rejected') {
      throw new Error('Cette négociation a déjà été rejetée');
    }

    // Vérifier que c'est bien le receveur qui rejette
    const isReceiver = (
      (nego.current_proposer === 'client' && userId === nego.provider_id) ||
      (nego.current_proposer === 'provider' && userId === nego.client_id)
    );

    if (!isReceiver) {
      throw new Error('Vous ne pouvez pas rejeter votre propre proposition');
    }

    // Rejeter
    const { data, error } = await supabase
      .from('negotiations')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejection_reason: reason
      })
      .eq('id', negotiationId)
      .select()
      .single();

    if (error) throw error;

    // TODO: Notifier l'autre partie
    console.log('❌ Proposition rejetée');

    return data as Negotiation;
  } catch (error) {
    console.error('❌ Erreur rejectProposal:', error);
    throw error;
  }
};

/**
 * Récupérer une négociation avec profils
 */
export const getNegotiationWithProfiles = async (
  negotiationId: string
): Promise<NegotiationWithProfiles | null> => {
  try {
    const { data, error } = await supabase
      .from('negotiations')
      .select(`
        *,
        client:profiles!negotiations_client_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url
        ),
        provider:profiles!negotiations_provider_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url
        ),
        mission:missions!negotiations_mission_id_fkey(
          id,
          title,
          category
        )
      `)
      .eq('id', negotiationId)
      .single();

    if (error) throw error;

    return data as NegotiationWithProfiles;
  } catch (error) {
    console.error('❌ Erreur getNegotiationWithProfiles:', error);
    return null;
  }
};

/**
 * Récupérer toutes les négociations d'un utilisateur
 */
export const getUserNegotiations = async (
  userId: string,
  status?: string
): Promise<NegotiationWithProfiles[]> => {
  try {
    let query = supabase
      .from('negotiations')
      .select(`
        *,
        client:profiles!negotiations_client_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url
        ),
        provider:profiles!negotiations_provider_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url
        ),
        mission:missions!negotiations_mission_id_fkey(
          id,
          title,
          category
        )
      `)
      .or(`client_id.eq.${userId},provider_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []) as NegotiationWithProfiles[];
  } catch (error) {
    console.error('❌ Erreur getUserNegotiations:', error);
    return [];
  }
};

/**
 * Vérifier si une négociation est expirée
 */
export const checkExpiration = (negotiation: Negotiation): boolean => {
  return new Date() > new Date(negotiation.expires_at) && negotiation.status === 'pending';
};

/**
 * Obtenir le temps restant avant expiration
 */
export const getTimeUntilExpiration = (expiresAt: string): string => {
  const now = new Date().getTime();
  const expires = new Date(expiresAt).getTime();
  const diff = expires - now;

  if (diff <= 0) return 'Expiré';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}j ${hours % 24}h`;
  }

  return `${hours}h ${minutes}min`;
};
