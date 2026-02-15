'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { 
  Building, FileText, Bell, 
  Users, Save, Eye, EyeOff, Mail, Globe 
} from 'lucide-react';

export default function ParametresProPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('company');
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const tabs = [
    { id: 'company', label: 'Entreprise', icon: Building },
    { id: 'invoicing', label: 'Facturation', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Équipe', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres PRO</h1>
        <p className="text-gray-600 mt-1">Configurez votre espace entreprise</p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <Card className="p-4 h-fit lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Company Info Tab */}
            {activeTab === 'company' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de l'entreprise</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'entreprise *
                      </label>
                      <input
                        type="text"
                        defaultValue="Services Pro Yo!Voiz"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro d'immatriculation (optionnel)
                      </label>
                      <input
                        type="text"
                        placeholder="Numéro RCCM ou autre"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Registre de Commerce et du Crédit Mobilier</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Forme juridique
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option>Entreprise individuelle</option>
                        <option>SARL</option>
                        <option>SAS</option>
                        <option>SA</option>
                        <option>GIE (Groupement d'Intérêt Économique)</option>
                        <option>Association</option>
                        <option>Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de TVA (optionnel)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: CI123456789"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">TVA à 18% - Laissez vide si non assujetti</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse complète
                    </label>
                    <input
                      type="text"
                      defaultValue="Cocody, Riviera Palmeraie"
                      placeholder="Ex: Cocody, Riviera Palmeraie"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-3"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        defaultValue="Abidjan"
                        placeholder="Ville"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option>Cocody</option>
                        <option>Yopougon</option>
                        <option>Abobo</option>
                        <option>Adjamé</option>
                        <option>Plateau</option>
                        <option>Treichville</option>
                        <option>Marcory</option>
                        <option>Koumassi</option>
                        <option>Port-Bouët</option>
                        <option>Attécoubé</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email professionnel
                      </label>
                      <input
                        type="email"
                        defaultValue="contact@monentreprise.ci"
                        placeholder="contact@entreprise.ci"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Globe className="w-4 h-4 inline mr-1" />
                        Site web
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.monentreprise.fr"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo de l'entreprise
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building className="w-12 h-12 text-gray-400" />
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Choisir un fichier</Button>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG jusqu'à 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline">Annuler</Button>
                    <Button variant="default" className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Invoicing Tab */}
            {activeTab === 'invoicing' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres de facturation</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Préfixe des factures
                    </label>
                    <input
                      type="text"
                      defaultValue="FACT"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Exemple: FACT-2026-001</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Délai de paiement par défaut
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option>À réception</option>
                      <option>15 jours</option>
                      <option selected>30 jours</option>
                      <option>45 jours</option>
                      <option>60 jours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mentions légales facture
                    </label>
                    <textarea
                      rows={4}
                      defaultValue="TVA non applicable, art. 293 B du CGI. En cas de retard de paiement, des pénalités de 10% seront appliquées."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Options TVA</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-blue-900">Appliquer la TVA (20%)</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-blue-900">Franchise de TVA (Auto-entrepreneur)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline">Annuler</Button>
                    <Button variant="default" className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Préférences de notifications</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Email</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Nouveau devis accepté</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600" />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Facture payée</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600" />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Nouveau message client</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600" />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Rappel facture impayée</span>
                        <input type="checkbox" className="w-4 h-4 text-orange-600" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Push (application)</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Nouvelle demande reçue</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600" />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Message urgent</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600" />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="default" className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Gestion de l'équipe</h2>
                  <Button 
                    variant="default" 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => setShowComingSoonModal(true)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Inviter un membre
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-lg">
                        VJ
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Vous</p>
                        <p className="text-sm text-gray-600">proprietaire@email.com</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-purple-100 text-purple-800">Propriétaire</Badge>
                  </div>

                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucun membre d'équipe pour le moment</p>
                    <p className="text-sm mt-1">Invitez des collaborateurs pour gérer votre activité ensemble</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

      {/* Modal Fonctionnalité à venir */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fonctionnalité à venir</h3>
              <p className="text-gray-600 mb-6">
                La gestion d'équipe sera bientôt disponible. Vous pourrez inviter des collaborateurs 
                pour gérer votre activité professionnelle ensemble.
              </p>
              <Button 
                variant="default" 
                className="bg-orange-600 hover:bg-orange-700 w-full"
                onClick={() => setShowComingSoonModal(false)}
              >
                J'ai compris
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
