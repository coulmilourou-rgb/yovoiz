'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MapPin, Euro, Filter, Search, 
  Users, CheckCircle, Clock, Loader2,
  SlidersHorizontal, X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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

export default function MissionsPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [selectedCommune, setSelectedCommune] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  
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
    if (!loading && !user) {
      router.push('/auth/connexion');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      fetchMissions(0, true);
    }
  }, [profile, selectedCommune, selectedCategory, selectedUrgency, budgetMin, budgetMax]);

  // Intersection Observer pour scroll infini
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loadingMissions) {
          loadMoreMissions();
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
  }, [hasMore, loadingMore, loadingMissions]);

  const fetchMissions = async (pageNum = 0, reset = false) => {
    try {
      if (reset) {
        setLoadingMissions(true);
        setMissions([]);
        setPage(0);
      } else {
        setLoadingMore(true);
      }
      
      const from = pageNum * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

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
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(from, to);

      // Appliquer filtres
      if (selectedCommune !== 'all') {
        query = query.eq('commune', selectedCommune);
      }
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      if (selectedUrgency !== 'all') {
        query = query.eq('urgency', selectedUrgency);
      }
      if (budgetMin) {
        query = query.gte('budget_min', parseInt(budgetMin));
      }
      if (budgetMax) {
        query = query.lte('budget_max', parseInt(budgetMax));
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Erreur chargement missions:', error);
        return;
      }

      const newMissions = data || [];
      
      if (reset) {
        setMissions(newMissions);
      } else {
        setMissions((prev) => [...prev, ...newMissions]);
      }

      const totalLoaded = reset ? newMissions.length : missions.length + newMissions.length;
      setHasMore(count ? totalLoaded < count : false);
      
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoadingMissions(false);
      setLoadingMore(false);
    }
  };

  const loadMoreMissions = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMissions(nextPage, false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter recherche fulltext
    console.log('Recherche:', searchQuery);
  };

  const clearFilters = () => {
    setSelectedCommune('all');
    setSelectedCategory('all');
    setSelectedUrgency('all');
    setBudgetMin('');
    setBudgetMax('');
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
            💼 Toutes les missions
          </h1>
          <p className="text-yo-gray-600 text-lg">
            Parcourez toutes les demandes de services disponibles
          </p>
        </div>

        {/* Barre recherche + Filtres */}
        <div className="mb-6 space-y-4">
          {/* Recherche */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yo-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une mission..."
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
              {(selectedCommune !== 'all' || selectedCategory !== 'all' || selectedUrgency !== 'all' || budgetMin || budgetMax) && (
                <Badge className="bg-yo-orange text-white">●</Badge>
              )}
            </Button>
          </form>

          {/* Panneau filtres */}
          {showFilters && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filtres avancés</h3>
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green"
                  >
                    <option value="all">Toutes</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Urgence */}
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                    Urgence
                  </label>
                  <select
                    value={selectedUrgency}
                    onChange={(e) => setSelectedUrgency(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green"
                  >
                    <option value="all">Toutes</option>
                    <option value="urgent">🔥 Urgent</option>
                    <option value="normal">📅 Normal</option>
                    <option value="flexible">⏰ Flexible</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                    Budget (FCFA)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 bg-white rounded-lg border border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green"
                    />
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 bg-white rounded-lg border border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Compteur résultats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-yo-gray-600">
            <span className="font-bold text-yo-green-dark">{missions.length}</span> mission{missions.length > 1 ? 's' : ''} trouvée{missions.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille missions */}
        {loadingMissions ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} width="100%" height={300} />
            ))}
          </div>
        ) : missions.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-yo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-yo-gray-400" />
              </div>
              <h3 className="font-display font-bold text-2xl text-yo-gray-800 mb-2">
                Aucune mission trouvée
              </h3>
              <p className="text-yo-gray-600 mb-6">
                Essayez de modifier vos filtres ou revenez plus tard.
              </p>
              <Button onClick={clearFilters} variant="secondary">
                Réinitialiser les filtres
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missions.map((mission) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="p-6 hover:shadow-yo-lg transition-all cursor-pointer h-full flex flex-col"
                    onClick={() => router.push(`/missions/${mission.id}`)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          firstName={mission.client.first_name}
                          lastName={mission.client.last_name}
                          imageUrl={mission.client.avatar_url}
                          size="sm"
                        />
                        <div>
                          <p className="font-semibold text-sm text-yo-gray-800">
                            {mission.client.first_name}
                          </p>
                          <p className="text-xs text-yo-gray-500">
                            {mission.commune}
                          </p>
                        </div>
                      </div>
                      <Badge className={getUrgencyColor(mission.urgency)}>
                        {mission.urgency === 'urgent' && '🔥'}
                        {mission.urgency === 'normal' && '📅'}
                        {mission.urgency === 'flexible' && '⏰'}
                      </Badge>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg text-yo-gray-900 mb-2">
                        {mission.title}
                      </h3>
                      <p className="text-yo-gray-600 text-sm mb-4 line-clamp-3">
                        {mission.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="space-y-3 pt-4 border-t border-yo-gray-200">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {mission.category}
                        </Badge>
                        <span className="text-xs text-yo-gray-500">
                          {getTimeAgo(mission.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 font-bold text-yo-green-dark">
                          <Euro className="w-4 h-4" />
                          <span className="text-sm">{mission.budget_min} - {mission.budget_max}</span>
                        </div>
                        <span className="text-xs text-yo-gray-500">FCFA</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Loader scroll infini */}
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

            {/* Observateur */}
            {hasMore && !loadingMissions && (
              <div ref={observerTarget} className="h-10 mt-8" />
            )}

            {/* Fin de liste */}
            {!hasMore && missions.length > 0 && (
              <div className="mt-8">
                <Card className="p-6 text-center">
                  <p className="text-yo-gray-500 text-sm">
                    ✨ Vous avez vu toutes les missions disponibles
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
