import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Circle, Droplet, Bell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getWaterIntakeToday, saveWaterIntake } from '@/services/healthService';
import { motion, AnimatePresence } from 'framer-motion';

const HydrationTracker = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [loading, setLoading] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const storedWaterIntake = localStorage.getItem('waterIntake');
    if (storedWaterIntake) {
      setWaterIntake(parseInt(storedWaterIntake, 10));
    }
    
    loadWaterIntake();
    
    const reminderInterval = setInterval(() => {
      if (waterIntake < dailyGoal) {
        setShowReminder(true);
        setTimeout(() => setShowReminder(false), 10000);
      }
    }, 60 * 60 * 1000);
    
    return () => clearInterval(reminderInterval);
  }, [waterIntake, dailyGoal]);

  useEffect(() => {
    localStorage.setItem('waterIntake', waterIntake.toString());
  }, [waterIntake]);
  
  const loadWaterIntake = async () => {
    try {
      const today = await getWaterIntakeToday();
      if (today > 0) {
        setWaterIntake(today);
      }
    } catch (error) {
      console.error('Error loading water intake:', error);
    }
  };

  const translations = {
    en: {
      title: "Hydration Tracker",
      goal: "Daily Goal",
      cups: "cups",
      progress: "Progress",
      drinkWater: "Drink Water",
      reset: "Reset",
      wellHydrated: "Well Hydrated!",
      keepDrinking: "Keep Drinking!",
      setGoal: "Set Goal",
      saveProgress: "Save Progress",
      reminder: "Time to drink some water!",
      saved: "Water intake saved successfully!",
    },
    fr: {
      title: "Suivi d'Hydratation",
      goal: "Objectif Quotidien",
      cups: "verres",
      progress: "Progrès",
      drinkWater: "Boire de l'Eau",
      reset: "Réinitialiser",
      wellHydrated: "Bien Hydraté(e) !",
      keepDrinking: "Continuez à Boire !",
      setGoal: "Définir l'Objectif",
      saveProgress: "Sauvegarder",
      reminder: "C'est l'heure de boire un peu d'eau !",
      saved: "Consommation d'eau enregistrée avec succès !",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const waterPercentage = Math.min((waterIntake / dailyGoal) * 100, 100);

  const handleIncrement = () => {
    setWaterIntake((prevIntake) => Math.min(prevIntake + 1, dailyGoal));
  };

  const handleDecrement = () => {
    setWaterIntake((prevIntake) => Math.max(prevIntake - 1, 0));
  };

  const handleReset = () => {
    setWaterIntake(0);
  };

  const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newGoal = parseInt(event.target.value, 10);
    if (!isNaN(newGoal) && newGoal > 0) {
      setDailyGoal(newGoal);
    }
  };
  
  const handleSaveProgress = async () => {
    setLoading(true);
    try {
      await saveWaterIntake(waterIntake);
      toast.success(t.saved);
    } catch (error) {
      console.error('Error saving water intake:', error);
      toast.error("Error", {
        description: "Failed to save water intake.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full relative overflow-visible shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Droplet className="mr-2 text-blue-500" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <label htmlFor="dailyGoal" className="block text-sm font-medium text-gray-700">
            {t.goal} ({t.cups})
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="dailyGoal"
              id="dailyGoal"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="8"
              min="1"
              value={dailyGoal}
              onChange={handleGoalChange}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{t.cups}</span>
            </div>
          </div>
        </div>

        <div className="relative h-48 w-48 mx-auto mb-4">
          <div 
            className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <motion.div
                className="absolute bottom-0 left-0 w-full bg-blue-500"
                initial={{ height: '0%' }}
                animate={{ height: `${waterPercentage}%` }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="absolute top-0 left-0 w-full h-4 bg-blue-300 opacity-50"
                  animate={{ 
                    translateX: ['-25%', '25%', '-25%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
            <div className="z-10 flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-800">{waterIntake} / {dailyGoal}</span>
              <span className="text-sm">{t.cups}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <Button
            onClick={handleDecrement}
            variant="destructive"
            size="sm"
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
          >
            -
          </Button>
          <Button
            onClick={handleIncrement}
            variant="default"
            size="sm"
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-blue-500 hover:bg-blue-600"
          >
            +
          </Button>
        </div>

        <div className="flex justify-center space-x-2">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
          >
            {t.reset}
          </Button>
          
          <Button
            onClick={handleSaveProgress}
            variant="default"
            size="sm"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-blue-200 rounded-full animate-spin mr-2" />
            ) : null}
            {t.saveProgress}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {t.progress}: {waterPercentage.toFixed(0)}%
          </p>
          <p className="text-lg font-semibold text-blue-700">
            {waterPercentage === 100 ? t.wellHydrated : t.keepDrinking}
          </p>
        </div>
      </CardContent>
      
      <div className="absolute top-2 right-2">
        <Circle 
          size={24}
          className={waterPercentage === 100 ? "text-green-500" : "text-blue-500"}
          fill={waterPercentage === 100 ? "green" : "blue"}
          strokeWidth={waterPercentage === 100 ? 0 : 2}
        />
      </div>
      
      <AnimatePresence>
        {showReminder && (
          <motion.div 
            className="absolute top-0 right-0 transform -translate-y-full bg-blue-500 text-white p-3 rounded-t-lg flex items-center shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Bell className="mr-2" size={16} />
            {t.reminder}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default HydrationTracker;
