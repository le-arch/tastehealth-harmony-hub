
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import MealPrepTimer from "./MealPrepTimer";
import HydrationTracker from "./HydrationTracker";
import NutritionProgressWheel from "./NutritionProgressWheel";
import { ChefHat, LayoutDashboard, Award, Pencil, Trophy } from "lucide-react";
import { useScreenSize } from "@/utils/mobile";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
};

type ProgressSummary = {
  calories_percentage: number;
  water_percentage: number;
  sleep_percentage: number;
  exercise_percentage: number;
};

const NutritionDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { isMobile, isTablet } = useScreenSize();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progressSummary, setProgressSummary] = useState<ProgressSummary>({
    calories_percentage: 0,
    water_percentage: 0,
    sleep_percentage: 0,
    exercise_percentage: 0,
  });
  const [loading, setLoading] = useState({
    achievements: true,
    progress: true,
  });

  const translations = {
    en: {
      dashboard: "Nutrition Dashboard",
      dailyProgress: "Daily Tools",
      summary: "Progress Summary",
      achievements: "Achievements",
      calories: "Calories",
      water: "Water",
      sleep: "Sleep",
      exercise: "Exercise",
      noAchievements: "No achievements yet. Complete challenges to earn achievements!",
      achievementEarned: "Earned on",
      loading: "Loading...",
    },
    fr: {
      dashboard: "Tableau de Bord Nutritionnel",
      dailyProgress: "Outils Quotidiens",
      summary: "Résumé des Progrès",
      achievements: "Réussites",
      calories: "Calories",
      water: "Eau",
      sleep: "Sommeil",
      exercise: "Exercice",
      noAchievements: "Pas encore de réussites. Complétez des défis pour gagner des réussites!",
      achievementEarned: "Obtenu le",
      loading: "Chargement...",
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is authenticated
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) return;
        
        const userId = sessionData.session.user.id;
        
        // Fetch achievements
        setLoading(prev => ({ ...prev, achievements: true }));
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('user_achievements')
          .select(`
            id,
            earned_at,
            achievement:achievement_id (
              id,
              name,
              description,
              icon
            )
          `)
          .eq('user_id', userId)
          .order('earned_at', { ascending: false })
          .limit(4);
        
        if (achievementsError) {
          console.error('Error fetching achievements:', achievementsError);
        } else if (achievementsData) {
          const formattedAchievements = achievementsData.map(item => ({
            id: item.id,
            name: item.achievement?.name || '',
            description: item.achievement?.description || '',
            icon: item.achievement?.icon || 'award',
            earned_at: item.earned_at,
          }));
          setAchievements(formattedAchievements);
        }
        setLoading(prev => ({ ...prev, achievements: false }));
        
        // Fetch progress data
        setLoading(prev => ({ ...prev, progress: true }));
        const { data: progressData, error: progressError } = await supabase
          .from('daily_progress')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(1);
        
        if (progressError) {
          console.error('Error fetching progress data:', progressError);
        } else if (progressData && progressData.length > 0) {
          setProgressSummary({
            calories_percentage: progressData[0].calories_goal_percentage || 0,
            water_percentage: progressData[0].water_goal_percentage || 0,
            sleep_percentage: progressData[0].sleep_goal_percentage || 0,
            exercise_percentage: progressData[0].exercise_goal_percentage || 0,
          });
        }
        setLoading(prev => ({ ...prev, progress: false }));
        
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        setLoading({ achievements: false, progress: false });
      }
    };
    
    fetchUserData();
  }, []);

  const renderProgressSummary = () => {
    if (loading.progress) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{t.calories}</p>
            <span className="text-sm text-gray-500">{Math.round(progressSummary.calories_percentage)}%</span>
          </div>
          <Progress value={progressSummary.calories_percentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{t.water}</p>
            <span className="text-sm text-gray-500">{Math.round(progressSummary.water_percentage)}%</span>
          </div>
          <Progress value={progressSummary.water_percentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{t.sleep}</p>
            <span className="text-sm text-gray-500">{Math.round(progressSummary.sleep_percentage)}%</span>
          </div>
          <Progress value={progressSummary.sleep_percentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{t.exercise}</p>
            <span className="text-sm text-gray-500">{Math.round(progressSummary.exercise_percentage)}%</span>
          </div>
          <Progress value={progressSummary.exercise_percentage} className="h-2" />
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (loading.achievements) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      );
    }
    
    if (achievements.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <Trophy className="h-12 w-12 text-gray-300 mb-2" />
          <p className="text-gray-500 text-center">{t.noAchievements}</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex flex-col items-center text-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 mb-2">
              <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-sm">{achievement.name}</h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{achievement.description}</p>
            <Badge variant="outline" className="mt-2 text-xs">
              {t.achievementEarned} {new Date(achievement.earned_at).toLocaleDateString()}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            {t.dashboard}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="space-y-4 sm:space-y-6">
            <ScrollableTabsList>
              <TabsTrigger value="daily" className="flex items-center">
                <ChefHat className="h-4 w-4 mr-2" />
                {isMobile ? "" : t.dailyProgress}
              </TabsTrigger>
              <TabsTrigger value="summary">
                <Pencil className="h-4 w-4 mr-2" />
                {isMobile ? "" : t.summary}
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                {isMobile ? "" : t.achievements}
              </TabsTrigger>
            </ScrollableTabsList>

            <TabsContent value="daily" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <MealPrepTimer />
                <HydrationTracker />
                <NutritionProgressWheel />
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <div className="min-h-[300px] sm:min-h-[400px]">
                {renderProgressSummary()}
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="min-h-[300px] sm:min-h-[400px]">
                {renderAchievements()}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionDashboard;
