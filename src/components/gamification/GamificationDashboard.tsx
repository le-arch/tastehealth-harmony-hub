
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gamificationService, {
  type UserPoints,
  type UserChallenge,
  type UserAchievement,
  type UserBadge,
  type NutritionStreak,
} from "../../services/gamificationService";
import { supabase } from "@/integrations/supabase/client";

// Add imports for the new components
import LevelBenefits from "./LevelBenefits";
import PointsTransactionHistory from "./PointsTransactionHistory";
import NutritionQuest from "./NutritionQuest";
import NutritionLeaderboard from "./NutritionLeaderboard";
import NutritionBadges from "./NutritionBadges";

const GamificationDashboard: React.FC = () => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [streaks, setStreaks] = useState<NutritionStreak[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Don't redirect, just set loading to false for guest users
        setLoading(false);
        return;
      }

      setUser(user);
      const userId = user.id;
      setUserId(userId);

      // Fetch all gamification data in parallel
      const [
        pointsData,
        challengesData,
        achievementsData,
        badgesData,
        streaksData,
      ] = await Promise.all([
        gamificationService.getUserPoints(userId),
        gamificationService.getUserChallenges(userId),
        gamificationService.getUserAchievements(userId),
        gamificationService.getUserBadges(userId),
        gamificationService.getNutritionStreaks(userId),
      ]);

      setUserPoints(pointsData);
      setChallenges(challengesData);
      setAchievements(achievementsData);
      setBadges(badgesData);
      setStreaks(streaksData);
    } catch (error) {
      console.error("Error fetching gamification data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced addPoints function that integrates with gamificationService
  const addPoints = async (points: number, reason: string) => {
    if (!user?.id) return;

    try {
      // Use the gamificationService to award points
      await gamificationService.awardPoints(
        user.id,
        points,
        reason,
        undefined,
        "quest"
      );

      // Refresh user data to reflect changes
      await fetchGamificationData();
    } catch (error) {
      console.error("Error awarding points:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Nutrition Gamification
      </h1>

      {/* User Level and Points */}
      {userPoints && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">
                Level {userPoints?.current_level || 1}
              </h2>
              <p className="text-gray-600">
                {userPoints?.total_points || 0} total points
              </p>
            </div>

            <div className="w-full md:w-2/3">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                      Progress to Level {(userPoints?.current_level || 1) + 1}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-green-600">
                      {userPoints
                        ? Math.round(
                            100 -
                              (userPoints.points_to_next_level /
                                (userPoints.current_level * 100 + 100)) *
                                100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                  <div
                    style={{
                      width: userPoints
                        ? `${Math.round(
                            100 -
                              (userPoints.points_to_next_level /
                                (userPoints.current_level * 100 + 100)) *
                                100
                          )}%`
                        : "0%",
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {userPoints?.points_to_next_level || 100} points needed for next
                  level
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout for Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nutrition Quests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Nutrition Quests</h2>
          <NutritionQuest userId={user?.id} addPoints={addPoints} />
        </div>

        {/* Nutrition Badges */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Nutrition Badges</h2>
          <NutritionBadges userId={user?.id} addPoints={addPoints} />
        </div>
      </div>

      {/* Nutrition Leaderboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <NutritionLeaderboard userId={user?.id} />
      </div>

      {/* Level Benefits and Points History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Level Benefits */}
        {userId && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Level Benefits</h2>
            <LevelBenefits userId={userId} />
          </div>
        )}

        {/* Points Transaction History */}
        {userId && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Points History</h2>
            <PointsTransactionHistory userId={userId} limit={10} />
          </div>
        )}
      </div>

      {/* Active Challenges */}
      {challenges.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Active Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges
              .filter((challenge) => challenge.status === "in_progress")
              .map((challenge) => (
                <div
                  key={challenge.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">
                      {challenge.challenge?.icon && (
                        <i className={`fas fa-${challenge.challenge.icon}`}></i>
                      )}
                    </span>
                    <h3 className="text-lg font-semibold">
                      {challenge.challenge?.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {challenge.challenge?.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                      50 points
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {challenge.challenge?.difficulty}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationDashboard;
