'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, User, CheckCircle, Star,
  TrendingUp, Clock, MessageCircle, Award, Zap,
  Target, Shield, DollarSign, Users
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

export default function ConseilsPrestatairePage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const sections = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "1. Définissez votre niche",
      color: "orange",
      content: [
        "Identifiez vos compétences uniques et spécialisez-vous",
        "Concentrez-vous sur 2-3 catégories maximum pour commencer",
        "Devenez expert dans votre domaine plutôt que généraliste",
        "Analysez la demande dans votre quartier avant de vous lancer"
      ]
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "2. Créez un profil professionnel",
      color: "green",
      content: [
        "Photo de profil professionnelle et souriante",
        "Description claire et concise de vos services",
        "Mettez en avant vos années d'expérience",
        "Ajoutez des certifications ou diplômes si vous en avez"
      ]
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "3. Fixez des prix justes",
      color: "orange",
      content: [
        "Étudiez les tarifs pratiqués dans votre zone",
        "Ne sous-estimez pas la valeur de votre travail",
        "Proposez des forfaits pour fidéliser les clients",
        "Soyez transparent sur vos tarifs dès le départ"
      ]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "4. Soyez réactif",
      color: "green",
      content: [
        "Répondez aux demandes en moins de 2 heures",
        "Activez les notifications push sur votre téléphone",
        "Soyez disponible aux heures de pointe (18h-21h)",
        "Un client qui attend trop longtemps ira voir ailleurs"
      ]
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "5. Communiquez professionnellement",
      color: "orange",
      content: [
        "Soignez votre orthographe et votre grammaire",
        "Restez poli et courtois en toute circonstance",
        "Posez des questions pour bien comprendre le besoin",
        "Confirmez toujours les détails avant d'intervenir"
      ]
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "6. Livrez un travail de qualité",
      color: "green",
      content: [
        "Respectez les délais convenus",
        "Soyez ponctuel à vos rendez-vous",
        "Nettoyez après votre passage (ménage, bricolage...)",
        "Allez au-delà des attentes quand c'est possible"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "7. Collectez des avis positifs",
      color: "orange",
      content: [
        "Demandez gentiment un avis après chaque prestation",
        "Les premiers avis 5⭐ sont cruciaux pour votre réputation",
        "Répondez à tous les avis, même négatifs, avec professionnalisme",
        "10 avis positifs = +300% de chances d'être contacté"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "8. Optimisez votre visibilité",
      color: "green",
      content: [
        "Complétez 100% de votre profil (zones, horaires, services)",
        "Mettez à jour régulièrement vos disponibilités",
        "Publiez des offres de service attractives",
        "Activez le mode 'Disponible maintenant' aux heures creuses"
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "9. Sécurisez vos transactions",
      color: "orange",
      content: [
        "Utilisez toujours le système de paiement Yo!Voiz",
        "Ne donnez jamais votre numéro de compte bancaire",
        "Attendez la validation du client avant de partir",
        "En cas de litige, contactez immédiatement le support"
      ]
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "10. Évoluez vers Pro",
      color: "green",
      content: [
        "Après 10 missions réussies, passez au statut Pro",
        "Accédez aux outils de gestion (devis, factures, clients)",
        "Bénéficiez d'un badge 'Prestataire Vérifié'",
        "Augmentez votre visibilité de +70% sur la plateforme"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Aminata K.",
      service: "Ménage à Cocody",
      avatar: "A",
      rating: 5,
      text: "Grâce à Yo!Voiz, je gagne maintenant 250.000 FCFA/mois. Mes conseils : soyez ponctuelle et souriante !",
      stats: "47 missions • 4.9/5"
    },
    {
      name: "Kouassi M.",
      service: "Plomberie à Yopougon",
      avatar: "K",
      rating: 5,
      text: "J'ai triplé mes revenus en 6 mois. Le secret : répondre vite et faire du travail propre.",
      stats: "89 missions • 5.0/5"
    },
    {
      name: "Fatou D.",
      service: "Cours particuliers à Marcory",
      avatar: "F",
      rating: 5,
      text: "Le statut Pro m'a permis de professionnaliser mon activité. Aujourd'hui j'ai 15 élèves réguliers.",
      stats: "124 missions • 4.8/5"
    }
  ];

  const quickTips = [
    { icon: Clock, text: "Répondez en moins de 2h", color: "text-orange-600" },
    { icon: Star, text: "Visez 5⭐ sur chaque mission", color: "text-yellow-600" },
    { icon: Users, text: "Fidélisez vos meilleurs clients", color: "text-green-600" },
    { icon: TrendingUp, text: "Augmentez vos tarifs progressivement", color: "text-blue-600" }
  ];

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <PageHead 
        title="10 Conseils pour Réussir comme Prestataire" 
        description="Guide complet pour maximiser vos revenus sur Yo!Voiz"
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
        {/* Back Button */}
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
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-orange-100 text-orange-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              Guide Prestataire
            </Badge>
            <span className="text-sm text-gray-500">
              <Calendar className="w-4 h-4 inline mr-1" />
              Publié le 14 février 2026
            </span>
          </div>
          
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-yo-green-dark mb-4">
            10 Conseils pour Réussir comme Prestataire sur Yo!Voiz
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Transformez votre activité en business rentable avec ces stratégies éprouvées par nos meilleurs prestataires
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Par l'équipe Yo!Voiz
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Lecture : 8 min
            </span>
          </div>
        </motion.div>

        {/* Quick Tips Banner */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <h3 className="font-bold text-lg text-orange-900 mb-4">⚡ À retenir absolument</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/80 rounded-lg p-3">
                <tip.icon className={`w-6 h-6 ${tip.color}`} />
                <span className="text-gray-800 font-medium">{tip.text}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 bg-${section.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <div className={`text-${section.color}-600`}>
                      {section.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">
                      {section.title}
                    </h2>
                    <ul className="space-y-2">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6 text-center">
            Ils ont réussi avec ces conseils
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-orange-600">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.service}</p>
                  </div>
                </div>
                <div className="flex gap-1 text-yellow-500 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-3 italic">"{testimonial.text}"</p>
                <p className="text-xs text-gray-500">{testimonial.stats}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-br from-green-600 to-green-700 text-white text-center">
          <h2 className="font-display font-bold text-3xl mb-4">
            Prêt à devenir prestataire professionnel ?
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Rejoignez les 500+ prestataires qui gagnent leur vie sur Yo!Voiz
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-700 hover:bg-white/90"
              onClick={() => router.push('/devenir-prestataire')}
            >
              Devenir prestataire
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => router.push('/abonnement')}
            >
              Découvrir l'abonnement Pro
            </Button>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
