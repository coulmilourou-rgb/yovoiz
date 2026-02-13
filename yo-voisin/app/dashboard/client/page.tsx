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
import { EmptyMissions } from '@/components/ui/EmptyState';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Eye,
  MessageCircle,
  Calendar,
  DollarSign
} from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  status: 'published' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  candidates_count?: number;
  selected_provider?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface Stats {
  active_missions: number;
  completed_missions: number;
  total_spent: number;
  pending_reviews: number;
}

export default function ClientDashboard() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  
  const [missions, setMissions] = useState<Mission[]>([]);
  const [stats, setStats] = useState<Stats>({
    active_missions: 0,
    completed_missions: 0,
    total_spent: 0,
    pending_reviews: 0
  });
  const [loadingData, setLoadingData] = useState(true);

  // Charger le profil dès l'arrivée sur le dashboard
  useEffect(() => {
    if (user && !profile && !loading) {
      console.log('📥 Dashboard Client - Chargement du profil...');
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
      // Fetch missions (simplifié - sans relations complexes pour l'instant)
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (missionsError) {
        console.error('Erreur chargement missions:', missionsError);
      }

      setMissions(missionsData || []);

      // Calculate stats
      const activeMissions = missionsData?.filter(m => 
        m.status === 'published' || m.status === 'in_progress'
      ).length || 0;

      const completedMissions = missionsData?.filter(m => 
        m.status === 'completed'
      ).length || 0;

      const totalSpent = missionsData
        ?.filter(m => m.status === 'completed')
        .reduce((sum, m) => sum + (m.budget || 0), 0) || 0;

      setStats({
        active_missions: activeMissions,
        completed_missions: completedMissions,
        total_spent: totalSpent,
        pending_reviews: 0 // TODO: Fetch from reviews table
      });

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusBadge = (status: Mission['status']) => {
    const statusConfig = {
      published: { label: 'Publiée', variant: 'success' as const, icon: Clock },
      in_progress: { label: 'En cours', variant: 'warning' as const, icon: TrendingUp },
      completed: { label: 'Terminée', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'Annulée', variant: 'destructive' as const, icon: XCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar isConnected={true} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <Skeleton width="40%" height={40} className="mb-2" />
            <Skeleton width="30%" height={20} />
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton width="60%" height={20} className="mb-2" />
                <Skeleton width="40%" height={36} />
              </Card>
            ))}
          </div>

          {/* Missions skeleton */}
          <Card className="p-6">
            <Skeleton width="30%" height={28} className="mb-6" />
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-4xl text-yo-green-dark mb-2">
              Mon Dashboard Client
            </h1>
            <p className="text-yo-gray-600 text-lg">
              Gérez vos demandes et suivez vos missions
            </p>
          </div>
          <Button 
            onClick={() => router.push('/missions/nouvelle')}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle demande
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">Missions actives</span>
              <Clock className="w-5 h-5 text-yo-orange" />
            </div>
            <p className="font-display font-extrabold text-3xl text-yo-green-dark">
              {stats.active_missions}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">Missions complétées</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="font-display font-extrabold text-3xl text-yo-green-dark">
              {stats.completed_missions}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">Dépenses totales</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-display font-extrabold text-3xl text-yo-green-dark">
              {stats.total_spent.toLocaleString()} CFA
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">Avis à laisser</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="font-display font-extrabold text-3xl text-yo-green-dark">
              {stats.pending_reviews}
            </p>
          </Card>
        </div>

        {/* Missions actives */}
        <Card className="p-6 mb-8">
          <h2 className="font-display font-bold text-2xl text-yo-green-dark mb-6">
            Mes missions
          </h2>

          {missions.length === 0 ? (
            <EmptyMissions onCreateMission={() => router.push('/missions/nouvelle')} />
          ) : (
            <div className="space-y-4">
              {missions.map((mission) => (
                <Card 
                  key={mission.id} 
                  className="p-6 hover:shadow-yo-lg transition cursor-pointer"
                  onClick={() => router.push(`/missions/${mission.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{mission.title}</h3>
                        {getStatusBadge(mission.status)}
                      </div>
                      <p className="text-sm text-yo-gray-600 mb-3 line-clamp-2">
                        {mission.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-yo-gray-500">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">{mission.budget.toLocaleString()} CFA</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(mission.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {mission.candidates_count !== undefined && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{mission.candidates_count} candidature(s)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {mission.selected_provider && (
                    <div className="flex items-center justify-between pt-4 border-t border-yo-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yo-green-pale rounded-full flex items-center justify-center">
                          <span className="font-bold text-yo-green-dark">
                            {mission.selected_provider.first_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {mission.selected_provider.first_name} {mission.selected_provider.last_name}
                          </p>
                          <p className="text-xs text-yo-gray-500">Prestataire sélectionné</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contacter
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
