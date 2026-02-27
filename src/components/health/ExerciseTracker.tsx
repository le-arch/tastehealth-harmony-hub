
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, ExerciseEntry } from '@/utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const exerciseTypes = ['Walking', 'Running', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'HIIT', 'Other'];

const ExerciseTracker = () => {
  const [entries, setEntries] = useState<ExerciseEntry[]>(getLS(LS_KEYS.EXERCISE_LOG, []));
  const [type, setType] = useState('Walking');
  const [duration, setDuration] = useState('30');
  const [caloriesBurned, setCaloriesBurned] = useState('200');

  const save = (updated: ExerciseEntry[]) => { setEntries(updated); setLS(LS_KEYS.EXERCISE_LOG, updated); };

  const handleAdd = () => {
    const dur = parseInt(duration);
    const cal = parseInt(caloriesBurned);
    if (!dur || dur <= 0) { toast.error("Enter valid duration"); return; }
    const entry: ExerciseEntry = { id: crypto.randomUUID(), date: new Date().toISOString(), type, duration: dur, calories_burned: cal || 0 };
    save([entry, ...entries]);
    toast.success(`${type} for ${dur} min logged!`);
    setDuration('30'); setCaloriesBurned('200');
  };

  const handleDelete = (id: string) => { save(entries.filter(e => e.id !== id)); };

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const total = entries.filter(e => new Date(e.date).toDateString() === dayStr).reduce((s, e) => s + e.duration, 0);
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), minutes: total };
  });

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Dumbbell className="h-5 w-5 text-green-500" />Exercise Tracker</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div><Label>Exercise Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{exerciseTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Duration (min)</Label><Input type="number" value={duration} onChange={e => setDuration(e.target.value)} /></div>
          <div><Label>Calories Burned</Label><Input type="number" value={caloriesBurned} onChange={e => setCaloriesBurned(e.target.value)} /></div>
        </div>
        <Button onClick={handleAdd} className="w-full"><Plus className="h-4 w-4 mr-1" />Log Exercise</Button>

        {last7.some(d => d.minutes > 0) && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4,4,0,0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {entries.slice(0, 5).map(e => (
          <div key={e.id} className="flex items-center justify-between p-2 border rounded">
            <div><span className="font-medium">{e.type}</span><span className="text-sm text-muted-foreground ml-2">{e.duration} min</span>{e.calories_burned > 0 && <span className="text-xs text-muted-foreground ml-2">({e.calories_burned} kcal)</span>}<span className="text-xs text-muted-foreground ml-2">{new Date(e.date).toLocaleDateString()}</span></div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExerciseTracker;
