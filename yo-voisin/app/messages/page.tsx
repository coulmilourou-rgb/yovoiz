'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, MoreVertical, Search, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  getUserConversations,
  getMessages,
  sendMessage,
  markAsRead,
  subscribeToMessages,
  subscribeToConversations,
  getTotalUnreadCount,
  type Conversation,
  type Message
} from '@/lib/messages';

export default function MessagesPage() {
  usePageTitle('Messagerie');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUnread, setTotalUnread] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Charger conversations au montage
  useEffect(() => {
    if (user) {
      loadConversations();
      loadUnreadCount();
    }
  }, [user]);

  // Auto-sélectionner conversation depuis URL
  useEffect(() => {
    const convId = searchParams.get('conv');
    if (convId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === convId);
      if (conv) {
        selectConversation(conv);
      }
    }
  }, [searchParams, conversations]);

  // Abonnement Realtime conversations
  useEffect(() => {
    if (!user) return;

    const channel = subscribeToConversations(user.id, (updated) => {
      setConversations(prev => {
        const index = prev.findIndex(c => c.id === updated.id);
        if (index >= 0) {
          const newList = [...prev];
          newList[index] = updated;
          return newList.sort((a, b) => 
            new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
          );
        }
        return [updated, ...prev];
      });
      loadUnreadCount();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  // Abonnement Realtime messages
  useEffect(() => {
    if (!selectedConv) return;

    const channel = subscribeToMessages(selectedConv.id, (newMsg) => {
      setMessages(prev => {
        // Éviter doublons
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      // Marquer comme lu si pas moi
      if (user && newMsg.sender_id !== user.id) {
        setTimeout(() => markAsRead(selectedConv.id, user.id), 500);
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [selectedConv, user]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getUserConversations(user.id);
      setConversations(data);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!user) return;
    const count = await getTotalUnreadCount(user.id);
    setTotalUnread(count);
  };

  const selectConversation = async (conv: Conversation) => {
    setSelectedConv(conv);
    setMessages([]);

    // Charger messages
    const msgs = await getMessages(conv.id);
    setMessages(msgs);

    // Marquer comme lu
    if (user) {
      await markAsRead(conv.id, user.id);
      loadUnreadCount();
    }

    // Focus input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || !user) return;

    setSending(true);
    try {
      const msg = await sendMessage(selectedConv.id, user.id, newMessage);
      if (msg) {
        setMessages(prev => [...prev, msg]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    const name = `${conv.other_user?.first_name} ${conv.other_user?.last_name}`.toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  const getUnreadCount = (conv: Conversation) => {
    if (!user) return 0;
    const isUser1 = conv.user1_id === user.id;
    return isUser1 ? conv.unread_count_user1 : conv.unread_count_user2;
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yo-primary/5 via-white to-yo-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yo-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yo-primary/5 via-white to-yo-secondary/5">
      <Navbar
        isConnected={true}
        user={{
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-yo-gray-900 flex items-center gap-3">
              💬 Messages
              {totalUnread > 0 && (
                <Badge className="bg-red-600 text-white text-lg px-3 py-1">
                  {totalUnread}
                </Badge>
              )}
            </h1>
            <p className="text-yo-gray-600 mt-2">
              Discutez avec vos clients et prestataires
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
          {/* Liste conversations */}
          <Card className="p-4 overflow-hidden flex flex-col">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yo-gray-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-11"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yo-primary mx-auto"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">💬</div>
                  <p className="text-sm text-yo-gray-600">
                    {searchTerm ? 'Aucun résultat' : 'Aucune conversation'}
                  </p>
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const unread = getUnreadCount(conv);
                  const isSelected = selectedConv?.id === conv.id;

                  return (
                    <motion.div
                      key={conv.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-yo-primary text-white' 
                          : 'bg-white hover:bg-yo-gray-50'
                      }`}
                      onClick={() => selectConversation(conv)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 ${
                          isSelected ? 'bg-white/20' : 'bg-yo-primary/10'
                        }`}>
                          {conv.other_user?.avatar_url ? (
                            <img 
                              src={conv.other_user.avatar_url} 
                              alt={conv.other_user.first_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className={isSelected ? 'text-white' : 'text-yo-primary'}>
                              {conv.other_user?.first_name?.[0]}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-bold truncate ${isSelected ? 'text-white' : 'text-yo-gray-900'}`}>
                              {conv.other_user?.first_name} {conv.other_user?.last_name}
                            </h3>
                            {unread > 0 && !isSelected && (
                              <Badge className="bg-red-600 text-white text-xs px-2">
                                {unread}
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm truncate ${isSelected ? 'text-white/80' : 'text-yo-gray-600'}`}>
                            {conv.last_message_content || 'Aucun message'}
                          </p>
                          <p className={`text-xs mt-1 ${isSelected ? 'text-white/60' : 'text-yo-gray-500'}`}>
                            {new Date(conv.last_message_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Zone de chat */}
          <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col">
            {selectedConv ? (
              <>
                {/* Header chat */}
                <div className="p-4 border-b border-yo-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setSelectedConv(null)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <div className="w-10 h-10 rounded-full bg-yo-primary/10 flex items-center justify-center text-lg font-bold">
                        {selectedConv.other_user?.avatar_url ? (
                          <img 
                            src={selectedConv.other_user.avatar_url} 
                            alt={selectedConv.other_user.first_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-yo-primary">
                            {selectedConv.other_user?.first_name?.[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <h2 className="font-bold text-lg text-yo-gray-900">
                          {selectedConv.other_user?.first_name} {selectedConv.other_user?.last_name}
                        </h2>
                        <p className="text-xs text-yo-gray-500">En ligne</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-yo-gray-50 to-white">
                  <AnimatePresence>
                    {messages.map((msg, idx) => {
                      const isMe = msg.sender_id === user?.id;
                      const showAvatar = idx === 0 || messages[idx - 1].sender_id !== msg.sender_id;

                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                        >
                          {showAvatar ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                              isMe ? 'bg-yo-primary text-white' : 'bg-yo-secondary text-white'
                            }`}>
                              {msg.sender?.first_name?.[0] || '?'}
                            </div>
                          ) : (
                            <div className="w-8" />
                          )}

                          <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div className={`px-4 py-2 rounded-2xl ${
                              isMe 
                                ? 'bg-yo-primary text-white rounded-tr-none' 
                                : 'bg-white text-yo-gray-900 border border-yo-gray-200 rounded-tl-none'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {msg.content}
                              </p>
                            </div>
                            <p className="text-xs text-yo-gray-500 mt-1 px-2">
                              {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input message */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-yo-gray-200">
                  <div className="flex gap-3">
                    <Input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      disabled={sending}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="bg-yo-primary hover:bg-yo-primary-dark text-white px-6"
                    >
                      {sending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-12">
                <div>
                  <div className="text-8xl mb-6">💬</div>
                  <h3 className="text-2xl font-bold text-yo-gray-900 mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-yo-gray-600">
                    Choisissez une conversation pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
