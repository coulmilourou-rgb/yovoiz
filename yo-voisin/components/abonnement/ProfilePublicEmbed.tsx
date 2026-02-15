'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Image as ImageIcon,
  MessageSquare,
  Award,
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import type { Profile } from '@/lib/types';

interface Stats {
  totalMissions: number;
  totalReviews: number;
  averageRating: number;
  memberSince: string;
  connections: number;
  completionRate: number;
  responseTime: number;
}

export default function ProfilePublicEmbed() {
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalMissions: 0,
    totalReviews: 0,
    averageRating: 0,
    memberSince: '',
    connections: 0,
    completionRate: 0,
    responseTime: 0
  });
  const [activeTab, setActiveTab] = useState<'presentation' | 'photos' | 'avis' | 'activite'>('presentation');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      // Charger le profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Charger les stats
      const memberSinceDate = new Date(profileData.created_at);
      const formattedDate = memberSinceDate.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });

      setStats({
        totalMissions: profileData.total_missions || 0,
        totalReviews: profileData.total_ratings || 0,
        averageRating: profileData.average_rating || 0,
        memberSince: formattedDate,
        connections: Math.floor(Math.random() * 100) + 10, // Simulé pour l'instant
        completionRate: 95, // Simulé
        responseTime: profileData.response_time_avg || 2
      });

    } catch (error) {
      console.error('Erreur chargement profil public:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-yo-orange via-yo-orange-light to-yo-green h-32 rounded-t-yo-lg animate-pulse"></div>
        <div className="p-6">
          <p className="text-yo-gray-500 text-center">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="p-6">
          <p className="text-yo-gray-500 text-center">Profil non trouvé</p>
        </div>
      </div>
    );
  }

  const isOnline = true; // Simulé pour l'instant

  return (
    <div className="space-y-6">
      {/* Header avec photo de couverture */}
      <div className="relative h-32 sm:h-48 rounded-t-yo-lg overflow-hidden bg-yo-gray-200">
        {profile.cover_url ? (
          <img
            src={profile.cover_url}
            alt="Photo de couverture"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-yo-orange via-yo-orange-light to-yo-green"></div>
        )}
      </div>

      {/* Carte principale du profil */}
      <Card className="relative -mt-16 sm:-mt-24 bg-white rounded-yo-lg shadow-yo-md border border-yo-gray-100">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Photo de profil et infos principales */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Photo de profil */}
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-yo-md"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-yo-orange to-yo-green flex items-center justify-center text-white text-3xl sm:text-4xl font-bold border-4 border-white shadow-yo-md">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </div>
                )}
                
                {/* Badge type de compte */}
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                  <Badge className="bg-yo-gray-100 text-yo-gray-800 border border-yo-gray-200 px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    {profile.is_pro ? '🏢 Pro' : '👤 Particulier'}
                  </Badge>
                </div>

                {/* Indicateur en ligne */}
                {isOnline && (
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 border-4 border-white rounded-full"></div>
                )}
              </div>
            </div>

            {/* Informations principales */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-yo-black font-display mb-2">
                    {profile.first_name} {profile.last_name?.charAt(0)}.
                  </h1>
                  
                  {profile.bio && (
                    <p className="text-base sm:text-lg text-yo-gray-600 mb-2 font-medium">
                      {profile.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-center sm:justify-start gap-2 text-yo-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm sm:text-base">
                      {profile.commune || 'Abidjan'} 
                      {profile.quartier && ` • ${profile.quartier}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 text-green-600 font-medium">
                    <CheckCircle className="w-5 h-5" />
                    <span>En ligne</span>
                  </div>
                </div>

                {/* Badge niveau pro si applicable */}
                {profile.is_pro && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2">
                    <Award className="w-4 h-4 mr-1" />
                    {profile.provider_level?.toUpperCase() || 'PRO'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className="mt-8 border-b border-yo-gray-200">
            <div className="flex gap-4 sm:gap-8 overflow-x-auto">
              {['presentation', 'photos', 'avis', 'activite'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 px-2 font-semibold text-sm sm:text-base transition-all relative whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-yo-orange'
                      : 'text-yo-gray-500 hover:text-yo-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yo-orange rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="mt-8">
            {activeTab === 'presentation' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne principale */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Note et avis */}
                  <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                          <span className="text-4xl font-bold text-yo-black">
                            {stats.averageRating.toFixed(1)}/5
                          </span>
                        </div>
                        <p className="text-yo-gray-600">
                          Basé sur <span className="font-semibold">{stats.totalReviews}</span> avis
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Description / Bio détaillée */}
                  {profile.bio && (
                    <Card className="p-6">
                      <h3 className="text-xl font-bold text-yo-black mb-4">À propos</h3>
                      <p className="text-yo-gray-700 leading-relaxed">
                        {profile.bio}
                      </p>
                    </Card>
                  )}

                  {/* Services / Catégories */}
                  {profile.categories && profile.categories.length > 0 && (
                    <Card className="p-6">
                      <h3 className="text-xl font-bold text-yo-black mb-4">Services proposés</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.categories.map((cat: string, idx: number) => (
                          <Badge key={idx} className="bg-yo-orange-pale text-yo-orange-dark px-4 py-2">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Zones d'intervention */}
                  {profile.service_zones && profile.service_zones.length > 0 && (
                    <Card className="p-6">
                      <h3 className="text-xl font-bold text-yo-black mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-yo-orange" />
                        Zones d'intervention
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.service_zones.map((zone: string, idx: number) => (
                          <Badge key={idx} className="bg-yo-green-pale text-yo-green-dark px-4 py-2">
                            📍 {zone}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>

                {/* Colonne latérale - Stats */}
                <div className="space-y-4">
                  {/* Statistiques */}
                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-yo-black mb-4">Statistiques</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-yo-sm bg-yo-off-white">
                        <Calendar className="w-5 h-5 text-yo-orange" />
                        <div>
                          <p className="text-xs text-yo-gray-500">Membre depuis</p>
                          <p className="font-semibold text-yo-black">{stats.memberSince}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-yo-sm bg-yo-off-white">
                        <Users className="w-5 h-5 text-yo-green" />
                        <div>
                          <p className="text-xs text-yo-gray-500">Mises en relation</p>
                          <p className="font-semibold text-yo-black">{stats.connections}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-yo-sm bg-yo-off-white">
                        <Award className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-xs text-yo-gray-500">Missions réalisées</p>
                          <p className="font-semibold text-yo-black">{stats.totalMissions}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-yo-sm bg-yo-off-white">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-xs text-yo-gray-500">Taux de réussite</p>
                          <p className="font-semibold text-yo-black">{stats.completionRate}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-yo-sm bg-yo-off-white">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-xs text-yo-gray-500">Temps de réponse</p>
                          <p className="font-semibold text-yo-black">{stats.responseTime}h en moyenne</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Badges de vérification */}
                  {profile.verification_status === 'verified' && (
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h3 className="font-bold text-green-800">Identité vérifiée</h3>
                      </div>
                      <p className="text-sm text-green-700">
                        Ce compte a été vérifié par Yo!Voiz
                      </p>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-yo-gray-300 mx-auto mb-4" />
                <p className="text-yo-gray-500">Aucune photo pour le moment</p>
              </div>
            )}

            {activeTab === 'avis' && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-yo-gray-300 mx-auto mb-4" />
                <p className="text-yo-gray-500">Aucun avis pour le moment</p>
              </div>
            )}

            {activeTab === 'activite' && (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-yo-gray-300 mx-auto mb-4" />
                <p className="text-yo-gray-500">Activité récente à venir</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
