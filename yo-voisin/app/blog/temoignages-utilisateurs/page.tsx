'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Star, Quote, Users,
  CheckCircle, TrendingUp, Heart, Award,
  Sparkles, MapPin, Briefcase, Home
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';

export default function TemoignagesPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const testimonials = [
    {
      type: "Prestataire",
      name: "Kouassi Adjoua",
      role: "Femme de ménage professionnelle",
      location: "Yopougon, Abidjan",
      avatar: "👩🏾",
      rating: 4.9,
      missions: 127,
      badge: "Pro",
      story: "Avant Yo!Voiz, je galérais à trouver des clients réguliers. Maintenant, je reçois 5 à 10 demandes par semaine ! J'ai pu acheter du matériel professionnel et embaucher une assistante. Mon rêve est de créer ma propre entreprise de nettoyage. Merci Yo!Voiz !",
      impact: [
        "Revenu mensuel multiplié par 3",
        "40 clients réguliers fidélisés",
        "Investissement dans du matériel pro",
        "1 employée recrutée"
      ],
      quote: "Yo!Voiz a changé ma vie. Je suis devenue mon propre patron."
    },
    {
      type: "Client",
      name: "Monsieur Traoré",
      role: "Chef d'entreprise",
      location: "Cocody, Abidjan",
      avatar: "👨🏾‍💼",
      rating: 5.0,
      missions: 23,
      badge: null,
      story: "Je suis entrepreneur très occupé. Yo!Voiz m'a simplifié la vie ! J'ai trouvé une gouvernante fiable en 2 heures, un plombier d'urgence un dimanche, et même un traiteur pour une réception client. Tout en quelques clics depuis mon téléphone.",
      impact: [
        "Plus de 20 prestations réussies",
        "Gain de temps considérable",
        "Prestataires fiables et professionnels",
        "Paiement sécurisé rassurant"
      ],
      quote: "Simple, rapide, efficace. Je recommande à tous mes amis."
    },
    {
      type: "Prestataire",
      name: "Yao Serge",
      role: "Plombier indépendant",
      location: "Abobo, Abidjan",
      avatar: "👨🏾‍🔧",
      rating: 4.8,
      missions: 89,
      badge: "Pro",
      story: "J'étais plombier salarié mal payé. Avec Yo!Voiz, je travaille en indépendant et je gagne 2 fois plus ! Les outils Pro (devis, factures, suivi clients) sont top. Je gère mon planning comme je veux et je choisis mes clients.",
      impact: [
        "Passage en indépendant réussi",
        "Revenu doublé en 6 mois",
        "Liberté dans l'organisation",
        "Base clients solide (50+ personnes)"
      ],
      quote: "Je ne retournerai jamais en salariat. Je suis libre et bien payé."
    },
    {
      type: "Cliente",
      name: "Madame Koné",
      role: "Mère de famille",
      location: "Marcory, Abidjan",
      avatar: "👩🏾",
      rating: 5.0,
      missions: 15,
      badge: null,
      story: "Avec 3 enfants et un travail à temps plein, je n'avais plus le temps de rien. Grâce à Yo!Voiz, j'ai une nounou qui garde mes enfants après l'école, une femme de ménage qui vient 2 fois par semaine, et je commande mes courses en livraison. Ma vie est transformée !",
      impact: [
        "Équilibre vie pro/vie perso retrouvé",
        "Prestataires de confiance",
        "Plus de temps pour la famille",
        "Budget maîtrisé"
      ],
      quote: "Yo!Voiz m'a redonné du temps pour profiter de mes enfants."
    },
    {
      type: "Prestataire",
      name: "Marie-Claire",
      role: "Traiteur événementiel",
      location: "Plateau, Abidjan",
      avatar: "👩🏾‍🍳",
      rating: 5.0,
      missions: 42,
      badge: "Pro",
      story: "Je suis passionnée de cuisine. Avant, je cuisinais juste pour la famille. Avec Yo!Voiz, j'ai lancé mon activité de traiteur ! Les outils Pro m'aident à gérer mes devis et factures comme une vraie entreprise. J'ai même créé mon logo et ma page pro.",
      impact: [
        "Passion devenue métier",
        "42 événements organisés",
        "Clients satisfaits (5/5 de moyenne)",
        "Projet d'ouvrir un restaurant"
      ],
      quote: "Yo!Voiz m'a permis de transformer ma passion en business."
    }
  ];

  const stats = [
    { number: "4.8/5", label: "Note moyenne", icon: Star },
    { number: "94%", label: "Clients satisfaits", icon: Heart },
    { number: "50.000+", label: "Avis publiés", icon: CheckCircle },
    { number: "89%", label: "Recommandent", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <PageHead 
        title="Témoignages clients et prestataires Yo!Voiz" 
        description="Découvrez les success stories de notre communauté"
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
          className="mb-12 text-center"
        >
          <Badge className="bg-purple-100 text-purple-800 mb-4">
            <Heart className="w-3 h-3 mr-1" />
            Témoignages
          </Badge>
          
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-yo-green-dark mb-4">
            Ils ont réussi avec Yo!Voiz
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvre les histoires inspirantes de prestataires et clients qui ont trouvé leur bonheur sur Yo!Voiz
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <stat.icon className="w-8 h-8 text-yo-orange mx-auto mb-2" />
              <p className="text-3xl font-black text-gray-900 mb-1">{stat.number}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="space-y-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 hover:shadow-xl transition-shadow">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-xl text-gray-900">{testimonial.name}</h3>
                      {testimonial.badge && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          {testimonial.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{testimonial.role}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {testimonial.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {testimonial.rating}/5
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {testimonial.missions} missions
                      </span>
                    </div>
                  </div>
                  <Badge className={testimonial.type === "Prestataire" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                    {testimonial.type}
                  </Badge>
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="w-12 h-12 text-orange-200 absolute -top-2 -left-2" />
                  <p className="text-gray-700 leading-relaxed pl-8 italic font-medium">
                    {testimonial.story}
                  </p>
                </div>

                {/* Highlight Quote */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 p-4 rounded mb-6">
                  <p className="text-gray-900 font-bold text-lg">
                    💬 "{testimonial.quote}"
                  </p>
                </div>

                {/* Impact */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Impact concret
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {testimonial.impact.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-br from-purple-600 to-purple-700 text-white text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-white/90" />
          <h2 className="font-display font-bold text-3xl mb-4">
            À ton tour de réussir !
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Rejoins les milliers d'utilisateurs satisfaits sur Yo!Voiz
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-700 hover:bg-white/90"
              onClick={() => router.push(user ? '/home' : '/auth/inscription')}
            >
              {user ? 'Publier une demande' : 'Créer mon compte gratuit'}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => router.push('/devenir-prestataire')}
            >
              Devenir prestataire
            </Button>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
