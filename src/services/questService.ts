
import { supabase } from "@/lib/SupabaseClient";

export interface QuestStep {
  id: number;
  title: string;
  description: string;
  action_type: string;
  action_target: string;
  action_count: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  steps: QuestStep[];
  rewards: {
    points: number;
    badge_id?: string;
  };
  duration_days: number;
  difficulty: string;
  quest_type: string;
  created_at: string;
}

export interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  current_step: number;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
  quest?: Quest;
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
}

export const getNutritionQuests = async () => {
  const { data, error } = await supabase
    .from("nutrition_quests")
    .select("*")
    .eq("active", true); // Only fetch active quests
  if (error) {
    console.error("Supabase error:", error);
    return [];
  }
  return data;
};

const questService = {
  async getQuestsByType(questType: string): Promise<Quest[]> {
    const { data, error } = await supabase
      .from("quests")
      .select("*")
      .eq("quest_type", questType)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Error fetching ${questType} quests:`, error);
      return [];
    }

    return data || [];
  },

  async getDailyQuests(): Promise<Quest[]> {
    return this.getQuestsByType("daily");
  },

  async getWeeklyQuests(): Promise<Quest[]> {
    return this.getQuestsByType("weekly");
  },

  async getMonthlyQuests(): Promise<Quest[]> {
    return this.getQuestsByType("monthly");
  },

  async getUserQuestsByUserId(userId: string): Promise<UserQuest[]> {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("user_quests")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user quests:", error);
      return [];
    }

    return data || [];
  },

  async getUserQuests(userId: string): Promise<UserQuest[]> {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("user_quests")
      .select("*, quest:quest_id(*)")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user quests:", error);
      return [];
    }

    return data || [];
  },

  async getUserActiveQuests(userId: string): Promise<UserQuest[]> {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("user_quests")
      .select("*, quest:quest_id(*)")
      .eq("user_id", userId)
      .eq("completed", false);

    if (error) {
      console.error("Error fetching active user quests:", error);
      return [];
    }

    // Add progress info to each quest
    return data?.map(quest => ({
      ...quest,
      progress: {
        current: quest.current_step,
        target: quest.quest?.steps?.length || 1,
        percentage: quest.quest?.steps?.length ? (quest.current_step / quest.quest.steps.length) * 100 : 0
      }
    })) || [];
  },

  async getUserCompletedQuests(userId: string): Promise<UserQuest[]> {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("user_quests")
      .select("*, quest:quest_id(*)")
      .eq("user_id", userId)
      .eq("completed", true);

    if (error) {
      console.error("Error fetching completed user quests:", error);
      return [];
    }

    return data || [];
  },

  async startQuest(userId: string, questId: string): Promise<UserQuest | null> {
    if (!userId || !questId) return null;

    // Check if user already has this quest
    const { data: existingQuest } = await supabase
      .from("user_nutrition_quests")
      .select("*")
      .eq("user_id", userId)
      .eq("quest_id", questId)
      .maybeSingle();

    if (existingQuest) return existingQuest;

    // Start new quest
    const { data, error } = await supabase
      .from("user_nutrition_quests")
      .insert({
        user_id: userId,
        quest_id: questId,
        current_step: 0,
        completed: false,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error starting quest:", error);
      return null;
    }

    return data;
  },

  async updateQuestProgress(
    userId: string,
    questId: string,
    currentStep: number
  ): Promise<boolean> {
    if (!userId || !questId) return false;

    const { error } = await supabase
      .from("user_nutrition_quests")
      .update({
        current_step: currentStep,
      })
      .eq("user_id", userId)
      .eq("quest_id", questId);

    if (error) {
      console.error("Error updating quest progress:", error);
      return false;
    }

    return true;
  },

  async completeQuest(
    userId: string,
    questId: string,
    currentStep: number
  ): Promise<boolean> {
    if (!userId || !questId) return false;

    const { error } = await supabase
      .from("user_nutrition_quests")
      .update({
        current_step: currentStep,
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("quest_id", questId);

    if (error) {
      console.error("Error completing quest:", error);
      return false;
    }

    return true;
  },

  async completeQuestStep(
    userId: string,
    questId: string,
    stepIndex: number
  ): Promise<{ success: boolean; completed: boolean }> {
    if (!userId || !questId) return { success: false, completed: false };

    try {
      // Get the quest
      const { data: quest } = await supabase
        .from("nutrition_quests")
        .select("*")
        .eq("id", questId)
        .single();

      if (!quest) {
        console.error("Quest not found");
        return { success: false, completed: false };
      }

      // Get user quest
      const { data: userQuest } = await supabase
        .from("user_nutrition_quests")
        .select("*")
        .eq("user_id", userId)
        .eq("quest_id", questId)
        .single();

      if (!userQuest) {
        console.error("User quest not found");
        return { success: false, completed: false };
      }

      // Generate default steps if not present in requirements
      let steps = [];
      if (quest.requirements && quest.requirements.steps) {
        steps = quest.requirements.steps;
      } else {
        steps = [
          {
            id: 1,
            title: quest.title,
            description: quest.description,
            completed: false
          }
        ];
      }

      if (stepIndex >= steps.length) {
        return { success: false, completed: false };
      }

      // Mark step as completed
      steps[stepIndex].completed = true;
      
      // Check if all steps are completed
      const allStepsCompleted = stepIndex === steps.length - 1;

      // Update user quest with new progress
      const updateData: any = {
        current_step: stepIndex + 1,
      };

      if (allStepsCompleted) {
        updateData.completed = true;
        updateData.completed_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from("user_nutrition_quests")
        .update(updateData)
        .eq("id", userQuest.id);

      if (updateError) {
        console.error("Error updating user quest:", updateError);
        return { success: false, completed: false };
      }

      return { success: true, completed: allStepsCompleted };
    } catch (error) {
      console.error("Error completing quest step:", error);
      return { success: false, completed: false };
    }
  },

  async getActiveQuestsByType(
    userId: string,
    questType: string
  ): Promise<UserQuest[]> {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("user_quests")
      .select("*, quest:quest_id(*)")
      .eq("user_id", userId)
      .eq("completed", false)
      .filter("quest.quest_type", "eq", questType);

    if (error) {
      console.error(`Error fetching ${questType} quests:`, error);
      return [];
    }

    return data || [];
  },

  async getCompletedQuestsByType(
    userId: string,
    questType: string
  ): Promise<UserQuest[]> {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("user_quests")
      .select("*, quest:quest_id(*)")
      .eq("user_id", userId)
      .eq("completed", true)
      .filter("quest.quest_type", "eq", questType);

    if (error) {
      console.error(`Error fetching completed ${questType} quests:`, error);
      return [];
    }

    return data || [];
  },

  async generateDailyQuestsForUser(userId: string): Promise<boolean> {
    if (!userId) return false;

    try {
      // Get available daily quests
      const dailyQuests = await this.getDailyQuests();
      if (dailyQuests.length === 0) return false;

      // Select 3 random quests
      const shuffled = [...dailyQuests].sort(() => 0.5 - Math.random());
      const selectedQuests = shuffled.slice(0, 3);

      // Start each quest for the user
      for (const quest of selectedQuests) {
        await this.startQuest(userId, quest.id);
      }

      return true;
    } catch (error) {
      console.error("Error generating daily quests:", error);
      return false;
    }
  },

  async acceptQuest(userId: string, questId: string): Promise<UserQuest | null> {
    return this.startQuest(userId, questId);
  },

  getNutritionQuests,
};

export default questService;
