import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, Play, Pause, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Orientation { alpha: number; beta: number; gamma: number; }

declare global {
  interface DeviceOrientationEventStatic {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  }
}

const OrientationTracker: React.FC = () => {
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Orientation>({ alpha: 0, beta: 0, gamma: 0 });
  const handlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  const onEvent = (e: DeviceOrientationEvent) => {
    setData({
      alpha: e.alpha ?? 0,
      beta: e.beta ?? 0,
      gamma: e.gamma ?? 0,
    });
  };

  const start = async () => {
    setError(null);
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      setError('Gyroscope / orientation sensor not available in this browser.');
      return;
    }
    try {
      // iOS 13+ requires permission
      const anyEvent = (window as any).DeviceOrientationEvent;
      if (typeof anyEvent?.requestPermission === 'function') {
        const perm = await anyEvent.requestPermission();
        if (perm !== 'granted') { setError('Permission denied for orientation sensor.'); return; }
      }
      handlerRef.current = onEvent;
      window.addEventListener('deviceorientation', onEvent, true);
      setActive(true);
    } catch (e: any) {
      setError(e?.message || 'Could not start orientation sensor.');
    }
  };

  const stop = () => {
    if (handlerRef.current) {
      window.removeEventListener('deviceorientation', handlerRef.current, true);
      handlerRef.current = null;
    }
    setActive(false);
  };

  useEffect(() => () => { if (handlerRef.current) window.removeEventListener('deviceorientation', handlerRef.current, true); }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Compass className="h-5 w-5 text-purple-500" />Orientation (Gyroscope)</CardTitle>
        <CardDescription className="text-xs">
          Live device orientation using the browser DeviceOrientation API. Works best on mobile devices; desktops usually return zeros.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center py-6">
          <motion.div
            className="relative h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-2 border-purple-300 flex items-center justify-center"
            animate={{ rotateZ: -data.alpha, rotateX: data.beta * 0.3, rotateY: data.gamma * 0.3 }}
            style={{ perspective: 600 }}
            transition={{ type: 'spring', stiffness: 80, damping: 12 }}
          >
            <Compass className="h-14 w-14 text-purple-600" />
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded bg-muted/50 p-2"><p className="text-[10px] text-muted-foreground">Compass (α)</p><p className="font-mono text-sm">{data.alpha.toFixed(0)}°</p></div>
          <div className="rounded bg-muted/50 p-2"><p className="text-[10px] text-muted-foreground">Tilt FB (β)</p><p className="font-mono text-sm">{data.beta.toFixed(0)}°</p></div>
          <div className="rounded bg-muted/50 p-2"><p className="text-[10px] text-muted-foreground">Tilt LR (γ)</p><p className="font-mono text-sm">{data.gamma.toFixed(0)}°</p></div>
        </div>

        {!active ? (
          <Button onClick={start} className="w-full bg-purple-600 hover:bg-purple-700"><Play className="h-4 w-4 mr-2" />Start sensor</Button>
        ) : (
          <Button onClick={stop} variant="outline" className="w-full"><Pause className="h-4 w-4 mr-2" />Stop sensor</Button>
        )}

        {error && (
          <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded">
            <AlertCircle className="h-4 w-4 mt-0.5" />{error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrientationTracker;
