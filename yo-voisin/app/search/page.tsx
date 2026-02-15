'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Search, MapPin, User, Star, ArrowRight, 
  Filter, ChevronDown, Loader2 
} from 'lucide-react';

interface ServiceOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  commune: string;
  price_type: string;
  price: number;
  profile_id: string;
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  
  const query = searchParams.get('q') || '';
  const commune = searchParams.get('commune') || '';
  
  const [results, setResults] = useState<ServiceOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchServices();
  }, [query, commune]);

  async function searchServices() {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('service_offers')
        .select(`
          *,
          profiles:profile_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('is_published', true);

      // Filtrer par commune si spécifié
      if (commune) {
        queryBuilder = queryBuilder.contains('communes', [commune]);
      }

      // Recherche textuelle dans titre, description et catégorie
      if (query) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,subcategory.ilike.%${query}%`
        );
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar 
        isConnected={!!user} 
        user={profile ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        } : undefined}
      />

      <div className="max-w-7xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">
            Résultats de recherche
          </h1>
          {query && (
            <p className="text-gray-600">
              pour "<strong>{query}</strong>"
              {commune && ` à ${commune}`}
            </p>
          )}
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">Filtres:</span>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Toutes les communes</option>
              <option>Cocody</option>
              <option>Plateau</option>
              <option>Marcory</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Toutes les catégories</option>
              <option>Ménage</option>
              <option>Bricolage</option>
              <option>Cours</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Trier par pertinence</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Plus récents</option>
            </select>
          </div>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-yo-orange animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Recherche en cours...</p>
          </div>
        ) : results.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Aucun résultat</h2>
            <p className="text-gray-600 mb-6">
              Aucune offre ne correspond à votre recherche.
            </p>
            <Button onClick={() => router.push('/')}>
              Retour à l'accueil
            </Button>
          </Card>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((offer) => (
                <Card 
                  key={offer.id} 
                  className="p-6 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => router.push(`/services/offres/${offer.id}`)}
                >
                  {/* Provider */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {offer.profiles?.avatar_url ? (
                        <img 
                          src={offer.profiles.avatar_url} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {offer.profiles?.first_name} {offer.profiles?.last_name}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{offer.commune}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {offer.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{offer.category}</Badge>
                    {offer.subcategory && (
                      <Badge className="bg-gray-100 text-gray-700">
                        {offer.subcategory}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {offer.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-yo-green">
                        {offer.price.toLocaleString('fr-FR')} FCFA
                      </span>
                      <span className="text-sm text-gray-500">
                        {offer.price_type === 'fixed' ? ' / prestation' : ' / heure'}
                      </span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/services/offres/${offer.id}`);
                      }}
                    >
                      Voir
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-yo-orange animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
