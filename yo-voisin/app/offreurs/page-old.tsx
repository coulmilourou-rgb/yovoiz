'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MapPin, Star, DollarSign, Filter, Search, Loader2,
  Award, MessageCircle, CheckCircle, Clock, TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';

interface Prestataire {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  commune: string;
  bio?: string;
  categories: string[];
  average_rating: number;
  total_ratings: number;
  total_missions: number;
  hourly_rate?: number;
  is_pro: boolean;
  verification_status: string;
  response_time_avg: number;
}

const CATEGORIES_FILTRES = [
  'Tous',
  'Bricolage',
  'Plomberie',
  'Électricité',
  'Jardinage',
  'Ménage',
  'Déménagement',
  'Livraison',
  'Informatique',
  'Cours particuliers',
];

export default function OffreursPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categorieFiltre, setCategorieFiltre] = useState('Tous');
  const [filtreNote, setFiltreNote] = useState(0);
  const [filtreDisponibilite, setFiltreDisponibilite] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/connexion');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      fetchPrestataires();
    }
  }, [profile, categorieFiltre, filtreNote]);

  const fetchPrestataires = async () => {
    setLoading(true);
    try {
      // Récupérer les offres de services avec les infos du prestataire
      let query = supabase
        .from('service_offers')
        .select(`
          *,
          provider:profiles!service_offers_provider_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url,
            average_rating,
            total_reviews,
            commune,
            is_pro,
            verification_status
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Filtrer par commune
      if (profile?.commune) {
        query = query.contains('communes', [profile.commune]);
      }

      // Filtrer par catégorie
      if (categorieFiltre !== 'Tous') {
        query = query.eq('category', categorieFiltre);
      }

      // Note: Le filtreNote ne s'applique pas directement aux offres
      // On filtrera côté client si nécessaire

      const { data, error } = await query;

      console.log('📊 Résultat query prestataires:', { data, error });

      if (error) {
        console.error('Erreur chargement prestataires:', error);
        return;
      }

      console.log('✅ Prestataires trouvés:', data?.length || 0);
      setPrestataires(data || []);
    } catch (error) {
      console.error('Exception:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrestataires = prestataires.filter((offer) => {
    const matchSearch = 
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.provider?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.provider?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchSearch;
  });

  const handleContact = (prestataireId: string) => {
    router.push(`/messages?user=${prestataireId}`);
  };

  const handleViewProfile = (prestataireId: string) => {
    router.push(`/profile/public/${prestataireId}`);
  };

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar isConnected={!!user} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton width="100%" height={200} className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} width="100%" height={350} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <PageHead 
        title="Offreurs de services" 
        description="Trouvez les meilleurs prestataires dans votre zone"
      />
      <Navbar 
        isConnected={true}
        user={{
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display font-extrabold text-4xl text-yo-green-dark mb-2">
            Offreurs de services près de vous
          </h1>
          <p className="text-yo-gray-600 text-lg">
            Découvrez les prestataires disponibles à <span className="font-semibold text-yo-orange">{profile.commune}</span>
          </p>
        </motion.div>

        {/* Barre de recherche et filtres */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yo-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un prestataire ou une compétence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-yo-gray-50 rounded-lg border border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-orange"
              />
            </div>

            {/* Bouton Filtres */}
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Filtres déroulants */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-6 border-t border-yo-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={categorieFiltre}
                    onChange={(e) => setCategorieFiltre(e.target.value)}
                    className="w-full px-4 py-2 bg-white rounded-lg border border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-orange"
                  >
                    {CATEGORIES_FILTRES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Note minimale */}
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                    Note minimale
                  </label>
                  <select
                    value={filtreNote}
                    onChange={(e) => setFiltreNote(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-white rounded-lg border border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-orange"
                  >
                    <option value={0}>Toutes les notes</option>
                    <option value={4}>4+ étoiles</option>
                    <option value={4.5}>4.5+ étoiles</option>
                  </select>
                </div>

                {/* Disponibilité */}
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                    Disponibilité
                  </label>
                  <button
                    onClick={() => setFiltreDisponibilite(!filtreDisponibilite)}
                    className={`
                      w-full px-4 py-2 rounded-lg border-2 transition-all font-medium text-left
                      ${filtreDisponibilite
                        ? 'bg-yo-green text-white border-yo-green'
                        : 'bg-white text-yo-gray-700 border-yo-gray-200'
                      }
                    `}
                  >
                    {filtreDisponibilite ? 'Disponibles uniquement' : 'Tous les prestataires'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Résultats */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-yo-gray-600">
            <span className="font-bold text-yo-green-dark">{filteredPrestataires.length}</span> prestataire(s) trouvé(s)
          </p>
        </div>

        {/* Liste des prestataires */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton width="100%" height={300} />
              </Card>
            ))}
          </div>
        ) : filteredPrestataires.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-yo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-yo-gray-400" />
              </div>
              <h3 className="font-display font-bold text-2xl text-yo-gray-800 mb-2">
                Aucun prestataire trouvé
              </h3>
              <p className="text-yo-gray-600 mb-6">
                Essayez de modifier vos filtres ou votre zone de recherche
              </p>
              <Button onClick={() => {
                setCategorieFiltre('Tous');
                setFiltreNote(0);
                setSearchTerm('');
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrestataires.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-yo-lg transition-all h-full flex flex-col">
                  {/* Image de l'offre */}
                  {offer.photos && offer.photos.length > 0 ? (
                    <div className="relative h-48 bg-yo-gray-100">
                      <img 
                        src={offer.photos[0]} 
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-yo-orange to-yo-green flex items-center justify-center">
                      <Star className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Titre de l'offre */}
                    <h3 className="font-display font-bold text-xl text-yo-gray-900 mb-2 line-clamp-2">
                      {offer.title}
                    </h3>

                    {/* Description */}
                    <p className="text-yo-gray-600 text-sm mb-4 line-clamp-3">
                      {offer.description}
                    </p>

                    {/* Catégorie */}
                    <div className="mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {offer.category}
                      </Badge>
                    </div>

                    {/* Prestataire info */}
                    {offer.provider && (
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-yo-gray-200">
                        <Avatar
                          firstName={offer.provider.first_name}
                          lastName={offer.provider.last_name}
                          imageUrl={offer.provider.avatar_url}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-yo-gray-900 truncate">
                              {offer.provider.first_name} {offer.provider.last_name}
                            </p>
                            {offer.provider.is_pro && (
                              <Badge className="bg-yo-orange text-white text-xs">PRO</Badge>
                            )}
                            {offer.provider.verification_status === 'verified' && (
                              <CheckCircle className="w-4 h-4 text-yo-green flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-yo-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{offer.provider.commune}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Note prestataire */}
                    {offer.provider && offer.provider.average_rating > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-sm text-yo-gray-900">
                            {offer.provider.average_rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-yo-gray-500">
                          ({offer.provider.total_reviews} avis)
                        </span>
                      </div>
                    )}

                    {/* Tarif */}
                    <div className="flex items-center gap-2 mb-4 text-yo-green-dark">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-bold text-lg">
                        {offer.pricing_type === 'hourly' 
                          ? `${offer.price_hourly} FCFA/h`
                          : `${offer.price_fixed_min} - ${offer.price_fixed_max} FCFA`
                        }
                      </span>
                    </div>

                    {/* Zones d'intervention */}
                    {offer.communes && offer.communes.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {offer.communes.slice(0, 3).map((commune, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-yo-gray-100 text-yo-gray-600 rounded">
                              {commune}
                            </span>
                          ))}
                          {offer.communes.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-yo-gray-100 text-yo-gray-600 rounded">
                              +{offer.communes.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-auto space-y-2">
                      <Button
                        onClick={() => handleViewProfile(offer.provider_id)}
                        variant="secondary"
                        className="w-full"
                      >
                        Voir le profil
                      </Button>
                      <Button
                        onClick={() => handleContact(offer.provider_id)}
                        className="w-full bg-yo-orange hover:bg-yo-orange-dark"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contacter
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
