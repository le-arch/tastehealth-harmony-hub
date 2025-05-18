
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveWaterIntake, saveSleepRecord, saveCalorieRecord, saveExerciseRecord, saveBMIRecord } from '@/services/healthService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export type DataEntryType = 'water' | 'sleep' | 'calories' | 'exercise' | 'bmi';

interface DataEntryDialogProps {
  type: DataEntryType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DataEntryDialog: React.FC<DataEntryDialogProps> = ({
  type,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [waterCups, setWaterCups] = useState(1);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState<"poor" | "fair" | "good" | "excellent">("good");
  const [calories, setCalories] = useState(2000);
  const [caloriesGoal, setCaloriesGoal] = useState(2000);
  const [exerciseType, setExerciseType] = useState('walking');
  const [exerciseDuration, setExerciseDuration] = useState(30);
  const [exerciseIntensity, setExerciseIntensity] = useState<"low" | "medium" | "high">("medium");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  
  // Translations
  const translations = {
    en: {
      addData: "Add Data",
      save: "Save",
      cancel: "Cancel",
      loading: "Saving...",
      // Water
      waterTitle: "Add Water Intake",
      waterDesc: "Record your water consumption",
      waterLabel: "Cups of Water",
      waterSuccess: "Water intake recorded successfully!",
      // Sleep
      sleepTitle: "Add Sleep Record",
      sleepDesc: "Track your sleep duration and quality",
      sleepHours: "Hours Slept",
      sleepQuality: "Sleep Quality",
      sleepPoor: "Poor",
      sleepFair: "Fair",
      sleepGood: "Good",
      sleepExcellent: "Excellent",
      sleepSuccess: "Sleep record saved successfully!",
      // Calories
      caloriesTitle: "Add Calorie Intake",
      caloriesDesc: "Record your calorie consumption",
      caloriesConsumed: "Calories Consumed",
      caloriesGoal: "Daily Calorie Goal",
      caloriesSuccess: "Calorie intake recorded successfully!",
      // Exercise
      exerciseTitle: "Add Exercise Record",
      exerciseDesc: "Log your physical activity",
      exerciseType: "Exercise Type",
      exerciseDuration: "Duration (minutes)",
      exerciseIntensity: "Intensity",
      exerciseLow: "Low",
      exerciseMedium: "Medium",
      exerciseHigh: "High",
      walking: "Walking",
      running: "Running",
      cycling: "Cycling",
      swimming: "Swimming",
      yoga: "Yoga",
      weightlifting: "Weightlifting",
      exerciseSuccess: "Exercise record saved successfully!",
      // BMI
      bmiTitle: "Add BMI Measurement",
      bmiDesc: "Record your height and weight",
      bmiHeight: "Height (cm)",
      bmiWeight: "Weight (kg)",
      bmiSuccess: "BMI record saved successfully!",
      // Error
      error: "An error occurred. Please try again."
    },
    fr: {
      addData: "Ajouter des Données",
      save: "Enregistrer",
      cancel: "Annuler",
      loading: "Enregistrement...",
      // Water
      waterTitle: "Ajouter Consommation d'Eau",
      waterDesc: "Enregistrez votre consommation d'eau",
      waterLabel: "Verres d'Eau",
      waterSuccess: "Consommation d'eau enregistrée avec succès !",
      // Sleep
      sleepTitle: "Ajouter Enregistrement de Sommeil",
      sleepDesc: "Suivez la durée et qualité de votre sommeil",
      sleepHours: "Heures Dormies",
      sleepQuality: "Qualité du Sommeil",
      sleepPoor: "Mauvaise",
      sleepFair: "Moyenne",
      sleepGood: "Bonne",
      sleepExcellent: "Excellente",
      sleepSuccess: "Enregistrement de sommeil sauvegardé avec succès !",
      // Calories
      caloriesTitle: "Ajouter Apport Calorique",
      caloriesDesc: "Enregistrez votre consommation de calories",
      caloriesConsumed: "Calories Consommées",
      caloriesGoal: "Objectif Calorique Quotidien",
      caloriesSuccess: "Apport calorique enregistré avec succès !",
      // Exercise
      exerciseTitle: "Ajouter Activité Physique",
      exerciseDesc: "Enregistrez votre activité physique",
      exerciseType: "Type d'Exercice",
      exerciseDuration: "Durée (minutes)",
      exerciseIntensity: "Intensité",
      exerciseLow: "Faible",
      exerciseMedium: "Moyenne",
      exerciseHigh: "Élevée",
      walking: "Marche",
      running: "Course",
      cycling: "Cyclisme",
      swimming: "Natation",
      yoga: "Yoga",
      weightlifting: "Musculation",
      exerciseSuccess: "Activité physique enregistrée avec succès !",
      // BMI
      bmiTitle: "Ajouter Mesure IMC",
      bmiDesc: "Enregistrez votre taille et poids",
      bmiHeight: "Taille (cm)",
      bmiWeight: "Poids (kg)",
      bmiSuccess: "Mesure IMC enregistrée avec succès !",
      // Error
      error: "Une erreur s'est produite. Veuillez réessayer."
    }
  };
  
  const t = translations[language as keyof typeof translations] || translations.en;
  
  // Get dialog title and description based on type
  const getDialogInfo = () => {
    switch (type) {
      case 'water':
        return { title: t.waterTitle, description: t.waterDesc };
      case 'sleep':
        return { title: t.sleepTitle, description: t.sleepDesc };
      case 'calories':
        return { title: t.caloriesTitle, description: t.caloriesDesc };
      case 'exercise':
        return { title: t.exerciseTitle, description: t.exerciseDesc };
      case 'bmi':
        return { title: t.bmiTitle, description: t.bmiDesc };
      default:
        return { title: t.addData, description: '' };
    }
  };
  
  const handleSave = async () => {
    setLoading(true);
    
    try {
      switch (type) {
        case 'water': {
          await saveWaterIntake(waterCups);
          toast({ description: t.waterSuccess });
          break;
        }
        case 'sleep': {
          await saveSleepRecord(sleepHours, sleepQuality);
          toast({ description: t.sleepSuccess });
          break;
        }
        case 'calories': {
          await saveCalorieRecord(calories, caloriesGoal);
          toast({ description: t.caloriesSuccess });
          break;
        }
        case 'exercise': {
          await saveExerciseRecord(exerciseType, exerciseDuration, undefined, exerciseIntensity as any);
          toast({ description: t.exerciseSuccess });
          break;
        }
        case 'bmi': {
          await saveBMIRecord(height, weight);
          toast({ description: t.bmiSuccess });
          break;
        }
      }
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving data:", error);
      toast({ 
        description: t.error,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Render form fields based on type
  const renderFormFields = () => {
    switch (type) {
      case 'water':
        return (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="waterCups">{t.waterLabel}</Label>
              <Input
                id="waterCups"
                type="number"
                value={waterCups}
                onChange={(e) => setWaterCups(Number(e.target.value))}
                min="1"
                max="20"
                required
              />
            </div>
          </div>
        );
      
      case 'sleep':
        return (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="sleepHours">{t.sleepHours}</Label>
              <Input
                id="sleepHours"
                type="number"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                min="0"
                max="24"
                step="0.5"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sleepQuality">{t.sleepQuality}</Label>
              <Select value={sleepQuality} onValueChange={(val) => setSleepQuality(val as any)}>
                <SelectTrigger id="sleepQuality">
                  <SelectValue placeholder={t.sleepQuality} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">{t.sleepPoor}</SelectItem>
                  <SelectItem value="fair">{t.sleepFair}</SelectItem>
                  <SelectItem value="good">{t.sleepGood}</SelectItem>
                  <SelectItem value="excellent">{t.sleepExcellent}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'calories':
        return (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="calories">{t.caloriesConsumed}</Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                min="0"
                max="10000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caloriesGoal">{t.caloriesGoal}</Label>
              <Input
                id="caloriesGoal"
                type="number"
                value={caloriesGoal}
                onChange={(e) => setCaloriesGoal(Number(e.target.value))}
                min="500"
                max="10000"
                required
              />
            </div>
          </div>
        );
      
      case 'exercise':
        return (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="exerciseType">{t.exerciseType}</Label>
              <Select value={exerciseType} onValueChange={setExerciseType}>
                <SelectTrigger id="exerciseType">
                  <SelectValue placeholder={t.exerciseType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walking">{t.walking}</SelectItem>
                  <SelectItem value="running">{t.running}</SelectItem>
                  <SelectItem value="cycling">{t.cycling}</SelectItem>
                  <SelectItem value="swimming">{t.swimming}</SelectItem>
                  <SelectItem value="yoga">{t.yoga}</SelectItem>
                  <SelectItem value="weightlifting">{t.weightlifting}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exerciseDuration">{t.exerciseDuration}</Label>
              <Input
                id="exerciseDuration"
                type="number"
                value={exerciseDuration}
                onChange={(e) => setExerciseDuration(Number(e.target.value))}
                min="1"
                max="600"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exerciseIntensity">{t.exerciseIntensity}</Label>
              <Select value={exerciseIntensity} onValueChange={(val) => setExerciseIntensity(val as any)}>
                <SelectTrigger id="exerciseIntensity">
                  <SelectValue placeholder={t.exerciseIntensity} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t.exerciseLow}</SelectItem>
                  <SelectItem value="medium">{t.exerciseMedium}</SelectItem>
                  <SelectItem value="high">{t.exerciseHigh}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'bmi':
        return (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="height">{t.bmiHeight}</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min="50"
                max="250"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">{t.bmiWeight}</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                min="20"
                max="300"
                required
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const dialogInfo = getDialogInfo();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogInfo.title}</DialogTitle>
          <DialogDescription>{dialogInfo.description}</DialogDescription>
        </DialogHeader>
        
        {renderFormFields()}
        
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t.cancel}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? t.loading : t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataEntryDialog;
