'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { 
  FileText, CheckCircle, Users, Calendar, 
  Search, Filter, TrendingUp, Download
} from 'lucide-react';

export default function ActivitesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const allActivities = [
    { id: 1, type: 'devis', client: 'Marie Dubois', action: 'Devis envoyé', amount: 450, status: 'pending', date: '2026-02-13', description: 'Devis pour réparation plomberie' },
    { id: 2, type: 'facture', client: 'Jean Martin', action: 'Facture payée', amount: 320, status: 'paid', date: '2026-02-12', description: 'Facture nettoyage bureau' },
    { id: 3, type: 'client', client: 'Sophie Laurent', action: 'Nouveau client', amount: 0, status: 'new', date: '2026-02-11', description: 'Inscription nouveau client' },
    { id: 4, type: 'devis', client: 'Pierre Durand', action: 'Devis accepté', amount: 680, status: 'accepted', date: '2026-02-10', description: 'Devis jardinage accepté' },
    { id: 5, type: 'facture', client: 'Claire Rousseau', action: 'Facture créée', amount: 540, status: 'pending', date: '2026-02-09', description: 'Facture service électricité' },
    { id: 6, type: 'devis', client: 'Marc Petit', action: 'Devis rejeté', amount: 890, status: 'rejected', date: '2026-02-08', description: 'Devis peinture refusé' },
    { id: 7, type: 'client', client: 'Alice Bernard', action: 'Mise à jour profil', amount: 0, status: 'updated', date: '2026-02-07', description: 'Coordonnées mises à jour' },
    { id: 8, type: 'facture', client: 'Thomas Blanc', action: 'Facture envoyée', amount: 760, status: 'sent', date: '2026-02-06', description: 'Facture réparation toiture' },
    { id: 9, type: 'devis', client: 'Emma Mercier', action: 'Devis en cours', amount: 1200, status: 'draft', date: '2026-02-05', description: 'Devis rénovation cuisine' },
    { id: 10, type: 'facture', client: 'Lucas Girard', action: 'Facture payée', amount: 480, status: 'paid', date: '2026-02-04', description: 'Facture dépannage urgent' },
    { id: 11, type: 'client', client: 'Léa Moreau', action: 'Nouveau client', amount: 0, status: 'new', date: '2026-02-03', description: 'Client référé par Sophie' },
    { id: 12, type: 'devis', client: 'Hugo Lambert', action: 'Devis envoyé', amount: 350, status: 'sent', date: '2026-02-02', description: 'Devis petits travaux' },
    { id: 13, type: 'facture', client: 'Chloé Robin', action: 'Relance paiement', amount: 920, status: 'overdue', date: '2026-02-01', description: 'Facture en retard' },
    { id: 14, type: 'devis', client: 'Antoine Leroy', action: 'Devis accepté', amount: 1580, status: 'accepted', date: '2026-01-31', description: 'Gros chantier accepté' },
    { id: 15, type: 'facture', client: 'Camille Fournier', action: 'Facture payée', amount: 290, status: 'paid', date: '2026-01-30', description: 'Petit entretien' },
  ];

  const filteredActivities = allActivities.filter(activity => {
    const matchSearch = activity.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       activity.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || activity.type === filterType;
    return matchSearch && matchType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'devis': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'facture': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'client': return <Users className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'devis': return 'bg-blue-100';
      case 'facture': return 'bg-green-100';
      case 'client': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: any = {
      paid: { label: 'Payé', color: 'bg-green-100 text-green-800' },
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      sent: { label: 'Envoyé', color: 'bg-blue-100 text-blue-800' },
      accepted: { label: 'Accepté', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-800' },
      new: { label: 'Nouveau', color: 'bg-purple-100 text-purple-800' },
      updated: { label: 'Mis à jour', color: 'bg-gray-100 text-gray-800' },
      draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
      overdue: { label: 'En retard', color: 'bg-red-100 text-red-800' },
    };
    return configs[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Toute l'activité récente</h1>
        <p className="text-gray-600 mt-1">Historique complet de vos actions et transactions</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-blue-800 mb-1">Devis</p>
          <p className="text-2xl font-bold text-blue-900">{allActivities.filter(a => a.type === 'devis').length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-sm text-green-800 mb-1">Factures</p>
          <p className="text-2xl font-bold text-green-900">{allActivities.filter(a => a.type === 'facture').length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-sm text-purple-800 mb-1">Clients</p>
          <p className="text-2xl font-bold text-purple-900">{allActivities.filter(a => a.type === 'client').length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <p className="text-sm text-orange-800 mb-1">Revenus</p>
          <p className="text-2xl font-bold text-orange-900">
            {allActivities.filter(a => a.status === 'paid').reduce((sum, a) => sum + a.amount, 0)} FCFA
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher par client ou action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilterType('all')}
            >
              Tout
            </Button>
            <Button
              variant={filterType === 'devis' ? 'primary' : 'outline'}
              onClick={() => setFilterType('devis')}
            >
              Devis
            </Button>
            <Button
              variant={filterType === 'facture' ? 'primary' : 'outline'}
              onClick={() => setFilterType('facture')}
            >
              Factures
            </Button>
            <Button
              variant={filterType === 'client' ? 'primary' : 'outline'}
              onClick={() => setFilterType('client')}
            >
              Clients
            </Button>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </Card>

      {/* Activities List */}
      <Card className="p-6">
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
                  {getTypeIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{activity.client}</p>
                    <Badge className={getStatusConfig(activity.status).color}>
                      {getStatusConfig(activity.status).label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(activity.date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right ml-4">
                {activity.amount > 0 && (
                  <p className="font-bold text-gray-900 text-lg">{activity.amount} FCFA</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune activité trouvée</p>
            <p className="text-sm text-gray-500 mt-1">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </Card>
    </div>
  );
}
