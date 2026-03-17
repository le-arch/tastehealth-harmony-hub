import React, { useState, useMemo, useEffect } from 'react';
import Confetti from '@/components/Confetti';
import { motion, useAnimation, useMotionValue, useTransform, useSpring } from 'framer-motion';
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
  PlusCircle, 
  Edit, 
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

// Video-based Progress Runner Component
const RealisticRunner = ({ progress = 0, isActive = false }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const progressValue = useMotionValue(0);
  const springProgress = useSpring(progressValue, { stiffness: 100, damping: 30 });
  const xPosition = useTransform(springProgress, [0, 1], [0, 220]);
  const scale = useTransform(springProgress, [0, 0.5, 1], [1, 1.05, 1]);

  useEffect(() => {
    progressValue.set(progress);
  }, [progress, progressValue]);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  return (
    <motion.div 
      className="relative w-full h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30"
      style={{ scale }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
          initial={{ x: `${20 + i * 10}%`, y: '60%', opacity: 0 }}
          animate={{
            y: ['60%', '20%'],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Decorative icons */}
      <motion.div className="absolute top-4 left-4 flex gap-1" animate={{ rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        <Sparkles className="h-4 w-4 text-purple-400" />
      </motion.div>
      <motion.div className="absolute top-4 right-4" animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <Sun className="h-6 w-6 text-yellow-400" />
      </motion.div>

      {/* Running track glow */}
      <div className="absolute bottom-8 left-0 w-full h-1">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* Video Runner */}
      <motion.div
        className="absolute bottom-4"
        style={{ 
          left: xPosition,
          x: '-50%',
          filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.1))'
        }}
      >
        <video
          ref={videoRef}
          src="/videos/progress.mp4"
          loop
          muted
          playsInline
          className="w-20 h-28 object-contain"
          style={{ mixBlendMode: 'multiply' }}
        />
      </motion.div>

      {/* Heart rate monitor */}
      <motion.div 
        className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-pink-200 dark:border-pink-800"
        animate={{ y: [0, -2, 0], boxShadow: ['0 4px 12px rgba(236,72,153,0.2)', '0 6px 16px rgba(236,72,153,0.3)', '0 4px 12px rgba(236,72,153,0.2)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
        </motion.div>
        <span className="text-sm font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          {Math.round(progress * 100)}%
        </span>
        <Activity className="h-4 w-4 text-purple-400" />
      </motion.div>

      {/* Bottom stats */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-2 bg-gradient-to-t from-black/5 to-transparent">
        <motion.div className="text-xs font-medium text-pink-600 dark:text-pink-400" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          🏁 Start
        </motion.div>
        <motion.div
          className="flex items-center gap-1 text-xs font-medium bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-full backdrop-blur-sm"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Footprints className="h-3 w-3 text-purple-500" />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
            {Math.round(progress * 5000)} steps
          </span>
        </motion.div>
        <motion.div className="text-xs font-medium text-purple-600 dark:text-purple-400" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>
          Goal 🏆
        </motion.div>
      </div>

      {/* Achievement ring */}
      <svg className="absolute top-2 right-2 w-16 h-16">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="24" fill="none" stroke="url(#ringGradient)" strokeWidth="3" strokeDasharray={`${progress * 151} 151`} strokeLinecap="round" transform="rotate(-90 32 32)" opacity="0.8" />
        <motion.circle cx="32" cy="32" r="18" fill="white" className="dark:fill-gray-800" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        <text x="32" y="36" textAnchor="middle" className="text-xs font-bold fill-current">{Math.round(progress * 100)}%</text>
      </svg>

      {/* Floating emojis when active */}
      {isActive && ['💪', '⚡', '🌟', '✨'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{ x: 20 + i * 30, y: 100, opacity: 0 }}
          animate={{ x: 20 + i * 30, y: [100, 50, 100], opacity: [0, 1, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {emoji}
        </motion.div>
      ))}
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
            
            <Button 
              variant="default" 
              className="flex items-center bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 relative overflow-hidden group" 
              onClick={() => setActiveTab("trackers")} 
              size={isSmallScreen ? "icon" : "default"}
            >
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
              />
              {activeTab === "trackers" ? <Edit className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
              {!isSmallScreen && <span className="ml-1">{activeTab === "trackers" ? t.editProgress : t.addProgress}</span>}
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
            <Card className="border-primary/20 overflow-hidden bg-gradient-to-br from-white to-pink-50 dark:from-gray-900 dark:to-purple-950/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Activity className="h-5 w-5 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {t.weeklyProgress}
                    </h3>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1 border-pink-200 dark:border-pink-800">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="h-3 w-3 text-yellow-500" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-bold">
                      {getMotivationalMessage()}
                    </span>
                  </Badge>
                </div>
                
                <RealisticRunner progress={joggerProgress} isActive={joggerProgress > 0} />
                
                {/* Enhanced progress stats */}
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[
                    { label: 'Overall', value: `${Math.round(joggerProgress * 100)}%`, icon: Award, color: 'from-pink-500 to-purple-500' },
                    { label: 'Calories', value: weeklyData[weeklyData.length-1]?.calories || 0, icon: Flame, color: 'from-orange-500 to-red-500' },
                    { label: 'Exercise', value: `${weeklyData[weeklyData.length-1]?.exercise || 0}min`, icon: Dumbbell, color: 'from-green-500 to-emerald-500' },
                    { label: 'Water', value: `${weeklyData[weeklyData.length-1]?.water || 0}cups`, icon: Droplet, color: 'from-blue-500 to-cyan-500' },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="relative overflow-hidden rounded-lg p-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm"
                      whileHover={{ scale: 1.02, y: -2 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`} />
                      <div className="relative flex items-center gap-1">
                        <stat.icon className={`h-3 w-3 bg-gradient-to-r ${stat.color} bg-clip-text`} />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                      <div className={`text-sm font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mt-1`}>
                        {stat.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pencil className="h-5 w-5 text-amber-500" />
                  {t.wizard}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GoalWizard />
              </CardContent>
            </Card>
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
                    <PlusCircle className="h-4 w-4 mr-1" />
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