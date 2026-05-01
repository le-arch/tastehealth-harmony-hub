import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Plus, Trash2, Activity, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, HeartRateEntry } from '@/utils/localStorage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const zoneFor = (bpm: number) => {
  if (bpm < 60) return { label: 'Resting (low)', color: 'text-blue-500' };
  if (bpm <= 100) return { label: 'Resting / Normal', color: 'text-green-500' };
  if (bpm <= 140) return { label: 'Fat burn / Cardio', color: 'text-orange-500' };
  if (bpm <= 170) return { label: 'Cardio / Peak', color: 'text-red-500' };
  return { label: 'Peak / Max', color: 'text-red-700' };
};

const HeartRateTracker: React.FC = () => {
  const [entries, setEntries] = useState<HeartRateEntry[]>(getLS(LS_KEYS.HEART_RATE_LOG, []));
  const [bpm, setBpm] = useState('72');
  const [scanning, setScanning] = useState(false);
  const [pulse, setPulse] = useState(false);

  const save = (next: HeartRateEntry[]) => { setEntries(next); setLS(LS_KEYS.HEART_RATE_LOG, next); };

  const handleAdd = (source: 'manual' | 'simulated' = 'manual', value?: number) => {
    const v = value ?? parseInt(bpm);
    if (!v || v < 30 || v > 220) { toast.error('Enter a heart rate between 30–220 bpm'); return; }
    const entry: HeartRateEntry = { id: crypto.randomUUID(), date: new Date().toISOString(), bpm: v, source };
    save([entry, ...entries]);
    toast.success(`Heart rate ${v} bpm logged`);
  };

  // Simulated PPG-style "scan" — in browsers we cannot read PPG/ECG, so we
  // animate a pulse and produce a plausible reading based on recent history.
  const simulateScan = () => {
    setScanning(true);
    setPulse(true);
    setTimeout(() => {
      const baseline = entries.length > 0
        ? Math.round(entries.slice(0, 5).reduce((s, e) => s + e.bpm, 0) / Math.min(entries.length, 5))
        : 72;
      const reading = baseline + Math.round((Math.random() - 0.5) * 14);
      setScanning(false);
      setPulse(false);
      handleAdd('simulated', Math.max(50, Math.min(160, reading)));
    }, 2200);
  };

  const handleDelete = (id: string) => save(entries.filter(e => e.id !== id));

  const last20 = [...entries].slice(0, 20).reverse().map((e, i) => ({
    idx: i + 1, bpm: e.bpm,
  }));

  const avg = entries.length > 0 ? Math.round(entries.reduce((s, e) => s + e.bpm, 0) / entries.length) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-red-500 fill-red-200" />Heart Rate</CardTitle>
        <CardDescription className="text-xs">
          Browsers can't read PPG/ECG sensors directly. Use the scan button for a guided simulated reading, or log a measurement manually from a wearable / pulse oximeter.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <motion.div
            animate={pulse ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.7, repeat: pulse ? Infinity : 0 }}
            className="relative w-28 h-28 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center"
          >
            <Heart className="h-14 w-14 text-red-500 fill-red-400" />
            {scanning && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-500/40"
                animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <Label>BPM</Label>
            <Input type="number" min={30} max={220} value={bpm} onChange={e => setBpm(e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">{zoneFor(parseInt(bpm) || 0).label}</p>
          </div>
          <Button onClick={() => handleAdd('manual')}><Plus className="h-4 w-4 mr-1" />Log</Button>
        </div>

        <Button
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30"
          onClick={simulateScan}
          disabled={scanning}
        >
          {scanning
            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Scanning…</>
            : <><Activity className="h-4 w-4 mr-2" />Take reading (simulated PPG)</>}
        </Button>

        {entries.length > 0 && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-muted/50 p-2"><p className="text-xs text-muted-foreground">Latest</p><p className="text-lg font-bold text-red-500">{entries[0].bpm}</p></div>
            <div className="rounded-lg bg-muted/50 p-2"><p className="text-xs text-muted-foreground">Average</p><p className="text-lg font-bold">{avg}</p></div>
            <div className="rounded-lg bg-muted/50 p-2"><p className="text-xs text-muted-foreground">Readings</p><p className="text-lg font-bold">{entries.length}</p></div>
          </div>
        )}

        {last20.length >= 2 && (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last20}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="idx" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip />
                <Line type="monotone" dataKey="bpm" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {entries.slice(0, 5).map(e => (
          <div key={e.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <span className="font-medium">{e.bpm} bpm</span>
              <span className={`text-xs ml-2 ${zoneFor(e.bpm).color}`}>{zoneFor(e.bpm).label}</span>
              <span className="text-xs text-muted-foreground ml-2">{new Date(e.date).toLocaleString()}</span>
              {e.source === 'simulated' && <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">sim</span>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default HeartRateTracker;
