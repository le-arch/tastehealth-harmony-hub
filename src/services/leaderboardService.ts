
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  points: number;
  level: number;
  rank: number;
  is_dummy?: boolean;
}

const DUMMY_USERS: Omit<LeaderboardEntry, 'rank'>[] = [
  {
    user_id: 'dummy-1',
    username: 'NutritionNinja',
    avatar_url: null,
    points: 15000,
    level: 10,
    is_dummy: true
  },
  {
    user_id: 'dummy-2',
    username: 'HealthyHero',
    avatar_url: null,
    points: 12500,
    level: 9,
    is_dummy: true
  },
  {
    user_id: 'dummy-3',
    username: 'VeggieMaster',
    avatar_url: null,
    points: 10200,
    level: 8,
    is_dummy: true
  },
  {
    user_id: 'dummy-4',
    username: 'FitnessGuru',
    avatar_url: null,
    points: 8750,
    level: 7,
    is_dummy: true
  },
  {
    user_id: 'dummy-5',
    username: 'WellnessWarrior',
    avatar_url: null,
    points: 7200,
    level: 7,
    is_dummy: true
  },
  {
    user_id: 'dummy-6',
    username: 'CleanEater',
    avatar_url: null,
    points: 6800,
    level: 6,
    is_dummy: true
  },
  {
    user_id: 'dummy-7',
    username: 'BalancedBuddy',
    avatar_url: null,
    points: 5900,
    level: 6,
    is_dummy: true
  },
  {
    user_id: 'dummy-8',
    username: 'MindfulMeals',
    avatar_url: null,
    points: 4750,
    level: 5,
    is_dummy: true
  },
  {
    user_id: 'dummy-9',
    username: 'ProteinPro',
    avatar_url: null,
    points: 4200,
    level: 5,
    is_dummy: true
  },
  {
    user_id: 'dummy-10',
    username: 'CalorieCounter',
    avatar_url: null,
    points: 3800,
    level: 4,
    is_dummy: true
  },
  {
    user_id: 'dummy-11',
    username: 'FiberFan',
    avatar_url: null,
    points: 3400,
    level: 4,
    is_dummy: true
  },
  {
    user_id: 'dummy-12',
    username: 'VitaminVanguard',
    avatar_url: null,
    points: 2900,
    level: 3,
    is_dummy: true
  }
];

export const getLeaderboard = async (userId?: string): Promise<{
  leaderboard: LeaderboardEntry[];
  userRank: LeaderboardEntry | null;
}> => {
  try {
    // Get real users from user_points table
    const { data: realUsers, error } = await supabase
      .from("user_points")
      .select(`
        user_id,
        total_points,
        current_level,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .order("total_points", { ascending: false });

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return { leaderboard: [], userRank: null };
    }

    // Format real users
    const formattedRealUsers: Omit<LeaderboardEntry, 'rank'>[] = (realUsers || []).map((entry: any) => ({
      user_id: entry.user_id,
      username: entry.profiles?.username || `User ${entry.user_id.slice(0, 4)}`,
      avatar_url: entry.profiles?.avatar_url || null,
      points: entry.total_points,
      level: entry.current_level,
      is_dummy: false
    }));

    // Combine real users with dummy data
    const allUsers = [...formattedRealUsers, ...DUMMY_USERS];

    // Sort by points and assign ranks
    allUsers.sort((a, b) => b.points - a.points);
    const leaderboard: LeaderboardEntry[] = allUsers.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    // Find current user's rank
    const userRank = userId ? leaderboard.find(entry => entry.user_id === userId) || null : null;

    // Return top 50 for leaderboard display
    return {
      leaderboard: leaderboard.slice(0, 50),
      userRank
    };
  } catch (error) {
    console.error("Error in getLeaderboard:", error);
    return { leaderboard: [], userRank: null };
  }
};
