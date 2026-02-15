'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Clock, Search, Filter,
  TrendingUp, BookOpen, Star, Users, Shield,
  BarChart3, MessageCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';

export default function ArticlesPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const allArticles = [
    {
      title: '10 conseils pour réussir en tant que prestataire sur Yo!Voiz',
      excerpt: 'Découvre les meilleures pratiques pour maximiser tes chances de succès sur notre plateforme et augmenter ton chiffre d\'affaires.',
      category: 'Conseils Pro',
      date: '15 Février 2026',
      readTime: '5 min',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'orange',
      slug: 'conseils-prestataire-reussir'
    },
    {
      title: 'Guide Client : Comment utiliser Yo!Voiz en 6 étapes',
      excerpt: 'Tutoriel complet pour trouver le bon prestataire, publier une demande et réussir sa mission. Simple, rapide et sécurisé.',
      category: 'Guide Client',
      date: '15 Février 2026',
      readTime: '6 min',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'blue',
      slug: 'guide-client-utiliser-yovoiz'
    },
    {
      title: 'Actualités de la plateforme : Nouveautés et fonctionnalités',
      excerpt: 'Découvre les dernières nouveautés, fonctionnalités et statistiques de Yo!Voiz. Plus de 500 prestataires nous font confiance !',
      category: 'Actualités',
      date: '15 Février 2026',
      readTime: '5 min',
      icon: <Star className="w-6 h-6" />,
      color: 'purple',
      slug: 'actualites-plateforme'
    },
    {
      title: 'Le marché des services de proximité en Côte d\'Ivoire',
      excerpt: 'Analyse du secteur, tarifs moyens, secteurs qui recrutent et tendances 2026. Opportunités pour les prestataires.',
      category: 'Marché',
      date: '15 Février 2026',
      readTime: '8 min',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'green',
      slug: 'marche-services-proximite-cote-ivoire'
    },
    {
      title: 'Ils ont réussi avec Yo!Voiz : 5 témoignages inspirants',
      excerpt: 'Découvre les success stories de prestataires et clients qui ont trouvé leur bonheur sur Yo!Voiz. 4.8/5 de satisfaction !',
      category: 'Témoignage',
      date: '15 Février 2026',
      readTime: '7 min',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'pink',
      slug: 'temoignages-utilisateurs'
    },
    {
      title: 'Sécurité, paiement et garanties : tout savoir',
      excerpt: 'Comprendre comment Yo!Voiz protège tes transactions et tes données. Paiement sécurisé, séquestre et garantie satisfait ou remboursé.',
      category: 'Sécurité',
      date: '15 Février 2026',
      readTime: '6 min',
      icon: <Shield className="w-6 h-6" />,
      color: 'red',
      slug: 'securite-paiement-garanties'
    }
  ];

  const categories = ['Tous', 'Conseils Pro', 'Guide Client', 'Actualités', 'Marché', 'Témoignage', 'Sécurité'];

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Conseils Pro': 'orange',
      'Guide Client': 'blue',
      'Actualités': 'purple',
      'Marché': 'green',
      'Témoignage': 'pink',
      'Sécurité': 'red'
    };
    return colors[category] || 'gray';
  };

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <PageHead 
        title="Tous les articles - Blog Yo!Voiz" 
        description="Retrouvez tous nos articles, guides, actualités et témoignages"
      />
      <Navbar 
        isConnected={!!user}
        user={profile ? {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        } : undefined}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/blog')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au blog
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-yo-green-dark mb-4">
            Tous les articles
          </h1>
          <p className="text-xl text-gray-600">
            {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} disponible{filteredArticles.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-yo-orange text-white' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Aucun article trouvé</p>
            <p className="text-gray-500">Essaie de modifier tes critères de recherche</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="p-6 hover:shadow-xl transition-all cursor-pointer group h-full"
                  onClick={() => router.push(`/blog/${article.slug}`)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 bg-${article.color}-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <div className={`text-${article.color}-600`}>
                        {article.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <Badge className={`bg-${getCategoryColor(article.category)}-100 text-${getCategoryColor(article.category)}-800 mb-2`}>
                        {article.category}
                      </Badge>
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-yo-orange transition-colors">
                        {article.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-yo-orange to-orange-600 text-white text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-white/90" />
          <h2 className="font-display font-bold text-3xl mb-4">
            Rejoins la communauté Yo!Voiz
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Plus de 10.000 utilisateurs trouvent des services de qualité chaque jour
          </p>
          <Button 
            size="lg" 
            className="bg-white text-orange-700 hover:bg-white/90"
            onClick={() => router.push(user ? '/home' : '/auth/inscription')}
          >
            {user ? 'Publier une demande' : 'Créer mon compte gratuit'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
