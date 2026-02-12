// Constantes de l'application Yo! Voiz

export interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: 'menage', label: 'Ménage', emoji: '🧹', color: '#E8F5ED', description: 'Nettoyage & entretien' },
  { id: 'gouvernante', label: 'Gouvernante', emoji: '👩‍🍳', color: '#FEF3C7', description: 'Aide à domicile' },
  { id: 'bricolage', label: 'Bricolage', emoji: '🔧', color: '#FFF0E5', description: 'Petits travaux' },
  { id: 'livraison', label: 'Livraison', emoji: '🚚', color: '#E0F2FE', description: 'Courses & colis' },
  { id: 'reparation', label: 'Réparations', emoji: '⚡', color: '#F3E8FF', description: 'Électricité & plomberie' },
  { id: 'manutention', label: 'Manutention', emoji: '📦', color: '#ECFDF5', description: 'Déménagement' },
  { id: 'jardinage', label: 'Jardinage', emoji: '🌿', color: '#ECFDF5', description: 'Entretien jardin' },
  { id: 'couture', label: 'Couture', emoji: '🧵', color: '#FFF0E5', description: 'Retouches & création' },
  { id: 'cours', label: 'Cours particuliers', emoji: '📚', color: '#E0F2FE', description: 'Soutien scolaire' },
  { id: 'cuisine', label: 'Cuisine', emoji: '🍳', color: '#FEF3C7', description: 'Traiteur & chef' },
  { id: 'evenementiel', label: 'Événementiel', emoji: '🎉', color: '#F3E8FF', description: 'Animation & déco' },
  { id: 'informatique', label: 'Informatique', emoji: '💻', color: '#E0F2FE', description: 'Dépannage PC' },
  { id: 'beaute', label: 'Beauté', emoji: '💇‍♀️', color: '#FCE7F3', description: 'Coiffure & soins' },
  { id: 'auto', label: 'Auto & Moto', emoji: '🚗', color: '#FFF0E5', description: 'Mécanique & lavage' },
  { id: 'garde', label: 'Garde enfants', emoji: '👶', color: '#FECACA', description: 'Baby-sitting' },
];

export const COMMUNES: string[] = [
  'Abobo',
  'Adjamé',
  'Anyama',
  'Attécoubé',
  'Bingerville',
  'Brofodoumé',
  'Cocody',
  'Koumassi',
  'Marcory',
  'Plateau',
  'Port-Bouët',
  'Songon',
  'Treichville',
  'Yopougon',
];

export const PROVIDER_LEVELS = {
  bronze: {
    name: 'Bronze',
    icon: '🥉',
    missions: { min: 0, max: 10 },
    rating: { min: 0 },
    commission: 15,
    color: '#D1D5DB',
  },
  silver: {
    name: 'Argent',
    icon: '🥈',
    missions: { min: 11, max: 30 },
    rating: { min: 4.0 },
    commission: 12,
    color: '#94A3B8',
  },
  gold: {
    name: 'Or',
    icon: '⭐',
    missions: { min: 31, max: 80 },
    rating: { min: 4.3 },
    commission: 10,
    color: '#F59E0B',
  },
  platinum: {
    name: 'Platine',
    icon: '💎',
    missions: { min: 81, max: Infinity },
    rating: { min: 4.5 },
    commission: 10,
    color: '#8B5CF6',
  },
};

export const REVIEW_TAGS = {
  provider: [
    { id: 'ponctuel', label: 'Ponctuel', emoji: '👍' },
    { id: 'professionnel', label: 'Professionnel', emoji: '🔧' },
    { id: 'propre', label: 'Propre', emoji: '🧹' },
    { id: 'bon_contact', label: 'Bon contact', emoji: '💬' },
    { id: 'rapide', label: 'Rapide', emoji: '⚡' },
    { id: 'precis', label: 'Précis', emoji: '🎯' },
    { id: 'soigne', label: 'Soigné', emoji: '👌' },
  ],
  requester: [
    { id: 'clair', label: 'Clair', emoji: '📝' },
    { id: 'accueillant', label: 'Accueillant', emoji: '🏠' },
    { id: 'respectueux', label: 'Respectueux', emoji: '🤝' },
    { id: 'bon_contact', label: 'Bon contact', emoji: '💬' },
    { id: 'ponctuel', label: 'Ponctuel', emoji: '⏰' },
  ],
};

export const PAYMENT_METHODS = [
  { id: 'orange_money', label: 'Orange Money', icon: '🟠', color: '#FF7900' },
  { id: 'mtn_momo', label: 'MTN MoMo', icon: '🟡', color: '#FFCC00' },
  { id: 'wave', label: 'Wave', icon: '🔵', color: '#01C0F1' },
  { id: 'moov', label: 'Moov Money', icon: '🟣', color: '#00A3E0' },
];
