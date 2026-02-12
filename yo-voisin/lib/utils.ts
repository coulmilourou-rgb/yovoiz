import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'il y a quelques secondes';
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} jours`;
  return formatDate(date);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function filterMessage(content: string): { filtered: string; isFiltered: boolean } {
  let filtered = content;
  let isFiltered = false;

  // Détecter et masquer les numéros de téléphone
  const phoneRegex = /(\+?\d{1,3}[\s.-]?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{2,4})/g;
  if (phoneRegex.test(filtered)) {
    filtered = filtered.replace(phoneRegex, '** ** ** ** **');
    isFiltered = true;
  }

  // Détecter et masquer les emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  if (emailRegex.test(filtered)) {
    filtered = filtered.replace(emailRegex, '****@****.***');
    isFiltered = true;
  }

  // Détecter et masquer les liens WhatsApp/réseaux
  const linkRegex = /(wa\.me|whatsapp|telegram|facebook\.com|instagram\.com|t\.me)/gi;
  if (linkRegex.test(filtered)) {
    filtered = filtered.replace(linkRegex, '[lien masqué]');
    isFiltered = true;
  }

  // Détecter les tentatives écrites
  const writtenNumbers = /\b(zéro|zero|un|deux|trois|quatre|cinq|six|sept|huit|neuf)\b.*\b(zéro|zero|un|deux|trois|quatre|cinq|six|sept|huit|neuf)\b/gi;
  if (writtenNumbers.test(filtered)) {
    isFiltered = true;
  }

  return { filtered, isFiltered };
}
