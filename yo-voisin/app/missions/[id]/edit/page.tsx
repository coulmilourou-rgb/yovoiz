'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar,
  Clock,
  Coins,
  Image as ImageIcon,
  X,
  ChevronRight,
  Check,
  Save
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ToastContainer } from '@/components/ui/Toast';
import { COMMUNES } from '@/lib/constants';

const CATEGORIES = [
  { id: 'menage', label: 'Ménage & Nettoyage', icon: '🧹' },
  { id: 'gouvernante', label: 'Gouvernante', icon: '👔' },
  { id: 'bricolage', label: 'Bricolage & Réparations', icon: '🔧' },
  { id: 'livraison', label: 'Livraison & Courses', icon: '📦' },
  { id: 'reparation', label: 'Réparation Électronique', icon: '⚡' },
  { id: 'manutention', label: 'Manutention & Déménagement', icon: '📦' },
  { id: 'jardinage', label: 'Jardinage', icon: '🌱' },
  { id: 'couture', label: 'Couture & Retouches', icon: '✂️' },
  { id: 'cours', label: 'Cours Particuliers', icon: '📚' },
  { id: 'cuisine', label: 'Cuisine & Traiteur', icon: '👨‍🍳' },
  { id: 'evenementiel', label: 'Événementiel', icon: '🎉' },
  { id: 'informatique', label: 'Dépannage Informatique', icon: '💻' },
  { id: 'beaute', label: 'Beauté & Coiffure', icon: '💇' },
  { id: 'auto', label: 'Mécanique Auto', icon: '🚗' },
  { id: 'garde', label: 'Garde d\'enfants', icon: '👶' },
];

const URGENCE_OPTIONS = [
  { id: 'immediate', label: 'Immédiat (aujourd\'hui)', value: 'immediate' },
  { id: 'this_week', label: 'Cette semaine', value: 'this_week' },
  { id: 'this_month', label: 'Ce mois-ci', value: 'this_month' },
  { id: 'flexible', label: 'Flexible', value: 'flexible' },
];

interface FormData {
  title: string;
  category_id: string;
  description: string;
  commune: string;
  quartier: string;
  address: string;
  budget_min: string;
  budget_max: string;
  is_urgent: boolean;
  preferred_date?: string;
}

export default function EditMission() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const requestId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [request, setRequest] = useState<any>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' }>>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category_id: '',
    description: '',
    commune: '',
    quartier: '',
    address: '',
    budget_min: '',
    budget_max: '',
    is_urgent: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    if (requestId && user) {
      loadRequest();
    }
  }, [requestId, user]);

  const loadRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .eq('requester_id', user?.id) // Vérifier que c'est bien la demande de l'utilisateur
        .single();

      if (error) throw error;

      if (data) {
        setRequest(data);
        setFormData({
          title: data.title || '',
          category_id: data.category_id || '',
          description: data.description || '',
          commune: data.commune || '',
          quartier: data.quartier || '',
          address: data.address || '',
          budget_min: data.budget_min?.toString() || '',
          budget_max: data.budget_max?.toString() || '',
          is_urgent: data.is_urgent || false,
          preferred_date: data.preferred_date || '',
        });
      }
    } catch (error) {
      console.error('Erreur chargement demande:', error);
      alert('Impossible de charger cette demande');
      router.push('/profile/requests');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) {
      showToast('Le titre est requis', 'warning');
      return;
    }
    if (!formData.category_id) {
      showToast('La catégorie est requise', 'warning');
      return;
    }
    if (!formData.description.trim()) {
      showToast('La description est requise', 'warning');
      return;
    }
    if (!formData.commune) {
      showToast('La commune est requise', 'warning');
      return;
    }

    setSaving(true);

    try {
      const updateData: any = {
        title: formData.title.trim(),
        category_id: formData.category_id,
        description: formData.description.trim(),
        commune: formData.commune,
        quartier: formData.quartier.trim(),
        address: formData.address.trim(),
        is_urgent: formData.is_urgent,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        preferred_date: formData.preferred_date || null,
      };

      const { error } = await supabase
        .from('requests')
        .update(updateData)
        .eq('id', requestId)
        .eq('requester_id', user?.id);

      if (error) throw error;

      showToast('Demande modifiée avec succès !', 'success');
      
      // Rediriger après un court délai pour laisser l'utilisateur voir le toast
      setTimeout(() => {
        router.push('/profile/requests');
      }, 1500);
    } catch (error: any) {
      console.error('Erreur modification:', error);
      showToast(`Erreur lors de la modification: ${error.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center max-w-md">
          <p className="text-gray-600 mb-4">Demande introuvable</p>
          <Button onClick={() => router.push('/profile/requests')}>
            Retour à mes demandes
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/profile/requests')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Modifier ma demande</h1>
              <p className="text-sm text-gray-500">Mise à jour de votre demande de service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la demande *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Ex: Besoin d'un plombier pour réparer une fuite"
              maxLength={100}
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Catégorie de service *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateField('category_id', cat.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.category_id === cat.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description détaillée *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Décrivez votre besoin en détail..."
            />
          </div>

          {/* Localisation */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commune *
              </label>
              <select
                value={formData.commune}
                onChange={(e) => updateField('commune', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Sélectionner</option>
                {COMMUNES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quartier
              </label>
              <Input
                value={formData.quartier}
                onChange={(e) => updateField('quartier', e.target.value)}
                placeholder="Ex: Ananeraie"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse complète
            </label>
            <Input
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Ex: Rue 12, lot 45"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Budget estimé (FCFA)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                <Input
                  type="number"
                  value={formData.budget_min}
                  onChange={(e) => updateField('budget_min', e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                <Input
                  type="number"
                  value={formData.budget_max}
                  onChange={(e) => updateField('budget_max', e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Urgence */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.is_urgent}
                  onChange={(e) => updateField('is_urgent', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">Demande urgente</span>
                <p className="text-xs text-gray-500">Cette demande nécessite une intervention rapide</p>
              </div>
            </label>
          </div>

          {/* Date préférée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date préférée (optionnel)
            </label>
            <Input
              type="date"
              value={formData.preferred_date}
              onChange={(e) => updateField('preferred_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => router.push('/profile/requests')}
              disabled={saving}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
