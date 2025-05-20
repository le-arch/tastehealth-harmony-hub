// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/examples/supabase-functions

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
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get request body if any
    let userId = null;
    try {
      const body = await req.json();
      userId = body.user_id;
    } catch (e) {
      // No body or invalid JSON
    }

    // Get all active users or specific user if provided
    let usersQuery = supabaseClient.from("profiles").select("id, user_id");

    if (userId) {
      usersQuery = usersQuery.eq("user_id", userId);
    }

    const { data: users, error: usersError } = await usersQuery;

    if (usersError) throw usersError;

    console.log(`Found ${users.length} users to process`);

    // Get all available quests
    const { data: availableQuests, error: questsError } = await supabaseClient
      .from("quests")
      .select("*")
      .eq('active", true');

    if (questsError) throw questsError;

    if (!availableQuests.length) {
      throw new Error("No available quests found");
    }

    console.log(`Found ${availableQuests.length} available quests`);

    const today = new Date().toISOString().split("T")[0];
    const results = [];

    // Process each user
    for (const user of users) {
      const userId = user.user_id;

      // Check if user already has active quests
      const { data: activeQuests, error: activeQuestsError } =
        await supabaseClient
          .from("user_quests")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "in_progress");

      if (activeQuestsError) throw activeQuestsError;

      // If user has less than 3 active quests, assign new ones
      if (activeQuests && activeQuests.length < 3) {
        // Get quests the user has already completed or has in progress
        const { data: userQuests, error: userQuestsError } =
          await supabaseClient
            .from("user_quests")
            .select("quest_id")
            .eq("user_id", userId);

        if (userQuestsError) throw userQuestsError;

        const userQuestIds = userQuests
          ? userQuests.map((uq) => uq.quest_id)
          : [];

        // Filter out quests the user already has
        const eligibleQuests = availableQuests.filter(
          (quest) => !userQuestIds.includes(quest.id)
        );

        if (eligibleQuests.length > 0) {
          // Assign quests based on user's level and preferences
          // For now, just randomly select quests
          const numQuestsToAssign = Math.min(
            3 - (activeQuests?.length || 0),
            eligibleQuests.length
          );
          const shuffledQuests = [...eligibleQuests].sort(
            () => 0.5 - Math.random()
          );
          const selectedQuests = shuffledQuests.slice(0, numQuestsToAssign);

          for (const quest of selectedQuests) {
            // Insert new user quest
            const { data: newQuest, error: insertError } = await supabaseClient
              .from("user_quests")
              .insert({
                user_id: userId,
                quest_id: quest.id,
                started_at: new Date().toISOString(),
                status: "in_progress",
                current_step: 0,
                progress: { completed_steps: [] },
              })
              .select()
              .single();

            if (insertError) {
              console.error(
                `Error assigning quest to user ${userId}:`,
                insertError
              );
              continue;
            }

            results.push({
              userId,
              questId: quest.id,
              questTitle: quest.title,
              status: "assigned",
            });

            // Create a notification for the new quest
            await supabaseClient.from("notifications").insert({
              user_id: userId,
              type: "quest_assigned",
              title: "New Quest Available",
              message: `A new quest "${quest.title}" has been assigned to you!`,
              data: { quest_id: quest.id },
              read: false,
            });
          }
        }
      }

      // Check for completed quests and award badges
      const { data: completableQuests, error: completableQuestsError } =
        await supabaseClient
          .from("user_quests")
          .select("*, quest:quest_id(*)")
          .eq("user_id", userId)
          .eq("status", "in_progress")
          .is("completed_at", null);

      if (completableQuestsError) throw completableQuestsError;

      if (completableQuests) {
        for (const userQuest of completableQuests) {
          // Check if all steps are completed
          if (userQuest.quest && userQuest.quest.steps) {
            const steps = userQuest.quest.steps;
            const completedSteps = userQuest.progress?.completed_steps || [];

            if (completedSteps.length >= steps.length) {
              // Mark quest as completed
              const { data: updatedQuest, error: updateError } =
                await supabaseClient
                  .from("user_quests")
                  .update({
                    status: "completed",
                    completed_at: new Date().toISOString(),
                  })
                  .eq("id", userQuest.id)
                  .select()
                  .single();

              if (updateError) {
                console.error(
                  `Error completing quest ${userQuest.id}:`,
                  updateError
                );
                continue;
              }

              results.push({
                userId,
                questId: userQuest.quest_id,
                questTitle: userQuest.quest.title,
                status: "completed",
              });

              // Award points
              if (userQuest.quest.rewards && userQuest.quest.rewards.points) {
                await supabaseClient.rpc("award_points", {
                  p_user_id: userId,
                  p_points: userQuest.quest.rewards.points,
                  p_reason: `Completed quest: ${userQuest.quest.title}`,
                });
              }

              // Create notification for completed quest
              await supabaseClient.from("notifications").insert({
                user_id: userId,
                type: "quest_completed",
                title: "Quest Completed!",
                message: `You've completed the "${
                  userQuest.quest.title
                }" quest and earned ${
                  userQuest.quest.rewards?.points || 0
                } points!`,
                data: { quest_id: userQuest.quest_id },
                read: false,
              });

              // Check if user should earn a badge
              await checkAndAwardBadges(supabaseClient, userId);
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: users.length, results }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

// Helper function to check and award badges
async function checkAndAwardBadges(supabase, userId) {
  try {
    // Get completed quests count by category
    const { data: completedQuestsByCategory, error: countError } =
      await supabase
        .from("user_quests")
        .select("quest:quest_id(category)")
        .eq("user_id", userId)
        .eq("status", "completed");

    if (countError) throw countError;

    // Count quests by category
    const categoryCounts = {};
    completedQuestsByCategory?.forEach((item) => {
      if (item.quest && item.quest.category) {
        const category = item.quest.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });

    // Total completed quests
    const totalCompletedQuests = completedQuestsByCategory?.length || 0;

    // Get all badges
    const { data: allBadges, error: badgesError } = await supabase
      .from("badges")
      .select("*")
      .eq("active", true);

    if (badgesError) throw badgesError;

    // Get user's existing badges
    const { data: userBadges, error: userBadgesError } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId);

    if (userBadgesError) throw userBadgesError;

    const userBadgeIds = userBadges ? userBadges.map((ub) => ub.badge_id) : [];

    // Check each badge to see if it should be awarded
    for (const badge of allBadges || []) {
      // Skip if user already has this badge
      if (userBadgeIds.includes(badge.id)) continue;

      let shouldAward = false;
      let progress = 0;
      const total = badge.requirement_count || 1;

      // Check if badge should be awarded based on category and count
      if (badge.category === "quests") {
        // General quest completion badges
        progress = totalCompletedQuests;
        shouldAward = progress >= total;
      } else {
        // Category-specific badges
        progress = categoryCounts[badge.category] || 0;
        shouldAward = progress >= total;
      }

      if (shouldAward) {
        // Award the badge
        const { data: newBadge, error: insertError } = await supabase
          .from("user_badges")
          .insert({
            user_id: userId,
            badge_id: badge.id,
            unlocked_at: new Date().toISOString(),
            progress: total, // Set to max since it's unlocked
            total: total,
          })
          .select()
          .single();

        if (insertError) {
          console.error(
            `Error awarding badge ${badge.id} to user ${userId}:`,
            insertError
          );
          continue;
        }

        // Award points for the badge
        if (badge.points) {
          await supabase.rpc("award_points", {
            p_user_id: userId,
            p_points: badge.points,
            p_reason: `Earned badge: ${badge.name}`,
          });
        }

        // Create notification for new badge
        await supabase.from("notifications").insert({
          user_id: userId,
          type: "badge_earned",
          title: "New Badge Earned!",
          message: `You've earned the "${badge.name}" badge and ${
            badge.points || 0
          } points!`,
          data: { badge_id: badge.id },
          read: false,
        });
      } else if (progress > 0) {
        // Update progress for badges not yet earned
        const { data: existingProgress, error: progressError } = await supabase
          .from("user_badges")
          .select("*")
          .eq("user_id", userId)
          .eq("badge_id", badge.id)
          .maybeSingle();

        if (!progressError) {
          if (existingProgress) {
            // Update existing progress
            if (progress > existingProgress.progress) {
              await supabase
                .from("user_badges")
                .update({ progress })
                .eq("id", existingProgress.id);
            }
          } else {
            // Insert new progress record
            await supabase.from("user_badges").insert({
              user_id: userId,
              badge_id: badge.id,
              progress,
              total,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in checkAndAwardBadges:", error);
  }
}
