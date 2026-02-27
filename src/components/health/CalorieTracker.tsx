
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, CalorieEntry } from '@/utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CalorieTracker = () => {
  const [entries, setEntries] = useState<CalorieEntry[]>(getLS(LS_KEYS.CALORIE_LOG, []));
  const [calories, setCalories] = useState('');
  const [meal, setMeal] = useState('breakfast');
  const [notes, setNotes] = useState('');

  const save = (updated: CalorieEntry[]) => { setEntries(updated); setLS(LS_KEYS.CALORIE_LOG, updated); };

  const handleAdd = () => {
    if (!calories || parseInt(calories) <= 0) { toast.error("Enter valid calories"); return; }
    const entry: CalorieEntry = { id: crypto.randomUUID(), date: new Date().toISOString(), calories: parseInt(calories), meal, notes };
    save([entry, ...entries]);
    toast.success(`${calories} kcal added for ${meal}!`);
    setCalories(''); setNotes('');
  };

  const handleDelete = (id: string) => { save(entries.filter(e => e.id !== id)); toast.success("Entry removed"); };

  const today = new Date().toDateString();
  const todayEntries = entries.filter(e => new Date(e.date).toDateString() === today);
  const todayTotal = todayEntries.reduce((s, e) => s + e.calories, 0);

  // Last 7 days chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const total = entries.filter(e => new Date(e.date).toDateString() === dayStr).reduce((s, e) => s + e.calories, 0);
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), calories: total };
  });

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5 text-orange-500" />Calorie Tracker</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
          <div className="text-3xl font-bold text-orange-600">{todayTotal}</div>
          <div className="text-sm text-muted-foreground">kcal today</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div><Label>Calories</Label><Input type="number" placeholder="e.g. 450" value={calories} onChange={e => setCalories(e.target.value)} /></div>
          <div><Label>Meal</Label>
            <Select value={meal} onValueChange={setMeal}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Notes</Label><Input placeholder="Optional" value={notes} onChange={e => setNotes(e.target.value)} /></div>
        </div>
        <Button onClick={handleAdd} className="w-full"><Plus className="h-4 w-4 mr-1" />Add Entry</Button>

        {last7.some(d => d.calories > 0) && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4,4,0,0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {todayEntries.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Today's Entries</h4>
            {todayEntries.map(e => (
              <div key={e.id} className="flex items-center justify-between p-2 border rounded">
                <div><span className="font-medium">{e.calories} kcal</span><span className="text-sm text-muted-foreground ml-2 capitalize">{e.meal}</span>{e.notes && <span className="text-xs text-muted-foreground ml-2">- {e.notes}</span>}</div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalorieTracker;
