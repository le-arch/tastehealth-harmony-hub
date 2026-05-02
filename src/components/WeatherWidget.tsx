import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, MapPin, Wind, Droplet, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeatherData {
  temperature: number;
  apparent: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  city?: string;
}

const ICONS: Record<number, { Icon: React.ComponentType<any>; tint: string }> = {
  0: { Icon: Sun, tint: 'text-yellow-500' },
  1: { Icon: Sun, tint: 'text-yellow-400' },
  2: { Icon: Cloud, tint: 'text-slate-400' },
  3: { Icon: Cloud, tint: 'text-slate-500' },
  45: { Icon: Cloud, tint: 'text-slate-400' },
  48: { Icon: Cloud, tint: 'text-slate-400' },
  51: { Icon: CloudRain, tint: 'text-blue-400' },
  53: { Icon: CloudRain, tint: 'text-blue-400' },
  55: { Icon: CloudRain, tint: 'text-blue-500' },
  61: { Icon: CloudRain, tint: 'text-blue-500' },
  63: { Icon: CloudRain, tint: 'text-blue-600' },
  65: { Icon: CloudRain, tint: 'text-blue-700' },
  71: { Icon: CloudSnow, tint: 'text-sky-300' },
  73: { Icon: CloudSnow, tint: 'text-sky-400' },
  75: { Icon: CloudSnow, tint: 'text-sky-500' },
  80: { Icon: CloudRain, tint: 'text-blue-500' },
  81: { Icon: CloudRain, tint: 'text-blue-600' },
  82: { Icon: CloudRain, tint: 'text-blue-700' },
  95: { Icon: CloudLightning, tint: 'text-purple-500' },
  96: { Icon: CloudLightning, tint: 'text-purple-600' },
  99: { Icon: CloudLightning, tint: 'text-purple-700' },
};

const LABELS: Record<string, Record<number, string>> = {
  en: {
    0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Foggy', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    80: 'Showers', 81: 'Heavy showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Thunderstorm + hail', 99: 'Severe thunderstorm',
  },
  fr: {
    0: 'Ciel dégagé', 1: 'Plutôt dégagé', 2: 'Partiellement nuageux', 3: 'Couvert',
    45: 'Brouillard', 48: 'Brouillard', 51: 'Bruine légère', 53: 'Bruine', 55: 'Bruine forte',
    61: 'Pluie légère', 63: 'Pluie', 65: 'Pluie forte',
    71: 'Neige légère', 73: 'Neige', 75: 'Neige forte',
    80: 'Averses', 81: 'Averses fortes', 82: 'Averses violentes',
    95: 'Orage', 96: 'Orage + grêle', 99: 'Orage violent',
  },
};

const getTip = (lang: string, code: number, temp: number): string => {
  const en = (s: string) => lang === 'fr' ? null : s;
  const fr = (s: string) => lang === 'fr' ? s : null;
  if (code >= 95) return (lang === 'fr' ? '⚡ Restez à l\'intérieur — orage. Une soupe chaude est recommandée.' : '⚡ Stay indoors — thunderstorm. Hot soup recommended.');
  if (code >= 71 && code <= 75) return (lang === 'fr' ? '❄️ Couvrez-vous. Repas chauds et hydratation supplémentaire.' : '❄️ Bundle up. Warm meals + extra hydration.');
  if (code >= 51 && code <= 82) return (lang === 'fr' ? '🌧️ Prenez un parapluie. Essayez une tisane chaude.' : '🌧️ Carry an umbrella. Try a warm herbal tea.');
  if (temp >= 30) return (lang === 'fr' ? '🌡️ Journée chaude — buvez beaucoup d\'eau et mangez léger.' : '🌡️ Hot day — drink extra water and eat light.');
  if (temp <= 5) return (lang === 'fr' ? '🥶 Très froid — privilégiez les repas chauds et caloriques.' : '🥶 Very cold — go for warm, calorie-dense meals.');
  if (temp >= 20) return (lang === 'fr' ? '☀️ Idéal pour une promenade en plein air !' : '☀️ Great weather for an outdoor walk!');
  return (lang === 'fr' ? '🌤️ Temps agréable — parfait pour un petit entraînement.' : '🌤️ Pleasant weather — perfect for a short workout.');
};

const WeatherWidget: React.FC = () => {
  const { language } = useLanguage();
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tt = language === 'fr'
    ? { loading: 'Chargement de la météo locale…', unavailable: 'Météo indisponible', feels: 'ressenti' }
    : { loading: 'Loading local weather…', unavailable: 'Weather unavailable', feels: 'feels' };

  useEffect(() => {
    let cancelled = false;
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather request failed');
        const json = await res.json();
        if (cancelled) return;
        let city: string | undefined;
        try {
          const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=${language}&format=json`);
          if (geo.ok) { const gj = await geo.json(); city = gj?.results?.[0]?.name; }
        } catch {}
        setData({
          temperature: Math.round(json.current.temperature_2m),
          apparent: Math.round(json.current.apparent_temperature),
          humidity: Math.round(json.current.relative_humidity_2m),
          windSpeed: Math.round(json.current.wind_speed_10m),
          weatherCode: json.current.weather_code,
          city,
        });
        setLoading(false);
      } catch {
        if (!cancelled) { setError(tt.unavailable); setLoading(false); }
      }
    };
    if (!('geolocation' in navigator)) { setError(tt.unavailable); setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(51.5072, -0.1276),
      { timeout: 8000, maximumAge: 1000 * 60 * 30 }
    );
    return () => { cancelled = true; };
  }, [language]);

  if (loading) return (
    <Card className="p-3 flex items-center gap-2 border-sky-200 dark:border-sky-800/30 bg-sky-50/50 dark:bg-sky-950/20">
      <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
      <span className="text-xs text-sky-700 dark:text-sky-300">{tt.loading}</span>
    </Card>
  );

  if (error || !data) return (
    <Card className="p-3 flex items-center gap-2 border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/20">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <span className="text-xs text-amber-700 dark:text-amber-300">{error || tt.unavailable}</span>
    </Card>
  );

  const meta = ICONS[data.weatherCode] || ICONS[3];
  const Icon = meta.Icon;
  const label = (LABELS[language] || LABELS.en)[data.weatherCode] || (LABELS[language] || LABELS.en)[3];

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
                <span className="text-xs text-muted-foreground">{tt.feels} {data.apparent}°</span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {data.city && <><MapPin className="h-3 w-3" />{data.city} · </>}
                {label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Droplet className="h-3 w-3 text-blue-500" />{data.humidity}%</span>
            <span className="flex items-center gap-1"><Wind className="h-3 w-3 text-slate-500" />{data.windSpeed} km/h</span>
          </div>
        </div>
        <p className="text-xs text-sky-700 dark:text-sky-300 mt-2">{getTip(language, data.weatherCode, data.temperature)}</p>
      </Card>
    </motion.div>
  );
};

export default WeatherWidget;
