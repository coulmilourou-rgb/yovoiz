// Sous-catégories détaillées pour chaque catégorie de services

export const CATEGORY_DETAILS: Record<string, {
  description: string;
  subcategories: string[];
}> = {
  menage: {
    description: "Services de nettoyage et d'entretien pour particuliers et professionnels. Du ménage quotidien aux grands nettoyages de fond, nos prestataires s'occupent de tout avec professionnalisme.",
    subcategories: [
      "Ménage quotidien / régulier",
      "Grand nettoyage de printemps",
      "Nettoyage après travaux",
      "Nettoyage de fin de location",
      "Repassage à domicile",
      "Lavage de vitres",
      "Nettoyage de bureaux",
      "Entretien d'appartement Airbnb"
    ]
  },
  gouvernante: {
    description: "Services d'aide à domicile avec gouvernante, femme de ménage ou aide ménagère. Assistance complète pour l'entretien de votre maison et le confort de votre famille.",
    subcategories: [
      "Gouvernante à temps plein",
      "Gouvernante à temps partiel",
      "Femme de ménage quotidienne",
      "Aide ménagère pour personnes âgées",
      "Servante de maison",
      "Cuisinière à domicile",
      "Garde-malade à domicile",
      "Assistance domestique polyvalente"
    ]
  },
  bricolage: {
    description: "Petits travaux de bricolage et réparations domestiques. Montage de meubles, fixations, petites réparations, nos bricoleurs sont là pour vous aider.",
    subcategories: [
      "Montage de meubles (IKEA, etc.)",
      "Fixation d'étagères et cadres",
      "Pose de tringle à rideaux",
      "Réparation de meubles",
      "Installation d'équipements",
      "Petites réparations diverses",
      "Changement de serrures",
      "Pose de patères et crochets"
    ]
  },
  livraison: {
    description: "Services de livraison rapide pour vos courses, colis et achats. De la livraison de courses à domicile aux colis urgents, nos livreurs sont réactifs et fiables.",
    subcategories: [
      "Livraison de courses alimentaires",
      "Livraison de colis urgents",
      "Livraison de médicaments",
      "Retrait et livraison de documents",
      "Livraison de repas restaurant",
      "Courses commission (marché, supermarché)",
      "Livraison de gaz domestique",
      "Transport de petits objets"
    ]
  },
  reparation: {
    description: "Réparations électriques et plomberie. Intervention rapide pour tous vos problèmes : fuites, pannes électriques, installation sanitaire, nos techniciens sont qualifiés.",
    subcategories: [
      "Réparation de fuites d'eau",
      "Débouchage de canalisations",
      "Installation sanitaire (robinets, douche)",
      "Dépannage électrique urgent",
      "Installation prises et interrupteurs",
      "Réparation de chasse d'eau",
      "Changement de disjoncteurs",
      "Installation d'éclairage"
    ]
  },
  manutention: {
    description: "Services de déménagement et manutention. Transport de meubles, déménagement complet ou partiel, chargement et déchargement, nos équipes sont professionnelles.",
    subcategories: [
      "Déménagement complet d'appartement",
      "Déménagement de bureaux",
      "Transport de meubles volumineux",
      "Chargement / déchargement camion",
      "Manutention événementielle",
      "Évacuation d'encombrants",
      "Débarras de cave ou grenier",
      "Montée / descente de meubles"
    ]
  },
  jardinage: {
    description: "Entretien de jardin et espaces verts. Tonte de pelouse, taille de haies, plantation, entretien régulier, nos jardiniers embellissent votre extérieur.",
    subcategories: [
      "Tonte de pelouse",
      "Taille de haies et arbustes",
      "Désherbage et nettoyage",
      "Plantation de fleurs et plantes",
      "Arrosage et entretien régulier",
      "Élagage d'arbres",
      "Création de massifs",
      "Entretien de potager"
    ]
  },
  couture: {
    description: "Services de couture, retouches et créations sur mesure. Ourlets, reprises, créations de vêtements, nos couturiers et couturières sont expérimentés.",
    subcategories: [
      "Retouches de vêtements (ourlets, taille)",
      "Reprises de déchirures",
      "Création de vêtements sur mesure",
      "Confection de rideaux",
      "Réparation de fermetures éclair",
      "Broderie et personnalisation",
      "Confection de coussins / housses",
      "Customisation de vêtements"
    ]
  },
  cours: {
    description: "Cours particuliers et soutien scolaire à domicile. Toutes matières, tous niveaux. Préparation aux examens (BAC, BEPC), aide aux devoirs, méthodologie.",
    subcategories: [
      "Mathématiques (collège, lycée)",
      "Français (lecture, orthographe, rédaction)",
      "Anglais (conversation, grammaire)",
      "Sciences (SVT, Physique-Chimie)",
      "Histoire-Géographie",
      "Aide aux devoirs primaire",
      "Préparation au BAC",
      "Cours de langues étrangères"
    ]
  },
  cuisine: {
    description: "Services de cuisine et traiteur à domicile. Chef à domicile pour événements, préparation de repas quotidiens, traiteur pour fêtes, nos cuisiniers sont talentueux.",
    subcategories: [
      "Chef à domicile pour événement",
      "Préparation de repas quotidiens",
      "Traiteur pour anniversaire / mariage",
      "Cuisine africaine traditionnelle",
      "Pâtisserie et gâteaux personnalisés",
      "Cuisine diététique / régime",
      "Buffet et cocktails",
      "Cours de cuisine à domicile"
    ]
  },
  evenementiel: {
    description: "Organisation d'événements et animation. Mariages, anniversaires, baptêmes, nos organisateurs gèrent tout : décoration, animation, traiteur, sonorisation.",
    subcategories: [
      "Organisation de mariage",
      "Anniversaire enfant (clown, animation)",
      "Baptême et cérémonie religieuse",
      "Décoration d'événement",
      "Location de matériel (chaises, tentes)",
      "DJ et sonorisation",
      "Animation musicale",
      "Photographie et vidéo événementielle"
    ]
  },
  informatique: {
    description: "Dépannage informatique et assistance technique. Réparation d'ordinateurs, installation de logiciels, récupération de données, configuration réseau, nos techniciens interviennent rapidement.",
    subcategories: [
      "Dépannage PC et ordinateur",
      "Installation de logiciels",
      "Récupération de données perdues",
      "Configuration réseau Wifi",
      "Nettoyage de virus / malwares",
      "Formation informatique seniors",
      "Installation imprimante / scanner",
      "Maintenance et optimisation PC"
    ]
  },
  beaute: {
    description: "Services de beauté et bien-être à domicile. Coiffure, esthétique, manucure, pédicure, massage, nos professionnels vous embellissent chez vous.",
    subcategories: [
      "Coiffure à domicile (coupe, couleur)",
      "Tressage africain (vanilles, nattes)",
      "Manucure et pose de vernis",
      "Pédicure et soins des pieds",
      "Maquillage professionnel (mariage, soirée)",
      "Épilation et soins du visage",
      "Massage et relaxation",
      "Pose d'ongles (gel, acrylique)"
    ]
  },
  auto: {
    description: "Services automobiles et mécanique. Réparation, entretien, diagnostic, lavage, nos mécaniciens et garagistes interviennent à domicile ou en atelier.",
    subcategories: [
      "Révision et vidange",
      "Diagnostic de panne",
      "Réparation moteur",
      "Changement de pneus",
      "Réparation freins et embrayage",
      "Lavage et nettoyage complet",
      "Climatisation auto",
      "Dépannage sur route"
    ]
  },
  garde: {
    description: "Garde d'enfants et baby-sitting à domicile. Garde ponctuelle ou régulière, assistance éducative, nos nounous sont fiables et expérimentées avec les enfants.",
    subcategories: [
      "Garde d'enfant à domicile",
      "Baby-sitting ponctuel (soir, weekend)",
      "Sortie d'école et accompagnement",
      "Garde de nuit",
      "Garde partagée entre familles",
      "Assistance aux devoirs",
      "Garde pendant vacances scolaires",
      "Nounou à temps plein"
    ]
  }
};
