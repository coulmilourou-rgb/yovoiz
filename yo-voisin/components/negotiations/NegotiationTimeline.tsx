'use client';

import { motion } from 'framer-motion';
import { DollarSign, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import type { Proposal } from '@/lib/types/negotiations';

interface NegotiationTimelineProps {
  proposals: Proposal[];
  clientName: string;
  providerName: string;
  currentUserId: string;
  clientId: string;
}

export const NegotiationTimeline = ({
  proposals,
  clientName,
  providerName,
  currentUserId,
  clientId
}: NegotiationTimelineProps) => {
  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'Ã FCFA l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
    return `Il y a ${Math.floor(seconds / 86400)}j`;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl text-yo-gray-900 mb-6">
        ðŸ“Š Historique des propositions
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-yo-gray-200" />

        {proposals.map((proposal, idx) => {
          const isClient = proposal.proposer === 'client';
          const proposerName = isClient ? clientName : providerName;
          const isMe = (isClient && currentUserId === clientId) || (!isClient && currentUserId !== clientId);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="relative pl-20 pb-8"
            >
              {/* Avatar */}
              <div className="absolute left-0 w-16 h-16">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                  isClient ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {isClient ? 'ðŸ‘¤' : 'ðŸ‘¨â FCFAðŸ”§'}
                </div>
              </div>

              {/* Card */}
              <Card className={`p-5 ${
                isClient 
                  ? 'border-2 border-blue-200 bg-blue-50/50' 
                  : 'border-2 border-green-200 bg-green-50/50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg text-yo-gray-900">
                      {proposerName} {isMe && '(Vous)'}
                    </p>
                    <p className="text-sm text-yo-gray-500">
                      {getTimeAgo(proposal.created_at)}
                    </p>
                  </div>
                  
                  <Badge className={`text-xl font-bold px-4 py-2 ${
                    isClient ? 'bg-blue-600' : 'bg-green-600'
                  } text-white`}>
                    <DollarSign className="w-5 h-5 mr-2" />
                    {proposal.amount.toLocaleString()} FCFA
                  </Badge>
                </div>

                {proposal.message && (
                  <div className="mt-3 p-3 bg-white rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-5 h-5 text-yo-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yo-gray-700 italic">
                        "{proposal.message}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Round indicator */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Tour {idx + 1} â FCFA¢ Expire le {new Date(proposal.expires_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
