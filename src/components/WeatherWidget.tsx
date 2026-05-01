import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, MapPin, Wind, Droplet, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherData {
  temperature: number;
  apparent: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  city?: string;
}

const weatherCodeMap: Record<number, { label: string; Icon: React.ComponentType<any>; tint: string }> = {
  0: { label: 'Clear sky', Icon: Sun, tint: 'text-yellow-500' },
  1: { label: 'Mostly clear', Icon: Sun, tint: 'text-yellow-400' },
  2: { label: 'Partly cloudy', Icon: Cloud, tint: 'text-slate-400' },
  3: { label: 'Overcast', Icon: Cloud, tint: 'text-slate-500' },
  45: { label: 'Foggy', Icon: Cloud, tint: 'text-slate-400' },
  48: { label: 'Foggy', Icon: Cloud, tint: 'text-slate-400' },
  51: { label: 'Light drizzle', Icon: CloudRain, tint: 'text-blue-400' },
  53: { label: 'Drizzle', Icon: CloudRain, tint: 'text-blue-400' },
  55: { label: 'Heavy drizzle', Icon: CloudRain, tint: 'text-blue-500' },
  61: { label: 'Light rain', Icon: CloudRain, tint: 'text-blue-500' },
  63: { label: 'Rain', Icon: CloudRain, tint: 'text-blue-600' },
  65: { label: 'Heavy rain', Icon: CloudRain, tint: 'text-blue-700' },
  71: { label: 'Light snow', Icon: CloudSnow, tint: 'text-sky-300' },
  73: { label: 'Snow', Icon: CloudSnow, tint: 'text-sky-400' },
  75: { label: 'Heavy snow', Icon: CloudSnow, tint: 'text-sky-500' },
  80: { label: 'Showers', Icon: CloudRain, tint: 'text-blue-500' },
  81: { label: 'Heavy showers', Icon: CloudRain, tint: 'text-blue-600' },
  82: { label: 'Violent showers', Icon: CloudRain, tint: 'text-blue-700' },
  95: { label: 'Thunderstorm', Icon: CloudLightning, tint: 'text-purple-500' },
  96: { label: 'Thunderstorm + hail', Icon: CloudLightning, tint: 'text-purple-600' },
  99: { label: 'Severe thunderstorm', Icon: CloudLightning, tint: 'text-purple-700' },
};

const getWeatherTip = (code: number, temp: number): string => {
  if (code >= 95) return '⚡ Stay indoors — thunderstorm. Hot soup recommended.';
  if (code >= 71 && code <= 75) return '❄️ Bundle up. Warm meals + extra hydration.';
  if (code >= 51 && code <= 82) return '🌧️ Carry an umbrella. Try a warm herbal tea.';
  if (temp >= 30) return '🌡️ Hot day — drink extra water and eat light.';
  if (temp <= 5) return '🥶 Very cold — go for warm, calorie-dense meals.';
  if (temp >= 20) return '☀️ Great weather for an outdoor walk!';
  return '🌤️ Pleasant weather — perfect for a short workout.';
};

const WeatherWidget: React.FC = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather request failed');
        const json = await res.json();
        if (cancelled) return;

        // Try reverse geocoding (best-effort)
        let city: string | undefined;
        try {
          const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`);
          if (geo.ok) {
            const gj = await geo.json();
            city = gj?.results?.[0]?.name;
          }
        } catch { /* ignore */ }

        setData({
          temperature: Math.round(json.current.temperature_2m),
          apparent: Math.round(json.current.apparent_temperature),
          humidity: Math.round(json.current.relative_humidity_2m),
          windSpeed: Math.round(json.current.wind_speed_10m),
          weatherCode: json.current.weather_code,
          city,
        });
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        setError('Unable to load weather');
        setLoading(false);
      }
    };

    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => {
        // Fallback to a default city (London) if denied
        fetchWeather(51.5072, -0.1276);
      },
      { timeout: 8000, maximumAge: 1000 * 60 * 30 }
    );

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <Card className="p-3 flex items-center gap-2 border-sky-200 dark:border-sky-800/30 bg-sky-50/50 dark:bg-sky-950/20">
        <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
        <span className="text-xs text-sky-700 dark:text-sky-300">Loading local weather…</span>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-3 flex items-center gap-2 border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/20">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <span className="text-xs text-amber-700 dark:text-amber-300">{error || 'Weather unavailable'}</span>
      </Card>
    );
  }

  const meta = weatherCodeMap[data.weatherCode] || weatherCodeMap[3];
  const Icon = meta.Icon;

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card className="p-3 border-sky-200 dark:border-sky-800/30 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: meta.Icon === Sun ? [0, 360] : [0, 5, -5, 0] }}
              transition={{ duration: meta.Icon === Sun ? 30 : 4, repeat: Infinity, ease: 'linear' }}
            >
              <Icon className={`h-8 w-8 ${meta.tint}`} />
            </motion.div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{data.temperature}°C</span>
                <span className="text-xs text-muted-foreground">feels {data.apparent}°</span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {data.city && <><MapPin className="h-3 w-3" />{data.city} · </>}
                {meta.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Droplet className="h-3 w-3 text-blue-500" />{data.humidity}%</span>
            <span className="flex items-center gap-1"><Wind className="h-3 w-3 text-slate-500" />{data.windSpeed} km/h</span>
          </div>
        </div>
        <p className="text-xs text-sky-700 dark:text-sky-300 mt-2">{getWeatherTip(data.weatherCode, data.temperature)}</p>
      </Card>
    </motion.div>
  );
};

export default WeatherWidget;
