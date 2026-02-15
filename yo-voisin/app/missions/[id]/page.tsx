'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, Euro, User, 
  Clock, TrendingUp, MessageSquare, Share2 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProposeQuoteModal } from '@/components/missions/ProposeQuoteModal';

interface PageProps {
  params: {
    id: string;
  };
}

interface Request {
  id: string;
  title: string;
  description: string;
  category_id: string;
  budget_min: number | null;
  budget_max: number | null;
  address: string;
  quartier: string | null;
  commune: string;
  is_urgent: boolean;
  status: string;
  created_at: string;
  published_at: string | null;
  requester_id: string;
  requester: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    commune: string;
  };
}

export default function MissionDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    loadRequest();
  }, [params.id]);

  const loadRequest = async () => {
    setLoading(true);

    try {
      // Charger la demande
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .select('*')
        .eq('id', params.id)
        .single();

      if (requestError) throw requestError;

      if (requestData) {
        // Charger le profil du demandeur
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, commune')
          .eq('id', requestData.requester_id)
          .single();

        if (!profileError && profileData) {
          setRequest({
            ...requestData,
            requester: profileData
          } as Request);
        } else {
          // Si le profil n'est pas trouvé, utiliser des valeurs par défaut
          setRequest({
            ...requestData,
            requester: {
              id: requestData.requester_id,
              first_name: 'Utilisateur',
              last_name: 'Anonyme',
              avatar_url: null,
              commune: requestData.commune || 'Non spécifié'
            }
          } as Request);
        }
      }
    } catch (error) {
      console.error('Erreur chargement demande:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yo-primary/5 via-white to-yo-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yo-primary mx-auto mb-4"></div>
          <p className="text-yo-gray-600 font-bold">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-yo-gray-900 mb-2">
            Demande introuvable
          </h1>
          <p className="text-yo-gray-600 mb-6">
            Cette demande n'existe pas ou a été supprimée
          </p>
          <Button onClick={() => router.push('/missions')}>
            Voir toutes les demandes
          </Button>
        </Card>
      </div>
    );
  }

  const isMyRequest = user?.id === request.requester_id;
  const canPropose = user && !isMyRequest;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yo-primary/5 via-white to-yo-secondary/5">
      {/* Header */}
      <div className="bg-white border-b border-yo-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Titre + Status */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Badge className="bg-yo-secondary text-white mb-3">
                    {request.category_id}
                  </Badge>
                  <h1 className="text-3xl font-bold text-yo-gray-900 mb-2">
                    {request.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-yo-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(request.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    {request.is_urgent && (
                      <Badge className="bg-red-600 text-white">
                        🔥 Urgent
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Partager
                </Button>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-yo-gray-900 mb-4">
                📋 Description
              </h2>
              <p className="text-yo-gray-700 whitespace-pre-wrap leading-relaxed">
                {request.description}
              </p>
            </Card>

            {/* Budget */}
            {(request.budget_min || request.budget_max) && (
              <Card className="p-6 bg-gradient-to-br from-green-50 to-transparent">
                <h2 className="text-xl font-bold text-yo-gray-900 mb-4 flex items-center gap-2">
                  <Euro className="w-6 h-6 text-green-600" />
                  Budget indicatif
                </h2>
                <div className="flex items-center gap-3">
                  {request.budget_min && (
                    <div>
                      <p className="text-sm text-yo-gray-600">Minimum</p>
                      <p className="text-2xl font-bold text-green-600">
                        {request.budget_min.toLocaleString()} FCFA
                      </p>
                    </div>
                  )}
                  {request.budget_min && request.budget_max && (
                    <span className="text-2xl text-yo-gray-400">→</span>
                  )}
                  {request.budget_max && (
                    <div>
                      <p className="text-sm text-yo-gray-600">Maximum</p>
                      <p className="text-2xl font-bold text-green-600">
                        {request.budget_max.toLocaleString()} FCFA
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Localisation */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-yo-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-yo-primary" />
                Localisation
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-yo-gray-600">Commune :</span>
                  <span className="font-bold text-yo-gray-900">{request.commune}</span>
                </div>
                {request.quartier && (
                  <div className="flex items-center gap-2">
                    <span className="text-yo-gray-600">Quartier :</span>
                    <span className="font-bold text-yo-gray-900">{request.quartier}</span>
                  </div>
                )}
                <div className="text-sm text-yo-gray-500 mt-2">
                  📍 {request.address}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client info */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-yo-gray-900 mb-4">
                👤 Demandeur
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-yo-primary/10 flex items-center justify-center text-2xl">
                  {request.requester.avatar_url ? (
                    <img 
                      src={request.requester.avatar_url} 
                      alt={request.requester.first_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    '👤'
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg text-yo-gray-900">
                    {request.requester.first_name} {request.requester.last_name}
                  </p>
                  <p className="text-sm text-yo-gray-600">
                    {request.requester.commune}
                  </p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            {canPropose && (
              <Card className="p-6 bg-gradient-to-br from-yo-primary/5 to-transparent">
                <h3 className="font-bold text-lg text-yo-gray-900 mb-4">
                  💼 Intéressé par cette demande ?
                </h3>
                <Button
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full bg-yo-primary hover:bg-yo-primary-dark text-white font-bold py-4 text-lg"
                >
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Proposer un devis
                </Button>
                <p className="text-xs text-yo-gray-500 text-center mt-3">
                  Gratuit et sans engagement
                </p>
              </Card>
            )}

            {isMyRequest && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="text-center">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="font-bold text-lg text-blue-900 mb-2">
                    C'est votre demande
                  </h3>
                  <p className="text-sm text-blue-700">
                    Vous recevrez les devis des prestataires par notification
                  </p>
                </div>
              </Card>
            )}

            {/* Conseils */}
            <Card className="p-6 bg-amber-50 border-amber-200">
              <h3 className="font-bold text-lg text-amber-900 mb-3">
                💡 Conseils
              </h3>
              <ul className="text-sm text-amber-800 space-y-2">
                <li>• Proposez un tarif juste et transparent</li>
                <li>• Expliquez votre expérience</li>
                <li>• Indiquez vos disponibilités</li>
                <li>• Soyez réactif dans la négociation</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal proposition devis */}
      <AnimatePresence>
        {showQuoteModal && user && (
          <ProposeQuoteModal
            missionId={request.id}
            missionTitle={request.title}
            clientId={request.requester_id}
            providerId={user.id}
            onClose={() => setShowQuoteModal(false)}
            onSuccess={(negotiationId) => {
              console.log('✅ Négociation créée:', negotiationId);
              setShowQuoteModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
