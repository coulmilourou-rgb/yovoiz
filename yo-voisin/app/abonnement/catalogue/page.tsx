'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { 
  Plus, Package, Search, Edit, Trash2, 
  Copy, Eye, EyeOff, DollarSign, Clock, Grid, List 
} from 'lucide-react';
import ServiceForm from '@/components/abonnement/ServiceForm';
import { useNotification } from '@/components/ui/ProNotification';
import { supabase } from '@/lib/supabase';

export default function CataloguePage() {
  const { user } = useAuth();
  const { success, error: showError, NotificationContainer } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadServices();
    }
  }, [user]);

  const loadServices = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('services_catalogue')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setServices(data || []);
    } catch (err) {
      console.error('Erreur chargement services:', err);
      showError('Erreur', 'Impossible de charger le catalogue');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (data: any) => {
    try {
      const { error: dbError } = await supabase
        .from('services_catalogue')
        .insert({
          user_id: user?.id,
          name: data.name,
          category: data.category,
          description: data.description,
          price: data.price,
          unit: data.unit,
          duration: data.duration,
          status: 'active',
          usage_count: 0
        });

      if (dbError) throw dbError;

      await loadServices();
      setShowCreateModal(false);
      success('Service créé', 'Le service a été ajouté au catalogue');
    } catch (err) {
      console.error('Erreur création service:', err);
      showError('Erreur', 'Impossible de créer le service');
    }
  };

  const handleEditService = async (data: any) => {
    try {
      const { error: dbError } = await supabase
        .from('services_catalogue')
        .update({
          name: data.name,
          category: data.category,
          description: data.description,
          price: data.price,
          unit: data.unit,
          duration: data.duration,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedService.id);

      if (dbError) throw dbError;

      await loadServices();
      setShowEditModal(false);
      setSelectedService(null);
      success('Service modifié', 'Les modifications ont été enregistrées');
    } catch (err) {
      console.error('Erreur modification service:', err);
      showError('Erreur', 'Impossible de modifier le service');
    }
  };

  const handleDuplicateService = async (data: any) => {
    try {
      const { error: dbError } = await supabase
        .from('services_catalogue')
        .insert({
          user_id: user?.id,
          name: `${data.name} (copie)`,
          category: data.category,
          description: data.description,
          price: data.price,
          unit: data.unit,
          duration: data.duration,
          status: 'active',
          usage_count: 0
        });

      if (dbError) throw dbError;

      await loadServices();
      setShowDuplicateModal(false);
      setSelectedService(null);
      success('Service dupliqué', 'Une copie du service a été créée');
    } catch (err) {
      console.error('Erreur duplication service:', err);
      showError('Erreur', 'Impossible de dupliquer le service');
    }
  };

  const handleDeleteService = async (serviceToDelete: any) => {
    if (!confirm(`Supprimer le service "${serviceToDelete.name}" ?`)) return;

    try {
      const { error: dbError } = await supabase
        .from('services_catalogue')
        .delete()
        .eq('id', serviceToDelete.id);

      if (dbError) throw dbError;

      await loadServices();
      success('Service supprimé', 'Le service a été retiré du catalogue');
    } catch (err) {
      console.error('Erreur suppression service:', err);
      showError('Erreur', 'Impossible de supprimer le service');
    }
  };

  const mockServices = [
    {
      id: 'SRV-001',
      name: 'Plomberie - Réparation fuite',
      category: 'Plomberie',
      description: 'Intervention rapide pour la réparation de fuite d\'eau (robinet, tuyauterie, raccord)',
      price: 85,
      unit: 'heure',
      duration: '1-2h',
      status: 'active',
      usageCount: 24
    },
    {
      id: 'SRV-002',
      name: 'Jardinage - Taille de haies',
      category: 'Jardinage',
      description: 'Taille professionnelle de haies et arbustes, évacuation des déchets verts incluse',
      price: 45,
      unit: 'mètre linéaire',
      duration: 'Variable',
      status: 'active',
      usageCount: 18
    },
    {
      id: 'SRV-003',
      name: 'Ménage - Nettoyage complet',
      category: 'Ménage',
      description: 'Nettoyage complet d\'un logement (sols, surfaces, sanitaires, cuisine)',
      price: 25,
      unit: 'heure',
      duration: '2-4h',
      status: 'active',
      usageCount: 42
    },
    {
      id: 'SRV-004',
      name: 'Électricité - Installation tableau',
      category: 'Électricité',
      description: 'Installation d\'un tableau électrique conforme aux normes en vigueur',
      price: 450,
      unit: 'forfait',
      duration: '4-6h',
      status: 'inactive',
      usageCount: 7
    },
    {
      id: 'SRV-005',
      name: 'Peinture - Pièce standard',
      category: 'Peinture',
      description: 'Peinture complète d\'une pièce (murs et plafond), fournitures incluses',
      price: 35,
      unit: 'm²',
      duration: '1-2 jours',
      status: 'active',
      usageCount: 15
    },
    {
      id: 'SRV-006',
      name: 'Bricolage - Montage meuble',
      category: 'Bricolage',
      description: 'Montage et assemblage de meubles en kit (IKEA, etc.)',
      price: 40,
      unit: 'meuble',
      duration: '30min-2h',
      status: 'active',
      usageCount: 31
    },
  ];

  const categories = ['Plomberie', 'Jardinage', 'Ménage', 'Électricité', 'Peinture', 'Bricolage'];

  const filteredServices = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || s.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <NotificationContainer />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Catalogue de services</h1>
        <p className="text-gray-600 mt-1">Gérez vos prestations et tarifs</p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm text-blue-800 mb-1">Total services</p>
            <p className="text-3xl font-bold text-blue-900">{services.length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-green-800 mb-1">Services actifs</p>
            <p className="text-3xl font-bold text-green-900">{services.filter(s => s.status === 'active').length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <p className="text-sm text-purple-800 mb-1">Catégories</p>
            <p className="text-3xl font-bold text-purple-900">{categories.length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <p className="text-sm text-orange-800 mb-1">Tarif moyen</p>
            <p className="text-3xl font-bold text-orange-900">
              {Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)} FCFA
            </p>
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
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Toutes catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button 
              variant="primary" 
              className="bg-orange-600 hover:bg-orange-700 w-full md:w-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau service
            </Button>
          </div>
        </Card>

        {/* Services List/Grid */}
        {filteredServices.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun service trouvé</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterCategory !== 'all' 
                ? 'Essayez de modifier vos critères de recherche' 
                : 'Commencez par créer votre premier service'}
            </p>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredServices.map((service) => (
              <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={service.status === 'active' ? 'success' : 'default'}>
                        {service.status === 'active' ? (
                          <><Eye className="w-3 h-3 mr-1" />Actif</>
                        ) : (
                          <><EyeOff className="w-3 h-3 mr-1" />Inactif</>
                        )}
                      </Badge>
                      <span className="text-xs text-gray-500">{service.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                    <Badge variant="default" className="bg-blue-100 text-blue-800 mb-3">
                      {service.category}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Tarif
                    </span>
                    <span className="font-bold text-orange-600">{service.price} FCFA / {service.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Durée
                    </span>
                    <span className="font-medium text-gray-900">{service.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      Utilisations
                    </span>
                    <span className="font-medium text-gray-900">{service.usageCount} fois</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedService(service);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedService(service);
                      setShowDuplicateModal(true);
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Dupliquer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50 flex-shrink-0"
                    onClick={() => handleDeleteService(service)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modales */}
        {showCreateModal && (
          <ServiceForm
            mode="create"
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateService}
          />
        )}

        {showEditModal && selectedService && (
          <ServiceForm
            mode="edit"
            service={selectedService}
            onClose={() => {
              setShowEditModal(false);
              setSelectedService(null);
            }}
            onSave={handleEditService}
          />
        )}

        {showDuplicateModal && selectedService && (
          <ServiceForm
            mode="duplicate"
            service={selectedService}
            onClose={() => {
              setShowDuplicateModal(false);
              setSelectedService(null);
            }}
            onSave={handleDuplicateService}
          />
        )}
    </div>
  );
}
