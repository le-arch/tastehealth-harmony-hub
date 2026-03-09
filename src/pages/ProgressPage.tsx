import React, { useState, useMemo, useEffect } from 'react';
import Confetti from '@/components/Confetti';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import BMICalculator from '@/components/health/BMICalculator';
import ProgressTracker from '@/components/health/ProgressTracker';
import CalorieTracker from '@/components/health/CalorieTracker';
import SleepTracker from '@/components/health/SleepTracker';
import ExerciseTracker from '@/components/health/ExerciseTracker';
import HydrationInput from '@/components/health/HydrationInput';
import GoalWizard from './GoalWizard';
import { BarChart as BarChartIcon, TrendingUp, History, PlusCircle, Edit, Pencil, Droplet, Moon, Flame, Scale, Dumbbell, Target } from 'lucide-react';
import { useScreenSize } from '@/utils/mobile';
import { getLS, setLS, LS_KEYS, CalorieEntry, SleepEntry, ExerciseEntry, HydrationEntry, BMIEntry } from '@/utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';

const ProgressPage = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { isMobile, isTablet } = useScreenSize();
  const isSmallScreen = isMobile || isTablet;
  const [goalText, setGoalText] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const t = language === 'fr'
    ? { title: "Progrès & Objectifs", overview: "Vue d'ensemble", trackers: "Saisir données", wizard: "Goal Wizard", history: "Historique", goals: "Objectifs", subtitle: "Suivez votre parcours santé", calories: "Calories", sleep: "Sommeil", exercise: "Exercice", water: "Hydratation", bmiTracker: "IMC", trackDescription: "Saisissez vos données de santé", addProgress: "Ajouter des données", editProgress: "Modifier les données" }
    : { title: "Progress & Goals", overview: "Overview", trackers: "Track Data", wizard: "Goal Wizard", history: "History", goals: "Goals", subtitle: "Track your health journey", calories: "Calories", sleep: "Sleep", exercise: "Exercise", water: "Water Intake", bmiTracker: "BMI", trackDescription: "Enter your health data to see it reflected in your charts", addProgress: "Add Progress", editProgress: "Edit Progress" };

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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <BarChartIcon className="h-6 w-6 text-primary" />
              </motion.span>
              {t.title}
            </h1>
            <p className="text-muted-foreground text-sm">{t.subtitle}</p>
          </div>
          <Button variant="default" className="flex items-center bg-gradient-to-r from-primary to-primary/80" onClick={() => setActiveTab("trackers")} size={isSmallScreen ? "icon" : "default"}>
            {activeTab === "trackers" ? <Edit className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {!isSmallScreen && <span className="ml-1">{activeTab === "trackers" ? t.editProgress : t.addProgress}</span>}
          </Button>
        </motion.div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollableTabsList className="w-full">
            <TabsTrigger value="overview" className="flex items-center gap-1"><BarChartIcon className="h-4 w-4 text-primary" />{!isSmallScreen && t.overview}</TabsTrigger>
            <TabsTrigger value="trackers" className="flex items-center gap-1"><TrendingUp className="h-4 w-4 text-green-500" />{!isSmallScreen && t.trackers}</TabsTrigger>
            <TabsTrigger value="wizard" className="flex items-center gap-1"><Pencil className="h-4 w-4 text-amber-500" />{!isSmallScreen && t.wizard}</TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-1"><Target className="h-4 w-4 text-red-500" />{!isSmallScreen && t.goals}</TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1"><History className="h-4 w-4 text-blue-500" />{!isSmallScreen && t.history}</TabsTrigger>
          </ScrollableTabsList>

          <TabsContent value="overview" className="space-y-4 mt-4"><ProgressTracker /><BMICalculator /></TabsContent>

          <TabsContent value="trackers" className="mt-4">
            <Card>
              <CardHeader className="p-4"><CardTitle>{t.trackers}</CardTitle><CardDescription className="text-sm">{t.trackDescription}</CardDescription></CardHeader>
              <CardContent>
                <Tabs defaultValue="calories" className="w-full">
                  <ScrollableTabsList className="flex w-full">
                    <TabsTrigger value="calories" className="flex-1"><Flame className="h-4 w-4 text-orange-500" />{isSmallScreen ? "" : t.calories}</TabsTrigger>
                    <TabsTrigger value="sleep" className="flex-1"><Moon className="h-4 w-4 text-indigo-500" />{isSmallScreen ? "" : t.sleep}</TabsTrigger>
                    <TabsTrigger value="exercise" className="flex-1"><Dumbbell className="h-4 w-4 text-green-500" />{isSmallScreen ? "" : t.exercise}</TabsTrigger>
                    <TabsTrigger value="water" className="flex-1"><Droplet className="h-4 w-4 text-blue-500" />{isSmallScreen ? "" : t.water}</TabsTrigger>
                    <TabsTrigger value="bmi" className="flex-1"><Scale className="h-4 w-4 text-purple-500" />{isSmallScreen ? "" : t.bmiTracker}</TabsTrigger>
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

          <TabsContent value="wizard" className="mt-4"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Pencil className="h-5 w-5 text-amber-500" />{t.wizard}</CardTitle></CardHeader><CardContent><GoalWizard /></CardContent></Card></TabsContent>

          <TabsContent value="goals" className="space-y-4 mt-4">
            <Card className="border-primary/20">
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-red-500" />{t.goals}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input value={goalText} onChange={e => setGoalText(e.target.value)} placeholder="Add a new goal..." className="flex-1 px-3 py-2 border border-input rounded-md text-sm bg-background" onKeyDown={e => e.key === 'Enter' && saveGoal()} />
                  <Button onClick={saveGoal} size="sm" className="bg-gradient-to-r from-primary to-primary/80"><PlusCircle className="h-4 w-4 mr-1" />Add</Button>
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
                          <motion.div key={g.id} whileHover={{ scale: 1.01 }} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${g.completed ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/30' : 'bg-muted/50 hover:bg-muted'}`}>
                            <input type="checkbox" checked={g.completed} onChange={() => toggleGoal(g.id)} className="h-4 w-4 rounded accent-primary" />
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
                <CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-blue-500" />Weekly Progress History</CardTitle>
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
                        <h3 className="font-semibold mb-3 flex items-center gap-2">{chart.icon}{chart.label}</h3>
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
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey={chart.key} stroke={chart.color} strokeWidth={2.5} fill={`url(#gradient-${chart.key})`} dot={{ r: 4, fill: chart.color }} activeDot={{ r: 6, strokeWidth: 2 }} />
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
