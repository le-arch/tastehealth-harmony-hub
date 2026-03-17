import React, { createContext, useContext, useState, useCallback } from "react";
import { playNotificationSound } from "@/utils/sounds";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'water' | 'achievement' | 'meal' | 'reminder' | 'info' | 'success';
  isRead: boolean;
  timestamp: Date;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // try to load persisted notifications first
    const stored = localStorage.getItem('th_notifications');
    if (stored) {
      try {
        const parsed: any[] = JSON.parse(stored);
        return parsed.map(n => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      } catch {
        // fall through to default
      }
    }

    // default sample data (summy data) for first-time users
    return [
      {
        id: '1',
        title: 'Water Reminder',
        message: "Don't forget to drink water! You're 2 cups behind your goal.",
        type: 'water',
        isRead: false,
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: '2',
        title: 'New Badge Earned',
        message: "Congratulations! You've earned the 'Protein Champion' badge.",
        type: 'achievement',
        isRead: false,
        timestamp: new Date(Date.now() - 7200000),
      },
      {
        id: '3',
        title: 'Meal Plan Updated',
        message: 'Your meal plan for the week has been updated.',
        type: 'meal',
        isRead: false,
        timestamp: new Date(Date.now() - 86400000),
      },
      {
        id: '4',
        title: 'Achievement Unlocked!',
        message: "You've completed 5 consecutive days of logging your meals.",
        type: 'achievement',
        isRead: false,
        timestamp: new Date(Date.now() - 172800000),
      },
      {
        id: '5',
        title: 'Reminder: Step Goal',
        message: 'You are 1,500 steps away from hitting your daily target.',
        type: 'reminder',
        isRead: false,
        timestamp: new Date(Date.now() - 259200000),
      },
      {
        id: '6',
        title: 'Info',
        message: 'New recipe suggestions are available in the meal planner.',
        type: 'info',
        isRead: false,
        timestamp: new Date(Date.now() - 345600000),
      },
    ];
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      isRead: false,
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    playNotificationSound();

    // Persist to localStorage
    const stored = JSON.parse(localStorage.getItem('th_notifications') || '[]');
    localStorage.setItem('th_notifications', JSON.stringify([newNotification, ...stored]));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('th_notifications');
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
