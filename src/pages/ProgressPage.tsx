import React, { useState, useMemo, useEffect } from 'react';
import Confetti from '@/components/Confetti';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import BMICalculator from '@/components/health/BMICalculator';
import ProgressTracker from '@/components/health/ProgressTracker';
import CalorieTracker from '@/components/health/CalorieTracker';
import SleepTracker from '@/components/health/SleepTracker';
import ExerciseTracker from '@/components/health/ExerciseTracker';
import HydrationInput from '@/components/health/HydrationInput';
import GoalWizard from './GoalWizard';

import { 
  BarChart as BarChartIcon, 
  TrendingUp, 
  History, 
  Pencil, 
  Droplet, 
  Moon, 
  Flame, 
  Scale, 
  Dumbbell, 
  Target,
  Heart,
  Footprints,
  Activity,
  Zap,
  Award,
  Sparkles,
  Sun,
  Cloud,
  Leaf,
  Star
} from 'lucide-react';
import { useScreenSize } from '@/utils/mobile';
import { getLS, setLS, LS_KEYS, CalorieEntry, SleepEntry, ExerciseEntry, HydrationEntry, BMIEntry } from '@/utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';

// Animated Progress Dashboard Component
const ProgressDashboardAnimation = ({ progress = 0, isActive = false }) => {
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/10 border border-border/50 p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Video + Circular Progress Ring */}
        <div className="relative flex-shrink-0">
          {/* Video background behind the ring */}
          <div className="absolute inset-0 rounded-full overflow-hidden" style={{ width: 180, height: 180 }}>
            <video
              src="/animation/progress.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-20 rounded-full"
            />
          </div>
          <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90 relative z-10">
            <defs>
              <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="20%" stopColor="#f97316" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="60%" stopColor="#22c55e" />
                <stop offset="80%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle cx="90" cy="90" r="80" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" opacity="0.3" />
            <motion.circle
              cx="90" cy="90" r="80" fill="none"
              stroke="url(#rainbowGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <motion.span
              className="text-3xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 bg-clip-text text-transparent"
              key={Math.round(progress * 100)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {Math.round(progress * 100)}%
            </motion.span>
            <span className="text-xs text-muted-foreground">Daily Progress</span>
            {progress >= 0.8 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
              >
                <Award className="h-5 w-5 text-yellow-500 mt-1" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 gap-3 w-full">
          {[
            { label: 'Calories', icon: Flame, value: `Tracked`, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { label: 'Exercise', icon: Dumbbell, value: `Active`, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Hydration', icon: Droplet, value: `On track`, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Sleep', icon: Moon, value: `Rested`, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`rounded-xl ${stat.bg} p-3 flex items-center gap-3`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-sm font-semibold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom progress bar - rainbow */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>🏁 Start</span>
          <span className="font-medium text-primary">
            {progress >= 0.8 ? "Great job! 🎉" : progress >= 0.5 ? "Almost there!" : "Keep going!"}
          </span>
          <span>Goal 🏆</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const ProgressPage = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { isMobile, isTablet } = useScreenSize();
  const isSmallScreen = isMobile || isTablet;
  const [goalText, setGoalText] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showJogger, setShowJogger] = useState(true);
  const [joggerProgress, setJoggerProgress] = useState(0);

  const t = language === 'fr'
    ? { 
        title: "Progrès & Objectifs", 
        overview: "Vue d'ensemble", 
        trackers: "Saisir données", 
        wizard: "Assistant Objectifs", 
        history: "Historique", 
        goals: "Objectifs", 
        subtitle: "Suivez votre parcours santé", 
        calories: "Calories", 
        sleep: "Sommeil", 
        exercise: "Exercice", 
        water: "Hydratation", 
        bmiTracker: "IMC", 
        trackDescription: "Saisissez vos données de santé",
        addProgress: "Ajouter des données", 
        editProgress: "Modifier les données",
        weeklyProgress: "Progrès Hebdomadaire",
        keepGoing: "Continuez comme ça !",
        almostThere: "Presque là !",
        greatJob: "Excellent travail !"
      }
    : { 
        title: "Progress & Goals", 
        overview: "Overview", 
        trackers: "Track Data", 
        wizard: "Goal Wizard", 
        history: "History", 
        goals: "Goals", 
        subtitle: "Track your health journey", 
        calories: "Calories", 
        sleep: "Sleep", 
        exercise: "Exercise", 
        water: "Water Intake", 
        bmiTracker: "BMI", 
        trackDescription: "Enter your health data to see it reflected in your charts",
        addProgress: "Add Progress", 
        editProgress: "Edit Progress",
        weeklyProgress: "Weekly Progress",
        keepGoing: "Keep going!",
        almostThere: "Almost there!",
        greatJob: "Great job!"
      };

  // Calculate overall progress based on tracked data
  useEffect(() => {
    const calorieLog = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []);
    const exerciseLog = getLS<ExerciseEntry[]>(LS_KEYS.EXERCISE_LOG, []);
    const hydrationLog = getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []);
    const sleepLog = getLS<SleepEntry[]>(LS_KEYS.SLEEP_LOG, []);

    // Calculate progress based on tracked data
    const today = new Date().toDateString();
    const todayCalories = calorieLog.filter(e => new Date(e.date).toDateString() === today).length;
    const todayExercise = exerciseLog.filter(e => new Date(e.date).toDateString() === today).length;
    const todayHydration = hydrationLog.filter(e => new Date(e.date).toDateString() === today).length;
    const todaySleep = sleepLog.filter(e => new Date(e.date).toDateString() === today).length;

    const totalTracked = todayCalories + todayExercise + todayHydration + todaySleep;
    const maxDaily = 8;
    const progress = Math.min(totalTracked / maxDaily, 1);
    
    setJoggerProgress(progress);
  }, [activeTab]);

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    if (joggerProgress >= 0.8) return t.greatJob;
    if (joggerProgress >= 0.5) return t.almostThere;
    if (joggerProgress > 0) return t.keepGoing;
    return "Let's get started!";
  };

  interface SavedGoal { id: string; text: string; week: string; date: string; completed: boolean; }
  const [savedGoals, setSavedGoals] = useState<SavedGoal[]>(() => {
    try { return JSON.parse(localStorage.getItem('th_saved_goals') || '[]'); } catch { return []; }
  });

  // Listen for goals saved from GoalWizard
  useEffect(() => {
    const handler = () => {
      try { setSavedGoals(JSON.parse(localStorage.getItem('th_saved_goals') || '[]')); } catch {}
    };
    window.addEventListener('storage', handler);
    window.addEventListener('goals-updated', handler);
    return () => { window.removeEventListener('storage', handler); window.removeEventListener('goals-updated', handler); };
  }, []);

  const getWeekLabel = (d: Date) => {
    const start = new Date(d); start.setDate(d.getDate() - d.getDay());
    return `Week of ${start.toLocaleDateString()}`;
  };
  
  const saveGoal = () => {
    if (!goalText.trim()) return;
    const g: SavedGoal = { id: crypto.randomUUID(), text: goalText, week: getWeekLabel(new Date()), date: new Date().toISOString(), completed: false };
    const updated = [g, ...savedGoals];
    setSavedGoals(updated);
    localStorage.setItem('th_saved_goals', JSON.stringify(updated));
    setGoalText('');
    toast.success("Goal added! 🎯");
  };
  
  const toggleGoal = (id: string) => {
    const updated = savedGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    const toggled = updated.find(g => g.id === id);
    if (toggled?.completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
      const pts = getLS<number>(LS_KEYS.POINTS, 0);
      setLS(LS_KEYS.POINTS, pts + 15);
      toast.success("Goal completed! +15 points 🎉");
    }
    setSavedGoals(updated);
    localStorage.setItem('th_saved_goals', JSON.stringify(updated));
  };
  
  const deleteGoal = (id: string) => {
    const updated = savedGoals.filter(g => g.id !== id);
    setSavedGoals(updated);
    localStorage.setItem('th_saved_goals', JSON.stringify(updated));
  };
  
  const goalsByWeek = savedGoals.reduce((acc, g) => {
    if (!acc[g.week]) acc[g.week] = [];
    acc[g.week].push(g);
    return acc;
  }, {} as Record<string, SavedGoal[]>);

  const weeklyData = useMemo(() => {
    const calorieLog = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []);
    const sleepLog = getLS<SleepEntry[]>(LS_KEYS.SLEEP_LOG, []);
    const exerciseLog = getLS<ExerciseEntry[]>(LS_KEYS.EXERCISE_LOG, []);
    const hydrationLog = getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []);
    const bmiLog = getLS<BMIEntry[]>(LS_KEYS.BMI_LOG, []);
    const weeks: { label: string; calories: number; sleep: number; exercise: number; water: number; bmi: number }[] = [];
    const now = new Date();
    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(now); weekStart.setDate(now.getDate() - (w * 7) - now.getDay()); weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 7);
      const inRange = (dateStr: string) => { const d = new Date(dateStr); return d >= weekStart && d < weekEnd; };
      weeks.push({
        label: `W${8 - w}`,
        calories: Math.round(calorieLog.filter(e => inRange(e.date)).reduce((s, e) => s + e.calories, 0)),
        sleep: Math.round((() => { const w2 = sleepLog.filter(e => inRange(e.date)); return w2.length > 0 ? w2.reduce((s, e) => s + e.hours, 0) / w2.length : 0; })() * 10) / 10,
        exercise: Math.round(exerciseLog.filter(e => inRange(e.date)).reduce((s, e) => s + e.duration, 0)),
        water: Math.round(hydrationLog.filter(e => inRange(e.date)).reduce((s, e) => s + e.cups, 0)),
        bmi: Math.round((() => { const b = bmiLog.filter(e => inRange(e.date)); return b.length > 0 ? b.reduce((s, e) => s + e.bmi, 0) / b.length : 0; })() * 10) / 10,
      });
    }
    return weeks;
  }, [activeTab]);

  const hasHistoryData = weeklyData.some(w => w.calories > 0 || w.sleep > 0 || w.exercise > 0 || w.water > 0 || w.bmi > 0);

  const chartConfigs = [
    { key: 'calories', label: 'Calories (weekly total)', icon: <Flame className="h-4 w-4 text-orange-500" />, color: '#f97316', gradient: ['#f97316', '#fb923c'] },
    { key: 'sleep', label: 'Sleep (avg hours/night)', icon: <Moon className="h-4 w-4 text-indigo-500" />, color: '#6366f1', gradient: ['#6366f1', '#818cf8'] },
    { key: 'exercise', label: 'Exercise (total minutes)', icon: <Dumbbell className="h-4 w-4 text-green-500" />, color: '#22c55e', gradient: ['#22c55e', '#4ade80'] },
    { key: 'water', label: 'Water Intake (total cups)', icon: <Droplet className="h-4 w-4 text-blue-500" />, color: '#3b82f6', gradient: ['#3b82f6', '#60a5fa'] },
    { key: 'bmi', label: 'BMI (weekly average)', icon: <Scale className="h-4 w-4 text-purple-500" />, color: '#a855f7', gradient: ['#a855f7', '#c084fc'] },
  ];

  return (
    <PageLayout activePage="progress">
      <Confetti active={showConfetti} />
      <div className="p-3 sm:p-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <motion.span 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }} 
                transition={{ duration: 3, repeat: Infinity }}
              >
                <BarChartIcon className="h-6 w-6 text-primary" />
              </motion.span>
              {t.title}
            </h1>
            <p className="text-muted-foreground text-sm">{t.subtitle}</p>
          </div>
          
          {/* Toggle jogger button */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowJogger(!showJogger)}
              className="flex items-center gap-2 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-10"
                animate={showJogger ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Footprints className={`h-4 w-4 ${showJogger ? 'text-primary' : ''}`} />
              {showJogger ? 'Hide' : 'Show'} Progress
            </Button>
          </div>
        </motion.div>

        {/* Enhanced Jogging Animation */}
        {showJogger && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <ProgressDashboardAnimation progress={joggerProgress} isActive={joggerProgress > 0} />
          </motion.div>
        )}

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollableTabsList className="w-full">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <BarChartIcon className="h-4 w-4 text-primary" />
              {!isSmallScreen && t.overview}
            </TabsTrigger>
            <TabsTrigger value="trackers" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              {!isSmallScreen && t.trackers}
            </TabsTrigger>
            <TabsTrigger value="wizard" className="flex items-center gap-1">
              <Pencil className="h-4 w-4 text-amber-500 fill-amber-500" />
              {!isSmallScreen && t.wizard}
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-1">
              <Target className="h-4 w-4 text-red-500" />
              {!isSmallScreen && t.goals}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4 text-blue-500" />
              {!isSmallScreen && t.history}
            </TabsTrigger>
          </ScrollableTabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <ProgressTracker />
            <BMICalculator />
          </TabsContent>

          <TabsContent value="trackers" className="mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>{t.trackers}</CardTitle>
                <CardDescription className="text-sm">{t.trackDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="calories" className="w-full">
                  <ScrollableTabsList className="flex w-full">
                    <TabsTrigger value="calories" className="flex-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      {isSmallScreen ? "" : t.calories}
                    </TabsTrigger>
                    <TabsTrigger value="sleep" className="flex-1">
                      <Moon className="h-4 w-4 text-indigo-500" />
                      {isSmallScreen ? "" : t.sleep}
                    </TabsTrigger>
                    <TabsTrigger value="exercise" className="flex-1">
                      <Dumbbell className="h-4 w-4 text-green-500" />
                      {isSmallScreen ? "" : t.exercise}
                    </TabsTrigger>
                    <TabsTrigger value="water" className="flex-1">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      {isSmallScreen ? "" : t.water}
                    </TabsTrigger>
                    <TabsTrigger value="bmi" className="flex-1">
                      <Scale className="h-4 w-4 text-purple-500" />
                      {isSmallScreen ? "" : t.bmiTracker}
                    </TabsTrigger>
                  </ScrollableTabsList>
                  <div className="my-4">
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

          <TabsContent value="wizard" className="mt-4">
            <GoalWizard />
          </TabsContent>

          <TabsContent value="goals" className="space-y-4 mt-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  {t.goals}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    value={goalText} 
                    onChange={e => setGoalText(e.target.value)} 
                    placeholder="Add a new goal..." 
                    className="flex-1 px-3 py-2 border border-input rounded-md text-sm bg-background focus:ring-2 focus:ring-primary/20 outline-none" 
                    onKeyDown={e => e.key === 'Enter' && saveGoal()} 
                  />
                  <Button onClick={saveGoal} size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                    <Target className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                {Object.keys(goalsByWeek).length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-center py-8"
                  >
                    <motion.div 
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }} 
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Target className="h-16 w-16 mx-auto text-primary/30" />
                    </motion.div>
                    <p className="text-muted-foreground text-sm mt-4">No goals saved yet. Start by adding one above!</p>
                  </motion.div>
                ) : (
                  Object.entries(goalsByWeek).map(([week, goals]) => (
                    <motion.div 
                      key={week} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        {week}
                      </h4>
                      <div className="space-y-2">
                        {goals.map((g, index) => (
                          <motion.div 
                            key={g.id} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01, x: 2 }} 
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                              g.completed 
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/30' 
                                : 'bg-muted/50 hover:bg-muted'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={g.completed} 
                              onChange={() => toggleGoal(g.id)} 
                              className="h-4 w-4 rounded accent-primary cursor-pointer" 
                            />
                            <span className={`flex-1 text-sm ${g.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {g.text}
                            </span>
                            <button 
                              onClick={() => deleteGoal(g.id)} 
                              className="text-destructive hover:text-destructive/80 text-xs px-2 py-1 rounded hover:bg-destructive/10 transition-colors"
                            >
                              ✕
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-500" />
                  Weekly Progress History
                </CardTitle>
                <CardDescription>Summary of your health metrics over the last 8 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                {!hasHistoryData ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="text-center py-12"
                  >
                    <motion.div 
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }} 
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <BarChartIcon className="h-20 w-20 mx-auto text-primary/30" />
                    </motion.div>
                    <p className="text-muted-foreground mt-4">No history data yet. Start tracking your progress!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    {chartConfigs.map((chart, index) => (
                      <motion.div 
                        key={chart.key} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            {chart.icon}
                          </motion.div>
                          {chart.label}
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={weeklyData}>
                            <defs>
                              <linearGradient id={`gradient-${chart.key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chart.gradient[0]} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={chart.gradient[1]} stopOpacity={0.05} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip 
                              contentStyle={{ 
                                borderRadius: '12px', 
                                border: 'none', 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(8px)'
                              }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey={chart.key} 
                              stroke={chart.color} 
                              strokeWidth={2.5} 
                              fill={`url(#gradient-${chart.key})`} 
                              dot={{ r: 4, fill: chart.color }} 
                              activeDot={{ r: 6, strokeWidth: 2 }} 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ProgressPage;