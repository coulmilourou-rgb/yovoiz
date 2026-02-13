'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
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
  category: string;
  description: string;
  commune: string;
  quartier: string;
  address_details: string;
  budget_min: string;
  budget_max: string;
  urgency: string;
  preferred_date?: string;
  images: File[];
}

export default function NouvelleMission() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    description: '',
    commune: '',
    quartier: '',
    address_details: '',
    budget_min: '',
    budget_max: '',
    urgency: '',
    images: [],
  });

  const updateField = (field: keyof FormData, value: string | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/connexion');
        return;
      }

      // Créer la mission
      const { data: mission, error } = await supabase
        .from('missions')
        .insert({
          client_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          commune: formData.commune,
          quartier: formData.quartier,
          address_details: formData.address_details,
          budget_min: parseInt(formData.budget_min),
          budget_max: parseInt(formData.budget_max),
          urgency: formData.urgency,
          preferred_date: formData.preferred_date,
          status: 'published',
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      // TODO: Upload des images si présentes
      
      router.push('/dashboard/client');
    } catch (error) {
      console.error('Erreur création demande:', error);
      alert('Erreur lors de la publication de la demande');
    } finally {
      setLoading(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return formData.category && formData.title;
      case 2:
        return formData.description.length >= 50;
      case 3:
        return formData.commune && formData.quartier;
      case 4:
        return formData.budget_min && formData.budget_max && parseInt(formData.budget_max) >= parseInt(formData.budget_min);
      case 5:
        return formData.urgency;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-yo-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-yo-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => step === 1 ? router.back() : setStep(step - 1)}
              className="flex items-center gap-2 text-yo-gray-700 hover:text-yo-orange transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="text-2xl">👷</div>
              <span className="font-display font-black text-xl">
                <span className="text-yo-orange">Yo!</span>{' '}
                <span className="text-yo-green-dark">Voiz</span>
              </span>
            </div>

            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-yo-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-yo-gray-900">
              Étape {step} sur 6
            </span>
            <span className="text-sm text-yo-gray-500">{Math.round((step / 6) * 100)}%</span>
          </div>
          <div className="w-full bg-yo-gray-200 rounded-full h-2">
            <motion.div
              className="bg-yo-orange rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1Category
              key="step1"
              formData={formData}
              updateField={updateField}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2Description
              key="step2"
              formData={formData}
              updateField={updateField}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <Step3Location
              key="step3"
              formData={formData}
              updateField={updateField}
              onNext={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <Step4Budget
              key="step4"
              formData={formData}
              updateField={updateField}
              onNext={() => setStep(5)}
            />
          )}
          {step === 5 && (
            <Step5Urgency
              key="step5"
              formData={formData}
              updateField={updateField}
              onNext={() => setStep(6)}
            />
          )}
          {step === 6 && (
            <Step6Recap
              key="step6"
              formData={formData}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 6 && (
          <div className="flex justify-end mt-8">
            <Button
              size="lg"
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="shadow-yo-lg"
            >
              Continuer
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function Step1Category({ formData, updateField, onNext }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="font-display font-bold text-3xl text-yo-gray-900 mb-2">
        De quel type de service as-tu besoin ?
      </h1>
      <p className="text-yo-gray-600 mb-8">
        Sélectionne la catégorie qui correspond le mieux à ta mission
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {CATEGORIES.map((cat) => (
          <Card
            key={cat.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-yo-lg ${
              formData.category === cat.id
                ? 'ring-2 ring-yo-orange bg-yo-orange/5'
                : 'hover:bg-yo-gray-50'
            }`}
            onClick={() => updateField('category', cat.id)}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{cat.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-yo-gray-900">{cat.label}</p>
              </div>
              {formData.category === cat.id && (
                <Check className="w-5 h-5 text-yo-orange" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {formData.category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block mb-2 font-semibold text-yo-gray-900">
            Donne un titre à ta mission
          </label>
          <Input
            type="text"
            placeholder="Ex: Réparation de fuite d'eau dans la cuisine"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="text-lg"
            maxLength={100}
          />
          <p className="text-sm text-yo-gray-500 mt-1">
            {formData.title.length}/100 caractères
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function Step2Description({ formData, updateField }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="font-display font-bold text-3xl text-yo-gray-900 mb-2">
        Décris ta mission en détail
      </h1>
      <p className="text-yo-gray-600 mb-8">
        Plus tu donnes de détails, meilleures seront les propositions que tu recevras
      </p>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold text-yo-gray-900">
            Description complète
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Explique ce que tu attends : matériel nécessaire, durée estimée, particularités..."
            className="w-full px-4 py-3 border border-yo-gray-300 rounded-yo-lg focus:ring-2 focus:ring-yo-orange focus:border-transparent resize-none"
            rows={8}
            maxLength={1000}
          />
          <div className="flex justify-between mt-1">
            <p className="text-sm text-yo-gray-500">
              Minimum 50 caractères
            </p>
            <p className="text-sm text-yo-gray-500">
              {formData.description.length}/1000
            </p>
          </div>
        </div>

        <Card className="p-4 bg-yo-green/5 border-yo-green/20">
          <h3 className="font-semibold text-yo-green-dark mb-2 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Conseils pour une bonne description
          </h3>
          <ul className="space-y-1 text-sm text-yo-gray-700">
            <li>• Précise le type de travail attendu</li>
            <li>• Indique si le matériel est fourni ou non</li>
            <li>• Mentionne les contraintes particulières (accès, horaires...)</li>
            <li>• Estime la durée du travail si possible</li>
          </ul>
        </Card>
      </div>
    </motion.div>
  );
}

function Step3Location({ formData, updateField }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="font-display font-bold text-3xl text-yo-gray-900 mb-2">
        Où se situe la mission ?
      </h1>
      <p className="text-yo-gray-600 mb-8">
        Ces informations permettront aux prestataires de ton secteur de te proposer leurs services
      </p>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold text-yo-gray-900">
            Commune
          </label>
          <select
            value={formData.commune}
            onChange={(e) => updateField('commune', e.target.value)}
            className="w-full px-4 py-3 border border-yo-gray-300 rounded-yo-lg focus:ring-2 focus:ring-yo-orange focus:border-transparent"
          >
            <option value="">Sélectionne ta commune</option>
            {COMMUNES.map((commune) => (
              <option key={commune} value={commune}>
                {commune}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-yo-gray-900">
            Quartier
          </label>
          <Input
            type="text"
            placeholder="Ex: Riviera Palmeraie, Zone 4..."
            value={formData.quartier}
            onChange={(e) => updateField('quartier', e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-yo-gray-900">
            Adresse précise (optionnel)
          </label>
          <Input
            type="text"
            placeholder="Ex: Derrière la pharmacie du marché..."
            value={formData.address_details}
            onChange={(e) => updateField('address_details', e.target.value)}
          />
          <p className="text-sm text-yo-gray-500 mt-1">
            Cette information sera partagée uniquement au prestataire retenu
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Step4Budget({ formData, updateField }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="font-display font-bold text-3xl text-yo-gray-900 mb-2">
        Quel est ton budget ?
      </h1>
      <p className="text-yo-gray-600 mb-8">
        Définis une fourchette de prix pour recevoir des propositions adaptées
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold text-yo-gray-900">
              Budget minimum
            </label>
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yo-gray-400" />
              <Input
                type="number"
                placeholder="5000"
                value={formData.budget_min}
                onChange={(e) => updateField('budget_min', e.target.value)}
                className="pl-10"
                min="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yo-gray-500 font-semibold">
                FCFA
              </span>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-yo-gray-900">
              Budget maximum
            </label>
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yo-gray-400" />
              <Input
                type="number"
                placeholder="15000"
                value={formData.budget_max}
                onChange={(e) => updateField('budget_max', e.target.value)}
                className="pl-10"
                min={formData.budget_min || "0"}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yo-gray-500 font-semibold">
                FCFA
              </span>
            </div>
          </div>
        </div>

        {formData.budget_min && formData.budget_max && (
          <Card className="p-4 bg-yo-orange/5 border-yo-orange/20">
            <div className="flex items-center justify-between">
              <span className="text-yo-gray-700">Fourchette de budget :</span>
              <span className="font-bold text-xl text-yo-orange">
                {parseInt(formData.budget_min).toLocaleString()} - {parseInt(formData.budget_max).toLocaleString()} FCFA
              </span>
            </div>
          </Card>
        )}

        <Card className="p-4 bg-yo-green/5 border-yo-green/20">
          <h3 className="font-semibold text-yo-green-dark mb-2 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Astuce
          </h3>
          <p className="text-sm text-yo-gray-700">
            Propose un budget réaliste pour attirer les meilleurs prestataires. Tu pourras négocier ensuite avec les propositions reçues.
          </p>
        </Card>
      </div>
    </motion.div>
  );
}

function Step5Urgency({ formData, updateField }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="font-display font-bold text-3xl text-yo-gray-900 mb-2">
        Quand as-tu besoin de ce service ?
      </h1>
      <p className="text-yo-gray-600 mb-8">
        Indique ton niveau d&apos;urgence pour que les prestataires sachent s&apos;ils peuvent répondre
      </p>

      <div className="space-y-4 mb-6">
        {URGENCE_OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-yo-lg ${
              formData.urgency === option.value
                ? 'ring-2 ring-yo-orange bg-yo-orange/5'
                : 'hover:bg-yo-gray-50'
            }`}
            onClick={() => updateField('urgency', option.value)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yo-orange" />
                <span className="font-semibold text-yo-gray-900">{option.label}</span>
              </div>
              {formData.urgency === option.value && (
                <Check className="w-5 h-5 text-yo-orange" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {formData.urgency && formData.urgency !== 'flexible' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block mb-2 font-semibold text-yo-gray-900">
            Date souhaitée (optionnel)
          </label>
          <Input
            type="date"
            value={formData.preferred_date || ''}
            onChange={(e) => updateField('preferred_date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

function Step6Recap({ formData, onSubmit, loading }: any) {
  const categoryLabel = CATEGORIES.find(c => c.id === formData.category)?.label;
  const urgencyLabel = URGENCE_OPTIONS.find(u => u.value === formData.urgency)?.label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="font-display font-bold text-3xl text-yo-gray-900 mb-2">
        Récapitulatif de ta demande
      </h1>
      <p className="text-yo-gray-600 mb-8">
        Vérifie les informations avant de publier ta demande
      </p>

      <div className="space-y-4 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold text-yo-gray-900 mb-4 text-lg">{formData.title}</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-yo-gray-500 min-w-24">Catégorie:</span>
              <span className="font-semibold text-yo-gray-900">{categoryLabel}</span>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="text-yo-gray-500 min-w-24">Description:</span>
              <span className="text-yo-gray-900">{formData.description}</span>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="text-yo-gray-500 min-w-24">Localisation:</span>
              <span className="text-yo-gray-900">
                {formData.quartier}, {formData.commune}
              </span>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="text-yo-gray-500 min-w-24">Budget:</span>
              <span className="font-semibold text-yo-orange">
                {parseInt(formData.budget_min).toLocaleString()} - {parseInt(formData.budget_max).toLocaleString()} FCFA
              </span>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="text-yo-gray-500 min-w-24">Urgence:</span>
              <span className="text-yo-gray-900">{urgencyLabel}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-yo-green/5 border-yo-green/20">
          <h3 className="font-semibold text-yo-green-dark mb-2 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Ce qui va se passer ensuite
          </h3>
          <ul className="space-y-1 text-sm text-yo-gray-700">
            <li>• Ta mission sera visible par les prestataires de ta zone</li>
            <li>• Tu recevras des propositions avec devis détaillé</li>
            <li>• Tu pourras choisir le prestataire qui te convient</li>
            <li>• Le paiement est sécurisé jusqu&apos;à validation du travail</li>
          </ul>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 shadow-yo-lg"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Publication en cours...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Publier ma demande
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
