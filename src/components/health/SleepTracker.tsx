import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Moon, Plus, Trash2, Sun, BedDouble, Coffee } from 'lucide-react';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, SleepEntry } from '@/utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const qualityLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

// Compute hours from HH:MM strings, allowing overnight wraps
const computeHours = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60; // wrap past midnight
  return Math.round((mins / 60) * 10) / 10;
};

const SleepTracker: React.FC = () => {
  const [entries, setEntries] = useState<SleepEntry[]>(getLS(LS_KEYS.SLEEP_LOG, []));
  const [kind, setKind] = useState<'full' | 'nap'>('full');
  const [start, setStart] = useState('22:30');
  const [end, setEnd] = useState('06:30');
  const [hours, setHours] = useState('7');
  const [quality, setQuality] = useState(3);
  const [useTiming, setUseTiming] = useState(true);

  const save = (updated: SleepEntry[]) => { setEntries(updated); setLS(LS_KEYS.SLEEP_LOG, updated); };

  const handleAdd = () => {
    let h: number;
    if (useTiming) {
      h = computeHours(start, end);
      if (h <= 0) { toast.error('End time must be after start time'); return; }
    } else {
      h = parseFloat(hours);
      if (!h || h <= 0 || h > 24) { toast.error('Enter valid hours (0–24)'); return; }
    }
    const entry: SleepEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      hours: h,
      quality,
      kind,
      start_time: useTiming ? start : undefined,
      end_time: useTiming ? end : undefined,
    };
    save([entry, ...entries]);
    toast.success(`${kind === 'nap' ? '💤 Nap' : '🌙 Sleep'} of ${h} h logged!`);
  };

  const handleDelete = (id: string) => save(entries.filter(e => e.id !== id));

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const dayEntries = entries.filter(e => new Date(e.date).toDateString() === dayStr);
    const fullSleep = dayEntries.filter(e => (e.kind ?? 'full') === 'full').reduce((s, e) => s + e.hours, 0);
    const naps = dayEntries.filter(e => e.kind === 'nap').reduce((s, e) => s + e.hours, 0);
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), sleep: Math.round(fullSleep * 10) / 10, naps: Math.round(naps * 10) / 10 };
  });

  // Stats
  const napHoursWeek = last7.reduce((s, d) => s + d.naps, 0);
  const sleepHoursWeek = last7.reduce((s, d) => s + d.sleep, 0);
  const avgFull = entries.filter(e => (e.kind ?? 'full') === 'full').slice(0, 7);
  const avgFullHrs = avgFull.length ? Math.round((avgFull.reduce((s, e) => s + e.hours, 0) / avgFull.length) * 10) / 10 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Moon className="h-5 w-5 text-indigo-500" />Sleep Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={kind} onValueChange={(v) => setKind(v as 'full' | 'nap')}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="full" className="gap-1"><BedDouble className="h-4 w-4" />Full sleep</TabsTrigger>
            <TabsTrigger value="nap" className="gap-1"><Coffee className="h-4 w-4" />Nap</TabsTrigger>
          </TabsList>
          <TabsContent value="full" />
          <TabsContent value="nap" />
        </Tabs>

        <div className="flex items-center gap-2">
          <Button size="sm" variant={useTiming ? 'default' : 'outline'} onClick={() => setUseTiming(true)}>Timing</Button>
          <Button size="sm" variant={!useTiming ? 'default' : 'outline'} onClick={() => setUseTiming(false)}>Hours</Button>
        </div>

        {useTiming ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="flex items-center gap-1"><Moon className="h-3 w-3" />{kind === 'nap' ? 'Started' : 'Bedtime'}</Label>
              <Input type="time" value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div>
              <Label className="flex items-center gap-1"><Sun className="h-3 w-3" />{kind === 'nap' ? 'Ended' : 'Wake up'}</Label>
              <Input type="time" value={end} onChange={e => setEnd(e.target.value)} />
            </div>
            <div className="col-span-2 text-xs text-muted-foreground">
              Duration: <span className="font-semibold text-foreground">{computeHours(start, end)} h</span>
            </div>
          </div>
        ) : (
          <div>
            <Label>Hours {kind === 'nap' ? 'napped' : 'slept'}</Label>
            <Input type="number" step="0.25" min="0" max="24" value={hours} onChange={e => setHours(e.target.value)} />
          </div>
        )}

        <div>
          <Label>Quality: {qualityLabels[quality]}</Label>
          <Slider value={[quality]} min={1} max={5} step={1} onValueChange={v => setQuality(v[0])} className="mt-2" />
        </div>

        <Button onClick={handleAdd} className="w-full"><Plus className="h-4 w-4 mr-1" />Log {kind === 'nap' ? 'Nap' : 'Sleep'}</Button>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/50 p-2"><p className="text-xs text-muted-foreground">Avg sleep (last 7)</p><p className="text-lg font-bold text-indigo-500">{avgFullHrs}h</p></div>
          <div className="rounded-lg bg-muted/50 p-2"><p className="text-xs text-muted-foreground">Sleep this week</p><p className="text-lg font-bold">{Math.round(sleepHoursWeek * 10) / 10}h</p></div>
          <div className="rounded-lg bg-muted/50 p-2"><p className="text-xs text-muted-foreground">Naps this week</p><p className="text-lg font-bold text-amber-500">{Math.round(napHoursWeek * 10) / 10}h</p></div>
        </div>

        {last7.some(d => d.sleep > 0 || d.naps > 0) && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="sleep" stackId="a" fill="#6366f1" name="Sleep" radius={[0, 0, 0, 0]} />
                <Bar dataKey="naps" stackId="a" fill="#f59e0b" name="Naps" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {entries.slice(0, 6).map(e => (
          <div key={e.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <span className="font-medium flex items-center gap-1">
                {e.kind === 'nap' ? <Coffee className="h-3 w-3 text-amber-500" /> : <Moon className="h-3 w-3 text-indigo-500" />}
                {e.hours}h
              </span>
              <span className="text-sm text-muted-foreground ml-1">{qualityLabels[e.quality]}</span>
              {e.start_time && e.end_time && <span className="text-xs text-muted-foreground ml-2">{e.start_time} → {e.end_time}</span>}
              <span className="text-xs text-muted-foreground ml-2">{new Date(e.date).toLocaleDateString()}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SleepTracker;
