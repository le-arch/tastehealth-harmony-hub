
import { supabase } from "@/integrations/supabase/client";

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  current_level: number;
  points_to_next_level: number;
  created_at: string;
  updated_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress: any;
  started_at: string;
  completed_at?: string;
  challenge?: Challenge;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration_days: number;
  points_reward: number;
  icon?: string;
  category: string;
  requirements: any;
  active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirements: any;
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  active: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
  is_equipped: boolean;
  progress: number;
  total: number;
  badge?: Badge;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_count: number;
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  active: boolean;
  created_at: string;
}

export interface NutritionStreak {
  id: string;
  user_id: string;
  streak_type: 'daily_logging' | 'water_intake' | 'exercise' | 'sleep';
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  created_at: string;
  updated_at: string;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  transaction_type: 'earn' | 'spend';
  reason: string;
  reference_id?: string;
  reference_type?: string;
  metadata?: any;
  created_at: string;
}

export interface NutritionTip {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
}

// User Points Functions
export const getUserPoints = async (userId: string): Promise<UserPoints | null> => {
  try {
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user points:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserPoints:', error);
    return null;
  }
};

export const updateUserPoints = async (userId: string, points: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_points')
      .upsert({
        user_id: userId,
        total_points: points,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating user points:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserPoints:', error);
    return false;
  }
};

export const awardPoints = async (
  userId: string,
  points: number,
  reason: string,
  referenceId?: string,
  referenceType?: string,
  metadata?: any
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('record_points_transaction', {
      p_user_id: userId,
      p_points: points,
      p_transaction_type: 'earn',
      p_reason: reason,
      p_reference_id: referenceId,
      p_reference_type: referenceType,
      p_metadata: metadata
    });

    if (error) {
      console.error('Error awarding points:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in awardPoints:', error);
    return null;
  }
};

// Challenges Functions
export const getUserChallenges = async (userId: string): Promise<UserChallenge[]> => {
  try {
    const { data, error } = await supabase
      .from('user_quests')
      .select(`
        *,
        quest:quest_id (
          id,
          title,
          description,
          difficulty,
          duration_days,
          rewards,
          category,
          icon
        )
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching user challenges:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserChallenges:', error);
    return [];
  }
};

export const getAvailableChallenges = async (): Promise<Challenge[]> => {
  try {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching available challenges:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAvailableChallenges:', error);
    return [];
  }
};

export const joinChallenge = async (userId: string, challengeId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_quests')
      .insert({
        user_id: userId,
        quest_id: challengeId,
        status: 'in_progress',
        started_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error joining challenge:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in joinChallenge:', error);
    return false;
  }
};

// Achievements Functions
export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badge_id (
          id,
          name,
          description,
          icon,
          category,
          points,
          rarity
        )
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserAchievements:', error);
    return [];
  }
};

// Badges Functions
export const getUserBadges = async (userId: string): Promise<UserBadge[]> => {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badge_id (
          id,
          name,
          description,
          icon,
          category,
          requirement_count,
          points,
          rarity
        )
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserBadges:', error);
    return [];
  }
};

export const unlockBadge = async (userId: string, badgeId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId,
        unlocked_at: new Date().toISOString(),
        progress: 1,
        total: 1
      });

    if (error) {
      console.error('Error unlocking badge:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in unlockBadge:', error);
    return false;
  }
};

// Streaks Functions
export const getNutritionStreaks = async (userId: string): Promise<NutritionStreak[]> => {
  try {
    // For now, return mock data since we're focusing on daily_streaks table
    return [
      {
        id: '1',
        user_id: userId,
        streak_type: 'daily_logging',
        current_streak: 5,
        longest_streak: 12,
        last_activity_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error('Error in getNutritionStreaks:', error);
    return [];
  }
};

// Points Transactions Functions
export const getPointsTransactions = async (
  userId: string,
  limit: number = 50
): Promise<PointsTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('points_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching points transactions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPointsTransactions:', error);
    return [];
  }
};

// Nutrition Tips Functions
export const getNutritionTips = async (
  category?: string,
  difficulty?: string
): Promise<NutritionTip[]> => {
  try {
    // Return mock data for now
    const tips: NutritionTip[] = [
      {
        id: '1',
        title: 'Stay Hydrated',
        content: 'Drink at least 8 glasses of water daily for optimal health.',
        category: 'hydration',
        difficulty_level: 'beginner'
      },
      {
        id: '2',
        title: 'Eat Colorful Vegetables',
        content: 'Include a variety of colorful vegetables in your meals for diverse nutrients.',
        category: 'nutrition',
        difficulty_level: 'beginner'
      }
    ];

    return tips;
  } catch (error) {
    console.error('Error in getNutritionTips:', error);
    return [];
  }
};

// Utility Functions
export const calculateLevel = (points: number): number => {
  if (points < 100) return 1;
  if (points < 250) return 2;
  if (points < 500) return 3;
  if (points < 1000) return 4;
  if (points < 2000) return 5;
  if (points < 3500) return 6;
  if (points < 6000) return 7;
  if (points < 10000) return 8;
  if (points < 15000) return 9;
  return 10;
};

export const calculatePointsToNextLevel = (points: number): number => {
  if (points < 100) return 100 - points;
  if (points < 250) return 250 - points;
  if (points < 500) return 500 - points;
  if (points < 1000) return 1000 - points;
  if (points < 2000) return 2000 - points;
  if (points < 3500) return 3500 - points;
  if (points < 6000) return 6000 - points;
  if (points < 10000) return 10000 - points;
  if (points < 15000) return 15000 - points;
  return 0;
};

const gamificationService = {
  getUserPoints,
  updateUserPoints,
  awardPoints,
  getUserChallenges,
  getAvailableChallenges,
  joinChallenge,
  getUserAchievements,
  getUserBadges,
  unlockBadge,
  getNutritionStreaks,
  getPointsTransactions,
  getNutritionTips,
  calculateLevel,
  calculatePointsToNextLevel
};

export default gamificationService;
