'use client';

import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CheckCircle, X, Award, Star, Zap, 
  ArrowRight, HelpCircle, Sparkles
} from 'lucide-react';
import { useState } from 'react';

export default function TarifsPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleStandardClick = () => {
    if (!user) {
      router.push('/auth/inscription');
    } else {
      router.push('/home');
    }
  };

  const handleProClick = () => {
    router.push('/abonnement');
  };

  const plans = [
    {
      name: 'Standard',
      price: 0,
      period: 'Gratuit',
      description: 'Parfait pour démarrer',
      features: [
        'Profil prestataire de base',
        'Réception des demandes dans ta zone',
        'Envoi de devis simples',
        'Messagerie intégrée',
        'Jusqu\'à 5 photos de profil',
        'Support par email'
      ],
      notIncluded: [
        'Badge Pro',
        'Priorité dans les résultats',
        'Devis & factures PDF',
        'Tableau de bord analytique',
        'Répertoire clients',
        'Support prioritaire'
      ],
      cta: 'Commencer gratuitement',
      ctaHref: '/auth/inscription',
      popular: false,
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? 15000 : 150000,
      period: billingCycle === 'monthly' ? '/mois' : '/an',
      description: 'Pour les professionnels ambitieux',
      features: [
        'Tout du plan Standard',
        '⭐ Badge "Pro" sur ton profil',
        '🚀 Priorité dans les résultats de recherche',
        '📄 Devis & factures PDF personnalisés',
        '📊 Tableau de bord analytique complet',
        '👥 Répertoire clients illimité',
        '📦 Catalogue d\'articles personnalisable',
        '📈 Statistiques détaillées',
        '💬 Support prioritaire 7j/7',
        '🎨 Personnalisation du profil avancée',
        '📸 Photos illimitées',
        '🏆 Badge de confiance'
      ],
      notIncluded: [],
      cta: 'Passer Pro maintenant',
      ctaHref: '/abonnement',
      popular: true,
      gradient: 'from-yo-orange to-orange-600',
      savings: billingCycle === 'yearly' ? '2 mois offerts !' : null
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
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-yo-orange to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Tarifs transparents et équitables</span>
          </div>
          <h1 className="font-display font-black text-5xl md:text-6xl mb-6">
            Nos tarifs
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Commence gratuitement, passe Pro quand tu es prêt
          </p>
        </div>
      </section>

      {/* Toggle Billing */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-yo-orange text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                billingCycle === 'yearly' 
                  ? 'bg-yo-orange text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Annuel
              <span className="absolute -top-2 -right-2 bg-yo-green text-white text-xs px-2 py-0.5 rounded-full font-bold">
                -17%
              </span>
            </button>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`p-8 relative ${
                  plan.popular ? 'ring-4 ring-yo-orange shadow-2xl' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yo-orange text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                    ⭐ LE PLUS POPULAIRE
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-yo-orange">
                      {plan.price === 0 ? 'Gratuit' : `${plan.price.toLocaleString()} FCFA`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">{plan.period}</span>
                    )}
                  </div>
                  {plan.savings && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-yo-green/10 text-yo-green px-3 py-1 rounded-full text-sm font-semibold">
                      <Zap className="w-4 h-4" />
                      {plan.savings}
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 opacity-40">
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  size="lg" 
                  onClick={plan.name === 'Standard' ? handleStandardClick : handleProClick}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-yo-orange hover:bg-orange-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            <FAQItem 
              question="Puis-je changer de plan à tout moment ?"
              answer="Oui, tu peux passer au plan Pro quand tu veux. L'abonnement sera activé immédiatement après paiement. Si tu souhaites annuler, tu peux le faire avant le prochain renouvellement."
            />
            <FAQItem 
              question="Quels sont les moyens de paiement acceptés ?"
              answer="Nous acceptons les paiements par Mobile Money (Orange Money, MTN Mobile Money, Moov Money), carte bancaire, et virement bancaire pour les abonnements annuels."
            />
            <FAQItem 
              question="Y a-t-il des frais cachés ?"
              answer="Non, aucun frais caché. L'abonnement Pro est à 15,000 FCFA/mois (ou 150,000 FCFA/an avec 2 mois offerts). La plateforme prend une commission de 5% sur chaque transaction réalisée pour couvrir les frais de paiement sécurisé."
            />
            <FAQItem 
              question="Que se passe-t-il si je n'ai pas de demandes ?"
              answer="Si tu es au plan gratuit, cela ne te coûte rien. Si tu es Pro et que tu constates peu de demandes dans ta zone, contacte notre support : nous t'aiderons à optimiser ton profil gratuitement."
            />
            <FAQItem 
              question="Puis-je essayer le plan Pro gratuitement ?"
              answer="Nous offrons régulièrement des périodes d'essai de 7 jours aux nouveaux prestataires. Inscris-toi et contacte le support pour vérifier ton éligibilité !"
            />
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            Comparaison détaillée
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-bold">Fonctionnalités</th>
                  <th className="text-center p-4 font-bold">Standard</th>
                  <th className="text-center p-4 font-bold bg-yo-orange/5">Pro</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow feature="Profil prestataire" standard="Basique" pro="Avancé" />
                <ComparisonRow feature="Badge Pro" standard={false} pro={true} />
                <ComparisonRow feature="Priorité recherche" standard={false} pro={true} />
                <ComparisonRow feature="Photos" standard="5 max" pro="Illimitées" />
                <ComparisonRow feature="Devis & Factures PDF" standard={false} pro={true} />
                <ComparisonRow feature="Tableau de bord" standard={false} pro={true} />
                <ComparisonRow feature="Répertoire clients" standard={false} pro="Illimité" />
                <ComparisonRow feature="Catalogue d'articles" standard={false} pro={true} />
                <ComparisonRow feature="Support" standard="Email" pro="Prioritaire 7j/7" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-br from-yo-green to-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Prêt à booster ton activité ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoins les 500+ prestataires qui font confiance à Yo!Voiz
          </p>
          <Button 
            size="lg" 
            onClick={handleStandardClick}
            className="bg-white text-yo-green hover:bg-gray-100"
          >
            Commencer maintenant
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="mt-6 text-sm opacity-80">
            ✓ Inscription gratuite • ✓ Sans engagement • ✓ Activation immédiate
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <HelpCircle className="w-5 h-5 text-yo-orange flex-shrink-0 mt-0.5" />
          <h3 className="font-bold">{question}</h3>
        </div>
        <ArrowRight className={`w-5 h-5 text-yo-orange flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </div>
      {isOpen && (
        <p className="mt-4 text-gray-600 leading-relaxed ml-8">
          {answer}
        </p>
      )}
    </Card>
  );
}

function ComparisonRow({ 
  feature, 
  standard, 
  pro 
}: { 
  feature: string; 
  standard: boolean | string; 
  pro: boolean | string; 
}) {
  return (
    <tr className="border-b">
      <td className="p-4 text-gray-700">{feature}</td>
      <td className="p-4 text-center">
        {typeof standard === 'boolean' ? (
          standard ? (
            <CheckCircle className="w-5 h-5 text-yo-green inline" />
          ) : (
            <X className="w-5 h-5 text-gray-300 inline" />
          )
        ) : (
          <span className="text-gray-600">{standard}</span>
        )}
      </td>
      <td className="p-4 text-center bg-yo-orange/5">
        {typeof pro === 'boolean' ? (
          pro ? (
            <CheckCircle className="w-5 h-5 text-yo-green inline" />
          ) : (
            <X className="w-5 h-5 text-gray-300 inline" />
          )
        ) : (
          <span className="text-gray-700 font-semibold">{pro}</span>
        )}
      </td>
    </tr>
  );
}
