'use client';

import { useEffect } from 'react';

interface PageHeadProps {
  title: string;
  description?: string;
}

/**
 * Composant pour mettre à jour le titre de la page dynamiquement
 * Utilisable dans les pages client-side
 */
export function PageHead({ title, description }: PageHeadProps) {
  useEffect(() => {
    // Mettre à jour le titre
    const fullTitle = title.includes('Yo!Voiz') ? title : `${title} | Yo!Voiz`;
    document.title = fullTitle;

    // Mettre à jour la meta description si fournie
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}
