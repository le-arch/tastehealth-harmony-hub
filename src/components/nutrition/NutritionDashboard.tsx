
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import {
  Activity,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Flame,
  Droplet,
  Utensils,
  Timer,
  Gauge,
  Trophy,
  Wrench
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScreenSize } from "@/utils/mobile";
import MealPrepTimer from "./MealPrepTimer";
import HydrationTracker from "./HydrationTracker";
import NutritionProgressWheel from "./NutritionProgressWheel";

const NutritionDashboard = () => {
  const [dailyGoals, setDailyGoals] = useState({
    calories: { current: 1200, target: 2000 },
    protein: { current: 45, target: 150 },
    carbs: { current: 120, target: 250 },
    fat: { current: 35, target: 65 },
    water: { current: 6, target: 8 },
  });

  const [weeklyProgress, setWeeklyProgress] = useState({
    mealsLogged: 18,
    targetMeals: 21,
    streakDays: 5,
    totalPoints: 1250,
  });

  const [recentChallenges] = useState([
    {
      id: 1,
      title: "5-a-Day Challenge",
      description: "Eat 5 servings of fruits and vegetables daily",
      icon: "🥕",
      progress: 3,
      target: 5,
    },
    {
      id: 2,
      title: "Hydration Hero",
      description: "Drink 8 glasses of water daily",
      icon: "💧",
      progress: 6,
      target: 8,
    },
    {
      id: 3,
      title: "Protein Power",
      description: "Meet your daily protein goals",
      icon: "🥩",
      progress: 45,
      target: 150,
    },
  ]);

  const { language } = useLanguage();
  const { isMobile, isTablet } = useScreenSize();
  const [activeTab, setActiveTab] = useState("dailyTools");

  const translations = {
    en: {
      title: "Nutrition Dashboard",
      dailyTools: "Daily Tools",
      progressSummary: "Progress Summary",
      achievements: "Achievements",
      dailyGoals: "Today's Goals",
      weeklyProgress: "Weekly Progress",
      recentChallenges: "Active Challenges",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
      water: "Water",
      mealsLogged: "Meals Logged",
      streakDays: "Streak Days",
      totalPoints: "Total Points",
      viewDetails: "View Details",
      joinChallenge: "Join Challenge",
      kcal: "kcal",
      grams: "g",
      glasses: "glasses",
      meals: "meals",
      days: "days",
      points: "points",
    },
    fr: {
      title: "Tableau de Bord Nutritionnel",
      dailyTools: "Outils Quotidiens",
      progressSummary: "Résumé des Progrès",
      achievements: "Réalisations",
      dailyGoals: "Objectifs du Jour",
      weeklyProgress: "Progrès Hebdomadaire",
      recentChallenges: "Défis Actifs",
      calories: "Calories",
      protein: "Protéines",
      carbs: "Glucides",
      fat: "Lipides",
      water: "Eau",
      mealsLogged: "Repas Enregistrés",
      streakDays: "Jours de Série",
      totalPoints: "Points Totaux",
      viewDetails: "Voir Détails",
      joinChallenge: "Rejoindre Défi",
      kcal: "kcal",
      grams: "g",
      glasses: "verres",
      meals: "repas",
      days: "jours",
      points: "points",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "text-green-600";
    if (progress >= 75) return "text-yellow-600";
    return "text-blue-600";
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t.title}
        </h1>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          <span className="text-xs sm:text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <ScrollableTabsList className="w-full">
          <TabsTrigger value="dailyTools" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            {!isMobile && t.dailyTools}
          </TabsTrigger>
          <TabsTrigger value="progressSummary" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {!isMobile && t.progressSummary}
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            {!isMobile && t.achievements}
          </TabsTrigger>
        </ScrollableTabsList>

        <TabsContent value="dailyTools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Timer className="h-5 w-5 mr-2 text-orange-500" />
                  Meal Prep Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MealPrepTimer />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Droplet className="h-5 w-5 mr-2 text-blue-500" />
                  Hydration Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HydrationTracker />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Gauge className="h-5 w-5 mr-2 text-green-500" />
                  Progress Wheel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NutritionProgressWheel />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progressSummary" className="space-y-6">
          {/* Daily Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-500" />
                {t.dailyGoals}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Calories */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 mr-1 text-orange-500" />
                      <span className="text-sm font-medium">{t.calories}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {dailyGoals.calories.current}/{dailyGoals.calories.target} {t.kcal}
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(
                      dailyGoals.calories.current,
                      dailyGoals.calories.target
                    )}
                    className="h-2"
                  />
                </div>

                {/* Protein */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-1 text-red-500" />
                      <span className="text-sm font-medium">{t.protein}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {dailyGoals.protein.current}/{dailyGoals.protein.target} {t.grams}
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(
                      dailyGoals.protein.current,
                      dailyGoals.protein.target
                    )}
                    className="h-2"
                  />
                </div>

                {/* Carbs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="text-sm font-medium">{t.carbs}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {dailyGoals.carbs.current}/{dailyGoals.carbs.target} {t.grams}
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(
                      dailyGoals.carbs.current,
                      dailyGoals.carbs.target
                    )}
                    className="h-2"
                  />
                </div>

                {/* Fat */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-purple-500" />
                      <span className="text-sm font-medium">{t.fat}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {dailyGoals.fat.current}/{dailyGoals.fat.target} {t.grams}
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(
                      dailyGoals.fat.current,
                      dailyGoals.fat.target
                    )}
                    className="h-2"
                  />
                </div>

                {/* Water */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Droplet className="h-4 w-4 mr-1 text-blue-500" />
                      <span className="text-sm font-medium">{t.water}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {dailyGoals.water.current}/{dailyGoals.water.target} {t.glasses}
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(
                      dailyGoals.water.current,
                      dailyGoals.water.target
                    )}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                {t.weeklyProgress}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {weeklyProgress.mealsLogged}/{weeklyProgress.targetMeals}
                  </div>
                  <div className="text-sm text-gray-600">{t.mealsLogged}</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {weeklyProgress.streakDays}
                  </div>
                  <div className="text-sm text-gray-600">{t.streakDays}</div>
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {weeklyProgress.totalPoints}
                </div>
                <div className="text-sm text-gray-600">{t.totalPoints}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-500" />
                {t.recentChallenges}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{challenge.icon}</span>
                      <div>
                        <h4 className="font-medium">{challenge.title}</h4>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {challenge.progress}/{challenge.target}
                      </span>
                    </div>
                    <Progress
                      value={calculateProgress(challenge.progress, challenge.target)}
                      className="h-2"
                    />
                  </div>
                </motion.div>
              ))}
              <Button variant="outline" className="w-full">
                {t.viewDetails}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionDashboard;
