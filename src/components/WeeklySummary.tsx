import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Flame, Moon, Dumbbell, Droplet, TrendingUp } from "lucide-react";
import { getLS, LS_KEYS, CalorieEntry, SleepEntry, ExerciseEntry, HydrationEntry } from '@/utils/localStorage';

const WeeklySummary: React.FC = () => {
  const now = new Date();
  const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);

  const calories = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []).filter(e => new Date(e.date) >= weekAgo);
  const sleep = getLS<SleepEntry[]>(LS_KEYS.SLEEP_LOG, []).filter(e => new Date(e.date) >= weekAgo);
  const exercise = getLS<ExerciseEntry[]>(LS_KEYS.EXERCISE_LOG, []).filter(e => new Date(e.date) >= weekAgo);
  const hydration = getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []).filter(e => new Date(e.date) >= weekAgo);

  const totalCal = calories.reduce((s, e) => s + e.calories, 0);
  const avgCal = calories.length ? Math.round(totalCal / 7) : 0;
  const totalSleep = sleep.reduce((s, e) => s + e.hours, 0);
  const avgSleep = sleep.length ? (totalSleep / 7).toFixed(1) : '0';
  const totalExercise = exercise.reduce((s, e) => s + e.duration, 0);
  const totalWater = hydration.reduce((s, e) => s + e.cups, 0);

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
        message: `This week: ${avgCal} avg cal/day, ${avgSleep} hrs sleep/night, ${totalExercise} min exercise, ${totalWater} cups water.`,
        read: false,
      });
      localStorage.setItem(LS_KEYS.NOTIFICATIONS, JSON.stringify(existing));
      localStorage.setItem('th_weekly_summary_notified', weekKey);
    }
  }, []);

  const stats = [
    { label: 'Avg Daily Calories', value: `${avgCal} kcal`, icon: <Flame className="h-6 w-6 text-orange-500" />, detail: `${totalCal} total this week`, color: 'from-orange-500/10 to-amber-500/10' },
    { label: 'Avg Sleep', value: `${avgSleep} hrs/night`, icon: <Moon className="h-6 w-6 text-indigo-500" />, detail: `${totalSleep.toFixed(1)} hrs total`, color: 'from-indigo-500/10 to-purple-500/10' },
    { label: 'Total Exercise', value: `${totalExercise} min`, icon: <Dumbbell className="h-6 w-6 text-green-500" />, detail: `${exercise.length} sessions`, color: 'from-green-500/10 to-emerald-500/10' },
    { label: 'Total Water', value: `${totalWater} cups`, icon: <Droplet className="h-6 w-6 text-blue-500" />, detail: `Avg ${(totalWater / 7).toFixed(1)} cups/day`, color: 'from-blue-500/10 to-cyan-500/10' },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <CalendarCheck className="h-6 w-6 text-primary" />
            </motion.span>
            Weekly Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalCal === 0 && totalSleep === 0 && totalExercise === 0 && totalWater === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <TrendingUp className="h-12 w-12 mx-auto text-primary/30" />
              </motion.div>
              <p className="text-muted-foreground mt-4">No data logged this week. Start tracking in the Progress page!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((s, idx) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                  className={`p-5 rounded-xl bg-gradient-to-br ${s.color} border hover:shadow-md transition-all`}>
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>{s.icon}</motion.div>
                    <span className="font-medium text-sm">{s.label}</span>
                  </div>
                  <div className="text-3xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.detail}</div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklySummary;
