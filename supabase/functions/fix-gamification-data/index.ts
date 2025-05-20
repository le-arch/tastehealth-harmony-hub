import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the session of the authenticated user
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user_points table exists
    const { data: userPointsExists, error: tableCheckError } =
      await supabaseClient.rpc("check_table_exists", {
        table_name: "user_points",
      });

    if (tableCheckError) {
      throw tableCheckError;
    }

    // If user_points table doesn't exist, create it
    if (!userPointsExists) {
      const { error: createTableError } = await supabaseClient.rpc(
        "create_user_points_table"
      );
      if (createTableError) {
        throw createTableError;
      }
    }

    // Check if the user has a points record
    const { data: userPoints, error: userPointsError } = await supabaseClient
      .from("user_points")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (userPointsError && userPointsError.code !== "PGRST116") {
      throw userPointsError;
    }

    // If user doesn't have a points record, create one
    if (!userPoints) {
      const { error: insertError } = await supabaseClient
        .from("user_points")
        .insert({
          user_id: session.user.id,
          total_points: 0,
          level: 1,
        });

      if (insertError) {
        throw insertError;
      }
    }

    // Check if the user's level is correct based on their points
    if (userPoints) {
      const { data: calculatedLevel, error: levelError } =
        await supabaseClient.rpc("calculate_user_level", {
          points: userPoints.total_points,
        });

      if (levelError) {
        throw levelError;
      }

      // If level is incorrect, update it
      if (calculatedLevel !== userPoints.level) {
        const { error: updateError } = await supabaseClient
          .from("user_points")
          .update({ level: calculatedLevel })
          .eq("id", userPoints.id);

        if (updateError) {
          throw updateError;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Gamification data checked and fixed if needed",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
