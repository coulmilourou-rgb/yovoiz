import { useEffect } from 'react';

/**
 * Hook personnalisé pour mettre à jour le titre de la page
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const fullTitle = title.includes('Yo!Voiz') ? title : `${title} | Yo!Voiz`;
    document.title = fullTitle;
    
    return () => {
      // Optionnel : restaurer le titre par défaut
      document.title = 'Yo!Voiz';
    };
  }, [title]);
}
