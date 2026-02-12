// Types générés automatiquement depuis le schéma Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'requester' | 'provider' | 'both'
          first_name: string
          last_name: string
          phone: string
          commune: string
          address: string | null
          bio: string | null
          avatar_url: string | null
          id_card_number: string | null
          id_card_front_url: string | null
          id_card_back_url: string | null
          selfie_url: string | null
          verification_status: 'pending' | 'in_review' | 'approved' | 'rejected'
          verified_at: string | null
          verification_notes: string | null
          provider_level: 'bronze' | 'silver' | 'gold' | 'platinum'
          provider_categories: string[] | null
          provider_bio: string | null
          provider_experience_years: number
          total_missions: number
          completed_missions: number
          cancelled_missions: number
          average_rating: number
          total_earnings: number
          available_balance: number
          total_requests: number
          requester_rating: number
          is_active: boolean
          is_banned: boolean
          ban_reason: string | null
          last_active_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'requester' | 'provider' | 'both'
          first_name: string
          last_name: string
          phone: string
          commune: string
          address?: string | null
          bio?: string | null
          avatar_url?: string | null
        }
        Update: {
          first_name?: string
          last_name?: string
          phone?: string
          commune?: string
          address?: string | null
          bio?: string | null
          avatar_url?: string | null
          provider_categories?: string[] | null
          provider_bio?: string | null
        }
      }
      requests: {
        Row: {
          id: string
          requester_id: string
          category_id: string
          title: string
          description: string
          photos: string[] | null
          commune: string
          address: string | null
          latitude: number | null
          longitude: number | null
          budget_min: number | null
          budget_max: number | null
          preferred_date: string | null
          preferred_time: string | null
          is_urgent: boolean
          status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled'
          published_at: string | null
          expires_at: string | null
          views_count: number
          quotes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          requester_id: string
          category_id: string
          title: string
          description: string
          commune: string
          photos?: string[] | null
          address?: string | null
          budget_min?: number | null
          budget_max?: number | null
          preferred_date?: string | null
          preferred_time?: string | null
          is_urgent?: boolean
        }
        Update: {
          title?: string
          description?: string
          photos?: string[] | null
          budget_min?: number | null
          budget_max?: number | null
          status?: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled'
        }
      }
      quotes: {
        Row: {
          id: string
          request_id: string
          provider_id: string
          proposed_price: number
          message: string
          estimated_duration: number | null
          can_start_date: string | null
          status: 'pending' | 'accepted' | 'rejected' | 'expired'
          accepted_at: string | null
          rejected_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          request_id: string
          provider_id: string
          proposed_price: number
          message: string
          estimated_duration?: number | null
          can_start_date?: string | null
        }
        Update: {
          proposed_price?: number
          message?: string
          status?: 'pending' | 'accepted' | 'rejected' | 'expired'
        }
      }
      missions: {
        Row: {
          id: string
          request_id: string
          quote_id: string
          requester_id: string
          provider_id: string
          final_price: number
          commission_rate: number
          commission_amount: number
          provider_amount: number
          scheduled_date: string | null
          scheduled_time: string | null
          started_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
          cancellation_reason: string | null
          cancelled_by: string | null
          completion_photos: string[] | null
          completion_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          request_id: string
          quote_id: string
          requester_id: string
          provider_id: string
          final_price: number
          scheduled_date?: string | null
          scheduled_time?: string | null
        }
        Update: {
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
          started_at?: string | null
          completed_at?: string | null
          completion_photos?: string[] | null
          completion_notes?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          mission_id: string
          requester_id: string
          provider_id: string
          amount: number
          commission: number
          provider_amount: number
          payment_method: 'orange_money' | 'mtn_momo' | 'wave' | 'moov_money'
          phone_number: string
          cinetpay_transaction_id: string | null
          cinetpay_payment_token: string | null
          cinetpay_payment_url: string | null
          status: 'pending' | 'held_escrow' | 'released' | 'refunded' | 'cancelled'
          held_at: string | null
          auto_release_at: string | null
          released_at: string | null
          released_by: string | null
          refunded_at: string | null
          refund_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          mission_id: string
          requester_id: string
          provider_id: string
          amount: number
          commission: number
          provider_amount: number
          payment_method: 'orange_money' | 'mtn_momo' | 'wave' | 'moov_money'
          phone_number: string
        }
        Update: {
          status?: 'pending' | 'held_escrow' | 'released' | 'refunded' | 'cancelled'
          cinetpay_transaction_id?: string | null
          held_at?: string | null
          released_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          mission_id: string
          sender_id: string
          recipient_id: string
          content: string
          filtered_content: string | null
          has_blocked_content: boolean
          blocked_patterns: string[] | null
          attachments: string[] | null
          is_read: boolean
          read_at: string | null
          is_system_message: boolean
          created_at: string
        }
        Insert: {
          mission_id: string
          sender_id: string
          recipient_id: string
          content: string
          attachments?: string[] | null
        }
        Update: {
          is_read?: boolean
          read_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          mission_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          tags: string[] | null
          response: string | null
          response_at: string | null
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          mission_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          tags?: string[] | null
        }
        Update: {
          response?: string | null
          response_at?: string | null
        }
      }
      disputes: {
        Row: {
          id: string
          mission_id: string
          payment_id: string | null
          opened_by: string
          reason: string
          description: string
          evidence_urls: string[] | null
          status: 'open' | 'in_review' | 'resolved' | 'closed'
          assigned_to: string | null
          admin_notes: string | null
          resolution: string | null
          resolved_at: string | null
          refund_amount: number | null
          penalty_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          mission_id: string
          payment_id?: string | null
          opened_by: string
          reason: string
          description: string
          evidence_urls?: string[] | null
        }
        Update: {
          status?: 'open' | 'in_review' | 'resolved' | 'closed'
          assigned_to?: string | null
          admin_notes?: string | null
          resolution?: string | null
        }
      }
      withdrawals: {
        Row: {
          id: string
          provider_id: string
          amount: number
          payment_method: 'orange_money' | 'mtn_momo' | 'wave' | 'moov_money'
          phone_number: string
          status: 'pending' | 'processing' | 'completed' | 'rejected'
          processed_at: string | null
          processed_by: string | null
          transaction_id: string | null
          transaction_receipt: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          provider_id: string
          amount: number
          payment_method: 'orange_money' | 'mtn_momo' | 'wave' | 'moov_money'
          phone_number: string
        }
        Update: {
          status?: 'pending' | 'processing' | 'completed' | 'rejected'
          processed_at?: string | null
          transaction_id?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          action_url: string | null
          related_entity_type: string | null
          related_entity_id: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          type: string
          title: string
          message: string
          action_url?: string | null
          related_entity_type?: string | null
          related_entity_id?: string | null
        }
        Update: {
          is_read?: boolean
          read_at?: string | null
        }
      }
    }
    Views: {
      provider_dashboard: {
        Row: {
          id: string
          first_name: string
          last_name: string
          provider_level: string
          average_rating: number
          completed_missions: number
          available_balance: number
          active_missions: number
          pending_quotes: number
        }
      }
      requester_dashboard: {
        Row: {
          id: string
          first_name: string
          last_name: string
          requester_rating: number
          total_requests: number
          active_requests: number
          active_missions: number
        }
      }
      top_providers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          avatar_url: string | null
          commune: string
          provider_level: string
          average_rating: number
          completed_missions: number
          provider_categories: string[] | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'requester' | 'provider' | 'both'
      verification_status: 'pending' | 'in_review' | 'approved' | 'rejected'
      request_status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled'
      quote_status: 'pending' | 'accepted' | 'rejected' | 'expired'
      mission_status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
      payment_status: 'pending' | 'held_escrow' | 'released' | 'refunded' | 'cancelled'
      payment_method: 'orange_money' | 'mtn_momo' | 'wave' | 'moov_money'
      dispute_status: 'open' | 'in_review' | 'resolved' | 'closed'
      withdrawal_status: 'pending' | 'processing' | 'completed' | 'rejected'
      provider_level: 'bronze' | 'silver' | 'gold' | 'platinum'
    }
  }
}
