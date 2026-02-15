'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  MapPin, Clock, DollarSign, Calendar, Eye, MessageSquare,
  Filter, Search, TrendingUp, AlertCircle
} from 'lucide-react';

interface Request {
  id: string;
  title: string;
  description: string;
  category_id: string;
  commune: string;
  quartier: string;
  address: string;
  budget_min: number | null;
  budget_max: number | null;
  is_urgent: boolean;
  preferred_date: string | null;
  status: string;
  created_at: string;
  requester_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export default function VoirDemandesPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'today'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user && profile) {
      loadRequests();
    }
  }, [user, profile, filter]);

  const loadRequests = async () => {
    if (!user || !profile) return;

    setLoading(true);
    try {
      let query = supabase
        .from('requests')
        .select(`
          *,
          profiles:requester_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      // Filtrer par zone géographique de l'utilisateur
      if (profile.commune) {
        query = query.eq('commune', profile.commune);
      }

      // Filtres additionnels
      if (filter === 'urgent') {
        query = query.eq('is_urgent', true);
      } else if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        query = query.gte('created_at', today);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      setRequests(data || []);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      req.title.toLowerCase().includes(search) ||
      req.description.toLowerCase().includes(search) ||
      req.category_id.toLowerCase().includes(search)
    );
  });

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours}h`;
    return 'À l\'instant';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yo-orange"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-yo-black mb-2">
              Demandes dans votre zone
            </h2>
            <div className="flex items-center gap-2 text-yo-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{profile?.commune || 'Votre commune'}</span>
            </div>
          </div>
          <Badge className="bg-yo-orange-pale text-yo-orange px-4 py-2">
            {filteredRequests.length} demande{filteredRequests.length > 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yo-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une demande..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-yo-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yo-orange focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-yo-orange text-white'
                  : 'bg-white text-yo-gray-600 border border-yo-gray-200 hover:border-yo-orange'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('urgent')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'urgent'
                  ? 'bg-yo-orange text-white'
                  : 'bg-white text-yo-gray-600 border border-yo-gray-200 hover:border-yo-orange'
              }`}
            >
              🔥 Urgentes
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'today'
                  ? 'bg-yo-orange text-white'
                  : 'bg-white text-yo-gray-600 border border-yo-gray-200 hover:border-yo-orange'
              }`}
            >
              Aujourd'hui
            </button>
          </div>
        </div>
      </Card>

      {/* Liste des demandes */}
      {filteredRequests.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="w-16 h-16 text-yo-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-yo-black mb-2">
            Aucune demande pour le moment
          </h3>
          <p className="text-yo-gray-600 mb-6">
            Les nouvelles demandes dans votre zone apparaîtront ici
          </p>
          <Button
            onClick={() => router.push('/profile/perimeter')}
            className="bg-yo-orange text-white"
          >
            Gérer mon périmètre
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="p-6 hover:shadow-yo-md transition-all cursor-pointer"
              onClick={() => router.push(`/missions/${request.id}`)}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Avatar demandeur */}
                <div className="flex-shrink-0">
                  {request.profiles?.avatar_url ? (
                    <img
                      src={request.profiles.avatar_url}
                      alt={request.profiles.first_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yo-orange to-yo-green flex items-center justify-center text-white font-bold">
                      {request.profiles?.first_name?.[0] || '?'}
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-yo-black mb-1 line-clamp-1">
                        {request.title}
                      </h3>
                      <p className="text-sm text-yo-gray-600 line-clamp-2 mb-3">
                        {request.description}
                      </p>
                    </div>
                    {request.is_urgent && (
                      <Badge className="bg-red-100 text-red-700 flex-shrink-0">
                        🔥 Urgent
                      </Badge>
                    )}
                  </div>

                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-yo-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{request.commune}{request.quartier && ` • ${request.quartier}`}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeAgo(request.created_at)}</span>
                    </div>
                    {(request.budget_min || request.budget_max) && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {request.budget_min && request.budget_max
                            ? `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()} FCFA`
                            : request.budget_min
                            ? `À partir de ${request.budget_min.toLocaleString()} FCFA`
                            : `Jusqu'à ${request.budget_max?.toLocaleString()} FCFA`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/missions/${request.id}`);
                      }}
                      className="bg-yo-orange text-white hover:bg-yo-orange-dark"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir les détails
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/negotiations?request_id=${request.id}`);
                      }}
                      className="bg-white text-yo-orange border border-yo-orange hover:bg-yo-orange hover:text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Proposer mes services
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
