import { supabase } from "@/lib/SupabaseClient";

/**
 * Fetches the image_url for a meal and returns the public URL from Supabase Storage.
 */
export const getMealImagePublicUrl = async (mealId: string): Promise<string | null> => {
  // Fetch the meal row
  const { data: meal, error } = await supabase
    .from("meals")
    .select("image_url")
    .eq("id", mealId)
    .single();

  if (error || !meal?.image_url) {
    console.error("Error fetching meal image_url:", error);
    return null;
  }

  // Get the public URL from Supabase Storage
  const { data } = supabase
    .storage
    .from("tastehealth-store")
    .getPublicUrl(meal.image_url);

  return data?.publicUrl ?? null;
};

export interface Meal {
  id: string
  meal_name: string
  image_url: string
  category_id: string
  subcategory_id: string
  category_name?: string
  subcategory_name?: string
}

export interface RecipeIngredient {
  meal: string
  quantity?: string
}

export interface Recipe {
  ingredients: RecipeIngredient[]
  instructions: string
}

export interface NutritionFacts {
  serving_size: string
  calories: string
  total_fat: string
  saturated_fat: string
  trans_fat: string
  cholesterol: string
  sodium: string
  total_carbohydrate: string
  dietary_fiber: string
  total_sugars: string
  added_sugars?: string
  protein: string
  additional_nutrients?: Record<string, string>
}

export interface MealPlan {
  id: string
  name: string
  description?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface MealPlanItem {
  id: string
  meal_plan_id: string
  meal_id: string
  meal: Meal
  day_of_week: string
  meal_time: string
  created_at: string
  updated_at: string
}

export const getMealCategories = async () => {
  const { data, error } = await supabase.from("meal_categories").select("*")

  if (error) {
    console.error("Error fetching meal categories:", error)
    throw error
  }

  return data
}

export const getMealSubcategories = async () => {
  const { data, error } = await supabase.from("meal_subcategories").select("*")

  if (error) {
    console.error("Error fetching meal subcategories:", error)
    throw error
  }

  return data
}

export const getMeals = async (filters?: {
  category_id?: string
  subcategory_id?: string
  search?: string
}) => {
  let query = supabase.from("meals").select(`
      *,
      meal_categories(name),
      meal_subcategories(name)
    `)

  if (filters) {
    if (filters.category_id) {
      query = query.eq("category_id", filters.category_id)
    }

    if (filters.subcategory_id) {
      query = query.eq("subcategory_id", filters.subcategory_id)
    }

    if (filters.search) {
      query = query.ilike("meal_name", `%${filters.search}%`)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching meals:", error)
    throw error
  }

  return data.map((meal) => ({
    ...meal,
    category_name: meal.meal_categories?.name,
    subcategory_name: meal.meal_subcategories?.name,
  }))
}

export const getMealDetails = async (mealId: string) => {
  // Fetch meal data
  const { data: meal, error: mealError } = await supabase
    .from("meals")
    .select(`
      *,
      meal_categories(name),
      meal_subcategories(name)
    `)
    .eq("id", mealId)
    .single()

  if (mealError) {
    console.error("Error fetching meal details:", mealError)
    throw mealError
  }

  // Format meal with category and subcategory names
  const formattedMeal = {
    ...meal,
    category_name: meal.meal_categories?.name,
    subcategory_name: meal.meal_subcategories?.name,
  }

  // Fetch recipe information
  const { data: recipeData, error: recipeError } = await supabase
    .from("recipes")
    .select("*")
    .eq("meal_id", mealId)
    .single()

  // Initialize recipe object
  let recipe: Recipe | null = null

  if (recipeData && !recipeError) {
    // Fetch recipe ingredients
    const { data: ingredientData, error: ingredientError } = await supabase
      .from("recipe_ingredients")
      .select(`
        meal,
        quantity
      `)
      .eq("recipe_id", recipeData.id)

    if (ingredientError) {
      console.error("Error fetching recipe ingredients:", ingredientError)
    }

    // Format recipe ingredients
    const ingredients: RecipeIngredient[] =
      ingredientData?.map((item) => ({
        meal: item.meal || "",
        quantity: item.quantity,
      })) || []

    recipe = {
      ingredients,
      instructions: recipeData.instructions || "",
    }
  }

  // Define a simpler type for nutrition facts query response
  type NutritionFactsRow = {
    id: string
    meal_name: string
    serving_size: string | null
    calories: string | null
    total_fat: string | null
    saturated_fat: string | null
    trans_fat: string | null
    cholesterol: string | null
    sodium: string | null
    total_carbohydrate: string | null
    dietary_fiber: string | null
    total_sugars: string | null
    added_sugars: string | null
    protein: string | null
    additional_nutrients: Record<string, string> | null
  }

  // Fetch nutrition facts and cast result to NutritionFactsRow after query
  const { data: nutritionDataRaw, error: nutritionError } = await supabase
    .from("nutrition_facts")
    .select("*")
    .eq("meal_id", mealId)
    .maybeSingle()
  const nutritionData = nutritionDataRaw as NutritionFactsRow | null

  if (nutritionError && nutritionError.code !== "PGRST116") {
    // PGRST116 is "no rows returned" which is fine
    console.error("Error fetching nutrition facts:", nutritionError)
  }

  return {
    meal: formattedMeal,
    recipe,
    nutritionFacts: nutritionData || null,
  }
}

export const seedMeals = async () => {
  try {
    // First, create some meal categories if they don't exist
    const categories = [{ name: "Breakfast" }, { name: "Lunch" }, { name: "Dinner" }, { name: "Snack" }]

    // Insert categories
    await supabase.from("meal_categories").upsert(categories, { onConflict: "name" })

    // Get inserted categories
    const { data: categoryData } = await supabase.from("meal_categories").select("*")

    // Create subcategories
    const subcategories = [
      { name: "Vegetarian" },
      { name: "Vegan" },
      { name: "Gluten-Free" },
      { name: "Keto" },
      { name: "Low-Carb" },
    ]

    // Insert subcategories
    await supabase.from("meal_subcategories").upsert(subcategories, { onConflict: "name" })

    // Get inserted subcategories
    const { data: subcategoryData } = await supabase.from("meal_subcategories").select("*")

    if (!categoryData || !subcategoryData) {
      throw new Error("Failed to retrieve categories or subcategories")
    }

    // Create sample meals with storage bucket image URLs
    const meals = [
      {
        meal_name: "Avocado Toast",
        category_id: categoryData.find((c) => c.name === "Breakfast")?.id,
        subcategory_id: subcategoryData.find((s) => s.name === "Vegetarian")?.id,
        image_url: "avocado-toast.jpg",
      },
      {
        meal_name: "Greek Yogurt Parfait",
        category_id: categoryData.find((c) => c.name === "Breakfast")?.id,
        subcategory_id: subcategoryData.find((s) => s.name === "Vegetarian")?.id,
        image_url: "yogurt-parfait.jpg",
      },
      {
        meal_name: "Chicken Salad",
        category_id: categoryData.find((c) => c.name === "Lunch")?.id,
        subcategory_id: subcategoryData.find((s) => s.name === "Low-Carb")?.id,
        image_url: "chicken-salad.jpg",
      },
      {
        meal_name: "Quinoa Bowl",
        category_id: categoryData.find((c) => c.name === "Lunch")?.id,
        subcategory_id: subcategoryData.find((s) => s.name === "Vegan")?.id,
        image_url: "quinoa-bowl.jpg",
      },
      {
        meal_name: "Salmon with Vegetables",
        category_id: categoryData.find((c) => c.name === "Dinner")?.id,
        subcategory_id: subcategoryData.find((s) => s.name === "Keto")?.id,
        image_url: "salmon-vegetables.jpg",
      },
      {
        meal_name: "Vegetarian Stir Fry",
        category_id: categoryData.find((c) => c.name === "Dinner")?.id,
        subcategory_id: subcategoryData.find((s) => s.name === "Vegetarian")?.id,
        image_url: "vegetarian-stir-fry.jpg",
      },
    ]

    // Insert meals
    const { data: mealsData, error: mealsError } = await supabase
      .from("meals")
      .upsert(meals, { onConflict: "meal_name" })
      .select()

    if (mealsError) {
      throw mealsError
    }

    return { success: true, message: "Database seeded successfully", data: mealsData }
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

export async function getMealPlanDetails(planId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  // Get the meal plan
  const { data: mealPlan, error: planError } = await supabase.from("meal_plans").select("*").eq("id", planId).single()

  if (planError) throw planError

  // Get the meal plan items with their associated meals
  const { data: mealPlanItems, error: itemsError } = await supabase
    .from("meal_plan_items")
    .select(`
      id,
      meal_plan_id,
      meal_id,
      day_of_week,
      meal_time,
      meal:meals (
        id,
        meal_name,
        image_url,
        description,
        calories,
        protein,
        carbs,
        fat
      )
    `)
    .eq("meal_plan_id", planId)

  if (itemsError) throw itemsError

  return {
    mealPlan,
    mealPlanItems: mealPlanItems || [],
  }
}

export async function removeMealFromPlan(itemId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  const { error } = await supabase.from("meal_plan_items").delete().eq("id", itemId)

  if (error) throw error

  return true
}

export async function addMealToPlan(mealId: string, planId: string, dayOfWeek: string, mealTime: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  const { data, error } = await supabase
    .from("meal_plan_items")
    .insert({
      meal_plan_id: planId,
      meal_id: mealId,
      day_of_week: dayOfWeek,
      meal_time: mealTime,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) throw error

  return data
}


export async function getMealsSimple({ category_id, subcategory_id, search }: { category_id?: string, subcategory_id?: string, search?: string }) {
  let query = supabase
    .from('meals')
    .select('*');

  if (category_id && category_id !== 'all') {
    query = query.eq('category_id', category_id);
  }
  if (subcategory_id && subcategory_id !== 'all') {
    query = query.eq('subcategory_id', subcategory_id);
  }
  if (search) {
    query = query.ilike('meal_name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
