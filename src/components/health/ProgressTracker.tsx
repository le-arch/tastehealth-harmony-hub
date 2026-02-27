
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Flame, Moon, Dumbbell, Droplet } from 'lucide-react';
import { getLS, LS_KEYS, CalorieEntry, SleepEntry, ExerciseEntry, HydrationEntry } from '@/utils/localStorage';

const ProgressTracker = () => {
  const today = new Date().toDateString();
  const calories = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []).filter(e => new Date(e.date).toDateString() === today);
  const sleep = getLS<SleepEntry[]>(LS_KEYS.SLEEP_LOG, []).filter(e => new Date(e.date).toDateString() === today);
  const exercise = getLS<ExerciseEntry[]>(LS_KEYS.EXERCISE_LOG, []).filter(e => new Date(e.date).toDateString() === today);
  const hydration = getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []).find(e => new Date(e.date).toDateString() === today);

  const totalCal = calories.reduce((s, e) => s + e.calories, 0);
  const totalSleep = sleep.reduce((s, e) => s + e.hours, 0);
  const totalExercise = exercise.reduce((s, e) => s + e.duration, 0);
  const cups = hydration?.cups || 0;

  const metrics = [
    { label: 'Calories', value: totalCal, target: 2000, unit: 'kcal', icon: <Flame className="h-4 w-4 text-orange-500" /> },
    { label: 'Sleep', value: totalSleep, target: 8, unit: 'hrs', icon: <Moon className="h-4 w-4 text-indigo-500" /> },
    { label: 'Exercise', value: totalExercise, target: 60, unit: 'min', icon: <Dumbbell className="h-4 w-4 text-green-500" /> },
    { label: 'Water', value: cups, target: 8, unit: 'cups', icon: <Droplet className="h-4 w-4 text-blue-500" /> },
  ];

  return (
    <Card className="w-full mb-6">
      <CardHeader><CardTitle className="flex items-center"><Activity className="mr-2" />Today's Progress</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {metrics.map(m => (
          <div key={m.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">{m.icon}<span className="font-medium">{m.label}</span></div>
              <span className="text-muted-foreground">{m.value} / {m.target} {m.unit}</span>
            </div>
            <Progress value={Math.min((m.value / m.target) * 100, 100)} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
