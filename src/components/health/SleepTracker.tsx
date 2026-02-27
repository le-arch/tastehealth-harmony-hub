
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Moon, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, SleepEntry } from '@/utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SleepTracker = () => {
  const [entries, setEntries] = useState<SleepEntry[]>(getLS(LS_KEYS.SLEEP_LOG, []));
  const [hours, setHours] = useState('7');
  const [quality, setQuality] = useState(3);

  const save = (updated: SleepEntry[]) => { setEntries(updated); setLS(LS_KEYS.SLEEP_LOG, updated); };

  const handleAdd = () => {
    const h = parseFloat(hours);
    if (!h || h <= 0 || h > 24) { toast.error("Enter valid hours (1-24)"); return; }
    const entry: SleepEntry = { id: crypto.randomUUID(), date: new Date().toISOString(), hours: h, quality };
    save([entry, ...entries]);
    toast.success(`${h} hours of sleep logged!`);
    setHours('7'); setQuality(3);
  };

  const handleDelete = (id: string) => { save(entries.filter(e => e.id !== id)); };

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const dayEntries = entries.filter(e => new Date(e.date).toDateString() === dayStr);
    const total = dayEntries.reduce((s, e) => s + e.hours, 0);
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), hours: total };
  });

  const qualityLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Moon className="h-5 w-5 text-indigo-500" />Sleep Tracker</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label>Hours Slept</Label><Input type="number" step="0.5" min="0" max="24" value={hours} onChange={e => setHours(e.target.value)} /></div>
          <div><Label>Quality: {qualityLabels[quality]}</Label><Slider value={[quality]} min={1} max={5} step={1} onValueChange={v => setQuality(v[0])} className="mt-2" /></div>
        </div>
        <Button onClick={handleAdd} className="w-full"><Plus className="h-4 w-4 mr-1" />Log Sleep</Button>

        {last7.some(d => d.hours > 0) && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4,4,0,0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {entries.slice(0, 5).map(e => (
          <div key={e.id} className="flex items-center justify-between p-2 border rounded">
            <div><span className="font-medium">{e.hours}h</span><span className="text-sm text-muted-foreground ml-2">{qualityLabels[e.quality]}</span><span className="text-xs text-muted-foreground ml-2">{new Date(e.date).toLocaleDateString()}</span></div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SleepTracker;
