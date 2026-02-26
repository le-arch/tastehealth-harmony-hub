
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Trophy, Award, Target } from "lucide-react";
import { useScreenSize } from "@/utils/mobile";
import NutritionQuest from "@/components/gamification/NutritionQuest";
import NutritionLeaderboard from "@/components/gamification/NutritionLeaderboard";
import NutritionBadges from "@/components/gamification/NutritionBadges";
import PointsTransactionHistory from "@/components/gamification/PointsTransactionHistory";

const GamificationPage: React.FC = () => {
  const { isTablet } = useScreenSize();
  const addPoints = async (points: number, reason: string) => {};

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Nutrition Gamification</h1>
          <p className="text-muted-foreground">Complete quests, earn points, and climb the leaderboard!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <NutritionQuest addPoints={addPoints} />
          <NutritionBadges addPoints={addPoints} />
        </div>
        <div className="mb-8"><NutritionLeaderboard /></div>
        <div className="mb-8"><PointsTransactionHistory userId="local" limit={15} /></div>
      </div>
    </div>
  );
};

export default GamificationPage;
