import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Manually trigger the auto-generate-notifications Edge Function
 * This is useful for testing purposes
 */
export const triggerNotificationGeneration = async (): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;

    if (!userId) {
      toast.error("You must be logged in to generate notifications");
      return false;
    }

    const { data, error } = await supabase.functions.invoke(
      "auto-generate-notifications"
    );

    if (error) {
      console.error("Error triggering notification generation:", error);
      toast.error("Failed to generate notifications");
      return false;
    }

    if (data.success) {
      toast.success(`Generated ${data.count} notifications successfully`);
      return true;
    } else {
      toast.error(data.message || "Failed to generate notifications");
      return false;
    }
  } catch (error) {
    console.error("Error triggering notification generation:", error);
    toast.error("Failed to generate notifications");
    return false;
  }
};
