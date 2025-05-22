import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MealCalories {
  id: string;
  calories: number;
}

/**
 * Retrieves calorie information for a set of meals
 */
export const getMealCalories = async (mealIds: string[]): Promise<MealCalories[]> => {
  if (!mealIds.length) return [];
  
  try {
    // First check if the meal has a nutrition_facts entry with calories
    const { data: nutritionData, error: nutritionError } = await supabase
      .from('nutrition_facts')
      .select('meal_id, calories')
      .in('meal_id', mealIds)
    
    if (nutritionError) {
      console.error('Error fetching meal calories from nutrition_facts:', nutritionError)
    }
    
    // Create a map of meal_id to calories from nutrition data
    const caloriesMap: Record<string, number> = {}
    
    if (nutritionData && nutritionData.length > 0) {
      nutritionData.forEach(item => {
        if (item.meal_id && item.calories) {
          // Convert string calories to number if needed
          const caloriesValue = typeof item.calories === 'string' 
            ? parseInt(item.calories, 10) 
            : item.calories
            
          if (!isNaN(caloriesValue)) {
            caloriesMap[item.meal_id] = caloriesValue
          }
        }
      })
    }
    
    // For meals without nutrition data, assign default calories
    const defaultCaloriesPerMeal = 500
    const result: MealCalories[] = mealIds.map(id => ({
      id,
      calories: caloriesMap[id] || defaultCaloriesPerMeal
    }))
    
    return result
  } catch (error) {
    console.error('Error in getMealCalories:', error)
    // Return default calories for all meals in case of error
    return mealIds.map(id => ({
      id,
      calories: 500
    }))
  }
};

/**
 * Calculates and saves calorie data for a meal plan
 */
export const saveMealPlanCalories = async (
  planId: string, 
  userId: string
): Promise<boolean> => {
  try {
    // Get all meals in the meal plan
    const { data: mealItems, error: itemsError } = await supabase
      .from('meal_plan_items')
      .select('meal_id')
      .eq('meal_plan_id', planId);
    
    if (itemsError) throw itemsError;
    if (!mealItems || mealItems.length === 0) return false;
    
    // Extract meal IDs
    const mealIds = mealItems.map(item => item.meal_id);
    
    // Get calorie information for these meals
    const mealsWithCalories = await getMealCalories(mealIds);
    
    if (!mealsWithCalories.length) return false;
    
    // Calculate total calories
    const totalCalories = mealsWithCalories.reduce(
      (sum, meal) => sum + (meal.calories || 0), 
      0
    );
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Check if a calorie record exists for today
    const { data: existingRecord } = await supabase
      .from('calorie_records')
      .select('id, calories_consumed')
      .eq('user_id', userId)
      .eq('recorded_date', today)
      .maybeSingle();
    
    if (existingRecord) {
      // Update existing record
      await supabase
        .from('calorie_records')
        .update({
          calories_consumed: existingRecord.calories_consumed + totalCalories
        })
        .eq('id', existingRecord.id);
    } else {
      // Create new record with default calorie goal
      await supabase
        .from('calorie_records')
        .insert({
          user_id: userId,
          calories_consumed: totalCalories,
          calories_goal: 2000 // Default goal
        });
    }
    
    // Update daily progress
    await supabase.rpc('update_daily_progress', { user_id_param: userId });
    
    return true;
  } catch (error) {
    console.error('Error saving meal plan calories:', error);
    return false;
  }
};
