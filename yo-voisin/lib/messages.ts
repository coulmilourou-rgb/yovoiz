// lib/messages.ts
// Fonctions de gestion de la messagerie temps réel

import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  request_id?: string | null;
  mission_id?: string | null;
  negotiation_id?: string | null;
  last_message_content?: string | null;
  last_message_at: string;
  last_message_by?: string | null;
  unread_count_user1: number;
  unread_count_user2: number;
  created_at: string;
  other_user?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments: any[];
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

/**
 * Récupérer toutes les conversations de l'utilisateur
 */
export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user1:profiles!conversations_user1_id_fkey(id, first_name, last_name, avatar_url),
        user2:profiles!conversations_user2_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });

    if (error) throw error;

    // Enrichir avec other_user
    const enriched = (data || []).map(conv => {
      const isUser1 = conv.user1_id === userId;
      return {
        ...conv,
        other_user: isUser1 ? conv.user2 : conv.user1
      };
    });

    return enriched;
  } catch (error) {
    console.error('❌ Erreur getUserConversations:', error);
    return [];
  }
};

/**
 * Créer ou récupérer une conversation
 */
export const getOrCreateConversation = async (
  user1Id: string,
  user2Id: string,
  context?: { requestId?: string; missionId?: string; negotiationId?: string }
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('get_or_create_conversation', {
      p_user1_id: user1Id,
      p_user2_id: user2Id,
      p_request_id: context?.requestId || null,
      p_mission_id: context?.missionId || null
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('❌ Erreur getOrCreateConversation:', error);
    return null;
  }
};

/**
 * Récupérer les messages d'une conversation
 */
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('❌ Erreur getMessages:', error);
    return [];
  }
};

/**
 * Envoyer un message
 */
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message | null> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content.trim()
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('❌ Erreur sendMessage:', error);
    return null;
  }
};

/**
 * Marquer les messages comme lus
 */
export const markAsRead = async (conversationId: string, userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('mark_messages_as_read', {
      p_conversation_id: conversationId,
      p_user_id: userId
    });

    if (error) throw error;

    return data || 0;
  } catch (error) {
    console.error('❌ Erreur markAsRead:', error);
    return 0;
  }
};

/**
 * S'abonner aux nouveaux messages (Realtime)
 */
export const subscribeToMessages = (
  conversationId: string,
  onMessage: (message: Message) => void
): RealtimeChannel => {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      async (payload) => {
        // Enrichir avec sender
        const { data } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(id, first_name, last_name, avatar_url)
          `)
          .eq('id', payload.new.id)
          .single();

        if (data) {
          onMessage(data);
        }
      }
    )
    .subscribe();

  return channel;
};

/**
 * S'abonner aux mises à jour de conversations (Realtime)
 */
export const subscribeToConversations = (
  userId: string,
  onUpdate: (conversation: Conversation) => void
): RealtimeChannel => {
  const channel = supabase
    .channel(`conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `user1_id=eq.${userId}`
      },
      async (payload) => {
        const { data } = await supabase
          .from('conversations')
          .select(`
            *,
            user1:profiles!conversations_user1_id_fkey(id, first_name, last_name, avatar_url),
            user2:profiles!conversations_user2_id_fkey(id, first_name, last_name, avatar_url)
          `)
          .eq('id', payload.new.id)
          .single();

        if (data) {
          const isUser1 = data.user1_id === userId;
          onUpdate({
            ...data,
            other_user: isUser1 ? data.user2 : data.user1
          });
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `user2_id=eq.${userId}`
      },
      async (payload) => {
        const { data } = await supabase
          .from('conversations')
          .select(`
            *,
            user1:profiles!conversations_user1_id_fkey(id, first_name, last_name, avatar_url),
            user2:profiles!conversations_user2_id_fkey(id, first_name, last_name, avatar_url)
          `)
          .eq('id', payload.new.id)
          .single();

        if (data) {
          const isUser1 = data.user1_id === userId;
          onUpdate({
            ...data,
            other_user: isUser1 ? data.user2 : data.user1
          });
        }
      }
    )
    .subscribe();

  return channel;
};

/**
 * Supprimer un message (soft delete)
 */
export const deleteMessage = async (messageId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .eq('sender_id', userId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('❌ Erreur deleteMessage:', error);
    return false;
  }
};

/**
 * Obtenir le nombre total de messages non lus
 */
export const getTotalUnreadCount = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('unread_count_user1, unread_count_user2, user1_id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (error) throw error;

    const total = (data || []).reduce((sum, conv) => {
      const isUser1 = conv.user1_id === userId;
      return sum + (isUser1 ? conv.unread_count_user1 : conv.unread_count_user2);
    }, 0);

    return total;
  } catch (error) {
    console.error('❌ Erreur getTotalUnreadCount:', error);
    return 0;
  }
};
