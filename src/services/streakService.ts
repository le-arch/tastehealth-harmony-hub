
import { supabase } from "@/lib/SupabaseClient";

export interface DailyStreak {
  id: string;
  user_id: string;
  date: string;
  streak_count: number;
  created_at: string;
  updated_at: string;
}

export const recordDailyStreak = async (userId: string): Promise<{ success: boolean; streakCount: number }> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if streak already recorded for today
    const { data: existingStreak } = await supabase
      .from('daily_streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();
    
    if (existingStreak) {
      return { success: false, streakCount: existingStreak.streak_count };
    }
    
    // Get yesterday's streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const { data: yesterdayStreak } = await supabase
      .from('daily_streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('date', yesterdayStr)
      .single();
    
    // Calculate new streak count
    const newStreakCount = yesterdayStreak ? yesterdayStreak.streak_count + 1 : 1;
    
    // Insert today's streak
    const { error } = await supabase
      .from('daily_streaks')
      .insert({
        user_id: userId,
        date: today,
        streak_count: newStreakCount
      });
    
    if (error) throw error;
    
    return { success: true, streakCount: newStreakCount };
  } catch (error) {
    console.error('Error recording daily streak:', error);
    return { success: false, streakCount: 0 };
  }
};

export const getCurrentStreak = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('daily_streaks')
      .select('streak_count')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    
    return data?.streak_count || 0;
  } catch (error) {
    console.error('Error getting current streak:', error);
    return 0;
  }
};
