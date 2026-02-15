'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Crown, Info, MapPin, Eye, Briefcase, Lock, 
  Settings, FileText, Receipt, DollarSign, Users,
  Package, BarChart3, Edit, Star,
  ChevronRight, PlayCircle, CheckCircle, X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Import des composants de contenu
import VoirDemandesPage from './voir-demandes/page';
import TableauBordPage from './tableau-bord/page';
import DevisPage from './devis/page';
import FacturesPage from './factures/page';
import EncaissementsPage from './encaissements/page';
import ClientsPage from './clients/page';
import CataloguePage from './catalogue/page';
import ParametresProPage from './parametres-pro/page';
import ActivitesPage from './activites/page';
import PerimeterEmbed from '@/components/abonnement/PerimeterEmbed';
import ProfilePublicEmbed from '@/components/abonnement/ProfilePublicEmbed';
import ProfileEditEmbed from '@/components/abonnement/ProfileEditEmbed';

type ContentView = 'tarifs' | 'profile' | 'perimeter' | 'gerer-perimetre' | 'edit' | 'reviews' | 'dashboard' | 'devis' | 'factures' | 'encaissements' | 'clients' | 'catalogue' | 'parametres' | 'tutoriels' | 'activites' | null;

export default function AbonnementPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [activeView, setActiveView] = useState<ContentView>(null);
  const [showCurrentPlanModal, setShowCurrentPlanModal] = useState(false);

  useEffect(() => {
    if (profile) {
      // Initialisation
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yo-orange"></div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    router.push('/auth/connexion?redirect=/abonnement');
    return null;
  }

  const publicUrl = `yovoiz.com/p/${profile.id}`;
  const isPro = profile.is_pro || false;

  // Composant pour les items de menu
  const MenuItem = ({ 
    icon: Icon, 
    label, 
    onClick, 
    locked = false,
    badge = null 
  }: { 
    icon: any; 
    label: string; 
    onClick: () => void; 
    locked?: boolean;
    badge?: ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={locked}
      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all rounded-lg group ${
        locked 
          ? 'text-yo-gray-400 cursor-not-allowed' 
          : 'text-yo-gray-700 hover:bg-yo-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${locked ? 'text-yo-gray-300' : 'text-yo-orange'}`} />
        <span className="font-medium">{label}</span>
        {badge}
      </div>
      {!locked && <ChevronRight className="w-4 h-4 text-yo-gray-400 group-hover:text-yo-orange transition-colors" />}
      {locked && <Lock className="w-4 h-4 text-yo-gray-300" />}
    </button>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 bg-yo-gray-50">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SIDEBAR GAUCHE */}
            <div className="lg:col-span-3">
              <Card className="p-6 space-y-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                
                {/* Header Abonnement */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-yo-black">Abonnement</h2>
                    <Info className="w-4 h-4 text-yo-gray-400" />
                  </div>
                  <p className="text-sm text-yo-gray-600">
                    Retrouvez ici tous les services inclus dans votre abonnement {isPro ? 'Pro' : 'Standard'}.
                  </p>
                  <Button
                    onClick={() => setShowCurrentPlanModal(true)}
                    className="mt-3 w-full bg-yo-orange-pale text-yo-orange hover:bg-yo-orange hover:text-white border-0"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir l'offre actuelle
                  </Button>
                </div>

                <div className="border-t border-yo-gray-200" />

                {/* Mon périmètre d'intervention */}
                <div>
                  <h3 className="text-sm font-bold text-yo-gray-700 uppercase tracking-wide mb-3">
                    Mon périmètre d'intervention
                  </h3>
                  <div className="space-y-1">
                    <MenuItem
                      icon={Eye}
                      label="Voir les demandes"
                      onClick={() => setActiveView('perimeter')}
                    />
                    <MenuItem
                      icon={Settings}
                      label="Gérer mon périmètre"
                      onClick={() => setActiveView('gerer-perimetre')}
                    />
                  </div>
                </div>

                <div className="border-t border-yo-gray-200" />

                {/* Ma visibilité */}
                <div>
                  <h3 className="text-sm font-bold text-yo-gray-700 uppercase tracking-wide mb-3">
                    Ma visibilité
                  </h3>

                  <div className="space-y-1">
                    <MenuItem
                      icon={Eye}
                      label="Voir Ma Page"
                      onClick={() => setActiveView('profile')}
                    />
                    <MenuItem
                      icon={Edit}
                      label="Modifier ma page"
                      onClick={() => setActiveView('edit')}
                    />
                    <MenuItem
                      icon={Star}
                      label="Gérer mes avis"
                      onClick={() => setActiveView('reviews')}
                    />
                  </div>
                </div>

                <div className="border-t border-yo-gray-200" />

                {/* Mon entreprise PRO */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-bold text-yo-gray-700 uppercase tracking-wide">
                      Mon entreprise
                    </h3>
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-0.5">
                      <Crown className="w-3 h-3 mr-1" />
                      PRO
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <MenuItem
                      icon={BarChart3}
                      label="Tableau de bord"
                      onClick={() => setActiveView('dashboard')}
                      locked={!isPro}
                    />
                    <MenuItem
                      icon={FileText}
                      label="Devis"
                      onClick={() => setActiveView('devis')}
                      locked={!isPro}
                    />
                    <MenuItem
                      icon={Receipt}
                      label="Factures"
                      onClick={() => setActiveView('factures')}
                      locked={!isPro}
                    />
                    <MenuItem
                      icon={DollarSign}
                      label="Encaissements"
                      onClick={() => setActiveView('encaissements')}
                      locked={!isPro}
                    />
                    <MenuItem
                      icon={Users}
                      label="Répertoire clients"
                      onClick={() => setActiveView('clients')}
                      locked={!isPro}
                    />
                    <MenuItem
                      icon={Package}
                      label="Catalogue d'articles"
                      onClick={() => setActiveView('catalogue')}
                      locked={!isPro}
                    />
                    <MenuItem
                      icon={Settings}
                      label="Paramètres"
                      onClick={() => setActiveView('parametres')}
                      locked={!isPro}
                    />
                    <MenuItem
                      icon={PlayCircle}
                      label="Tutoriels vidéos"
                      onClick={() => setActiveView('tutoriels')}
                      locked={!isPro}
                    />
                  </div>

                  {!isPro && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-900 mb-3">
                        <strong>Passez en Pro</strong> pour accéder à tous ces outils professionnels !
                      </p>
                      <Button
                        onClick={() => router.push('/tarifs')}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 border-0"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Passer Pro
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* CONTENU PRINCIPAL */}
            <div className="lg:col-span-9">
              {activeView === null && (
                <Card className="p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-yo-orange-pale rounded-full flex items-center justify-center mx-auto mb-4">
                      <Info className="w-8 h-8 text-yo-orange" />
                    </div>
                    <h3 className="text-2xl font-bold text-yo-black mb-3">
                      Gérez votre abonnement
                    </h3>
                    <p className="text-yo-gray-600 mb-6">
                      Sélectionnez une option dans le menu de gauche pour commencer
                    </p>
                    <Button
                      onClick={() => setActiveView('profile')}
                      className="bg-yo-orange text-white hover:bg-yo-orange-dark"
                    >
                      Voir mon profil public
                    </Button>
                  </div>
                </Card>
              )}

              {/* Grille tarifaire */}
              {activeView === 'tarifs' && (
                <Card className="p-8">
                  <h2 className="text-3xl font-bold text-yo-black mb-6">Grille tarifaire Yo!Voiz</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Offre Standard */}
                    <Card className="p-6 border-2 border-yo-gray-200">
                      <h3 className="text-2xl font-bold text-yo-black mb-2">Standard</h3>
                      <div className="text-4xl font-bold text-yo-orange mb-4">
                        Gratuit
                      </div>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Poster vos demandes de services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Proposer vos services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Messagerie sécurisée</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Profil public basique</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Paiement sécurisé</span>
                        </li>
                      </ul>
                      <Button className="w-full bg-yo-gray-200 text-yo-gray-700">
                        Votre offre actuelle
                      </Button>
                    </Card>

                    {/* Offre Pro */}
                    <Card className="p-6 border-2 border-yo-orange bg-gradient-to-br from-amber-50 to-orange-50">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-yo-black">Pro</h3>
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          <Crown className="w-3 h-3 mr-1" />
                          Populaire
                        </Badge>
                      </div>
                      <div className="text-4xl font-bold text-yo-orange mb-1">
                        9 900 FCFA
                      </div>
                      <div className="text-sm text-yo-gray-600 mb-4">/mois</div>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span><strong>Tout de Standard +</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Tableau de bord professionnel</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Gestion devis et factures</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Suivi des encaissements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Répertoire clients</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Catalogue d'articles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Badge PRO sur profil</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Support prioritaire</span>
                        </li>
                      </ul>
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90">
                        <Crown className="w-4 h-4 mr-2" />
                        Passer Pro
                      </Button>
                    </Card>
                  </div>
                </Card>
              )}

              {activeView === 'profile' && (
                <ProfilePublicEmbed />
              )}

              {activeView === 'perimeter' && (
                <VoirDemandesPage />
              )}

              {activeView === 'gerer-perimetre' && (
                <PerimeterEmbed />
              )}

              {activeView === 'edit' && (
                <ProfileEditEmbed />
              )}

              {activeView === 'reviews' && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-yo-black mb-4">Gérer mes avis</h2>
                  <p className="text-yo-gray-600 mb-6">
                    Consultez et répondez aux avis de vos clients
                  </p>
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-yo-gray-300 mx-auto mb-4" />
                    <p className="text-yo-gray-500">Aucun avis pour le moment</p>
                  </div>
                </Card>
              )}

              {/* Sections Pro - Afficher le vrai contenu si Pro, sinon message upgrade */}
              {activeView === 'dashboard' && (
                isPro ? <TableauBordPage onNavigate={setActiveView} /> : (
                  <Card className="p-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-10 h-10 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-yo-black mb-3">Tableau de bord Pro</h3>
                      <p className="text-yo-gray-600 mb-6 max-w-md mx-auto">
                        Cette fonctionnalité est réservée aux membres Pro. Passez en Pro pour accéder à tous les outils professionnels.
                      </p>
                      <Button
                        onClick={() => setActiveView('tarifs')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Découvrir l'offre Pro
                      </Button>
                    </div>
                  </Card>
                )
              )}

              {activeView === 'devis' && (
                isPro ? <DevisPage /> : (
                  <Card className="p-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-10 h-10 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-yo-black mb-3">Gestion des devis</h3>
                      <p className="text-yo-gray-600 mb-6 max-w-md mx-auto">
                        Créez, gérez et envoyez vos devis professionnels en un clic avec l'offre Pro.
                      </p>
                      <Button
                        onClick={() => setActiveView('tarifs')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Découvrir l'offre Pro
                      </Button>
                    </div>
                  </Card>
                )
              )}

              {activeView === 'factures' && (
                isPro ? <FacturesPage /> : (
                  <Card className="p-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-10 h-10 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-yo-black mb-3">Gestion des factures</h3>
                      <p className="text-yo-gray-600 mb-6 max-w-md mx-auto">
                        Éditez et envoyez vos factures professionnelles automatiquement.
                      </p>
                      <Button
                        onClick={() => setActiveView('tarifs')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Découvrir l'offre Pro
                      </Button>
                    </div>
                  </Card>
                )
              )}

              {activeView === 'encaissements' && (
                isPro ? <EncaissementsPage /> : (
                  <Card className="p-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-10 h-10 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-yo-black mb-3">Suivi des encaissements</h3>
                      <p className="text-yo-gray-600 mb-6 max-w-md mx-auto">
                        Suivez tous vos paiements et encaissements en temps réel.
                      </p>
                      <Button
                        onClick={() => setActiveView('tarifs')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Découvrir l'offre Pro
                      </Button>
                    </div>
                  </Card>
                )
              )}

              {activeView === 'clients' && (
                isPro ? <ClientsPage /> : (
                  <Card className="p-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-10 h-10 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-yo-black mb-3">Répertoire clients</h3>
                      <p className="text-yo-gray-600 mb-6 max-w-md mx-auto">
                        Gérez facilement votre base de clients professionnels.
                      </p>
                      <Button
                        onClick={() => setActiveView('tarifs')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Découvrir l'offre Pro
                      </Button>
                    </div>
                  </Card>
                )
              )}

              {activeView === 'catalogue' && (
                isPro ? <CataloguePage /> : (
                  <Card className="p-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-10 h-10 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-yo-black mb-3">Catalogue d'articles</h3>
                      <p className="text-yo-gray-600 mb-6 max-w-md mx-auto">
                        Créez et gérez votre catalogue de services et tarifs.
                      </p>
                      <Button
                        onClick={() => setActiveView('tarifs')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Découvrir l'offre Pro
                      </Button>
                    </div>
                  </Card>
                )
              )}

              {activeView === 'activites' && (
                isPro ? <ActivitesPage /> : (
                  <Card className="p-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-10 h-10 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-yo-black mb-3">Historique d'activité</h3>
                      <p className="text-yo-gray-600 mb-6 max-w-md mx-auto">
                        Consultez l'historique complet de vos activités professionnelles.
                      </p>
                      <Button
                        onClick={() => setActiveView('tarifs')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Découvrir l'offre Pro
                      </Button>
                    </div>
                  </Card>
                )
              )}

              {activeView === 'parametres' && (
                isPro ? <ParametresProPage /> : (
                  <Card className="p-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-10 h-10 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-yo-black mb-3">Paramètres entreprise</h3>
                      <p className="text-yo-gray-600 mb-6 max-w-md mx-auto">
                        Configurez les informations de votre entreprise pour les devis et factures.
                      </p>
                      <Button
                        onClick={() => setActiveView('tarifs')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Découvrir l'offre Pro
                      </Button>
                    </div>
                  </Card>
                )
              )}

              {activeView === 'tutoriels' && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-yo-black mb-6">Tutoriels vidéos</h2>
                  <p className="text-yo-gray-600 mb-6">
                    Découvrez comment utiliser au maximum les fonctionnalités Pro de Yo!Voiz
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 border border-yo-gray-200">
                      <div className="aspect-video bg-yo-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-yo-gray-400" />
                      </div>
                      <h4 className="font-semibold text-yo-black mb-1">Créer votre premier devis</h4>
                      <p className="text-sm text-yo-gray-600">5:30</p>
                    </Card>
                    <Card className="p-4 border border-yo-gray-200">
                      <div className="aspect-video bg-yo-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-yo-gray-400" />
                      </div>
                      <h4 className="font-semibold text-yo-black mb-1">Gérer vos factures</h4>
                      <p className="text-sm text-yo-gray-600">4:15</p>
                    </Card>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Voir Offre Actuelle */}
      {showCurrentPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Votre Offre Actuelle</h2>
                <Badge variant="default" className="mt-2 bg-blue-100 text-blue-800">
                  Standard - Gratuit
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setShowCurrentPlanModal(false)}
                className="rounded-full w-10 h-10 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-green-50 border-green-200">
                  <p className="text-sm text-gray-600">Statut</p>
                  <p className="text-xl font-bold text-green-600 flex items-center gap-2 mt-2">
                    <CheckCircle className="w-5 h-5" />
                    Actif
                  </p>
                </Card>
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-gray-600">Tarif mensuel</p>
                  <p className="text-xl font-bold text-blue-600 mt-2">0 FCFA</p>
                </Card>
              </div>

              {/* Fonctionnalités */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Fonctionnalités incluses</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Publication de demandes illimitées</p>
                      <p className="text-sm text-gray-600">Publiez autant de demandes que vous le souhaitez</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Messagerie intégrée</p>
                      <p className="text-sm text-gray-600">Communiquez avec les prestataires</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Profil public visible</p>
                      <p className="text-sm text-gray-600">Soyez visible dans l'annuaire</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-400">Outils Pro (Devis, Factures, Catalogue...)</p>
                      <p className="text-sm text-gray-500">Disponible avec l'offre Gold</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-400">Badge Pro sur votre profil</p>
                      <p className="text-sm text-gray-500">Disponible avec l'offre Gold</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-400">Priorité dans les résultats de recherche</p>
                      <p className="text-sm text-gray-500">Disponible avec l'offre Gold</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Upgrade */}
              <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
                <div className="flex items-start gap-4">
                  <Crown className="w-12 h-12 text-orange-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">Passez à l'offre Gold</h4>
                    <p className="text-gray-600 mt-1 mb-4">
                      Débloquez tous les outils professionnels pour 9 990 FCFA/mois
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
                      onClick={() => {
                        setShowCurrentPlanModal(false);
                        router.push('/tarifs');
                      }}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Passer à Gold
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCurrentPlanModal(false)}
              >
                Fermer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
