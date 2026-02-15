'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, User, Briefcase, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getNegotiationWithProfiles } from '@/lib/negotiations';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { NegotiationTimeline } from '@/components/negotiations/NegotiationTimeline';
import { NegotiationActions } from '@/components/negotiations/NegotiationActions';
import type { NegotiationWithProfiles } from '@/lib/types/negotiations';

interface PageProps {
  params: {
    id: string;
  };
}

export default function NegotiationPage({ params }: PageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [negotiation, setNegotiation] = useState<NegotiationWithProfiles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/connexion?redirect=/negotiations/' + params.id);
      return;
    }

    loadNegotiation();
  }, [params.id, user]);

  const loadNegotiation = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getNegotiationWithProfiles(params.id);

      if (!data) {
        throw new Error('Négociation introuvable');
      }

      // Vérifier que l'utilisateur fait partie de la négociation
      if (user && data.client_id !== user.id && data.provider_id !== user.id) {
        throw new Error('Vous n\'avez pas accès à cette négociation');
      }

      setNegotiation(data);
    } catch (err: any) {
      console.error('Erreur chargement négociation:', err);
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yo-primary/5 via-white to-yo-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yo-primary mx-auto mb-4"></div>
          <p className="text-yo-gray-600 font-bold">Chargement de la négociation...</p>
        </div>
      </div>
    );
  }

  if (error || !negotiation || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-yo-gray-900 mb-2">
            Erreur
          </h1>
          <p className="text-yo-gray-600 mb-6">
            {error || 'Impossible de charger cette négociation'}
          </p>
          <Button onClick={() => router.push('/dashboard/client')}>
            Retour au tableau de bord
          </Button>
        </Card>
      </div>
    );
  }

  const isClient = user.id === negotiation.client_id;
  const otherUser = isClient ? negotiation.provider : negotiation.client;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yo-primary/5 via-white to-yo-secondary/5">
      {/* Header */}
      <div className="bg-white border-b border-yo-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </Button>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-yo-gray-900">
                💬 Négociation en cours
              </h1>
              <p className="text-sm text-yo-gray-600">
                {negotiation.mission.title}
              </p>
            </div>

            <Badge className={`text-sm px-4 py-2 ${
              negotiation.status === 'accepted' ? 'bg-green-600' :
              negotiation.status === 'rejected' ? 'bg-red-600' :
              negotiation.status === 'expired' ? 'bg-gray-600' :
              'bg-blue-600'
            } text-white`}>
              {negotiation.status === 'accepted' && '✅ Accepté'}
              {negotiation.status === 'rejected' && '❌ Refusé'}
              {negotiation.status === 'expired' && '⏰ Expiré'}
              {negotiation.status === 'pending' && '⏳ En attente'}
              {negotiation.status === 'countered' && '🔄 Négocié'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Timeline + Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <Card className="p-6">
              <NegotiationTimeline
                proposals={negotiation.proposals}
                clientName={`${negotiation.client.first_name} ${negotiation.client.last_name}`}
                providerName={`${negotiation.provider.first_name} ${negotiation.provider.last_name}`}
                currentUserId={user.id}
                clientId={negotiation.client_id}
              />
            </Card>

            {/* Actions */}
            <NegotiationActions
              negotiation={negotiation}
              currentUserId={user.id}
              onSuccess={loadNegotiation}
            />
          </div>

          {/* Sidebar - Infos */}
          <div className="space-y-6">
            {/* Interlocuteur */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-yo-gray-900 mb-4">
                {isClient ? '👨‍🔧 Prestataire' : '👤 Client'}
              </h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-yo-primary/10 flex items-center justify-center text-2xl">
                  {isClient ? '👨‍🔧' : '👤'}
                </div>
                <div>
                  <p className="font-bold text-lg text-yo-gray-900">
                    {otherUser.first_name} {otherUser.last_name}
                  </p>
                  <p className="text-sm text-yo-gray-600">
                    {isClient ? 'Prestataire' : 'Demandeur'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Détails mission */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-yo-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Détails de la demande
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-yo-gray-500 mb-1">Titre</p>
                  <p className="font-bold text-yo-gray-900">
                    {negotiation.mission.title}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-yo-gray-500 mb-1">Catégorie</p>
                  <Badge className="bg-yo-secondary text-white">
                    {negotiation.mission.category}
                  </Badge>
                </div>

                <div className="pt-3 border-t border-yo-gray-200">
                  <Button
                    onClick={() => router.push(`/missions/${negotiation.mission_id}`)}
                    variant="outline"
                    className="w-full"
                  >
                    Voir la demande complète
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stats négociation */}
            <Card className="p-6 bg-gradient-to-br from-yo-primary/5 to-transparent">
              <h3 className="font-bold text-lg text-yo-gray-900 mb-4">
                📊 Statistiques
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-yo-gray-600">Tours</span>
                  <span className="font-bold text-yo-gray-900">
                    {negotiation.round_count} / {negotiation.max_rounds}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-yo-gray-600">Propositions</span>
                  <span className="font-bold text-yo-gray-900">
                    {negotiation.proposals.length}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-yo-gray-600">Début</span>
                  <span className="text-sm text-yo-gray-900">
                    {new Date(negotiation.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {negotiation.status === 'accepted' && negotiation.accepted_at && (
                  <div className="flex justify-between items-center pt-3 border-t border-green-200">
                    <span className="text-sm text-green-600">Accepté le</span>
                    <span className="text-sm text-green-900 font-bold">
                      {new Date(negotiation.accepted_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Aide */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-bold text-lg text-blue-900 mb-2">
                💡 Conseils
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Soyez respectueux et professionnel</li>
                <li>• Expliquez vos propositions</li>
                <li>• Répondez rapidement (72h max)</li>
                <li>• Maximum {negotiation.max_rounds} tours</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
