"use client";

import { useState, useEffect } from "react";
import {
  MapIcon,
  Award,
  Shield,
  Star,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/SupabaseClient";
import gamificationService from "@/services/gamificationService";
import NutritionQuest from "@/components/gamification/NutritionQuest";
import ChallengeList from "@/components/gamification/ChallengeList";
import NutritionBadges from "@/components/gamification/NutritionBadges";
import UserLevelCard from "@/components/gamification/UserLevelCard";
import DailyStreak from "@/components/gamification/DailyStreak";
import NutritionLeaderboard from "@/components/gamification/NutritionLeaderboard";

const NutritionGamePage = () => {
  const [userId, setUserId] = useState<string | undefined>();
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const { language } = useLanguage();
  const translations = useTranslations(language);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        
        // Get user points
        try {
          const userPointsData = await gamificationService.getUserPoints(data.user.id);
          if (userPointsData) {
            setUserPoints(userPointsData.total_points);
            setUserLevel(userPointsData.current_level);
          }
        } catch (error) {
          console.error("Error fetching user points:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleAddPoints = async (points: number, reason: string): Promise<void> => {
    if (!userId) return;
    
    try {
      const result = await gamificationService.awardPoints(userId, points, reason);
      
      if (result.success) {
        // Update the points display
        const userPointsData = await gamificationService.getUserPoints(userId);
        if (userPointsData) {
          setUserPoints(userPointsData.total_points);
          setUserLevel(userPointsData.current_level);
        }
        
        // Show a toast notification
        toast.success(translations.pointsEarned, {
          description: `+${points} ${translations.points} - ${reason}`,
        });
        
        // If leveled up, show special notification
        if (result.levelUp) {
          toast.success(translations.levelUp, {
            description: `${translations.reachedLevel} ${result.newLevel}!`,
          });
        }
      }
    } catch (error) {
      console.error("Error adding points:", error);
    }
  };

  const nutritionGame = translations("nutritionGame");
  const points = translations("points");
  const level = translations("level");
  const quests = translations("quests");
  const challenges = translations("challenges");
  const badges = translations("badges");
  const nutritionChallenges = translations("nutritionChallenges");
  const leaderboard = translations("leaderboard");
  const pointsEarned = translations("pointsEarned");
  const levelUp = translations("levelUp");
  const reachedLevel = translations("reachedLevel");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{nutritionGame}</h1>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="text-base">
            <Star className="h-4 w-4 text-yellow-500 mr-1" /> {userPoints} {points}
          </Badge>
          <Badge variant="outline" className="text-base">
            <Award className="h-4 w-4 text-purple-500 mr-1" /> {level} {userLevel}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <Tabs defaultValue="quests">
            <TabsList className="mb-4">
              <TabsTrigger value="quests">
                <MapIcon className="h-4 w-4 mr-1" /> {quests}
              </TabsTrigger>
              <TabsTrigger value="challenges">
                <Award className="h-4 w-4 mr-1" /> {challenges}
              </TabsTrigger>
              <TabsTrigger value="badges">
                <Shield className="h-4 w-4 mr-1" /> {badges}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="quests">
              <NutritionQuest 
                userId={userId} 
                addPoints={handleAddPoints} 
              />
            </TabsContent>
            <TabsContent value="challenges">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">{nutritionChallenges}</h2>
                <ChallengeList userId={userId} />
              </div>
            </TabsContent>
            <TabsContent value="badges">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">{badges}</h2>
                <NutritionBadges userId={userId} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <UserLevelCard userId={userId} />
          <div className="mt-6">
            <DailyStreak userId={userId} />
          </div>
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{leaderboard}</CardTitle>
              </CardHeader>
              <CardContent>
                <NutritionLeaderboard limit={5} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionGamePage;
