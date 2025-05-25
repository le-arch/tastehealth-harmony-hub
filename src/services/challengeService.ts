import { supabase } from "@/lib/SupabaseClient"

export interface NutritionChallenge {
  id: string
  user_id: string
  name: string
  types: string[]
  duration_days: number
  difficulty_level: number
  created_at: string
  updated_at: string
}

export interface ChallengeProgress {
  id: string
  challenge_id: string
  user_id: string
  days_completed: number
  total_days: number
  last_completed_at: string
  created_at: string
  updated_at: string
}

export interface ChallengeInput {
  user_id: string
  name: string
  types: string[]
  duration_days: number
  difficulty_level: number
}

export const createNutritionChallenge = async (challenge: ChallengeInput) => {
  // Start a transaction
  const { data, error } = await supabase.rpc("create_nutrition_challenge", {
    p_user_id: challenge.user_id,
    p_name: challenge.name,
    p_types: challenge.types,
    p_duration_days: challenge.duration_days,
    p_difficulty_level: challenge.difficulty_level,
  })

  if (error) {
    console.error("Error creating nutrition challenge:", error)
    throw error
  }

  return data
}

export const getUserChallenges = async (userId: string) => {
  // Get active challenges
  const { data: challenges, error: challengesError } = await supabase
    .from("nutrition_challenges")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (challengesError) {
    console.error("Error fetching challenges:", challengesError)
    throw challengesError
  }

  // Get progress for these challenges
  const { data: progress, error: progressError } = await supabase
    .from("challenge_progress")
    .select("*")
    .eq("user_id", userId)
    .in(
      "challenge_id",
      challenges.map((c) => c.id),
    )

  if (progressError) {
    console.error("Error fetching challenge progress:", progressError)
    throw progressError
  }

  return { challenges, progress }
}

export const completeChallengeDailyTask = async (userId: string, challengeId: string) => {
  const { data, error } = await supabase.rpc("complete_challenge_task", {
    p_user_id: userId,
    p_challenge_id: challengeId,
  })

  if (error) {
    console.error("Error completing challenge task:", error)
    throw error
  }

  return data
}
