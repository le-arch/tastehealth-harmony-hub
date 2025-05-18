
import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/SupabaseClient";
import DailyQuestsList from "@/components/gamification/DailyQuestLists";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Trophy, Award } from "lucide-react";
import { toast } from "sonner";
import gamificationService from "@/services/gamificationService";

const GamificationPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user?.id) {
          setUserId(data.user.id);
          
          // Get user points
          const pointsData = await gamificationService.getUserPoints(data.user.id);
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
      const result = await gamificationService.awardPoints(userId, points, reason);
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
      <div className="container mx-auto py-8 px-4">
        {/* Points overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Your Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userPoints}</p>
              <p className="text-sm text-gray-500">Complete quests to earn more</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-blue-500" />
                Active Quests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Complete daily quests to earn rewards and improve your nutrition habits
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Unlock achievements by completing quests and meeting nutrition goals
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quests and other content */}
        <div className="space-y-6">
          <DailyQuestsList />
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
