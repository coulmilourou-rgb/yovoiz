'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORIES } from '@/lib/constants';
import { CATEGORY_DETAILS } from '@/lib/category-subcategories';
import { Search, ArrowRight, TrendingUp, X, ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const handlePublishClick = () => {
    if (!user) {
      router.push('/auth/connexion?redirect=/missions/nouvelle');
    } else {
      router.push('/missions/nouvelle');
    }
  };

  const handleContactClick = () => {
    router.push('/aide');
  };

  const filteredCategories = CATEGORIES.filter(cat => {
    if (!cat || !cat.label) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = cat.label.toLowerCase().includes(searchLower);
    const descMatch = cat.description?.toLowerCase().includes(searchLower);
    
    return nameMatch || descMatch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar 
        isConnected={!!user} 
        user={profile ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        } : undefined}
      />

      {/* Hero */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-yo-orange to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display font-black text-5xl md:text-6xl mb-6">
            Toutes nos catégories
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Plus de {CATEGORIES.length} catégories de services à Abidjan
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-2">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une catégorie..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {searchTerm && (
            <div className="mb-8">
              <p className="text-gray-600">
                <span className="font-semibold">{filteredCategories.length}</span> résultat{filteredCategories.length > 1 ? 's' : ''} pour "{searchTerm}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredCategories.map((category) => (
              <Card 
                key={category.id} 
                onClick={() => setSelectedCategory(category)}
                className="p-6 h-full hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-4xl`} style={{ backgroundColor: category.color }}>
                  {category.emoji}
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-yo-orange transition-colors">
                  {category.label}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Card>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">Aucun résultat</h3>
              <p className="text-gray-600 mb-6">
                Aucune catégorie ne correspond à "{searchTerm}"
              </p>
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Voir toutes les catégories
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Catégories les plus populaires
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-yo-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-yo-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ménage & Nettoyage</h3>
              <p className="text-3xl font-black text-yo-orange mb-2">450+</p>
              <p className="text-sm text-gray-600">demandes ce mois-ci</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-yo-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-yo-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Plomberie</h3>
              <p className="text-3xl font-black text-yo-green mb-2">320+</p>
              <p className="text-sm text-gray-600">demandes ce mois-ci</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Électricité</h3>
              <p className="text-3xl font-black text-blue-500 mb-2">280+</p>
              <p className="text-sm text-gray-600">demandes ce mois-ci</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-yo-green to-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Tu ne trouves pas ta catégorie ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Publie quand même ta demande ! Nos prestataires polyvalents pourront te répondre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handlePublishClick}
              className="bg-white text-yo-green hover:bg-gray-100"
            >
              Publier ma demande
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              onClick={handleContactClick}
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/10"
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </section>

      {/* Modal Catégorie */}
      {selectedCategory && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCategory(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              className="sticky top-0 text-white p-6 rounded-t-2xl"
              style={{ backgroundColor: selectedCategory.color.replace('0.1)', '1)').replace('rgba', 'rgb') || '#FF6B35' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{selectedCategory.emoji}</div>
                  <div>
                    <h2 className="text-3xl font-black mb-2">{selectedCategory.label}</h2>
                    <p className="text-lg opacity-90">{selectedCategory.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description détaillée */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">À propos de cette catégorie</h3>
                <p className="text-gray-700 leading-relaxed">
                  {CATEGORY_DETAILS[selectedCategory.id]?.description || 
                    "Retrouvez des prestataires qualifiés dans cette catégorie pour répondre à tous vos besoins."}
                </p>
              </div>

              {/* Services types (sous-catégories) */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Services proposés</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {(CATEGORY_DETAILS[selectedCategory.id]?.subcategories || []).map((subcat, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <ChevronRight className="w-4 h-4 text-yo-orange flex-shrink-0" />
                      <span>{subcat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-black text-yo-orange mb-1">150+</p>
                    <p className="text-sm text-gray-600">Prestataires</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-yo-green mb-1">4.8</p>
                    <p className="text-sm text-gray-600">Note moyenne</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-blue-600 mb-1">2h</p>
                    <p className="text-sm text-gray-600">Délai moyen</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 bg-yo-orange hover:bg-orange-600"
                  onClick={() => {
                    setSelectedCategory(null);
                    router.push(`/home?category=${selectedCategory.id}`);
                  }}
                >
                  Voir les prestataires
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedCategory(null)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
