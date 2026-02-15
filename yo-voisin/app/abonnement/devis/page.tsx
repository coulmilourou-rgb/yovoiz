'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Plus, FileText, Send, Download, Eye, 
  Edit, Trash2, Search, Filter, Calendar, DollarSign 
} from 'lucide-react';
import DevisForm from '@/components/abonnement/DevisForm';
import DevisView from '@/components/abonnement/DevisView';
import DevisSendEmail from '@/components/abonnement/DevisSendEmail';
import { useNotification } from '@/components/ui/ProNotification';
import { supabase } from '@/lib/supabase';
import { generateDevisPDF } from '@/lib/pdf-generator';

function DevisContent() {
  const { user, profile } = useAuth();
  const { success, error: showError, NotificationContainer } = useNotification();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [selectedDevis, setSelectedDevis] = useState<any>(null);
  const [devis, setDevis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Vérifier si on vient de la page clients avec un client pré-sélectionné
  useEffect(() => {
    const clientId = searchParams?.get('client_id');
    const clientName = searchParams?.get('client_name');
    
    if (clientId && clientName) {
      // Charger les infos complètes du client
      loadClientAndOpenForm(clientId, clientName);
    }
  }, [searchParams]);

  const loadClientAndOpenForm = async (clientId: string, clientName: string) => {
    try {
      const { data: clientData, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (!error && clientData) {
        const prefilledData = {
          client_id: clientData.id,
          client: clientData.name,
          clientEmail: clientData.email,
          clientPhone: clientData.phone,
          clientAddress: clientData.address || '',
          items: [],
          amount: 0,
          status: 'draft',
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        
        setSelectedDevis(prefilledData);
        setShowCreateModal(true);
      }
    } catch (err) {
      console.error('Erreur chargement client:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadDevis();
    }
  }, [user]);

  const loadDevis = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('devis')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setDevis(data || []);
    } catch (err) {
      console.error('Erreur chargement devis:', err);
      showError('Erreur', 'Impossible de charger les devis');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDevis = async (data: any) => {
    try {
      // Calculer les totaux
      const items = data.items || [];
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
      const taxRate = data.taxRate || 0;
      const taxAmount = (subtotal * taxRate) / 100;
      const total = subtotal + taxAmount;

      const { data: newDevis, error: dbError } = await supabase
        .from('devis')
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
          status: 'draft',
          issue_date: data.issueDate || new Date().toISOString().split('T')[0],
          expiry_date: data.expiryDate || null,
          notes: data.notes || ''
        })
        .select()
        .single();

      if (dbError) throw dbError;

      await loadDevis();
      setShowCreateModal(false);
      success('Devis créé', 'Le devis a été ajouté avec succès à votre liste');
    } catch (err: any) {
      console.error('Erreur création devis:', err);
      showError('Erreur', `Impossible de créer le devis: ${err.message}`);
    }
  };

  const handleEditDevis = async (data: any) => {
    try {
      console.log('📝 Modification devis avec données:', data);
      
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
        expiry_date: data.validUntil || data.expiryDate,
        notes: data.notes,
        updated_at: new Date().toISOString()
      };

      console.log('💾 Données à mettre à jour:', updateData);

      const { error: dbError } = await supabase
        .from('devis')
        .update(updateData)
        .eq('id', selectedDevis.id);

      if (dbError) {
        console.error('❌ Erreur Supabase:', dbError);
        throw dbError;
      }

      console.log('✅ Devis modifié avec succès');
      await loadDevis();
      setShowEditModal(false);
      setSelectedDevis(null);
      success('Devis modifié', 'Les modifications ont été enregistrées avec succès');
    } catch (err: any) {
      console.error('❌ Erreur modification devis:', err);
      showError('Erreur', `Impossible de modifier le devis: ${err.message}`);
    }
  };

  const handleSendEmail = async (emailData: any) => {
    try {
      // TODO: Implémenter envoi via messagerie interne
      console.log('Envoyer email:', emailData);
      setShowSendEmailModal(false);
      setSelectedDevis(null);
      success('Devis envoyé', 'Le client recevra le devis dans sa messagerie');
    } catch (err) {
      showError('Erreur', 'Impossible d\'envoyer le devis');
    }
  };

  const handleDownloadPDF = async (devisData: any) => {
    try {
      const pdfBlob = generateDevisPDF({
        ...devisData,
        provider: {
          name: profile?.company_name || `${profile?.first_name} ${profile?.last_name}`,
          company: profile?.company_name,
          email: user?.email,
          phone: profile?.phone,
          address: profile?.address
        }
      });

      downloadPDF(pdfBlob, `Devis-${devisData.id}.pdf`);
      success('PDF généré', 'Le devis a été téléchargé avec succès');
    } catch (err) {
      console.error('Erreur génération PDF:', err);
      showError('Erreur', 'Impossible de générer le PDF');
    }
  };

  const handleDeleteDevis = async (devisToDelete: any) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le devis ${devisToDelete.id} ?`)) return;

    try {
      const { error: dbError } = await supabase
        .from('devis')
        .delete()
        .eq('id', devisToDelete.id);

      if (dbError) throw dbError;

      await loadDevis();
      success('Devis supprimé', 'Le devis a été supprimé avec succès');
    } catch (err) {
      console.error('Erreur suppression devis:', err);
      showError('Erreur', 'Impossible de supprimer le devis');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'En attente', variant: 'warning' as const, color: 'bg-yellow-100 text-yellow-800' },
      sent: { label: 'Envoyé', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      accepted: { label: 'Accepté', variant: 'success' as const, color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Refusé', variant: 'default' as const, color: 'bg-red-100 text-red-800' },
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const filteredDevis = devis.filter(d => {
    const matchSearch = d.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       d.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <NotificationContainer />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des devis</h1>
        <p className="text-gray-600 mt-1">Créez, envoyez et suivez vos devis clients</p>
      </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <p className="text-sm text-orange-800 mb-1">Total devis</p>
            <p className="text-2xl font-bold text-orange-900">{devis.length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm text-blue-800 mb-1">En attente</p>
            <p className="text-2xl font-bold text-blue-900">{devis.filter(d => d.status === 'pending').length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-green-800 mb-1">Acceptés</p>
            <p className="text-2xl font-bold text-green-900">{devis.filter(d => d.status === 'accepted').length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <p className="text-sm text-purple-800 mb-1">Montant total</p>
            <p className="text-2xl font-bold text-purple-900">{devis.reduce((sum, d) => sum + d.amount, 0)} FCFA</p>
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
                  <option value="pending">En attente</option>
                  <option value="sent">Envoyés</option>
                  <option value="accepted">Acceptés</option>
                  <option value="rejected">Refusés</option>
                </select>
              </div>
            </div>
            <Button 
              variant="default" 
              className="bg-orange-600 hover:bg-orange-700 w-full md:w-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau devis
            </Button>
          </div>
        </Card>

        {/* Devis List */}
        {filteredDevis.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun devis trouvé</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche' 
                : 'Commencez par créer votre premier devis'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button 
                variant="default" 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Créer mon premier devis
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDevis.map((devis) => {
              const statusConfig = getStatusBadge(devis.status);
              return (
                <Card key={devis.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{devis.id}</h3>
                            <Badge className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-gray-600 font-medium">{devis.client_name || devis.client || 'Client non spécifié'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600">
                            {(devis.total || devis.amount || 0).toLocaleString('fr-FR')} FCFA
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {devis.items && Array.isArray(devis.items) && devis.items.map((item: any, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {item.description || item.service || item.name}
                          </span>
                        ))}
                        {(!devis.items || devis.items.length === 0) && (
                          <span className="text-gray-400 text-sm italic">Aucun service</span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Créé le {new Date(devis.issue_date || devis.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        {devis.expiry_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Valide jusqu'au {new Date(devis.expiry_date).toLocaleDateString('fr-FR')}
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
                          setSelectedDevis(devis);
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
                        onClick={() => handleDownloadPDF(devis)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      {devis.status !== 'accepted' && devis.status !== 'rejected' && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedDevis(devis);
                            setShowSendEmailModal(true);
                          }}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer
                        </Button>
                      )}
                      {devis.status !== 'accepted' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 lg:flex-none"
                          onClick={() => {
                            setSelectedDevis(devis);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
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
          <DevisForm
            mode="create"
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateDevis}
          />
        )}

        {showEditModal && selectedDevis && (
          <DevisForm
            mode="edit"
            devis={selectedDevis}
            onClose={() => {
              setShowEditModal(false);
              setSelectedDevis(null);
            }}
            onSave={handleEditDevis}
          />
        )}

        {showViewModal && selectedDevis && (
          <DevisView
            devis={selectedDevis}
            onClose={() => {
              setShowViewModal(false);
              setSelectedDevis(null);
            }}
            onEdit={() => {
              setShowViewModal(false);
              setShowEditModal(true);
            }}
            onDownloadPDF={() => handleDownloadPDF(selectedDevis)}
            onSendEmail={() => {
              setShowViewModal(false);
              setShowSendEmailModal(true);
            }}
          />
        )}

        {showSendEmailModal && selectedDevis && (
          <DevisSendEmail
            devis={selectedDevis}
            onClose={() => {
              setShowSendEmailModal(false);
              setSelectedDevis(null);
            }}
            onSend={handleSendEmail}
          />
        )}
    </div>
  );
}

export default function DevisPage() {
  return (
    <Suspense fallback={<div className="p-6">Chargement...</div>}>
      <DevisContent />
    </Suspense>
  );
}
