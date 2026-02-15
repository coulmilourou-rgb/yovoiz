'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, Heart, CheckCircle, Users, Star, 
  Lock, MessageCircle, AlertTriangle, Award, 
  ThumbsUp, Eye
} from 'lucide-react';

export default function CharteConfiancePage() {
  const { user, profile } = useAuth();

  const engagements = [
    {
      icon: Shield,
      title: 'Sécurité avant tout',
      description: 'Nous vérifions l\'identité de tous les prestataires et modérons les profils avant validation.',
      color: 'text-yo-orange'
    },
    {
      icon: Lock,
      title: 'Protection des données',
      description: 'Vos données personnelles sont chiffrées et ne sont jamais vendues à des tiers.',
      color: 'text-yo-green'
    },
    {
      icon: MessageCircle,
      title: 'Transparence totale',
      description: 'Communication claire sur les tarifs, frais et conditions d\'utilisation.',
      color: 'text-blue-500'
    },
    {
      icon: Award,
      title: 'Qualité garantie',
      description: 'Système d\'avis et évaluations pour maintenir un haut niveau de qualité.',
      color: 'text-yellow-500'
    },
    {
      icon: Users,
      title: 'Support réactif',
      description: 'Équipe disponible 7j/7 pour répondre à vos questions et résoudre les litiges.',
      color: 'text-purple-500'
    },
    {
      icon: ThumbsUp,
      title: 'Respect mutuel',
      description: 'Promotion d\'un environnement respectueux entre tous les utilisateurs.',
      color: 'text-pink-500'
    }
  ];

  const rules = [
    {
      category: 'Pour les Clients',
      items: [
        'Décrire clairement et honnêtement votre besoin',
        'Respecter les prestataires et leurs devis',
        'Payer le service convenu dans les délais',
        'Laisser un avis constructif après le service',
        'Ne pas solliciter de services hors plateforme pour la première prestation',
        'Signaler tout comportement inapproprié'
      ]
    },
    {
      category: 'Pour les Prestataires',
      items: [
        'Fournir des informations exactes sur vos qualifications',
        'Respecter les délais et tarifs convenus',
        'Communiquer de façon professionnelle',
        'Fournir un service de qualité conforme aux attentes',
        'Respecter les biens et la vie privée des clients',
        'Ne pas harceler les clients avec des messages non sollicités'
      ]
    }
  ];

  const interdictions = [
    'Usurpation d\'identité ou faux profil',
    'Harcèlement, menaces ou comportement agressif',
    'Discrimination basée sur l\'origine, le genre, la religion, etc.',
    'Fraude, arnaque ou tentative d\'escroquerie',
    'Contenu à caractère sexuel, violent ou illégal',
    'Spam ou sollicitation commerciale abusive',
    'Contournement des règles de paiement de la plateforme',
    'Publication de fausses informations ou avis'
  ];

  const sanctions = [
    {
      title: 'Avertissement',
      description: 'Pour une première infraction mineure'
    },
    {
      title: 'Suspension temporaire',
      description: 'Blocage du compte de 7 à 30 jours'
    },
    {
      title: 'Suspension définitive',
      description: 'Suppression permanente du compte en cas d\'infractions graves ou répétées'
    },
    {
      title: 'Poursuites légales',
      description: 'En cas de fraude, escroquerie ou activité illégale'
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

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-yo-orange mx-auto mb-6" />
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">
              Charte de Confiance
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Les valeurs et règles qui régissent notre communauté pour un environnement sain et sécurisé
            </p>
          </div>

          {/* Nos engagements */}
          <section className="mb-16">
            <h2 className="text-3xl font-black text-center mb-8">
              Nos engagements
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {engagements.map((engagement, index) => {
                const Icon = engagement.icon;
                return (
                  <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow">
                    <Icon className={`w-12 h-12 ${engagement.color} mx-auto mb-4`} />
                    <h3 className="text-xl font-bold mb-3">{engagement.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{engagement.description}</p>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Règles de conduite */}
          <section className="mb-16">
            <h2 className="text-3xl font-black text-center mb-8">
              Règles de conduite
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {rules.map((rule, index) => (
                <Card key={index} className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-yo-orange">
                    {rule.category}
                  </h3>
                  <ul className="space-y-3">
                    {rule.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          {/* Comportements interdits */}
          <section className="mb-16">
            <Card className="p-8 bg-red-50 border-l-4 border-red-500">
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-8 h-8" />
                Comportements strictement interdits
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {interdictions.map((interdiction, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✕</span>
                    <span className="text-gray-700">{interdiction}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Système de modération */}
          <section className="mb-16">
            <h2 className="text-3xl font-black text-center mb-8">
              Système de modération
            </h2>
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Eye className="w-6 h-6 text-yo-orange flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Vérification des profils</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Tous les profils prestataires sont vérifiés manuellement par notre équipe avant validation. 
                      Nous contrôlons l'identité, les qualifications et la cohérence des informations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-yo-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Surveillance continue</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Notre équipe surveille en permanence l'activité de la plateforme pour détecter et bloquer 
                      tout comportement suspect ou frauduleux.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Signalement utilisateur</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Chaque utilisateur peut signaler un profil ou comportement inapproprié. 
                      Les signalements sont traités sous 24h ouvrées.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Système d'avis</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Les avis clients permettent de maintenir un haut niveau de qualité. 
                      Les prestataires avec des avis trop négatifs peuvent être suspendus.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Sanctions */}
          <section className="mb-16">
            <h2 className="text-3xl font-black text-center mb-8">
              Sanctions en cas de non-respect
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {sanctions.map((sanction, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    {index + 1}
                  </div>
                  <h3 className="font-bold mb-2">{sanction.title}</h3>
                  <p className="text-sm text-gray-600">{sanction.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Résolution des litiges */}
          <section className="mb-16">
            <h2 className="text-3xl font-black text-center mb-8">
              Résolution des litiges
            </h2>
            <Card className="p-8">
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  En cas de litige entre un Client et un Prestataire, Yo!Voiz s'engage à :
                </p>
                <ol className="list-decimal list-inside space-y-3 pl-4">
                  <li>
                    <strong>Médiation gratuite :</strong> Notre équipe intervient pour faciliter le dialogue 
                    et trouver une solution amiable.
                  </li>
                  <li>
                    <strong>Analyse des faits :</strong> Nous examinons les éléments fournis par les deux parties 
                    (messages, photos, contrat).
                  </li>
                  <li>
                    <strong>Proposition de solution :</strong> Nous proposons une résolution équitable basée sur 
                    les faits et nos conditions générales.
                  </li>
                  <li>
                    <strong>Remboursement si nécessaire :</strong> En cas de service non conforme et sans résolution 
                    amiable, un remboursement partiel ou total peut être accordé.
                  </li>
                </ol>
                <p className="mt-6 font-semibold">
                  Pour signaler un problème : <a href="/aide" className="text-yo-orange hover:underline">Contactez le support</a>
                </p>
              </div>
            </Card>
          </section>

          {/* Engagement utilisateur */}
          <section className="mb-12">
            <Card className="p-8 bg-yo-orange text-white">
              <div className="text-center">
                <Heart className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-3xl font-black mb-4">
                  Ensemble, construisons une communauté de confiance
                </h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto">
                  En utilisant Yo!Voiz, vous acceptez de respecter cette charte et de contribuer 
                  à un environnement sain, respectueux et sécurisé pour tous.
                </p>
              </div>
            </Card>
          </section>

          {/* Footer Info */}
          <div className="p-6 bg-gray-100 rounded-xl text-center">
            <p className="text-sm text-gray-600">
              Cette charte de confiance est effective depuis le 1er février 2026.
              <br />
              Pour toute question : <a href="mailto:support@yovoiz.com" className="text-yo-orange font-semibold hover:underline">support@yovoiz.com</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
