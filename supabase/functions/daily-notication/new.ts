import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Types for notifications
type NotificationType =
  | "meal"
  | "water"
  | "exercise"
  | "sleep"
  | "achievement"
  | "system";

// Sample notification templates for each type
const notificationTemplates = {
  meal: [
    {
      title: "Meal Planning Reminder",
      message:
        "Have you planned your meals for tomorrow? A little preparation goes a long way!",
    },
    {
      title: "Balanced Nutrition Tip",
      message:
        "Try to include protein, healthy fats, and complex carbs in your next meal for balanced nutrition.",
    },
    {
      title: "Mindful Eating Reminder",
      message:
        "Remember to eat slowly and mindfully today. It improves digestion and satisfaction!",
    },
  ],
  water: [
    {
      title: "Hydration Check-in",
      message:
        "Have you had enough water today? Staying hydrated improves energy and focus.",
    },
    {
      title: "Water Goal Reminder",
      message:
        "You're halfway through the day. How's your water intake looking?",
    },
    {
      title: "Hydration Tip",
      message:
        "Try keeping a water bottle with you throughout the day to make hydration easier.",
    },
  ],
  exercise: [
    {
      title: "Movement Break",
      message:
        "Take a quick 5-minute movement break to energize your body and mind!",
    },
    {
      title: "Activity Reminder",
      message:
        "Even a short walk can boost your mood and energy. Can you fit one in today?",
    },
    {
      title: "Exercise Motivation",
      message:
        "Remember: exercise is a celebration of what your body can do, not a punishment.",
    },
  ],
  sleep: [
    {
      title: "Sleep Preparation",
      message:
        "Start winding down an hour before bed for better sleep quality tonight.",
    },
    {
      title: "Sleep Routine Reminder",
      message:
        "Consistent sleep and wake times help optimize your body's natural rhythms.",
    },
    {
      title: "Sleep Environment Tip",
      message:
        "Keep your bedroom cool, dark, and quiet for the best sleep quality.",
    },
  ],
  achievement: [
    {
      title: "Daily Progress Check",
      message:
        "You're making progress every day. Keep going with your health journey!",
    },
    {
      title: "Habit Building",
      message:
        "Small, consistent actions build powerful habits. What healthy habit are you building today?",
    },
    {
      title: "Celebrate Small Wins",
      message:
        "Take a moment to acknowledge the healthy choices you've made today!",
    },
  ],
  system: [
    {
      title: "App Tip",
      message:
        "Have you explored all the features in your nutrition dashboard? There might be helpful tools you haven't discovered yet!",
    },
    {
      title: "Feature Reminder",
      message:
        "Don't forget to check your progress charts to see how far you've come!",
    },
    {
      title: "Data Update",
      message:
        "Your weekly nutrition summary is available. Check it out to see your patterns!",
    },
  ],
};

serve(async (req) => {
  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active users
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id")
      .limit(100);

    if (usersError) {
      throw usersError;
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No users found" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get the current date to check if we've already sent notifications today
    const today = new Date().toISOString().split("T")[0];

    // Check if we've already sent notifications today
    const { data: notificationLog, error: logError } = await supabase
      .from("notification_logs")
      .select("*")
      .eq("notification_date", today)
      .maybeSingle();

    if (logError) {
      console.error("Error checking notification log:", logError);
    }

    if (notificationLog) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Notifications already sent today",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Generate one notification of each type for each user
    const notificationTypes: NotificationType[] = [
      "meal",
      "water",
      "exercise",
      "sleep",
      "achievement",
      "system",
    ];
    const notificationsToInsert = [];

    for (const user of users) {
      for (const type of notificationTypes) {
        // Select a random notification from the current type
        const templates = notificationTemplates[type];
        const randomIndex = Math.floor(Math.random() * templates.length);
        const { title, message } = templates[randomIndex];

        notificationsToInsert.push({
          user_id: user.id,
          title,
          message,
          type,
          is_read: false,
        });
      }
    }

    // Insert the notifications
    const { error: insertError } = await supabase
      .from("notifications")
      .insert(notificationsToInsert);

    if (insertError) {
      throw insertError;
    }

    // Log that we've sent notifications today
    await supabase.from("notification_logs").insert({
      notification_date: today,
      count: notificationsToInsert.length,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Generated ${notificationsToInsert.length} notifications for ${users.length} users.`,
        count: notificationsToInsert.length,
        types: notificationTypes,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
