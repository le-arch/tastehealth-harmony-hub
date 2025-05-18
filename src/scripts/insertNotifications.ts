import { supabase } from "@/lib/SupabaseClient"
import type { NotificationType } from "@/services/notificationService"

// Sample notification data for different types
const notificationTemplates = {
  meal: [
    {
      title: "Meal Plan Reminder",
      message: "Don't forget to prepare your lunch according to your meal plan today!",
    },
    {
      title: "New Recipe Available",
      message: "We've added a new healthy recipe that matches your preferences. Check it out!",
    },
    {
      title: "Meal Tracking Reminder",
      message: "You haven't logged your breakfast today. Did you forget to track it?",
    },
    {
      title: "Weekly Meal Plan Ready",
      message: "Your personalized weekly meal plan is now ready. View it now!",
    },
    {
      title: "Meal Prep Day",
      message: "Today is your scheduled meal prep day. Get your containers ready!",
    },
    {
      title: "Nutrition Goal Progress",
      message: "You're 80% of the way to your daily protein goal. Keep it up!",
    },
    {
      title: "Recipe Recommendation",
      message: "Based on your preferences, we think you'll love this new chicken recipe!",
    },
  ],
  water: [
    {
      title: "Hydration Reminder",
      message: "You're 3 cups behind your daily water goal. Time to hydrate!",
    },
    {
      title: "Hydration Goal Achieved",
      message: "Congratulations! You've reached your daily water intake goal.",
    },
    {
      title: "Hydration Streak",
      message: "You've maintained your hydration goals for 5 days in a row!",
    },
    {
      title: "Morning Hydration",
      message: "Start your day right with a glass of water. Have you had your first glass yet?",
    },
    {
      title: "Hydration Tip",
      message: "Try adding lemon or cucumber to your water for a refreshing twist!",
    },
    {
      title: "Afternoon Hydration Check",
      message: "It's mid-afternoon. Have you been drinking enough water today?",
    },
    {
      title: "Hydration and Exercise",
      message: "Remember to hydrate before, during, and after your workout today!",
    },
  ],
  exercise: [
    {
      title: "Workout Reminder",
      message: "It's time for your scheduled workout. Get moving!",
    },
    {
      title: "Exercise Goal Achieved",
      message: "Great job! You've reached your weekly exercise goal.",
    },
    {
      title: "New Workout Plan",
      message: "We've updated your workout plan based on your progress.",
    },
    {
      title: "Active Minutes Goal",
      message: "You're just 15 minutes away from reaching your active minutes goal for today!",
    },
    {
      title: "Rest Day Reminder",
      message: "Today is your scheduled rest day. Focus on recovery and stretching.",
    },
    {
      title: "Workout Streak",
      message: "You've completed workouts for 3 days in a row. Keep the momentum going!",
    },
    {
      title: "New Exercise Unlocked",
      message: "We've added new exercises to your routine based on your progress!",
    },
  ],
  sleep: [
    {
      title: "Sleep Schedule Reminder",
      message: "Time to prepare for bed to meet your sleep goal tonight.",
    },
    {
      title: "Sleep Quality Improved",
      message: "Your sleep quality has improved by 15% this week!",
    },
    {
      title: "Sleep Goal Achieved",
      message: "You've met your sleep goal for 3 consecutive nights!",
    },
    {
      title: "Sleep Tracking Reminder",
      message: "Don't forget to log your sleep from last night.",
    },
    {
      title: "Sleep Tip",
      message: "Try avoiding screens an hour before bedtime for better sleep quality.",
    },
    {
      title: "Sleep and Recovery",
      message: "Good sleep is essential for muscle recovery after yesterday's workout.",
    },
    {
      title: "Sleep Environment",
      message: "Keep your bedroom cool and dark for optimal sleep quality tonight.",
    },
  ],
  achievement: [
    {
      title: "New Badge Unlocked",
      message: "You've earned the 'Nutrition Expert' badge for consistent healthy eating!",
    },
    {
      title: "Weekly Challenge Completed",
      message: "Congratulations on completing this week's nutrition challenge!",
    },
    {
      title: "Milestone Reached",
      message: "You've logged 50 meals in the app! Keep up the great work!",
    },
    {
      title: "Level Up!",
      message: "You've reached Level 5! Check out your new rewards and benefits.",
    },
    {
      title: "Streak Achievement",
      message: "You've maintained a 10-day streak of logging your meals. Amazing discipline!",
    },
    {
      title: "Points Milestone",
      message: "You've earned 1000 points! You're making incredible progress.",
    },
    {
      title: "Leaderboard Position",
      message: "You've moved up to the top 10% on the nutrition leaderboard!",
    },
  ],
  system: [
    {
      title: "App Update Available",
      message: "A new version of the app is available with exciting features!",
    },
    {
      title: "Profile Completion",
      message: "Your profile is 80% complete. Add more details to get personalized recommendations.",
    },
    {
      title: "Weekly Summary Ready",
      message: "Your weekly health and nutrition summary is now available.",
    },
    {
      title: "Account Security",
      message: "We recommend updating your password for enhanced security.",
    },
    {
      title: "New Feature Available",
      message: "Check out our new meal planning wizard to create personalized meal plans!",
    },
    {
      title: "Data Backup Complete",
      message: "Your nutrition and health data has been successfully backed up.",
    },
    {
      title: "Subscription Renewal",
      message: "Your premium subscription will renew in 3 days. Enjoy continued access to all features!",
    },
  ],
}

/**
 * Insert a notification for a specific user
 */
export const insertNotification = async (userId: string, type: NotificationType, index?: number): Promise<boolean> => {
  try {
    const notifications = notificationTemplates[type]
    const notificationIndex = index !== undefined ? index : Math.floor(Math.random() * notifications.length)
    const { title, message } = notifications[notificationIndex]

    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      type,
      is_read: false,
    })

    if (error) {
      console.error("Error inserting notification:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error inserting notification:", error)
    return false
  }
}

/**
 * Insert all notification types for a specific user
 */
export const insertAllNotificationTypes = async (userId: string): Promise<boolean> => {
  try {
    const types = Object.keys(notificationTemplates) as NotificationType[]

    for (const type of types) {
      await insertNotification(userId, type)
    }

    return true
  } catch (error) {
    console.error("Error inserting all notification types:", error)
    return false
  }
}

/**
 * Insert multiple notifications of each type for a specific user
 */
export const insertMultipleNotifications = async (userId: string, count = 3): Promise<boolean> => {
  try {
    const types = Object.keys(notificationTemplates) as NotificationType[]

    for (const type of types) {
      for (let i = 0; i < count; i++) {
        await insertNotification(userId, type)
      }
    }

    return true
  } catch (error) {
    console.error("Error inserting multiple notifications:", error)
    return false
  }
}

// Example usage:
// To use this script, you can import it and call the functions like this:
//
// import { insertAllNotificationTypes } from './scripts/insertNotifications'
//
// // Get the current user ID
// const { data } = await supabase.auth.getUser()
// const userId = data.user?.id
//
// if (userId) {
//   await insertAllNotificationTypes(userId)
// }
