'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, Clock, ArrowRight, TrendingUp,
  Lightbulb, Award, Users, Target
} from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const { user, profile } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // TODO: Intégrer avec un service d'emailing (Mailchimp, Sendinblue, etc.)
      console.log('Newsletter subscription:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const articles = [
    {
      title: '10 conseils pour réussir en tant que prestataire sur Yo!Voiz',
      excerpt: 'Découvre les meilleures pratiques pour maximiser tes chances de succès sur notre plateforme et augmenter ton chiffre d\'affaires.',
      category: 'Conseils Pro',
      date: '15 Février 2026',
      readTime: '5 min',
      image: '💼',
      slug: 'conseils-prestataire-reussir'
    },
    {
      title: 'Guide Client : Comment utiliser Yo!Voiz en 6 étapes',
      excerpt: 'Tutoriel complet pour trouver le bon prestataire, publier une demande et réussir sa mission. Simple, rapide et sécurisé.',
      category: 'Guide Client',
      date: '15 Février 2026',
      readTime: '6 min',
      image: '📖',
      slug: 'guide-client-utiliser-yovoiz'
    },
    {
      title: 'Actualités de la plateforme : Nouveautés et fonctionnalités',
      excerpt: 'Découvre les dernières nouveautés, fonctionnalités et statistiques de Yo!Voiz. Plus de 500 prestataires nous font confiance !',
      category: 'Actualités',
      date: '15 Février 2026',
      readTime: '5 min',
      image: '📱',
      slug: 'actualites-plateforme'
    },
    {
      title: 'Le marché des services de proximité en Côte d\'Ivoire',
      excerpt: 'Analyse du secteur, tarifs moyens, secteurs qui recrutent et tendances 2026. Opportunités pour les prestataires.',
      category: 'Marché',
      date: '15 Février 2026',
      readTime: '8 min',
      image: '📊',
      slug: 'marche-services-proximite-cote-ivoire'
    },
    {
      title: 'Ils ont réussi avec Yo!Voiz : 5 témoignages inspirants',
      excerpt: 'Découvre les success stories de prestataires et clients qui ont trouvé leur bonheur sur Yo!Voiz. 4.8/5 de satisfaction !',
      category: 'Témoignage',
      date: '15 Février 2026',
      readTime: '7 min',
      image: '💬',
      slug: 'temoignages-utilisateurs'
    },
    {
      title: 'Sécurité, paiement et garanties : tout savoir',
      excerpt: 'Comprendre comment Yo!Voiz protège tes transactions et tes données. Paiement sécurisé, séquestre et garantie satisfait ou remboursé.',
      category: 'Sécurité',
      date: '15 Février 2026',
      readTime: '6 min',
      image: '🔒',
      slug: 'securite-paiement-garanties'
    }
  ];

  const categories = ['Tous', 'Conseils Pro', 'Guide Client', 'Actualités', 'Marché', 'Témoignage', 'Sécurité'];

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
            Le Blog Yo!Voiz
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Conseils, actualités et histoires inspirantes de notre communauté
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Badge variant="primary" className="bg-yo-orange text-white mb-4">
              ⭐ Article à la une
            </Badge>
          </div>
          <Card className="overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-yo-orange/20 to-yo-green/20 flex items-center justify-center text-8xl p-12">
                💼
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-3">
                  Conseils Pro
                </Badge>
                <h2 className="text-3xl font-black mb-4">
                  10 conseils pour réussir en tant que prestataire sur Yo!Voiz
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Découvre les meilleures pratiques pour maximiser tes chances de succès sur notre plateforme 
                  et augmenter ton chiffre d'affaires. De l'optimisation de ton profil à la gestion des avis clients.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    15 Février 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    5 min de lecture
                  </span>
                </div>
                <Button href="/blog/conseils-prestataire-reussir" className="w-fit">
                  Lire l'article
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  cat === 'Tous'
                    ? 'bg-yo-orange text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                <div className="bg-gradient-to-br from-yo-orange/10 to-yo-green/10 flex items-center justify-center text-6xl p-12 group-hover:scale-105 transition-transform">
                  {article.image}
                </div>
                <div className="p-6">
                  <Badge variant="secondary" className="mb-3">
                    {article.category}
                  </Badge>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-yo-orange transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <Link href={`/blog/${article.slug}`}>
                    <span className="text-yo-orange font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                      Lire la suite
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-3xl font-black mb-4">
            Reçois nos meilleurs articles par email
          </h2>
          <p className="text-gray-600 mb-8">
            Inscris-toi à notre newsletter et ne manque aucun conseil pour développer ton activité
          </p>
          
          {subscribed ? (
            <div className="bg-green-100 text-green-800 px-6 py-4 rounded-xl max-w-md mx-auto">
              ✅ Merci ! Tu es maintenant inscrit à notre newsletter
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yo-orange"
              />
              <Button type="submit" className="bg-yo-orange hover:bg-orange-600 whitespace-nowrap">
                M'inscrire
              </Button>
            </form>
          )}
          
          <p className="text-xs text-gray-500 mt-4">
            ✓ 1 email par semaine • ✓ Désabonnement en 1 clic
          </p>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Sujets populaires
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <Lightbulb className="w-10 h-10 text-yo-orange mx-auto mb-3" />
              <h3 className="font-bold mb-1">Conseils Pro</h3>
              <p className="text-sm text-gray-600">24 articles</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <Users className="w-10 h-10 text-yo-green mx-auto mb-3" />
              <h3 className="font-bold mb-1">Témoignages</h3>
              <p className="text-sm text-gray-600">12 articles</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <TrendingUp className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">Marché</h3>
              <p className="text-sm text-gray-600">8 articles</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <Award className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">Actualités</h3>
              <p className="text-sm text-gray-600">15 articles</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-yo-green to-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Prêt à rejoindre l'aventure ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Inscris-toi maintenant et commence à développer ton activité avec Yo!Voiz
          </p>
          <Button size="lg" href="/auth/inscription" className="bg-white text-yo-green hover:bg-gray-100">
            Créer mon compte
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
