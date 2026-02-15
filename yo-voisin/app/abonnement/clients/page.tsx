'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { 
  Plus, Users, Search, Phone, Mail, 
  MapPin, DollarSign, FileText, Edit, Star, Eye, History, Trash2 
} from 'lucide-react';
import ClientForm from '@/components/abonnement/ClientForm';
import ClientHistoryModal from '@/components/abonnement/ClientHistoryModal';
import { useNotification } from '@/components/ui/ProNotification';
import { supabase } from '@/lib/supabase';

export default function ClientsPage() {
  const { user } = useAuth();
  const { success, error: showError, NotificationContainer } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedClientHistory, setSelectedClientHistory] = useState<any>(null);
  const [prefilledDevis, setPrefilledDevis] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadClients();
    }
  }, [user]);

  const loadClients = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setClients(data || []);
    } catch (err) {
      console.error('Erreur chargement clients:', err);
      showError('Erreur', 'Impossible de charger les clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (data: any) => {
    try {
      const { error: dbError } = await supabase
        .from('clients')
        .insert({ 
          user_id: user?.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          company: data.company,
          notes: data.notes
        });

      if (dbError) throw dbError;

      await loadClients();
      setShowCreateModal(false);
      success('Client ajouté', 'Le client a été créé avec succès');
    } catch (err) {
      console.error('Erreur création client:', err);
      showError('Erreur', 'Impossible de créer le client');
    }
  };

  const handleEditClient = async (data: any) => {
    try {
      const { error: dbError } = await supabase
        .from('clients')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          company: data.company,
          notes: data.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedClient.id);

      if (dbError) throw dbError;

      await loadClients();
      setShowEditModal(false);
      setSelectedClient(null);
      success('Client modifié', 'Les informations ont été mises à jour');
    } catch (err) {
      console.error('Erreur modification client:', err);
      showError('Erreur', 'Impossible de modifier le client');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;

    try {
      const { error: dbError } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (dbError) throw dbError;

      await loadClients();
      success('Client supprimé', 'Le client a été retiré');
    } catch (err) {
      console.error('Erreur suppression client:', err);
      showError('Erreur', 'Impossible de supprimer le client');
    }
  };

  const handleViewHistory = async (client: any) => {
    try {
      // Charger devis
      const { data: devisData, error: devisError } = await supabase
        .from('devis')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });

      if (devisError) throw devisError;

      // Charger factures
      const { data: facturesData, error: facturesError } = await supabase
        .from('factures')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });

      if (facturesError) throw facturesError;

      setSelectedClientHistory({
        client,
        devis: devisData || [],
        factures: facturesData || [],
        stats: {
          totalDevis: devisData?.length || 0,
          totalFactures: facturesData?.length || 0,
          totalAmount: facturesData?.reduce((sum, f) => sum + (f.amount || 0), 0) || 0,
          paidAmount: facturesData?.filter(f => f.status === 'paid').reduce((sum, f) => sum + (f.amount || 0), 0) || 0
        }
      });
      setShowHistoryModal(true);
    } catch (err: any) {
      console.error('Erreur chargement historique:', err);
      showError('Erreur', 'Impossible de charger l\'historique');
    }
  };

  const handleCreateDevis = (client: any) => {
    // Pré-remplir avec les infos du client
    const prefilledData = {
      client_id: client.id,
      client: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      clientAddress: client.address || '',
      items: [],
      amount: 0,
      status: 'draft',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setPrefilledDevis(prefilledData);
    // Rediriger vers la page devis avec query params
    window.location.href = `/abonnement/devis?client_id=${client.id}&client_name=${encodeURIComponent(client.name)}`;
  };

  const mockClients = [
    {
      id: 'CLT-001',
      name: 'Jean Martin',
      email: 'jean.martin@email.com',
      phone: '06 12 34 56 78',
      address: '15 rue de la Paix, 75001 Paris',
      since: '2025-10-15',
      totalSpent: 1250,
      invoicesCount: 4,
      status: 'active',
      rating: 5,
      lastPurchase: '2026-02-12'
    },
    {
      id: 'CLT-002',
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '06 98 76 54 32',
      address: '28 avenue Victor Hugo, 75016 Paris',
      since: '2025-11-20',
      totalSpent: 890,
      invoicesCount: 3,
      status: 'active',
      rating: 4,
      lastPurchase: '2026-02-10'
    },
    {
      id: 'CLT-003',
      name: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      phone: '06 45 67 89 01',
      address: '42 boulevard Haussmann, 75009 Paris',
      since: '2025-09-05',
      totalSpent: 2340,
      invoicesCount: 8,
      status: 'vip',
      rating: 5,
      lastPurchase: '2026-02-08'
    },
    {
      id: 'CLT-004',
      name: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      phone: '06 23 45 67 89',
      address: '7 place de la République, 75011 Paris',
      since: '2026-01-12',
      totalSpent: 450,
      invoicesCount: 1,
      status: 'new',
      rating: 4,
      lastPurchase: '2026-01-15'
    },
  ];

  const filteredClients = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.phone.includes(searchTerm);
    const matchType = filterType === 'all' || c.status === filterType;
    return matchSearch && matchType;
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      active: { label: 'Actif', color: 'bg-green-100 text-green-800' },
      vip: { label: 'VIP', color: 'bg-purple-100 text-purple-800' },
      new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-800' },
      inactive: { label: 'Inactif', color: 'bg-gray-100 text-gray-800' },
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  const totalClients = clients.length;
  const vipClients = clients.filter(c => c.status === 'vip').length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpent = totalClients > 0 ? Math.round(totalRevenue / totalClients) : 0;

  return (
    <div className="space-y-6">
      <NotificationContainer />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Répertoire clients</h1>
        <p className="text-gray-600 mt-1">Gérez vos relations clients et leur historique</p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-800">Total clients</p>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">{totalClients}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-purple-800">Clients VIP</p>
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-900">{vipClients}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-800">CA total</p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">{totalRevenue} FCFA</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-orange-800">Panier moyen</p>
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-900">{avgSpent} FCFA</p>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tous les clients</option>
                <option value="vip">VIP</option>
                <option value="active">Actifs</option>
                <option value="new">Nouveaux</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
            <Button 
              variant="default" 
              className="bg-orange-600 hover:bg-orange-700 w-full md:w-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau client
            </Button>
          </div>
        </Card>

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun client trouvé</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Essayez de modifier vos critères de recherche' 
                : 'Commencez par ajouter votre premier client'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClients.map((client) => {
              const statusConfig = getStatusConfig(client.status);
              
              return (
                <Card key={client.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{client.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig.color}>
                            {statusConfig.label}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-3 h-3 ${i < client.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedClient(client);
                        setShowEditModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{client.address}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CA total</p>
                      <p className="text-lg font-bold text-green-600">{client.totalSpent} FCFA</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Factures</p>
                      <p className="text-lg font-bold text-gray-900">{client.invoicesCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Client depuis</p>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(client.since).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedClient(client);
                        setShowEditModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewHistory(client)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Voir l'historique
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => handleCreateDevis(client)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau devis
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modales */}
        {showCreateModal && (
          <ClientForm
            mode="create"
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateClient}
          />
        )}

        {showEditModal && selectedClient && (
          <ClientForm
            mode="edit"
            client={selectedClient}
            onClose={() => {
              setShowEditModal(false);
              setSelectedClient(null);
            }}
            onSave={handleEditClient}
          />
        )}

        {showHistoryModal && selectedClientHistory && (
          <ClientHistoryModal
            clientHistory={selectedClientHistory}
            onClose={() => {
              setShowHistoryModal(false);
              setSelectedClientHistory(null);
            }}
          />
        )}
    </div>
  );
}
