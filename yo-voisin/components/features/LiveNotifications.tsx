'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';

interface LiveNotification {
  id: number;
  user: string;
  service: string;
  commune: string;
  timeAgo: string;
}

const notifications: LiveNotification[] = [
  { id: 1, user: 'Awa K.', service: 'un service de ménage', commune: 'Cocody', timeAgo: 'il y a 2 min' },
  { id: 2, user: 'Ibrahim T.', service: 'un bricoleur', commune: 'Marcory', timeAgo: 'il y a 5 min' },
  { id: 3, user: 'Fatou D.', service: 'une livraison', commune: 'Plateau', timeAgo: 'il y a 8 min' },
  { id: 4, user: 'Kouassi M.', service: 'un plombier', commune: 'Yopougon', timeAgo: 'il y a 12 min' },
];

export const LiveNotifications = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!hasShown) {
      setHasShown(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasShown]);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const current = notifications[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-24 left-1/2 z-30 bg-white rounded-yo-lg shadow-yo-xl p-4 max-w-sm"
        >
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 w-6 h-6 hover:bg-yo-gray-100 rounded-full flex items-center justify-center text-yo-gray-400"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yo-green-pale rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-yo-green" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-yo-gray-800 mb-1">
                Service en cours 🔥
              </p>
              <p className="text-sm text-yo-gray-600">
                <strong>{current.user}</strong> a trouvé {current.service} à{' '}
                <strong>{current.commune}</strong>
              </p>
              <p className="text-xs text-yo-gray-400 mt-1">{current.timeAgo}</p>
            </div>
          </div>

          {/* Progress bar */}
          <motion.div
            className="h-1 bg-yo-green rounded-full mt-3"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
