import { supabase } from "../lib/SuperbaseClient";

export const fixGamificationData = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "fix-gamification-data"
    );

    if (error) {
      console.error("Error fixing gamification data:", error);
      return { success: false, message: error.message };
    }

    return data;
  } catch (error) {
    console.error("Error invoking fix-gamification-data function:", error);
    return { success: false, message: "Failed to fix gamification data" };
  }
};

export const checkAndFixGamificationData = async (
  userId: string
): Promise<boolean> => {
  try {
    // First try to get user points
    const { data: userPoints, error } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // If there's an error other than "not found", log it
    if (error && error.code !== "PGRST116") {
      console.error("Error checking user points:", error);
    }

    // If user points don't exist, try to fix gamification data
    if (!userPoints) {
      const result = await fixGamificationData();
      return result.success;
    }

    return true;
  } catch (error) {
    console.error("Error checking gamification data:", error);
    return false;
  }
};
