"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Crown } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileSidebar from "../profile/ProfileSidebar";
import RewardSystem from "../RewardSystem";
import NutritionProgressWheel from "../nutrition/NutritionProgressWheel";
import MealMoodTracker from "../nutrition/MealMoodTracker";
import NutritionChallenge from "../nutrition/NutritionChallenge";
import UserLevel from "./UserLevel";
import DailyStreak from "./DailyStreak";
import NutritionBadges from "./NutritionBadges";
import NutritionLeaderboard from "./NutritionLeaderboard";
import NutritionQuest from "./NutritionQuest";
import { useScreenSize } from "@/utils/mobile";

interface NutritionGamificationSystemProps {
  userId?: string;
  standalone?: boolean;
}

const NutritionGamificationSystem = ({
  userId,
  standalone = true,
}: NutritionGamificationSystemProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [streak, setStreak] = useState(0);
  const { language } = useLanguage();
  const { isMobile, isTablet } = useScreenSize();

  // Translations
  const translations = {
    en: {
      title: "Nutrition Game Center",
      dashboard: "Dashboard",
      challenges: "Challenges",
      rewards: "Rewards",
      badges: "Badges",
      leaderboard: "Leaderboard",
      quests: "Quests",
      yourLevel: "Your Level",
      yourPoints: "Your Points",
      dailyStreak: "Daily Streak",
      days: "days",
      levelUp: "Level Up!",
      congratulations: "Congratulations! You've reached level",
      continue: "Continue",
      pointsEarned: "Points earned",
      pointsNeeded: "Points needed for next level",
    },
    fr: {
      title: "Centre de Jeu Nutritionnel",
      dashboard: "Tableau de Bord",
      challenges: "Défis",
      rewards: "Récompenses",
      badges: "Badges",
      leaderboard: "Classement",
      quests: "Quêtes",
      yourLevel: "Votre Niveau",
      yourPoints: "Vos Points",
      dailyStreak: "Série Quotidienne",
      days: "jours",
      levelUp: "Niveau Supérieur !",
      congratulations: "Félicitations ! Vous avez atteint le niveau",
      continue: "Continuer",
      pointsEarned: "Points gagnés",
      pointsNeeded: "Points nécessaires pour le niveau suivant",
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.en;

  // Load user gamification data
  useEffect(() => {
    const loadUserGamificationData = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from("user_gamification")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching user gamification data:", error);
          return;
        }

        if (data) {
          setUserPoints(data.points || 0);
          setUserLevel(data.level || 1);
          setStreak(data.streak || 0);
        } else {
          // Create initial gamification record for user
          await supabase.from("user_gamification").insert({
            user_id: userId,
            points: 0,
            level: 1,
            streak: 0,
            last_check_in: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error in loadUserGamificationData:", error);
      }
    };

    loadUserGamificationData();
  }, [userId]);

  // Calculate points needed for next level
  const getPointsForNextLevel = (level: number) => {
    // Exponential growth formula for level requirements
    return Math.floor(100 * Math.pow(1.5, level - 1));
  };

  // Add points to user
  const addPoints = async (points: number, reason: string) => {
    if (!userId) return;

    try {
      const newPoints = userPoints + points;
      const pointsForNextLevel = getPointsForNextLevel(userLevel);
      let newLevel = userLevel;

      // Check if user leveled up
      if (newPoints >= pointsForNextLevel) {
        newLevel = userLevel + 1;
        setShowLevelUp(true);

        // Play level up sound
        const audio = new Audio("/sounds/level-up.mp3");
        audio.play().catch((e) => console.log("Audio play failed:", e));
      }

      // Update state
      setUserPoints(newPoints);
      setUserLevel(newLevel);

      // Update database
      await supabase.from("user_gamification").upsert({
        user_id: userId,
        points: newPoints,
        level: newLevel,
        last_updated: new Date().toISOString(),
      });

      // Add points history
      await supabase.from("points_history").insert({
        user_id: userId,
        points: points,
        reason: reason,
        created_at: new Date().toISOString(),
      });

      // Show toast notification
      toast.success(`+${points} points: ${reason}`, {
        description: `You now have ${newPoints} points`,
      });
    } catch (error) {
      console.error("Error adding points:", error);
    }
  };

  // Update streak
  const updateStreak = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("user_gamification")
        .select("streak, last_check_in")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching streak data:", error);
        return;
      }

      const lastCheckIn = new Date(data.last_check_in);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Check if last check-in was yesterday
      const isConsecutiveDay =
        lastCheckIn.getDate() === yesterday.getDate() &&
        lastCheckIn.getMonth() === yesterday.getMonth() &&
        lastCheckIn.getFullYear() === yesterday.getFullYear();

      // Check if already checked in today
      const isToday =
        lastCheckIn.getDate() === today.getDate() &&
        lastCheckIn.getMonth() === today.getMonth() &&
        lastCheckIn.getFullYear() === today.getFullYear();

      if (!isToday) {
        const newStreak = isConsecutiveDay ? data.streak + 1 : 1;
        setStreak(newStreak);

        // Update streak in database
        await supabase
          .from("user_gamification")
          .update({
            streak: newStreak,
            last_check_in: today.toISOString(),
          })
          .eq("user_id", userId);

        // Award points for streak
        if (newStreak > 0) {
          // Base points for check-in
          let streakPoints = 10;

          // Bonus points for milestone streaks
          if (newStreak % 7 === 0) streakPoints += 50;
          else if (newStreak % 3 === 0) streakPoints += 20;

          addPoints(streakPoints, `${newStreak} day streak bonus`);

          // Play streak sound
          const audio = new Audio("/sounds/streak.mp3");
          audio.play().catch((e) => console.log("Audio play failed:", e));
        }
      }
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-amber-500" />
          {t.title}
        </h2>
      </div>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            onClick={() => setShowLevelUp(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ rotate: 0, scale: 1 }}
                animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                <Crown className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">{t.levelUp}</h3>
              <p className="text-lg mb-4">
                {t.congratulations} {userLevel}!
              </p>
              <div className="mb-6 space-y-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="h-2 bg-green-500 rounded-full"
                />
                <div className="flex justify-between text-sm">
                  <span>Level {userLevel - 1}</span>
                  <span>Level {userLevel}</span>
                </div>
              </div>
              <Button onClick={() => setShowLevelUp(false)}>
                {t.continue}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserLevel
          level={userLevel}
          points={userPoints}
          pointsForNextLevel={getPointsForNextLevel(userLevel)}
        />
        <DailyStreak streak={streak} updateStreak={updateStreak} />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Zap className="h-4 w-4 mr-2 text-purple-500" />
              {t.yourPoints}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userPoints}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {getPointsForNextLevel(userLevel) - userPoints} {t.pointsNeeded}
            </div>
            <Progress
              value={(userPoints / getPointsForNextLevel(userLevel)) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <ScrollableTabsList className={`w-full ${isMobile ? '' : 'grid-cols-6'}`}>
          <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
          <TabsTrigger value="challenges">{t.challenges}</TabsTrigger>
          <TabsTrigger value="rewards">{t.rewards}</TabsTrigger>
          <TabsTrigger value="badges">{t.badges}</TabsTrigger>
          <TabsTrigger value="leaderboard">{t.leaderboard}</TabsTrigger>
          <TabsTrigger value="quests">{t.quests}</TabsTrigger>
        </ScrollableTabsList>

        <TabsContent value="dashboard" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
            <NutritionProgressWheel />
            <MealMoodTracker />
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <NutritionChallenge />
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <RewardSystem />
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <NutritionBadges userId={userId} addPoints={addPoints} />
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <NutritionLeaderboard userId={userId} />
        </TabsContent>

        <TabsContent value="quests" className="mt-6">
          <NutritionQuest userId={userId} addPoints={addPoints} />
        </TabsContent>
      </Tabs>
    </div>
  );

  if (!standalone) {
    return content;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="Nutrition Game" />
      <div className={`flex-1 p-8 ${isMobile ? '' : 'ml-64'}`}>{content}</div>
    </div>
  );
};

export default NutritionGamificationSystem;
