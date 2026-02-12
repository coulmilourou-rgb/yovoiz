// Types TypeScript pour Yo! Voiz

export type UserRole = 'demandeur' | 'prestataire' | 'both' | 'admin';
export type VerificationStatus = 'pending' | 'submitted' | 'verified' | 'rejected';
export type RequestStatus = 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'expired';
export type PaymentStatus = 'pending' | 'escrow' | 'released' | 'refunded' | 'disputed';
export type ProviderLevel = 'bronze' | 'silver' | 'gold' | 'platinum';
export type DisputeStatus = 'open' | 'in_review' | 'resolved_refund' | 'resolved_release' | 'closed';
export type UrgencyType = 'asap' | 'this_week' | 'specific_date';

export interface Profile {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  display_name: string;
  avatar_url?: string;
  role: UserRole;
  commune?: string;
  bio?: string;
  
  // Vérification
  verification_status: VerificationStatus;
  cni_front_url?: string;
  cni_back_url?: string;
  selfie_url?: string;
  verified_at?: string;
  rejected_reason?: string;
  
  // Stats prestataire
  provider_level: ProviderLevel;
  total_missions: number;
  average_rating: number;
  total_ratings: number;
  response_time_avg: number;
  total_earnings: number;
  current_balance: number;
  commission_rate: number;
  
  // Prestataire
  categories: string[];
  service_zones: string[];
  hourly_rate?: number;
  
  // Pro
  is_pro: boolean;
  pro_expires_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  requester_id: string;
  title: string;
  description: string;
  category: string;
  commune: string;
  address?: string;
  urgency: UrgencyType;
  preferred_date?: string;
  budget_min?: number;
  budget_max?: number;
  photos: string[];
  status: RequestStatus;
  selected_quote_id?: string;
  quotes_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  request_id: string;
  provider_id: string;
  amount: number;
  message: string;
  estimated_duration?: string;
  available_date?: string;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  request_id: string;
  quote_id: string;
  requester_id: string;
  provider_id: string;
  amount: number;
  commission_amount: number;
  provider_amount: number;
  commission_rate: number;
  payment_method?: string;
  payment_reference?: string;
  status: PaymentStatus;
  paid_at?: string;
  escrow_at?: string;
  released_at?: string;
  refunded_at?: string;
  auto_release_at?: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  request_id?: string;
  content: string;
  content_filtered?: string;
  is_filtered: boolean;
  is_system_message: boolean;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  transaction_id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  tags: string[];
  review_type: 'requester_to_provider' | 'provider_to_requester';
  created_at: string;
}

export interface Dispute {
  id: string;
  transaction_id: string;
  opened_by: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  resolution_note?: string;
  resolved_by?: string;
  refund_amount?: number;
  created_at: string;
  resolved_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  provider_id: string;
  amount: number;
  payment_method: string;
  phone_number: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  reference?: string;
  created_at: string;
  processed_at?: string;
}
