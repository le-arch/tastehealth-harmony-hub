
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Award, LayoutDashboard, Target, Gift, Compass } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
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
import { getLS, setLS, LS_KEYS, PointsTransaction } from "@/utils/localStorage";

interface NutritionGamificationSystemProps { userId?: string; standalone?: boolean; }

const NutritionGamificationSystem = ({ userId, standalone = true }: NutritionGamificationSystemProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userPoints, setUserPoints] = useState(getLS<number>(LS_KEYS.POINTS, 0));
  const [userLevel, setUserLevel] = useState(getLS<number>(LS_KEYS.LEVEL, 1));
  const [streak, setStreak] = useState(getLS<number>(LS_KEYS.STREAK, 0));
  const { language } = useLanguage();
  const { isMobile } = useScreenSize();

  const t = language === 'fr'
    ? { title: "Centre de Jeu Nutritionnel", dashboard: "Tableau de Bord", challenges: "Défis", rewards: "Récompenses", badges: "Badges", leaderboard: "Classement", quests: "Quêtes", yourPoints: "Vos Points", pointsNeeded: "Points nécessaires" }
    : { title: "Nutrition Game Center", dashboard: "Dashboard", challenges: "Challenges", rewards: "Rewards", badges: "Badges", leaderboard: "Leaderboard", quests: "Quests", yourPoints: "Your Points", pointsNeeded: "Points needed for next level" };

  const getPointsForNextLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

  const addPoints = async (points: number, reason: string) => {
    const newPts = userPoints + points;
    setUserPoints(newPts); setLS(LS_KEYS.POINTS, newPts);
    // Check level up
    const nextLevelPts = getPointsForNextLevel(userLevel);
    if (newPts >= nextLevelPts) {
      const newLevel = userLevel + 1;
      setUserLevel(newLevel); setLS(LS_KEYS.LEVEL, newLevel);
    }
    // Record transaction
    const history = getLS<PointsTransaction[]>(LS_KEYS.POINTS_HISTORY, []);
    history.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), points, reason });
    setLS(LS_KEYS.POINTS_HISTORY, history.slice(0, 100));
  };

  const updateStreak = async () => { setStreak(s => s + 1); };

  const content = (
    <div className="space-y-6 flex-1 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center"><Trophy className="h-6 w-6 mr-2 text-amber-500" />{t.title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserLevel level={userLevel} points={userPoints} pointsForNextLevel={getPointsForNextLevel(userLevel)} />
        <DailyStreak streak={streak} updateStreak={updateStreak} />
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center"><Zap className="h-4 w-4 mr-2 text-purple-500" />{t.yourPoints}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userPoints}</div>
            <div className="text-xs text-muted-foreground mt-1">{getPointsForNextLevel(userLevel) - userPoints} {t.pointsNeeded}</div>
            <Progress value={(userPoints / getPointsForNextLevel(userLevel)) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
        <ScrollableTabsList className={`w-full ${isMobile ? "" : "grid-cols-4"}`}>
          <TabsTrigger value="dashboard"><LayoutDashboard className="h-4 w-4" />{!isMobile && t.dashboard}</TabsTrigger>
          <TabsTrigger value="challenges"><Target className="h-4 w-4" />{!isMobile && t.challenges}</TabsTrigger>
          <TabsTrigger value="rewards"><Gift className="h-4 w-4" />{!isMobile && t.rewards}</TabsTrigger>
          <TabsTrigger value="badges"><Award className="h-4 w-4" />{!isMobile && t.badges}</TabsTrigger>
          <TabsTrigger value="leaderboard"><Trophy className="h-4 w-4" />{!isMobile && t.leaderboard}</TabsTrigger>
          <TabsTrigger value="quests"><Compass className="h-4 w-4" />{!isMobile && t.quests}</TabsTrigger>
        </ScrollableTabsList>
        <TabsContent value="dashboard" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-10"><NutritionProgressWheel /><MealMoodTracker /></div>
        </TabsContent>
        <TabsContent value="challenges" className="mt-6"><NutritionChallenge /></TabsContent>
        <TabsContent value="rewards" className="mt-6"><RewardSystem /></TabsContent>
        <TabsContent value="badges" className="mt-6"><NutritionBadges userId={userId} addPoints={addPoints} /></TabsContent>
        <TabsContent value="leaderboard" className="mt-6"><NutritionLeaderboard userId={userId} /></TabsContent>
        <TabsContent value="quests" className="mt-6"><NutritionQuest userId={userId} addPoints={addPoints} /></TabsContent>
      </Tabs>
    </div>
  );

  if (!standalone) return content;
  return (
    <div className="flex min-h-screen bg-background">
      <ProfileSidebar activePage="Nutrition Game" />
      <div className={`flex-1 p-8 ${isMobile ? "" : "ml-64"}`}>{content}</div>
    </div>
  );
};

export default NutritionGamificationSystem;
