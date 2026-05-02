import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dumbbell, Plus, Trash2, MapPin, Footprints, Play, Square, AlertCircle, Pause, Signal, SignalLow, SignalMedium, SignalHigh } from 'lucide-react';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, ExerciseEntry, MotionSession } from '@/utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

const exerciseTypes = ['Walking', 'Running', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'HIIT', 'Other'];

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

const RESUME_KEY = 'th_live_session_state';

const gpsQualityFromAccuracy = (acc: number | undefined) => {
  if (acc == null) return { label: 'Unknown', color: 'text-muted-foreground', Icon: Signal };
  if (acc <= 10) return { label: 'Excellent', color: 'text-green-600', Icon: SignalHigh };
  if (acc <= 25) return { label: 'Good', color: 'text-emerald-500', Icon: SignalMedium };
  if (acc <= 60) return { label: 'Fair', color: 'text-amber-500', Icon: SignalLow };
  return { label: 'Poor', color: 'text-red-500', Icon: SignalLow };
};

const ExerciseTracker: React.FC = () => {
  const { language } = useLanguage();
  const tt = language === 'fr'
    ? { manual: 'Saisie manuelle', live: '📍 Suivi en direct', start: 'Démarrer', stop: 'Arrêter et sauvegarder', pause: 'Pause', resume: 'Reprendre', activity: 'Activité', resumePrev: 'Reprendre la session précédente', gpsQuality: 'Qualité GPS', signalLost: 'Signal capteur perdu — la session continue, les données reprendront automatiquement.' }
    : { manual: 'Manual log', live: '📍 Live tracking', start: 'Start', stop: 'Stop & save', pause: 'Pause', resume: 'Resume', activity: 'Activity', resumePrev: 'Resume previous session', gpsQuality: 'GPS quality', signalLost: 'Sensor signal lost — session continues; data will resume automatically.' };

  const [entries, setEntries] = useState<ExerciseEntry[]>(getLS(LS_KEYS.EXERCISE_LOG, []));
  const [sessions, setSessions] = useState<MotionSession[]>(getLS(LS_KEYS.MOTION_SESSIONS, []));
  const [type, setType] = useState('Walking');
  const [duration, setDuration] = useState('30');
  const [caloriesBurned, setCaloriesBurned] = useState('200');

  const [tracking, setTracking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | undefined>(undefined);
  const [sensorError, setSensorError] = useState<string | null>(null);
  const [signalLost, setSignalLost] = useState(false);
  const [resumable, setResumable] = useState<any>(null);

  const watchIdRef = useRef<number | null>(null);
  const lastCoordRef = useRef<GeolocationCoordinates | null>(null);
  const startCoordRef = useRef<GeolocationCoordinates | null>(null);
  const tickRef = useRef<number | null>(null);
  const motionHandlerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);
  const lastStepRef = useRef<number>(0);
  const lastFixRef = useRef<number>(0);
  const signalCheckRef = useRef<number | null>(null);
  const persistRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const save = (updated: ExerciseEntry[]) => { setEntries(updated); setLS(LS_KEYS.EXERCISE_LOG, updated); };
  const saveSessions = (next: MotionSession[]) => { setSessions(next); setLS(LS_KEYS.MOTION_SESSIONS, next); };

  // Check for resumable session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESUME_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.startedAt && Date.now() - s.lastUpdate < 6 * 60 * 60 * 1000) {
          setResumable(s);
        } else {
          localStorage.removeItem(RESUME_KEY);
        }
      }
    } catch {}
  }, []);

  const persistState = () => {
    if (!startedAt) return;
    try {
      localStorage.setItem(RESUME_KEY, JSON.stringify({
        startedAt, elapsed, steps, distance, type, lastUpdate: Date.now(),
      }));
    } catch {}
  };

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

  const startTracking = async (resumeData?: any) => {
    setSensorError(null); setSignalLost(false);
    if (!('geolocation' in navigator)) { setSensorError('Geolocation not supported in this browser.'); return; }
    try {
      const anyEvent = (window as any).DeviceMotionEvent;
      if (typeof anyEvent?.requestPermission === 'function') {
        const perm = await anyEvent.requestPermission();
        if (perm !== 'granted') setSensorError('Motion sensor permission denied — distance still tracked via GPS.');
      }
    } catch {}

    if (resumeData) {
      setSteps(resumeData.steps || 0);
      setDistance(resumeData.distance || 0);
      setElapsed(resumeData.elapsed || 0);
      setType(resumeData.type || 'Walking');
      setStartedAt(Date.now() - (resumeData.elapsed || 0) * 1000);
      toast.success('Resumed your previous session');
    } else {
      setSteps(0); setDistance(0); setElapsed(0);
      setStartedAt(Date.now());
    }
    setResumable(null);
    lastCoordRef.current = null; startCoordRef.current = null;
    setTracking(true); setPaused(false); pausedRef.current = false;
    lastFixRef.current = Date.now();

    const startStamp = resumeData ? Date.now() - (resumeData.elapsed || 0) * 1000 : Date.now();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        if (pausedRef.current) return;
        const c = pos.coords;
        setCoords({ lat: c.latitude, lng: c.longitude });
        setAccuracy(c.accuracy);
        lastFixRef.current = Date.now();
        setSignalLost(false);
        if (!startCoordRef.current) startCoordRef.current = c;
        // Reject very low accuracy fixes for distance accumulation
        if (c.accuracy && c.accuracy > 60) { lastCoordRef.current = c; return; }
        if (lastCoordRef.current) {
          const d = distanceM(lastCoordRef.current, c);
          if (d > 2 && d < 200) setDistance(prev => prev + d);
        }
        lastCoordRef.current = c;
      },
      (err) => {
        setSensorError(err.message || 'Geolocation error');
        setSignalLost(true);
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 }
    );

    if ('DeviceMotionEvent' in window) {
      const onMotion = (e: DeviceMotionEvent) => {
        if (pausedRef.current) return;
        const a = e.accelerationIncludingGravity || e.acceleration;
        if (!a) return;
        const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2);
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
      if (!pausedRef.current) setElapsed(Math.floor((Date.now() - startStamp) / 1000));
    }, 1000);

    // Signal-loss watchdog: warn if no GPS fix for 15s during tracking
    signalCheckRef.current = window.setInterval(() => {
      if (!pausedRef.current && Date.now() - lastFixRef.current > 15000) {
        setSignalLost(true);
      }
    }, 5000);

    // Periodically persist state for resume
    persistRef.current = window.setInterval(persistState, 5000);
  };

  const pauseTracking = () => { setPaused(true); pausedRef.current = true; toast.message('Session paused'); };
  const resumeTracking = () => { setPaused(false); pausedRef.current = false; lastFixRef.current = Date.now(); toast.success('Session resumed'); };

  const cleanupRefs = () => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    if (signalCheckRef.current) clearInterval(signalCheckRef.current);
    if (persistRef.current) clearInterval(persistRef.current);
    if (motionHandlerRef.current) window.removeEventListener('devicemotion', motionHandlerRef.current);
    watchIdRef.current = null; tickRef.current = null; signalCheckRef.current = null; persistRef.current = null; motionHandlerRef.current = null;
  };

  const stopTracking = () => {
    cleanupRefs();
    const durationMin = Math.max(1, Math.round(elapsed / 60));
    const distanceKm = distance / 1000;
    const speedKmh = elapsed > 0 ? (distanceKm / (elapsed / 3600)) : 0;
    const metMap: Record<string, number> = { Walking: 3.8, Running: 9.8, Cycling: 7.5, Swimming: 8.0, 'Weight Training': 6, Yoga: 3, HIIT: 10, Other: 5 };
    const met = metMap[type] || 5;
    const calories = Math.round(met * 70 * (elapsed / 3600));

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
    save([{ id: crypto.randomUUID(), date: session.date, type, duration: durationMin, calories_burned: calories }, ...entries]);

    toast.success(`Activity saved: ${durationMin} min · ${distanceKm.toFixed(2)} km${steps ? ` · ${steps} steps` : ''}`);
    localStorage.removeItem(RESUME_KEY);
    setTracking(false); setPaused(false); pausedRef.current = false;
    setStartedAt(null);
  };

  useEffect(() => () => cleanupRefs(), []);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const total = entries.filter(e => new Date(e.date).toDateString() === dayStr).reduce((s, e) => s + e.duration, 0);
    return { day: d.toLocaleDateString(language === 'fr' ? 'fr' : 'en', { weekday: 'short' }), minutes: total };
  });

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const gps = gpsQualityFromAccuracy(accuracy);
  const GpsIcon = gps.Icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Dumbbell className="h-5 w-5 text-green-500" />Exercise Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="manual">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="manual">{tt.manual}</TabsTrigger>
            <TabsTrigger value="live">{tt.live}</TabsTrigger>
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
            {resumable && !tracking && (
              <div className="flex items-center justify-between gap-2 p-3 border rounded bg-blue-50 dark:bg-blue-950/30">
                <div className="text-xs">
                  <p className="font-semibold">{tt.resumePrev}</p>
                  <p className="text-muted-foreground">{resumable.type} · {fmtTime(resumable.elapsed)} · {(resumable.distance / 1000).toFixed(2)} km</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => startTracking(resumable)}><Play className="h-3 w-3 mr-1" />{tt.resume}</Button>
                  <Button size="sm" variant="ghost" onClick={() => { localStorage.removeItem(RESUME_KEY); setResumable(null); }}>×</Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><Label>{tt.activity}</Label>
                <Select value={type} onValueChange={setType} disabled={tracking}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{exerciseTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                {!tracking ? (
                  <Button onClick={() => startTracking()} className="w-full bg-green-600 hover:bg-green-700"><Play className="h-4 w-4 mr-1" />{tt.start}</Button>
                ) : (
                  <>
                    {paused
                      ? <Button onClick={resumeTracking} className="flex-1 bg-green-600"><Play className="h-4 w-4 mr-1" />{tt.resume}</Button>
                      : <Button onClick={pauseTracking} variant="outline" className="flex-1"><Pause className="h-4 w-4 mr-1" />{tt.pause}</Button>}
                    <Button onClick={stopTracking} variant="destructive" className="flex-1"><Square className="h-4 w-4 mr-1" />{tt.stop}</Button>
                  </>
                )}
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

            {tracking && (
              <div className="flex items-center justify-between text-xs p-2 rounded border bg-muted/30">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={`flex items-center gap-1 ${gps.color} cursor-help`}>
                      <GpsIcon className="h-4 w-4" />{tt.gpsQuality}: {gps.label}
                      {accuracy != null && <span className="text-muted-foreground">(±{Math.round(accuracy)} m)</span>}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-[220px]">GPS accuracy in meters. Lower = more precise tracking. &lt;25m is great for distance.</p>
                  </TooltipContent>
                </Tooltip>
                {paused && <span className="text-amber-600 font-semibold">⏸ Paused</span>}
              </div>
            )}

            {coords && (
              <p className="text-xs text-muted-foreground text-center">📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>
            )}

            {signalLost && tracking && (
              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 dark:bg-amber-950/30 p-2 rounded">
                <AlertCircle className="h-4 w-4 mt-0.5" />{tt.signalLost}
              </div>
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
              <BarChart data={last7}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><RTooltip /><Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart>
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
