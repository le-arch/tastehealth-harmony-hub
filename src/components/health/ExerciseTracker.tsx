import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, Plus, Trash2, MapPin, Footprints, Play, Square, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, ExerciseEntry, MotionSession } from '@/utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const exerciseTypes = ['Walking', 'Running', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'HIIT', 'Other'];

// Haversine distance in meters
const distanceM = (a: GeolocationCoordinates, b: GeolocationCoordinates) => {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
};

const ExerciseTracker: React.FC = () => {
  const [entries, setEntries] = useState<ExerciseEntry[]>(getLS(LS_KEYS.EXERCISE_LOG, []));
  const [sessions, setSessions] = useState<MotionSession[]>(getLS(LS_KEYS.MOTION_SESSIONS, []));
  const [type, setType] = useState('Walking');
  const [duration, setDuration] = useState('30');
  const [caloriesBurned, setCaloriesBurned] = useState('200');

  // Live tracking state
  const [tracking, setTracking] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0); // meters
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [sensorError, setSensorError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const lastCoordRef = useRef<GeolocationCoordinates | null>(null);
  const startCoordRef = useRef<GeolocationCoordinates | null>(null);
  const tickRef = useRef<number | null>(null);
  const motionHandlerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);
  const lastStepRef = useRef<number>(0);

  const save = (updated: ExerciseEntry[]) => { setEntries(updated); setLS(LS_KEYS.EXERCISE_LOG, updated); };
  const saveSessions = (next: MotionSession[]) => { setSessions(next); setLS(LS_KEYS.MOTION_SESSIONS, next); };

  const handleAdd = () => {
    const dur = parseInt(duration);
    const cal = parseInt(caloriesBurned);
    if (!dur || dur <= 0) { toast.error('Enter valid duration'); return; }
    const entry: ExerciseEntry = { id: crypto.randomUUID(), date: new Date().toISOString(), type, duration: dur, calories_burned: cal || 0 };
    save([entry, ...entries]);
    toast.success(`${type} for ${dur} min logged!`);
    setDuration('30'); setCaloriesBurned('200');
  };

  const handleDelete = (id: string) => save(entries.filter(e => e.id !== id));

  // ----- Live tracking -----
  const startTracking = async () => {
    setSensorError(null);
    if (!('geolocation' in navigator)) {
      setSensorError('Geolocation not supported in this browser.');
      return;
    }

    // iOS permission for motion
    try {
      const anyEvent = (window as any).DeviceMotionEvent;
      if (typeof anyEvent?.requestPermission === 'function') {
        const perm = await anyEvent.requestPermission();
        if (perm !== 'granted') setSensorError('Motion sensor permission denied — distance still tracked via GPS.');
      }
    } catch { /* ignore */ }

    setSteps(0); setDistance(0); setElapsed(0);
    lastCoordRef.current = null; startCoordRef.current = null;
    const start = Date.now();
    setStartedAt(start);
    setTracking(true);

    // Geolocation watch
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const c = pos.coords;
        setCoords({ lat: c.latitude, lng: c.longitude });
        if (!startCoordRef.current) startCoordRef.current = c;
        if (lastCoordRef.current) {
          const d = distanceM(lastCoordRef.current, c);
          if (d > 2 && d < 200) setDistance(prev => prev + d); // ignore noise + jumps
        }
        lastCoordRef.current = c;
      },
      (err) => setSensorError(err.message || 'Geolocation error'),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );

    // DeviceMotion accelerometer step counting (very simple peak detection)
    if ('DeviceMotionEvent' in window) {
      const onMotion = (e: DeviceMotionEvent) => {
        const a = e.accelerationIncludingGravity || e.acceleration;
        if (!a) return;
        const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2);
        // Step heuristic: spike > 12 m/s^2 with > 300ms cooldown
        const now = Date.now();
        if (mag > 12 && now - lastStepRef.current > 300) {
          lastStepRef.current = now;
          setSteps(s => s + 1);
        }
      };
      motionHandlerRef.current = onMotion;
      window.addEventListener('devicemotion', onMotion);
    }

    tickRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    if (motionHandlerRef.current) window.removeEventListener('devicemotion', motionHandlerRef.current);
    watchIdRef.current = null; tickRef.current = null; motionHandlerRef.current = null;

    const durationMin = Math.max(1, Math.round(elapsed / 60));
    const distanceKm = distance / 1000;
    const speedKmh = elapsed > 0 ? (distanceKm / (elapsed / 3600)) : 0;

    // Rough calorie estimate: MET-based
    const metMap: Record<string, number> = { Walking: 3.8, Running: 9.8, Cycling: 7.5, Swimming: 8.0, 'Weight Training': 6, Yoga: 3, HIIT: 10, Other: 5 };
    const met = metMap[type] || 5;
    const weightKg = 70; // fallback
    const calories = Math.round(met * weightKg * (elapsed / 3600));

    const session: MotionSession = {
      id: crypto.randomUUID(),
      date: new Date(startedAt || Date.now()).toISOString(),
      type, duration: durationMin,
      steps: steps || undefined,
      distance_m: Math.round(distance),
      avg_speed_kmh: Math.round(speedKmh * 10) / 10,
      start_lat: startCoordRef.current?.latitude,
      start_lng: startCoordRef.current?.longitude,
      end_lat: lastCoordRef.current?.latitude,
      end_lng: lastCoordRef.current?.longitude,
      calories_burned: calories,
    };
    saveSessions([session, ...sessions]);

    // Also log into the main exercise log so it shows up everywhere else
    const exEntry: ExerciseEntry = { id: crypto.randomUUID(), date: session.date, type, duration: durationMin, calories_burned: calories };
    save([exEntry, ...entries]);

    toast.success(`Activity saved: ${durationMin} min · ${(distanceKm).toFixed(2)} km${steps ? ` · ${steps} steps` : ''}`);

    setTracking(false);
    setStartedAt(null);
  };

  useEffect(() => () => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    if (motionHandlerRef.current) window.removeEventListener('devicemotion', motionHandlerRef.current);
  }, []);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const total = entries.filter(e => new Date(e.date).toDateString() === dayStr).reduce((s, e) => s + e.duration, 0);
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), minutes: total };
  });

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Dumbbell className="h-5 w-5 text-green-500" />Exercise Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="manual">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="manual">Manual log</TabsTrigger>
            <TabsTrigger value="live">📍 Live tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-3 mt-4">
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
          </TabsContent>

          <TabsContent value="live" className="space-y-3 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><Label>Activity</Label>
                <Select value={type} onValueChange={setType} disabled={tracking}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{exerciseTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                {!tracking
                  ? <Button onClick={startTracking} className="w-full bg-green-600 hover:bg-green-700"><Play className="h-4 w-4 mr-1" />Start</Button>
                  : <Button onClick={stopTracking} variant="destructive" className="w-full"><Square className="h-4 w-4 mr-1" />Stop & save</Button>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-xl font-bold font-mono">{fmtTime(elapsed)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><MapPin className="h-3 w-3" />Distance</p>
                <p className="text-xl font-bold">{(distance / 1000).toFixed(2)} <span className="text-xs">km</span></p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Footprints className="h-3 w-3" />Steps</p>
                <p className="text-xl font-bold">{steps}</p>
              </div>
            </div>

            {coords && (
              <p className="text-xs text-muted-foreground text-center">
                📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </p>
            )}

            {sensorError && (
              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 dark:bg-amber-950/30 p-2 rounded">
                <AlertCircle className="h-4 w-4 mt-0.5" />{sensorError}
              </div>
            )}

            {sessions.length > 0 && (
              <div className="space-y-1 pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground">Recent live sessions</p>
                {sessions.slice(0, 4).map(s => (
                  <div key={s.id} className="flex items-center justify-between text-xs p-2 border rounded">
                    <div>
                      <span className="font-medium">{s.type}</span>
                      <span className="text-muted-foreground ml-2">{s.duration} min</span>
                      {s.distance_m !== undefined && <span className="text-muted-foreground ml-2">{(s.distance_m / 1000).toFixed(2)} km</span>}
                      {s.steps && <span className="text-muted-foreground ml-2">· {s.steps} steps</span>}
                    </div>
                    <span className="text-muted-foreground">{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {last7.some(d => d.minutes > 0) && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {entries.slice(0, 5).map(e => (
          <div key={e.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <span className="font-medium">{e.type}</span>
              <span className="text-sm text-muted-foreground ml-2">{e.duration} min</span>
              {e.calories_burned > 0 && <span className="text-xs text-muted-foreground ml-2">({e.calories_burned} kcal)</span>}
              <span className="text-xs text-muted-foreground ml-2">{new Date(e.date).toLocaleDateString()}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExerciseTracker;
