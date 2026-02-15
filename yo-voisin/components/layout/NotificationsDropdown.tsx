'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Notification } from '@/lib/types';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  countUnreadNotifications,
} from '@/lib/notifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationsDropdownProps {
  userId: string;
}

export function NotificationsDropdown({ userId }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Charger les notifications au montage
  useEffect(() => {
    if (userId) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [userId]);

  // Fermer le dropdown si clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  async function loadNotifications() {
    setLoading(true);
    const data = await fetchNotifications(userId);
    setNotifications(data);
    setLoading(false);
  }

  async function loadUnreadCount() {
    const count = await countUnreadNotifications(userId);
    setUnreadCount(count);
  }

  async function handleMarkAsRead(notificationId: string) {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }

  async function handleMarkAllAsRead() {
    const success = await markAllNotificationsAsRead(userId);
    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  }

  async function handleDelete(notificationId: string) {
    const success = await deleteNotification(notificationId);
    if (success) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      // Recompter les non lues
      const newUnreadCount = notifications.filter(
        (n) => n.id !== notificationId && !n.is_read
      ).length;
      setUnreadCount(newUnreadCount);
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'new_quote':
        return '💰';
      case 'quote_accepted':
        return '✅';
      case 'quote_rejected':
        return '❌';
      case 'mission_completed':
        return '🎉';
      case 'payment_received':
        return '💸';
      case 'new_message':
        return '💬';
      case 'dispute_opened':
        return '⚠️';
      default:
        return '🔔';
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton Cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-yo-gray-100 transition"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-yo-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-yo-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-yo-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-yo-gray-200 flex items-center justify-between bg-yo-gray-50">
            <h3 className="font-bold text-yo-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-yo-primary hover:text-yo-primary-dark font-medium transition"
                  title="Marquer tout comme lu"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-yo-gray-500 hover:text-yo-gray-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yo-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <Bell className="w-12 h-12 text-yo-gray-300 mb-3" />
                <p className="text-yo-gray-500 text-sm">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-yo-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 transition group relative ${
                      notification.is_read
                        ? 'bg-white hover:bg-yo-gray-50'
                        : 'bg-yo-primary/5 hover:bg-yo-primary/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icône type */}
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-yo-gray-900 text-sm">
                          {notification.title}
                        </p>
                        <p className="text-yo-gray-600 text-sm mt-0.5 line-clamp-2">
                          {notification.body}
                        </p>
                        <p className="text-xs text-yo-gray-500 mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 rounded hover:bg-yo-gray-200 transition"
                            title="Marquer comme lu"
                          >
                            <Check className="w-4 h-4 text-yo-primary" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 rounded hover:bg-red-100 transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Indicateur non lu */}
                    {!notification.is_read && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-yo-primary rounded-r"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-yo-gray-200 bg-yo-gray-50">
              <button
                onClick={handleMarkAllAsRead}
                className="w-full text-center text-sm text-yo-primary hover:text-yo-primary-dark font-medium transition"
              >
                Marquer tout comme lu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
