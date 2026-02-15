'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Package, DollarSign } from 'lucide-react';

interface ServiceFormProps {
  service?: any;
  onClose: () => void;
  onSave: (data: any) => void;
  mode: 'create' | 'edit' | 'duplicate';
}

export default function ServiceForm({ service, onClose, onSave, mode }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    category: service?.category || '',
    description: service?.description || '',
    price: service?.price || '',
    unit: service?.unit || 'heure',
    duration: service?.duration || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      id: mode === 'duplicate' ? undefined : service?.id,
      status: service?.status || 'active',
      usageCount: mode === 'duplicate' ? 0 : service?.usageCount || 0,
    });
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Nouveau service';
      case 'edit': return 'Modifier le service';
      case 'duplicate': return 'Dupliquer le service';
      default: return 'Service';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white">
        <form onSubmit={handleSubmit}>
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{getTitle()}</h2>
              <p className="text-indigo-100 text-sm mt-1">
                {mode === 'duplicate' ? 'Créez une copie du service' : 'Configurez votre prestation'}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-full w-10 h-10 p-0 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Nom du service *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Plomberie - Réparation fuite"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Plomberie"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée estimée
                </label>
                <Input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Ex: 1-2h"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Prix *
                </label>
                <Input
                  type="number"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unité *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="heure">Par heure</option>
                  <option value="jour">Par jour</option>
                  <option value="forfait">Forfait</option>
                  <option value="m²">Par m²</option>
                  <option value="mètre linéaire">Par mètre linéaire</option>
                  <option value="unité">À l'unité</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Décrivez le service en détail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {mode === 'create' || mode === 'duplicate' ? 'Créer' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
