
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import RewardSystem from '@/components/RewardSystem';
import BMICalculator from '@/components/health/BMICalculator';
import ProgressTracker from '@/components/health/ProgressTracker';
import CalorieTracker from '@/components/health/CalorieTracker';
import SleepTracker from '@/components/health/SleepTracker';
import ExerciseTracker from '@/components/health/ExerciseTracker';
import HydrationInput from '@/components/health/HydrationInput';
import { BarChart as BarChartIcon, TrendingUp, Trophy, History, PlusCircle, Edit, Gift, Droplet, Moon, Flame, Scale, Dumbbell } from 'lucide-react';
import ChallengeCreator from '@/components/ChallengeCreator';
import { useScreenSize } from '@/utils/mobile';
import { getLS, LS_KEYS, CalorieEntry, SleepEntry, ExerciseEntry, HydrationEntry, BMIEntry } from '@/utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ProgressPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { isMobile, isTablet } = useScreenSize();
  const isSmallScreen = isMobile || isTablet;
  
  const t = language === 'fr'
    ? { title: "Progrès & Objectifs", overview: "Vue d'ensemble", trackers: "Saisir données", rewards: "Récompenses", challenges: "Défis", history: "Historique", subtitle: "Suivez votre parcours santé", calories: "Calories", sleep: "Sommeil", exercise: "Exercice", water: "Hydratation", bmiTracker: "IMC", trackDescription: "Saisissez vos données de santé", addProgress: "Ajouter des données", editProgress: "Modifier les données" }
    : { title: "Progress & Goals", overview: "Overview", trackers: "Track Data", rewards: "Rewards", challenges: "Challenges", history: "History", subtitle: "Track your health journey", calories: "Calories", sleep: "Sleep", exercise: "Exercise", water: "Water Intake", bmiTracker: "BMI", trackDescription: "Enter your health data to see it reflected in your charts", addProgress: "Add Progress", editProgress: "Edit Progress" };

  // Build weekly history data
  const weeklyData = useMemo(() => {
    const calorieLog = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []);
    const sleepLog = getLS<SleepEntry[]>(LS_KEYS.SLEEP_LOG, []);
    const exerciseLog = getLS<ExerciseEntry[]>(LS_KEYS.EXERCISE_LOG, []);
    const hydrationLog = getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []);
    const bmiLog = getLS<BMIEntry[]>(LS_KEYS.BMI_LOG, []);

    // Group data by week (last 8 weeks)
    const weeks: { label: string; calories: number; sleep: number; exercise: number; water: number; bmi: number }[] = [];
    const now = new Date();
    
    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (w * 7) - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const inRange = (dateStr: string) => {
        const d = new Date(dateStr);
        return d >= weekStart && d < weekEnd;
      };

      const weekCalories = calorieLog.filter(e => inRange(e.date)).reduce((s, e) => s + e.calories, 0);
      const weekSleep = sleepLog.filter(e => inRange(e.date));
      const avgSleep = weekSleep.length > 0 ? weekSleep.reduce((s, e) => s + e.hours, 0) / weekSleep.length : 0;
      const weekExercise = exerciseLog.filter(e => inRange(e.date)).reduce((s, e) => s + e.duration, 0);
      const weekWater = hydrationLog.filter(e => inRange(e.date)).reduce((s, e) => s + e.cups, 0);
      const weekBmi = bmiLog.filter(e => inRange(e.date));
      const avgBmi = weekBmi.length > 0 ? weekBmi.reduce((s, e) => s + e.bmi, 0) / weekBmi.length : 0;

      const label = `W${8 - w}`;
      weeks.push({
        label,
        calories: Math.round(weekCalories),
        sleep: Math.round(avgSleep * 10) / 10,
        exercise: Math.round(weekExercise),
        water: Math.round(weekWater),
        bmi: Math.round(avgBmi * 10) / 10,
      });
    }
    return weeks;
  }, [activeTab]);

  const hasHistoryData = weeklyData.some(w => w.calories > 0 || w.sleep > 0 || w.exercise > 0 || w.water > 0 || w.bmi > 0);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <ProfileSidebar activePage="progress" />
      <div className="flex-1 p-3 sm:p-4 sm:ml-64">
        <div className="p-3 sm:p-4 max-w-6xl mx-auto">
          <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{t.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{t.subtitle}</p>
            </div>
            <Button variant="default" className="flex items-center" onClick={() => setActiveTab("trackers")} size={isSmallScreen ? "icon" : "default"}>
              {activeTab === "trackers" ? <Edit className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
              {!isSmallScreen && <span className="ml-1">{activeTab === "trackers" ? t.editProgress : t.addProgress}</span>}
            </Button>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ScrollableTabsList className="w-full">
              <TabsTrigger value="overview" className="flex items-center gap-1"><BarChartIcon className="h-4 w-4" />{!isSmallScreen && t.overview}</TabsTrigger>
              <TabsTrigger value="trackers" className="flex items-center gap-1"><TrendingUp className="h-4 w-4" />{!isSmallScreen && t.trackers}</TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-1"><Gift className="h-4 w-4" />{!isSmallScreen && t.rewards}</TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-1"><Trophy className="h-4 w-4" />{!isSmallScreen && t.challenges}</TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1"><History className="h-4 w-4" />{!isSmallScreen && t.history}</TabsTrigger>
            </ScrollableTabsList>
            
            <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <ProgressTracker />
              <BMICalculator />
            </TabsContent>
            
            <TabsContent value="trackers" className="mt-4 sm:mt-6">
              <Card className="mb-4 sm:mb-6">
                <CardHeader className="p-4">
                  <CardTitle>{t.trackers}</CardTitle>
                  <CardDescription className="text-sm">{t.trackDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="calories" className="w-full">
                    <ScrollableTabsList className="flex w-full">
                      <TabsTrigger value="calories" className="flex-1"><Flame className="h-4 w-4" />{isSmallScreen ? "" : t.calories}</TabsTrigger>
                      <TabsTrigger value="sleep" className="flex-1"><Moon className="h-4 w-4" />{isSmallScreen ? "" : t.sleep}</TabsTrigger>
                      <TabsTrigger value="exercise" className="flex-1"><Dumbbell className="h-4 w-4" />{isSmallScreen ? "" : t.exercise}</TabsTrigger>
                      <TabsTrigger value="water" className="flex-1"><Droplet className="h-4 w-4" />{isSmallScreen ? "" : t.water}</TabsTrigger>
                      <TabsTrigger value="bmi" className="flex-1"><Scale className="h-4 w-4" />{isSmallScreen ? "" : t.bmiTracker}</TabsTrigger>
                    </ScrollableTabsList>
                    <div className="my-4 sm:my-6">
                      <TabsContent value="calories"><CalorieTracker /></TabsContent>
                      <TabsContent value="sleep"><SleepTracker /></TabsContent>
                      <TabsContent value="exercise"><ExerciseTracker /></TabsContent>
                      <TabsContent value="water"><HydrationInput /></TabsContent>
                      <TabsContent value="bmi"><BMICalculator /></TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rewards" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <Card><CardHeader><CardTitle>{t.rewards}</CardTitle></CardHeader><CardContent><RewardSystem /></CardContent></Card>
            </TabsContent>
            
            <TabsContent value="challenges" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <Card><CardHeader><CardTitle>{t.challenges}</CardTitle></CardHeader><CardContent><ChallengeCreator /></CardContent></Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Weekly Progress History</CardTitle>
                  <CardDescription>Summary of your health metrics over the last 8 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  {!hasHistoryData ? (
                    <div className="text-center py-12">
                      <BarChartIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No history data yet. Start tracking your health metrics in the Track Data tab!</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2"><Flame className="h-4 w-4 text-orange-500" />Calories (weekly total)</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4,4,0,0]} /></BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2"><Moon className="h-4 w-4 text-indigo-500" />Sleep (avg hours/night)</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Bar dataKey="sleep" fill="#6366f1" radius={[4,4,0,0]} /></BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2"><Dumbbell className="h-4 w-4 text-green-500" />Exercise (total minutes)</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Bar dataKey="exercise" fill="#22c55e" radius={[4,4,0,0]} /></BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2"><Droplet className="h-4 w-4 text-blue-500" />Water Intake (total cups)</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Bar dataKey="water" fill="#3b82f6" radius={[4,4,0,0]} /></BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2"><Scale className="h-4 w-4 text-purple-500" />BMI (weekly average)</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis domain={[0, 'auto']} /><Tooltip /><Bar dataKey="bmi" fill="#a855f7" radius={[4,4,0,0]} /></BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
