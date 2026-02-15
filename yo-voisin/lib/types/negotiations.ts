// Types pour le système de négociation

export type NegotiationStatus = 
  | 'pending'      // En attente réponse
  | 'accepted'     // Accepté, paiement en cours
  | 'rejected'     // Rejeté définitivement
  | 'countered'    // Contre-offre envoyée
  | 'expired';     // Expiré (72h sans réponse)

export type ProposerType = 'client' | 'provider';

export interface Proposal {
  amount: number;
  proposer: ProposerType;
  message?: string;
  created_at: string;
  expires_at: string;
}

export interface Negotiation {
  id: string;
  mission_id: string;
  offer_id?: string;
  client_id: string;
  provider_id: string;
  proposals: Proposal[];
  current_proposal_index: number;
  current_amount: number;
  current_proposer: ProposerType;
  status: NegotiationStatus;
  round_count: number;
  max_rounds: number;
  expires_at: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  accepted_at?: string;
  rejected_at?: string;
}

export interface CreateNegotiationParams {
  missionId: string;
  offerId?: string;
  providerId: string;
  clientId: string;
  initialAmount: number;
  message?: string;
}

export interface CounterProposalParams {
  negotiationId: string;
  newAmount: number;
  message?: string;
  userId: string;
}

export interface AcceptProposalParams {
  negotiationId: string;
  userId: string;
}

export interface RejectProposalParams {
  negotiationId: string;
  userId: string;
  reason?: string;
}

export interface NegotiationWithProfiles extends Negotiation {
  client: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  provider: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  mission: {
    id: string;
    title: string;
    category: string;
  };
}
