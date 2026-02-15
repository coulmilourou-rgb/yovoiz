'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Clock, CheckCircle, XCircle, Eye, 
  Edit, Trash2, MapPin, Euro, Calendar 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Request {
  id: string;
  title: string;
  description: string;
  category_id: string;
  commune: string;
  address: string;
  budget_min: number | null;
  budget_max: number | null;
  status: string;
  created_at: string;
  published_at: string;
  quotes_count: number;
  views_count: number;
}

export default function MesDemandesPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAllRequests(data || []);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les demandes selon le filtre actif
  const filteredRequests = filter === 'all' 
    ? allRequests 
    : allRequests.filter(req => req.status === filter);

  // Compteurs pour chaque statut
  const counts = {
    all: allRequests.length,
    published: allRequests.filter(r => r.status === 'published').length,
    completed: allRequests.filter(r => r.status === 'completed').length,
    cancelled: allRequests.filter(r => r.status === 'cancelled').length,
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;

    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadRequests();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Impossible de supprimer cette demande');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-600',
      published: 'bg-blue-600',
      in_progress: 'bg-amber-600',
      completed: 'bg-green-600',
      cancelled: 'bg-red-600'
    };

    const labels = {
      draft: '📝 Brouillon',
      published: '🌍 Publié',
      in_progress: '⏳ En cours',
      completed: '✅ Terminé',
      cancelled: '❌ Annulé'
    };

    return (
      <Badge className={`${styles[status as keyof typeof styles] || 'bg-gray-600'} text-white`}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-4xl font-bold text-yo-gray-900">
              📋 Mes Demandes
            </h1>
            <p className="text-yo-gray-600 mt-2">
              Gérez toutes vos demandes de services
            </p>
          </div>
          <Button
            onClick={() => router.push('/missions/nouvelle')}
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-md"
          >
            + Nouvelle demande
          </Button>
        </div>

        {/* Filtres */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className={filter === 'all' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'border-gray-300 text-gray-700 hover:border-orange-500'}
          >
            Toutes ({counts.all})
          </Button>
          <Button
            onClick={() => setFilter('published')}
            variant={filter === 'published' ? 'default' : 'outline'}
            className={filter === 'published' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-300 text-gray-700 hover:border-blue-500'}
          >
            <Clock className="w-4 h-4 mr-2" />
            Publiées ({counts.published})
          </Button>
          <Button
            onClick={() => setFilter('completed')}
            variant={filter === 'completed' ? 'default' : 'outline'}
            className={filter === 'completed' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-gray-300 text-gray-700 hover:border-green-500'}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Terminées ({counts.completed})
          </Button>
          <Button
            onClick={() => setFilter('cancelled')}
            variant={filter === 'cancelled' ? 'default' : 'outline'}
            className={filter === 'cancelled' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300 text-gray-700 hover:border-red-500'}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Annulées ({counts.cancelled})
          </Button>
        </div>

        {/* Liste des demandes */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-yo-gray-900 mb-2">
              Aucune demande
            </h3>
            <p className="text-yo-gray-600 mb-6">
              {filter === 'all' 
                ? 'Vous n\'avez pas encore publié de demandes'
                : `Aucune demande ${filter === 'published' ? 'publiée' : filter === 'completed' ? 'terminée' : 'annulée'}`
              }
            </p>
            <Button onClick={() => router.push('/missions/nouvelle')}>
              Créer ma première demande
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request, idx) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-yo-gray-900">
                          {request.title}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-yo-gray-600 mb-3 line-clamp-2">
                        {request.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-yo-gray-500 mb-1">Localisation</p>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4 text-yo-primary" />
                        <span className="font-bold">{request.commune}</span>
                      </div>
                    </div>

                    {(request.budget_min || request.budget_max) && (
                      <div>
                        <p className="text-xs text-yo-gray-500 mb-1">Budget</p>
                        <div className="flex items-center gap-1 text-sm">
                          <Euro className="w-4 h-4 text-green-600" />
                          <span className="font-bold">
                            {request.budget_min?.toLocaleString()}{request.budget_max && ` - ${request.budget_max.toLocaleString()}`} FCFA
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-yo-gray-500 mb-1">Vues</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="font-bold">{request.views_count}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-yo-gray-500 mb-1">Devis reçus</p>
                      <div className="flex items-center gap-1 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-bold">{request.quotes_count}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-yo-gray-200">
                    <p className="text-xs text-yo-gray-500">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Publié le {new Date(request.published_at || request.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/missions/${request.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/missions/${request.id}/edit`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(request.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
