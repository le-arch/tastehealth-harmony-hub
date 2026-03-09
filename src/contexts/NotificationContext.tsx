import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getLS, LS_KEYS, CalorieEntry, SleepEntry, ExerciseEntry, HydrationEntry } from "@/utils/localStorage";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'water' | 'achievement' | 'meal' | 'reminder' | 'info' | 'weekly_summary';
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
  sendWeeklySummary: () => void;
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

  const sendWeeklySummary = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);

    const calories = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []).filter(e => new Date(e.date) >= weekAgo);
    const sleep = getLS<SleepEntry[]>(LS_KEYS.SLEEP_LOG, []).filter(e => new Date(e.date) >= weekAgo);
    const exercise = getLS<ExerciseEntry[]>(LS_KEYS.EXERCISE_LOG, []).filter(e => new Date(e.date) >= weekAgo);
    const hydration = getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []).filter(e => new Date(e.date) >= weekAgo);

    const totalCal = calories.reduce((s, e) => s + e.calories, 0);
    const avgCal = calories.length ? Math.round(totalCal / 7) : 0;
    const totalSleep = sleep.reduce((s, e) => s + e.hours, 0);
    const avgSleep = sleep.length ? (totalSleep / sleep.length).toFixed(1) : '0';
    const totalExercise = exercise.reduce((s, e) => s + e.duration, 0);
    const totalWater = hydration.reduce((s, e) => s + e.cups, 0);

    const summaryMessage = `Weekly Summary: ${totalCal} total calories (${avgCal}/day), ${totalWater} cups water, ${totalExercise}min exercise, ${avgSleep}hrs sleep avg. Great job staying consistent!`;

    const weeklyNotification: Notification = {
      id: crypto.randomUUID(),
      title: '📊 Weekly Health Summary',
      message: summaryMessage,
      type: 'weekly_summary',
      isRead: false,
      timestamp: new Date(),
    };

    setNotifications(prev => [weeklyNotification, ...prev]);
    const stored = JSON.parse(localStorage.getItem('th_notifications') || '[]');
    localStorage.setItem('th_notifications', JSON.stringify([weeklyNotification, ...stored]));
    localStorage.setItem(LS_KEYS.WEEKLY_SUMMARY_SENT, new Date().toISOString());
  }, []);

  useEffect(() => {
    const lastSent = localStorage.getItem(LS_KEYS.WEEKLY_SUMMARY_SENT);
    if (!lastSent) {
      const now = new Date();
      if (now.getDay() === 0) {
        sendWeeklySummary();
      }
    } else {
      const lastSentDate = new Date(lastSent);
      const now = new Date();
      const daysSinceLastSent = Math.floor((now.getTime() - lastSentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastSent >= 7 && now.getDay() === 0) {
        sendWeeklySummary();
      }
    }
  }, [sendWeeklySummary]);

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
        sendWeeklySummary,
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
