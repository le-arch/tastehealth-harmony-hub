
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { saveSleepRecord } from '@/services/healthService';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const SleepTracker = () => {
  const [hoursSlept, setHoursSlept] = useState(7);
  const [quality, setQuality] = useState<"poor" | "fair" | "good" | "excellent">("good");
  const [loading, setLoading] = useState(false);
  
  const { language } = useLanguage();
  
  // Translations
  const translations = {
    en: {
      title: "Sleep Tracker",
      hours: "Hours Slept",
      quality: "Sleep Quality",
      poor: "Poor",
      fair: "Fair",
      good: "Good", 
      excellent: "Excellent",
      submit: "Log Sleep",
      success: "Sleep record saved successfully!",
      error: "Failed to save sleep record."
    },
    fr: {
      title: "Suivi du Sommeil",
      hours: "Heures Dormies",
      quality: "Qualité du Sommeil",
      poor: "Mauvaise",
      fair: "Moyenne",
      good: "Bonne",
      excellent: "Excellente",
      submit: "Enregistrer le Sommeil",
      success: "Données de sommeil enregistrées avec succès !",
      error: "Échec de l'enregistrement des données de sommeil."
    }
  };
  
  const t = translations[language as keyof typeof translations] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await saveSleepRecord(hoursSlept, quality);
      
      toast({ title: t.success });
    } catch (error) {
      toast({ 
        title: t.error,
        variant: "destructive"
      });
      console.error("Error saving sleep record:", error);
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
            <Label htmlFor="hoursSlept">{t.hours}</Label>
            <Input
              id="hoursSlept"
              type="number"
              value={hoursSlept}
              onChange={(e) => setHoursSlept(Number(e.target.value))}
              min="0"
              max="24"
              step="0.5"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quality">{t.quality}</Label>
            <Select value={quality} onValueChange={(val) => setQuality(val as "poor" | "fair" | "good" | "excellent")}>
              <SelectTrigger>
                <SelectValue placeholder={t.quality} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="poor">{t.poor}</SelectItem>
                <SelectItem value="fair">{t.fair}</SelectItem>
                <SelectItem value="good">{t.good}</SelectItem>
                <SelectItem value="excellent">{t.excellent}</SelectItem>
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

export default SleepTracker;
