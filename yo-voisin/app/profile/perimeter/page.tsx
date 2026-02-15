'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Loader2, Save, ChevronDown, Check,
  Calendar, Info, Plus, X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

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

export default function PerimeterPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  
  const [saving, setSaving] = useState(false);
  const [communesSelectionnees, setCommunesSelectionnees] = useState<string[]>([]);
  const [categoriesSelectionnees, setCategoriesSelectionnees] = useState<string[]>([]);
  const [rayonIntervention, setRayonIntervention] = useState(5);
  const [joursDisponibles, setJoursDisponibles] = useState<string[]>([]);
  const [horairesDisponibles, setHorairesDisponibles] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/connexion');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      // Charger les préférences existantes depuis Supabase
      loadPerimeterData();
    }
  }, [profile]);

  const loadPerimeterData = async () => {
    try {
      console.log('🔍 Chargement des données périmètre pour:', profile?.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('service_zones, categories, availability_hours')
        .eq('id', profile?.id)
        .single();

      if (error) {
        console.error('❌ Erreur chargement périmètre:', error);
        return;
      }

      console.log('📦 Données reçues:', data);

      if (data) {
        setCommunesSelectionnees(data.service_zones || []);
        setCategoriesSelectionnees(data.categories || []);
        
        // Parsing de availability_hours
        if (data.availability_hours) {
          let avail = data.availability_hours;
          
          // Si c'est une string, parser
          if (typeof avail === 'string') {
            try {
              avail = JSON.parse(avail);
            } catch (e) {
              console.error('❌ Erreur parsing availability_hours:', e);
              avail = {};
            }
          }
          
          console.log('✅ availability_hours parsé:', avail);
          
          // Extraire les données avec valeurs par défaut
          const jours = Array.isArray(avail.jours) ? avail.jours : [];
          const horaires = Array.isArray(avail.horaires) ? avail.horaires : [];
          const rayon = typeof avail.rayon === 'number' ? avail.rayon : 5;
          
          console.log('📅 Jours:', jours);
          console.log('🕐 Horaires:', horaires);
          console.log('📍 Rayon:', rayon);
          
          setJoursDisponibles(jours);
          setHorairesDisponibles(horaires);
          setRayonIntervention(rayon);
        } else {
          console.log('ℹ️ Aucune donnée availability_hours trouvée');
        }
      }
    } catch (error) {
      console.error('❌ Exception chargement:', error);
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

    // Validation
    if (communesSelectionnees.length === 0) {
      alert('⚠️ Veuillez sélectionner au moins une commune');
      return;
    }

    if (categoriesSelectionnees.length === 0) {
      alert('⚠️ Veuillez sélectionner au moins une catégorie de service');
      return;
    }

    setSaving(true);
    try {
      // Construire l'objet availability_hours
      const availabilityData = {
        jours: joursDisponibles,
        horaires: horairesDisponibles,
        rayon: rayonIntervention
      };

      const updateData: any = {
        service_zones: communesSelectionnees,
        categories: categoriesSelectionnees,
        availability_hours: availabilityData,
        updated_at: new Date().toISOString()
      };

      console.log('💾 Données à sauvegarder:', updateData);
      console.log('📅 Jours à sauvegarder:', joursDisponibles);
      console.log('🕐 Horaires à sauvegarder:', horairesDisponibles);

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      console.log('✅ Sauvegarde réussie !');
      alert('✅ Périmètre d\'intervention sauvegardé avec succès !');
      
      // Recharger les données pour confirmer
      await loadPerimeterData();
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde:', error);
      alert(`❌ Erreur lors de la sauvegarde: ${error.message || 'Erreur inconnue'}\n\nVérifiez la console pour plus de détails.`);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar isConnected={!!user} />
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Skeleton width="100%" height={600} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <PageHead 
        title="Gérer mon périmètre" 
        description="Définissez vos zones d'intervention, catégories et disponibilités"
      />
      <Navbar 
        isConnected={true}
        user={{
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display font-extrabold text-4xl text-yo-green-dark mb-2">
            Gérer mon périmètre d'intervention
          </h1>
          <p className="text-yo-gray-600 text-lg">
            Définissez où et quand vous pouvez intervenir pour recevoir les demandes correspondantes
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Section Communes */}
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
                  Sélectionnez les communes où vous souhaitez intervenir
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {COMMUNES_ABIDJAN.map((commune) => {
                const isSelected = communesSelectionnees.includes(commune);
                return (
                  <button
                    key={commune}
                    onClick={() => toggleCommune(commune)}
                    className={`
                      px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium
                      ${isSelected
                        ? 'bg-yo-orange text-white border-yo-orange'
                        : 'bg-white text-yo-gray-700 border-yo-gray-200 hover:border-yo-orange'
                      }
                    `}
                  >
                    {isSelected && <Check className="inline w-4 h-4 mr-1" />}
                    {commune}
                  </button>
                );
              })}
            </div>

            {communesSelectionnees.length > 0 && (
              <div className="mt-4 p-3 bg-yo-green/10 rounded-lg">
                <p className="text-sm text-yo-green-dark font-medium">
                  {communesSelectionnees.length} commune(s) sélectionnée(s)
                </p>
              </div>
            )}
          </Card>

          {/* Section Rayon (visuel - pas encore implémenté côté backend) */}
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-yo-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-yo-green" />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-2xl text-yo-gray-900 mb-1">
                  Rayon d'intervention
                </h2>
                <p className="text-yo-gray-600 text-sm">
                  Distance maximale autour de votre commune principale
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
                  Sélectionnez vos domaines de compétences
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((categorie) => {
                const isSelected = categoriesSelectionnees.includes(categorie);
                return (
                  <button
                    key={categorie}
                    onClick={() => toggleCategorie(categorie)}
                    className={`
                      px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium
                      ${isSelected
                        ? 'bg-yo-green text-white border-yo-green'
                        : 'bg-white text-yo-gray-700 border-yo-gray-200 hover:border-yo-green'
                      }
                    `}
                  >
                    {isSelected && <Check className="inline w-4 h-4 mr-1" />}
                    {categorie}
                  </button>
                );
              })}
            </div>

            {categoriesSelectionnees.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {categoriesSelectionnees.map((cat) => (
                  <Badge key={cat} className="bg-yo-green text-white">
                    {cat}
                    <button
                      onClick={() => toggleCategorie(cat)}
                      className="ml-2 hover:opacity-75"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Section Disponibilités */}
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-yo-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-yo-green" />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-2xl text-yo-gray-900 mb-1">
                  Disponibilités
                </h2>
                <p className="text-yo-gray-600 text-sm">
                  Indiquez vos jours et horaires de disponibilité
                </p>
              </div>
            </div>

            {/* Jours */}
            <div className="mb-6">
              <h3 className="font-semibold text-yo-gray-800 mb-3">Jours disponibles</h3>
              <div className="flex flex-wrap gap-3">
                {JOURS_SEMAINE.map((jour) => {
                  const isSelected = joursDisponibles.includes(jour.id);
                  return (
                    <button
                      key={jour.id}
                      onClick={() => toggleJour(jour.id)}
                      className={`
                        px-4 py-2 rounded-lg border-2 transition-all font-medium
                        ${isSelected
                          ? 'bg-yo-orange text-white border-yo-orange'
                          : 'bg-white text-yo-gray-700 border-yo-gray-200 hover:border-yo-orange'
                        }
                      `}
                    >
                      {jour.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Horaires */}
            <div>
              <h3 className="font-semibold text-yo-gray-800 mb-3">Plages horaires</h3>
              <div className="space-y-3">
                {PLAGES_HORAIRES.map((plage) => {
                  const isSelected = horairesDisponibles.includes(plage.id);
                  return (
                    <button
                      key={plage.id}
                      onClick={() => toggleHoraire(plage.id)}
                      className={`
                        w-full px-4 py-3 rounded-lg border-2 transition-all text-left
                        ${isSelected
                          ? 'bg-yo-green text-white border-yo-green'
                          : 'bg-white text-yo-gray-700 border-yo-gray-200 hover:border-yo-green'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{plage.label}</p>
                          <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-yo-gray-500'}`}>
                            {plage.hours}
                          </p>
                        </div>
                        {isSelected && <Check className="w-5 h-5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Bouton Sauvegarder */}
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || communesSelectionnees.length === 0}
              className="min-w-[200px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sauvegarde...
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
      </div>
    </div>
  );
}
