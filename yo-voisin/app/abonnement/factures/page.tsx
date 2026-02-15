'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { 
  Plus, FileText, Download, Eye, Send, Edit,
  AlertCircle, CheckCircle, Clock, Search, Filter, Calendar 
} from 'lucide-react';
import FactureForm from '@/components/abonnement/FactureForm';
import FactureView from '@/components/abonnement/FactureView';
import FactureReminder from '@/components/abonnement/FactureReminder';
import { useNotification } from '@/components/ui/ProNotification';
import { supabase } from '@/lib/supabase';
import { generateFacturePDF, downloadPDF } from '@/lib/pdf-generator';

export default function FacturesPage() {
  const { user, profile } = useAuth();
  const { success, error: showError, NotificationContainer } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<any>(null);
  const [factures, setFactures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFactures();
    }
  }, [user]);

  const loadFactures = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('factures')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setFactures(data || []);
    } catch (err) {
      console.error('Erreur chargement factures:', err);
      showError('Erreur', 'Impossible de charger les factures');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFacture = async (data: any) => {
    try {
      const items = data.items || [];
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
      const taxRate = data.taxRate || 0;
      const taxAmount = (subtotal * taxRate) / 100;
      const total = subtotal + taxAmount;

      const { data: newFacture, error: dbError } = await supabase
        .from('factures')
        .insert({
          user_id: user?.id,
          client_id: data.client_id || null,
          client_name: data.clientName || data.client,
          client_email: data.clientEmail || data.email,
          client_phone: data.clientPhone || data.phone,
          client_address: data.clientAddress || data.address,
          items: items,
          subtotal: subtotal,
          tax_rate: taxRate,
          tax_amount: taxAmount,
          total: total,
          amount_paid: 0,
          status: 'pending',
          issue_date: data.issueDate || new Date().toISOString().split('T')[0],
          due_date: data.dueDate || null,
          payment_method: data.paymentMethod || null,
          notes: data.notes || ''
        })
        .select()
        .single();

      if (dbError) throw dbError;

      await loadFactures();
      setShowCreateModal(false);
      success('Facture créée', 'La facture a été ajoutée avec succès');
    } catch (err: any) {
      console.error('Erreur création facture:', err);
      showError('Erreur', `Impossible de créer la facture: ${err.message}`);
    }
  };

  const handleEditFacture = async (data: any) => {
    try {
      console.log('📝 Modification facture avec données:', data);
      
      // Les services peuvent être dans data.services OU data.items
      const items = data.services || data.items || [];
      console.log('📦 Items à sauvegarder:', items);
      
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
      const taxRate = data.taxRate || 0;
      const taxAmount = (subtotal * taxRate) / 100;
      const total = subtotal + taxAmount;

      const updateData = {
        client_name: data.clientName || data.client,
        client_email: data.clientEmail || data.email,
        client_phone: data.clientPhone || data.phone,
        client_address: data.clientAddress || data.address,
        items: items,
        subtotal: subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total: total,
        issue_date: data.date || data.issueDate,
        due_date: data.dueDate,
        payment_method: data.paymentMethod,
        notes: data.notes,
        updated_at: new Date().toISOString()
      };

      console.log('💾 Données à mettre à jour:', updateData);

      const { error: dbError } = await supabase
        .from('factures')
        .update(updateData)
        .eq('id', selectedFacture.id);

      if (dbError) {
        console.error('❌ Erreur Supabase:', dbError);
        throw dbError;
      }

      console.log('✅ Facture modifiée avec succès');
      await loadFactures();
      setShowEditModal(false);
      setSelectedFacture(null);
      success('Facture modifiée', 'Les modifications ont été enregistrées avec succès');
    } catch (err: any) {
      console.error('❌ Erreur modification facture:', err);
      showError('Erreur', `Impossible de modifier la facture: ${err.message}`);
    }
  };

  const handleMarkPaid = async (factureToMark: any) => {
    if (!confirm(`Marquer la facture ${factureToMark.reference || factureToMark.id} comme payée ?`)) return;

    try {
      const { error: dbError } = await supabase
        .from('factures')
        .update({ 
          status: 'paid', 
          payment_date: new Date().toISOString().split('T')[0],
          amount_paid: factureToMark.total
        })
        .eq('id', factureToMark.id);

      if (dbError) throw dbError;

      await loadFactures();
      setShowViewModal(false);
      setSelectedFacture(null);
      success('Facture payée', 'Le statut a été mis à jour avec succès');
    } catch (err: any) {
      console.error('Erreur marquer payée:', err);
      showError('Erreur', `Impossible de mettre à jour le statut: ${err.message}`);
    }
  };

  const handleSendReminder = async (reminderData: any) => {
    try {
      // TODO: Implémenter envoi via messagerie interne
      console.log('Envoyer relance:', reminderData);
      setShowReminderModal(false);
      setSelectedFacture(null);
      success('Relance envoyée', 'Le client recevra la relance dans sa messagerie');
    } catch (err) {
      showError('Erreur', "Impossible d'envoyer la relance");
    }
  };

  const handleDownloadPDF = async (factureData: any) => {
    try {
      const pdfBlob = generateFacturePDF({
        ...factureData,
        provider: {
          name: profile?.company_name || `${profile?.first_name} ${profile?.last_name}`,
          company: profile?.company_name,
          email: user?.email,
          phone: profile?.phone,
          address: profile?.address
        }
      });

      downloadPDF(pdfBlob, `Facture-${factureData.id}.pdf`);
      success('PDF généré', 'La facture a été téléchargée avec succès');
    } catch (err) {
      console.error('Erreur génération PDF:', err);
      showError('Erreur', 'Impossible de générer le PDF');
    }
  };

  const mockFactures = [
    { 
      id: 'FACT-2026-001', 
      client: 'Jean Martin', 
      date: '2026-02-12', 
      dueDate: '2026-03-12',
      amount: 320, 
      status: 'paid',
      paidDate: '2026-02-15',
      devisId: 'DEV-2026-002'
    },
    { 
      id: 'FACT-2026-002', 
      client: 'Marie Dubois', 
      date: '2026-02-10', 
      dueDate: '2026-03-10',
      amount: 450, 
      status: 'pending',
      devisId: 'DEV-2026-001'
    },
    { 
      id: 'FACT-2026-003', 
      client: 'Sophie Laurent', 
      date: '2026-02-08', 
      dueDate: '2026-03-08',
      amount: 680, 
      status: 'overdue',
      devisId: 'DEV-2026-003'
    },
    { 
      id: 'FACT-2026-004', 
      client: 'Pierre Durand', 
      date: '2026-02-05', 
      dueDate: '2026-03-05',
      amount: 890, 
      status: 'sent',
      devisId: 'DEV-2026-004'
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      paid: { 
        label: 'Payée', 
        icon: CheckCircle, 
        color: 'bg-green-100 text-green-800',
        borderColor: 'border-l-green-500'
      },
      pending: { 
        label: 'En attente', 
        icon: Clock, 
        color: 'bg-yellow-100 text-yellow-800',
        borderColor: 'border-l-yellow-500'
      },
      overdue: { 
        label: 'En retard', 
        icon: AlertCircle, 
        color: 'bg-red-100 text-red-800',
        borderColor: 'border-l-red-500'
      },
      sent: { 
        label: 'Envoyée', 
        icon: Send, 
        color: 'bg-blue-100 text-blue-800',
        borderColor: 'border-l-blue-500'
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const filteredFactures = factures.filter(f => {
    const matchSearch = f.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       f.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || f.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = factures.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = factures.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      <NotificationContainer />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des factures</h1>
        <p className="text-gray-600 mt-1">Générez et suivez vos factures clients</p>
      </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">Factures payées</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{totalRevenue} FCFA</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">En attente</p>
            </div>
            <p className="text-2xl font-bold text-yellow-900">{totalPending} FCFA</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">En retard</p>
            </div>
            <p className="text-2xl font-bold text-red-900">{factures.filter(f => f.status === 'overdue').length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-purple-800">Total factures</p>
            </div>
            <p className="text-2xl font-bold text-purple-900">{factures.length}</p>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par client ou numéro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="paid">Payées</option>
                  <option value="sent">Envoyées</option>
                  <option value="pending">En attente</option>
                  <option value="overdue">En retard</option>
                </select>
              </div>
            </div>
            <Button 
              variant="default" 
              className="bg-orange-600 hover:bg-orange-700 w-full md:w-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle facture
            </Button>
          </div>
        </Card>

        {/* Factures List */}
        {filteredFactures.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune facture trouvée</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche' 
                : 'Commencez par créer votre première facture'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFactures.map((facture) => {
              const statusConfig = getStatusConfig(facture.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Card key={facture.id} className={`p-6 hover:shadow-lg transition-shadow border-l-4 ${statusConfig.borderColor}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{facture.id}</h3>
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-gray-600 font-medium">{facture.client_name || facture.client || 'Client non spécifié'}</p>
                          <p className="text-xs text-gray-500 mt-1">Devis associé: {facture.devisId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600">
                            {(facture.total || facture.amount || 0).toLocaleString('fr-FR')} FCFA
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Émise le {new Date(facture.date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Échéance: {new Date(facture.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                        {facture.status === 'paid' && facture.paidDate && (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Payée le {new Date(facture.paidDate).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 lg:flex-none"
                        onClick={() => {
                          setSelectedFacture(facture);
                          setShowViewModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 lg:flex-none"
                        onClick={() => handleDownloadPDF(facture)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      {facture.status !== 'paid' && (
                        <>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                            onClick={() => handleMarkPaid(facture)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Marquer payée
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 lg:flex-none"
                            onClick={() => {
                              setSelectedFacture(facture);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                        </>
                      )}
                      {(facture.status === 'overdue' || facture.status === 'pending') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 lg:flex-none border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setSelectedFacture(facture);
                            setShowReminderModal(true);
                          }}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Relancer
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modales */}
        {showCreateModal && (
          <FactureForm
            mode="create"
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateFacture}
          />
        )}

        {showEditModal && selectedFacture && (
          <FactureForm
            mode="edit"
            facture={selectedFacture}
            onClose={() => {
              setShowEditModal(false);
              setSelectedFacture(null);
            }}
            onSave={handleEditFacture}
          />
        )}

        {showViewModal && selectedFacture && (
          <FactureView
            facture={selectedFacture}
            onClose={() => {
              setShowViewModal(false);
              setSelectedFacture(null);
            }}
            onEdit={() => {
              setShowViewModal(false);
              setShowEditModal(true);
            }}
            onDownloadPDF={() => handleDownloadPDF(selectedFacture)}
            onMarkPaid={() => handleMarkPaid(selectedFacture)}
            onSendReminder={() => {
              setShowViewModal(false);
              setShowReminderModal(true);
            }}
          />
        )}

        {showReminderModal && selectedFacture && (
          <FactureReminder
            facture={selectedFacture}
            onClose={() => {
              setShowReminderModal(false);
              setSelectedFacture(null);
            }}
            onSend={handleSendReminder}
          />
        )}
    </div>
  );
}
