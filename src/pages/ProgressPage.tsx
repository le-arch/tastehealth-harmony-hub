import React, { useState, useMemo, useEffect } from 'react';
import Confetti from '@/components/Confetti';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { Badge } from '@/components/ui/badge'; // <-- MISSING IMPORT ADDED HERE
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
  Award
} from 'lucide-react';
import { useScreenSize } from '@/utils/mobile';
import { getLS, setLS, LS_KEYS, CalorieEntry, SleepEntry, ExerciseEntry, HydrationEntry, BMIEntry } from '@/utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';

// Jogging Lady SVG Component with animations
const JoggingLady = ({ progress = 0, isActive = false }) => {
  const controls = useAnimation();
  const progressValue = useMotionValue(0);
  const xPosition = useTransform(progressValue, [0, 1], [0, 200]);
  const rotation = useTransform(progressValue, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, -5, 5, -5, 5, 0]);

  useEffect(() => {
    if (isActive) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, repeat: Infinity }
      });
      progressValue.set(progress);
    } else {
      controls.stop();
      controls.set({ scale: 1 });
    }
  }, [isActive, progress, controls, progressValue]);

  // Pulse animation for the heart
  const heartControls = useAnimation();
  useEffect(() => {
    if (isActive) {
      heartControls.start({
        scale: [1, 1.2, 1],
        opacity: [0.8, 1, 0.8],
        transition: { duration: 1, repeat: Infinity }
      });
    }
  }, [isActive, heartControls]);

  return (
    <motion.div 
      className="relative w-full h-48 overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
      animate={controls}
    >
      {/* Progress path */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path
          d="M 50,120 Q 150,80 250,100"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
          opacity="0.3"
          animate={{
            strokeDashoffset: [0, 20],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </svg>

      {/* Progress markers */}
      {[0.2, 0.4, 0.6, 0.8].map((marker, i) => (
        <motion.div
          key={i}
          className="absolute bottom-8 w-1 h-1 bg-primary/30 rounded-full"
          style={{ left: `${marker * 100}%` }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Running track */}
      <div className="absolute bottom-6 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

      {/* Jogging Lady SVG */}
      <motion.div
        className="absolute bottom-6"
        style={{ 
          left: xPosition,
          x: '-50%',
          rotate: rotation,
        }}
        animate={isActive ? {
          y: [0, -3, 0, -3, 0],
          transition: { duration: 0.5, repeat: Infinity }
        } : {}}
      >
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head with ponytail */}
          <motion.circle
            cx="30"
            cy="25"
            r="12"
            fill="url(#skinGradient)"
            stroke="#E0AFA0"
            strokeWidth="1"
            animate={isActive ? {
              y: [0, -1, 0],
              transition: { duration: 0.3, repeat: Infinity }
            } : {}}
          />
          <path d="M35 20 Q40 15, 45 18" stroke="#8B5E3C" strokeWidth="2" fill="none" />
          
          {/* Happy face */}
          <circle cx="26" cy="23" r="1.5" fill="#2D1B0E" />
          <circle cx="34" cy="23" r="1.5" fill="#2D1B0E" />
          <path d="M26 28 Q30 32, 34 28" stroke="#FF69B4" strokeWidth="1.5" fill="none" />
          
          {/* Sporty headband */}
          <path d="M22 18 L38 18" stroke="#FF6B6B" strokeWidth="3" />
          <circle cx="30" cy="18" r="2" fill="#FF6B6B" />
          
          {/* Running top */}
          <motion.rect
            x="22"
            y="32"
            width="16"
            height="20"
            fill="url(#topGradient)"
            rx="4"
            animate={isActive ? {
              x: [22, 23, 22],
              transition: { duration: 0.3, repeat: Infinity }
            } : {}}
          />
          
          {/* Arms swinging */}
          <motion.g
            animate={isActive ? {
              rotate: [-15, 15, -15],
              transition: { duration: 0.5, repeat: Infinity }
            } : {}}
            style={{ originX: "22px", originY: "40px" }}
          >
            <rect x="8" y="36" width="16" height="6" rx="3" fill="url(#armGradient)" transform="rotate(-10)" />
          </motion.g>
          
          <motion.g
            animate={isActive ? {
              rotate: [15, -15, 15],
              transition: { duration: 0.5, repeat: Infinity }
            } : {}}
            style={{ originX: "38px", originY: "40px" }}
          >
            <rect x="36" y="36" width="16" height="6" rx="3" fill="url(#armGradient)" transform="rotate(10)" />
          </motion.g>
          
          {/* Legs running */}
          <motion.g
            animate={isActive ? {
              rotate: [-20, 0, -20],
              y: [0, -2, 0],
              transition: { duration: 0.4, repeat: Infinity }
            } : {}}
            style={{ originX: "25px", originY: "50px" }}
          >
            <rect x="20" y="48" width="8" height="20" rx="4" fill="url(#legGradient)" />
          </motion.g>
          
          <motion.g
            animate={isActive ? {
              rotate: [20, 0, 20],
              y: [0, -2, 0],
              transition: { duration: 0.4, repeat: Infinity, delay: 0.2 }
            } : {}}
            style={{ originX: "35px", originY: "50px" }}
          >
            <rect x="32" y="48" width="8" height="20" rx="4" fill="url(#legGradient)" />
          </motion.g>
          
          {/* Running shoes */}
          <motion.ellipse
            cx="24"
            cy="68"
            rx="5"
            ry="3"
            fill="#FF6B6B"
            animate={isActive ? {
              x: [24, 26, 24],
              transition: { duration: 0.4, repeat: Infinity }
            } : {}}
          />
          <motion.ellipse
            cx="36"
            cy="68"
            rx="5"
            ry="3"
            fill="#FF6B6B"
            animate={isActive ? {
              x: [36, 38, 36],
              transition: { duration: 0.4, repeat: Infinity, delay: 0.2 }
            } : {}}
          />
          
          {/* Sweat droplets when active */}
          {isActive && (
            <>
              <motion.circle
                cx="40"
                cy="25"
                r="2"
                fill="#4FC3F7"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, 10],
                  x: [40, 45],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
              <motion.circle
                cx="45"
                cy="30"
                r="1.5"
                fill="#4FC3F7"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, 15],
                  x: [45, 52],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: 0.8
                }}
              />
            </>
          )}

          {/* Gradients */}
          <defs>
            <linearGradient id="skinGradient" x1="20" y1="15" x2="40" y2="35">
              <stop stopColor="#FFE0BD" />
              <stop offset="1" stopColor="#FFD4A8" />
            </linearGradient>
            <linearGradient id="topGradient" x1="22" y1="32" x2="38" y2="52">
              <stop stopColor="#FF6B6B" />
              <stop offset="1" stopColor="#FF8E8E" />
            </linearGradient>
            <linearGradient id="armGradient" x1="8" y1="36" x2="24" y2="42">
              <stop stopColor="#FF6B6B" />
              <stop offset="1" stopColor="#FF8E8E" />
            </linearGradient>
            <linearGradient id="legGradient" x1="20" y1="48" x2="28" y2="68">
              <stop stopColor="#4A5568" />
              <stop offset="1" stopColor="#2D3748" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Heart rate indicator */}
      <motion.div 
        className="absolute top-4 right-4 flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm"
        animate={heartControls}
      >
        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
        <span className="text-xs font-medium">{Math.round(progress * 100)}%</span>
      </motion.div>

      {/* Progress stats */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-muted-foreground">
        <span>Start</span>
        <span className="flex items-center gap-1">
          <Footprints className="h-3 w-3" />
          {Math.round(progress * 1000)} steps
        </span>
        <span>Goal</span>
      </div>

      {/* Activity rings */}
      <svg className="absolute top-2 left-2 w-12 h-12">
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeDasharray="100"
          strokeDashoffset={100 - progress * 100}
          transform="rotate(-90 20 20)"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
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

    // Calculate progress based on tracked data (customize based on your goals)
    const today = new Date().toDateString();
    const todayCalories = calorieLog.filter(e => new Date(e.date).toDateString() === today).length;
    const todayExercise = exerciseLog.filter(e => new Date(e.date).toDateString() === today).length;
    const todayHydration = hydrationLog.filter(e => new Date(e.date).toDateString() === today).length;
    const todaySleep = sleepLog.filter(e => new Date(e.date).toDateString() === today).length;

    const totalTracked = todayCalories + todayExercise + todayHydration + todaySleep;
    const maxDaily = 8; // Example: 2 meals + 1 exercise + 4 water + 1 sleep
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
              <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
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
              className="flex items-center gap-2"
            >
              <Footprints className={`h-4 w-4 ${showJogger ? 'text-primary' : ''}`} />
              {showJogger ? 'Hide' : 'Show'} Progress
            </Button>
            
            <Button 
              variant="default" 
              className="flex items-center bg-gradient-to-r from-primary to-primary/80" 
              onClick={() => setActiveTab("trackers")} 
              size={isSmallScreen ? "icon" : "default"}
            >
              {activeTab === "trackers" ? <Edit className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
              {!isSmallScreen && <span className="ml-1">{activeTab === "trackers" ? t.editProgress : t.addProgress}</span>}
            </Button>
          </div>
        </motion.div>

        {/* Jogging Lady Progress Animation */}
        {showJogger && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card className="border-primary/20 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{t.weeklyProgress}</h3>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    {getMotivationalMessage()}
                  </Badge>
                </div>
                
                <JoggingLady progress={joggerProgress} isActive={joggerProgress > 0} />
                
                {/* Progress stats */}
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <div className="font-semibold text-primary">{Math.round(joggerProgress * 100)}%</div>
                    <div className="text-muted-foreground">Overall</div>
                  </div>
                  <div className="p-2 bg-orange-500/5 rounded-lg">
                    <div className="font-semibold text-orange-500">{weeklyData[weeklyData.length-1]?.calories || 0}</div>
                    <div className="text-muted-foreground">Calories</div>
                  </div>
                  <div className="p-2 bg-green-500/5 rounded-lg">
                    <div className="font-semibold text-green-500">{weeklyData[weeklyData.length-1]?.exercise || 0}min</div>
                    <div className="text-muted-foreground">Exercise</div>
                  </div>
                  <div className="p-2 bg-blue-500/5 rounded-lg">
                    <div className="font-semibold text-blue-500">{weeklyData[weeklyData.length-1]?.water || 0}cups</div>
                    <div className="text-muted-foreground">Water</div>
                  </div>
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
                    className="flex-1 px-3 py-2 border border-input rounded-md text-sm bg-background" 
                    onKeyDown={e => e.key === 'Enter' && saveGoal()} 
                  />
                  <Button onClick={saveGoal} size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                {Object.keys(goalsByWeek).length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Target className="h-12 w-12 mx-auto text-primary/30" />
                    </motion.div>
                    <p className="text-muted-foreground text-sm mt-2">No goals saved yet.</p>
                  </motion.div>
                ) : (
                  Object.entries(goalsByWeek).map(([week, goals]) => (
                    <motion.div key={week} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">{week}</h4>
                      <div className="space-y-2">
                        {goals.map(g => (
                          <motion.div 
                            key={g.id} 
                            whileHover={{ scale: 1.01 }} 
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${g.completed ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/30' : 'bg-muted/50 hover:bg-muted'}`}
                          >
                            <input 
                              type="checkbox" 
                              checked={g.completed} 
                              onChange={() => toggleGoal(g.id)} 
                              className="h-4 w-4 rounded accent-primary" 
                            />
                            <span className={`flex-1 text-sm ${g.completed ? 'line-through text-muted-foreground' : ''}`}>{g.text}</span>
                            <button onClick={() => deleteGoal(g.id)} className="text-destructive hover:text-destructive/80 text-xs">✕</button>
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
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <BarChartIcon className="h-16 w-16 mx-auto text-primary/30" />
                    </motion.div>
                    <p className="text-muted-foreground mt-4">No history data yet. Start tracking!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    {chartConfigs.map(chart => (
                      <motion.div key={chart.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          {chart.icon}
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
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
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