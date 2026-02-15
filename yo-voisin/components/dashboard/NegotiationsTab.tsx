'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserNegotiations } from '@/lib/negotiations';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { NegotiationWithProfiles } from '@/lib/types/negotiations';

export const NegotiationsTab = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [negotiations, setNegotiations] = useState<NegotiationWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    if (user) {
      loadNegotiations();
    }
  }, [user, filter]);

  const loadNegotiations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getUserNegotiations(
        user.id,
        filter === 'all' ? undefined : filter
      );
      setNegotiations(data);
    } catch (error) {
      console.error('Erreur chargement nÃ©gociations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime();
    const expires = new Date(expiresAt).getTime();
    const diff = expires - now;

    if (diff <= 0) return 'ExpirÃ©';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}j`;
    }
    return `${hours}h`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-blue-600 text-white',
      countered: 'bg-amber-600 text-white',
      accepted: 'bg-green-600 text-white',
      rejected: 'bg-red-600 text-white',
      expired: 'bg-gray-600 text-white'
    };

    const labels = {
      pending: 'â³ En attente',
      countered: 'ðŸ”„ NÃ©gociÃ©',
      accepted: 'âœ… AcceptÃ©',
      rejected: 'âŒ RefusÃ©',
      expired: 'â° ExpirÃ©'
    };

    return (
      <Badge className={styles[status as keyof typeof styles] || 'bg-gray-600 text-white'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className={filter === 'all' ? 'bg-yo-primary text-white' : ''}
        >
          Toutes ({negotiations.length})
        </Button>
        <Button
          onClick={() => setFilter('pending')}
          variant={filter === 'pending' ? 'default' : 'outline'}
          className={filter === 'pending' ? 'bg-blue-600 text-white' : ''}
        >
          <Clock className="w-4 h-4 mr-2" />
          En attente
        </Button>
        <Button
          onClick={() => setFilter('accepted')}
          variant={filter === 'accepted' ? 'default' : 'outline'}
          className={filter === 'accepted' ? 'bg-green-600 text-white' : ''}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          AcceptÃ©es
        </Button>
        <Button
          onClick={() => setFilter('rejected')}
          variant={filter === 'rejected' ? 'default' : 'outline'}
          className={filter === 'rejected' ? 'bg-red-600 text-white' : ''}
        >
          <XCircle className="w-4 h-4 mr-2" />
          RefusÃ©es
        </Button>
      </div>

      {/* Liste */}
      {negotiations.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">ðŸ’¬</div>
          <h3 className="text-xl font-bold text-yo-gray-900 mb-2">
            Aucune nÃ©gociation
          </h3>
          <p className="text-yo-gray-600 mb-6">
            {filter === 'all' 
              ? 'Vous n\'avez pas encore de nÃ©gociations'
              : `Aucune nÃ©gociation ${filter === 'pending' ? 'en attente' : filter === 'accepted' ? 'acceptÃ©e' : 'refusÃ©e'}`
            }
          </p>
          <Button onClick={() => router.push('/missions')}>
            Parcourir les demandes
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {negotiations.map((nego, idx) => {
            const isClient = user?.id === nego.client_id;
            const otherUser = isClient ? nego.provider : nego.client;
            const isMyTurn = (
              (nego.current_proposer === 'provider' && isClient) ||
              (nego.current_proposer === 'client' && !isClient)
            );

            return (
              <motion.div
                key={nego.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card 
                  className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                    isMyTurn && !['accepted', 'rejected', 'expired'].includes(nego.status)
                      ? 'border-2 border-yo-primary'
                      : ''
                  }`}
                  onClick={() => router.push(`/negotiations/${nego.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-yo-gray-900 mb-2">
                        {nego.mission.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-yo-gray-600">
                        <span>
                          {isClient ? 'ðŸ‘¨â FCFAðŸ”§' : 'ðŸ‘¤'} {otherUser.first_name} {otherUser.last_name}
                        </span>
                        <span>â FCFA¢</span>
                        <Badge className="bg-yo-secondary text-white text-xs">
                          {nego.mission.category}
                        </Badge>
                      </div>
                    </div>
                    {getStatusBadge(nego.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-yo-gray-600 mb-1">Montant actuel</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-5 h-5 text-yo-primary" />
                        <p className="text-xl font-bold text-yo-gray-900">
                          {nego.current_amount.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-yo-gray-600 mb-1">Propositions</p>
                      <p className="text-xl font-bold text-yo-gray-900">
                        {nego.proposals.length} / {nego.max_rounds}
                      </p>
                    </div>

                    {!['accepted', 'rejected', 'expired'].includes(nego.status) && (
                      <div>
                        <p className="text-sm text-yo-gray-600 mb-1">Expire dans</p>
                        <p className="text-xl font-bold text-yo-gray-900">
                          {getTimeRemaining(nego.expires_at)}
                        </p>
                      </div>
                    )}
                  </div>

                  {isMyTurn && !['accepted', 'rejected', 'expired'].includes(nego.status) && (
                    <div className="bg-yo-primary/10 border border-yo-primary/20 rounded-lg p-3">
                      <p className="text-sm font-bold text-yo-primary">
                        ðŸ”” Ã FCFA votre tour de rÃ©pondre !
                      </p>
                    </div>
                  )}

                  {nego.status === 'accepted' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-bold text-green-800">
                        âœ… NÃ©gociation finalisÃ©e le {new Date(nego.accepted_at!).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-yo-gray-200 flex justify-between items-center">
                    <p className="text-xs text-yo-gray-500">
                      CrÃ©Ã©e le {new Date(nego.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/negotiations/${nego.id}`);
                      }}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Voir dÃ©tails
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
