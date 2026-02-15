'use client';

import { useState, useCallback } from 'react';
import { ToastContainer } from '@/components/ui/Toast';

export type NotificationType = 'success' | 'error' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: NotificationType;
}

export function useNotification() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: NotificationType = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message: string) => {
    addToast(message, 'success');
  }, [addToast]);

  const error = useCallback((message: string) => {
    addToast(message, 'error');
  }, [addToast]);

  const warning = useCallback((message: string) => {
    addToast(message, 'warning');
  }, [addToast]);

  const NotificationContainer = useCallback(() => {
    return <ToastContainer toasts={toasts} onRemove={removeToast} />;
  }, [toasts, removeToast]);

  return {
    success,
    error,
    warning,
    NotificationContainer
  };
}
