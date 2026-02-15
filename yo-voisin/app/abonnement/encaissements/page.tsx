'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { 
  TrendingUp, DollarSign, Calendar, 
  Download, CreditCard, Banknote, Smartphone 
} from 'lucide-react';
import ExportModal from '@/components/abonnement/ExportModal';
import * as XLSX from 'xlsx';

export default function EncaissementsPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporter en ${format}:`, { transactions, selectedPeriod, selectedYear });
    
    if (format === 'excel') {
      // Préparation des données pour Excel
      const worksheetData = [
        ['Rapport des Encaissements'],
        [],
        ['Période', selectedPeriod === 'month' ? 'Mois en cours' : selectedPeriod === 'quarter' ? 'Trimestre' : 'Année'],
        ['Année', selectedYear],
        [],
        ['ID Transaction', 'Date', 'Client', 'Facture', 'Montant (FCFA)', 'Méthode', 'Statut']
      ];

      transactions.forEach(t => {
        const methodLabel = t.method === 'card' ? 'Carte bancaire' : 
                           t.method === 'transfer' ? 'Virement' : 
                           t.method === 'cash' ? 'Espèces' : 'Mobile Money';
        const statusLabel = t.status === 'completed' ? 'Complété' : 
                           t.status === 'pending' ? 'En attente' : 'Échoué';
        worksheetData.push([
          t.id,
          t.date,
          t.client,
          t.factureId,
          t.amount,
          methodLabel,
          statusLabel
        ]);
      });

      // Ajouter les statistiques
      worksheetData.push([]);
      worksheetData.push(['Statistiques']);
      worksheetData.push(['Total encaissé', transactions.reduce((sum, t) => sum + t.amount, 0) + ' FCFA']);
      worksheetData.push(['Nombre de transactions', transactions.length]);

      // Créer le fichier Excel
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Encaissements');

      // Télécharger
      XLSX.writeFile(wb, `encaissements-${selectedYear}-${selectedPeriod}.xlsx`);
    } else {
      // Génération PDF (existant)
      alert('Export PDF en cours de développement. Le rapport inclura:\n- Tableau des encaissements\n- Statistiques\n- Graphiques');
    }
    
    setShowExportModal(false);
  };

  const transactions = [
    {
      id: 'PAY-001',
      date: '2026-02-15',
      client: 'Jean Martin',
      factureId: 'FACT-2026-001',
      amount: 320,
      method: 'card',
      status: 'completed'
    },
    {
      id: 'PAY-002',
      date: '2026-02-14',
      client: 'Sophie Laurent',
      factureId: 'FACT-2026-005',
      amount: 150,
      method: 'transfer',
      status: 'completed'
    },
    {
      id: 'PAY-003',
      date: '2026-02-12',
      client: 'Pierre Durand',
      factureId: 'FACT-2026-003',
      amount: 680,
      method: 'cash',
      status: 'completed'
    },
    {
      id: 'PAY-004',
      date: '2026-02-10',
      client: 'Marie Dubois',
      factureId: 'FACT-2026-002',
      amount: 450,
      method: 'card',
      status: 'pending'
    },
  ];

  const monthlyRevenue = [
    { month: 'Janvier', revenue: 2850, transactions: 12 },
    { month: 'Février', revenue: 3250, transactions: 15 },
  ];

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'transfer': return <Banknote className="w-4 h-4" />;
      case 'cash': return <DollarSign className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'card': return 'Carte bancaire';
      case 'transfer': return 'Virement';
      case 'cash': return 'Espèces';
      case 'mobile': return 'Paiement mobile';
      default: return method;
    }
  };

  const totalRevenue = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingRevenue = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const previousMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const monthGrowth = previousMonth ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Encaissements</h1>
        <p className="text-gray-600 mt-1">Suivi de vos paiements et revenus</p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-800">Revenus encaissés</p>
              <div className="bg-green-200 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-700" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-900">{totalRevenue} FCFA</p>
            <p className="text-xs text-green-700 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{monthGrowth}% vs mois dernier
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-yellow-800">En attente</p>
              <div className="bg-yellow-200 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-700" />
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-900">{pendingRevenue} FCFA</p>
            <p className="text-xs text-yellow-700 mt-2">
              {transactions.filter(t => t.status === 'pending').length} paiement(s)
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-800">Transactions</p>
              <div className="bg-blue-200 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-700" />
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-900">{transactions.length}</p>
            <p className="text-xs text-blue-700 mt-2">Ce mois-ci</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-purple-800">Moyenne/transaction</p>
              <div className="bg-purple-200 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-700" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {transactions.length > 0 ? Math.round(totalRevenue / transactions.length) : 0} FCFA
            </p>
            <p className="text-xs text-purple-700 mt-2">Panier moyen</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions List */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Transactions récentes</h2>
              <div className="flex items-center gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                </select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowExportModal(true)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      transaction.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {getMethodIcon(transaction.method)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.client}</p>
                      <p className="text-sm text-gray-600">{getMethodLabel(transaction.method)}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{transaction.factureId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">+{transaction.amount} FCFA</p>
                    <Badge 
                      variant={transaction.status === 'completed' ? 'success' : 'warning'}
                      className="mt-1"
                    >
                      {transaction.status === 'completed' ? 'Encaissé' : 'En attente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue Chart & Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Évolution mensuelle</h2>
              <div className="space-y-4">
                {monthlyRevenue.map((month, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{month.month}</span>
                      <span className="text-sm font-bold text-gray-900">{month.revenue} FCFA</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all"
                        style={{ width: `${(month.revenue / 5000) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{month.transactions} transactions</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Répartition par méthode</h2>
              <div className="space-y-4">
                {[
                  { method: 'card', label: 'Carte bancaire', count: 8, color: 'bg-blue-500' },
                  { method: 'transfer', label: 'Virement', count: 4, color: 'bg-green-500' },
                  { method: 'cash', label: 'Espèces', count: 2, color: 'bg-yellow-500' },
                ].map((item) => (
                  <div key={item.method}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(item.method)}
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all`}
                        style={{ width: `${Math.min((item.count / transactions.length) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <h3 className="font-bold text-orange-900 mb-2">Conseil</h3>
              <p className="text-sm text-orange-800">
                Activez les paiements automatiques pour réduire les retards de paiement et améliorer votre trésorerie.
              </p>
              <Button variant="default" size="sm" className="mt-4 bg-orange-600 hover:bg-orange-700">
                Configurer
              </Button>
            </Card>
          </div>
        </div>

        {/* Modal Export */}
        {showExportModal && (
          <ExportModal
            title="Encaissements"
            onClose={() => setShowExportModal(false)}
            onExport={handleExport}
          />
        )}
    </div>
  );
}
