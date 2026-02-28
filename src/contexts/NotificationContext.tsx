import React, { createContext, useContext, useState, useCallback } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'water' | 'achievement' | 'meal' | 'reminder' | 'info';
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
  const [notifications, setNotifications] = useState<Notification[]>([
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
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      isRead: false,
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);

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
