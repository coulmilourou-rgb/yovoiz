'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  X, FileText, Receipt, DollarSign, 
  Calendar, CheckCircle, Clock, TrendingUp 
} from 'lucide-react';

interface ClientHistoryModalProps {
  clientHistory: {
    client: any;
    devis: any[];
    factures: any[];
    stats: {
      totalDevis: number;
      totalFactures: number;
      totalAmount: number;
      paidAmount: number;
    };
  };
  onClose: () => void;
}

export default function ClientHistoryModal({ clientHistory, onClose }: ClientHistoryModalProps) {
  const { client, devis, factures, stats } = clientHistory;
  const [activeTab, setActiveTab] = useState<'devis' | 'factures' | 'stats'>('stats');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-white my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Historique Client</h2>
              <p className="text-orange-100 mt-1">{client.name}</p>
              <p className="text-sm text-orange-200 mt-1">
                📧 {client.email} • 📞 {client.phone}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="rounded-full w-10 h-10 p-0 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-3 px-4 font-medium transition-colors relative ${
                activeTab === 'stats'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Statistiques
            </button>
            <button
              onClick={() => setActiveTab('devis')}
              className={`py-3 px-4 font-medium transition-colors relative ${
                activeTab === 'devis'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Devis ({stats.totalDevis})
            </button>
            <button
              onClick={() => setActiveTab('factures')}
              className={`py-3 px-4 font-medium transition-colors relative ${
                activeTab === 'factures'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Receipt className="w-4 h-4 inline mr-2" />
              Factures ({stats.totalFactures})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'stats' && (
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Devis envoyés</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalDevis}</p>
                  </div>
                  <FileText className="w-12 h-12 text-blue-400" />
                </div>
              </Card>

              <Card className="p-6 bg-purple-50 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Factures émises</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalFactures}</p>
                  </div>
                  <Receipt className="w-12 h-12 text-purple-400" />
                </div>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Montant total</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      {stats.totalAmount.toLocaleString()} FCFA
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-green-400" />
                </div>
              </Card>

              <Card className="p-6 bg-orange-50 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Montant payé</p>
                    <p className="text-2xl font-bold text-orange-600 mt-2">
                      {stats.paidAmount.toLocaleString()} FCFA
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-orange-400" />
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'devis' && (
            <div className="space-y-3">
              {devis.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun devis pour ce client</p>
              ) : (
                devis.map(d => (
                  <Card key={d.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{d.id}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {new Date(d.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{d.amount} FCFA</p>
                        <Badge variant={
                          d.status === 'accepted' ? 'success' : 
                          d.status === 'rejected' ? 'error' : 'default'
                        }>
                          {d.status === 'accepted' ? 'Accepté' : 
                           d.status === 'rejected' ? 'Refusé' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'factures' && (
            <div className="space-y-3">
              {factures.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune facture pour ce client</p>
              ) : (
                factures.map(f => (
                  <Card key={f.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{f.id}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Échéance: {new Date(f.dueDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{f.amount} FCFA</p>
                        <Badge variant={
                          f.status === 'paid' ? 'success' : 
                          f.status === 'overdue' ? 'error' : 'default'
                        }>
                          {f.status === 'paid' ? 'Payée' : 
                           f.status === 'overdue' ? 'En retard' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Fermer
          </Button>
        </div>
      </Card>
    </div>
  );
}
