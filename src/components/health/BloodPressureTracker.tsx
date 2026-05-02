import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, BloodPressureEntry } from '@/utils/localStorage';
import { motion } from 'framer-motion';
import { checkBloodPressure } from './VitalsAlerts';
import { VitalsHistory } from './VitalsHistory';

const categorize = (sys: number, dia: number) => {
  if (sys >= 180 || dia >= 120) return { label: 'Hypertensive crisis', color: 'text-red-700' };
  if (sys >= 140 || dia >= 90) return { label: 'Hypertension stage 2', color: 'text-red-600' };
  if (sys >= 130 || dia >= 80) return { label: 'Hypertension stage 1', color: 'text-orange-500' };
  if (sys >= 120) return { label: 'Elevated', color: 'text-amber-500' };
  if (sys < 90 || dia < 60) return { label: 'Low', color: 'text-blue-500' };
  return { label: 'Normal', color: 'text-green-500' };
};

const BloodPressureTracker: React.FC = () => {
  const [entries, setEntries] = useState<BloodPressureEntry[]>(getLS(LS_KEYS.BLOOD_PRESSURE_LOG, []));
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [pulse, setPulse] = useState('72');
  const [scanning, setScanning] = useState(false);

  const save = (next: BloodPressureEntry[]) => { setEntries(next); setLS(LS_KEYS.BLOOD_PRESSURE_LOG, next); };

  const handleAdd = (source: 'manual' | 'simulated' = 'manual', vals?: { sys: number; dia: number; p: number }) => {
    const sys = vals?.sys ?? parseInt(systolic);
    const dia = vals?.dia ?? parseInt(diastolic);
    const p = vals?.p ?? parseInt(pulse);
    if (!sys || !dia || sys < 60 || sys > 250 || dia < 30 || dia > 180) {
      toast.error('Enter realistic systolic (60–250) and diastolic (30–180) values');
      return;
    }
    const entry: BloodPressureEntry = { id: crypto.randomUUID(), date: new Date().toISOString(), systolic: sys, diastolic: dia, pulse: p || undefined, source };
    save([entry, ...entries]);
    toast.success(`BP ${sys}/${dia} logged`);
    checkBloodPressure(sys, dia, source);
  };

  const simulate = () => {
    setScanning(true);
    setTimeout(() => {
      const baseSys = entries.length ? Math.round(entries.slice(0, 5).reduce((s, e) => s + e.systolic, 0) / Math.min(entries.length, 5)) : 118;
      const baseDia = entries.length ? Math.round(entries.slice(0, 5).reduce((s, e) => s + e.diastolic, 0) / Math.min(entries.length, 5)) : 78;
      const sys = baseSys + Math.round((Math.random() - 0.5) * 12);
      const dia = baseDia + Math.round((Math.random() - 0.5) * 8);
      const p = 65 + Math.round(Math.random() * 25);
      setScanning(false);
      handleAdd('simulated', { sys, dia, p });
    }, 2200);
  };

  const handleDelete = (id: string) => save(entries.filter(e => e.id !== id));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-rose-500" />Blood Pressure</CardTitle>
        <CardDescription className="text-xs">
          Log systolic / diastolic from a real cuff or wearable. Simulated readings are derived from your recent history and shown for demo purposes only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div><Label className="text-xs">Systolic</Label><Input type="number" value={systolic} onChange={e => setSystolic(e.target.value)} /></div>
          <div><Label className="text-xs">Diastolic</Label><Input type="number" value={diastolic} onChange={e => setDiastolic(e.target.value)} /></div>
          <div><Label className="text-xs">Pulse</Label><Input type="number" value={pulse} onChange={e => setPulse(e.target.value)} /></div>
        </div>
        <p className={`text-xs ${categorize(parseInt(systolic) || 0, parseInt(diastolic) || 0).color}`}>
          {categorize(parseInt(systolic) || 0, parseInt(diastolic) || 0).label}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => handleAdd('manual')}><Plus className="h-4 w-4 mr-1" />Log</Button>
          <Button variant="outline" onClick={simulate} disabled={scanning} className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/40">
            {scanning
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Measuring…</>
              : <><Activity className="h-4 w-4 mr-2" />Simulated reading</>}
          </Button>
        </div>

        {scanning && (
          <motion.div className="h-1 bg-rose-200 rounded overflow-hidden" initial={{ opacity: 0.5 }}>
            <motion.div className="h-full bg-rose-500" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.2 }} />
          </motion.div>
        )}

        <VitalsHistory
          title="History"
          description="Filter by date range or search"
          entries={entries}
          getDate={e => e.date}
          getValue={e => e.systolic}
          getLabel={e => `${e.systolic}/${e.diastolic}${e.pulse ? ` · ♥${e.pulse}` : ''}`}
          unit="mmHg"
          color="#e11d48"
        />

        {entries.slice(0, 6).map(e => {
          const cat = categorize(e.systolic, e.diastolic);
          return (
            <div key={e.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-medium">{e.systolic}/{e.diastolic}</span>
                {e.pulse && <span className="text-xs text-muted-foreground ml-2">♥ {e.pulse}</span>}
                <span className={`text-xs ml-2 ${cat.color}`}>{cat.label}</span>
                <span className="text-xs text-muted-foreground ml-2">{new Date(e.date).toLocaleString()}</span>
                {e.source === 'simulated' && <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">sim</span>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BloodPressureTracker;
