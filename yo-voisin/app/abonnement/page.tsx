'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Crown, Check, X, Zap, Shield, Star, 
  TrendingUp, MessageSquare, Eye, Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  popular?: boolean;
  features: {
    text: string;
    included: boolean;
  }[];
  color: string;
  icon: React.ReactNode;
}

export default function AbonnementPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Gratuit',
      price: 0,
      period: 'mois',
      description: 'Parfait pour commencer',
      color: 'gray',
      icon: <Star className="w-6 h-6" />,
      features: [
        { text: '3 demandes de services par mois', included: true },
        { text: 'Recherche locale de prestataires', included: true },
        { text: 'Messagerie basique', included: true },
        { text: 'Notifications par email', included: true },
        { text: 'Badge "Vérifié"', included: false },
        { text: 'Profil mis en avant', included: false },
        { text: 'Support prioritaire', included: false },
        { text: 'Statistiques avancées', included: false }
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingPeriod === 'monthly' ? 2000 : 20000,
      period: billingPeriod === 'monthly' ? 'mois' : 'an',
      description: 'Pour les utilisateurs réguliers',
      popular: true,
      color: 'orange',
      icon: <Crown className="w-6 h-6" />,
      features: [
        { text: 'Demandes illimitées', included: true },
        { text: 'Recherche avancée + filtres', included: true },
        { text: 'Messagerie illimitée', included: true },
        { text: 'Notifications push temps réel', included: true },
        { text: 'Badge "Premium" visible', included: true },
        { text: 'Profil mis en avant 2x', included: true },
        { text: 'Support prioritaire (24h)', included: true },
        { text: 'Statistiques avancées', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingPeriod === 'monthly' ? 5000 : 50000,
      period: billingPeriod === 'monthly' ? 'mois' : 'an',
      description: 'Pour les professionnels',
      color: 'green',
      icon: <Zap className="w-6 h-6" />,
      features: [
        { text: 'Tout Premium +', included: true },
        { text: 'Page entreprise personnalisée', included: true },
        { text: 'Portfolio photos/vidéos illimité', included: true },
        { text: 'Badge "Pro Certifié"', included: true },
        { text: 'Profil mis en avant 5x', included: true },
        { text: 'Support prioritaire (2h)', included: true },
        { text: 'Statistiques & analytics détaillés', included: true },
        { text: 'API accès développeur', included: true }
      ]
    }
  ];

  const getPlanColor = (color: string) => {
    const colors = {
      gray: {
        bg: 'bg-yo-gray-100',
        text: 'text-yo-gray-800',
        border: 'border-yo-gray-300',
        button: 'bg-yo-gray-700 hover:bg-yo-gray-800'
      },
      orange: {
        bg: 'bg-yo-orange/10',
        text: 'text-yo-orange',
        border: 'border-yo-orange',
        button: 'bg-yo-orange hover:bg-yo-orange-dark'
      },
      green: {
        bg: 'bg-yo-green/10',
        text: 'text-yo-green-dark',
        border: 'border-yo-green',
        button: 'bg-yo-green hover:bg-yo-green-dark'
      }
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const handleSubscribe = (planId: string) => {
    if (!user) {
      router.push('/auth/connexion?redirect=/abonnement');
      return;
    }

    if (planId === 'free') {
      alert('Vous utilisez déjà le plan gratuit !');
      return;
    }

    // TODO: Intégration paiement Wave/Cinetpay
    console.log('Souscription au plan:', planId, billingPeriod);
    alert(`🚧 Paiement en cours d'intégration\n\nPlan: ${planId}\nPériode: ${billingPeriod}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar isConnected={!!user} />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yo-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yo-gray-50 via-white to-yo-green/5">
      <Navbar 
        isConnected={!!user} 
        user={profile ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        } : undefined}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yo-orange/10 rounded-full mb-4">
              <Crown className="w-5 h-5 text-yo-orange" />
              <span className="text-sm font-semibold text-yo-orange">
                Passez au niveau supérieur
              </span>
            </div>
            <h1 className="font-display font-extrabold text-5xl text-yo-green-dark mb-4">
              Choisissez votre plan
            </h1>
            <p className="text-xl text-yo-gray-600 max-w-2xl mx-auto">
              Débloquez des fonctionnalités premium pour développer votre activité et trouver plus de clients
            </p>
          </motion.div>

          {/* Toggle période */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                billingPeriod === 'monthly'
                  ? 'bg-yo-green text-white'
                  : 'bg-yo-gray-100 text-yo-gray-600 hover:bg-yo-gray-200'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full font-semibold transition relative ${
                billingPeriod === 'yearly'
                  ? 'bg-yo-green text-white'
                  : 'bg-yo-gray-100 text-yo-gray-600 hover:bg-yo-gray-200'
              }`}
            >
              Annuel
              <Badge className="absolute -top-2 -right-2 bg-yo-orange text-white text-xs">
                -17%
              </Badge>
            </button>
          </div>
        </div>

        {/* Grille plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const colors = getPlanColor(plan.color);
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                <Card className={`p-8 h-full flex flex-col ${
                  plan.popular ? `border-2 ${colors.border} shadow-xl` : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-yo-orange text-white px-4 py-1">
                        🔥 Populaire
                      </Badge>
                    </div>
                  )}

                  {/* Header */}
                  <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mb-4`}>
                    <span className={colors.text}>{plan.icon}</span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-yo-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-yo-gray-600 mb-6">
                    {plan.description}
                  </p>

                  {/* Prix */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold text-yo-gray-900">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-xl text-yo-gray-600">FCFA</span>
                    </div>
                    <p className="text-sm text-yo-gray-500 mt-1">
                      par {plan.period}
                    </p>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full mb-6 ${colors.button} text-white`}
                  >
                    {plan.id === 'free' ? 'Plan actuel' : 'Choisir ce plan'}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-yo-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${
                          feature.included ? 'text-yo-gray-700' : 'text-yo-gray-400'
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Avantages */}
        <div className="mt-16">
          <h2 className="font-display font-bold text-3xl text-yo-gray-900 text-center mb-8">
            Pourquoi passer Premium ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Visibilité x5',
                description: 'Profil mis en avant dans les résultats de recherche'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Badge Vérifié',
                description: 'Gagnez la confiance des clients instantanément'
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: 'Support prioritaire',
                description: 'Réponse garantie en moins de 2h'
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: 'Analytics détaillés',
                description: 'Suivez vos performances et optimisez'
              }
            ].map((benefit, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-full bg-yo-green/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-yo-green">{benefit.icon}</span>
                </div>
                <h3 className="font-bold text-lg text-yo-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-yo-gray-600">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-yo-gray-900 text-center mb-8">
            Questions fréquentes
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Puis-je changer de plan à tout moment ?',
                a: 'Oui, vous pouvez upgrader ou downgrader votre abonnement à tout moment. Les modifications sont appliquées immédiatement.'
              },
              {
                q: 'Comment annuler mon abonnement ?',
                a: 'Rendez-vous dans Paramètres > Abonnement > Annuler. Vous conservez vos avantages jusqu\'à la fin de la période payée.'
              },
              {
                q: 'Quels moyens de paiement acceptez-vous ?',
                a: 'Orange Money, MTN Money, Moov Money, Wave et cartes bancaires (Visa/Mastercard).'
              },
              {
                q: 'Y a-t-il une période d\'essai gratuite ?',
                a: 'Oui ! 14 jours d\'essai gratuit pour les plans Premium et Pro, sans engagement.'
              }
            ].map((faq, idx) => (
              <Card key={idx} className="p-6">
                <h3 className="font-bold text-lg text-yo-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-yo-gray-600">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-16 text-center">
          <Card className="p-12 bg-gradient-to-r from-yo-green to-yo-green-dark text-white">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h2 className="font-display font-bold text-3xl mb-4">
              Prêt à développer votre activité ?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Rejoignez des centaines de professionnels qui font confiance à Yo!Voiz
            </p>
            <Button
              onClick={() => handleSubscribe('premium')}
              className="bg-white text-yo-green-dark hover:bg-yo-gray-100 px-8 py-3 text-lg font-bold"
            >
              Commencer maintenant
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
