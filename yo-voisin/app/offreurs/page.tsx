'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MapPin, Star, DollarSign, Search, Loader2,
  MessageCircle, CheckCircle, Award, Clock,
  SlidersHorizontal, X, Briefcase, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';

interface ServiceOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  pricing_type: string;
  price_hourly: number | null;
  price_fixed_min: number | null;
  price_fixed_max: number | null;
  communes: string[];
  photos: string[];
  provider_id: string;
  created_at: string;
  provider: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    commune: string;
    average_rating: number;
    total_reviews: number;
    is_pro: boolean;
    verification_status: string;
  };
}

export default function OffreursPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  useRequireAuth(); // Protection de la page
  
  const [offers, setOffers] = useState<ServiceOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCommune, setSelectedCommune] = useState('all');
  const [onlyPro, setOnlyPro] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [minRating, setMinRating] = useState(0);
  
  const observerTarget = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 12;

  // Catégories disponibles
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
    if (profile) {
      fetchOffers(0, true);
    }
  }, [profile, selectedCategory, selectedCommune, onlyPro, onlyVerified, minRating]);

  // Intersection Observer pour scroll infini
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreOffers();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading]);

  const fetchOffers = async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
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
        .order('created_at', { ascending: false })
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

      // Appliquer filtres
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      // Filtres côté client (car pas de colonne dans service_offers)
      // Filtrer par commune (priorité : filtre utilisateur > commune du profil)
      if (selectedCommune !== 'all') {
        filteredData = filteredData.filter(offer => 
          offer.communes && offer.communes.includes(selectedCommune)
        );
      } else if (profile?.commune) {
        // Par défaut, afficher les offres disponibles dans la commune de l'utilisateur
        filteredData = filteredData.filter(offer => 
          offer.communes && offer.communes.includes(profile.commune)
        );
      }

      if (onlyPro) {
        filteredData = filteredData.filter(offer => offer.provider?.is_pro);
      }

      if (onlyVerified) {
        filteredData = filteredData.filter(offer => 
          offer.provider?.verification_status === 'verified'
        );
      }

      if (minRating > 0) {
        filteredData = filteredData.filter(offer => 
          offer.provider?.average_rating >= minRating
        );
      }

      if (reset) {
        setOffers(filteredData);
        setPage(0);
      } else {
        setOffers(prev => [...prev, ...filteredData]);
      }

      setHasMore(filteredData.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Erreur chargement offres:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreOffers = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOffers(nextPage, false);
  };

  const handleContact = (providerId: string) => {
    router.push(`/messages?user=${providerId}`);
  };

  const handleViewProfile = (providerId: string) => {
    router.push(`/profile/public/${providerId}`);
  };

  // Filtrer par recherche
  const filteredOffers = offers.filter(offer => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      offer.title.toLowerCase().includes(search) ||
      offer.description.toLowerCase().includes(search) ||
      offer.category.toLowerCase().includes(search) ||
      offer.provider?.first_name?.toLowerCase().includes(search) ||
      offer.provider?.last_name?.toLowerCase().includes(search)
    );
  });

  // Grouper les offres par catégorie
  interface CategoryGroup {
    category: string;
    offers: ServiceOffer[];
    totalCount: number;
  }

  const groupedByCategory: CategoryGroup[] = filteredOffers.reduce((acc, offer) => {
    const existing = acc.find(g => g.category === offer.category);
    
    if (existing) {
      existing.offers.push(offer);
      existing.totalCount++;
    } else {
      acc.push({
        category: offer.category,
        offers: [offer],
        totalCount: 1
      });
    }
    
    return acc;
  }, [] as CategoryGroup[]);

  // Trier les catégories par nombre d'offres (décroissant)
  groupedByCategory.sort((a, b) => b.totalCount - a.totalCount);

  const handleViewAllCategory = (category: string) => {
    setSelectedCategory(category);
    setShowFilters(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCommune('all');
    setOnlyPro(false);
    setOnlyVerified(false);
    setMinRating(0);
    setSearchTerm('');
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedCommune !== 'all' ? 1 : 0) +
    (onlyPro ? 1 : 0) +
    (onlyVerified ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  if (authLoading || (loading && offers.length === 0)) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar />
        <PageHead
          title="Découvrir les offreurs"
          subtitle="Trouvez le bon prestataire pour vos besoins"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <Navbar />
      <PageHead
        title="Découvrir les offreurs"
        subtitle="Trouvez le bon prestataire pour vos besoins"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche et filtres */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-yo-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un service, un prestataire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-yo-gray-300 rounded-lg focus:ring-2 focus:ring-yo-orange focus:border-transparent"
              />
            </div>

            {/* Bouton filtres */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="secondary"
              className="relative"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yo-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Panel filtres */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-yo-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-semibold text-yo-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-yo-gray-300 rounded-lg focus:ring-2 focus:ring-yo-orange focus:border-transparent"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Commune */}
                <div>
                  <label className="block text-sm font-semibold text-yo-gray-700 mb-2">
                    Commune
                  </label>
                  <select
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    className="w-full px-3 py-2 border border-yo-gray-300 rounded-lg focus:ring-2 focus:ring-yo-orange focus:border-transparent"
                  >
                    <option value="all">Toutes les communes</option>
                    {communes.map(commune => (
                      <option key={commune} value={commune}>{commune}</option>
                    ))}
                  </select>
                </div>

                {/* Note minimale */}
                <div>
                  <label className="block text-sm font-semibold text-yo-gray-700 mb-2">
                    Note minimale
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-yo-gray-300 rounded-lg focus:ring-2 focus:ring-yo-orange focus:border-transparent"
                  >
                    <option value={0}>Toutes les notes</option>
                    <option value={4}>4+ étoiles</option>
                    <option value={4.5}>4.5+ étoiles</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyPro}
                    onChange={(e) => setOnlyPro(e.target.checked)}
                    className="w-4 h-4 text-yo-orange border-yo-gray-300 rounded focus:ring-yo-orange"
                  />
                  <span className="text-sm text-yo-gray-700">Professionnels uniquement</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="w-4 h-4 text-yo-orange border-yo-gray-300 rounded focus:ring-yo-orange"
                  />
                  <span className="text-sm text-yo-gray-700">Vérifiés uniquement</span>
                </label>
              </div>

              {/* Bouton réinitialiser */}
              {activeFiltersCount > 0 && (
                <Button
                  onClick={resetFilters}
                  variant="secondary"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Réinitialiser les filtres
                </Button>
              )}
            </motion.div>
          )}
        </Card>

        {/* Compteur résultats */}
        <div className="mb-6">
          <p className="text-yo-gray-600">
            {selectedCategory !== 'all' ? (
              <>
                <span className="font-semibold text-yo-gray-900">{filteredOffers.length}</span> offre{filteredOffers.length > 1 ? 's' : ''} en <span className="font-semibold text-yo-orange">{selectedCategory}</span>
              </>
            ) : (
              <>
                <span className="font-semibold text-yo-gray-900">{filteredOffers.length}</span> offre{filteredOffers.length > 1 ? 's' : ''} dans <span className="font-semibold text-yo-orange">{groupedByCategory.length}</span> catégorie{groupedByCategory.length > 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>

        {/* Affichage par catégories ou liste complète */}
        {filteredOffers.length > 0 ? (
          <>
            {selectedCategory === 'all' && !searchTerm ? (
              /* Vue groupée par catégories */
              <div className="space-y-12">
                {groupedByCategory.map((group) => (
                  <div key={group.category}>
                    {/* En-tête de catégorie */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-yo-gray-900">
                          {group.category}
                        </h2>
                        <p className="text-sm text-yo-gray-500 mt-1">
                          {group.totalCount} offre{group.totalCount > 1 ? 's' : ''} disponible{group.totalCount > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Grille d'offres (max 3) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                      {group.offers.slice(0, 3).map((offer, index) => (
                        <motion.div
                          key={offer.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card className="overflow-hidden hover:shadow-yo-lg hover:scale-[1.02] transition-all duration-300 h-full flex flex-col group cursor-pointer" onClick={() => handleViewProfile(offer.provider_id)}>
                            {/* En-tête : Photo de profil + Nom + Badge */}
                            <div className="p-4 pb-3">
                              <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                  <Avatar
                                    firstName={offer.provider?.first_name}
                                    lastName={offer.provider?.last_name}
                                    imageUrl={offer.provider?.avatar_url}
                                    size="md"
                                  />
                                  {/* Badge statut en coin */}
                                  {offer.provider?.is_pro ? (
                                    <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                      PRO
                                    </div>
                                  ) : (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                      Part.
                                    </div>
                                  )}
                                </div>

                                {/* Nom + Prénom + Vérification */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-display font-bold text-lg text-yo-gray-900 truncate">
                                      {offer.provider?.first_name} {offer.provider?.last_name}
                                    </h3>
                                    {offer.provider?.verification_status === 'verified' && (
                                      <CheckCircle className="w-4 h-4 text-yo-green flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="px-4 pb-3 space-y-2">
                              {/* Catégorie / Service proposé */}
                              <div>
                                <Badge variant="secondary" className="text-sm font-medium">
                                  {offer.category}
                                </Badge>
                              </div>

                              {/* Titre du service */}
                              <p className="text-sm text-yo-gray-700 font-medium line-clamp-2">
                                {offer.title}
                              </p>

                              {/* Commune */}
                              <div className="flex items-center gap-1.5 text-yo-gray-600">
                                <MapPin className="w-4 h-4 text-yo-orange" />
                                <span className="text-sm font-medium">{offer.provider?.commune}</span>
                              </div>
                            </div>

                            {/* 2 photos de l'activité */}
                            {offer.photos && offer.photos.length > 0 ? (
                              <div className="grid grid-cols-2 gap-1 px-1 mb-3">
                                {offer.photos.slice(0, 2).map((photo, idx) => (
                                  <div key={idx} className="relative h-32 bg-yo-gray-100 overflow-hidden rounded">
                                    <img 
                                      src={photo} 
                                      alt={`${offer.title} ${idx + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                ))}
                                {/* Si une seule photo, ajouter un placeholder */}
                                {offer.photos.length === 1 && (
                                  <div className="relative h-32 bg-yo-gray-100 flex items-center justify-center rounded">
                                    <Briefcase className="w-8 h-8 text-yo-gray-300" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-1 px-1 mb-3">
                                <div className="relative h-32 bg-gradient-to-br from-yo-orange/10 to-yo-green/10 flex items-center justify-center rounded">
                                  <Briefcase className="w-8 h-8 text-yo-gray-300" />
                                </div>
                                <div className="relative h-32 bg-gradient-to-br from-yo-green/10 to-yo-orange/10 flex items-center justify-center rounded">
                                  <Briefcase className="w-8 h-8 text-yo-gray-300" />
                                </div>
                              </div>
                            )}

                            {/* Note et avis */}
                            <div className="px-4 pb-4 border-t border-yo-gray-200 pt-3">
                              {offer.provider && offer.provider.average_rating > 0 ? (
                                <div className="flex items-center gap-2">
                                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                  <span className="font-bold text-lg text-yo-gray-900">
                                    {offer.provider.average_rating.toFixed(1)}/5
                                  </span>
                                  <span className="text-sm text-yo-gray-500">
                                    ({offer.provider.total_reviews} avis)
                                  </span>
                                </div>
                              ) : (
                                <div className="text-sm text-yo-gray-500">Aucun avis</div>
                              )}
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bouton Voir tout */}
                    {group.totalCount > 3 && (
                      <div className="flex justify-center">
                        <Button
                          onClick={() => handleViewAllCategory(group.category)}
                          variant="secondary"
                          className="px-8 py-2.5"
                        >
                          Voir tout ({group.totalCount})
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Vue liste complète (avec filtres actifs ou recherche) */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredOffers.map((offer, index) => (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden hover:shadow-yo-lg hover:scale-[1.02] transition-all duration-300 h-full flex flex-col group cursor-pointer" onClick={() => handleViewProfile(offer.provider_id)}>
                        {/* En-tête : Photo de profil + Nom + Badge */}
                        <div className="p-4 pb-3">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <Avatar
                                firstName={offer.provider?.first_name}
                                lastName={offer.provider?.last_name}
                                imageUrl={offer.provider?.avatar_url}
                                size="md"
                              />
                              {/* Badge statut en coin */}
                              {offer.provider?.is_pro ? (
                                <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                  PRO
                                </div>
                              ) : (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                  Part.
                                </div>
                              )}
                            </div>

                            {/* Nom + Prénom + Vérification */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-display font-bold text-lg text-yo-gray-900 truncate">
                                  {offer.provider?.first_name} {offer.provider?.last_name}
                                </h3>
                                {offer.provider?.verification_status === 'verified' && (
                                  <CheckCircle className="w-4 h-4 text-yo-green flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 pb-3 space-y-2">
                          {/* Catégorie / Service proposé */}
                          <div>
                            <Badge variant="secondary" className="text-sm font-medium">
                              {offer.category}
                            </Badge>
                          </div>

                          {/* Titre du service */}
                          <p className="text-sm text-yo-gray-700 font-medium line-clamp-2">
                            {offer.title}
                          </p>

                          {/* Commune */}
                          <div className="flex items-center gap-1.5 text-yo-gray-600">
                            <MapPin className="w-4 h-4 text-yo-orange" />
                            <span className="text-sm font-medium">{offer.provider?.commune}</span>
                          </div>
                        </div>

                        {/* 2 photos de l'activité */}
                        {offer.photos && offer.photos.length > 0 ? (
                          <div className="grid grid-cols-2 gap-1 px-1 mb-3">
                            {offer.photos.slice(0, 2).map((photo, idx) => (
                              <div key={idx} className="relative h-32 bg-yo-gray-100 overflow-hidden rounded">
                                <img 
                                  src={photo} 
                                  alt={`${offer.title} ${idx + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ))}
                            {/* Si une seule photo, ajouter un placeholder */}
                            {offer.photos.length === 1 && (
                              <div className="relative h-32 bg-yo-gray-100 flex items-center justify-center rounded">
                                <Briefcase className="w-8 h-8 text-yo-gray-300" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-1 px-1 mb-3">
                            <div className="relative h-32 bg-gradient-to-br from-yo-orange/10 to-yo-green/10 flex items-center justify-center rounded">
                              <Briefcase className="w-8 h-8 text-yo-gray-300" />
                            </div>
                            <div className="relative h-32 bg-gradient-to-br from-yo-green/10 to-yo-orange/10 flex items-center justify-center rounded">
                              <Briefcase className="w-8 h-8 text-yo-gray-300" />
                            </div>
                          </div>
                        )}

                        {/* Note et avis */}
                        <div className="px-4 pb-4 border-t border-yo-gray-200 pt-3">
                          {offer.provider && offer.provider.average_rating > 0 ? (
                            <div className="flex items-center gap-2">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold text-lg text-yo-gray-900">
                                {offer.provider.average_rating.toFixed(1)}/5
                              </span>
                              <span className="text-sm text-yo-gray-500">
                                ({offer.provider.total_reviews} avis)
                              </span>
                            </div>
                          ) : (
                            <div className="text-sm text-yo-gray-500">Aucun avis</div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Observer pour scroll infini (seulement si filtres actifs) */}
                {selectedCategory !== 'all' && hasMore && (
                  <div ref={observerTarget} className="py-8 flex justify-center">
                    {loadingMore && (
                      <Loader2 className="w-8 h-8 text-yo-orange animate-spin" />
                    )}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          /* Aucun résultat */
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-yo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-yo-gray-400" />
              </div>
              <h3 className="font-display font-bold text-2xl text-yo-gray-800 mb-2">
                Aucune offre trouvée
              </h3>
              <p className="text-yo-gray-600 mb-6">
                Essayez de modifier vos critères de recherche
              </p>
              <Button onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
