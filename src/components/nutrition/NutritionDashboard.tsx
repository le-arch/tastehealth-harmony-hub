"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { Activity, Target, TrendingUp, Calendar, Award, Flame, Droplet, Utensils, Timer, Gauge, Trophy, ChefHat } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScreenSize } from "@/utils/mobile";
import MealPrepTimer from "./MealPrepTimer";
import NutritionProgressWheel from "./NutritionProgressWheel";
import WeeklyMealPrepPlanner from "./WeeklyMealPrepPlanner";
import MealPrepFeedback from "./MealPrepFeedback";
import { getLS, LS_KEYS, Challenge, CalorieEntry, SleepEntry, ExerciseEntry, HydrationEntry } from "@/utils/localStorage";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const NutritionDashboard = () => {
  const [dailyGoals, setDailyGoals] = useState({
    calories: { current: 0, target: 2000 },
    protein: { current: 0, target: 150 },
    carbs: { current: 0, target: 250 },
    fat: { current: 0, target: 65 },
    water: { current: 0, target: 8 },
  });

  const [mealNutrition, setMealNutrition] = useState({ protein: 0, carbs: 0, fats: 0 });

  const loadMealData = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const stored = localStorage.getItem(`th_daily_meals_${today}`);
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFats = 0;
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.forEach((item: any) => {
          totalCalories += item.calories || 0;
          totalProtein += item.protein || 0;
          totalCarbs += item.carbs || 0;
          totalFats += item.fats || 0;
        });
      } catch {}
    }

    const calorieLog = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []);
    const todayEntries = calorieLog.filter(e => e.date.startsWith(today));
    todayEntries.forEach(e => { totalCalories += e.calories; });

    const hydrationLog = getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []);
    const todayWater = hydrationLog.filter(e => e.date.startsWith(today)).reduce((sum, e) => sum + e.cups, 0);

    const nutritionGoal = getLS<any>('th_nutrition_goal', { dailyCalories: 2000, proteinPercentage: 30, carbsPercentage: 40, fatsPercentage: 30 });
    const cal = nutritionGoal.dailyCalories || 2000;

    setDailyGoals({
      calories: { current: totalCalories, target: cal },
      protein: { current: totalProtein, target: Math.round(cal * (nutritionGoal.proteinPercentage || 30) / 400) },
      carbs: { current: totalCarbs, target: Math.round(cal * (nutritionGoal.carbsPercentage || 40) / 400) },
      fat: { current: totalFats, target: Math.round(cal * (nutritionGoal.fatsPercentage || 30) / 900) },
      water: { current: todayWater, target: 8 },
    });
    setMealNutrition({ protein: totalProtein, carbs: totalCarbs, fats: totalFats });
  };

  useEffect(() => {
    loadMealData();
    const handler = () => loadMealData();
    window.addEventListener('storage', handler);
    const interval = setInterval(loadMealData, 3000);
    return () => { window.removeEventListener('storage', handler); clearInterval(interval); };
  }, []);

  const { language } = useLanguage();
  const { isMobile } = useScreenSize();
  const [activeTab, setActiveTab] = useState("dailyTools");

  const weeklySummary = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const inRange = (dateStr: string) => {
      const d = new Date(dateStr);
      return d >= weekStart && d <= now;
    };
    const calorieLog = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []);
    const sleepLog = getLS<SleepEntry[]>(LS_KEYS.SLEEP_LOG, []);
    const exerciseLog = getLS<ExerciseEntry[]>(LS_KEYS.EXERCISE_LOG, []);
    const hydrationLog = getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []);

    const weekCals = calorieLog.filter(e => inRange(e.date));
    const weekSleep = sleepLog.filter(e => inRange(e.date));
    const weekExercise = exerciseLog.filter(e => inRange(e.date));
    const weekWater = hydrationLog.filter(e => inRange(e.date));

    return {
      avgCalories: weekCals.length ? Math.round(weekCals.reduce((s, e) => s + e.calories, 0) / 7) : 0,
      avgSleep: weekSleep.length ? +(weekSleep.reduce((s, e) => s + e.hours, 0) / 7).toFixed(1) : 0,
      totalExercise: weekExercise.reduce((s, e) => s + e.duration, 0),
      totalWater: weekWater.reduce((s, e) => s + e.cups, 0),
      avgProtein: Math.round(dailyGoals.protein.current),
      avgCarbs: Math.round(dailyGoals.carbs.current),
      avgFat: Math.round(dailyGoals.fat.current),
    };
  }, [dailyGoals]);

  const challenges = getLS<Challenge[]>(LS_KEYS.CHALLENGES, []);
  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);
  const savedGoals = getLS<any[]>('th_saved_goals', []);
  const quizScores = getLS<any[]>('th_quiz_scores', []);

  const t = language === 'fr'
    ? { title: "Tableau de Bord Nutritionnel", dailyTools: "Outils", mealPrep: "Préparation", progressSummary: "Progrès", achievements: "Réalisations", dailyGoals: "Objectifs du Jour", calories: "Calories", protein: "Protéines", carbs: "Glucides", fat: "Lipides", water: "Eau", kcal: "kcal", grams: "g", glasses: "verres" }
    : { title: "Nutrition Dashboard", dailyTools: "Daily Tools", mealPrep: "Meal Prep", progressSummary: "Progress", achievements: "Achievements", dailyGoals: "Today's Goals", calories: "Calories", protein: "Protein", carbs: "Carbs", fat: "Fat", water: "Water", kcal: "kcal", grams: "g", glasses: "glasses" };

  const calculateProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">{t.title}</h1>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <span className="text-xs sm:text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <ScrollableTabsList className="w-full">
          <TabsTrigger value="dailyTools" className="flex items-center gap-2"><Gauge className="h-4 w-4 text-primary" />{!isMobile && t.dailyTools}</TabsTrigger>
          <TabsTrigger value="mealPrep" className="flex items-center gap-2"><ChefHat className="h-4 w-4 text-orange-500" />{!isMobile && t.mealPrep}</TabsTrigger>
          <TabsTrigger value="progressSummary" className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />{!isMobile && t.progressSummary}</TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" />{!isMobile && t.achievements}</TabsTrigger>
        </ScrollableTabsList>

        <TabsContent value="dailyTools" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card>
                <CardHeader><CardTitle className="flex items-center text-lg"><Gauge className="h-5 w-5 mr-2 text-primary" />Progress Wheel</CardTitle></CardHeader>
                <CardContent>
                  <NutritionProgressWheel protein={mealNutrition.protein} carbs={mealNutrition.carbs} fats={mealNutrition.fats} />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <MealPrepTimer />
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="mealPrep" className="space-y-6">
          <WeeklyMealPrepPlanner />
          <MealPrepFeedback />
        </TabsContent>

        <TabsContent value="progressSummary" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center"><Target className="h-5 w-5 mr-2 text-primary" />{t.dailyGoals}</CardTitle></CardHeader>
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

          <Card>
            <CardHeader><CardTitle className="flex items-center"><TrendingUp className="h-5 w-5 mr-2 text-primary" />Weekly Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/10 to-amber-500/10 border">
                  <p className="text-xs text-muted-foreground">Avg Daily Calories</p>
                  <p className="text-xl font-bold">{weeklySummary.avgCalories} kcal</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border">
                  <p className="text-xs text-muted-foreground">Avg Sleep</p>
                  <p className="text-xl font-bold">{weeklySummary.avgSleep} hrs</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border">
                  <p className="text-xs text-muted-foreground">Total Exercise</p>
                  <p className="text-xl font-bold">{weeklySummary.totalExercise} min</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border">
                  <p className="text-xs text-muted-foreground">Total Water</p>
                  <p className="text-xl font-bold">{weeklySummary.totalWater} cups</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {activeChallenges.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-purple-500" />Active Challenges</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {activeChallenges.map(c => (
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
          )}

          {completedChallenges.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" />Completed Challenges</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {completedChallenges.map(c => (
                  <div key={c.id} className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{c.name}</span>
                    <Badge className="ml-auto">Done</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Saved Goals</CardTitle></CardHeader>
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

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" />Quiz Scores</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {quizScores.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No quiz scores yet</p>
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
