import React from 'react';
import { createNotification } from "@/services/notificationService";

// Sample notification data for different types
const sampleNotifications = {
  meal: [
    {
      title: "Meal Plan Reminder",
      message:
        "Don't forget to prepare your lunch according to your meal plan today!",
    },
    {
      title: "New Recipe Available",
      message:
        "We've added a new healthy recipe that matches your preferences. Check it out!",
    },
    {
      title: "Meal Tracking Reminder",
      message:
        "You haven't logged your breakfast today. Did you forget to track it?",
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
  ],
  achievement: [
    {
      title: "New Badge Unlocked",
      message:
        "You've earned the 'Nutrition Expert' badge for consistent healthy eating!",
    },
    {
      title: "Weekly Challenge Completed",
      message: "Congratulations on completing this week's nutrition challenge!",
    },
    {
      title: "Milestone Reached",
      message: "You've logged 50 meals in the app! Keep up the great work!",
    },
  ],
  system: [
    {
      title: "App Update Available",
      message: "A new version of the app is available with exciting features!",
    },
    {
      title: "Profile Completion",
      message:
        "Your profile is 80% complete. Add more details to get personalized recommendations.",
    },
    {
      title: "Weekly Summary Ready",
      message: "Your weekly health and nutrition summary is now available.",
    },
  ],
};

/**
 * Generate a random notification of a specific type
 */
export const generateRandomNotification = async (
  type: keyof typeof sampleNotifications
): Promise<boolean> => {
  const notifications = sampleNotifications[type];
  const randomIndex = Math.floor(Math.random() * notifications.length);
  const { title, message } = notifications[randomIndex];

  return await createNotification(title, message, type);
};

/**
 * Generate a set of random notifications for testing
 */
export const generateSampleNotifications = async (
  count = 5
): Promise<boolean> => {
  try {
    const types = Object.keys(sampleNotifications) as Array<
      keyof typeof sampleNotifications
    >;

    for (let i = 0; i < count; i++) {
      const randomType = types[Math.floor(Math.random() * types.length)];
      await generateRandomNotification(randomType);
    }

    return true;
  } catch (error) {
    console.error("Error generating sample notifications:", error);
    return false;
  }
};
