
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Flame, Moon, Dumbbell, Droplet } from "lucide-react";
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

  const stats = [
    { label: 'Avg Daily Calories', value: `${avgCal} kcal`, icon: <Flame className="h-5 w-5 text-orange-500" />, detail: `${totalCal} total this week` },
    { label: 'Avg Sleep', value: `${avgSleep} hrs/night`, icon: <Moon className="h-5 w-5 text-indigo-500" />, detail: `${totalSleep.toFixed(1)} hrs total` },
    { label: 'Total Exercise', value: `${totalExercise} min`, icon: <Dumbbell className="h-5 w-5 text-green-500" />, detail: `${exercise.length} sessions` },
    { label: 'Total Water', value: `${totalWater} cups`, icon: <Droplet className="h-5 w-5 text-blue-500" />, detail: `Avg ${(totalWater / 7).toFixed(1)} cups/day` },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-primary" />Weekly Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {totalCal === 0 && totalSleep === 0 && totalExercise === 0 && totalWater === 0 ? (
            <p className="text-muted-foreground text-center py-4">No data logged this week. Start tracking in the Progress page!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map(s => (
                <div key={s.label} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">{s.icon}<span className="font-medium text-sm">{s.label}</span></div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.detail}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklySummary;
