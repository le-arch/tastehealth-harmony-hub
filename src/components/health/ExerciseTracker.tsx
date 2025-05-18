
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { saveExerciseRecord } from '@/services/healthService';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const ExerciseTracker = () => {
  const [exerciseType, setExerciseType] = useState('');
  const [duration, setDuration] = useState(30);
  const [caloriesBurned, setCaloriesBurned] = useState<number | undefined>(undefined);
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("medium");
  const [loading, setLoading] = useState(false);
  
  const { language } = useLanguage();
  
  // Translations
  const translations = {
    en: {
      title: "Exercise Tracker",
      type: "Exercise Type",
      typePlaceholder: "e.g. Running, Walking, Swimming",
      duration: "Duration (minutes)",
      calories: "Calories Burned (optional)",
      intensity: "Intensity",
      low: "Low",
      medium: "Medium",
      high: "High",
      submit: "Log Exercise",
      success: "Exercise record saved successfully!",
      error: "Failed to save exercise record."
    },
    fr: {
      title: "Suivi d'Exercice",
      type: "Type d'Exercice",
      typePlaceholder: "ex. Course, Marche, Natation",
      duration: "Durée (minutes)",
      calories: "Calories Brûlées (optionnel)",
      intensity: "Intensité",
      low: "Faible",
      medium: "Moyenne",
      high: "Élevée",
      submit: "Enregistrer l'Exercice",
      success: "Exercice enregistré avec succès !",
      error: "Échec de l'enregistrement de l'exercice."
    }
  };
  
  const t = translations[language as keyof typeof translations] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!exerciseType.trim()) {
      toast({ 
        title: "Please enter an exercise type",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    try {
      await saveExerciseRecord(
        exerciseType,
        duration,
        caloriesBurned,
        intensity
      );
      
      toast({ title: t.success });
      
      // Reset form
      setExerciseType('');
      setCaloriesBurned(undefined);
    } catch (error) {
      toast({ 
        title: t.error,
        variant: "destructive"
      });
      console.error("Error saving exercise record:", error);
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
          <div className="space-y-2">
            <Label htmlFor="exerciseType">{t.type}</Label>
            <Input
              id="exerciseType"
              placeholder={t.typePlaceholder}
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">{t.duration}</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caloriesBurned">{t.calories}</Label>
              <Input
                id="caloriesBurned"
                type="number"
                value={caloriesBurned || ''}
                onChange={(e) => setCaloriesBurned(e.target.value ? Number(e.target.value) : undefined)}
                min="0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="intensity">{t.intensity}</Label>
            <Select value={intensity} onValueChange={(val) => setIntensity(val as "low" | "medium" | "high")}>
              <SelectTrigger>
                <SelectValue placeholder={t.intensity} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t.low}</SelectItem>
                <SelectItem value="medium">{t.medium}</SelectItem>
                <SelectItem value="high">{t.high}</SelectItem>
              </SelectContent>
            </Select>
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

export default ExerciseTracker;
