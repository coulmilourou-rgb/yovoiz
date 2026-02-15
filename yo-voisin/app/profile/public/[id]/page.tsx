'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
  TrendingUp,
  ArrowLeft,
  Loader2,
  Briefcase
} from 'lucide-react';

export default function PublicProfileByIdPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const userId = params.id as string;
  
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger le profil de l'utilisateur spécifié
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          setError('Profil non trouvé');
        } else {
          throw profileError;
        }
        return;
      }

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
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleContactUser = () => {
    router.push(`/messages?user=${userId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-yo-orange animate-spin mx-auto mb-4" />
            <p className="text-yo-gray-500">Chargement du profil...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Card className="p-12 text-center">
              <div className="w-20 h-20 bg-yo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-yo-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-yo-gray-800 mb-2">
                {error || 'Profil non trouvé'}
              </h2>
              <p className="text-yo-gray-600 mb-6">
                Ce profil n'existe pas ou n'est plus disponible.
              </p>
              <Button
                onClick={() => router.back()}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const isOnline = true; // Simulé pour l'instant
  const isOwnProfile = currentUser?.id === userId;

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 pb-16 bg-yo-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Bouton retour */}
          <Button
            onClick={() => router.back()}
            variant="secondary"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          {/* Header avec photo de couverture */}
          <div className="relative h-32 sm:h-48 rounded-t-yo-lg overflow-hidden">
            {profile.cover_url ? (
              <img 
                src={profile.cover_url} 
                alt="Photo de couverture"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gradient-to-r from-yo-orange via-yo-orange-light to-yo-green w-full h-full"></div>
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
                          <Button 
                            variant="outline" 
                            onClick={() => setActiveTab('avis')}
                            className="border-yo-orange text-yo-orange hover:bg-yo-orange hover:text-white"
                          >
                            Voir ses avis
                          </Button>
                        </div>
                      </Card>

                      {/* Description / Bio détaillée */}
                      {(profile.bio || profile.provider_bio) && (
                        <Card className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-yo-orange" />
                            <h3 className="text-xl font-bold text-yo-black">À propos de moi</h3>
                          </div>
                          
                          {/* Bio générale */}
                          {profile.bio && (
                            <div className="mb-4">
                              <p className="text-yo-gray-700 leading-relaxed">
                                {profile.bio}
                              </p>
                            </div>
                          )}

                          {/* Bio professionnelle / Description de l'activité */}
                          {profile.provider_bio && (
                            <div className="border-t border-yo-gray-200 pt-4">
                              <h4 className="text-base font-semibold text-yo-gray-900 mb-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-yo-green" />
                                Mon activité professionnelle
                              </h4>
                              <p className="text-yo-gray-700 leading-relaxed whitespace-pre-wrap">
                                {profile.provider_bio}
                              </p>
                            </div>
                          )}

                          {/* Expérience si disponible */}
                          {profile.provider_experience_years && profile.provider_experience_years > 0 && (
                            <div className="border-t border-yo-gray-200 pt-4 mt-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-yo-orange/10 flex items-center justify-center">
                                  <Award className="w-6 h-6 text-yo-orange" />
                                </div>
                                <div>
                                  <p className="text-sm text-yo-gray-600">Expérience professionnelle</p>
                                  <p className="text-xl font-bold text-yo-gray-900">
                                    {profile.provider_experience_years} an{profile.provider_experience_years > 1 ? 's' : ''} d'expérience
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
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

          {/* Bouton d'action */}
          {!isOwnProfile && (
            <div className="mt-8 flex justify-center">
              <Button 
                className="bg-gradient-to-r from-yo-orange to-yo-green text-white hover:opacity-90 transition-all px-8 py-3 text-base font-semibold rounded-yo-md shadow-yo-md"
                onClick={handleContactUser}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Contacter
              </Button>
            </div>
          )}

          {isOwnProfile && (
            <div className="mt-8 flex justify-center">
              <Button 
                variant="outline"
                onClick={() => router.push('/profile/info')}
              >
                Modifier mon profil
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
