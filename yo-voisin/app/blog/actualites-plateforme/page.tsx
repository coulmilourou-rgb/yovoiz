'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, TrendingUp, Users, Zap,
  Award, BarChart3, MapPin, Sparkles, ArrowRight,
  CheckCircle, Star, Target
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

export default function ActualitesPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const news = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Lancement officiel de Yo!Voiz en février 2026",
      date: "15 février 2026",
      color: "orange",
      content: "Yo!Voiz ouvre ses portes avec une plateforme moderne et intuitive connectant clients et prestataires de services à Abidjan. Notre mission : rendre les services de proximité accessibles à tous en quelques clics."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Déjà 500+ prestataires inscrits !",
      date: "15 février 2026",
      color: "green",
      content: "En seulement quelques semaines de bêta-test, plus de 500 prestataires nous ont fait confiance dans 15 catégories de services. Merci pour votre confiance !"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Système de badge 'Pro' pour les meilleurs",
      date: "10 février 2026",
      color: "blue",
      content: "Nous lançons le badge 'Pro' pour récompenser les prestataires sérieux et expérimentés. Avantages : priorité dans les recherches, outils de gestion professionnels (devis, factures, tableau de bord)."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Expansion dans 14 communes d'Abidjan",
      date: "1 février 2026",
      color: "purple",
      content: "Yo!Voiz couvre maintenant 14 communes : Yopougon, Cocody, Abobo, Adjamé, Marcory, Treichville, Koumassi, Port-Bouët, Attécoubé, Plateau, Bingerville, Anyama, Songon, Brofodoumé."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Paiement Mobile Money intégré",
      date: "25 janvier 2026",
      color: "green",
      content: "Simplifiez vos paiements ! Orange Money, MTN Mobile Money et Moov Money sont maintenant intégrés pour des transactions rapides et sécurisées."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "10.000+ demandes de services en bêta",
      date: "20 janvier 2026",
      color: "orange",
      content: "Notre phase de test a généré plus de 10.000 demandes de services avec un taux de satisfaction de 4.8/5. Les catégories les plus demandées : Ménage (35%), Livraison (22%), Plomberie (15%)."
    }
  ];

  const stats = [
    { number: "500+", label: "Prestataires actifs", icon: Users },
    { number: "10.000+", label: "Missions réalisées", icon: CheckCircle },
    { number: "4.8/5", label: "Note moyenne", icon: Star },
    { number: "14", label: "Communes couvertes", icon: MapPin },
    { number: "15", label: "Catégories de services", icon: Target },
    { number: "2h", label: "Délai moyen de réponse", icon: Zap }
  ];

  const upcoming = [
    {
      title: "Application mobile iOS & Android",
      date: "Mars 2026",
      description: "Télécharge l'app Yo!Voiz pour publier tes demandes encore plus rapidement"
    },
    {
      title: "Système de fidélité et récompenses",
      date: "Avril 2026",
      description: "Gagne des points à chaque mission et obtiens des réductions"
    },
    {
      title: "Abonnements mensuels pour clients réguliers",
      date: "Mai 2026",
      description: "Forfaits ménage, courses, etc. avec tarifs préférentiels"
    },
    {
      title: "Expansion à Yamoussoukro et Bouaké",
      date: "Juin 2026",
      description: "Yo!Voiz arrive dans les autres grandes villes de Côte d'Ivoire"
    }
  ];

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <PageHead 
        title="Actualités Yo!Voiz - Nouveautés de la plateforme" 
        description="Découvrez les dernières nouveautés et fonctionnalités de Yo!Voiz"
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

      <div className="max-w-5xl mx-auto px-6 py-8">
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
          className="mb-12"
        >
          <Badge className="bg-purple-100 text-purple-800 mb-4">
            <TrendingUp className="w-3 h-3 mr-1" />
            Actualités
          </Badge>
          
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-yo-green-dark mb-4">
            Actualités de la plateforme
          </h1>
          
          <p className="text-xl text-gray-600">
            Découvre les dernières nouveautés, fonctionnalités et statistiques de Yo!Voiz
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <stat.icon className="w-8 h-8 text-yo-orange mx-auto mb-2" />
              <p className="text-3xl font-black text-gray-900 mb-1">{stat.number}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* News Timeline */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6">
            Dernières actualités
          </h2>
          <div className="space-y-6">
            {news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 bg-${item.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <div className={`text-${item.color}-600`}>
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-xl text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.date}
                      </p>
                      <p className="text-gray-700 leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6">
            À venir prochainement
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {upcoming.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{feature.date}</Badge>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-br from-yo-orange to-orange-600 text-white text-center">
          <h2 className="font-display font-bold text-3xl mb-4">
            Suis notre actualité
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Reste informé des nouvelles fonctionnalités et améliorations
          </p>
          <Button 
            size="lg" 
            className="bg-white text-orange-700 hover:bg-white/90"
            onClick={() => router.push('/blog')}
          >
            Voir tous les articles
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
