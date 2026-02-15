'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, UserPlus, MessageCircle, CheckCircle, 
  Star, Shield, Clock, Zap, ArrowRight, ChevronRight,
  Users, Award, TrendingUp, Target, X
} from 'lucide-react';
import Link from 'next/link';

export default function CommentCaMarchePage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [showProModal, setShowProModal] = useState(false);

  const handlePublishClick = () => {
    if (!user) {
      // Rediriger vers connexion avec redirect vers missions/nouvelle
      router.push('/auth/connexion?redirect=/missions/nouvelle');
    } else {
      router.push('/missions/nouvelle');
    }
  };

  const handleInscriptionClick = () => {
    if (!user) {
      router.push('/auth/inscription');
    } else {
      router.push('/home');
    }
  };

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

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-yo-orange to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display font-black text-5xl md:text-6xl mb-6">
            Comment ça marche ?
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Trouve ton prestataire en 3 étapes simples
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-yo-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-yo-orange" />
              </div>
              <div className="w-12 h-12 bg-yo-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Publie ta demande</h3>
              <p className="text-gray-600 leading-relaxed">
                Décris ton besoin en quelques clics : type de service, localisation, 
                budget et délai. C'est gratuit et sans engagement !
              </p>
            </Card>

            {/* Step 2 */}
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-yo-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-yo-green" />
              </div>
              <div className="w-12 h-12 bg-yo-green text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Reçois des devis</h3>
              <p className="text-gray-600 leading-relaxed">
                Les prestataires de ta zone te contactent avec leurs propositions. 
                Compare les profils, avis et tarifs.
              </p>
            </Card>

            {/* Step 3 */}
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-blue-500" />
              </div>
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Choisis et valide</h3>
              <p className="text-gray-600 leading-relaxed">
                Sélectionne le prestataire qui te convient, négocie si besoin, 
                puis valide le service une fois terminé.
              </p>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mb-16">
            <Button 
              size="lg" 
              onClick={handlePublishClick}
              className="bg-yo-orange hover:bg-orange-600 text-white"
            >
              Publier ma première demande
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pour les prestataires */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            Tu es prestataire ?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left */}
            <Card className="p-8">
              <Zap className="w-12 h-12 text-yo-orange mb-4" />
              <h3 className="text-2xl font-bold mb-4">Inscription gratuite</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Crée ton profil professionnel, présente tes services et définis ta zone d'intervention. 
                Commence à recevoir des demandes dès maintenant.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                  <span>Reçois des demandes ciblées dans ta zone</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                  <span>Envoie des devis personnalisés</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                  <span>Gère tes clients et factures</span>
                </li>
              </ul>
            </Card>

            {/* Right */}
            <Card className="p-8 bg-gradient-to-br from-yo-orange to-orange-600 text-white">
              <Award className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Abonnement Pro</h3>
              <p className="mb-6 leading-relaxed opacity-90">
                Booste ta visibilité et accède à des outils professionnels pour gérer 
                ton activité efficacement.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Badge "Pro" sur ton profil</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Gestion devis & factures PDF</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Tableau de bord analytique</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Répertoire clients illimité</span>
                </li>
              </ul>
              <Button 
                size="lg" 
                onClick={() => setShowProModal(true)}
                variant="outline" 
                className="w-full border-2 border-white text-white hover:bg-white/10"
              >
                En savoir plus
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Sécurité et garanties */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            Ta sécurité, notre priorité
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <Shield className="w-12 h-12 text-yo-green mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Profils vérifiés</h3>
              <p className="text-gray-600">
                Tous les prestataires sont modérés avant validation
              </p>
            </Card>
            <Card className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-yo-orange mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Messagerie sécurisée</h3>
              <p className="text-gray-600">
                Échange sans partager ton numéro avant d'être sûr
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Système d'avis</h3>
              <p className="text-gray-600">
                Consulte les retours des autres utilisateurs
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Rapide */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            <FAQItem 
              question="Est-ce vraiment gratuit ?"
              answer="Oui ! Publier une demande et contacter des prestataires est 100% gratuit. Seuls les prestataires payent un abonnement optionnel pour accéder aux outils Pro."
            />
            <FAQItem 
              question="Comment fonctionne le paiement ?"
              answer="Le paiement se fait directement entre toi et le prestataire. Yo!Voiz sécurise la transaction et libère les fonds uniquement quand tu valides le service terminé."
            />
            <FAQItem 
              question="Que faire si je ne suis pas satisfait ?"
              answer="Tu peux négocier avec le prestataire ou contacter notre support. Si le service n'est pas conforme, tu peux refuser la validation et signaler le problème."
            />
            <FAQItem 
              question="Dans quelles zones êtes-vous disponibles ?"
              answer="Yo!Voiz couvre toutes les communes d'Abidjan : Cocody, Yopougon, Abobo, Adjamé, Plateau, Marcory, Koumassi, Port-Bouët, Attécoubé, Treichville et plus encore."
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-br from-yo-green to-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoins la communauté Yo!Voiz et trouve ton prestataire idéal aujourd'hui
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleInscriptionClick}
              className="bg-white text-yo-green hover:bg-gray-100"
            >
              S'inscrire gratuitement
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
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
                  <p className="text-lg opacity-90">Développe ton activité avec les outils professionnels</p>
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
                      <p className="text-sm text-gray-600">+70% de visibilité sur la plateforme</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Devis professionnels</p>
                      <p className="text-sm text-gray-600">Création et envoi en PDF automatique</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Gestion des factures</p>
                      <p className="text-sm text-gray-600">Facturation et suivi des paiements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Tableau de bord analytique</p>
                      <p className="text-sm text-gray-600">Statistiques et rapports d'activité</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Répertoire clients illimité</p>
                      <p className="text-sm text-gray-600">Gestion complète de votre portefeuille</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Catalogue de services</p>
                      <p className="text-sm text-gray-600">Créez et gérez vos offres</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Suivi des encaissements</p>
                      <p className="text-sm text-gray-600">Export PDF et Excel</p>
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

              {/* Avantages */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-yo-green" />
                  Pourquoi passer Pro ?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yo-orange flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Crédibilité renforcée :</strong> Le badge Pro rassure les clients et augmente vos chances d'être choisi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yo-orange flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Gain de temps :</strong> Automatisez vos devis et factures au lieu de tout faire manuellement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yo-orange flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Professionnalisation :</strong> Gérez votre activité comme une vraie entreprise</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yo-orange flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700"><strong>Visibilité accrue :</strong> Apparaissez en priorité dans les résultats de recherche</span>
                  </li>
                </ul>
              </div>

              {/* Témoignage */}
              <div className="bg-orange-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-yo-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                    K
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Kouassi Martin</p>
                    <p className="text-sm text-gray-600">Plombier Pro à Yopougon</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Depuis que je suis passé Pro, mes revenus ont triplé. Les clients me font plus confiance 
                  et les outils de gestion me font gagner 5h par semaine. Meilleur investissement de ma carrière !"
                </p>
                <div className="flex gap-1 text-yellow-500 mt-2">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
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

      {/* Footer */}
      <Footer />
    </main>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-bold flex-1">{question}</h3>
        <ChevronRight className={`w-5 h-5 text-yo-orange flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </div>
      {isOpen && (
        <p className="mt-4 text-gray-600 leading-relaxed">
          {answer}
        </p>
      )}
    </Card>
  );
}
