'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Shield, Lock, CreditCard,
  CheckCircle, AlertTriangle, FileText, Phone,
  Users, Award, Eye, MessageCircle, DollarSign,
  Clock, ArrowRight, Smartphone
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

export default function SecuritePage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Paiement sécurisé SSL 256 bits",
      color: "green",
      description: "Toutes les transactions sont cryptées avec le même niveau de sécurité que les banques internationales. Tes données bancaires ne sont jamais stockées sur nos serveurs."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Séquestre de paiement",
      color: "blue",
      description: "Ton argent est bloqué sur la plateforme jusqu'à validation de la prestation. Le prestataire ne reçoit le paiement qu'après ton feu vert. Tu es 100% protégé."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Vérification des prestataires",
      color: "purple",
      description: "Les prestataires Pro sont vérifiés : pièce d'identité, justificatif de domicile, références. Les arnaqueurs n'ont aucune chance de passer."
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Messagerie sécurisée",
      color: "orange",
      description: "Toutes les discussions passent par notre plateforme. Conserve les preuves en cas de litige. Ne communique JAMAIS tes coordonnées bancaires par message."
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Tu publies ta demande",
      icon: <FileText className="w-6 h-6" />,
      description: "Décris ton besoin et propose un budget. Gratuit et sans engagement."
    },
    {
      step: 2,
      title: "Tu choisis un prestataire",
      icon: <Users className="w-6 h-6" />,
      description: "Compare les devis, notes et avis. Sélectionne le meilleur."
    },
    {
      step: 3,
      title: "Tu paies en ligne",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Mobile Money ou carte bancaire. Ton argent est bloqué sur la plateforme (séquestre)."
    },
    {
      step: 4,
      title: "La prestation est réalisée",
      icon: <CheckCircle className="w-6 h-6" />,
      description: "Le prestataire intervient comme convenu. Tu contrôles la qualité du travail."
    },
    {
      step: 5,
      title: "Tu valides et notes",
      icon: <Award className="w-6 h-6" />,
      description: "Si tout est OK, tu valides. L'argent est alors versé au prestataire. Tu peux laisser un avis."
    }
  ];

  const guarantees = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Garantie satisfait ou remboursé",
      description: "Si la prestation n'est pas conforme, ouvre un litige sous 48h. Notre équipe arbitre et peut décider d'un remboursement partiel ou total."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Protection contre les no-shows",
      description: "Si le prestataire ne se présente pas sans raison valable, tu es remboursé intégralement sous 48h. Le prestataire reçoit une pénalité."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Assurance dommages",
      description: "En cas de dégât matériel causé par un prestataire Pro pendant l'intervention, tu es couvert jusqu'à 500.000 FCFA (selon conditions)."
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Support client réactif",
      description: "Notre équipe est disponible 7j/7 par téléphone, email ou chat. Délai de réponse moyen : 2h. Nous sommes là pour t'aider."
    }
  ];

  const paymentMethods = [
    {
      name: "Orange Money",
      icon: "📱",
      fees: "0 FCFA",
      delay: "Instantané"
    },
    {
      name: "MTN Mobile Money",
      icon: "📱",
      fees: "0 FCFA",
      delay: "Instantané"
    },
    {
      name: "Moov Money",
      icon: "📱",
      fees: "0 FCFA",
      delay: "Instantané"
    },
    {
      name: "Carte bancaire",
      icon: "💳",
      fees: "2,5%",
      delay: "Instantané"
    }
  ];

  const tips = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      type: "À NE JAMAIS FAIRE",
      color: "red",
      items: [
        "Payer en dehors de la plateforme (cash, virement direct)",
        "Communiquer tes coordonnées bancaires par message",
        "Valider une prestation avant d'avoir vérifié le travail",
        "Donner accès à ton compte Yo!Voiz à un tiers"
      ]
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      type: "BONNES PRATIQUES",
      color: "green",
      items: [
        "Toujours passer par la plateforme pour les paiements",
        "Vérifier les avis et la note avant de choisir",
        "Prendre des photos avant/après en cas de travaux",
        "Conserver les échanges sur la messagerie Yo!Voiz"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <PageHead 
        title="Sécurité, paiement et garanties Yo!Voiz" 
        description="Comprendre comment Yo!Voiz protège tes transactions et tes données"
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
          <Badge className="bg-green-100 text-green-800 mb-4">
            <Shield className="w-3 h-3 mr-1" />
            Sécurité & Garanties
          </Badge>
          
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-yo-green-dark mb-4">
            Ta sécurité est notre priorité
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvre comment Yo!Voiz protège tes paiements, tes données et tes droits
          </p>
        </motion.div>

        {/* Trust Banner */}
        <Card className="p-6 mb-12 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-700" />
              <span className="font-bold text-green-900">Paiement sécurisé SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-green-700" />
              <span className="font-bold text-green-900">Données cryptées</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-700" />
              <span className="font-bold text-green-900">Garantie satisfait ou remboursé</span>
            </div>
          </div>
        </Card>

        {/* Security Features */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6">
            Nos dispositifs de sécurité
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-${feature.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <div className={`text-${feature.color}-600`}>
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6 text-center">
            Comment fonctionne le paiement sécurisé ?
          </h2>
          <div className="space-y-4">
            {howItWorks.map((step, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 flex items-center gap-2">
                      {step.icon}
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-gray-400 hidden md:block" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6">
            Tes garanties
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guarantees.map((guarantee, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600">
                      {guarantee.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{guarantee.title}</h3>
                    <p className="text-sm text-gray-600">{guarantee.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6">
            Moyens de paiement acceptés
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {paymentMethods.map((method, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-4xl mb-2">{method.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{method.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Frais: <strong className="text-gray-900">{method.fees}</strong></p>
                  <p>Délai: <strong className="text-gray-900">{method.delay}</strong></p>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            💡 Aucun frais de transaction pour les clients. Les prestataires paient une commission de 5% sur chaque mission.
          </p>
        </div>

        {/* Tips */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6">
            Conseils de sécurité
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <Card key={index} className={`p-6 border-2 border-${tip.color}-200`}>
                <div className="flex items-center gap-3 mb-4">
                  {tip.icon}
                  <h3 className="font-bold text-lg text-gray-900">{tip.type}</h3>
                </div>
                <ul className="space-y-2">
                  {tip.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`text-${tip.color}-600 font-bold`}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-white/90" />
          <h2 className="font-display font-bold text-3xl mb-4">
            Utilise Yo!Voiz en toute confiance
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Des milliers d'utilisateurs nous font confiance chaque jour
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-700 hover:bg-white/90"
              onClick={() => router.push(user ? '/missions/nouvelle' : '/auth/inscription')}
            >
              {user ? 'Publier une demande' : 'Créer mon compte gratuit'}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => router.push('/aide')}
            >
              Contacter le support
            </Button>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
