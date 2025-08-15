import { supabase } from '@/integrations/supabase/client';

export interface UserProgression {
  user_id: string;
  stage: 'goals' | 'game' | 'points' | 'challenges' | 'level' | 'complete';
  completed_goal_wizard: boolean;
  played_nutrition_game: boolean;
  has_points: boolean;
  joined_challenge: boolean;
  viewed_level_benefits: boolean;
  created_at: string;
  updated_at: string;
}

export const progressionService = {
  async getUserProgression(userId: string): Promise<UserProgression | null> {
    try {
      const { data, error } = await supabase
        .from('user_progression')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user progression:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProgression:', error);
      return null;
    }
  },

  async advanceProgression(userId: string, event: string): Promise<UserProgression | null> {
    try {
      const { data, error } = await supabase.rpc('advance_progression', {
        p_user_id: userId,
        p_event: event
      });

      if (error) {
        console.error('Error advancing progression:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in advanceProgression:', error);
      return null;
    }
  },

  async canAccess(userId: string, requiredStage: string): Promise<boolean> {
    const progression = await this.getUserProgression(userId);
    if (!progression) return false;

    const stages = ['goals', 'game', 'points', 'challenges', 'level', 'complete'];
    const currentIndex = stages.indexOf(progression.stage);
    const requiredIndex = stages.indexOf(requiredStage);

    return currentIndex >= requiredIndex;
  }
};

export default progressionService;