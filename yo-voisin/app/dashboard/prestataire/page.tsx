'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyOpportunities } from '@/components/ui/EmptyState';
import { 
  Search, 
  Briefcase, 
  DollarSign, 
  Star,
  TrendingUp,
  Eye,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  created_at: string;
  commune: string;
  quartier?: string;
  client: {
    first_name: string;
    last_name: string;
    average_rating?: number;
  };
}

interface Candidature {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  proposed_price: number;
  message: string;
  created_at: string;
  mission: {
    id: string;
    title: string;
    status: string;
  };
}

interface Stats {
  active_missions: number;
  total_earned: number;
  average_rating: number;
  pending_candidatures: number;
}

export default function ProviderDashboard() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [stats, setStats] = useState<Stats>({
    active_missions: 0,
    total_earned: 0,
    average_rating: 0,
    pending_candidatures: 0
  });
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<'opportunities' | 'candidatures'>('opportunities');

  // Charger le profil dès l'arrivée sur le dashboard
  useEffect(() => {
    if (user && !profile && !loading) {
      console.log('📥 Dashboard Prestataire - Chargement du profil...');
      refreshProfile().catch(err => {
        console.warn('⚠️ Profil non chargé:', err);
      });
    }
  }, [user, profile, loading, refreshProfile]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/connexion');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Charger les données même si le profil n'est pas encore chargé
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch opportunities (published missions) - simplifié
      const { data: opportunitiesData, error: oppError } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20);

      if (oppError) {
        console.error('Erreur chargement opportunités:', oppError);
      }
      setOpportunities(opportunitiesData || []);

      // Fetch my active missions (as provider)
      const { data: myMissions, error: myMissionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('provider_id', user?.id)
        .eq('status', 'in_progress');

      if (myMissionsError) {
        console.error('Erreur chargement mes missions:', myMissionsError);
      }

      // Calculate stats
      const totalEarned = await calculateTotalEarned();

      setStats({
        active_missions: myMissions?.length || 0,
        total_earned: totalEarned,
        average_rating: profile?.average_rating || 0,
        pending_candidatures: 0 // Temporaire - sera calculé quand mission_candidates existera
      });

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const calculateTotalEarned = async () => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('budget')
        .eq('provider_id', user?.id)
        .eq('status', 'completed');

      if (error) throw error;
      return data?.reduce((sum, m) => sum + (m.budget || 0), 0) || 0;
    } catch (error) {
      console.error('Erreur calcul revenus:', error);
      return 0;
    }
  };

  const getCandidatureStatusBadge = (status: Candidature['status']) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'warning' as const },
      accepted: { label: 'Acceptée', variant: 'success' as const },
      rejected: { label: 'Refusée', variant: 'destructive' as const }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar isConnected={true} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <Skeleton width="45%" height={40} className="mb-2" />
            <Skeleton width="35%" height={20} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton width="60%" height={20} className="mb-2" />
                <Skeleton width="40%" height={36} />
              </Card>
            ))}
          </div>
          <Card className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <Navbar isConnected={true} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-4xl text-yo-green-dark mb-2">
            Mon Dashboard Prestataire
          </h1>
          <p className="text-yo-gray-600 text-lg">
            Découvrez les opportunités et gérez vos candidatures
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">Missions actives</span>
              <Briefcase className="w-5 h-5 text-yo-orange" />
            </div>
            <p className="font-display font-extrabold text-3xl text-yo-green-dark">
              {stats.active_missions}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">Revenus totaux</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="font-display font-extrabold text-3xl text-yo-green-dark">
              {stats.total_earned.toLocaleString()} CFA
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">Note moyenne</span>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="font-display font-extrabold text-3xl text-yo-green-dark">
              {stats.average_rating.toFixed(1)} / 5
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">Candidatures en attente</span>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-display font-extrabold text-3xl text-yo-green-dark">
              {stats.pending_candidatures}
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-yo-gray-200">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`pb-4 px-2 font-semibold transition ${
              activeTab === 'opportunities'
                ? 'text-yo-green-dark border-b-2 border-yo-green'
                : 'text-yo-gray-600 hover:text-yo-green-dark'
            }`}
          >
            <Search className="w-5 h-5 inline mr-2" />
            Opportunités ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('candidatures')}
            className={`pb-4 px-2 font-semibold transition ${
              activeTab === 'candidatures'
                ? 'text-yo-green-dark border-b-2 border-yo-green'
                : 'text-yo-gray-600 hover:text-yo-green-dark'
            }`}
          >
            <TrendingUp className="w-5 h-5 inline mr-2" />
            Mes candidatures ({candidatures.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'opportunities' ? (
          <div className="space-y-4">
            {opportunities.length === 0 ? (
              <EmptyOpportunities />
            ) : (
              opportunities.map((opportunity) => (
                <Card 
                  key={opportunity.id}
                  className="p-6 hover:shadow-yo-lg transition cursor-pointer"
                  onClick={() => router.push(`/missions/${opportunity.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{opportunity.title}</h3>
                      <p className="text-sm text-yo-gray-600 mb-3 line-clamp-2">
                        {opportunity.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-yo-gray-500">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">
                            {opportunity.budget.toLocaleString()} CFA
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{opportunity.commune}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(opportunity.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-yo-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yo-green-pale rounded-full flex items-center justify-center">
                        <span className="font-bold text-yo-green-dark">
                          {opportunity.client.first_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {opportunity.client.first_name} {opportunity.client.last_name}
                        </p>
                        {opportunity.client.average_rating && (
                          <div className="flex items-center gap-1 text-xs text-yo-gray-500">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span>{opportunity.client.average_rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir les détails
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {candidatures.length === 0 ? (
              <Card className="p-12 text-center">
                <TrendingUp className="w-12 h-12 text-yo-gray-400 mx-auto mb-4" />
                <p className="text-yo-gray-600">Vous n&apos;avez pas encore postulé à des missions</p>
                <Button 
                  className="mt-4"
                  onClick={() => setActiveTab('opportunities')}
                >
                  Découvrir les opportunités
                </Button>
              </Card>
            ) : (
              candidatures.map((candidature) => (
                <Card 
                  key={candidature.id}
                  className="p-6 hover:shadow-yo-lg transition cursor-pointer"
                  onClick={() => router.push(`/missions/${candidature.mission.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{candidature.mission.title}</h3>
                        {getCandidatureStatusBadge(candidature.status)}
                      </div>
                      <p className="text-sm text-yo-gray-600 mb-3">
                        {candidature.message}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-yo-gray-500">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">
                            Prix proposé : {candidature.proposed_price.toLocaleString()} CFA
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Postulé le {new Date(candidature.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
