import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNutrition } from "../contexts/NutritionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Confetti from "@/components/Confetti";
import { toast } from "sonner";
import NutritionGoalForm from "@/components/goal-wizard/NutritionGoalForm";
import CalorieGoalStep from "@/components/goal-wizard/CalorieGoalStep";
import MacroStep from "@/components/goal-wizard/MacroStep";
import ReviewGoalsStep from "@/components/goal-wizard/ReviewGoalsStep";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Calendar,
  Clock,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Dumbbell,
  Heart,
  Brain,
  Apple,
  Moon,
  Droplet,
  Sun,
  Activity,
  Award,
  Flame,
  Footprints,
  Shield,
  Zap,
  Coffee,
  Users,
  BookOpen,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Info,
  Settings
} from "lucide-react";

const steps = [
  { id: 1, title: "Basic Information", icon: <Settings className="h-4 w-4" /> },
  { id: 2, title: "Calorie Goals", icon: <Flame className="h-4 w-4" /> },
  { id: 3, title: "Macronutrient Distribution", icon: <Apple className="h-4 w-4" /> },
  { id: 4, title: "Wellness Goals", icon: <Heart className="h-4 w-4" /> },
  { id: 5, title: "Review & Complete", icon: <CheckCircle2 className="h-4 w-4" /> },
];

interface FormData {
  // Basic info
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  goal: string;
  
  // Nutrition
  dailyCalories: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatsPercentage: number;
  
  // Wellness Goals - New Fields
  waterIntakeGoal: number;
  sleepHoursGoal: number;
  stepsGoal: number;
  workoutDaysGoal: number;
  meditationMinutesGoal: number;
  mealPrepDaysGoal: number;
  screenTimeLimit: number;
  
  // Health Metrics
  targetWeight?: number;
  targetBodyFat?: number;
  targetWaistCircumference?: number;
  
  // Habits
  habits: string[];
  restrictions: string[];
  
  // Timeline
  timeline: string;
  motivationLevel: number;
  
  // Additional
  includeRecoveryDays: boolean;
  includeCheatMeals: boolean;
  trackMicros: boolean;
  
  [key: string]: string | number | boolean | string[];
}

// Goal templates for quick selection
const GOAL_TEMPLATES = {
  weightLoss: {
    name: "Weight Loss",
    icon: <TrendingDown className="h-4 w-4" />,
    description: "Shed excess weight with sustainable habits",
    goals: {
      dailyCalories: -20, // percentage adjustment
      waterIntakeGoal: 2.5,
      stepsGoal: 10000,
      workoutDaysGoal: 4,
      meditationMinutesGoal: 10
    }
  },
  muscleGain: {
    name: "Muscle Gain",
    icon: <Dumbbell className="h-4 w-4" />,
    description: "Build lean muscle and strength",
    goals: {
      dailyCalories: 15,
      proteinPercentage: 35,
      workoutDaysGoal: 5,
      stepsGoal: 8000
    }
  },
  longevity: {
    name: "Longevity & Healthspan",
    icon: <Heart className="h-4 w-4" />,
    description: "Optimize for long-term health",
    goals: {
      waterIntakeGoal: 2.5,
      sleepHoursGoal: 8,
      stepsGoal: 8000,
      meditationMinutesGoal: 15,
      workoutDaysGoal: 4
    }
  },
  mentalWellness: {
    name: "Mental Wellness",
    icon: <Brain className="h-4 w-4" />,
    description: "Focus on stress reduction and mindfulness",
    goals: {
      meditationMinutesGoal: 20,
      sleepHoursGoal: 8,
      stepsGoal: 7000,
      screenTimeLimit: 4
    }
  },
  athletic: {
    name: "Athletic Performance",
    icon: <Zap className="h-4 w-4" />,
    description: "Enhance performance and recovery",
    goals: {
      workoutDaysGoal: 6,
      waterIntakeGoal: 3,
      proteinPercentage: 35,
      stepsGoal: 12000,
      includeRecoveryDays: true
    }
  },
  balanced: {
    name: "Balanced Lifestyle",
    icon: <Sun className="h-4 w-4" />,
    description: "Maintain healthy equilibrium",
    goals: {
      workoutDaysGoal: 3,
      meditationMinutesGoal: 10,
      stepsGoal: 8000,
      sleepHoursGoal: 7.5,
      includeCheatMeals: true
    }
  }
};

const GoalWizard = () => {
  const navigate = useNavigate();
  const { nutritionGoal, saveNutritionGoal } = useNutrition();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    // Basic info
    age: 30,
    weight: 70,
    height: 170,
    gender: "female",
    activityLevel: "moderate",
    goal: "maintain",
    
    // Nutrition
    dailyCalories: nutritionGoal?.dailyCalories || 2000,
    proteinPercentage: nutritionGoal?.proteinPercentage || 30,
    carbsPercentage: nutritionGoal?.carbsPercentage || 40,
    fatsPercentage: nutritionGoal?.fatsPercentage || 30,
    
    // Wellness Goals
    waterIntakeGoal: 2.0, // liters
    sleepHoursGoal: 7.5, // hours
    stepsGoal: 8000, // steps
    workoutDaysGoal: 3, // days per week
    meditationMinutesGoal: 5, // minutes per day
    mealPrepDaysGoal: 2, // days per week
    screenTimeLimit: 6, // hours per day
    
    // Health Metrics
    targetWeight: undefined,
    targetBodyFat: undefined,
    targetWaistCircumference: undefined,
    
    // Habits
    habits: [],
    restrictions: [],
    
    // Timeline
    timeline: "12 weeks",
    motivationLevel: 7,
    
    // Additional
    includeRecoveryDays: true,
    includeCheatMeals: true,
    trackMicros: false,
  });

  // Load saved data on mount + pull from profile
  useEffect(() => {
    // Load profile data for age, weight, height, gender
    try {
      const profile = JSON.parse(localStorage.getItem('th_profile') || 'null');
      if (profile) {
        const profileUpdates: Partial<FormData> = {};
        if (profile.age) profileUpdates.age = parseInt(profile.age) || 30;
        if (profile.weight) profileUpdates.weight = parseFloat(profile.weight) || 70;
        if (profile.height) profileUpdates.height = parseFloat(profile.height) || 170;
        if (profile.gender) profileUpdates.gender = profile.gender;
        if (profile.activityLevel) profileUpdates.activityLevel = profile.activityLevel;
        setFormData(prev => ({ ...prev, ...profileUpdates }));
      }
    } catch {}

    const savedWizardData = localStorage.getItem('th_goal_wizard_data');
    if (savedWizardData) {
      try {
        const parsed = JSON.parse(savedWizardData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error loading saved wizard data', e);
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('th_goal_wizard_data', JSON.stringify(formData));
  }, [formData]);

  const calculateCalories = () => {
    let bmr = formData.gender === "male"
      ? 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5
      : 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
    const multipliers: Record<string, number> = { 
      sedentary: 1.2,
      light: 1.375, 
      moderate: 1.55, 
      active: 1.725, 
      veryActive: 1.9 
    };
    let calories = bmr * (multipliers[formData.activityLevel] || 1.2);
    if (formData.goal === "lose") calories *= 0.8;
    if (formData.goal === "gain") calories *= 1.15;
    return Math.round(calories);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMacroChange = (macro: "proteinPercentage" | "carbsPercentage" | "fatsPercentage", value: number) => {
    const newFormData = { ...formData, [macro]: value };
    const macroFields: ("proteinPercentage" | "carbsPercentage" | "fatsPercentage")[] = 
      ["proteinPercentage", "carbsPercentage", "fatsPercentage"];
    const others = macroFields.filter(m => m !== macro);
    const total = newFormData.proteinPercentage + newFormData.carbsPercentage + newFormData.fatsPercentage;
    if (total !== 100) {
      const diff = 100 - total;
      const totalOthers = newFormData[others[0]] + newFormData[others[1]];
      if (totalOthers > 0) {
        newFormData[others[0]] += Math.round(diff * (newFormData[others[0]] / totalOthers));
        newFormData[others[1]] += Math.round(diff * (newFormData[others[1]] / totalOthers));
      } else {
        newFormData[others[0]] += Math.round(diff / 2);
        newFormData[others[1]] += Math.round(diff / 2);
      }
    }
    const roundedTotal = newFormData.proteinPercentage + newFormData.carbsPercentage + newFormData.fatsPercentage;
    if (roundedTotal !== 100) newFormData[others[0]] += 100 - roundedTotal;
    setFormData({ ...newFormData });
  };

  const handleCalculateCalories = () => {
    const calculated = calculateCalories();
    setFormData(prev => ({ ...prev, dailyCalories: calculated }));
    toast.success("Calories calculated", { description: `Recommended ${calculated} calories per day.` });
  };

  const applyTemplate = (templateKey: string) => {
    const template = GOAL_TEMPLATES[templateKey as keyof typeof GOAL_TEMPLATES];
    if (!template) return;
    
    const updates: Partial<FormData> = {};
    const goals = template.goals as Record<string, any>;
    
    // Apply calorie adjustment
    if ('dailyCalories' in goals && typeof goals.dailyCalories === 'number') {
      const currentCalories = calculateCalories();
      updates.dailyCalories = Math.round(currentCalories * (1 + goals.dailyCalories / 100));
    }
    
    // Apply other goals safely
    if ('proteinPercentage' in goals) updates.proteinPercentage = goals.proteinPercentage;
    if ('waterIntakeGoal' in goals) updates.waterIntakeGoal = goals.waterIntakeGoal;
    if ('sleepHoursGoal' in goals) updates.sleepHoursGoal = goals.sleepHoursGoal;
    if ('stepsGoal' in goals) updates.stepsGoal = goals.stepsGoal;
    if ('workoutDaysGoal' in goals) updates.workoutDaysGoal = goals.workoutDaysGoal;
    if ('meditationMinutesGoal' in goals) updates.meditationMinutesGoal = goals.meditationMinutesGoal;
    if ('screenTimeLimit' in goals) updates.screenTimeLimit = goals.screenTimeLimit;
    if ('includeRecoveryDays' in goals) updates.includeRecoveryDays = goals.includeRecoveryDays;
    if ('includeCheatMeals' in goals) updates.includeCheatMeals = goals.includeCheatMeals;
    
    setFormData(prev => ({ ...prev, ...updates }));
    setSelectedTemplate(templateKey);
    toast.success(`Applied "${template.name}" template!`, {
      description: "Review and adjust your goals below."
    });
  };

  const handleSubmit = async () => {
    // Save nutrition goals
    await saveNutritionGoal({
      dailyCalories: formData.dailyCalories,
      proteinPercentage: formData.proteinPercentage,
      carbsPercentage: formData.carbsPercentage,
      fatsPercentage: formData.fatsPercentage,
    });

    // Comprehensive goal saving
    const goalTexts = [
      // Nutrition Goals
      `Daily calorie target: ${formData.dailyCalories} kcal`,
      `Protein: ${formData.proteinPercentage}% (${Math.round(formData.dailyCalories * formData.proteinPercentage / 400)}g)`,
      `Carbs: ${formData.carbsPercentage}% (${Math.round(formData.dailyCalories * formData.carbsPercentage / 400)}g)`,
      `Fats: ${formData.fatsPercentage}% (${Math.round(formData.dailyCalories * formData.fatsPercentage / 900)}g)`,
      
      // Wellness Goals
      `Drink ${formData.waterIntakeGoal}L water daily`,
      `Sleep ${formData.sleepHoursGoal} hours per night`,
      `Walk ${formData.stepsGoal.toLocaleString()} steps daily`,
      `Workout ${formData.workoutDaysGoal} days per week`,
      `Meditate ${formData.meditationMinutesGoal} minutes daily`,
      `Meal prep ${formData.mealPrepDaysGoal} days per week`,
      `Screen time limit: ${formData.screenTimeLimit} hours/day`,
      
      // Health Metrics (if set)
      ...(formData.targetWeight ? [`Target weight: ${formData.targetWeight} kg`] : []),
      ...(formData.targetBodyFat ? [`Target body fat: ${formData.targetBodyFat}%`] : []),
      
      // Timeline
      `Goal timeline: ${formData.timeline}`,
      `Primary goal: ${formData.goal === 'lose' ? 'Lose weight' : formData.goal === 'gain' ? 'Gain weight' : 'Maintain weight'}`,
      `Activity level: ${formData.activityLevel}`,
      ...(formData.includeRecoveryDays ? ["Include recovery days"] : []),
      ...(formData.includeCheatMeals ? ["Allow planned cheat meals"] : []),
    ];

    const getWeekLabel = (d: Date) => {
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      return `Week of ${start.toLocaleDateString()}`;
    };

    try {
      const existing = JSON.parse(localStorage.getItem('th_saved_goals') || '[]');
      // Remove old wizard goals
      const filtered = existing.filter((g: any) => 
        !g.text.startsWith('Daily calorie target') && 
        !g.text.startsWith('Protein:') && 
        !g.text.startsWith('Carbs:') && 
        !g.text.startsWith('Fats:') &&
        !g.text.startsWith('Drink') &&
        !g.text.startsWith('Sleep') &&
        !g.text.startsWith('Walk') &&
        !g.text.startsWith('Workout') &&
        !g.text.startsWith('Meditate')
      );
      
      const newGoals = goalTexts.map(text => ({
        id: crypto.randomUUID(),
        text,
        week: getWeekLabel(new Date()),
        date: new Date().toISOString(),
        completed: false,
        category: text.includes('calorie') || text.includes('Protein') || text.includes('Carbs') || text.includes('Fats') 
          ? 'nutrition' 
          : text.includes('water') || text.includes('Sleep') || text.includes('Walk') || text.includes('Workout')
          ? 'wellness'
          : 'general'
      }));
      
      const updated = [...newGoals, ...filtered];
      localStorage.setItem('th_saved_goals', JSON.stringify(updated));
      
      // Save goal wizard completion
      localStorage.setItem('th_goal_wizard_completed', new Date().toISOString());
      localStorage.setItem('th_goal_wizard_data', JSON.stringify(formData));
      
      window.dispatchEvent(new Event('goals-updated'));
    } catch (e) {
      console.error('Error saving goals', e);
    }

    setShowConfetti(true);
    toast.success("All goals saved successfully!", {
      description: "View and track your progress in the Goals tab."
    });
    
    setTimeout(() => {
      setShowConfetti(false);
      navigate('/progress');
    }, 3500);
  };

  const handleNext = () => {
    if (currentStep === 2) handleCalculateCalories();
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderWellnessGoalsStep = () => (
    <div className="space-y-6">
      {/* Goal Templates */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Quick Goal Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(GOAL_TEMPLATES).map(([key, template]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => applyTemplate(key)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedTemplate === key 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary">{template.icon}</span>
                <span className="font-semibold">{template.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hydration Goal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Droplet className="h-4 w-4 text-blue-500" />
              Daily Water Intake
            </CardTitle>
            <CardDescription>Stay hydrated for optimal function</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{formData.waterIntakeGoal} liters</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(formData.waterIntakeGoal * 33.8)} oz
                </span>
              </div>
              <Slider
                value={[formData.waterIntakeGoal]}
                onValueChange={([val]) => handleChange('waterIntakeGoal', val)}
                min={1}
                max={4}
                step={0.1}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: 2-3 liters for most adults
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Goal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="h-4 w-4 text-indigo-500" />
              Sleep Duration
            </CardTitle>
            <CardDescription>Quality sleep for recovery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{formData.sleepHoursGoal} hours</span>
                <span className="text-sm text-muted-foreground">per night</span>
              </div>
              <Slider
                value={[formData.sleepHoursGoal]}
                onValueChange={([val]) => handleChange('sleepHoursGoal', val)}
                min={5}
                max={9}
                step={0.5}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Aim for 7-9 hours for optimal health
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Steps Goal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Footprints className="h-4 w-4 text-green-500" />
              Daily Steps
            </CardTitle>
            <CardDescription>Stay active throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{formData.stepsGoal.toLocaleString()} steps</span>
                <span className="text-sm text-muted-foreground">
                  ~{Math.round(formData.stepsGoal * 0.05)} km
                </span>
              </div>
              <Slider
                value={[formData.stepsGoal]}
                onValueChange={([val]) => handleChange('stepsGoal', val)}
                min={3000}
                max={15000}
                step={500}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: 7,000-10,000 steps daily
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Workout Days */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-orange-500" />
              Weekly Workouts
            </CardTitle>
            <CardDescription>Consistency is key</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{formData.workoutDaysGoal} days/week</span>
                <span className="text-sm text-muted-foreground">
                  {formData.workoutDaysGoal * 30} min/week
                </span>
              </div>
              <Slider
                value={[formData.workoutDaysGoal]}
                onValueChange={([val]) => handleChange('workoutDaysGoal', val)}
                min={1}
                max={7}
                step={1}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Aim for 3-5 days with a mix of cardio and strength
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Meditation Goal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              Mindfulness Practice
            </CardTitle>
            <CardDescription>Reduce stress and improve focus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{formData.meditationMinutesGoal} minutes/day</span>
                <span className="text-sm text-muted-foreground">daily</span>
              </div>
              <Slider
                value={[formData.meditationMinutesGoal]}
                onValueChange={([val]) => handleChange('meditationMinutesGoal', val)}
                min={0}
                max={30}
                step={5}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Even 5-10 minutes daily shows benefits
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Screen Time Limit */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-red-500" />
              Screen Time Limit
            </CardTitle>
            <CardDescription>Reduce digital fatigue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{formData.screenTimeLimit} hours/day</span>
                <span className="text-sm text-muted-foreground">excluding work</span>
              </div>
              <Slider
                value={[formData.screenTimeLimit]}
                onValueChange={([val]) => handleChange('screenTimeLimit', val)}
                min={1}
                max={8}
                step={0.5}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Reduce blue light exposure 2 hours before bed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Metrics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Health Metrics (Optional)
          </CardTitle>
          <CardDescription>
            Set specific targets for body composition
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">Target Weight (kg)</Label>
              <input
                type="number"
                value={formData.targetWeight || ''}
                onChange={(e) => handleChange('targetWeight', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Optional"
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
              />
            </div>
            <div>
              <Label className="text-sm">Target Body Fat (%)</Label>
              <input
                type="number"
                value={formData.targetBodyFat || ''}
                onChange={(e) => handleChange('targetBodyFat', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Optional"
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-sm">Target Waist (cm)</Label>
              <input
                type="number"
                value={formData.targetWaistCircumference || ''}
                onChange={(e) => handleChange('targetWaistCircumference', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Optional"
                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lifestyle Preferences</CardTitle>
          <CardDescription>Customize your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Recovery Days</Label>
              <p className="text-sm text-muted-foreground">Schedule active recovery or rest days</p>
            </div>
            <Switch
              checked={formData.includeRecoveryDays}
              onCheckedChange={(checked) => handleChange('includeRecoveryDays', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Planned Cheat Meals</Label>
              <p className="text-sm text-muted-foreground">Incorporate flexibility for sustainability</p>
            </div>
            <Switch
              checked={formData.includeCheatMeals}
              onCheckedChange={(checked) => handleChange('includeCheatMeals', checked)}
            />
          </div>

          <div>
            <Label>Goal Timeline</Label>
            <select
              value={formData.timeline}
              onChange={(e) => handleChange('timeline', e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
            >
              <option value="4 weeks">4 weeks (Short-term)</option>
              <option value="8 weeks">8 weeks (Medium-term)</option>
              <option value="12 weeks">12 weeks (Standard)</option>
              <option value="24 weeks">24 weeks (Long-term)</option>
              <option value="1 year">1 year (Lifestyle change)</option>
            </select>
          </div>

          <div>
            <Label>Motivation Level (1-10)</Label>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm">1</span>
              <Slider
                value={[formData.motivationLevel]}
                onValueChange={([val]) => handleChange('motivationLevel', val)}
                min={1}
                max={10}
                step={1}
                className="flex-1 cursor-pointer"
              />
              <span className="text-sm">10</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {formData.motivationLevel <= 3 ? "Start with small, achievable goals" :
               formData.motivationLevel <= 6 ? "Good foundation - you've got this!" :
               "High motivation - great time for ambitious goals!"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Confetti active={showConfetti} />
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-2">
            {steps[currentStep - 1].icon}
            Step {currentStep} of {steps.length}
          </span>
          <span className="font-medium text-primary">{steps[currentStep - 1].title}</span>
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
      </div>
      
      {/* Step Content */}
      <Card className="animate-fade-in border-primary/20">
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <NutritionGoalForm formData={formData} onChange={handleChange} />
              )}
              {currentStep === 2 && (
                <CalorieGoalStep 
                  formData={formData} 
                  calculateCalories={calculateCalories} 
                  onChange={handleChange} 
                />
              )}
              {currentStep === 3 && (
                <MacroStep 
                  formData={formData} 
                  onMacroChange={handleMacroChange} 
                />
              )}
              {currentStep === 4 && renderWellnessGoalsStep()}
              {currentStep === 5 && (
                <ReviewGoalsStep 
                  formData={formData}
                  enhanced={true}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        {currentStep < steps.length ? (
          <Button 
            onClick={handleNext} 
            className="bg-gradient-to-r from-primary to-primary/80 group"
          >
            Continue
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Complete & Save Goals
          </Button>
        )}
      </div>
    </div>
  );
};

export default GoalWizard;