/**
 * Fonctions d'export du tableau de bord (PDF et Excel)
 */

import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface DashboardData {
  stats: {
    revenusMonth: number;
    devisPending: number;
    facturesUnpaid: number;
    clientsActive: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    client: string;
    action: string;
    amount: number;
    status: string;
    date: string;
  }>;
  profile: {
    name: string;
    company: string;
  };
  date: string;
}

/**
 * Exporte le tableau de bord en PDF
 */
export async function exportDashboardPDF(data: DashboardData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // En-tête
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Tableau de Bord Pro - Yo!Voiz', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.profile.company}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`${data.profile.name}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`Date: ${data.date}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Ligne de séparation
  doc.setDrawColor(255, 107, 53); // Yo orange
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // Statistiques
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Statistiques du mois', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Revenus du mois: ${data.stats.revenusMonth.toLocaleString()} FCFA`, 30, yPos);
  yPos += 7;
  doc.text(`Devis en attente: ${data.stats.devisPending}`, 30, yPos);
  yPos += 7;
  doc.text(`Factures impayées: ${data.stats.facturesUnpaid}`, 30, yPos);
  yPos += 7;
  doc.text(`Clients actifs: ${data.stats.clientsActive}`, 30, yPos);
  yPos += 15;

  // Activité récente
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Activité récente', 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  data.recentActivity.forEach((activity, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${activity.client}`, 30, yPos);
    yPos += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`   ${activity.action}`, 30, yPos);
    yPos += 5;
    
    if (activity.amount > 0) {
      doc.text(`   Montant: ${activity.amount.toLocaleString()} FCFA`, 30, yPos);
      yPos += 5;
    }
    
    doc.text(`   Date: ${new Date(activity.date).toLocaleDateString('fr-FR')}`, 30, yPos);
    yPos += 5;
    
    const statusText = 
      activity.status === 'paid' ? 'Payé' :
      activity.status === 'accepted' ? 'Accepté' :
      activity.status === 'pending' ? 'En attente' :
      'Nouveau';
    doc.text(`   Statut: ${statusText}`, 30, yPos);
    yPos += 10;
  });

  // Pied de page
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128);
    doc.text(
      `Page ${i} sur ${totalPages} - Généré le ${new Date().toLocaleString('fr-FR')}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Téléchargement
  const filename = `Tableau-Bord-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

/**
 * Exporte le tableau de bord en Excel
 */
export async function exportDashboardExcel(data: DashboardData) {
  // Feuille 1: Statistiques
  const statsData = [
    ['Tableau de Bord Pro - Yo!Voiz'],
    [''],
    ['Entreprise:', data.profile.company],
    ['Responsable:', data.profile.name],
    ['Date:', data.date],
    [''],
    ['STATISTIQUES DU MOIS'],
    ['Revenus du mois', data.stats.revenusMonth, 'FCFA'],
    ['Devis en attente', data.stats.devisPending],
    ['Factures impayées', data.stats.facturesUnpaid],
    ['Clients actifs', data.stats.clientsActive],
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(statsData);

  // Largeur des colonnes
  ws1['!cols'] = [
    { wch: 25 },
    { wch: 15 },
    { wch: 10 }
  ];

  // Feuille 2: Activité récente
  const activityData = [
    ['ACTIVITÉ RÉCENTE'],
    [''],
    ['Client', 'Action', 'Montant (FCFA)', 'Statut', 'Date']
  ];

  data.recentActivity.forEach(activity => {
    const statusText = 
      activity.status === 'paid' ? 'Payé' :
      activity.status === 'accepted' ? 'Accepté' :
      activity.status === 'pending' ? 'En attente' :
      'Nouveau';

    activityData.push([
      activity.client,
      activity.action,
      activity.amount > 0 ? activity.amount : '',
      statusText,
      new Date(activity.date).toLocaleDateString('fr-FR')
    ]);
  });

  const ws2 = XLSX.utils.aoa_to_sheet(activityData);

  // Largeur des colonnes
  ws2['!cols'] = [
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 }
  ];

  // Création du classeur
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, 'Statistiques');
  XLSX.utils.book_append_sheet(wb, ws2, 'Activité');

  // Téléchargement
  const filename = `Tableau-Bord-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
}
