import { Metadata } from 'next';

/**
 * Génère les métadonnées pour une page
 */
export function generatePageMetadata(config: {
  title: string;
  description?: string;
  keywords?: string[];
}): Metadata {
  const { title, description, keywords } = config;
  
  const fullTitle = title.includes('Yo!Voiz') ? title : `${title} | Yo!Voiz`;
  const defaultDescription = 'Services de proximité en Côte d\'Ivoire - Trouvez et offrez des services dans votre quartier';
  
  return {
    title: fullTitle,
    description: description || defaultDescription,
    keywords: keywords || [
      'services',
      'proximité',
      'côte d\'ivoire',
      'abidjan',
      'petits boulots',
      'artisans',
      'freelance',
    ],
    openGraph: {
      title: fullTitle,
      description: description || defaultDescription,
      siteName: 'Yo!Voiz',
      type: 'website',
    },
  };
}

/**
 * Métadonnées prédéfinies pour les pages principales
 */
export const PAGE_METADATA = {
  home: generatePageMetadata({
    title: 'Accueil',
    description: 'Trouvez des services de proximité en Côte d\'Ivoire. Demandez et offrez des services dans votre quartier.',
  }),
  
  missions: generatePageMetadata({
    title: 'Missions',
    description: 'Consultez les demandes de services disponibles dans votre zone d\'intervention.',
  }),
  
  nouvelleMission: generatePageMetadata({
    title: 'Nouvelle Demande',
    description: 'Publiez votre demande de service et recevez des devis de prestataires qualifiés.',
  }),
  
  offreurs: generatePageMetadata({
    title: 'Offreurs',
    description: 'Découvrez les prestataires de services dans votre zone.',
  }),
  
  messages: generatePageMetadata({
    title: 'Messages',
    description: 'Consultez vos conversations avec les demandeurs et prestataires.',
  }),
  
  abonnement: generatePageMetadata({
    title: 'Abonnement',
    description: 'Gérez votre abonnement et débloquez des fonctionnalités premium.',
  }),
  
  monProfil: generatePageMetadata({
    title: 'Mon Profil',
    description: 'Gérez vos informations personnelles et préférences.',
  }),
  
  mesDemandes: generatePageMetadata({
    title: 'Mes Demandes',
    description: 'Consultez l\'historique de vos demandes de services.',
  }),
  
  mesServices: generatePageMetadata({
    title: 'Mes Services',
    description: 'Gérez vos offres de services et consultez vos statistiques.',
  }),
  
  mesPayments: generatePageMetadata({
    title: 'Mes Paiements',
    description: 'Consultez l\'historique de vos paiements et revenus.',
  }),
  
  securite: generatePageMetadata({
    title: 'Sécurité',
    description: 'Gérez vos identifiants et paramètres de sécurité.',
  }),
  
  cgu: generatePageMetadata({
    title: 'Conditions Générales d\'Utilisation',
    description: 'Consultez les conditions d\'utilisation de la plateforme Yo!Voiz.',
  }),
  
  connexion: generatePageMetadata({
    title: 'Connexion',
    description: 'Connectez-vous à votre compte Yo!Voiz.',
  }),
  
  inscription: generatePageMetadata({
    title: 'Inscription',
    description: 'Créez votre compte Yo!Voiz et commencez à offrir ou demander des services.',
  }),

  // Pages Pro
  messagesPro: generatePageMetadata({
    title: 'Messagerie',
    description: 'Consultez et gérez vos conversations avec vos clients et prestataires.',
  }),

  abonnementPro: generatePageMetadata({
    title: 'Abonnement Pro',
    description: 'Gérez votre abonnement professionnel et accédez aux outils avancés.',
  }),

  tableauBord: generatePageMetadata({
    title: 'Tableau de Bord Pro',
    description: 'Vue d\'ensemble de votre activité professionnelle sur Yo!Voiz.',
  }),

  devis: generatePageMetadata({
    title: 'Mes Devis',
    description: 'Créez, modifiez et envoyez vos devis clients.',
  }),

  factures: generatePageMetadata({
    title: 'Mes Factures',
    description: 'Gérez vos factures et suivez vos paiements clients.',
  }),

  encaissements: generatePageMetadata({
    title: 'Encaissements',
    description: 'Suivez tous vos encaissements et statistiques financières.',
  }),

  clientsPro: generatePageMetadata({
    title: 'Répertoire Clients',
    description: 'Gérez votre base de clients professionnels.',
  }),

  catalogue: generatePageMetadata({
    title: 'Catalogue de Services',
    description: 'Gérez vos prestations, tarifs et disponibilités.',
  }),

  parametresPro: generatePageMetadata({
    title: 'Paramètres Pro',
    description: 'Configurez vos informations professionnelles et préférences.',
  }),

  activites: generatePageMetadata({
    title: 'Mes Activités',
    description: 'Suivez toutes vos activités et interactions sur la plateforme.',
  }),

  voirDemandes: generatePageMetadata({
    title: 'Demandes Disponibles',
    description: 'Consultez les demandes de services dans votre zone d\'intervention.',
  }),
};
