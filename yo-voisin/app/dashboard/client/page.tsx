'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Clock, 
  Star, 
  Heart,
  TrendingUp,
  MapPin,
  Plus,
  Bell,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  commune: string | null;
  quartier: string | null;
  verification_status: string | null;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  status: string;
  created_at: string;
  offers_count?: number;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'favorites'>('active');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Vérifier l'authentification
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('Non authentifié, redirection...');
        router.push('/auth/connexion');
        return;
      }

      // Charger le profil
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Erreur profil:', profileError);
        } else {
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Erreur chargement profil:', err);
      }

      // Charger les missions
      try {
        const { data: missionsData, error: missionsError } = await supabase
          .from('missions')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });

        if (missionsError) {
          console.error('Erreur missions:', missionsError);
        } else if (missionsData) {
          setMissions(missionsData.map(m => ({ ...m, offers_count: 0 })));
        }
      } catch (err) {
        console.error('Erreur chargement missions:', err);
      }

    } catch (error) {
      console.error('Erreur générale:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yo-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yo-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yo-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  const activeMissions = missions.filter(m => ['open', 'in_progress'].includes(m.status));
  const completedMissions = missions.filter(m => m.status === 'completed');

  return (
    <div className="min-h-screen bg-yo-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-yo-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => router.push('/')} className="flex items-center gap-2">
              <div className="text-2xl">👷</div>
              <span className="font-display font-black text-xl">
                <span className="text-yo-orange">Yo!</span>{' '}
                <span className="text-yo-green-dark">Voiz</span>
              </span>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => router.push('/missions/nouvelle')}
                className="flex items-center gap-2 text-yo-gray-700 hover:text-yo-orange transition"
              >
                <Plus className="w-5 h-5" />
                <span>Nouvelle mission</span>
              </button>
              <button className="relative">
                <Bell className="w-5 h-5 text-yo-gray-700 hover:text-yo-orange transition" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yo-orange rounded-full text-white text-xs flex items-center justify-center">
                  0
                </span>
              </button>
            </nav>

            {/* Profil */}
            <div className="flex items-center gap-3">
              <Avatar 
                name={profile?.full_name || 'User'}
                size="md"
              />
              <div className="hidden md:block">
                <p className="font-semibold text-sm text-yo-gray-900">{profile?.full_name || 'Utilisateur'}</p>
                <p className="text-xs text-yo-gray-500">{profile?.commune || 'Abidjan'}</p>
              </div>
              <button onClick={handleLogout} className="ml-2 text-yo-gray-400 hover:text-yo-orange transition">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 hover:shadow-yo-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yo-gray-500 mb-1">Missions actives</p>
                <p className="text-3xl font-bold text-yo-gray-900">{activeMissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-yo-orange/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-yo-orange" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-yo-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yo-gray-500 mb-1">Terminées</p>
                <p className="text-3xl font-bold text-yo-gray-900">{completedMissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-yo-green/10 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yo-green" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-yo-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yo-gray-500 mb-1">Prestataires favoris</p>
                <p className="text-3xl font-bold text-yo-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-yo-yellow/10 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-yo-yellow-dark" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-yo-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yo-gray-500 mb-1">Dépenses totales</p>
                <p className="text-2xl font-bold text-yo-gray-900">0 F</p>
              </div>
              <div className="w-12 h-12 bg-yo-green-dark/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yo-green-dark" />
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Nouvelle Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-yo-orange to-yo-orange-light">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-white">
                <h3 className="font-display font-bold text-xl mb-2">Besoin d&apos;un service ?</h3>
                <p className="text-white/90">
                  Publie ta mission et reçois des propositions de prestataires qualifiés en quelques minutes
                </p>
              </div>
              <Button 
                size="lg"
                onClick={() => router.push('/missions/nouvelle')}
                className="bg-white text-yo-orange hover:bg-yo-gray-50 shadow-yo-lg whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Créer une mission
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6 border-b border-yo-gray-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-2 font-semibold transition-colors relative ${
              activeTab === 'active' 
                ? 'text-yo-orange' 
                : 'text-yo-gray-500 hover:text-yo-gray-700'
            }`}
          >
            Missions actives
            {activeTab === 'active' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-yo-orange"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 px-2 font-semibold transition-colors relative ${
              activeTab === 'completed' 
                ? 'text-yo-orange' 
                : 'text-yo-gray-500 hover:text-yo-gray-700'
            }`}
          >
            Terminées
            {activeTab === 'completed' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-yo-orange"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 px-2 font-semibold transition-colors relative ${
              activeTab === 'favorites' 
                ? 'text-yo-orange' 
                : 'text-yo-gray-500 hover:text-yo-gray-700'
            }`}
          >
            Favoris
            {activeTab === 'favorites' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-yo-orange"
              />
            )}
          </button>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          {activeTab === 'active' && activeMissions.length === 0 && (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-yo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-yo-gray-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-yo-gray-900 mb-2">
                Aucune mission active
              </h3>
              <p className="text-yo-gray-500 mb-6">
                Commence par créer ta première mission pour trouver le prestataire idéal
              </p>
              <Button onClick={() => router.push('/missions/nouvelle')}>
                <Plus className="w-5 h-5" />
                Créer ma première mission
              </Button>
            </Card>
          )}

          {activeTab === 'active' && activeMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} router={router} />
          ))}

          {activeTab === 'completed' && completedMissions.length === 0 && (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-yo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yo-gray-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-yo-gray-900 mb-2">
                Aucune mission terminée
              </h3>
              <p className="text-yo-gray-500">
                Tes missions complétées apparaîtront ici
              </p>
            </Card>
          )}

          {activeTab === 'favorites' && (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-yo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-yo-gray-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-yo-gray-900 mb-2">
                Aucun favori
              </h3>
              <p className="text-yo-gray-500">
                Ajoute des prestataires à tes favoris pour les retrouver facilement
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

interface MissionCardProps {
  mission: Mission;
  router: any;
}

function MissionCard({ mission, router }: MissionCardProps) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    open: { label: 'En attente', color: 'bg-yo-yellow-light text-yo-yellow-dark' },
    in_progress: { label: 'En cours', color: 'bg-yo-orange/10 text-yo-orange' },
    completed: { label: 'Terminée', color: 'bg-yo-green/10 text-yo-green' },
  };

  const status = statusConfig[mission.status] || statusConfig.open;

  return (
    <Card className="p-6 hover:shadow-yo-lg transition-all cursor-pointer" onClick={() => router.push(`/missions/${mission.id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-display font-bold text-lg text-yo-gray-900">{mission.title}</h3>
            <Badge className={status.color}>{status.label}</Badge>
          </div>
          <p className="text-yo-gray-600 mb-3 line-clamp-2">{mission.description}</p>
          <div className="flex items-center gap-4 text-sm text-yo-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {mission.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(mission.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
        <div className="text-right ml-4">
          <p className="text-sm text-yo-gray-500 mb-1">Budget</p>
          <p className="font-bold text-yo-orange text-lg">
            {mission.budget_min.toLocaleString()} - {mission.budget_max.toLocaleString()} F
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-yo-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yo-green/10 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-yo-green" />
          </div>
          <span className="text-sm text-yo-gray-600">
            <span className="font-semibold text-yo-gray-900">{mission.offers_count || 0}</span> propositions reçues
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-yo-orange hover:bg-yo-orange/10">
          Voir les détails
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
