import React, { useState, useMemo } from 'react';
import Confetti from '@/components/Confetti';
import { useNavigate } from 'react-router-dom';
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
import { getLS, LS_KEYS, CalorieEntry, SleepEntry, ExerciseEntry, HydrationEntry, BMIEntry } from '@/utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressPage = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { isMobile, isTablet } = useScreenSize();
  const isSmallScreen = isMobile || isTablet;
  const [goalText, setGoalText] = useState('');

  const t = language === 'fr'
    ? { title: "Progrès & Objectifs", overview: "Vue d'ensemble", trackers: "Saisir données", wizard: "Goal Wizard", history: "Historique", goals: "Objectifs", subtitle: "Suivez votre parcours santé", calories: "Calories", sleep: "Sommeil", exercise: "Exercice", water: "Hydratation", bmiTracker: "IMC", trackDescription: "Saisissez vos données de santé", addProgress: "Ajouter des données", editProgress: "Modifier les données" }
    : { title: "Progress & Goals", overview: "Overview", trackers: "Track Data", wizard: "Goal Wizard", history: "History", goals: "Goals", subtitle: "Track your health journey", calories: "Calories", sleep: "Sleep", exercise: "Exercise", water: "Water Intake", bmiTracker: "BMI", trackDescription: "Enter your health data to see it reflected in your charts", addProgress: "Add Progress", editProgress: "Edit Progress" };

  interface SavedGoal { id: string; text: string; week: string; date: string; completed: boolean; }
  const [savedGoals, setSavedGoals] = useState<SavedGoal[]>(() => {
    try { return JSON.parse(localStorage.getItem('th_saved_goals') || '[]'); } catch { return []; }
  });
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

  return (
    <PageLayout activePage="progress">
      <div className="p-3 sm:p-6 max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{t.title}</h1>
            <p className="text-muted-foreground text-sm">{t.subtitle}</p>
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
            <TabsTrigger value="wizard" className="flex items-center gap-1"><Pencil className="h-4 w-4" />{!isSmallScreen && t.wizard}</TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-1"><Target className="h-4 w-4" />{!isSmallScreen && t.goals}</TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1"><History className="h-4 w-4" />{!isSmallScreen && t.history}</TabsTrigger>
          </ScrollableTabsList>

          <TabsContent value="overview" className="space-y-4 mt-4"><ProgressTracker /><BMICalculator /></TabsContent>

          <TabsContent value="trackers" className="mt-4">
            <Card>
              <CardHeader className="p-4"><CardTitle>{t.trackers}</CardTitle><CardDescription className="text-sm">{t.trackDescription}</CardDescription></CardHeader>
              <CardContent>
                <Tabs defaultValue="calories" className="w-full">
                  <ScrollableTabsList className="flex w-full">
                    <TabsTrigger value="calories" className="flex-1"><Flame className="h-4 w-4" />{isSmallScreen ? "" : t.calories}</TabsTrigger>
                    <TabsTrigger value="sleep" className="flex-1"><Moon className="h-4 w-4" />{isSmallScreen ? "" : t.sleep}</TabsTrigger>
                    <TabsTrigger value="exercise" className="flex-1"><Dumbbell className="h-4 w-4" />{isSmallScreen ? "" : t.exercise}</TabsTrigger>
                    <TabsTrigger value="water" className="flex-1"><Droplet className="h-4 w-4" />{isSmallScreen ? "" : t.water}</TabsTrigger>
                    <TabsTrigger value="bmi" className="flex-1"><Scale className="h-4 w-4" />{isSmallScreen ? "" : t.bmiTracker}</TabsTrigger>
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

          <TabsContent value="wizard" className="mt-4"><Card><CardHeader><CardTitle>{t.wizard}</CardTitle></CardHeader><CardContent><GoalWizard /></CardContent></Card></TabsContent>

          <TabsContent value="goals" className="space-y-4 mt-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" />{t.goals}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input value={goalText} onChange={e => setGoalText(e.target.value)} placeholder="Add a new goal..." className="flex-1 px-3 py-2 border border-input rounded-md text-sm bg-background" onKeyDown={e => e.key === 'Enter' && saveGoal()} />
                  <Button onClick={saveGoal} size="sm"><PlusCircle className="h-4 w-4 mr-1" />Add</Button>
                </div>
                {Object.keys(goalsByWeek).length === 0 ? (
                  <div className="text-center py-8"><Target className="h-10 w-10 mx-auto text-muted-foreground mb-2" /><p className="text-muted-foreground text-sm">No goals saved yet.</p></div>
                ) : (
                  Object.entries(goalsByWeek).map(([week, goals]) => (
                    <div key={week}>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">{week}</h4>
                      <div className="space-y-2">
                        {goals.map(g => (
                          <div key={g.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <input type="checkbox" checked={g.completed} onChange={() => toggleGoal(g.id)} className="h-4 w-4 rounded" />
                            <span className={`flex-1 text-sm ${g.completed ? 'line-through text-muted-foreground' : ''}`}>{g.text}</span>
                            <button onClick={() => deleteGoal(g.id)} className="text-destructive hover:text-destructive/80 text-xs">✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Weekly Progress History</CardTitle>
                <CardDescription>Summary of your health metrics over the last 8 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                {!hasHistoryData ? (
                  <div className="text-center py-12"><BarChartIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No history data yet. Start tracking!</p></div>
                ) : (
                  <div className="space-y-8">
                    {[
                      { key: 'calories', label: 'Calories (weekly total)', icon: <Flame className="h-4 w-4" />, color: 'hsl(var(--primary))' },
                      { key: 'sleep', label: 'Sleep (avg hours/night)', icon: <Moon className="h-4 w-4" />, color: '#6366f1' },
                      { key: 'exercise', label: 'Exercise (total minutes)', icon: <Dumbbell className="h-4 w-4" />, color: '#22c55e' },
                      { key: 'water', label: 'Water Intake (total cups)', icon: <Droplet className="h-4 w-4" />, color: '#3b82f6' },
                      { key: 'bmi', label: 'BMI (weekly average)', icon: <Scale className="h-4 w-4" />, color: '#a855f7' },
                    ].map(chart => (
                      <div key={chart.key}>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">{chart.icon}{chart.label}</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Bar dataKey={chart.key} fill={chart.color} radius={[4,4,0,0]} /></BarChart>
                        </ResponsiveContainer>
                      </div>
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
