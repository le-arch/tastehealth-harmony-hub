
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Flame, Moon, Dumbbell, Droplet } from 'lucide-react';
import { getLS, LS_KEYS, CalorieEntry, SleepEntry, ExerciseEntry, HydrationEntry } from '@/utils/localStorage';

const CircularProgress = ({ value, max, color, size = 80, strokeWidth = 8 }: { value: number; max: number; color: string; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700 ease-out" />
    </svg>
  );
};

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
    { label: 'Calories', value: totalCal, target: 2000, unit: 'kcal', icon: <Flame className="h-4 w-4 text-orange-500" />, color: '#f97316' },
    { label: 'Sleep', value: totalSleep, target: 8, unit: 'hrs', icon: <Moon className="h-4 w-4 text-indigo-500" />, color: '#6366f1' },
    { label: 'Exercise', value: totalExercise, target: 60, unit: 'min', icon: <Dumbbell className="h-4 w-4 text-green-500" />, color: '#22c55e' },
    { label: 'Water', value: cups, target: 8, unit: 'cups', icon: <Droplet className="h-4 w-4 text-blue-500" />, color: '#3b82f6' },
  ];

  return (
    <Card className="w-full mb-6">
      <CardHeader><CardTitle className="flex items-center"><Activity className="mr-2" />Today's Progress</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {metrics.map(m => (
            <div key={m.label} className="flex flex-col items-center gap-2">
              <div className="relative">
                <CircularProgress value={m.value} max={m.target} color={m.color} size={90} strokeWidth={8} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold">{Math.round(Math.min((m.value / m.target) * 100, 100))}%</span>
                </div>
              </div>
              <div className="flex items-center gap-1">{m.icon}<span className="text-xs font-medium">{m.label}</span></div>
              <span className="text-xs text-muted-foreground">{m.value}/{m.target} {m.unit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
