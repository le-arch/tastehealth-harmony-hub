
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { saveCalorieRecord } from '@/services/healthService';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const CalorieTracker = () => {
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesGoal, setCaloriesGoal] = useState(2000);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const { language } = useLanguage();
  
  // Translations
  const translations = {
    en: {
      title: "Calorie Tracker",
      consumed: "Calories Consumed",
      goal: "Calories Goal",
      protein: "Protein (g)",
      carbs: "Carbs (g)",
      fat: "Fat (g)",
      submit: "Log Calories",
      success: "Calories recorded successfully!",
      error: "Failed to record calories."
    },
    fr: {
      title: "Suivi des Calories",
      consumed: "Calories Consommées",
      goal: "Objectif de Calories",
      protein: "Protéines (g)",
      carbs: "Glucides (g)",
      fat: "Lipides (g)",
      submit: "Enregistrer les Calories",
      success: "Calories enregistrées avec succès !",
      error: "Échec de l'enregistrement des calories."
    }
  };
  
  const t = translations[language as keyof typeof translations] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await saveCalorieRecord(
        caloriesConsumed,
        caloriesGoal,
        protein || undefined,
        carbs || undefined,
        fat || undefined
      );
      
      toast({ title: t.success });
      
      // Reset form values except for the goal
      setCaloriesConsumed(0);
      setProtein(0);
      setCarbs(0);
      setFat(0);
    } catch (error) {
      toast({ 
        title: t.error,
        variant: "destructive"
      });
      console.error("Error saving calorie record:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caloriesConsumed">{t.consumed}</Label>
              <Input
                id="caloriesConsumed"
                type="number"
                value={caloriesConsumed}
                onChange={(e) => setCaloriesConsumed(Number(e.target.value))}
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caloriesGoal">{t.goal}</Label>
              <Input
                id="caloriesGoal"
                type="number"
                value={caloriesGoal}
                onChange={(e) => setCaloriesGoal(Number(e.target.value))}
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protein">{t.protein}</Label>
              <Input
                id="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">{t.carbs}</Label>
              <Input
                id="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">{t.fat}</Label>
              <Input
                id="fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>
          
          <CardFooter className="px-0 pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : t.submit}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default CalorieTracker;
