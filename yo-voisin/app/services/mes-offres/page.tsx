'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, Eye, Edit, Trash2, Power, PowerOff,
  Euro, MapPin, Clock, TrendingUp, MessageSquare, Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

interface ServiceOffer {
  id: string;
  category: string;
  title: string;
  description: string;
  pricing_type: 'hourly' | 'fixed';
  price_hourly?: number;
  price_fixed_min?: number;
  price_fixed_max?: number;
  communes: string[];
  status: 'active' | 'inactive' | 'pending';
  views_count: number;
  requests_count: number;
  created_at: string;
  updated_at: string;
}

export default function MesOffresPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  
  const [offers, setOffers] = useState<ServiceOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/connexion');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchOffers();
    }
  }, [user, filterStatus]);

  const fetchOffers = async () => {
    try {
      setLoadingOffers(true);

      let query = supabase
        .from('service_offers')
        .select('*')
        .eq('provider_id', user!.id)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur chargement offres:', error);
        return;
      }

      setOffers(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoadingOffers(false);
    }
  };

  const toggleStatus = async (offerId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    const { error } = await supabase
      .from('service_offers')
      .update({ status: newStatus })
      .eq('id', offerId);

    if (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du changement de statut');
      return;
    }

    fetchOffers();
  };

  const deleteOffer = async (offerId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      return;
    }

    const { error } = await supabase
      .from('service_offers')
      .delete()
      .eq('id', offerId);

    if (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
      return;
    }

    fetchOffers();
    alert('✅ Offre supprimée');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-yo-green text-white">🟢 Active</Badge>;
      case 'inactive':
        return <Badge className="bg-yo-gray-400 text-white">⚫ Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yo-orange text-white">⏳ En attente</Badge>;
      default:
        return null;
    }
  };

  const getPriceDisplay = (offer: ServiceOffer) => {
    if (offer.pricing_type === 'hourly') {
      return `${offer.price_hourly?.toLocaleString()} FCFA/h`;
    }
    return `${offer.price_fixed_min?.toLocaleString()} - ${offer.price_fixed_max?.toLocaleString()} FCFA`;
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar isConnected={!!user} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton width="100%" height={200} className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} width="100%" height={300} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <Navbar 
        isConnected={true} 
        user={{
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-4xl text-yo-green-dark mb-2">
              📊 Mes offres de services
            </h1>
            <p className="text-yo-gray-600 text-lg">
              Gérez vos services et suivez vos performances
            </p>
          </div>
          <Button
            onClick={() => router.push('/services/nouvelle-offre')}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle offre
          </Button>
        </div>

        {/* Stats globales */}
        {!loadingOffers && offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yo-gray-600 mb-1">Offres actives</p>
                  <p className="text-3xl font-bold text-yo-green-dark">
                    {offers.filter(o => o.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yo-green/10 flex items-center justify-center">
                  <Power className="w-6 h-6 text-yo-green" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yo-gray-600 mb-1">Vues totales</p>
                  <p className="text-3xl font-bold text-yo-orange">
                    {offers.reduce((sum, o) => sum + (o.views_count || 0), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yo-orange/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-yo-orange" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yo-gray-600 mb-1">Demandes reçues</p>
                  <p className="text-3xl font-bold text-yo-green">
                    {offers.reduce((sum, o) => sum + (o.requests_count || 0), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yo-green/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-yo-green" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yo-gray-600 mb-1">Taux de conversion</p>
                  <p className="text-3xl font-bold text-yo-gray-900">
                    {offers.reduce((sum, o) => sum + (o.views_count || 0), 0) > 0
                      ? Math.round((offers.reduce((sum, o) => sum + (o.requests_count || 0), 0) / offers.reduce((sum, o) => sum + (o.views_count || 0), 0)) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yo-green/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yo-green" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filtres */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant={filterStatus === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            Toutes
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStatus('active')}
          >
            🟢 Actives
          </Button>
          <Button
            variant={filterStatus === 'inactive' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterStatus('inactive')}
          >
            ⚫ Inactives
          </Button>
        </div>

        {/* Liste offres */}
        {loadingOffers ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} width="100%" height={300} />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-yo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-yo-gray-400" />
              </div>
              <h3 className="font-display font-bold text-2xl text-yo-gray-800 mb-2">
                Aucune offre pour le moment
              </h3>
              <p className="text-yo-gray-600 mb-6">
                Créez votre première offre pour commencer à recevoir des demandes
              </p>
              <Button onClick={() => router.push('/services/nouvelle-offre')}>
                <Plus className="w-5 h-5 mr-2" />
                Créer ma première offre
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 hover:shadow-lg transition h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary">{offer.category}</Badge>
                    {getStatusBadge(offer.status)}
                  </div>

                  {/* Titre */}
                  <h3 className="font-display font-bold text-xl text-yo-gray-900 mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-sm text-yo-gray-600 mb-4 line-clamp-2 flex-1">
                    {offer.description}
                  </p>

                  {/* Prix */}
                  <div className="flex items-center gap-2 mb-4">
                    <Euro className="w-5 h-5 text-yo-green" />
                    <span className="font-bold text-lg text-yo-green-dark">
                      {getPriceDisplay(offer)}
                    </span>
                  </div>

                  {/* Zones */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-yo-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{offer.communes.length} commune{offer.communes.length > 1 ? 's' : ''}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-yo-gray-200 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yo-gray-900">{offer.views_count || 0}</p>
                      <p className="text-xs text-yo-gray-500">Vues</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yo-green">{offer.requests_count || 0}</p>
                      <p className="text-xs text-yo-gray-500">Demandes</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/services/offres/${offer.id}/edit`)}
                      className="flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </Button>

                    <Button
                      variant={offer.status === 'active' ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => toggleStatus(offer.id, offer.status)}
                      className="flex items-center justify-center gap-2"
                    >
                      {offer.status === 'active' ? (
                        <>
                          <PowerOff className="w-4 h-4" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4" />
                          Activer
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => deleteOffer(offer.id)}
                    className="w-full mt-2 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
