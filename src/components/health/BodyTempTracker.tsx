import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Thermometer, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, BodyTempEntry } from '@/utils/localStorage';

const tempStatus = (c: number) => {
  if (c < 35) return { label: 'Hypothermia', color: 'text-blue-600' };
  if (c < 36) return { label: 'Low', color: 'text-blue-400' };
  if (c <= 37.4) return { label: 'Normal', color: 'text-green-500' };
  if (c <= 38) return { label: 'Low-grade fever', color: 'text-amber-500' };
  if (c <= 39.5) return { label: 'Fever', color: 'text-orange-500' };
  return { label: 'High fever', color: 'text-red-600' };
};

const BodyTempTracker: React.FC = () => {
  const [entries, setEntries] = useState<BodyTempEntry[]>(getLS(LS_KEYS.BODY_TEMP_LOG, []));
  const [celsius, setCelsius] = useState('36.6');
  const [scanning, setScanning] = useState(false);

  const save = (next: BodyTempEntry[]) => { setEntries(next); setLS(LS_KEYS.BODY_TEMP_LOG, next); };

  const handleAdd = (source: 'manual' | 'simulated' = 'manual', value?: number) => {
    const v = value ?? parseFloat(celsius);
    if (!v || v < 30 || v > 45) { toast.error('Enter a temperature between 30–45 °C'); return; }
    const entry: BodyTempEntry = { id: crypto.randomUUID(), date: new Date().toISOString(), celsius: Math.round(v * 10) / 10, source };
    save([entry, ...entries]);
    toast.success(`Body temp ${entry.celsius} °C logged`);
  };

  const simulate = () => {
    setScanning(true);
    setTimeout(() => {
      const base = entries.length ? entries[0].celsius : 36.6;
      const v = base + (Math.random() - 0.5) * 0.6;
      setScanning(false);
      handleAdd('simulated', v);
    }, 1800);
  };

  const handleDelete = (id: string) => save(entries.filter(e => e.id !== id));

  const status = tempStatus(parseFloat(celsius) || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Thermometer className="h-5 w-5 text-orange-500" />Body Temperature</CardTitle>
        <CardDescription className="text-xs">
          Phone browsers don't expose body-temperature sensors. Log readings from a thermometer / wearable, or use the simulated reading.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <Label>Temperature (°C)</Label>
            <Input type="number" step="0.1" value={celsius} onChange={e => setCelsius(e.target.value)} />
            <p className={`text-xs mt-1 ${status.color}`}>{status.label}</p>
          </div>
          <Button onClick={() => handleAdd('manual')}><Plus className="h-4 w-4 mr-1" />Log</Button>
        </div>

        <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-900/40" onClick={simulate} disabled={scanning}>
          {scanning ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Reading…</> : <><Thermometer className="h-4 w-4 mr-2" />Simulated reading</>}
        </Button>

        {entries.slice(0, 6).map(e => {
          const s = tempStatus(e.celsius);
          return (
            <div key={e.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-medium">{e.celsius} °C</span>
                <span className={`text-xs ml-2 ${s.color}`}>{s.label}</span>
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

export default BodyTempTracker;
