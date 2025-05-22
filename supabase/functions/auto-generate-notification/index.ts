
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Sample notification data for different types
const sampleNotifications = {
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

// Types for notifications
type NotificationType = "meal" | "water" | "exercise" | "sleep" | "achievement" | "system"

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all active users
    const { data: users, error: usersError } = await supabase.from("profiles").select("id").limit(100)

    if (usersError) {
      throw usersError
    }

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "No users found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    console.log(`Found ${users.length} users to process for notifications`)

    // Get the current notification type to use (stored in a table)
    let { data: currentTypeData, error: currentTypeError } = await supabase
      .from("notification_settings")
      .select("current_type")
      .single()

    // Default to "meal" if we can't get the current type
    let currentType: NotificationType = "meal"

    if (currentTypeError || !currentTypeData) {
      // If the table or row doesn't exist, create it
      console.log("Creating notification_settings record with default type:", currentType)
      await supabase.from("notification_settings").upsert({ id: 1, current_type: currentType })
    } else {
      currentType = currentTypeData.current_type as NotificationType
      console.log("Using current notification type:", currentType)
    }

    // Determine the next type to use
    const types: NotificationType[] = ["meal", "water", "exercise", "sleep", "achievement", "system"]
    const currentIndex = types.indexOf(currentType)
    const nextType = types[(currentIndex + 1) % types.length]

    console.log(`Next notification type will be: ${nextType}`)

    // Generate exactly one notification per user of the current type
    const notificationsToInsert = []

    for (const user of users) {
      // Select a random notification from the current type
      const notifications = sampleNotifications[currentType]
      const randomIndex = Math.floor(Math.random() * notifications.length)
      const { title, message } = notifications[randomIndex]

      notificationsToInsert.push({
        user_id: user.id,
        title,
        message,
        type: currentType,
        is_read: false,
      })
    }

    console.log(`Prepared ${notificationsToInsert.length} notifications to insert`)

    // Insert the notifications
    const { error: insertError } = await supabase.from("notifications").insert(notificationsToInsert)

    if (insertError) {
      throw insertError
    }

    // Update the current type for next time
    const { error: updateError } = await supabase
      .from("notification_settings")
      .update({ current_type: nextType })
      .eq("id", 1)

    if (updateError) {
      throw updateError
    }

    console.log("Notifications successfully generated and notification_settings updated")

    return new Response(
      JSON.stringify({
        success: true,
        message: `Generated ${notificationsToInsert.length} notifications of type "${currentType}" for ${users.length} users. Next type will be "${nextType}".`,
        count: notificationsToInsert.length,
        type: currentType,
        nextType: nextType,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Error in auto-generate-notification:", error)
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})
