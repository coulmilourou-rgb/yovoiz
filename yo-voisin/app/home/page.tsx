'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Euro, TrendingUp, Filter, 
  Plus, Send, Image as ImageIcon, Paperclip,
  Search, Star, Users, CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';

interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  status: string;
  urgency: string;
  commune: string;
  quartier: string;
  created_at: string;
  client: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
    average_rating: number;
    commune: string;
  };
}

export default function HomePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [quickPostText, setQuickPostText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterCommune, setFilterCommune] = useState('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/connexion');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      // Par défaut, filtrer par la commune de l'utilisateur
      setFilterCommune(profile.commune || 'all');
      fetchMissions(profile.commune);
    }
  }, [profile]);

  const fetchMissions = async (commune?: string) => {
    try {
      setLoadingMissions(true);
      
      let query = supabase
        .from('missions')
        .select(`
          *,
          client:profiles!missions_client_id_fkey(
            first_name,
            last_name,
            avatar_url,
            average_rating,
            commune
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20);

      // Filtrer par commune si spécifié
      if (commune && commune !== 'all') {
        query = query.eq('commune', commune);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur chargement missions:', error);
        return;
      }

      setMissions(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoadingMissions(false);
    }
  };

  const handleQuickPost = () => {
    if (quickPostText.trim()) {
      // Rediriger vers la page de création complète avec le texte pré-rempli
      router.push(`/missions/nouvelle?quick=${encodeURIComponent(quickPostText)}`);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'normal': return 'bg-blue-100 text-blue-700';
      case 'flexible': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
    return `Il y a ${Math.floor(seconds / 86400)}j`;
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar isConnected={!!user} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton width="100%" height={200} className="mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} width="100%" height={200} />
              ))}
            </div>
            <Skeleton width="100%" height={400} />
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
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-4xl text-yo-green-dark mb-2">
            🏘️ Services près de chez vous
          </h1>
          <p className="text-yo-gray-600 text-lg">
            Découvrez les demandes dans votre zone : <span className="font-semibold text-yo-orange">
              {profile.commune && profile.commune !== 'Abidjan' ? profile.commune : 'toutes les communes'}
            </span>
            {profile.quartier && ` • ${profile.quartier}`}
          </p>
        </div>

        {/* Filtres rapides */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant={filterCommune === 'all' ? 'primary' : 'secondary'}
            onClick={() => {
              setFilterCommune('all');
              fetchMissions();
            }}
            size="sm"
          >
            Toutes les zones
          </Button>
          <Button
            variant={filterCommune === profile.commune ? 'primary' : 'secondary'}
            onClick={() => {
              setFilterCommune(profile.commune);
              fetchMissions(profile.commune);
            }}
            size="sm"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Ma commune
          </Button>
        </div>

        {/* Layout principal : Feed + Quick Post */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed des missions */}
          <div className="lg:col-span-2 space-y-4">
            {loadingMissions ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton width="100%" height={150} />
                </Card>
              ))
            ) : missions.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-yo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-yo-gray-400" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-yo-gray-800 mb-2">
                    Aucune demande pour le moment
                  </h3>
                  <p className="text-yo-gray-600 mb-6">
                    Soyez le premier à publier une demande dans votre quartier !
                  </p>
                  <Button onClick={() => router.push('/missions/nouvelle')}>
                    <Plus className="w-5 h-5 mr-2" />
                    Publier ma demande
                  </Button>
                </div>
              </Card>
            ) : (
              missions.map((mission) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="p-6 hover:shadow-yo-lg transition-all cursor-pointer"
                    onClick={() => router.push(`/missions/${mission.id}`)}
                  >
                    {/* Header : Avatar + Info client */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          firstName={mission.client.first_name}
                          lastName={mission.client.last_name}
                          imageUrl={mission.client.avatar_url}
                          size="md"
                        />
                        <div>
                          <p className="font-semibold text-yo-gray-800">
                            {mission.client.first_name} {mission.client.last_name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-yo-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{mission.commune}</span>
                            {mission.quartier && <span>• {mission.quartier}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getUrgencyColor(mission.urgency)}>
                          {mission.urgency === 'urgent' && '🔥 Urgent'}
                          {mission.urgency === 'normal' && '📅 Normal'}
                          {mission.urgency === 'flexible' && '⏰ Flexible'}
                        </Badge>
                        <p className="text-xs text-yo-gray-500 mt-1">
                          {getTimeAgo(mission.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Contenu mission */}
                    <h3 className="font-display font-bold text-xl text-yo-gray-900 mb-2">
                      {mission.title}
                    </h3>
                    <p className="text-yo-gray-600 mb-4 line-clamp-2">
                      {mission.description}
                    </p>

                    {/* Footer : Budget + Catégorie */}
                    <div className="flex items-center justify-between pt-4 border-t border-yo-gray-200">
                      <Badge variant="secondary">
                        {mission.category}
                      </Badge>
                      <div className="flex items-center gap-2 font-semibold text-yo-green-dark">
                        <Euro className="w-4 h-4" />
                        {mission.budget_min} - {mission.budget_max} FCFA
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Panneau Quick Post à droite */}
          <div className="lg:sticky lg:top-24 h-fit space-y-6">
            {/* Quick Post */}
            <Card className="p-6">
              <h3 className="font-display font-bold text-xl text-yo-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-yo-orange" />
                Publier une demande
              </h3>
              
              <textarea
                value={quickPostText}
                onChange={(e) => setQuickPostText(e.target.value)}
                placeholder="De quoi avez-vous besoin aujourd'hui ?"
                className="w-full px-4 py-3 bg-yo-gray-50 rounded-lg border border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green resize-none"
                rows={4}
              />

              <div className="mt-4 space-y-3">
                <Button
                  onClick={handleQuickPost}
                  disabled={!quickPostText.trim()}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Continuer
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => router.push('/missions/nouvelle')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Formulaire complet
                </Button>
              </div>

              <p className="text-xs text-yo-gray-500 mt-4 text-center">
                💡 Décrivez rapidement votre besoin, vous pourrez ajouter plus de détails ensuite
              </p>
            </Card>

            {/* Statistiques de la zone */}
            <Card className="p-6">
              <h3 className="font-display font-bold text-lg text-yo-gray-900 mb-4">
                📊 Votre zone
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yo-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Demandes actives</span>
                  </div>
                  <span className="font-bold text-yo-green-dark">{missions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yo-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Votre commune</span>
                  </div>
                  <span className="font-semibold text-yo-gray-800">{profile.commune}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yo-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Popularité</span>
                  </div>
                  <span className="text-yo-orange font-semibold">Moyenne</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
