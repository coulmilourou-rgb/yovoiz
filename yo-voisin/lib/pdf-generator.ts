import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './formatters';

interface ServiceLine {
  description: string;
  quantity: number;
  unit_price: number;
}

interface DevisData {
  numero_devis: string;
  date_emission: string;
  date_validite: string;
  services: ServiceLine[];
  total_ht: number;
  tva: number;
  total_ttc: number;
  tva_applicable: boolean;
  notes?: string;
  pro: any;
  client: any;
}

interface FactureData {
  numero_facture: string;
  date_emission: string;
  date_echeance: string;
  services: ServiceLine[];
  total_ht: number;
  tva: number;
  total_ttc: number;
  tva_applicable: boolean;
  notes?: string;
  conditions_paiement: string;
  pro: any;
  client: any;
}

// Couleurs Yo!Voiz
const COLORS = {
  primary: '#2563EB', // Bleu
  secondary: '#1E40AF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  background: '#F9FAFB',
};

/**
 * Génère un PDF pour un devis
 */
export async function generateDevisPDF(devis: DevisData): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // En-tête - Logo et titre
  doc.setFillColor(COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Yo!Voiz', 20, 25);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('DEVIS', pageWidth - 20, 25, { align: 'right' });

  yPos = 50;

  // Informations Pro (Émetteur)
  doc.setTextColor(COLORS.text);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ÉMETTEUR', 20, yPos);
  
  doc.setFont('helvetica', 'normal');
  yPos += 6;
  doc.text(`${devis.pro.prenom || ''} ${devis.pro.nom || ''}`, 20, yPos);
  yPos += 5;
  if (devis.pro.entreprise) {
    doc.text(devis.pro.entreprise, 20, yPos);
    yPos += 5;
  }
  if (devis.pro.adresse) {
    doc.text(devis.pro.adresse, 20, yPos);
    yPos += 5;
  }
  if (devis.pro.ville) {
    doc.text(`${devis.pro.code_postal || ''} ${devis.pro.ville}`, 20, yPos);
    yPos += 5;
  }
  if (devis.pro.telephone) {
    doc.text(`Tél: ${devis.pro.telephone}`, 20, yPos);
    yPos += 5;
  }
  if (devis.pro.email) {
    doc.text(`Email: ${devis.pro.email}`, 20, yPos);
  }

  // Informations Client
  let clientYPos = 50;
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', pageWidth - 80, clientYPos);
  
  doc.setFont('helvetica', 'normal');
  clientYPos += 6;
  doc.text(`${devis.client.prenom || ''} ${devis.client.nom || ''}`, pageWidth - 80, clientYPos);
  clientYPos += 5;
  if (devis.client.adresse) {
    doc.text(devis.client.adresse, pageWidth - 80, clientYPos);
    clientYPos += 5;
  }
  if (devis.client.ville) {
    doc.text(`${devis.client.code_postal || ''} ${devis.client.ville}`, pageWidth - 80, clientYPos);
    clientYPos += 5;
  }
  if (devis.client.telephone) {
    doc.text(`Tél: ${devis.client.telephone}`, pageWidth - 80, clientYPos);
    clientYPos += 5;
  }
  if (devis.client.email) {
    doc.text(`Email: ${devis.client.email}`, pageWidth - 80, clientYPos);
  }

  yPos = Math.max(yPos, clientYPos) + 15;

  // Informations du devis
  doc.setFillColor(COLORS.background);
  doc.rect(20, yPos, pageWidth - 40, 20, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Devis N° ${devis.numero_devis}`, 25, yPos + 7);
  
  const dateEmission = new Date(devis.date_emission).toLocaleDateString('fr-FR');
  const dateValidite = new Date(devis.date_validite).toLocaleDateString('fr-FR');
  doc.text(`Date d'émission: ${dateEmission}`, 25, yPos + 14);
  doc.text(`Valide jusqu'au: ${dateValidite}`, pageWidth - 80, yPos + 14);

  yPos += 30;

  // Tableau des services
  const tableData = devis.services.map((service) => [
    service.description,
    service.quantity.toString(),
    formatCurrency(service.unit_price),
    formatCurrency(service.quantity * service.unit_price),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: '#FFFFFF',
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.text,
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Totaux
  const totalsX = pageWidth - 90;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.text('Total HT:', totalsX, yPos);
  doc.text(formatCurrency(devis.total_ht), pageWidth - 25, yPos, { align: 'right' });
  yPos += 7;

  if (devis.tva_applicable) {
    doc.text('TVA (18%):', totalsX, yPos);
    doc.text(formatCurrency(devis.tva), pageWidth - 25, yPos, { align: 'right' });
    yPos += 7;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total TTC:', totalsX, yPos);
  doc.text(formatCurrency(devis.total_ttc), pageWidth - 25, yPos, { align: 'right' });

  // Notes
  if (devis.notes) {
    yPos += 15;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 5;
    const splitNotes = doc.splitTextToSize(devis.notes, pageWidth - 40);
    doc.text(splitNotes, 20, yPos);
    yPos += splitNotes.length * 5;
  }

  // Conditions générales
  yPos = pageHeight - 40;
  doc.setFontSize(8);
  doc.setTextColor(COLORS.textLight);
  doc.setFont('helvetica', 'italic');
  doc.text('Conditions générales:', 20, yPos);
  yPos += 4;
  doc.setFont('helvetica', 'normal');
  const conditions = [
    'Ce devis est valable 30 jours à compter de la date d\'émission.',
    'Les prix sont exprimés en Francs CFA (XOF), TVA comprise si applicable.',
    'Le règlement s\'effectue comptant à la commande ou selon les conditions convenues.',
  ];
  conditions.forEach((condition) => {
    doc.text(`• ${condition}`, 20, yPos);
    yPos += 4;
  });

  // Footer
  doc.setFillColor(COLORS.primary);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('Yo!Voiz - Plateforme de services de proximité en Côte d\'Ivoire', pageWidth / 2, pageHeight - 8, { align: 'center' });

  return doc.output('blob');
}

/**
 * Génère un PDF pour une facture
 */
export async function generateFacturePDF(facture: FactureData): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // En-tête - Logo et titre
  doc.setFillColor(COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Yo!Voiz', 20, 25);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('FACTURE', pageWidth - 20, 25, { align: 'right' });

  yPos = 50;

  // Informations Pro (Émetteur)
  doc.setTextColor(COLORS.text);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ÉMETTEUR', 20, yPos);
  
  doc.setFont('helvetica', 'normal');
  yPos += 6;
  doc.text(`${facture.pro.prenom || ''} ${facture.pro.nom || ''}`, 20, yPos);
  yPos += 5;
  if (facture.pro.entreprise) {
    doc.text(facture.pro.entreprise, 20, yPos);
    yPos += 5;
  }
  if (facture.pro.adresse) {
    doc.text(facture.pro.adresse, 20, yPos);
    yPos += 5;
  }
  if (facture.pro.ville) {
    doc.text(`${facture.pro.code_postal || ''} ${facture.pro.ville}`, 20, yPos);
    yPos += 5;
  }
  if (facture.pro.telephone) {
    doc.text(`Tél: ${facture.pro.telephone}`, 20, yPos);
    yPos += 5;
  }
  if (facture.pro.email) {
    doc.text(`Email: ${facture.pro.email}`, 20, yPos);
  }

  // Informations Client
  let clientYPos = 50;
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', pageWidth - 80, clientYPos);
  
  doc.setFont('helvetica', 'normal');
  clientYPos += 6;
  doc.text(`${facture.client.prenom || ''} ${facture.client.nom || ''}`, pageWidth - 80, clientYPos);
  clientYPos += 5;
  if (facture.client.adresse) {
    doc.text(facture.client.adresse, pageWidth - 80, clientYPos);
    clientYPos += 5;
  }
  if (facture.client.ville) {
    doc.text(`${facture.client.code_postal || ''} ${facture.client.ville}`, pageWidth - 80, clientYPos);
    clientYPos += 5;
  }
  if (facture.client.telephone) {
    doc.text(`Tél: ${facture.client.telephone}`, pageWidth - 80, clientYPos);
    clientYPos += 5;
  }
  if (facture.client.email) {
    doc.text(`Email: ${facture.client.email}`, pageWidth - 80, clientYPos);
  }

  yPos = Math.max(yPos, clientYPos) + 15;

  // Informations de la facture
  doc.setFillColor(COLORS.background);
  doc.rect(20, yPos, pageWidth - 40, 20, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Facture N° ${facture.numero_facture}`, 25, yPos + 7);
  
  const dateEmission = new Date(facture.date_emission).toLocaleDateString('fr-FR');
  const dateEcheance = new Date(facture.date_echeance).toLocaleDateString('fr-FR');
  doc.text(`Date d'émission: ${dateEmission}`, 25, yPos + 14);
  doc.text(`Date d'échéance: ${dateEcheance}`, pageWidth - 80, yPos + 14);

  yPos += 30;

  // Tableau des services
  const tableData = facture.services.map((service) => [
    service.description,
    service.quantity.toString(),
    formatCurrency(service.unit_price),
    formatCurrency(service.quantity * service.unit_price),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: '#FFFFFF',
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.text,
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Totaux
  const totalsX = pageWidth - 90;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.text('Total HT:', totalsX, yPos);
  doc.text(formatCurrency(facture.total_ht), pageWidth - 25, yPos, { align: 'right' });
  yPos += 7;

  if (facture.tva_applicable) {
    doc.text('TVA (18%):', totalsX, yPos);
    doc.text(formatCurrency(facture.tva), pageWidth - 25, yPos, { align: 'right' });
    yPos += 7;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total TTC:', totalsX, yPos);
  doc.text(formatCurrency(facture.total_ttc), pageWidth - 25, yPos, { align: 'right' });

  yPos += 15;

  // Conditions de paiement
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Conditions de paiement:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 5;
  doc.text(facture.conditions_paiement, 20, yPos);

  // Notes
  if (facture.notes) {
    yPos += 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 5;
    const splitNotes = doc.splitTextToSize(facture.notes, pageWidth - 40);
    doc.text(splitNotes, 20, yPos);
    yPos += splitNotes.length * 5;
  }

  // Mention légale Côte d'Ivoire
  yPos = pageHeight - 55;
  doc.setFillColor(255, 243, 224);
  doc.rect(20, yPos - 5, pageWidth - 40, 25, 'F');
  
  doc.setFontSize(7);
  doc.setTextColor(COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.text('Mention légale:', 25, yPos);
  yPos += 4;
  doc.setFont('helvetica', 'normal');
  const mentionLegale = doc.splitTextToSize(
    'En cas de retard de paiement, seront exigibles, conformément à l\'article L441-6 du Code de commerce, ' +
    'une indemnité calculée sur la base de trois fois le taux de l\'intérêt légal en vigueur ainsi qu\'une ' +
    'indemnité forfaitaire pour frais de recouvrement de 40 euros.',
    pageWidth - 50
  );
  doc.text(mentionLegale, 25, yPos);

  // Footer
  doc.setFillColor(COLORS.primary);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('Yo!Voiz - Plateforme de services de proximité en Côte d\'Ivoire', pageWidth / 2, pageHeight - 8, { align: 'center' });

  return doc.output('blob');
}
