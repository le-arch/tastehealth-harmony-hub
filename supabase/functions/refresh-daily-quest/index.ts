import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Get all daily quests
    const { data: dailyQuests, error: questsError } = await supabaseClient
      .from("quests")
      .select("id")
      .eq("quest_type", "daily");

    if (questsError) throw questsError;

    // Get all users
    const { data: users, error: usersError } = await supabaseClient
      .from("user_points")
      .select("user_id");

    if (usersError) throw usersError;

    // For each user, check if they have active daily quests
    // If not, create new ones for them
    const results = [];
    for (const user of users) {
      // Get user's active daily quests
      const { data: activeQuests, error: activeQuestsError } =
        await supabaseClient
          .from("user_quests")
          .select("quest_id")
          .eq("user_id", user.user_id)
          .eq("completed", false)
          .in(
            "quest_id",
            dailyQuests.map((q) => q.id)
          );

      if (activeQuestsError) throw activeQuestsError;

      // If user has no active daily quests, assign them new ones
      if (activeQuests.length === 0) {
        // Get random daily quests (up to 3)
        const shuffledQuests = [...dailyQuests].sort(() => 0.5 - Math.random());
        const questsToAssign = shuffledQuests.slice(0, 3);

        // Assign quests to user
        for (const quest of questsToAssign) {
          const { data, error } = await supabaseClient
            .from("user_quests")
            .insert({
              user_id: user.user_id,
              quest_id: quest.id,
              current_step: 0,
              completed: false,
              started_at: new Date().toISOString(),
            });

          if (error) throw error;
          results.push({
            user_id: user.user_id,
            quest_id: quest.id,
            status: "assigned",
          });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Daily quests refreshed",
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
