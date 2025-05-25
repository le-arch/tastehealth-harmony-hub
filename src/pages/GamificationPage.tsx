import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/SupabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Trophy, Award } from "lucide-react";
import { toast } from "sonner";
import gamificationService from "@/services/gamificationService";
import { useScreenSize } from "@/utils/mobile";
import DailyQuests from "@/components/gamification/DailyQuest";

const GamificationPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
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
      if (result.success) {
        // Update the displayed points
        const pointsData = await gamificationService.getUserPoints(userId);
        if (pointsData) {
          setUserPoints(pointsData.total_points || 0);
        }

        // Show level up notification if applicable
        if (result.levelUp) {
          toast.success(`Level Up! You're now level ${result.newLevel}`);
        }
      }
    } catch (error) {
      console.error("Error awarding points:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-6 px-4 sm:px-6">
        {/* Points overview */}
        <div
          className={`grid grid-cols-1 ${
            isTablet ? "md:grid-cols-2" : "md:grid-cols-3"
          } gap-4 sm:gap-6 mb-6 sm:mb-8`}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Your Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userPoints}</p>
              <p className="text-sm text-gray-500">
                Complete quests to earn more
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-blue-500" />
                Active Quests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Complete daily quests to earn rewards and improve your nutrition
                habits
              </p>
            </CardContent>
          </Card>

          <Card
            className={`h-full ${isTablet ? "col-span-2 md:col-span-1" : ""}`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Unlock achievements by completing quests and meeting nutrition
                goals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quests and other content */}
        <div className="space-y-6">
          <DailyQuests onQuestComplete={function (questId: string, points: number): Promise<void> {
            throw new Error("Function not implemented.");
          } } />
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
