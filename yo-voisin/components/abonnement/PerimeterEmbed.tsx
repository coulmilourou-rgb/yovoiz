'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Loader2, Save, ChevronDown, Check,
  Calendar, Info, Plus, X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const CATEGORIES = [
  'Bricolage',
  'Plomberie',
  'Électricité',
  'Jardinage',
  'Ménage',
  'Déménagement',
  'Livraison',
  'Aide administrative',
  'Informatique',
  'Cours particuliers',
  'Garde d\'enfants',
  'Soins à domicile',
  'Mécanique auto',
  'Peinture',
  'Menuiserie',
];

const COMMUNES_ABIDJAN = [
  'Abobo', 'Adjamé', 'Attécoubé', 'Cocody', 'Koumassi',
  'Marcory', 'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon',
  'Bingerville', 'Anyama', 'Songon',
];

const JOURS_SEMAINE = [
  { id: 'lundi', label: 'Lun' },
  { id: 'mardi', label: 'Mar' },
  { id: 'mercredi', label: 'Mer' },
  { id: 'jeudi', label: 'Jeu' },
  { id: 'vendredi', label: 'Ven' },
  { id: 'samedi', label: 'Sam' },
  { id: 'dimanche', label: 'Dim' },
];

const PLAGES_HORAIRES = [
  { id: 'morning', label: 'Matin (6h-12h)', hours: '6h-12h' },
  { id: 'afternoon', label: 'Après-midi (12h-18h)', hours: '12h-18h' },
  { id: 'evening', label: 'Soir (18h-22h)', hours: '18h-22h' },
];

export default function PerimeterEmbed() {
  const { user, profile } = useAuth();
  
  const [saving, setSaving] = useState(false);
  const [communesSelectionnees, setCommunesSelectionnees] = useState<string[]>([]);
  const [categoriesSelectionnees, setCategoriesSelectionnees] = useState<string[]>([]);
  const [rayonIntervention, setRayonIntervention] = useState(5);
  const [joursDisponibles, setJoursDisponibles] = useState<string[]>([]);
  const [horairesDisponibles, setHorairesDisponibles] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      loadPerimeterData();
    }
  }, [profile]);

  const loadPerimeterData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('service_zones, categories, availability_hours')
        .eq('id', profile?.id)
        .single();

      if (error) {
        console.error('Erreur chargement périmètre:', error);
        return;
      }

      if (data) {
        setCommunesSelectionnees(data.service_zones || []);
        setCategoriesSelectionnees(data.categories || []);
      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };

  const toggleCommune = (commune: string) => {
    setCommunesSelectionnees((prev) =>
      prev.includes(commune)
        ? prev.filter((c) => c !== commune)
        : [...prev, commune]
    );
  };

  const toggleCategorie = (categorie: string) => {
    setCategoriesSelectionnees((prev) =>
      prev.includes(categorie)
        ? prev.filter((c) => c !== categorie)
        : [...prev, categorie]
    );
  };

  const toggleJour = (jour: string) => {
    setJoursDisponibles((prev) =>
      prev.includes(jour)
        ? prev.filter((j) => j !== jour)
        : [...prev, jour]
    );
  };

  const toggleHoraire = (horaire: string) => {
    setHorairesDisponibles((prev) =>
      prev.includes(horaire)
        ? prev.filter((h) => h !== horaire)
        : [...prev, horaire]
    );
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          service_zones: communesSelectionnees,
          categories: categoriesSelectionnees,
          availability_hours: {
            jours: joursDisponibles,
            horaires: horairesDisponibles,
          },
        })
        .eq('id', profile.id);

      if (error) throw error;

      alert('Périmètre mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-yo-gray-900 mb-2">
          Gérer mon périmètre d'intervention
        </h1>
        <p className="text-yo-gray-600">
          Définissez les zones géographiques, catégories de services et disponibilités
        </p>
      </div>

      {/* Section Zones géographiques */}
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-yo-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-yo-orange" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl text-yo-gray-900 mb-1">
              Zones d'intervention
            </h2>
            <p className="text-yo-gray-600 text-sm">
              Sélectionnez les communes où vous proposez vos services
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {COMMUNES_ABIDJAN.map((commune) => (
            <button
              key={commune}
              onClick={() => toggleCommune(commune)}
              className={`
                relative px-4 py-3 rounded-lg border-2 transition-all text-left
                ${
                  communesSelectionnees.includes(commune)
                    ? 'border-yo-orange bg-yo-orange/10 text-yo-orange font-medium'
                    : 'border-yo-gray-200 bg-white text-yo-gray-700 hover:border-yo-orange/50'
                }
              `}
            >
              <span className="block">{commune}</span>
              {communesSelectionnees.includes(commune) && (
                <Check className="w-5 h-5 absolute top-2 right-2 text-yo-orange" />
              )}
            </button>
          ))}
        </div>
        
        {communesSelectionnees.length > 0 && (
          <div className="mt-4 p-3 bg-yo-green/10 border border-yo-green/30 rounded-lg">
            <p className="text-sm text-yo-green font-medium">
              ✓ {communesSelectionnees.length} commune(s) sélectionnée(s)
            </p>
          </div>
        )}
      </Card>

      {/* Section Rayon */}
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-yo-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-yo-orange" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl text-yo-gray-900 mb-1">
              Rayon d'intervention
            </h2>
            <p className="text-yo-gray-600 text-sm">
              Définissez jusqu'où vous êtes prêt(e) à vous déplacer
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="100"
              value={rayonIntervention}
              onChange={(e) => setRayonIntervention(Number(e.target.value))}
              className="flex-1 accent-yo-orange"
            />
            <div className="w-20 text-center">
              <span className="font-bold text-2xl text-yo-orange">{rayonIntervention}</span>
              <span className="text-sm text-yo-gray-600 ml-1">km</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-yo-gray-500">
            <Info className="w-4 h-4" />
            <span>Plus le rayon est large, plus vous recevrez de demandes</span>
          </div>
        </div>
      </Card>

      {/* Section Catégories */}
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-yo-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Plus className="w-5 h-5 text-yo-orange" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl text-yo-gray-900 mb-1">
              Catégories de services
            </h2>
            <p className="text-yo-gray-600 text-sm">
              Choisissez les services que vous proposez
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((categorie) => (
            <button
              key={categorie}
              onClick={() => toggleCategorie(categorie)}
              className={`
                relative px-4 py-3 rounded-lg border-2 transition-all text-left
                ${
                  categoriesSelectionnees.includes(categorie)
                    ? 'border-yo-orange bg-yo-orange/10 text-yo-orange font-medium'
                    : 'border-yo-gray-200 bg-white text-yo-gray-700 hover:border-yo-orange/50'
                }
              `}
            >
              <span className="block">{categorie}</span>
              {categoriesSelectionnees.includes(categorie) && (
                <Check className="w-5 h-5 absolute top-2 right-2 text-yo-orange" />
              )}
            </button>
          ))}
        </div>

        {categoriesSelectionnees.length > 0 && (
          <div className="mt-4 p-3 bg-yo-green/10 border border-yo-green/30 rounded-lg">
            <p className="text-sm text-yo-green font-medium">
              ✓ {categoriesSelectionnees.length} catégorie(s) sélectionnée(s)
            </p>
          </div>
        )}
      </Card>

      {/* Section Disponibilités */}
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-yo-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-yo-orange" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl text-yo-gray-900 mb-1">
              Jours disponibles
            </h2>
            <p className="text-yo-gray-600 text-sm">
              Indiquez vos jours de disponibilité
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {JOURS_SEMAINE.map((jour) => (
            <button
              key={jour.id}
              onClick={() => toggleJour(jour.id)}
              className={`
                px-6 py-3 rounded-lg border-2 font-medium transition-all
                ${
                  joursDisponibles.includes(jour.id)
                    ? 'border-yo-orange bg-yo-orange text-white'
                    : 'border-yo-gray-200 bg-white text-yo-gray-700 hover:border-yo-orange/50'
                }
              `}
            >
              {jour.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Section Horaires */}
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-yo-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-yo-orange" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl text-yo-gray-900 mb-1">
              Plages horaires
            </h2>
            <p className="text-yo-gray-600 text-sm">
              Sélectionnez vos créneaux de disponibilité
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {PLAGES_HORAIRES.map((plage) => (
            <button
              key={plage.id}
              onClick={() => toggleHoraire(plage.id)}
              className={`
                w-full px-4 py-4 rounded-lg border-2 text-left transition-all flex items-center justify-between
                ${
                  horairesDisponibles.includes(plage.id)
                    ? 'border-yo-orange bg-yo-orange/10 text-yo-orange font-medium'
                    : 'border-yo-gray-200 bg-white text-yo-gray-700 hover:border-yo-orange/50'
                }
              `}
            >
              <div>
                <div className="font-medium">{plage.label}</div>
                <div className="text-sm text-yo-gray-500">{plage.hours}</div>
              </div>
              {horairesDisponibles.includes(plage.id) && (
                <Check className="w-5 h-5 text-yo-orange" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Bouton Enregistrer */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-yo-orange text-white hover:bg-yo-orange-dark px-8 py-3 text-lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Enregistrer mes préférences
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
