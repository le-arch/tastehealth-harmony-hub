
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { saveWaterIntake, getWaterIntakeToday } from '@/services/healthService';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropletIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HydrationInput = () => {
  const [cups, setCups] = useState(1);
  const [loading, setLoading] = useState(false);
  const [todaysIntake, setTodaysIntake] = useState(0);
  
  const { language } = useLanguage();
  
  // Translations
  const translations = {
    en: {
      title: "Hydration Tracker",
      cups: "Cups of Water",
      add: "Add Water",
      todaysIntake: "Today's intake",
      cupsText: "cups",
      success: "Water intake recorded!",
      error: "Failed to record water intake."
    },
    fr: {
      title: "Suivi d'Hydratation",
      cups: "Verres d'Eau",
      add: "Ajouter de l'Eau",
      todaysIntake: "Consommation du jour",
      cupsText: "verres",
      success: "Consommation d'eau enregistrée !",
      error: "Échec de l'enregistrement de la consommation d'eau."
    }
  };
  
  const t = translations[language as keyof typeof translations] || translations.en;

  // Fetch today's water intake
  useEffect(() => {
    const fetchWaterIntake = async () => {
      try {
        const intake = await getWaterIntakeToday();
        setTodaysIntake(intake);
      } catch (error) {
        console.error("Error fetching water intake:", error);
      }
    };
    
    fetchWaterIntake();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await saveWaterIntake(cups);
      
      // Update today's total
      setTodaysIntake(todaysIntake + cups);
      
      toast(t.success);
      
      // Reset to 1 cup
      setCups(1);
    } catch (error) {
      toast(t.error, {
        className: "destructive"
      });
      console.error("Error saving water intake:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DropletIcon size={18} className="text-blue-500" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-500">{t.todaysIntake}</p>
          <p className="text-2xl font-bold">{todaysIntake} {t.cupsText}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 dark:text-gray-100">
          <div className="space-y-4 text-gray-700 dark:text-gray-100">
            <Label htmlFor="cups">{t.cups}</Label>
            <Input
              id="cups"
              type="number"
              value={cups}
              onChange={(e) => setCups(Number(e.target.value))}
              min="1"
              max="10"
              required
            />
          </div>
          
          <CardFooter className="px-0 pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : t.add}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default HydrationInput;
