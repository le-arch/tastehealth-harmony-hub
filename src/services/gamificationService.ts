import { supabase } from "../lib/SupabaseClient";

// Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  requirements: any;
  icon: string;
  created_at: string;
  active: boolean;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  started_at: string;
  completed_at: string | null;
  status: "in_progress" | "completed" | "failed";
  progress: any;
  challenge?: Challenge;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  points: number;
  requirements: any;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  displayed: boolean;
  achievement?: Achievement;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  is_equipped: boolean;
  badge?: Badge;
}

export interface NutritionStreak {
  id: string;
  user_id: string;
  streak_type: string;
  current_streak: number;
  longest_streak: number;
  last_tracked_date: string;
}

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  current_level: number;
  points_to_next_level: number;
  created_at: string;
  updated_at: string;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  amount: number;
  reference_id?: string;
  reference_type?: string;
  transaction_type: "earn" | "spend" | "refund";
  description?: string;
  created_at: string;
  metadata?: any;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: "weekly" | "monthly" | "all-time";
  category: string;
  start_date: string | null;
  end_date: string | null;
}

export interface LeaderboardEntry {
  id: string;
  leaderboard_id: string;
  user_id: string;
  username: string;
  score: number;
  rank: number;
}

export interface NutritionGoal {
  id: string;
  user_id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string | null;
  status: "active" | "completed" | "failed";
}

export interface DailyNutritionLog {
  id: string;
  user_id: string;
  log_date: string;
  calories_consumed: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  fiber_grams: number;
  water_cups: number;
  vegetables_servings: number;
  fruits_servings: number;
}

export interface NutritionTip {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
}

export interface LevelBenefit {
  id: string;
  name: string;
  description: string;
  level_required: number;
  benefit_type: string; // unlock_feature, discount, special_content, etc.
  benefit_data: any;
  created_at: string;
  active: boolean;
}

export interface UserLevelBenefit {
  id: string;
  user_id: string;
  level_benefit_id: string;
  unlocked_at: string;
  used_at: string | null;
  status: "unlocked" | "used" | "expired";
  level_benefit?: LevelBenefit;
}

export interface UserLevel {
  level: number;
  min_points: number;
  max_points: number;
  title: string;
}

// Define level thresholds
export const LEVELS: UserLevel[] = [
  { level: 1, min_points: 0, max_points: 99, title: "Nutrition Novice" },
  { level: 2, min_points: 100, max_points: 249, title: "Health Explorer" },
  { level: 3, min_points: 250, max_points: 499, title: "Wellness Seeker" },
  { level: 4, min_points: 500, max_points: 999, title: "Nutrition Enthusiast" },
  { level: 5, min_points: 1000, max_points: 1999, title: "Health Advocate" },
  { level: 6, min_points: 2000, max_points: 3499, title: "Wellness Warrior" },
  { level: 7, min_points: 3500, max_points: 5999, title: "Nutrition Master" },
  { level: 8, min_points: 6000, max_points: 9999, title: "Health Champion" },
  { level: 9, min_points: 10000, max_points: 14999, title: "Wellness Guru" },
  {
    level: 10,
    min_points: 15000,
    max_points: Number.POSITIVE_INFINITY,
    title: "Nutrition Legend",
  },
];

// Service functions
export const gamificationService = {
  // Challenges
  async getChallenges(): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from("nutrition_challenges")
      .select("*")
      .eq("active", true);

    if (error) throw error;
    return data || [];
  },

  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    const { data, error } = await supabase
      .from("user_challenges")
      .select("*, challenge:challenge_id(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  },

  async acceptChallenge(
    userId: string,
    challengeId: string
  ): Promise<UserChallenge> {
    const { data, error } = await supabase
      .from("user_challenges")
      .insert({
        user_id: userId,
        challenge_id: challengeId,
        status: "in_progress",
        progress: {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateChallengeProgress(
    userChallengeId: string,
    progress: any
  ): Promise<UserChallenge> {
    const { data, error } = await supabase
      .from("user_challenges")
      .update({ progress })
      .eq("id", userChallengeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async completeChallenge(userChallengeId: string): Promise<UserChallenge> {
    const { data, error } = await supabase
      .from("user_challenges")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", userChallengeId)
      .select()
      .single();

    if (error) throw error;

    // Get the challenge to award points
    const challenge = await this.getChallengeById(data.challenge_id);
    if (challenge) {
      await this.awardPoints(
        data.user_id,
        challenge.points,
        "challenge_completed",
        data.challenge_id,
        "challenge"
      );
    }

    return data;
  },

  async getChallengeById(challengeId: string): Promise<Challenge | null> {
    const { data, error } = await supabase
      .from("nutrition_challenges")
      .select("*")
      .eq("id", challengeId)
      .single();

    if (error) return null;
    return data;
  },

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase.from("achievements").select("*");

    if (error) throw error;
    return data || [];
  },

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from("user_achievements")
      .select("*, achievement:achievement_id(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  },

  async awardAchievement(
    userId: string,
    achievementId: string
  ): Promise<UserAchievement> {
    // Check if already awarded
    const { data: existing } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .maybeSingle();

    if (existing) return existing;

    const { data, error } = await supabase
      .from("user_achievements")
      .insert({
        user_id: userId,
        achievement_id: achievementId,
      })
      .select()
      .single();

    if (error) throw error;

    // Get the achievement to award points
    const achievement = await this.getAchievementById(achievementId);
    if (achievement) {
      await this.awardPoints(
        userId,
        achievement.points,
        "achievement_earned",
        achievementId,
        "achievement"
      );
    }

    return data;
  },

  async getAchievementById(achievementId: string): Promise<Achievement | null> {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("id", achievementId)
      .single();

    if (error) return null;
    return data;
  },

  // Badges
  async getBadges(): Promise<Badge[]> {
    const { data, error } = await supabase.from("badges").select("*");

    if (error) throw error;
    return data || [];
  },

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await supabase
      .from("user_badges")
      .select("*, badge:badge_id(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  },

  async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
    // Check if already awarded
    const { data: existing } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", userId)
      .eq("badge_id", badgeId)
      .maybeSingle();

    if (existing) return existing;

    const { data, error } = await supabase
      .from("user_badges")
      .insert({
        user_id: userId,
        badge_id: badgeId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async equipBadge(userBadgeId: string, equipped: boolean): Promise<UserBadge> {
    const { data, error } = await supabase
      .from("user_badges")
      .update({ is_equipped: equipped })
      .eq("id", userBadgeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Points and Levels
  // Get user points
  async getUserPoints(userId: string): Promise<UserPoints | null> {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No record found, create one
        return this.initializeUserPoints(userId);
      }
      console.error("Error fetching user points:", error);
      return null;
    }

    return data;
  },

  // Initialize user points
  async initializeUserPoints(userId: string): Promise<UserPoints | null> {
    const initialPoints = {
      user_id: userId,
      total_points: 0,
      current_level: 1,
      points_to_next_level: 100,
    };

    const { data, error } = await supabase
      .from("user_points")
      .insert(initialPoints)
      .select()
      .single();

    if (error) {
      console.error("Error initializing user points:", error);
      return null;
    }

    return data;
  },

  // Calculate level based on points
  calculateLevel(points: number): number {
    for (const level of LEVELS) {
      if (points >= level.min_points && points <= level.max_points) {
        return level.level;
      }
    }
    return LEVELS[LEVELS.length - 1].level; // Max level
  },

  // Get level info
  getLevelInfo(level: number): UserLevel {
    return LEVELS.find((l) => l.level === level) || LEVELS[0];
  },

  // Get points needed for next level
  getPointsForNextLevel(currentPoints: number): number {
    const currentLevel = this.calculateLevel(currentPoints);
    const nextLevel = LEVELS.find((l) => l.level === currentLevel + 1);

    if (!nextLevel) return 0; // Already at max level
    return nextLevel.min_points - currentPoints;
  },

  // Level Benefits
  async getLevelBenefits(userId: string, benefitId: string): Promise<LevelBenefit[]> {
    const { data, error } = await supabase
      .from("level_benefits")
      .select("*")
      .eq("active", true)
      .order("level_required", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getUserLevelBenefits(userId: string): Promise<UserLevelBenefit[]> {
    const { data, error } = await supabase
      .from("user_level_benefits")
      .select("*, level_benefit:level_benefit_id(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  },

  async unlockLevelBenefit(
    userId: string,
    levelBenefitId: string
  ): Promise<UserLevelBenefit> {
    // Check if already unlocked
    const { data: existing } = await supabase
      .from("user_level_benefits")
      .select("*")
      .eq("user_id", userId)
      .eq("level_benefit_id", levelBenefitId)
      .maybeSingle();

    if (existing) return existing;

    // Get the level benefit to check requirements
    const { data: levelBenefit, error: benefitError } = await supabase
      .from("level_benefits")
      .select("*")
      .eq("id", levelBenefitId)
      .single();

    if (benefitError) throw benefitError;

    // Check if user has required level
    const userPoints = await this.getUserPoints(userId);
    if (userPoints.level < levelBenefit.level_required) {
      throw new Error(
        `User level ${userPoints.level} is below required level ${levelBenefit.level_required}`
      );
    }

    // Unlock the benefit
    const { data, error } = await supabase
      .from("user_level_benefits")
      .insert({
        user_id: userId,
        level_benefit_id: levelBenefitId,
        status: "unlocked",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async useLevel(
    userId: string,
    levelBenefitId: string,
    metadata?: any
  ): Promise<UserLevelBenefit> {
    // Check if benefit is unlocked
    const { data: benefit, error: benefitError } = await supabase
      .from("user_level_benefits")
      .select("*, level_benefit:level_benefit_id(*)")
      .eq("user_id", userId)
      .eq("level_benefit_id", levelBenefitId)
      .eq("status", "unlocked")
      .single();

    if (benefitError) throw new Error("Benefit not found or not unlocked");

    // Mark as used
    const { data, error } = await supabase
      .from("user_level_benefits")
      .update({
        status: "used",
        used_at: new Date().toISOString(),
      })
      .eq("id", benefit.id)
      .select()
      .single();

    if (error) throw error;

    // Record the transaction if there's a points cost
    if (benefit.level_benefit?.benefit_data?.points_cost) {
      await this.createPointsTransaction(
        userId,
        -benefit.level_benefit.benefit_data.points_cost,
        "spend",
        `Used level benefit: ${benefit.level_benefit.name}`,
        benefit.id,
        "level_benefit",
        metadata
      );
    }

    return data;
  },

  // Points Transactions
  async createPointsTransaction(
    userId: string,
    points: number,
    transactionType: "earn" | "spend" | "refund",
    reason: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ): Promise<PointsTransaction> {
    const { data, error } = await supabase.rpc("record_points_transaction", {
      p_user_id: userId,
      p_points: points,
      p_transaction_type: transactionType,
      p_reason: reason,
      p_reference_id: referenceId,
      p_reference_type: referenceType,
      p_metadata: metadata,
    });

    if (error) throw error;

    // Fetch the created transaction
    const { data: transaction, error: fetchError } = await supabase
      .from("points_transactions")
      .select("*")
      .eq("id", data)
      .single();

    if (fetchError) throw fetchError;
    return transaction;
  },

  async getPointsTransactions(
    userId: string,
    limit = 20,
    offset = 0
  ): Promise<PointsTransaction[]> {
    const { data, error } = await supabase
      .from("points_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  // Add points to user
  async awardPoints(
    userId: string,
    points: number,
    reason: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ): Promise<{ success: boolean; newLevel?: number; levelUp?: boolean }> {
    if (!userId) return { success: false };

    try {
      // Get current user points to check level before update
      const currentPoints = await this.getUserPoints(userId);
      if (!currentPoints) return { success: false };

      const currentLevel = currentPoints.level;

      // Use the database function to record transaction and update points
      const { data, error } = await supabase.rpc("record_points_transaction", {
        p_user_id: userId,
        p_points: points,
        p_transaction_type: points >= 0 ? "earn" : "spend",
        p_reason: reason,
        p_reference_id: referenceId,
        p_reference_type: referenceType,
        p_metadata: metadata,
      });

      if (error) {
        console.error("Error recording points transaction:", error);
        return { success: false };
      }

      // Get updated user points to check new level
      const updatedPoints = await this.getUserPoints(userId);
      if (!updatedPoints) return { success: true };

      // Return result with level up info
      return {
        success: true,
        newLevel: updatedPoints.level,
        levelUp: updatedPoints.level > currentLevel,
      };
    } catch (error) {
      console.error("Error adding points:", error);
      return { success: false };
    }
  },

  // Get user points history
  async getPointsHistory(userId: string): Promise<PointsTransaction[]> {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("points_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching points history:", error);
      return [];
    }

    return data || [];
  },

  // Streaks
  async getNutritionStreaks(userId: string): Promise<NutritionStreak[]> {
    const { data, error } = await supabase
      .from("nutrition_streaks")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  },

  // Nutrition Goals
  async createNutritionGoal(
    userId: string,
    goalType: string,
    targetValue: number,
    endDate?: string
  ): Promise<NutritionGoal> {
    const { data, error } = await supabase
      .from("nutrition_goals")
      .insert({
        user_id: userId,
        goal_type: goalType,
        target_value: targetValue,
        end_date: endDate,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getNutritionGoals(userId: string): Promise<NutritionGoal[]> {
    const { data, error } = await supabase
      .from("nutrition_goals")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) throw error;
    return data || [];
  },

  async updateNutritionGoalProgress(
    goalId: string,
    currentValue: number
  ): Promise<NutritionGoal> {
    const { data, error } = await supabase
      .from("nutrition_goals")
      .update({
        current_value: currentValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", goalId)
      .select()
      .single();

    if (error) throw error;

    // Check if goal is completed
    if (data.current_value >= data.target_value) {
      await this.completeNutritionGoal(goalId);
      // Award points for completing a goal
      await this.awardPoints(
        data.user_id,
        50,
        "goal_completed",
        goalId,
        "nutrition_goal"
      );
    }

    return data;
  },

  async completeNutritionGoal(goalId: string): Promise<NutritionGoal> {
    const { data, error } = await supabase
      .from("nutrition_goals")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", goalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Daily Nutrition Logs
  async logDailyNutrition(
    userId: string,
    nutritionData: Partial<DailyNutritionLog>
  ): Promise<DailyNutritionLog> {
    // Check if log exists for today
    const today = new Date().toISOString().split("T")[0];
    const { data: existingLog } = await supabase
      .from("daily_nutrition_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("log_date", today)
      .maybeSingle();

    if (existingLog) {
      // Update existing log
      const { data, error } = await supabase
        .from("daily_nutrition_logs")
        .update({
          ...nutritionData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingLog.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new log
      const { data, error } = await supabase
        .from("daily_nutrition_logs")
        .insert({
          user_id: userId,
          log_date: today,
          ...nutritionData,
        })
        .select()
        .single();

      if (error) throw error;

      // Award points for first log of the day
      await this.awardPoints(userId, 10, "daily_log");

      return data;
    }
  },

  async getDailyNutritionLogs(
    userId: string,
    days = 7
  ): Promise<DailyNutritionLog[]> {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("daily_nutrition_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("log_date", startDateStr)
      .lte("log_date", endDate)
      .order("log_date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Leaderboards
  async getLeaderboards(): Promise<Leaderboard[]> {
    const { data, error } = await supabase.from("leaderboards").select("*");

    if (error) throw error;
    return data || [];
  },

  async getLeaderboardEntries(
    leaderboardId: string
  ): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .eq("leaderboard_id", leaderboardId)
      .order("rank", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Nutrition Tips
  async getNutritionTips(
    category?: string,
    difficultyLevel?: string
  ): Promise<NutritionTip[]> {
    let query = supabase.from("nutrition_tips").select("*").eq("active", true);

    if (category) {
      query = query.eq("category", category);
    }

    if (difficultyLevel) {
      query = query.eq("difficulty_level", difficultyLevel);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async markTipAsSeen(
    userId: string,
    tipId: string,
    saved = false
  ): Promise<void> {
    const { error } = await supabase.from("user_tips").upsert({
      user_id: userId,
      tip_id: tipId,
      seen_at: new Date().toISOString(),
      saved,
    });

    if (error) throw error;
  },

  async getSavedTips(userId: string): Promise<NutritionTip[]> {
    const { data, error } = await supabase
      .from("user_tips")
      .select("tip:tip_id(*)")
      .eq("user_id", userId)
      .eq("saved", true);

    if (error) throw error;
    return data?.map((item) => item.tip) || [];
  },

  // Check and update achievements based on user activity
  async checkAndUpdateAchievements(userId: string): Promise<void> {
    try {
      // Get all achievements
      const achievements = await this.getAchievements();

      // Get user data needed for achievement checks
      const [userPoints, userChallenges, nutritionLogs, streaks] =
        await Promise.all([
          this.getUserPoints(userId),
          this.getUserChallenges(userId),
          this.getDailyNutritionLogs(userId, 30), // Get last 30 days
          this.getNutritionStreaks(userId),
        ]);

      // Check each achievement
      for (const achievement of achievements) {
        // Skip if already earned
        const { data: alreadyEarned } = await supabase
          .from("user_achievements")
          .select("id")
          .eq("user_id", userId)
          .eq("achievement_id", achievement.id)
          .maybeSingle();

        if (alreadyEarned) continue;

        // Check requirements
        let requirementsMet = false;

        if (
          achievement.requirements.level &&
          userPoints.level >= achievement.requirements.level
        ) {
          requirementsMet = true;
        }

        if (
          achievement.requirements.meals_logged &&
          nutritionLogs.length >= achievement.requirements.meals_logged
        ) {
          requirementsMet = true;
        }

        if (achievement.requirements.challenges_completed) {
          const completedChallenges = userChallenges.filter(
            (c) => c.status === "completed"
          ).length;
          if (
            completedChallenges >= achievement.requirements.challenges_completed
          ) {
            requirementsMet = true;
          }
        }

        if (achievement.requirements.daily_logs) {
          const streak = streaks.find((s) => s.streak_type === "daily_log");
          if (
            (streak &&
              achievement.requirements.consecutive &&
              streak.current_streak >= achievement.requirements.daily_logs) ||
            (!achievement.requirements.consecutive &&
              streak.longest_streak >= achievement.requirements.daily_logs)
          ) {
            requirementsMet = true;
          }
        }

        if (achievement.requirements.water_goal_met) {
          const waterLogs = nutritionLogs.filter(
            (log) => log.water_cups >= 8
          ).length;
          if (waterLogs >= achievement.requirements.water_goal_met) {
            requirementsMet = true;
          }
        }

        // Award achievement if requirements met
        if (requirementsMet) {
          await this.awardAchievement(userId, achievement.id);
        }
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
  },

  // Check and award badges based on achievements
  async checkAndAwardBadges(userId: string): Promise<void> {
    try {
      // Get user achievements
      const userAchievements = await this.getUserAchievements(userId);

      // Get all badges
      const badges = await this.getBadges();

      // Check meta badges (based on number of achievements)
      const nutritionAchievements = userAchievements.filter(
        (ua) => ua.achievement?.category === "nutrition"
      ).length;

      const consistencyAchievements = userAchievements.filter(
        (ua) => ua.achievement?.category === "consistency"
      ).length;

      // Award badges based on achievement counts
      for (const badge of badges) {
        if (
          badge.category === "meta" &&
          badge.name === "Nutrition Guru" &&
          nutritionAchievements >= 10
        ) {
          await this.awardBadge(userId, badge.id);
        }

        if (
          badge.category === "consistency" &&
          badge.name === "Streak Master"
        ) {
          const streaks = await this.getNutritionStreaks(userId);
          const longestStreak = streaks.reduce(
            (max, streak) =>
              streak.longest_streak > max ? streak.longest_streak : max,
            0
          );

          if (longestStreak >= 30) {
            await this.awardBadge(userId, badge.id);
          }
        }
      }
    } catch (error) {
      console.error("Error awarding badges:", error);
    }
  },

  // Get user streak
  async getUserStreak(userId: string): Promise<number> {
    if (!userId) return 0;

    const { data, error } = await supabase.rpc("get_user_streak", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Error fetching user streak:", error);
      return 0;
    }

    return data || 0;
  },

  // Update user streak
  async updateUserStreak(userId: string): Promise<boolean> {
    if (!userId) return false;

    const { data, error } = await supabase.rpc("update_user_streak", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Error updating user streak:", error);
      return false;
    }

    return true;
  },

  // Get all user levels
  async getUserLevels(): Promise<UserLevel[]> {
    const { data, error } = await supabase
      .from("user_levels")
      .select("*")
      .order("level", { ascending: true });

    if (error) {
      console.error("Error fetching user levels:", error);
      return LEVELS; // Fallback to hardcoded levels
    }

    return (
      data.map((level) => ({
        level: level.level,
        min_points: level.min_points,
        max_points: level.max_points,
        title: level.title,
      })) || LEVELS
    );
  },
};

export default gamificationService;
