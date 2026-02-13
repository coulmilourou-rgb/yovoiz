'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MapPin, Star, Euro, Filter, Search, 
  CheckCircle, Clock, Loader2, SlidersHorizontal, 
  X, Award, Shield, MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  commune: string;
  quartier?: string;
  average_rating: number;
  total_reviews: number;
  total_missions_completed: number;
  is_premium: boolean;
  is_active: boolean;
  verification_status: string;
  created_at: string;
}

export default function OffreursPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [selectedCommune, setSelectedCommune] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState('0');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  
  const observerTarget = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 12;

  // Catégories
  const categories = [
    'Plomberie', 'Électricité', 'Ménage', 'Jardinage', 
    'Déménagement', 'Peinture', 'Réparation', 'Cours particuliers',
    'Informatique', 'Coiffure', 'Livraison', 'Autre'
  ];

  // Communes Abidjan
  const communes = [
    'Abobo', 'Adjamé', 'Attécoubé', 'Cocody', 'Koumassi',
    'Marcory', 'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon'
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/connexion');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      fetchProviders(0, true);
    }
  }, [profile, selectedCommune, selectedCategory, minRating, showVerifiedOnly, showAvailableOnly]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loadingProviders) {
          loadMoreProviders();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadingProviders]);

  const fetchProviders = async (pageNum = 0, reset = false) => {
    try {
      if (reset) {
        setLoadingProviders(true);
        setProviders([]);
        setPage(0);
      } else {
        setLoadingMore(true);
      }
      
      const from = pageNum * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .in('role', ['prestataire', 'both'])
        .order('average_rating', { ascending: false })
        .order('total_missions_completed', { ascending: false })
        .range(from, to);

      // Filtres
      if (selectedCommune !== 'all') {
        query = query.eq('commune', selectedCommune);
      }
      if (minRating !== '0') {
        query = query.gte('average_rating', parseFloat(minRating));
      }
      if (showVerifiedOnly) {
        query = query.eq('verification_status', 'verified');
      }
      if (showAvailableOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Erreur chargement prestataires:', error);
        return;
      }

      const newProviders = data || [];
      
      if (reset) {
        setProviders(newProviders);
      } else {
        setProviders((prev) => [...prev, ...newProviders]);
      }

      const totalLoaded = reset ? newProviders.length : providers.length + newProviders.length;
      setHasMore(count ? totalLoaded < count : false);
      
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoadingProviders(false);
      setLoadingMore(false);
    }
  };

  const loadMoreProviders = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProviders(nextPage, false);
  };

  const clearFilters = () => {
    setSelectedCommune('all');
    setSelectedCategory('all');
    setMinRating('0');
    setShowVerifiedOnly(false);
    setShowAvailableOnly(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar isConnected={!!user} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton width="100%" height={200} className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-4xl text-yo-green-dark mb-2">
            👥 Prestataires de services
          </h1>
          <p className="text-yo-gray-600 text-lg">
            Découvrez les meilleurs professionnels près de chez vous
          </p>
        </div>

        {/* Recherche + Filtres */}
        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yo-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un prestataire..."
                className="w-full pl-12 pr-4 py-3 bg-white rounded-lg border-2 border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtres
              {(selectedCommune !== 'all' || minRating !== '0' || showVerifiedOnly || showAvailableOnly) && (
                <Badge className="bg-yo-orange text-white">●</Badge>
              )}
            </Button>
          </form>

          {/* Panneau filtres */}
          {showFilters && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filtres</h3>
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Commune */}
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                    Commune
                  </label>
                  <select
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green"
                  >
                    <option value="all">Toutes</option>
                    {communes.map((commune) => (
                      <option key={commune} value={commune}>{commune}</option>
                    ))}
                  </select>
                </div>

                {/* Note minimale */}
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                    Note minimale
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green"
                  >
                    <option value="0">Toutes les notes</option>
                    <option value="3">⭐ 3+ étoiles</option>
                    <option value="4">⭐ 4+ étoiles</option>
                    <option value="4.5">⭐ 4.5+ étoiles</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showVerifiedOnly}
                      onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                      className="w-5 h-5 text-yo-green rounded focus:ring-2 focus:ring-yo-green"
                    />
                    <span className="text-sm font-medium text-yo-gray-700">
                      ✅ Vérifiés uniquement
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAvailableOnly}
                      onChange={(e) => setShowAvailableOnly(e.target.checked)}
                      className="w-5 h-5 text-yo-green rounded focus:ring-2 focus:ring-yo-green"
                    />
                    <span className="text-sm font-medium text-yo-gray-700">
                      🟢 Disponibles maintenant
                    </span>
                  </label>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Compteur */}
        <div className="mb-6">
          <p className="text-yo-gray-600">
            <span className="font-bold text-yo-green-dark">{providers.length}</span> prestataire{providers.length > 1 ? 's' : ''} trouvé{providers.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille prestataires */}
        {loadingProviders ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} width="100%" height={300} />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-yo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-yo-gray-400" />
              </div>
              <h3 className="font-display font-bold text-2xl text-yo-gray-800 mb-2">
                Aucun prestataire trouvé
              </h3>
              <p className="text-yo-gray-600 mb-6">
                Essayez de modifier vos filtres.
              </p>
              <Button onClick={clearFilters} variant="secondary">
                Réinitialiser les filtres
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {providers.map((provider) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="p-6 hover:shadow-yo-lg transition-all cursor-pointer relative"
                    onClick={() => router.push(`/offreurs/${provider.id}`)}
                  >
                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1">
                      {provider.is_premium && (
                        <Badge className="bg-yo-orange text-white">
                          👑 Premium
                        </Badge>
                      )}
                      {provider.verification_status === 'verified' && (
                        <Badge className="bg-yo-green text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>

                    {/* Avatar + Status */}
                    <div className="flex flex-col items-center mb-4">
                      <div className="relative">
                        <Avatar
                          firstName={provider.first_name}
                          lastName={provider.last_name}
                          imageUrl={provider.avatar_url}
                          size="xl"
                        />
                        {provider.is_active && (
                          <div className="absolute bottom-1 right-1 w-4 h-4 bg-yo-green rounded-full border-2 border-white" />
                        )}
                      </div>
                      <h3 className="font-display font-bold text-lg text-yo-gray-900 mt-3 text-center">
                        {provider.first_name} {provider.last_name}
                      </h3>
                      <p className="text-sm text-yo-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {provider.commune}
                      </p>
                    </div>

                    {/* Bio */}
                    {provider.bio && (
                      <p className="text-sm text-yo-gray-600 mb-4 line-clamp-2 text-center">
                        {provider.bio}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="space-y-2 pt-4 border-t border-yo-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-yo-gray-600">Note</span>
                        <div className="flex items-center gap-1 font-semibold text-yo-green-dark">
                          <Star className="w-4 h-4 fill-current" />
                          {provider.average_rating.toFixed(1)}
                          <span className="text-xs text-yo-gray-500">
                            ({provider.total_reviews})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-yo-gray-600">Missions</span>
                        <span className="font-semibold text-yo-gray-900">
                          {provider.total_missions_completed}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/messages?to=${provider.id}`);
                      }}
                      className="w-full mt-4"
                      size="sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contacter
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Loader */}
            {loadingMore && (
              <div className="mt-8 flex items-center justify-center">
                <Card className="p-6">
                  <div className="flex items-center gap-3 text-yo-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Chargement...</span>
                  </div>
                </Card>
              </div>
            )}

            {/* Observer */}
            {hasMore && !loadingProviders && (
              <div ref={observerTarget} className="h-10 mt-8" />
            )}

            {/* Fin */}
            {!hasMore && providers.length > 0 && (
              <div className="mt-8">
                <Card className="p-6 text-center">
                  <p className="text-yo-gray-500 text-sm">
                    ✨ Vous avez vu tous les prestataires disponibles
                  </p>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
