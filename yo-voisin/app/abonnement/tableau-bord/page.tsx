'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { 
  TrendingUp, FileText, DollarSign, Users, 
  Calendar, Clock, CheckCircle, AlertCircle, Download
} from 'lucide-react';
import { exportDashboardPDF, exportDashboardExcel } from '@/lib/export-dashboard';

interface TableauBordProPageProps {
  onNavigate?: (view: string) => void;
}

export default function TableauBordProPage({ onNavigate }: TableauBordProPageProps) {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    revenusMonth: 3250,
    devisPending: 8,
    facturesUnpaid: 5,
    clientsActive: 23
  });
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | null>(null);

  const recentActivity = [
    { id: 1, type: 'devis', client: 'Marie Dubois', action: 'Devis envoyé', amount: 450, status: 'pending', date: '2026-02-13' },
    { id: 2, type: 'facture', client: 'Jean Martin', action: 'Facture payée', amount: 320, status: 'paid', date: '2026-02-12' },
    { id: 3, type: 'client', client: 'Sophie Laurent', action: 'Nouveau client', amount: 0, status: 'new', date: '2026-02-11' },
    { id: 4, type: 'devis', client: 'Pierre Durand', action: 'Devis accepté', amount: 680, status: 'accepted', date: '2026-02-10' },
  ];

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const dashboardData = {
        stats,
        recentActivity,
        profile: {
          name: profile ? `${profile.first_name} ${profile.last_name}` : 'Utilisateur',
          company: profile?.company_name || 'Mon Entreprise'
        },
        date: new Date().toLocaleDateString('fr-FR')
      };

      if (format === 'pdf') {
        await exportDashboardPDF(dashboardData);
      } else {
        await exportDashboardExcel(dashboardData);
      }
    } catch (error) {
      console.error('Erreur export:', error);
      alert('Erreur lors de l\'export');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord PRO</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre activité</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter Excel
          </Button>
          <Button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 bg-yo-orange hover:bg-orange-600"
          >
            <Download className="w-4 h-4" />
            Exporter PDF
          </Button>
          <Badge variant="success" className="bg-green-100 text-green-800">
            Abonnement PRO actif
          </Badge>
        </div>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-l-orange-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenus ce mois</p>
                <p className="text-3xl font-bold text-gray-900">{stats.revenusMonth} FCFA</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3" />
                  +12% vs mois dernier
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Devis en attente</p>
                <p className="text-3xl font-bold text-gray-900">{stats.devisPending}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-yellow-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Factures impayées</p>
                <p className="text-3xl font-bold text-gray-900">{stats.facturesUnpaid}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Clients actifs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.clientsActive}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Activité récente</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate?.('activites')}
              >
                Tout voir
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'devis' ? 'bg-blue-100' :
                      activity.type === 'facture' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'devis' && <FileText className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'facture' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {activity.type === 'client' && <Users className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{activity.client}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(activity.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount > 0 && (
                      <p className="font-bold text-gray-900">{activity.amount} FCFA</p>
                    )}
                    <Badge 
                      variant={
                        activity.status === 'paid' ? 'success' :
                        activity.status === 'accepted' ? 'success' :
                        activity.status === 'pending' ? 'warning' :
                        'default'
                      }
                      className="mt-1"
                    >
                      {activity.status === 'paid' && 'Payé'}
                      {activity.status === 'accepted' && 'Accepté'}
                      {activity.status === 'pending' && 'En attente'}
                      {activity.status === 'new' && 'Nouveau'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
    </div>
  );
}
