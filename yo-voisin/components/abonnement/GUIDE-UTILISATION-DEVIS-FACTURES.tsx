// GUIDE D'UTILISATION DES COMPOSANTS DEVIS ET FACTURES
// ======================================================

// EXEMPLE 1: Utilisation du Modal Nouveau Devis
// ----------------------------------------------
import { useState } from 'react';
import NouveauDevisModal from '@/components/abonnement/NouveauDevisModal';

export default function DevisPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDevisCreated = (devis: any) => {
    console.log('Devis créé:', devis);
    // Recharger la liste des devis, afficher un message de succès, etc.
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Nouveau Devis
      </button>

      <NouveauDevisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleDevisCreated}
      />
    </div>
  );
}


// EXEMPLE 2: Utilisation du Modal Nouvelle Facture
// -------------------------------------------------
import { useState } from 'react';
import NouvelleFactureModal from '@/components/abonnement/NouvelleFactureModal';

export default function FacturesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFactureCreated = (facture: any) => {
    console.log('Facture créée:', facture);
    // Recharger la liste des factures
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Nouvelle Facture
      </button>

      <NouvelleFactureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFactureCreated}
      />
    </div>
  );
}


// EXEMPLE 3: Créer une facture depuis un devis
// ---------------------------------------------
export default function DevisDetailPage({ devisId }: { devisId: string }) {
  const [isFactureModalOpen, setIsFactureModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsFactureModalOpen(true)}>
        Transformer en facture
      </button>

      <NouvelleFactureModal
        isOpen={isFactureModalOpen}
        onClose={() => setIsFactureModalOpen(false)}
        onSuccess={(facture) => {
          console.log('Facture créée depuis devis:', facture);
        }}
        devisId={devisId} // Pré-remplir avec les données du devis
      />
    </div>
  );
}


// EXEMPLE 4: Génération PDF manuelle (hors composants)
// -----------------------------------------------------
import { generateDevisPDF, generateFacturePDF } from '@/lib/pdf-generator';
import { supabase } from '@/lib/supabase';

async function downloadDevisPDF(devisId: string) {
  // Récupérer le devis avec relations
  const { data: devis } = await supabase
    .from('devis')
    .select('*, pro:profiles!pro_id(*), client:profiles!client_id(*)')
    .eq('id', devisId)
    .single();

  if (!devis) return;

  // Générer le PDF
  const pdfBlob = await generateDevisPDF(devis);

  // Télécharger
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${devis.numero_devis}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}


// STRUCTURE DES DONNÉES
// ---------------------

// Structure ServiceLine (utilisée dans devis et factures)
interface ServiceLine {
  description: string;  // Description du service
  quantity: number;     // Quantité (défaut: 1)
  unit_price: number;   // Prix unitaire en FCFA
}

// Exemple de services
const services: ServiceLine[] = [
  {
    description: 'Installation électrique complète',
    quantity: 1,
    unit_price: 150000
  },
  {
    description: 'Maintenance mensuelle',
    quantity: 3,
    unit_price: 25000
  }
];

// Structure Devis en base de données
interface Devis {
  id: string;
  numero_devis: string;          // Auto-généré (ex: "DEV-2026-123456")
  pro_id: string;                // ID du compte Pro
  client_id: string;             // ID du client
  date_emission: string;         // Date de création (ISO)
  date_validite: string;         // Date limite de validité
  services: ServiceLine[];       // Array des services
  total_ht: number;              // Total Hors Taxes
  tva: number;                   // Montant TVA (18%)
  total_ttc: number;             // Total Toutes Taxes Comprises
  tva_applicable: boolean;       // Si TVA appliquée
  notes?: string;                // Notes optionnelles
  statut: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'facture';
  created_at: string;
  updated_at: string;
}

// Structure Facture en base de données
interface Facture {
  id: string;
  numero_facture: string;        // Auto-généré (ex: "FACT-2026-123456")
  pro_id: string;
  client_id: string;
  devis_id?: string;             // Référence au devis (si créée depuis devis)
  date_emission: string;
  date_echeance: string;         // Date limite de paiement
  services: ServiceLine[];
  total_ht: number;
  tva: number;
  total_ttc: number;
  tva_applicable: boolean;
  notes?: string;
  conditions_paiement: string;   // Conditions de paiement
  statut: 'brouillon' | 'envoyee' | 'payee' | 'en_retard';
  date_paiement?: string;        // Date effective du paiement
  created_at: string;
  updated_at: string;
}


// FONCTIONS UTILITAIRES
// ---------------------

// Formater un montant en FCFA
import { formatCurrency } from '@/lib/formatters';
formatCurrency(25000);  // "25 000 FCFA"

// Calculer la TVA (18%)
import { calculateTVA } from '@/lib/formatters';
const montantTVA = calculateTVA(100000);  // 18000

// Générer un numéro de devis/facture
import { generateId } from '@/lib/formatters';
const numeroDevis = generateId('DEV');      // "DEV-2026-123456"
const numeroFacture = generateId('FACT');   // "FACT-2026-789012"


// MIGRATION SQL
// -------------
// Exécuter le fichier: yo-voisin/supabase/MIGRATION-DEVIS-FACTURES.sql
// dans l'éditeur SQL de Supabase pour créer les tables et les politiques RLS


// DÉPENDANCES NPM REQUISES
// -------------------------
// jspdf: ^2.5.x
// jspdf-autotable: ^3.8.x
// (Déjà installées)
