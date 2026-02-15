'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Check, Save,
  X, Plus, DollarSign, MapPin, Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ServiceData {
  category: string;
  title: string;
  description: string;
  pricing_type: 'hourly' | 'fixed';
  price_hourly?: number;
  price_fixed_min?: number;
  price_fixed_max?: number;
  communes: string[];
  quartiers: string[];
  available_days: string[];
  available_hours_start: string;
  available_hours_end: string;
}

export default function EditOffrePage() {
  const router = useRouter();
  const params = useParams();
  const offerId = params?.id as string;
  const { user, profile, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOffer, setLoadingOffer] = useState(true);
  
  const [formData, setFormData] = useState<ServiceData>({
    category: '',
    title: '',
    description: '',
    pricing_type: 'hourly',
    communes: [],
    quartiers: [],
    available_days: [],
    available_hours_start: '08:00',
    available_hours_end: '18:00',
  });

  const categories = [
    'Plomberie', 'Électricité', 'Ménage', 'Jardinage', 
    'Déménagement', 'Peinture', 'Réparation', 'Cours particuliers',
    'Informatique', 'Coiffure', 'Livraison', 'Autre'
  ];

  const communes = [
    'Abobo', 'Adjamé', 'Anyama', 'Attécoubé', 'Bingerville',
    'Brofodoumé', 'Cocody', 'Koumassi', 'Marcory', 'Plateau',
    'Port-Bouët', 'Songon', 'Treichville', 'Yopougon'
  ];

  const days = [
    { id: 'lundi', label: 'Lun' },
    { id: 'mardi', label: 'Mar' },
    { id: 'mercredi', label: 'Mer' },
    { id: 'jeudi', label: 'Jeu' },
    { id: 'vendredi', label: 'Ven' },
    { id: 'samedi', label: 'Sam' },
    { id: 'dimanche', label: 'Dim' }
  ];

  const steps = [
    { number: 1, title: 'Informations', icon: '📝' },
    { number: 2, title: 'Tarifs & Zones', icon: '💰' },
    { number: 3, title: 'Disponibilités', icon: '📅' }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/connexion');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && offerId) {
      loadOffer();
    }
  }, [user, offerId]);

  const loadOffer = async () => {
    try {
      const { data, error } = await supabase
        .from('service_offers')
        .select('*')
        .eq('id', offerId)
        .eq('provider_id', user!.id) // Vérifier que c'est bien l'offre de l'utilisateur
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          category: data.category || '',
          title: data.title || '',
          description: data.description || '',
          pricing_type: data.pricing_type || 'hourly',
          price_hourly: data.price_hourly,
          price_fixed_min: data.price_fixed_min,
          price_fixed_max: data.price_fixed_max,
          communes: data.communes || [],
          quartiers: data.quartiers || [],
          available_days: data.available_days || [],
          available_hours_start: data.available_hours_start || '08:00',
          available_hours_end: data.available_hours_end || '18:00',
        });
      }
    } catch (error) {
      console.error('Erreur chargement offre:', error);
      alert('Impossible de charger cette offre');
      router.push('/services/mes-offres');
    } finally {
      setLoadingOffer(false);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.category || !formData.title || !formData.description) {
          alert('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        return true;
      case 2:
        if (formData.pricing_type === 'hourly' && !formData.price_hourly) {
          alert('Veuillez indiquer votre tarif horaire');
          return false;
        }
        if (formData.pricing_type === 'fixed' && (!formData.price_fixed_min || !formData.price_fixed_max)) {
          alert('Veuillez indiquer votre fourchette de prix');
          return false;
        }
        if (formData.communes.length === 0) {
          alert('Veuillez sélectionner au moins une commune');
          return false;
        }
        return true;
      case 3:
        if (formData.available_days.length === 0) {
          alert('Veuillez sélectionner au moins un jour');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!user || !profile) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('service_offers')
        .update({
          category: formData.category,
          title: formData.title,
          description: formData.description,
          pricing_type: formData.pricing_type,
          price_hourly: formData.price_hourly,
          price_fixed_min: formData.price_fixed_min,
          price_fixed_max: formData.price_fixed_max,
          communes: formData.communes,
          quartiers: formData.quartiers,
          available_days: formData.available_days,
          available_hours_start: formData.available_hours_start,
          available_hours_end: formData.available_hours_end,
        })
        .eq('id', offerId)
        .eq('provider_id', user.id);

      if (error) throw error;

      alert('✅ Offre modifiée avec succès !');
      router.push('/services/mes-offres');
    } catch (error: any) {
      console.error('Erreur:', error);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCommune = (commune: string) => {
    setFormData(prev => ({
      ...prev,
      communes: prev.communes.includes(commune)
        ? prev.communes.filter(c => c !== commune)
        : [...prev.communes, commune]
    }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter(d => d !== day)
        : [...prev.available_days, day]
    }));
  };

  if (loading || loadingOffer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/services/mes-offres')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à mes offres
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Modifier mon offre de service</h1>
          <p className="text-gray-600 mt-2">Mettez à jour les informations de votre offre</p>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.number ? <Check className="w-6 h-6" /> : step.icon}
                  </div>
                  <p className="text-xs font-medium text-gray-600 mt-2">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-4 rounded ${
                    currentStep > step.number ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <Card className="p-6">
          <AnimatePresence mode="wait">
            {/* Étape 1: Informations */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie de service *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.category === cat
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-900">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de votre offre *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Plombier expérimenté disponible"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    placeholder="Décrivez votre service, vos compétences, votre expérience..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </motion.div>
            )}

            {/* Étape 2: Tarifs & Zones */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Type de tarification *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, pricing_type: 'hourly' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.pricing_type === 'hourly'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                      <p className="font-medium">Tarif horaire</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, pricing_type: 'fixed' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.pricing_type === 'fixed'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <DollarSign className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                      <p className="font-medium">Prix fixe</p>
                    </button>
                  </div>
                </div>

                {formData.pricing_type === 'hourly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarif horaire (FCFA) *
                    </label>
                    <input
                      type="number"
                      value={formData.price_hourly || ''}
                      onChange={(e) => setFormData({ ...formData, price_hourly: parseFloat(e.target.value) })}
                      placeholder="Ex: 3000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="0"
                    />
                  </div>
                )}

                {formData.pricing_type === 'fixed' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix minimum (FCFA) *
                      </label>
                      <input
                        type="number"
                        value={formData.price_fixed_min || ''}
                        onChange={(e) => setFormData({ ...formData, price_fixed_min: parseFloat(e.target.value) })}
                        placeholder="Ex: 5000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix maximum (FCFA) *
                      </label>
                      <input
                        type="number"
                        value={formData.price_fixed_max || ''}
                        onChange={(e) => setFormData({ ...formData, price_fixed_max: parseFloat(e.target.value) })}
                        placeholder="Ex: 15000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        min="0"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Zones d'intervention *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {communes.map(commune => (
                      <button
                        key={commune}
                        type="button"
                        onClick={() => toggleCommune(commune)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm ${
                          formData.communes.includes(commune)
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        {commune}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.communes.length} commune(s) sélectionnée(s)
                  </p>
                </div>
              </motion.div>
            )}

            {/* Étape 3: Disponibilités */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Jours de disponibilité *
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {days.map(day => (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleDay(day.id)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                          formData.available_days.includes(day.id)
                            ? 'border-orange-500 bg-orange-500 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de début
                    </label>
                    <input
                      type="time"
                      value={formData.available_hours_start}
                      onChange={(e) => setFormData({ ...formData, available_hours_start: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de fin
                    </label>
                    <input
                      type="time"
                      value={formData.available_hours_end}
                      onChange={(e) => setFormData({ ...formData, available_hours_end: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
            )}
            
            <div className="flex-1" />

            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
