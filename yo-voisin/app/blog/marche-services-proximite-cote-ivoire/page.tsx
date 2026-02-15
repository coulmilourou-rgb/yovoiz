'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, TrendingUp, DollarSign, Users,
  Briefcase, Home, Wrench, Package, Car, UtensilsCrossed,
  Shirt, Baby, Heart, Globe, BarChart3, Target, ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

export default function MarcheServicesPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const topSectors = [
    {
      icon: <Home className="w-8 h-8" />,
      name: "Ménage & Entretien",
      demand: "Très forte",
      avgPrice: "5.000 - 15.000 FCFA",
      growth: "+35%",
      color: "orange",
      description: "Le secteur le plus demandé. Gouvernantes, femmes de ménage, agents d'entretien sont recherchés quotidiennement."
    },
    {
      icon: <Package className="w-8 h-8" />,
      name: "Livraison & Courses",
      demand: "Très forte",
      avgPrice: "1.500 - 8.000 FCFA",
      growth: "+42%",
      color: "green",
      description: "Explosion de la demande post-COVID. Livraison de repas, courses, colis express."
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      name: "Plomberie & Électricité",
      demand: "Forte",
      avgPrice: "8.000 - 50.000 FCFA",
      growth: "+28%",
      color: "blue",
      description: "Besoin constant. Interventions rapides pour fuites, pannes électriques, installations."
    },
    {
      icon: <Car className="w-8 h-8" />,
      name: "Transport & Déménagement",
      demand: "Forte",
      avgPrice: "10.000 - 80.000 FCFA",
      growth: "+22%",
      color: "purple",
      description: "Déménagements, transport de marchandises, courses urgentes."
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      name: "Restauration & Traiteur",
      demand: "Moyenne",
      avgPrice: "15.000 - 200.000 FCFA",
      growth: "+18%",
      color: "red",
      description: "Événements, mariages, anniversaires. Cuisiniers et traiteurs à domicile."
    },
    {
      icon: <Baby className="w-8 h-8" />,
      name: "Garde d'enfants & Éducation",
      demand: "Moyenne",
      avgPrice: "20.000 - 50.000 FCFA/mois",
      growth: "+15%",
      color: "pink",
      description: "Nounous, baby-sitters, soutien scolaire. Très recherché par familles actives."
    }
  ];

  const priceRanges = [
    {
      category: "Services express",
      examples: "Courses, livraison documents, petit ménage",
      min: "1.000",
      max: "5.000",
      duration: "< 2h"
    },
    {
      category: "Services standards",
      examples: "Grand ménage, réparations simples, jardinage",
      min: "5.000",
      max: "20.000",
      duration: "2-4h"
    },
    {
      category: "Services professionnels",
      examples: "Plomberie, électricité, peinture, déménagement",
      min: "20.000",
      max: "100.000",
      duration: "Journée"
    },
    {
      category: "Services premium",
      examples: "Traiteur événements, rénovation complète, services récurrents",
      min: "100.000",
      max: "500.000+",
      duration: "Plusieurs jours"
    }
  ];

  const trends2026 = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Digitalisation massive",
      description: "80% des demandes se font désormais en ligne. Les prestataires sans présence digitale perdent 60% des opportunités."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Professionnalisation du secteur",
      description: "Les clients privilégient les prestataires avec avis, portfolio et certifications. Le badge 'Pro' devient un atout majeur."
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Paiement mobile généralisé",
      description: "Mobile Money représente 70% des transactions. Orange Money et MTN dominent le marché."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Économie collaborative en croissance",
      description: "De plus en plus d'Ivoiriens complètent leurs revenus via les plateformes de services. +50% d'inscrits en 2026."
    }
  ];

  const opportunities = [
    {
      title: "Devenir prestataire sur Yo!Voiz",
      desc: "Accède à des milliers de clients potentiels dans ta zone",
      cta: "Créer mon profil",
      action: () => router.push(user ? '/home' : '/auth/inscription')
    },
    {
      title: "Passer au compte Pro",
      desc: "Outils professionnels + priorité dans les recherches",
      cta: "Découvrir l'offre Pro",
      action: () => router.push('/abonnement')
    }
  ];

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <PageHead 
        title="Le marché des services de proximité en Côte d'Ivoire" 
        description="Analyse du secteur, tarifs moyens et tendances 2026"
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
          <Badge className="bg-green-100 text-green-800 mb-4">
            <BarChart3 className="w-3 h-3 mr-1" />
            Analyse de marché
          </Badge>
          
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-yo-green-dark mb-4">
            Le marché des services de proximité en Côte d'Ivoire
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Secteurs porteurs, tarifs moyens et opportunités pour 2026
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              15 février 2026
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Par l'équipe Yo!Voiz
            </span>
          </div>
        </motion.div>

        {/* Stats Banner */}
        <Card className="p-6 mb-12 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-black text-orange-700 mb-1">15.000+</p>
              <p className="text-sm text-gray-700">Prestataires actifs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-green-700 mb-1">+38%</p>
              <p className="text-sm text-gray-700">Croissance annuelle</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-blue-700 mb-1">2,5M</p>
              <p className="text-sm text-gray-700">Transactions 2025</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-purple-700 mb-1">70%</p>
              <p className="text-sm text-gray-700">Paiement mobile</p>
            </div>
          </div>
        </Card>

        {/* Top Sectors */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6">
            Les secteurs qui recrutent le plus
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {topSectors.map((sector, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 bg-${sector.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <div className={`text-${sector.color}-600`}>
                      {sector.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{sector.name}</h3>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {sector.growth}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{sector.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Demande: <strong>{sector.demand}</strong></span>
                      <span className="text-orange-600 font-semibold">{sector.avgPrice}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Price Ranges */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6">
            Grille tarifaire moyenne à Abidjan
          </h2>
          <div className="space-y-4">
            {priceRanges.map((range, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{range.category}</h3>
                    <p className="text-sm text-gray-600">{range.examples}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Tarif moyen</p>
                      <p className="font-bold text-xl text-orange-600">{range.min} - {range.max} FCFA</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Durée</p>
                      <p className="font-semibold text-gray-700">{range.duration}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            💡 Ces tarifs sont indicatifs et varient selon l'expérience du prestataire, la complexité et l'urgence.
          </p>
        </div>

        {/* Trends 2026 */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6">
            Les grandes tendances 2026
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {trends2026.map((trend, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600">
                      {trend.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{trend.title}</h3>
                    <p className="text-sm text-gray-600">{trend.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6 text-center">
            Saisis les opportunités
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {opportunities.map((opp, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-xl transition-shadow">
                <Target className="w-12 h-12 text-yo-orange mx-auto mb-4" />
                <h3 className="font-bold text-xl text-gray-900 mb-2">{opp.title}</h3>
                <p className="text-gray-600 mb-6">{opp.desc}</p>
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={opp.action}
                >
                  {opp.cta}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-br from-green-600 to-green-700 text-white text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-white/90" />
          <h2 className="font-display font-bold text-3xl mb-4">
            Rejoins l'économie de proximité
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Lance ton activité de prestataire sur Yo!Voiz dès aujourd'hui
          </p>
          <Button 
            size="lg" 
            className="bg-white text-green-700 hover:bg-white/90"
            onClick={() => router.push(user ? '/services/nouvelle-offre' : '/auth/inscription')}
          >
            {user ? 'Proposer mes services' : 'Créer mon compte gratuit'}
          </Button>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
