'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Check, Upload, 
  X, Plus, DollarSign, MapPin, Clock, Calendar
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
  photos: File[];
}

export default function NouvelleOffrePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    photos: []
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
    { number: 3, title: 'Disponibilités', icon: '📅' },
    { number: 4, title: 'Portfolio', icon: '📸' }
  ];

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
      // TODO: Upload photos vers Supabase Storage
      const photoUrls: string[] = [];

      // Créer l'offre
      const { data, error } = await supabase
        .from('service_offers')
        .insert({
          provider_id: user.id,
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
          photos: photoUrls,
          status: 'pending' // En attente de validation admin
        })
        .select()
        .single();

      if (error) throw error;

      router.push('/demande-envoyee?type=offre');
    } catch (error: any) {
      console.error('Erreur création offre:', error);
      alert('❌ Erreur: ' + error.message);
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos].slice(0, 5) // Max 5 photos
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <Navbar 
        isConnected={true} 
        user={{
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          avatar_url: profile?.avatar_url
        }}
      />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-yo-gray-600 hover:text-yo-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <h1 className="font-display font-extrabold text-4xl text-yo-green-dark mb-2">
            Créer une offre de service
          </h1>
          <p className="text-yo-gray-600">
            Définissez votre service pour recevoir des demandes de clients
          </p>
        </div>

        {/* Steps indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition ${
                    currentStep >= step.number
                      ? 'bg-yo-green text-white'
                      : 'bg-yo-gray-200 text-yo-gray-500'
                  }`}>
                    {currentStep > step.number ? <Check className="w-6 h-6" /> : step.icon}
                  </div>
                  <span className="text-xs font-medium text-yo-gray-600 mt-2 text-center">
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.number ? 'bg-yo-green' : 'bg-yo-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <Card className="p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Informations */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-lg border-2 border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                    Titre de votre service *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Plomberie rapide et fiable"
                    className="w-full px-4 py-3 bg-white rounded-lg border-2 border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez votre service, votre expérience, vos compétences..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white rounded-lg border-2 border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent resize-none"
                    required
                  />
                  <p className="text-xs text-yo-gray-500 mt-1">
                    {formData.description.length}/500 caractères
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Tarifs & Zones */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-3">
                    Type de tarification *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, pricing_type: 'hourly' })}
                      className={`p-4 rounded-lg border-2 transition ${
                        formData.pricing_type === 'hourly'
                          ? 'border-yo-green bg-yo-green/5'
                          : 'border-yo-gray-200 hover:border-yo-gray-300'
                      }`}
                    >
                      <Clock className="w-6 h-6 mx-auto mb-2 text-yo-green" />
                      <p className="font-semibold text-yo-gray-900">Tarif horaire</p>
                      <p className="text-xs text-yo-gray-600 mt-1">Prix par heure de travail</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, pricing_type: 'fixed' })}
                      className={`p-4 rounded-lg border-2 transition ${
                        formData.pricing_type === 'fixed'
                          ? 'border-yo-green bg-yo-green/5'
                          : 'border-yo-gray-200 hover:border-yo-gray-300'
                      }`}
                    >
                      <DollarSign className="w-6 h-6 mx-auto mb-2 text-yo-green" />
                      <p className="font-semibold text-yo-gray-900">Forfait</p>
                      <p className="text-xs text-yo-gray-600 mt-1">Fourchette de prix fixe</p>
                    </button>
                  </div>
                </div>

                {formData.pricing_type === 'hourly' ? (
                  <div>
                    <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                      Tarif horaire (FCFA) *
                    </label>
                    <input
                      type="number"
                      value={formData.price_hourly || ''}
                      onChange={(e) => setFormData({ ...formData, price_hourly: parseInt(e.target.value) })}
                      placeholder="2000"
                      className="w-full px-4 py-3 bg-white rounded-lg border-2 border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                        Prix minimum (FCFA) *
                      </label>
                      <input
                        type="number"
                        value={formData.price_fixed_min || ''}
                        onChange={(e) => setFormData({ ...formData, price_fixed_min: parseInt(e.target.value) })}
                        placeholder="5000"
                        className="w-full px-4 py-3 bg-white rounded-lg border-2 border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                        Prix maximum (FCFA) *
                      </label>
                      <input
                        type="number"
                        value={formData.price_fixed_max || ''}
                        onChange={(e) => setFormData({ ...formData, price_fixed_max: parseInt(e.target.value) })}
                        placeholder="15000"
                        className="w-full px-4 py-3 bg-white rounded-lg border-2 border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-3">
                    Zones d'intervention * <span className="text-xs text-yo-gray-500">({formData.communes.length} sélectionnée{formData.communes.length > 1 ? 's' : ''})</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {communes.map((commune) => (
                      <button
                        key={commune}
                        type="button"
                        onClick={() => toggleCommune(commune)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          formData.communes.includes(commune)
                            ? 'bg-yo-green text-white'
                            : 'bg-yo-gray-100 text-yo-gray-700 hover:bg-yo-gray-200'
                        }`}
                      >
                        {commune}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Disponibilités */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-3">
                    Jours disponibles * <span className="text-xs text-yo-gray-500">({formData.available_days.length} jour{formData.available_days.length > 1 ? 's' : ''})</span>
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleDay(day.id)}
                        className={`p-3 rounded-lg text-sm font-semibold transition ${
                          formData.available_days.includes(day.id)
                            ? 'bg-yo-green text-white'
                            : 'bg-yo-gray-100 text-yo-gray-700 hover:bg-yo-gray-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                      Heure de début
                    </label>
                    <input
                      type="time"
                      value={formData.available_hours_start}
                      onChange={(e) => setFormData({ ...formData, available_hours_start: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-lg border-2 border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yo-gray-700 mb-2">
                      Heure de fin
                    </label>
                    <input
                      type="time"
                      value={formData.available_hours_end}
                      onChange={(e) => setFormData({ ...formData, available_hours_end: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-lg border-2 border-yo-gray-200 focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Portfolio */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-yo-gray-700 mb-3">
                    Photos de vos réalisations (optionnel)
                  </label>
                  <p className="text-sm text-yo-gray-600 mb-4">
                    Ajoutez jusqu'à 5 photos pour montrer votre travail (max 2MB chacune)
                  </p>

                  {/* Upload zone */}
                  <label className="block w-full p-8 border-2 border-dashed border-yo-gray-300 rounded-lg hover:border-yo-green transition cursor-pointer text-center">
                    <Upload className="w-12 h-12 text-yo-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-yo-gray-700 mb-1">
                      Cliquez pour ajouter des photos
                    </p>
                    <p className="text-xs text-yo-gray-500">
                      PNG, JPG jusqu'à 2MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoChange}
                      className="hidden"
                      disabled={formData.photos.length >= 5}
                    />
                  </label>

                  {/* Preview photos */}
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {formData.photos.map((photo, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-yo-gray-200">
            {currentStep > 1 ? (
              <Button
                variant="secondary"
                onClick={handlePrev}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Précédent
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Suivant
                <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-yo-green hover:bg-yo-green-dark"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Création...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Créer l'offre
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
