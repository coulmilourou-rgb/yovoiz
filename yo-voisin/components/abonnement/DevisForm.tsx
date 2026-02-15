'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  X, Plus, Trash2, DollarSign, FileText, 
  User, Mail, Phone, MapPin, Calendar 
} from 'lucide-react';

interface DevisFormProps {
  devis?: any;
  onClose: () => void;
  onSave: (data: any) => void;
  mode: 'create' | 'edit';
}

export default function DevisForm({ devis, onClose, onSave, mode }: DevisFormProps) {
  const [formData, setFormData] = useState({
    clientName: devis?.client_name || devis?.client || '',
    clientEmail: devis?.client_email || devis?.clientEmail || '',
    clientPhone: devis?.client_phone || devis?.clientPhone || '',
    clientAddress: devis?.client_address || devis?.clientAddress || '',
    devisNumber: devis?.id || `DEV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: devis?.issue_date || devis?.date || new Date().toISOString().split('T')[0],
    validUntil: devis?.expiry_date || devis?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    services: devis?.items || devis?.services || [],
    notes: devis?.notes || '',
  });

  // Mettre à jour le formData quand le devis change (mode édition)
  useEffect(() => {
    if (devis && mode === 'edit') {
      console.log('🔄 Chargement du devis pour édition:', devis);
      setFormData({
        clientName: devis.client_name || devis.client || '',
        clientEmail: devis.client_email || devis.clientEmail || '',
        clientPhone: devis.client_phone || devis.clientPhone || '',
        clientAddress: devis.client_address || devis.clientAddress || '',
        devisNumber: devis.id || devis.devisNumber || '',
        date: devis.issue_date || devis.date || new Date().toISOString().split('T')[0],
        validUntil: devis.expiry_date || devis.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        services: devis.items || devis.services || [],
        notes: devis.notes || '',
      });
      console.log('✅ Formulaire chargé avec les données:', {
        client: devis.client_name || devis.client,
        email: devis.client_email || devis.clientEmail,
        phone: devis.client_phone || devis.clientPhone,
        services: devis.items || devis.services
      });
    }
  }, [devis, mode]);

  const [currentService, setCurrentService] = useState({
    description: '',
    quantity: 1,
    unitPrice: '',
  });

  const addService = () => {
    const price = Number(currentService.unitPrice);
    if (currentService.description && price > 0) {
      setFormData({
        ...formData,
        services: [...formData.services, { 
          ...currentService, 
          unitPrice: price,
          total: currentService.quantity * price 
        }]
      });
      setCurrentService({ description: '', quantity: 1, unitPrice: '' });
    }
  };

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_: any, i: number) => i !== index)
    });
  };

  const calculateTotal = () => {
    return formData.services.reduce((sum: number, service: any) => sum + service.total, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();
    
    // Préparer les données pour l'envoi
    const submitData = {
      ...formData,
      items: formData.services, // Renommer services -> items pour la base
      amount: total,
      status: devis?.status || 'draft'
    };
    
    console.log('📤 Envoi du formulaire devis:', submitData);
    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'create' ? 'Nouveau devis' : 'Modifier le devis'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Remplissez les informations du devis pour votre client
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-full w-10 h-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Informations client */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                Informations client
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du client *
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Ex: Marie Dubois"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="marie.dubois@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <Input
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder="+225 XX XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <Input
                    type="text"
                    value={formData.clientAddress}
                    onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                    placeholder="Adresse du client"
                  />
                </div>
              </div>
            </div>

            {/* Informations devis */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Informations du devis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    N° de devis
                  </label>
                  <Input
                    type="text"
                    value={formData.devisNumber}
                    onChange={(e) => setFormData({ ...formData, devisNumber: e.target.value })}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'émission *
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valable jusqu'au *
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Services / Prestations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Prestations
              </h3>

              {/* Liste des services ajoutés */}
              {formData.services.length > 0 && (
                <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Qté</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">P.U.</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.services.map((service: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{service.description}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-900">{service.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{service.unitPrice} FCFA</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{service.total} FCFA</td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeService(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-orange-50 font-semibold">
                        <td colSpan={3} className="px-4 py-3 text-right text-gray-900">Total HT</td>
                        <td className="px-4 py-3 text-right text-orange-700 text-lg">{calculateTotal()} FCFA</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Formulaire d'ajout de service */}
              <Card className="p-4 bg-gray-50 border-2 border-dashed border-gray-300">
                <p className="text-sm font-medium text-gray-700 mb-3">Ajouter une prestation</p>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5">
                    <Input
                      type="text"
                      placeholder="Description du service"
                      value={currentService.description}
                      onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qté"
                      value={currentService.quantity}
                      onChange={(e) => setCurrentService({ ...currentService, quantity: Number(e.target.value) })}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      placeholder="Prix unitaire (FCFA)"
                      value={currentService.unitPrice}
                      onChange={(e) => setCurrentService({ ...currentService, unitPrice: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button
                      type="button"
                      onClick={addService}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      disabled={!currentService.description || !currentService.unitPrice || Number(currentService.unitPrice) <= 0}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes / Conditions (optionnel)
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Conditions de paiement, délais, remarques particulières..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Total du devis: <span className="font-bold text-orange-700 text-lg">{calculateTotal()} FCFA</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={formData.services.length === 0}
              >
                {mode === 'create' ? 'Créer le devis' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
