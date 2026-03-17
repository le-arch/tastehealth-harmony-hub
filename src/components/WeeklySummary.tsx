import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Flame, Moon, Dumbbell, Droplet, TrendingUp, TrendingDown, Minus, Activity, Heart, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getLS, LS_KEYS, CalorieEntry, SleepEntry, ExerciseEntry, HydrationEntry } from '@/utils/localStorage';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface WeekData {
  calories: number[];
  sleep: number[];
  exercise: number[];
  water: number[];
}

const getWeekData = (weeksAgo: number): WeekData => {
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() - weeksAgo * 7);
  const weekStart = new Date(weekEnd);
  weekStart.setDate(weekEnd.getDate() - 7);

  const inRange = (dateStr: string) => {
    const d = new Date(dateStr);
    return d >= weekStart && d < weekEnd;
  };

  return {
    calories: getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []).filter(e => inRange(e.date)).map(e => e.calories),
    sleep: getLS<SleepEntry[]>(LS_KEYS.SLEEP_LOG, []).filter(e => inRange(e.date)).map(e => e.hours),
    exercise: getLS<ExerciseEntry[]>(LS_KEYS.EXERCISE_LOG, []).filter(e => inRange(e.date)).map(e => e.duration),
    water: getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []).filter(e => inRange(e.date)).map(e => e.cups),
  };
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const avg = (arr: number[]) => arr.length ? sum(arr) / arr.length : 0;

const TrendIndicator = ({ current, previous, unit, inverse = false }: { current: number; previous: number; unit: string; inverse?: boolean }) => {
  if (previous === 0 && current === 0) return <span className="text-xs text-muted-foreground">No prior data</span>;
  const diff = current - previous;
  const pct = previous > 0 ? Math.round((diff / previous) * 100) : 0;
  const isPositive = inverse ? diff < 0 : diff > 0;
  
  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : diff === 0 ? 'text-muted-foreground' : 'text-red-500 dark:text-red-400'}`}>
      {diff > 0 ? <ArrowUpRight className="h-3 w-3" /> : diff < 0 ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
      <span>{Math.abs(pct)}% vs last week</span>
    </div>
  );
};

const WeeklySummary: React.FC = () => {
  const thisWeek = useMemo(() => getWeekData(0), []);
  const lastWeek = useMemo(() => getWeekData(1), []);

  const totalCal = sum(thisWeek.calories);
  const avgCal = thisWeek.calories.length ? Math.round(totalCal / 7) : 0;
  const totalSleep = sum(thisWeek.sleep);
  const avgSleep = thisWeek.sleep.length ? +(totalSleep / 7).toFixed(1) : 0;
  const totalExercise = sum(thisWeek.exercise);
  const totalWater = sum(thisWeek.water);
  const avgWater = +(totalWater / 7).toFixed(1);

  const prevAvgCal = lastWeek.calories.length ? Math.round(sum(lastWeek.calories) / 7) : 0;
  const prevAvgSleep = lastWeek.sleep.length ? +(sum(lastWeek.sleep) / 7).toFixed(1) : 0;
  const prevTotalExercise = sum(lastWeek.exercise);
  const prevTotalWater = sum(lastWeek.water);

  // Goals (from settings or defaults)
  const goals = useMemo(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('th_nutrition_prefs') || '{}');
      return {
        calories: parseInt(prefs.calorieGoal) || 2000,
        sleep: 8,
        exercise: 150, // WHO recommends 150 min/week
        water: 56, // 8 cups * 7 days
      };
    } catch { return { calories: 2000, sleep: 8, exercise: 150, water: 56 }; }
  }, []);

  const caloriePct = Math.min(Math.round((avgCal / goals.calories) * 100), 150);
  const sleepPct = Math.min(Math.round((avgSleep / goals.sleep) * 100), 150);
  const exercisePct = Math.min(Math.round((totalExercise / goals.exercise) * 100), 150);
  const waterPct = Math.min(Math.round((totalWater / goals.water) * 100), 150);

  // Health insights
  const insights = useMemo(() => {
    const list: { text: string; type: 'good' | 'warning' | 'info' }[] = [];
    
    if (avgSleep >= 7 && avgSleep <= 9) list.push({ text: 'Your sleep is in the healthy 7-9 hour range.', type: 'good' });
    else if (avgSleep > 0 && avgSleep < 7) list.push({ text: 'You averaged less than 7 hrs of sleep. Try to aim for 7-9 hours.', type: 'warning' });
    
    if (totalExercise >= 150) list.push({ text: `You hit the WHO-recommended 150 min/week of exercise!`, type: 'good' });
    else if (totalExercise > 0) list.push({ text: `${150 - totalExercise} more minutes to reach the 150 min/week exercise goal.`, type: 'info' });
    
    if (avgWater >= 8) list.push({ text: 'Great hydration — averaging 8+ cups per day.', type: 'good' });
    else if (totalWater > 0) list.push({ text: `Increase water intake by ${Math.ceil(8 - avgWater)} cups/day to meet your goal.`, type: 'warning' });
    
    if (avgCal > 0 && Math.abs(avgCal - goals.calories) < 200) list.push({ text: 'Calorie intake is close to your daily target.', type: 'good' });
    else if (avgCal > goals.calories + 300) list.push({ text: `You're averaging ${avgCal - goals.calories} kcal over your daily goal.`, type: 'warning' });
    
    if (thisWeek.exercise.length >= 5) list.push({ text: `Logged exercise ${thisWeek.exercise.length} days this week — great consistency!`, type: 'good' });
    
    if (list.length === 0) list.push({ text: 'Start logging data to get personalized health insights.', type: 'info' });
    
    return list;
  }, [avgSleep, totalExercise, avgWater, avgCal, goals]);

  // Overall health score (0-100)
  const healthScore = useMemo(() => {
    const scores: number[] = [];
    if (totalCal > 0) scores.push(Math.min(caloriePct, 100));
    if (totalSleep > 0) scores.push(Math.min(sleepPct, 100));
    if (totalExercise > 0) scores.push(Math.min(exercisePct, 100));
    if (totalWater > 0) scores.push(Math.min(waterPct, 100));
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }, [caloriePct, sleepPct, exercisePct, waterPct, totalCal, totalSleep, totalExercise, totalWater]);

  // Weekly notification
  useEffect(() => {
    const lastNotified = localStorage.getItem('th_weekly_summary_notified');
    const dayOfWeek = new Date().getDay();
    const weekKey = `week-${new Date().toISOString().slice(0, 10)}`;
    if (dayOfWeek === 0 && lastNotified !== weekKey && (totalCal > 0 || totalSleep > 0)) {
      const existing = JSON.parse(localStorage.getItem(LS_KEYS.NOTIFICATIONS) || '[]');
      existing.unshift({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        title: '📊 Weekly Summary',
        message: `Health Score: ${healthScore}/100. Avg ${avgCal} cal/day, ${avgSleep} hrs sleep, ${totalExercise} min exercise, ${totalWater} cups water.`,
        read: false,
      });
      localStorage.setItem(LS_KEYS.NOTIFICATIONS, JSON.stringify(existing));
      localStorage.setItem('th_weekly_summary_notified', weekKey);
    }
  }, []);

  const hasData = totalCal > 0 || totalSleep > 0 || totalExercise > 0 || totalWater > 0;

  const stats = [
    { label: 'Avg Daily Calories', value: `${avgCal} kcal`, icon: <Flame className="h-5 w-5 text-orange-500" />, detail: `${totalCal} total`, color: 'from-orange-500/10 to-amber-500/10', pct: caloriePct, prev: prevAvgCal, curr: avgCal },
    { label: 'Avg Sleep', value: `${avgSleep} hrs`, icon: <Moon className="h-5 w-5 text-indigo-500" />, detail: `${totalSleep.toFixed(1)} hrs total`, color: 'from-indigo-500/10 to-purple-500/10', pct: sleepPct, prev: prevAvgSleep, curr: avgSleep },
    { label: 'Total Exercise', value: `${totalExercise} min`, icon: <Dumbbell className="h-5 w-5 text-green-500" />, detail: `${thisWeek.exercise.length} sessions`, color: 'from-green-500/10 to-emerald-500/10', pct: exercisePct, prev: prevTotalExercise, curr: totalExercise },
    { label: 'Total Water', value: `${totalWater} cups`, icon: <Droplet className="h-5 w-5 text-blue-500" />, detail: `Avg ${avgWater} cups/day`, color: 'from-blue-500/10 to-cyan-500/10', pct: waterPct, prev: prevTotalWater, curr: totalWater },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <CalendarCheck className="h-6 w-6 text-primary" />
            </motion.span>
            Weekly Health Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <TrendingUp className="h-12 w-12 mx-auto text-primary/30" />
              </motion.div>
              <p className="text-muted-foreground mt-4">No data logged this week. Start tracking in the Progress page!</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Health Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-4"
              >
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke={healthScore >= 80 ? 'hsl(142 71% 45%)' : healthScore >= 50 ? 'hsl(45 93% 47%)' : 'hsl(0 84% 60%)'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${healthScore * 2.64} 264`}
                      initial={{ strokeDasharray: '0 264' }}
                      animate={{ strokeDasharray: `${healthScore * 2.64} 264` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{healthScore}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">/ 100</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">
                    {healthScore >= 80 ? '🌟 Excellent Week!' : healthScore >= 60 ? '💪 Good Progress' : healthScore >= 40 ? '📈 Building Momentum' : '🚀 Let\'s Go!'}
                  </p>
                  <p className="text-xs text-muted-foreground">Overall Health Score</p>
                </div>
              </motion.div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((s, idx) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl bg-gradient-to-br ${s.color} border hover:shadow-md transition-all`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>{s.icon}</motion.div>
                        <span className="font-medium text-sm">{s.label}</span>
                      </div>
                      <TrendIndicator current={s.curr} previous={s.prev} unit="" />
                    </div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.detail}</div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Goal progress</span>
                        <span className="font-medium">{Math.min(s.pct, 100)}%</span>
                      </div>
                      <Progress value={Math.min(s.pct, 100)} className="h-1.5" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Health Insights */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <Activity className="h-4 w-4 text-primary" />
                  Health Insights
                </h3>
                <div className="space-y-2">
                  {insights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                        insight.type === 'good' ? 'bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300' :
                        insight.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300' :
                        'bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300'
                      }`}
                    >
                      {insight.type === 'good' ? <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" /> :
                       insight.type === 'warning' ? <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" /> :
                       <Heart className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <span>{insight.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklySummary;
