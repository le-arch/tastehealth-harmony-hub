import { supabase } from "@/integrations/supabase/client"

export interface MealMood {
  user_id: string
  meal_id: string
  meal_name: string
  mood: string
  notes: string | null
}

export const saveMealMood = async (moodData: MealMood) => {
  const { data, error } = await supabase
    .from("meal_moods")
    .insert({
      user_id: moodData.user_id,
      meal_id: moodData.meal_id,
      meal_name: moodData.meal_name,
      mood: moodData.mood,
      notes: moodData.notes,
    })
    .select()
    .single()

  if (error) {
    console.error("Error saving meal mood:", error)
    throw error
  }

  return data
}

export const getMealMoods = async (userId: string, limit = 10) => {
  const { data, error } = await supabase
    .from("meal_moods")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching meal moods:", error)
    throw error
  }

  return data
}
//     throw challengesError