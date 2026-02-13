import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  illustration?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  illustration,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}
    >
      {/* Illustration ou icône */}
      {illustration ? (
        <motion.img
          src={illustration}
          alt={title}
          className="w-64 h-64 mb-6 object-contain"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        />
      ) : icon ? (
        <motion.div
          className="w-20 h-20 mx-auto mb-6 text-yo-gray-400 flex items-center justify-center rounded-full bg-yo-gray-100"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {icon}
        </motion.div>
      ) : null}

      {/* Titre */}
      <motion.h3
        className="font-display font-bold text-2xl text-yo-gray-800 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          className="text-yo-gray-600 mb-6 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {description}
        </motion.p>
      )}

      {/* Action */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button variant={action.variant || 'primary'} onClick={action.onClick}>
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Presets pour cas d'usage courants
export const EmptyMissions = ({ onCreateMission }: { onCreateMission: () => void }) => (
  <EmptyState
    icon={
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    }
    title="Aucune mission pour le moment"
    description="Créez votre première demande et recevez des propositions de prestataires qualifiés en quelques minutes !"
    action={{
      label: 'Créer une demande',
      onClick: onCreateMission,
      variant: 'primary',
    }}
  />
);

export const EmptyOpportunities = () => (
  <EmptyState
    icon={
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    }
    title="Aucune opportunité disponible"
    description="Revenez plus tard ou ajustez vos filtres pour voir plus d'opportunités."
  />
);

export const EmptyNotifications = () => (
  <EmptyState
    icon={
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    }
    title="Aucune notification"
    description="Vous êtes à jour ! Nous vous informerons dès qu'il y aura du nouveau."
  />
);

export const EmptySearch = ({ searchTerm }: { searchTerm: string }) => (
  <EmptyState
    icon={
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
      </svg>
    }
    title={`Aucun résultat pour "${searchTerm}"`}
    description="Essayez avec d'autres mots-clés ou vérifiez l'orthographe."
  />
);
