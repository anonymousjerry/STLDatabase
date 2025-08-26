import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Model } from '../sanity/types';
import websocketService, { ScrapingEvent } from '../lib/websocketService';

interface ScrapingNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  model?: Partial<Model>;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: ScrapingNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<ScrapingNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<ScrapingNotification[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [audio] = useState<HTMLAudioElement | null>(
    typeof window !== 'undefined' ? new Audio('/notification-sound.mp3') : null
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  // Play notification sound
  const playNotificationSound = () => {
    if (isSoundEnabled && audio) {
      audio.play().catch(console.error);
    }
  };

  // Add new notification
  const addNotification = (notification: Omit<ScrapingNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: ScrapingNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep last 20 notifications
    playNotificationSound();
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Toggle sound
  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  // Handle WebSocket events
  useEffect(() => {
    const handleModelScraped = (event: ScrapingEvent) => {
      addNotification({
        type: 'success',
        title: 'Model Scraped Successfully',
        message: `New model "${event.data.model?.title || 'Unknown'}" has been scraped and added to the database.`,
        model: event.data.model,
      });
    };

    const handleScrapingStarted = (event: ScrapingEvent) => {
      addNotification({
        type: 'info',
        title: 'Scraping Started',
        message: `Scraping job started for ${event.data.platform || 'platform'}.`,
      });
    };

    const handleScrapingCompleted = (event: ScrapingEvent) => {
      addNotification({
        type: 'success',
        title: 'Scraping Completed',
        message: `Scraping job completed successfully for ${event.data.platform || 'platform'}.`,
      });
    };

    const handleScrapingError = (event: ScrapingEvent) => {
      addNotification({
        type: 'error',
        title: 'Scraping Error',
        message: event.data.message || 'An error occurred during scraping.',
      });
    };

    // Subscribe to WebSocket events
    websocketService.on('model_scraped', handleModelScraped);
    websocketService.on('scraping_started', handleScrapingStarted);
    websocketService.on('scraping_completed', handleScrapingCompleted);
    websocketService.on('scraping_error', handleScrapingError);

    // Cleanup on unmount
    return () => {
      websocketService.off('model_scraped', handleModelScraped);
      websocketService.off('scraping_started', handleScrapingStarted);
      websocketService.off('scraping_completed', handleScrapingCompleted);
      websocketService.off('scraping_error', handleScrapingError);
    };
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('scraping-notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scraping-notifications');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setNotifications(parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          })));
        } catch (error) {
          console.error('Error loading notifications from localStorage:', error);
        }
      }
    }
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    isSoundEnabled,
    toggleSound,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to use notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
