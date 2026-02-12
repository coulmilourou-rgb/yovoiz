// ============================================
// TYPES TYPESCRIPT - Générés depuis Supabase
// ============================================
// Version: 2.0
// Date: 2026-02-12

import { Database as DatabaseGenerated } from './database.types';

// ============================================
// TYPES DE BASE (depuis Supabase)
// ============================================

export type UserType = 'client' | 'prestataire' | 'admin';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type MissionStatus = 
  | 'draft'
  | 'published'
  | 'offers_received'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type PaymentMethod = 'orange_money' | 'mtn_money' | 'moov_money' | 'wave';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'held';
export type DisputeStatus = 'open' | 'in_review' | 'resolved' | 'closed';
export type DocumentType = 'cni' | 'passport' | 'selfie' | 'address_proof' | 'diploma' | 'certificate';
export type ReportType = 'user' | 'review' | 'message' | 'mission' | 'other';

export type NotificationType =
  | 'mission_new'
  | 'mission_accepted'
  | 'mission_completed'
  | 'message_new'
  | 'review_new'
  | 'payment_received'
  | 'payment_sent'
  | 'verification_approved'
  | 'verification_rejected'
  | 'dispute_opened'
  | 'promo_code'
  | 'system';

// ============================================
// INTERFACES PRINCIPALES
// ============================================

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  phone_verified: boolean;
  avatar_url?: string;
  bio?: string;
  user_type: UserType;
  is_active: boolean;
  is_banned: boolean;
  ban_reason?: string;
  verification_status: VerificationStatus;
  verified_at?: string;
  commune: string;
  quartier?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  total_missions_completed: number;
  average_rating: number;
  total_reviews: number;
  is_premium: boolean;
  premium_until?: string;
  referral_code?: string;
  referred_by?: string;
  total_referrals: number;
  created_at: string;
  updated_at: string;
  last_seen_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  company_name?: string;
  siret?: string;
  description?: string;
  years_experience?: number;
  services: string[];
  hourly_rate?: number;
  minimum_service_price?: number;
  is_available_now: boolean;
  accepts_urgent_requests: boolean;
  max_distance_km: number;
  portfolio_images: string[];
  response_time_hours: number;
  acceptance_rate: number;
  completion_rate: number;
  level: string;
  badges: string[];
  total_earnings: number;
  pending_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  emoji?: string;
  icon_url?: string;
  color?: string;
  meta_title?: string;
  meta_description?: string;
  average_price?: number;
  price_range_min?: number;
  price_range_max?: number;
  total_missions: number;
  active_providers: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  client_id: string;
  category_id: string;
  title: string;
  description: string;
  commune: string;
  quartier?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  is_urgent: boolean;
  preferred_date?: string;
  flexible_dates: boolean;
  budget_min?: number;
  budget_max?: number;
  images: string[];
  status: MissionStatus;
  assigned_to?: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  views_count: number;
  offers_count: number;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  mission_id: string;
  provider_id: string;
  message: string;
  proposed_price: number;
  estimated_duration?: string;
  available_from?: string;
  available_to?: string;
  status: string;
  client_response?: string;
  responded_at?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  mission_id: string;
  payer_id: string;
  receiver_id: string;
  amount: number;
  commission_amount: number;
  net_amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  payment_proof_url?: string;
  is_held: boolean;
  held_until?: string;
  released_at?: string;
  refunded: boolean;
  refunded_at?: string;
  refund_reason?: string;
  created_at: string;
  completed_at?: string;
}

export interface Review {
  id: string;
  mission_id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  quality_rating?: number;
  punctuality_rating?: number;
  communication_rating?: number;
  is_flagged: boolean;
  is_moderated: boolean;
  moderation_reason?: string;
  provider_response?: string;
  responded_at?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  mission_id?: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  last_message_preview?: string;
  unread_count_1: number;
  unread_count_2: number;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments: string[];
  is_flagged: boolean;
  contains_phone: boolean;
  contains_email: boolean;
  read_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string;
  related_mission_id?: string;
  related_user_id?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface Dispute {
  id: string;
  mission_id: string;
  opened_by: string;
  against: string;
  reason: string;
  description: string;
  evidence_urls: string[];
  status: DisputeStatus;
  assigned_to_admin?: string;
  resolution?: string;
  resolved_at?: string;
  refund_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  provider_id: string;
  created_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discount_type: string;
  discount_value: number;
  max_uses?: number;
  current_uses: number;
  min_amount?: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  first_mission_only: boolean;
  specific_categories: string[];
  created_by?: string;
  created_at: string;
}

export interface VerificationDocument {
  id: string;
  user_id: string;
  document_type: DocumentType;
  file_url: string;
  file_name?: string;
  status: VerificationStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  uploaded_at: string;
}

export interface Withdrawal {
  id: string;
  provider_id: string;
  amount: number;
  payment_method: PaymentMethod;
  phone_number: string;
  status: string;
  processed_by?: string;
  processed_at?: string;
  transaction_id?: string;
  rejection_reason?: string;
  created_at: string;
}

// ============================================
// TYPES AVEC RELATIONS (pour les requêtes)
// ============================================

export interface MissionWithDetails extends Mission {
  client: Profile;
  category: ServiceCategory;
  provider?: Profile;
  offers?: Offer[];
}

export interface ProfileWithProvider extends Profile {
  provider_profile?: ProviderProfile;
}

export interface ConversationWithParticipants extends Conversation {
  participant_1_profile: Profile;
  participant_2_profile: Profile;
  last_message?: Message;
}

export interface NotificationWithRelations extends Notification {
  related_mission?: Mission;
  related_user?: Profile;
}

// ============================================
// TYPES POUR LES FORMULAIRES
// ============================================

export interface CreateMissionInput {
  category_id: string;
  title: string;
  description: string;
  commune: string;
  quartier?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  is_urgent?: boolean;
  preferred_date?: string;
  flexible_dates?: boolean;
  budget_min?: number;
  budget_max?: number;
  images?: string[];
}

export interface CreateOfferInput {
  mission_id: string;
  message: string;
  proposed_price: number;
  estimated_duration?: string;
  available_from?: string;
  available_to?: string;
}

export interface CreateReviewInput {
  mission_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  quality_rating?: number;
  punctuality_rating?: number;
  communication_rating?: number;
}

export interface UpdateProfileInput {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  commune?: string;
  quartier?: string;
  address?: string;
  avatar_url?: string;
}

export interface UpdateProviderProfileInput {
  company_name?: string;
  description?: string;
  years_experience?: number;
  services?: string[];
  hourly_rate?: number;
  minimum_service_price?: number;
  is_available_now?: boolean;
  accepts_urgent_requests?: boolean;
  max_distance_km?: number;
}

// ============================================
// TYPES POUR LES RÉPONSES API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ============================================
// TYPES POUR LES FILTRES
// ============================================

export interface MissionFilters {
  category?: string;
  commune?: string;
  status?: MissionStatus;
  is_urgent?: boolean;
  budget_min?: number;
  budget_max?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface ProviderFilters {
  services?: string[];
  commune?: string;
  min_rating?: number;
  max_price?: number;
  is_available_now?: boolean;
  max_distance?: number;
}

// ============================================
// TYPES POUR LES STATS
// ============================================

export interface DashboardStats {
  total_missions: number;
  active_missions: number;
  completed_missions: number;
  total_spent?: number;
  total_earned?: number;
  average_rating: number;
  total_reviews: number;
}

export interface AdminStats {
  total_users: number;
  total_clients: number;
  total_providers: number;
  total_missions: number;
  total_revenue: number;
  pending_verifications: number;
  active_disputes: number;
  missions_today: number;
}
