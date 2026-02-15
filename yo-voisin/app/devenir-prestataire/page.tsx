'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Zap, Award, TrendingUp, Users, CheckCircle, 
  Star, Target, BarChart3, FileText, MessageCircle,
  Clock, Shield, Wallet, ArrowRight, Sparkles, X
} from 'lucide-react';

export default function DevenirPrestatairePage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [showProModal, setShowProModal] = useState(false);

  const handleSignupClick = () => {
    if (!user) {
      router.push('/auth/inscription');
    } else {
      router.push('/home');
    }
  };

  const handleProClick = () => {
    setShowProModal(true);
  };

  const avantages = [
    {
      icon: Target,
      title: 'Demandes ciblées',
      description: 'Reçois uniquement les demandes dans ta zone et tes domaines de compétence',
      color: 'text-yo-orange'
    },
    {
      icon: Clock,
      title: 'Gagne du temps',
      description: 'Plus besoin de prospecter : les clients viennent directement à toi',
      color: 'text-yo-green'
    },
    {
      icon: TrendingUp,
      title: 'Développe ton activité',
      description: 'Augmente ton chiffre d\'affaires en accédant à de nouveaux clients',
      color: 'text-blue-500'
    },
    {
      icon: Star,
      title: 'Construis ta réputation',
      description: 'Collecte des avis positifs et deviens le prestataire de référence',
      color: 'text-yellow-500'
    },
    {
      icon: FileText,
      title: 'Gestion simplifiée',
      description: 'Devis, factures et suivi clients : tout au même endroit',
      color: 'text-purple-500'
    },
    {
      icon: Shield,
      title: 'Paiements sécurisés',
      description: 'Reçois tes paiements de façon sécurisée via la plateforme',
      color: 'text-green-600'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Inscris-toi gratuitement',
      description: 'Crée ton compte en 2 minutes avec tes informations de base',
      duration: '2 min'
    },
    {
      number: 2,
      title: 'Complète ton profil',
      description: 'Ajoute tes services, zone d\'intervention, tarifs et photos',
      duration: '10 min'
    },
    {
      number: 3,
      title: 'Validation modération',
      description: 'Notre équipe vérifie ton profil sous 24-48h',
      duration: '24-48h'
    },
    {
      number: 4,
      title: 'Commence à recevoir',
      description: 'Reçois tes premières demandes et envoie tes devis',
      duration: 'Immédiat'
    }
  ];

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
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-yo-orange via-orange-600 to-yo-green text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Rejoins 500+ prestataires actifs</span>
            </div>
            <h1 className="font-display font-black text-5xl md:text-6xl mb-6">
              Deviens prestataire sur Yo!Voiz
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              Développe ton activité grâce à une plateforme qui met en relation 
              les prestataires et les clients de proximité
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleSignupClick}
                className="bg-white text-yo-orange hover:bg-gray-100"
              >
                Créer mon profil gratuit
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                onClick={handleProClick}
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10"
              >
                Découvrir l'abonnement Pro
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-4xl font-black mb-2">500+</div>
              <div className="text-sm opacity-90">Prestataires actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">2,000+</div>
              <div className="text-sm opacity-90">Demandes / mois</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">4.8/5</div>
              <div className="text-sm opacity-90">Satisfaction client</div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">
            Pourquoi devenir prestataire ?
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Rejoins une plateforme pensée pour simplifier et booster ton activité
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {avantages.map((avantage, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
                <avantage.icon className={`w-12 h-12 ${avantage.color} mb-4`} />
                <h3 className="text-xl font-bold mb-3">{avantage.title}</h3>
                <p className="text-gray-600 leading-relaxed">{avantage.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            Comment démarrer ?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-yo-orange text-white rounded-full flex items-center justify-center mb-4 font-bold text-xl">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                  <div className="inline-flex items-center gap-2 text-xs bg-yo-green/10 text-yo-green px-3 py-1 rounded-full font-semibold">
                    <Clock className="w-3 h-3" />
                    {step.duration}
                  </div>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/3 -right-3 w-6 h-6">
                    <ArrowRight className="w-6 h-6 text-yo-orange" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abonnement Pro */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yo-orange/10 text-yo-orange px-4 py-2 rounded-full mb-4 font-semibold">
              <Award className="w-4 h-4" />
              Abonnement Pro
            </div>
            <h2 className="text-4xl font-black mb-4">
              Passe au niveau supérieur
            </h2>
            <p className="text-xl text-gray-600">
              Démarque-toi avec des outils professionnels
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Gratuit */}
            <Card className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Compte Standard</h3>
                <div className="text-4xl font-black text-yo-green mb-4">
                  Gratuit
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                  <span>Profil prestataire de base</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                  <span>Réception des demandes dans ta zone</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                  <span>Envoi de devis simples</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                  <span>Messagerie intégrée</span>
                </li>
              </ul>
              <Button 
                size="lg" 
                onClick={handleSignupClick}
                variant="outline" 
                className="w-full"
              >
                Commencer gratuitement
              </Button>
            </Card>

            {/* Pro */}
            <Card className="p-8 bg-gradient-to-br from-yo-orange to-orange-600 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white text-yo-orange px-3 py-1 rounded-full text-xs font-bold">
                POPULAIRE
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Abonnement Pro</h3>
                <div className="text-4xl font-black mb-2">
                  15,000 FCFA
                </div>
                <div className="text-sm opacity-90">par mois</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><strong>Badge "Pro"</strong> sur ton profil</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><strong>Priorité</strong> dans les résultats de recherche</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><strong>Devis & factures PDF</strong> personnalisés</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><strong>Tableau de bord</strong> analytique complet</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><strong>Répertoire clients</strong> illimité</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><strong>Catalogue d'articles</strong> personnalisable</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><strong>Support prioritaire</strong> 7j/7</span>
                </li>
              </ul>
              <Button 
                size="lg" 
                onClick={handleProClick}
                className="w-full bg-white text-yo-orange hover:bg-gray-100"
              >
                Découvrir l'offre Pro
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            Ils ont boosté leur activité avec Yo!Voiz
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "En 3 mois, j'ai doublé mon chiffre d'affaires. Les demandes arrivent tous les jours !"
              </p>
              <div className="font-semibold">Konan Jean - Plombier</div>
              <div className="text-sm text-gray-500">Cocody</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "L'abonnement Pro vaut vraiment le coup. Les outils de gestion me font gagner un temps fou."
              </p>
              <div className="font-semibold">Aïcha Traoré - Ménage</div>
              <div className="text-sm text-gray-500">Yopougon</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Plateforme sérieuse, clients de qualité. Je recommande à tous les prestataires !"
              </p>
              <div className="font-semibold">David Koffi - Électricien</div>
              <div className="text-sm text-gray-500">Marcory</div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-br from-yo-green to-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Prêt à développer ton activité ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoins Yo!Voiz et commence à recevoir tes premières demandes dès maintenant
          </p>
          <Button 
            size="lg" 
            onClick={handleSignupClick}
            className="bg-white text-yo-green hover:bg-gray-100"
          >
            Créer mon profil prestataire
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="mt-6 text-sm opacity-80">
            ✓ Inscription en 2 minutes • ✓ Sans engagement • ✓ Support dédié
          </p>
        </div>
      </section>

      {/* Modal Abonnement Pro */}
      {showProModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowProModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-yo-orange to-orange-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-black mb-2">Abonnement Pro</h2>
                  <p className="text-lg opacity-90">Propulse ton activité avec des outils professionnels</p>
                </div>
                <button
                  onClick={() => setShowProModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-center bg-white/20 rounded-lg p-4">
                <p className="text-4xl font-black mb-1">15.000 FCFA</p>
                <p className="text-lg opacity-90">par mois</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Fonctionnalités principales */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yo-orange" />
                  Fonctionnalités incluses
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Badge "Pro" vérifié</p>
                      <p className="text-sm text-gray-600">Apparais en priorité dans les recherches (+70% de visibilité)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Devis professionnels PDF</p>
                      <p className="text-sm text-gray-600">Création automatique avec ton logo et tes infos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Facturation intégrée</p>
                      <p className="text-sm text-gray-600">Génère et envoie des factures en un clic</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Tableau de bord analytique</p>
                      <p className="text-sm text-gray-600">Suivi de ton CA, demandes et performances</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Répertoire clients</p>
                      <p className="text-sm text-gray-600">Gestion illimitée avec historique complet</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Catalogue de services</p>
                      <p className="text-sm text-gray-600">Créez vos offres personnalisées</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Export Excel/PDF</p>
                      <p className="text-sm text-gray-600">Télécharge tes données comptables</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Support prioritaire</p>
                      <p className="text-sm text-gray-600">Assistance dédiée 7j/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pourquoi passer Pro */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-yo-green" />
                  Pourquoi les prestataires passent Pro ?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yo-orange flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>+300% de contacts clients :</strong> Le badge Pro inspire confiance et te démarque de la concurrence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yo-orange flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Gain de temps énorme :</strong> Plus besoin de faire tes devis/factures à la main, tout est automatisé</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yo-orange flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Image professionnelle :</strong> Des documents PDF à ton nom font sérieux auprès des clients</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yo-orange flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Suivi comptable facilité :</strong> Exports compatibles pour ta déclaration d'impôts</span>
                  </li>
                </ul>
              </div>

              {/* ROI */}
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-yo-orange" />
                  L'abonnement se rentabilise rapidement
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>15.000 FCFA/mois</strong> = seulement <strong>500 FCFA/jour</strong>
                  </p>
                  <p>
                    En moyenne, les prestataires Pro reçoivent <strong>3 demandes supplémentaires par semaine</strong> grâce à leur badge.
                  </p>
                  <p className="text-lg font-bold text-yo-orange">
                    → Il suffit de 1 seule mission en plus par mois pour être rentable ! 🎯
                  </p>
                </div>
              </div>

              {/* Témoignage */}
              <div className="border-l-4 border-yo-orange bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-yo-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Mariam Koné</p>
                    <p className="text-sm text-gray-600">Coiffeuse à domicile - Yopougon</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-3">
                  "Avant j'avais 2-3 clients par semaine. Depuis que je suis Pro, j'en ai 10-15 ! 
                  Les outils de gestion me font gagner 2h par jour. Je ne peux plus m'en passer."
                </p>
                <div className="flex gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Garantie */}
              <div className="bg-gradient-to-br from-yo-green-50 to-green-100 rounded-lg p-6 text-center">
                <Shield className="w-12 h-12 text-yo-green mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Garantie satisfait ou remboursé
                </h3>
                <p className="text-gray-700">
                  Teste l'abonnement Pro pendant 14 jours. Si tu n'es pas convaincu, 
                  on te rembourse intégralement, sans poser de questions.
                </p>
              </div>

              {/* CTA */}
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto px-12"
                  onClick={() => setShowProModal(false)}
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
