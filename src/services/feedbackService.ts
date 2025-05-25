import { supabase } from "../lib/SupabaseClient";

export interface FeedbackData {
  id?: string;
  user_id?: string;
  rating: number;
  comment: string;
  created_at?: string;
}

export const submitFeedback = async (
  feedback: FeedbackData
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if the app_feedback table exists
    const { error: tableCheckError } = await supabase
      .from("app_feedback")
      .select("id")
      .limit(1);

    // If the table doesn't exist, create it
    if (tableCheckError && tableCheckError.code === "PGRST116") {
      await supabase.rpc("create_app_feedback_table");
    }

    const { error } = await supabase.from("app_feedback").insert({
      user_id: userData.user.id,
      rating: feedback.rating,
      comment: feedback.comment,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, error };
  }
};

export const getUserFeedback = async (): Promise<{
  data: FeedbackData[] | null;
  error: any;
}> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { data: null, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("app_feedback")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    return { data: null, error };
  }
};
