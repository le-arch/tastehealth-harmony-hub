import { supabase } from "@/lib/SupabaseClient";
import { toast } from "sonner";

// Define the Favorite type
export interface Favorite {
  id: string;
  user_id: string;
  meal_id: string;
  created_at: string;
  meal?: {
    id: string;
    meal_name: string;
    image_url: string;
    category_id: string;
    subcategory_id: string;
    category_name?: string;
    subcategory_name?: string;
    description?: string;
    tags?: string;
  };
}

/**
 * Add a meal to favorites
 */
export const addToFavorites = async (
  mealId: string
): Promise<Favorite | null> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;

    if (!userId) {
      toast.error("You must be logged in to add favorites");
      return null;
    }

    // Check if already in favorites
    const { data: existingFavorite } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("meal_id", mealId)
      .maybeSingle();

    if (existingFavorite) {
      toast.info("This meal is already in your favorites");
      return existingFavorite as Favorite;
    }

    // Add to favorites
    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: userId,
        meal_id: mealId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Failed to add to favorites");
      return null;
    }

    toast.success("Added to favorites");
    return data as Favorite;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    toast.error("Failed to add to favorites");
    return null;
  }
};

/**
 * Add multiple meals to favorites
 */
export const addMultipleToFavorites = async (
  mealIds: string[]
): Promise<number> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;

    if (!userId) {
      toast.error("You must be logged in to add favorites");
      return 0;
    }

    // Check which meals are already in favorites
    const { data: existingFavorites } = await supabase
      .from("favorites")
      .select("meal_id")
      .eq("user_id", userId)
      .in("meal_id", mealIds);

    // Filter out meals that are already favorited
    const existingMealIds = existingFavorites?.map((fav) => fav.meal_id) || [];
    const newMealIds = mealIds.filter((id) => !existingMealIds.includes(id));

    if (newMealIds.length === 0) {
      toast.info("All selected meals are already in your favorites");
      return 0;
    }

    // Prepare data for batch insert
    const favoritesToInsert = newMealIds.map((mealId) => ({
      user_id: userId,
      meal_id: mealId,
    }));

    // Add to favorites in batch
    const { data, error } = await supabase
      .from("favorites")
      .insert(favoritesToInsert)
      .select();

    if (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Failed to add to favorites");
      return 0;
    }

    const addedCount = data?.length || 0;
    toast.success(
      `Added ${addedCount} meal${addedCount !== 1 ? "s" : ""} to favorites`
    );
    return addedCount;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    toast.error("Failed to add to favorites");
    return 0;
  }
};

/**
 * Remove a meal from favorites
 */
export const removeFavorite = async (favoriteId: string): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;

    if (!userId) {
      toast.error("You must be logged in to remove favorites");
      return false;
    }

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favoriteId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from favorites");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    toast.error("Failed to remove from favorites");
    return false;
  }
};

/**
 * Remove multiple favorites at once
 */
export const removeMultipleFavorites = async (
  favoriteIds: string[]
): Promise<number> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;

    if (!userId) {
      toast.error("You must be logged in to remove favorites");
      return 0;
    }

    const { data, error } = await supabase
      .from("favorites")
      .delete()
      .in("id", favoriteIds)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.error("Error removing favorites:", error);
      toast.error("Failed to remove from favorites");
      return 0;
    }

    const removedCount = data?.length || 0;
    toast.success(
      `Removed ${removedCount} meal${
        removedCount !== 1 ? "s" : ""
      } from favorites`
    );
    return removedCount;
  } catch (error) {
    console.error("Error removing favorites:", error);
    toast.error("Failed to remove from favorites");
    return 0;
  }
};

/**
 * Check if a meal is in favorites
 */
export const isFavorite = async (mealId: string): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;

    if (!userId) {
      return false;
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("meal_id", mealId)
      .maybeSingle();

    if (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

/**
 * Get all favorites for the current user
 */
export const getFavorites = async (): Promise<any[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;

    if (!userId) {
      toast.error("You must be logged in to view favorites");
      return [];
    }

    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
        *,
        meal:meals (
          id,
          meal_name,
          image_url,
          category_id,
          subcategory_id,
          meal_categories (name),
          meal_subcategories (name)
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
      return [];
    }

    // Format the data to make it easier to work with
    return data.map((item) => ({
      id: item.id,
      meal_id: item.meal_id,
      created_at: item.created_at,
      ...item.meal,
      category_name: item.meal.meal_categories?.name,
      subcategory_name: item.meal.meal_subcategories?.name,
    }));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    toast.error("Failed to load favorites");
    return [];
  }
};
