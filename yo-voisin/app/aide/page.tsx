'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Send,
  CheckCircle,
  Clock,
  Shield,
  CreditCard,
  Users,
  AlertCircle,
  ExternalLink,
  Book,
  Video,
  Headphones,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

type Category = 'compte' | 'demandes' | 'offres' | 'paiements' | 'securite' | 'abonnement' | 'autre';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: Category;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'Comment créer mon compte sur Yo!Voiz ?',
    answer: 'Pour créer un compte, cliquez sur "S\'inscrire" en haut à droite. Remplissez le formulaire avec vos informations personnelles (nom, prénom, email, téléphone, commune). Vous recevrez un email de confirmation. Aucune distinction entre demandeur et prestataire n\'est nécessaire - vous pouvez faire les deux !',
    category: 'compte'
  },
  {
    id: '2',
    question: 'Comment publier une demande de service ?',
    answer: 'Connectez-vous, cliquez sur le bouton "Demande" dans la barre de navigation ou sur "+ Nouvelle demande" dans votre dashboard. Suivez les étapes : choisissez la catégorie, décrivez votre besoin, indiquez la localisation, définissez votre budget et validez. Votre demande sera vérifiée avant publication.',
    category: 'demandes'
  },
  {
    id: '3',
    question: 'Comment proposer mes services ?',
    answer: 'Allez dans "Mes Services" → "Nouvelle offre". Renseignez vos compétences, vos tarifs, vos zones d\'intervention et vos disponibilités. Ajoutez des photos et une description détaillée. Après validation par notre équipe, votre offre sera visible par les demandeurs de votre zone.',
    category: 'offres'
  },
  {
    id: '4',
    question: 'Comment fonctionne le système de négociation ?',
    answer: 'Lorsqu\'un prestataire répond à votre demande avec un devis, vous pouvez l\'accepter ou faire une contre-proposition. Le prestataire peut à son tour accepter ou proposer un nouveau prix. Les échanges continuent jusqu\'à accord mutuel. Une fois d\'accord, vous validez et procédez au paiement.',
    category: 'demandes'
  },
  {
    id: '5',
    question: 'Comment sont sécurisés mes paiements ?',
    answer: 'Tous les paiements passent par notre système sécurisé. L\'argent est bloqué en séquestre (escrow) jusqu\'à la validation du service. Le prestataire ne reçoit le paiement qu\'après votre confirmation que le travail est terminé. Vous êtes protégé contre les arnaques.',
    category: 'paiements'
  },
  {
    id: '6',
    question: 'Quels modes de paiement acceptez-vous ?',
    answer: 'Nous acceptons Orange Money, MTN Mobile Money, Moov Money et Wave. Tous les paiements sont sécurisés et instantanés. Les fonds sont bloqués en garantie jusqu\'à la fin de la prestation.',
    category: 'paiements'
  },
  {
    id: '7',
    question: 'Que faire si un prestataire ne respecte pas ses engagements ?',
    answer: 'Vous pouvez ouvrir un litige depuis votre espace "Missions en cours". Notre équipe de médiation interviendra pour résoudre le conflit. Si le service n\'est pas rendu, vous serez remboursé intégralement. Vous pouvez aussi laisser un avis négatif.',
    category: 'securite'
  },
  {
    id: '8',
    question: 'Comment devenir prestataire professionnel ?',
    answer: 'Souscrivez à l\'abonnement Pro depuis "Abonnement Pro" dans le menu utilisateur. Vous bénéficierez d\'outils professionnels : devis, factures, encaissements, répertoire clients, catalogue de services, et une commission réduite (3% au lieu de 5%).',
    category: 'abonnement'
  },
  {
    id: '9',
    question: 'Comment modifier ou annuler ma demande ?',
    answer: 'Allez dans "Mes Demandes", trouvez la demande concernée et cliquez sur les trois points. Vous pouvez la modifier, la mettre en pause ou la supprimer. Si des devis ont déjà été reçus, prévenez les prestataires avant d\'annuler.',
    category: 'demandes'
  },
  {
    id: '10',
    question: 'Puis-je être à la fois demandeur et prestataire ?',
    answer: 'Oui, absolument ! Yo!Voiz permet à tous les utilisateurs de demander ET d\'offrir des services. Un seul compte suffit pour tout faire. Vous pouvez publier une demande le matin et proposer vos services l\'après-midi.',
    category: 'compte'
  },
  {
    id: '11',
    question: 'Comment fonctionne la vérification d\'identité ?',
    answer: 'Pour renforcer la confiance, nous vérifions l\'identité des prestataires. Vous devrez fournir une pièce d\'identité (CNI, passeport, permis) et un selfie. La vérification prend 24-48h. Un badge "Vérifié" apparaîtra sur votre profil.',
    category: 'securite'
  },
  {
    id: '12',
    question: 'Quelle est la commission de Yo!Voiz ?',
    answer: 'Pour les utilisateurs standards, la commission est de 5% sur chaque transaction. Pour les abonnés Pro, elle est réduite à 3%. Cette commission couvre la sécurisation des paiements, la médiation en cas de litige et le fonctionnement de la plateforme.',
    category: 'paiements'
  }
];

const categories = [
  { id: 'compte', label: 'Mon compte', icon: Users, color: 'bg-blue-500' },
  { id: 'demandes', label: 'Demandes de service', icon: FileText, color: 'bg-orange-500' },
  { id: 'offres', label: 'Offres de service', icon: Headphones, color: 'bg-green-500' },
  { id: 'paiements', label: 'Paiements', icon: CreditCard, color: 'bg-purple-500' },
  { id: 'securite', label: 'Sécurité', icon: Shield, color: 'bg-red-500' },
  { id: 'abonnement', label: 'Abonnement Pro', icon: AlertCircle, color: 'bg-yellow-500' },
];

export default function AidePage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filtrer les FAQs
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi
    console.log('Formulaire soumis:', contactForm);
    setFormSubmitted(true);
    setContactForm({ subject: '', message: '', priority: 'normal' });
    setTimeout(() => {
      setFormSubmitted(false);
      setShowContactForm(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Navbar
        isConnected={!!profile}
        user={profile ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        } : undefined}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              💡 Centre d'aide
            </h1>
            <p className="text-xl text-gray-600">
              Comment pouvons-nous vous aider aujourd'hui ?
            </p>
          </div>
        </div>

        {/* Barre de recherche */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher dans l'aide... (ex: comment publier une demande)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-4 py-4 text-lg"
            />
          </div>
        </Card>

        {/* Actions rapides */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-white"
                onClick={() => setShowContactForm(true)}>
            <MessageCircle className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Contacter le support</h3>
            <p className="text-gray-600 mb-4">Besoin d'aide personnalisée ? Notre équipe vous répond sous 24h</p>
            <Button variant="outline" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Envoyer un message
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-white">
            <Phone className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Assistance téléphonique</h3>
            <p className="text-gray-600 mb-4">Lun-Ven : 8h-18h<br />Sam : 9h-13h</p>
            <a href="tel:+2250759876543">
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                +225 07 59 87 65 43
              </Button>
            </a>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-white">
            <Mail className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 mb-4">Réponse sous 24-48h ouvrées</p>
            <a href="mailto:support@yovoiz.com">
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                support@yovoiz.com
              </Button>
            </a>
          </Card>
        </div>

        {/* Catégories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Parcourir par catégorie</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className={selectedCategory === 'all' ? 'bg-gray-900 text-white' : ''}
            >
              Toutes les catégories
            </Button>
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as Category)}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  className={selectedCategory === cat.id ? `${cat.color} text-white border-0` : ''}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Questions fréquentes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ❓ Questions fréquentes
          </h2>
          {filteredFAQs.length === 0 ? (
            <Card className="p-12 text-center">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-600">
                Essayez avec d'autres mots-clés ou contactez notre support
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq, idx) => {
                const isExpanded = expandedFAQ === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setExpandedFAQ(isExpanded ? null : faq.id)}
                    >
                      <div className="p-5 flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-green-500 flex items-center justify-center flex-shrink-0">
                            <HelpCircle className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">
                              {faq.question}
                            </h3>
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <p className="text-gray-700 mt-3 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className="w-6 h-6 text-gray-400" />
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ressources supplémentaires */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-xl transition-shadow">
            <Book className="w-10 h-10 text-orange-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Guide d'utilisation</h3>
            <p className="text-gray-600 mb-4">
              Tutoriels complets pour maîtriser toutes les fonctionnalités de Yo!Voiz
            </p>
            <Button variant="outline" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Consulter le guide
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow">
            <Video className="w-10 h-10 text-red-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tutoriels vidéo</h3>
            <p className="text-gray-600 mb-4">
              Apprenez en vidéo : publications, négociations, paiements
            </p>
            <Button variant="outline" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Voir les vidéos
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow">
            <Shield className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Conditions d'utilisation</h3>
            <p className="text-gray-600 mb-4">
              CGU, politique de confidentialité et règles de la plateforme
            </p>
            <Button variant="outline" className="w-full" onClick={() => router.push('/conditions-generales')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Lire les CGU
            </Button>
          </Card>
        </div>

        {/* Statut du support */}
        <Card className="p-6 bg-green-50 border-2 border-green-200">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Tous les systèmes sont opérationnels
              </h3>
              <p className="text-gray-600">
                Temps de réponse moyen : <strong>2 heures</strong> • Support disponible
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal formulaire de contact */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Contacter le support
                  </h2>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {formSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Message envoyé avec succès !
                    </h3>
                    <p className="text-gray-600">
                      Notre équipe vous répondra dans les 24 heures
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Sujet *
                      </label>
                      <Input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        placeholder="Ex: Problème de paiement"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Priorité
                      </label>
                      <select
                        value={contactForm.priority}
                        onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="low">Faible</option>
                        <option value="normal">Normale</option>
                        <option value="high">Haute</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        placeholder="Décrivez votre problème en détail..."
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowContactForm(false)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
