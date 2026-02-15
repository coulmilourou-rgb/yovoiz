// Utilitaires de formatage pour Yo!Voiz

/**
 * Formate un montant en FCFA (devise de la Côte d'Ivoire)
 * @param amount - Montant à formater
 * @param showSymbol - Afficher le symbole FCFA (défaut: true)
 * @returns Montant formaté (ex: "25 000 FCFA")
 */
export function formatCurrency(amount: number, showSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat('fr-CI', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return showSymbol ? `${formatted} FCFA` : formatted;
}

/**
 * Formate un montant avec le code devise XOF
 * @param amount - Montant à formater
 * @returns Montant formaté avec code (ex: "25 000 XOF")
 */
export function formatCurrencyXOF(amount: number): string {
  const formatted = new Intl.NumberFormat('fr-CI', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `${formatted} XOF`;
}

/**
 * Formate un pourcentage
 * @param value - Valeur décimale (0.05 = 5%)
 * @param decimals - Nombre de décimales (défaut: 0)
 * @returns Pourcentage formaté (ex: "5%")
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formate une date en français
 * @param date - Date à formater
 * @param format - Format: 'short', 'long', 'medium' (défaut: 'medium')
 * @returns Date formatée (ex: "13 févr. 2026")
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'medium' = 'medium'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = 
    format === 'short' ? { day: '2-digit', month: '2-digit', year: 'numeric' } :
    format === 'long' ? { day: 'numeric', month: 'long', year: 'numeric' } :
    { day: 'numeric', month: 'short', year: 'numeric' };
  
  return new Intl.DateTimeFormat('fr-FR', options).format(d);
}

/**
 * Formate un numéro de téléphone ivoirien
 * @param phone - Numéro de téléphone
 * @returns Téléphone formaté (ex: "+225 07 87 89 88 99")
 */
export function formatPhone(phone: string): string {
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Format ivoirien: +225 XX XX XX XX XX
  if (cleaned.length === 10) {
    return `+225 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}`;
  }
  
  if (cleaned.length === 13 && cleaned.startsWith('225')) {
    return `+225 ${cleaned.substring(3, 5)} ${cleaned.substring(5, 7)} ${cleaned.substring(7, 9)} ${cleaned.substring(9, 11)} ${cleaned.substring(11, 13)}`;
  }
  
  return phone;
}

/**
 * Tronque un texte avec ellipse
 * @param text - Texte à tronquer
 * @param maxLength - Longueur maximale
 * @returns Texte tronqué
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Génère un identifiant unique court
 * @param prefix - Préfixe (ex: "INV", "QUO")
 * @returns ID unique (ex: "INV-2026-001234")
 */
export function generateId(prefix: string): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `${prefix}-${year}-${random}`;
}

/**
 * Calcule la TVA (18% en Côte d'Ivoire)
 * @param amount - Montant HT
 * @param rate - Taux de TVA (défaut: 0.18)
 * @returns Montant de la TVA
 */
export function calculateTVA(amount: number, rate: number = 0.18): number {
  return amount * rate;
}

/**
 * Calcule les totaux avec TVA
 * @param amount - Montant HT
 * @param rate - Taux de TVA (défaut: 0.18)
 * @returns Objet avec HT, TVA, TTC
 */
export function calculateTVADetails(amount: number, rate: number = 0.18) {
  const ht = amount;
  const tva = amount * rate;
  const ttc = amount * (1 + rate);
  
  return {
    ht,
    tva,
    ttc,
    formatted: {
      ht: formatCurrency(ht),
      tva: formatCurrency(tva),
      ttc: formatCurrency(ttc),
    }
  };
}

/**
 * Classe un tableau par un champ
 * @param array - Tableau à classer
 * @param key - Clé de tri
 * @param order - Ordre (asc/desc)
 * @returns Tableau trié
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal < bVal ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Groupe un tableau par un champ
 * @param array - Tableau à grouper
 * @param key - Clé de groupage
 * @returns Objet groupé
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
