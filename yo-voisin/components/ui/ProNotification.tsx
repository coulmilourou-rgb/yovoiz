import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose: () => void;
}

export function ProNotification({ type, title, message, duration = 5000, onClose }: NotificationProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-500',
      iconColor: 'text-green-600',
      progressColor: 'bg-green-500'
    },
    error: {
      icon: XCircle,
      bgColor: 'from-red-50 to-rose-50',
      borderColor: 'border-red-500',
      iconColor: 'text-red-600',
      progressColor: 'bg-red-500'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'from-amber-50 to-yellow-50',
      borderColor: 'border-amber-500',
      iconColor: 'text-amber-600',
      progressColor: 'bg-amber-500'
    },
    info: {
      icon: Info,
      bgColor: 'from-blue-50 to-sky-50',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-600',
      progressColor: 'bg-blue-500'
    }
  };

  const { icon: Icon, bgColor, borderColor, iconColor, progressColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3, type: 'spring' }}
      className={`fixed top-4 right-4 z-[9999] w-96 max-w-[calc(100vw-2rem)]`}
    >
      <div className={`bg-gradient-to-br ${bgColor} border-l-4 ${borderColor} rounded-lg shadow-2xl overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 ${iconColor}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <motion.div
            className={`h-full ${progressColor}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Hook pour utiliser les notifications
export function useNotification() {
  const [notification, setNotification] = useState<{
    type: NotificationType;
    title: string;
    message: string;
  } | null>(null);

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ type, title, message });
  };

  const NotificationContainer = () => (
    <AnimatePresence>
      {notification && (
        <ProNotification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </AnimatePresence>
  );

  return {
    showNotification,
    NotificationContainer,
    success: (title: string, message: string) => showNotification('success', title, message),
    error: (title: string, message: string) => showNotification('error', title, message),
    warning: (title: string, message: string) => showNotification('warning', title, message),
    info: (title: string, message: string) => showNotification('info', title, message)
  };
}
