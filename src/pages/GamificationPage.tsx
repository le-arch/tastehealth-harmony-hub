
import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Trophy, Award, Target } from "lucide-react";
import { toast } from "sonner";
import gamificationService from "@/services/gamificationService";
import { useScreenSize } from "@/utils/mobile";
import NutritionQuest from "@/components/gamification/NutritionQuest";
import NutritionLeaderboard from "@/components/gamification/NutritionLeaderboard";
import NutritionBadges from "@/components/gamification/NutritionBadges";
import PointsTransactionHistory from "@/components/gamification/PointsTransactionHistory";

const GamificationPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isMobile, isTablet } = useScreenSize();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user?.id) {
          setUserId(data.user.id);

          // Get user points
          const pointsData = await gamificationService.getUserPoints(
            data.user.id
          );
          if (pointsData) {
            setUserPoints(pointsData.total_points || 0);
            setUserLevel(pointsData.current_level || 1);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handlePointsEarned = async (points: number, reason: string) => {
    if (!userId) return;

    try {
      const result = await gamificationService.awardPoints(
        userId,
        points,
        reason
      );
      
      if (result) {
        // Update the displayed points
        const pointsData = await gamificationService.getUserPoints(userId);
        if (pointsData) {
          setUserPoints(pointsData.total_points || 0);
          setUserLevel(pointsData.current_level || 1);
        }

        toast.success(`You earned ${points} points for ${reason}!`);
      }
    } catch (error) {
      console.error("Error awarding points:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-6 px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Nutrition Gamification
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete quests, earn points, and climb the leaderboard!
          </p>
        </div>

        {/* Points overview */}
        <div className={`grid grid-cols-1 ${
          isTablet ? "md:grid-cols-2" : "md:grid-cols-4"
        } gap-4 sm:gap-6 mb-6 sm:mb-8`}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Your Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{userPoints.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                Total points earned
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-blue-500" />
                Your Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{userLevel}</p>
              <p className="text-sm text-gray-500">
                Current level
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Active Quests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Complete nutrition quests to earn rewards and improve your health
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Unlock badges and achievements by completing goals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Nutrition Quests */}
          <div className="space-y-6">
            <NutritionQuest 
              userId={userId} 
              addPoints={handlePointsEarned}
            />
          </div>

          {/* Nutrition Badges */}
          <div className="space-y-6">
            <NutritionBadges 
              userId={userId} 
              addPoints={handlePointsEarned}
            />
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mb-8">
          <NutritionLeaderboard userId={userId} />
        </div>

        {/* Points History */}
        {userId && (
          <div className="mb-8">
            <PointsTransactionHistory userId={userId} limit={15} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationPage;
