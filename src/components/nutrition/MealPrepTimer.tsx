
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Timer, Play, Pause, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const QUOTES = [
  "Preparation is the key to success!",
  "Great meals require patience and time",
  "You're creating health with every meal you prepare",
  "Cooking with love provides food for the soul",
  "Good food choices are good investments",
  "The best meals are made with care and time",
  "Cooking is love made visible",
  "Your body deserves the best fuel possible"
];

const MealPrepTimer: React.FC = () => {
  const [minutes, setMinutes] = useState<number>(15);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeToSet, setTimeToSet] = useState<number>(15);
  const [quote, setQuote] = useState<string>(QUOTES[0]);
  const [completed, setCompleted] = useState<boolean>(false);
  const { language } = useLanguage();

  const totalSeconds = minutes * 60 + seconds;
  const initialTotalSeconds = timeToSet * 60;
  const progress = (totalSeconds / initialTotalSeconds) * 100;

  const translations = {
    en: {
      title: "Meal Prep Timer",
      minutesLabel: "Minutes",
      startTimer: "Start Timer",
      pauseTimer: "Pause",
      resetTimer: "Reset",
      completed: "Completed!",
      startNew: "Start New Timer"
    },
    fr: {
      title: "Minuteur de Préparation de Repas",
      minutesLabel: "Minutes",
      startTimer: "Démarrer",
      pauseTimer: "Pause",
      resetTimer: "Réinitialiser",
      completed: "Terminé !",
      startNew: "Nouveau Minuteur"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            setCompleted(true);
            toast.success(t.completed);
            return;
          }
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }

        // Change quote every 30 seconds
        if ((minutes * 60 + seconds) % 30 === 0) {
          const randomIndex = Math.floor(Math.random() * QUOTES.length);
          setQuote(QUOTES[randomIndex]);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, t.completed]);

  const handleStart = () => {
    if (!isActive && (minutes > 0 || seconds > 0)) {
      setIsActive(true);
      setCompleted(false);
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setMinutes(timeToSet);
    setSeconds(0);
    setCompleted(false);
  };

  const handleSetTime = (value: number[]) => {
    const newTime = value[0];
    setTimeToSet(newTime);
    setMinutes(newTime);
    setSeconds(0);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium flex items-center">
          <Timer className="mr-2 h-5 w-5 text-orange-500" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive && !completed ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{t.minutesLabel}: {timeToSet}</span>
              </div>
              <Slider
                min={1}
                max={60}
                step={1}
                value={[timeToSet]}
                onValueChange={handleSetTime}
              />
            </div>
          </div>
        ) : null}

        <div className="text-center">
          {completed ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
              <span className="text-2xl font-bold text-green-500">{t.completed}</span>
            </motion.div>
          ) : (
            <motion.div
              key={`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <Clock className="h-12 w-12 mb-2" />
              <span className="text-4xl font-bold">
                {minutes}:{seconds < 10 ? '0' : ''}{seconds}
              </span>
            </motion.div>
          )}

          <div className="mt-4">
            <Progress value={completed ? 100 : 100 - progress} className="h-2" />
          </div>

          {!completed && (
            <motion.p
              key={quote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 text-sm text-gray-500 italic"
            >
              "{quote}"
            </motion.p>
          )}

          <div className="mt-4 flex space-x-2 justify-center">
            {!completed ? (
              <>
                {isActive ? (
                  <Button onClick={handlePause} variant="outline" size="sm">
                    <Pause className="h-4 w-4 mr-1" />
                    {t.pauseTimer}
                  </Button>
                ) : (
                  <Button onClick={handleStart} variant="default" size="sm">
                    <Play className="h-4 w-4 mr-1" />
                    {t.startTimer}
                  </Button>
                )}
                <Button onClick={handleReset} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  {t.resetTimer}
                </Button>
              </>
            ) : (
              <Button onClick={handleReset} variant="default" size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                {t.startNew}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPrepTimer;
