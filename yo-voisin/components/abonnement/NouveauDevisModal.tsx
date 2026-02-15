'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Send } from 'lucide-react';
import { formatCurrency, calculateTVA, generateId } from '@/lib/formatters';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { generateDevisPDF } from '@/lib/pdf-generator';

interface ServiceLine {
  description: string;
  quantity: number;
  unit_price: number;
}

interface NouveauDevisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (devis: any) => void;
}

export default function NouveauDevisModal({ isOpen, onClose, onSuccess }: NouveauDevisModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    client_id: '',
    services: [{ description: '', quantity: 1, unit_price: 0 }] as ServiceLine[],
    tva_applicable: true,
    notes: '',
    date_validite: '',
  });

  // Charger les clients du pro
  useEffect(() => {
    if (isOpen && user) {
      loadClients();
      // Définir date de validité par défaut (30 jours)
      const dateValidite = new Date();
      dateValidite.setDate(dateValidite.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        date_validite: dateValidite.toISOString().split('T')[0],
      }));
    }
  }, [isOpen, user]);

  const loadClients = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, prenom, nom, email')
      .eq('type_compte', 'client')
      .order('nom');

    if (!error && data) {
      setClients(data);
    }
  };

  const addServiceLine = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { description: '', quantity: 1, unit_price: 0 }],
    });
  };

  const removeServiceLine = (index: number) => {
    if (formData.services.length > 1) {
      setFormData({
        ...formData,
        services: formData.services.filter((_, i) => i !== index),
      });
    }
  };

  const updateServiceLine = (index: number, field: keyof ServiceLine, value: any) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value,
    };
    setFormData({ ...formData, services: updatedServices });
  };

  // Calcul des totaux
  const calculateTotals = () => {
    const totalHT = formData.services.reduce(
      (sum, service) => sum + service.quantity * service.unit_price,
      0
    );
    const tva = formData.tva_applicable ? calculateTVA(totalHT) : 0;
    const totalTTC = totalHT + tva;

    return { totalHT, tva, totalTTC };
  };

  const { totalHT, tva, totalTTC } = calculateTotals();

  const handleSubmit = async (sendPDF: boolean = false) => {
    if (!user || !formData.client_id || formData.services.some(s => !s.description)) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      // Générer numéro de devis
      const numeroDevis = generateId('DEV');
      const dateEmission = new Date().toISOString();

      // Créer le devis
      const { data: devis, error } = await supabase
        .from('devis')
        .insert({
          numero_devis: numeroDevis,
          pro_id: user.id,
          client_id: formData.client_id,
          date_emission: dateEmission,
          date_validite: formData.date_validite,
          services: formData.services,
          total_ht: totalHT,
          tva: tva,
          total_ttc: totalTTC,
          tva_applicable: formData.tva_applicable,
          notes: formData.notes,
          statut: 'brouillon',
        })
        .select()
        .single();

      if (error) throw error;

      // Générer et télécharger PDF si demandé
      if (sendPDF) {
        const { data: clientData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', formData.client_id)
          .single();

        const { data: proData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const pdfBlob = await generateDevisPDF({
          ...devis,
          client: clientData,
          pro: proData,
        });

        // Télécharger le PDF
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${numeroDevis}.pdf`;
        a.click();
        URL.revokeObjectURL(url);

        // Mettre à jour le statut
        await supabase
          .from('devis')
          .update({ statut: 'envoye' })
          .eq('id', devis.id);
      }

      onSuccess(devis);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erreur création devis:', error);
      alert('Erreur lors de la création du devis');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      services: [{ description: '', quantity: 1, unit_price: 0 }],
      tva_applicable: true,
      notes: '',
      date_validite: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Nouveau Devis</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client *
              </label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.prenom} {client.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de validité *
              </label>
              <input
                type="date"
                value={formData.date_validite}
                onChange={(e) => setFormData({ ...formData, date_validite: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Lignes de services */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Services *
              </label>
              <button
                onClick={addServiceLine}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Plus size={16} />
                Ajouter une ligne
              </button>
            </div>

            <div className="space-y-3">
              {formData.services.map((service, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <input
                    type="text"
                    placeholder="Description du service"
                    value={service.description}
                    onChange={(e) => updateServiceLine(index, 'description', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Qté"
                    min="1"
                    value={service.quantity}
                    onChange={(e) => updateServiceLine(index, 'quantity', parseFloat(e.target.value) || 1)}
                    className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Prix unitaire"
                    min="0"
                    value={service.unit_price}
                    onChange={(e) => updateServiceLine(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="w-32 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-right font-medium">
                    {formatCurrency(service.quantity * service.unit_price)}
                  </div>
                  {formData.services.length > 1 && (
                    <button
                      onClick={() => removeServiceLine(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TVA */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="tva"
              checked={formData.tva_applicable}
              onChange={(e) => setFormData({ ...formData, tva_applicable: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="tva" className="text-sm font-medium text-gray-700">
              Appliquer la TVA (18%)
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes / Conditions particulières
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ajoutez des notes ou conditions..."
            />
          </div>

          {/* Totaux */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total HT:</span>
              <span className="font-medium">{formatCurrency(totalHT)}</span>
            </div>
            {formData.tva_applicable && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVA (18%):</span>
                <span className="font-medium">{formatCurrency(tva)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span>Total TTC:</span>
              <span className="text-blue-600">{formatCurrency(totalTTC)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Sauvegarder'}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={18} />
            {loading ? 'Génération...' : 'Sauvegarder et envoyer PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
