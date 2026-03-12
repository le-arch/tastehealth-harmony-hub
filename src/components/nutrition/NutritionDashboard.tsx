
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { Activity, Target, TrendingUp, Calendar, Award, Flame, Droplet, Utensils, Timer, Gauge, Trophy, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScreenSize } from "@/utils/mobile";
import MealPrepTimer from "./MealPrepTimer";
import HydrationTracker from "./HydrationTracker";
import NutritionProgressWheel from "./NutritionProgressWheel";
import DailyMealSelector from "./DailyMealSelector";
import { getLS, LS_KEYS, Challenge } from "@/utils/localStorage";
import { MEAL_DATABASE } from "@/data/mealDatabase";
import { Badge } from "@/components/ui/badge";

const NutritionDashboard = () => {
  const [dailyGoals, setDailyGoals] = useState({
    calories: { current: 0, target: 2000 },
    protein: { current: 0, target: 150 },
    carbs: { current: 0, target: 250 },
    fat: { current: 0, target: 65 },
    water: { current: 6, target: 8 },
  });

  const [mealNutrition, setMealNutrition] = useState({ protein: 0, carbs: 0, fats: 0 });

  // Load daily meals and compute nutrition
  const loadMealData = () => {
    const stored = localStorage.getItem('th_daily_meals');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFats = 0;
        parsed.forEach((item: any) => {
          const meal = MEAL_DATABASE.find((m: any) => m.id === item.mealId);
          if (meal) {
            totalCalories += meal.nutrition.calories;
            totalProtein += meal.nutrition.protein;
            totalCarbs += meal.nutrition.carbs;
            totalFats += meal.nutrition.fats;
          }
        });
        setDailyGoals(prev => ({
          ...prev,
          calories: { ...prev.calories, current: totalCalories },
          protein: { ...prev.protein, current: totalProtein },
          carbs: { ...prev.carbs, current: totalCarbs },
          fat: { ...prev.fat, current: totalFats },
        }));
        setMealNutrition({ protein: totalProtein, carbs: totalCarbs, fats: totalFats });
      } catch {}
    }
  };

  useEffect(() => {
    loadMealData();
    // Listen for storage changes
    const handler = () => loadMealData();
    window.addEventListener('storage', handler);
    // Also poll every 2 seconds for same-tab changes
    const interval = setInterval(loadMealData, 2000);
    return () => { window.removeEventListener('storage', handler); clearInterval(interval); };
  }, []);

  const { language } = useLanguage();
  const { isMobile } = useScreenSize();
  const [activeTab, setActiveTab] = useState("dailyTools");

  // Achievements data
  const challenges = getLS<Challenge[]>(LS_KEYS.CHALLENGES, []);
  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);
  const savedGoals = getLS<any[]>('th_saved_goals', []);
  const quizScores = getLS<any[]>('th_quiz_scores', []);

  const t = language === 'fr'
    ? { title: "Tableau de Bord Nutritionnel", dailyTools: "Outils Quotidiens", progressSummary: "Résumé des Progrès", achievements: "Réalisations", dailyGoals: "Objectifs du Jour", calories: "Calories", protein: "Protéines", carbs: "Glucides", fat: "Lipides", water: "Eau", kcal: "kcal", grams: "g", glasses: "verres" }
    : { title: "Nutrition Dashboard", dailyTools: "Daily Tools", progressSummary: "Progress Summary", achievements: "Achievements", dailyGoals: "Today's Goals", calories: "Calories", protein: "Protein", carbs: "Carbs", fat: "Fat", water: "Water", kcal: "kcal", grams: "g", glasses: "glasses" };

  const calculateProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">{t.title}</h1>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <span className="text-xs sm:text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <ScrollableTabsList className="w-full">
          <TabsTrigger value="dailyTools" className="flex items-center gap-2"><Wrench className="h-4 w-4 text-teal-600 fill-teal-300" />{!isMobile && t.dailyTools}</TabsTrigger>
          <TabsTrigger value="progressSummary" className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-500" />{!isMobile && t.progressSummary}</TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2"><Trophy className="h-4 w-4 text-orange-500 fill-orange-300" />{!isMobile && t.achievements}</TabsTrigger>
        </ScrollableTabsList>

        <TabsContent value="dailyTools" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <DailyMealSelector />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card>
                <CardHeader><CardTitle className="flex items-center text-lg"><Gauge className="h-5 w-5 mr-2 text-green-500" />Progress Wheel</CardTitle></CardHeader>
                <CardContent>
                  <NutritionProgressWheel protein={mealNutrition.protein} carbs={mealNutrition.carbs} fats={mealNutrition.fats} />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <Card><CardHeader><CardTitle className="flex items-center text-lg"><Timer className="h-5 w-5 mr-2 text-orange-500" />Meal Prep Timer</CardTitle></CardHeader><CardContent><MealPrepTimer /></CardContent></Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
              <Card><CardHeader><CardTitle className="flex items-center text-lg"><Droplet className="h-5 w-5 mr-2 text-blue-500" />Hydration Tracker</CardTitle></CardHeader><CardContent><HydrationTracker /></CardContent></Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="progressSummary" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center"><Target className="h-5 w-5 mr-2 text-blue-500" />{t.dailyGoals}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: t.calories, current: dailyGoals.calories.current, target: dailyGoals.calories.target, unit: t.kcal, icon: <Flame className="h-4 w-4 mr-1 text-orange-500" /> },
                  { label: t.protein, current: dailyGoals.protein.current, target: dailyGoals.protein.target, unit: t.grams, icon: <Utensils className="h-4 w-4 mr-1 text-red-500" /> },
                  { label: t.carbs, current: dailyGoals.carbs.current, target: dailyGoals.carbs.target, unit: t.grams, icon: <Activity className="h-4 w-4 mr-1 text-yellow-500" /> },
                  { label: t.fat, current: dailyGoals.fat.current, target: dailyGoals.fat.target, unit: t.grams, icon: <TrendingUp className="h-4 w-4 mr-1 text-purple-500" /> },
                  { label: t.water, current: dailyGoals.water.current, target: dailyGoals.water.target, unit: t.glasses, icon: <Droplet className="h-4 w-4 mr-1 text-blue-500" /> },
                ].map(item => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">{item.icon}<span className="text-sm font-medium">{item.label}</span></div>
                      <span className="text-xs text-muted-foreground">{item.current}/{item.target} {item.unit}</span>
                    </div>
                    <Progress value={calculateProgress(item.current, item.target)} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {/* Active Challenges */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-purple-500" />Active Challenges</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {activeChallenges.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No active challenges</p>
              ) : activeChallenges.map(c => (
                <div key={c.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{c.name}</span>
                    <Badge variant="secondary">{c.progress}/{c.target}</Badge>
                  </div>
                  <Progress value={Math.min((c.progress / c.target) * 100, 100)} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Completed Challenges */}
          {completedChallenges.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-green-500" />Completed Challenges</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {completedChallenges.map(c => (
                  <div key={c.id} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <Trophy className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{c.name}</span>
                    <Badge className="bg-green-600 ml-auto">Done</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Saved Goals */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-blue-500" />Saved Goals</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {savedGoals.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No goals saved yet</p>
              ) : savedGoals.slice(0, 5).map((g: any) => (
                <div key={g.id} className="flex items-center gap-2 p-2 border rounded-lg">
                  <input type="checkbox" checked={g.completed} readOnly className="h-4 w-4" />
                  <span className={`text-sm ${g.completed ? 'line-through text-muted-foreground' : ''}`}>{g.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quiz Scores */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-yellow-500" />Quiz Scores</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {quizScores.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No quiz scores yet. Take a quiz in the Nutrition Game!</p>
              ) : quizScores.map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 border rounded-lg">
                  <span className="text-sm">{new Date(s.date).toLocaleDateString()}</span>
                  <Badge variant={s.score >= 80 ? "default" : "secondary"}>{s.score}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionDashboard;
