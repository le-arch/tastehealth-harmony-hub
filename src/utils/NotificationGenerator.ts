
import { supabase } from '@/lib/SupabaseClient';

export interface NotificationData {
  type: 'meal' | 'hydration' | 'exercise' | 'streak' | 'challenge' | 'achievement';
  title: string;
  message: string;
  data?: any;
}

class NotificationGenerator {
  private static instance: NotificationGenerator;
  
  private constructor() {}
  
  public static getInstance(): NotificationGenerator {
    if (!NotificationGenerator.instance) {
      NotificationGenerator.instance = new NotificationGenerator();
    }
    return NotificationGenerator.instance;
  }

  async generateMealReminder(userId: string): Promise<boolean> {
    const reminders = [
      {
        title: "Time for Breakfast! 🍳",
        message: "Start your day with a nutritious breakfast. Don't forget to log it!",
      },
      {
        title: "Lunch Break! 🥗",
        message: "Time for a healthy lunch. Remember to include vegetables!",
      },
      {
        title: "Dinner Time! 🍽️",
        message: "Enjoy a balanced dinner. Don't forget to track your meal!",
      }
    ];

    const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];
    
    return this.createNotification(userId, {
      type: 'meal',
      title: randomReminder.title,
      message: randomReminder.message,
      data: { timestamp: new Date().toISOString() }
    });
  }

  async generateHydrationReminder(userId: string): Promise<boolean> {
    const reminders = [
      {
        title: "Stay Hydrated! 💧",
        message: "Time to drink some water. Your body will thank you!",
      },
      {
        title: "Water Break! 🚰",
        message: "Don't forget to stay hydrated throughout the day.",
      }
    ];

    const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];
    
    return this.createNotification(userId, {
      type: 'hydration',
      title: randomReminder.title,
      message: randomReminder.message,
      data: { timestamp: new Date().toISOString() }
    });
  }

  async generateStreakCelebration(userId: string, streakDays: number): Promise<boolean> {
    let title = "Great Job! 🔥";
    let message = `You're on a ${streakDays} day streak! Keep it going!`;

    if (streakDays >= 7) {
      title = "Week Streak! 🌟";
      message = `Amazing! You've maintained a ${streakDays} day streak!`;
    } else if (streakDays >= 30) {
      title = "Month Streak! 🏆";
      message = `Incredible! ${streakDays} days of consistency!`;
    }

    return this.createNotification(userId, {
      type: 'streak',
      title,
      message,
      data: { streakDays, timestamp: new Date().toISOString() }
    });
  }

  async generateChallengeNotification(userId: string, challengeTitle: string): Promise<boolean> {
    return this.createNotification(userId, {
      type: 'challenge',
      title: "New Challenge Available! 🎯",
      message: `Check out the new challenge: ${challengeTitle}`,
      data: { challengeTitle, timestamp: new Date().toISOString() }
    });
  }

  async generateAchievementNotification(userId: string, achievementName: string): Promise<boolean> {
    return this.createNotification(userId, {
      type: 'achievement',
      title: "Achievement Unlocked! 🏅",
      message: `Congratulations! You've earned: ${achievementName}`,
      data: { achievementName, timestamp: new Date().toISOString() }
    });
  }

  private async createNotification(userId: string, notificationData: NotificationData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data || {},
          is_read: false
        });

      if (error) {
        console.error('Error creating notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createNotification:', error);
      return false;
    }
  }

  async generateDailyMotivation(userId: string): Promise<boolean> {
    const motivations = [
      {
        title: "Daily Motivation 💪",
        message: "Every healthy choice you make today is an investment in your future self!",
      },
      {
        title: "You've Got This! 🌟",
        message: "Small steps every day lead to big changes. Keep going!",
      },
      {
        title: "Healthy Habits 🌱",
        message: "Building healthy habits one day at a time. You're doing great!",
      }
    ];

    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    
    return this.createNotification(userId, {
      type: 'meal',
      title: randomMotivation.title,
      message: randomMotivation.message,
      data: { type: 'motivation', timestamp: new Date().toISOString() }
    });
  }
}

export default NotificationGenerator;
