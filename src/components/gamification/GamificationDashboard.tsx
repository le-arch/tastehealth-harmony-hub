
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
import { supabase } from "../../lib/SupabaseClient";

// Add imports for the new components
import LevelBenefits from "./LevelBenefits";
import PointsTransactionHistory from "./PointsTransactionHistory";
import NutritionQuest from "./NutritionQuest";

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
    const fetchGamificationData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
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

    fetchGamificationData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
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

  // Handle quest completion
  const handleQuestCompletion = async (questId: string, points: number) => {
    if (!user?.id) return;

    // Award points for completing the quest
    await gamificationService.awardPoints(
      user.id,
      points,
      "Completed daily quest",
      questId,
      "quest"
    );

    // Refresh user data
    fetchUserData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Nutrition Gamification
      </h1>

      {/* User Level and Points */}
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

      {/* Today's Quests */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {user?.id && (
          <NutritionQuest
            userId={user.id}
            addPoints={async (points, reason) => {
              await gamificationService.awardPoints(user.id, points, reason);
              fetchUserData();
            }}
          />
        )}
      </div>

      {/* Active Challenges */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Active Challenges</h2>

        {challenges.length === 0 ? (
          <p className="text-gray-600">
            No active challenges. Start a new challenge!
          </p>
        ) : (
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
        )}

        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          onClick={() => navigate("/challenges")}
        >
          Browse Challenges
        </button>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Achievements</h2>

        {achievements.length === 0 ? (
          <p className="text-gray-600">
            No achievements yet. Complete challenges to earn achievements!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.slice(0, 4).map((userAchievement) => (
              <div
                key={userAchievement.id}
                className="border rounded-lg p-4 bg-gray-50 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <span className="text-2xl text-green-600">
                    <i
                      className={`fas fa-${
                        userAchievement.achievement?.icon || "award"
                      }`}
                    ></i>
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-center">
                  {userAchievement.achievement?.name}
                </h3>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {new Date(userAchievement.earned_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {achievements.length > 0 && (
          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            onClick={() => navigate("/achievements")}
          >
            View All Achievements
          </button>
        )}
      </div>

      {/* Streaks */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Streaks</h2>

        {streaks.length === 0 ? (
          <p className="text-gray-600">
            No streaks yet. Start logging your nutrition daily!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streaks.map((streak) => (
              <div key={streak.id} className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2 capitalize">
                  {streak.streak_type.replace("_", " ")}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                    <p className="text-2xl font-bold text-green-600">
                      {streak.current_streak} days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Longest Streak</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {streak.longest_streak} days
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Your Badges</h2>

        {badges.length === 0 ? (
          <p className="text-gray-600">
            No badges yet. Complete achievements to earn badges!
          </p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {badges.map((userBadge) => (
              <div
                key={userBadge.id}
                className={`border rounded-lg p-4 flex flex-col items-center w-24 ${
                  userBadge.is_equipped
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-gray-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${getBadgeColorClass(
                    userBadge.badge?.rarity || "common"
                  )}`}
                >
                  <span className="text-xl">
                    <i
                      className={`fas fa-${
                        userBadge.badge?.icon || "certificate"
                      }`}
                    ></i>
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-center">
                  {userBadge.badge?.name}
                </h3>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {userBadge.badge?.rarity}
                </p>
              </div>
            ))}
          </div>
        )}

        {badges.length > 0 && (
          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            onClick={() => navigate("/badges")}
          >
            Manage Badges
          </button>
        )}
      </div>

      {userId && (
        <>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Level Benefits</h2>
            <LevelBenefits userId={userId} />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Points History</h2>
            <PointsTransactionHistory userId={userId} limit={5} />
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to get badge color based on rarity
function getBadgeColorClass(rarity: string): string {
  switch (rarity) {
    case "common":
      return "bg-gray-200 text-gray-700";
    case "uncommon":
      return "bg-green-200 text-green-700";
    case "rare":
      return "bg-blue-200 text-blue-700";
    case "legendary":
      return "bg-purple-200 text-purple-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
}

export default GamificationDashboard;
