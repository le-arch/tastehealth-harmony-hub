import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNutrition } from "../contexts/NutritionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Confetti from "@/components/Confetti";
import { toast } from "sonner";
import NutritionGoalForm from "@/components/goal-wizard/NutritionGoalForm";
import CalorieGoalStep from "@/components/goal-wizard/CalorieGoalStep";
import MacroStep from "@/components/goal-wizard/MacroStep";
import ReviewGoalsStep from "@/components/goal-wizard/ReviewGoalsStep";

const steps = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Calorie Goals" },
  { id: 3, title: "Macronutrient Distribution" },
  { id: 4, title: "Review & Complete" },
];

interface FormData {
  age: number; weight: number; height: number; gender: string;
  activityLevel: string; goal: string; dailyCalories: number;
  proteinPercentage: number; carbsPercentage: number; fatsPercentage: number;
  [key: string]: string | number;
}

type MacroField = "proteinPercentage" | "carbsPercentage" | "fatsPercentage";

const GoalWizard = () => {
  const navigate = useNavigate();
  const { nutritionGoal, saveNutritionGoal } = useNutrition();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    age: 20, weight: 70, height: 170, gender: "female",
    activityLevel: "moderate", goal: "maintain",
    dailyCalories: nutritionGoal?.dailyCalories || 2000,
    proteinPercentage: nutritionGoal?.proteinPercentage || 30,
    carbsPercentage: nutritionGoal?.carbsPercentage || 40,
    fatsPercentage: nutritionGoal?.fatsPercentage || 30,
  });

  const calculateCalories = () => {
    let bmr = formData.gender === "male"
      ? 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5
      : 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
    const multipliers: Record<string, number> = { light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
    let calories = bmr * (multipliers[formData.activityLevel] || 1.2);
    if (formData.goal === "lose") calories *= 0.8;
    if (formData.goal === "gain") calories *= 1.15;
    return Math.round(calories);
  };

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleMacroChange = (macro: MacroField, value: number) => {
    const newFormData = { ...formData, [macro]: value };
    const macroFields: MacroField[] = ["proteinPercentage", "carbsPercentage", "fatsPercentage"];
    const others = macroFields.filter(m => m !== macro) as MacroField[];
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

  const handleSubmit = async () => {
    await saveNutritionGoal({
      dailyCalories: formData.dailyCalories,
      proteinPercentage: formData.proteinPercentage,
      carbsPercentage: formData.carbsPercentage,
      fatsPercentage: formData.fatsPercentage,
    });

    // Auto-save goals to the goals tab
    const goalTexts = [
      `Daily calorie target: ${formData.dailyCalories} kcal`,
      `Protein: ${formData.proteinPercentage}% (${Math.round(formData.dailyCalories * formData.proteinPercentage / 400)}g)`,
      `Carbs: ${formData.carbsPercentage}% (${Math.round(formData.dailyCalories * formData.carbsPercentage / 400)}g)`,
      `Fats: ${formData.fatsPercentage}% (${Math.round(formData.dailyCalories * formData.fatsPercentage / 900)}g)`,
      `Goal: ${formData.goal === 'lose' ? 'Lose weight' : formData.goal === 'gain' ? 'Gain weight' : 'Maintain weight'}`,
    ];
    const getWeekLabel = (d: Date) => {
      const start = new Date(d); start.setDate(d.getDate() - d.getDay());
      return `Week of ${start.toLocaleDateString()}`;
    };
    try {
      const existing = JSON.parse(localStorage.getItem('th_saved_goals') || '[]');
      // Remove old wizard goals
      const filtered = existing.filter((g: any) => !g.text.startsWith('Daily calorie target') && !g.text.startsWith('Protein:') && !g.text.startsWith('Carbs:') && !g.text.startsWith('Fats:') && !g.text.startsWith('Goal:'));
      const newGoals = goalTexts.map(text => ({
        id: crypto.randomUUID(),
        text,
        week: getWeekLabel(new Date()),
        date: new Date().toISOString(),
        completed: false,
      }));
      const updated = [...newGoals, ...filtered];
      localStorage.setItem('th_saved_goals', JSON.stringify(updated));
      window.dispatchEvent(new Event('goals-updated'));
    } catch {}

    setShowConfetti(true);
    toast.success("Goals saved! View them in Progress → Goals tab.");
    setTimeout(() => setShowConfetti(false), 3500);
  };

  const handleNext = () => {
    if (currentStep === 2) handleCalculateCalories();
    if (currentStep < steps.length) { setCurrentStep(currentStep + 1); }
  };

  const handlePrevious = () => {
    if (currentStep > 1) { setCurrentStep(currentStep - 1); }
  };

  return (
    <div className="space-y-6">
      <Confetti active={showConfetti} />
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {currentStep} of {steps.length}</span>
          <span className="font-medium text-primary">{steps[currentStep - 1].title}</span>
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
      </div>
      <Card className="animate-fade-in border-primary/20">
        <CardContent className="pt-6">
          {currentStep === 1 && <NutritionGoalForm formData={formData} onChange={handleChange} />}
          {currentStep === 2 && <CalorieGoalStep formData={formData} calculateCalories={calculateCalories} onChange={handleChange} />}
          {currentStep === 3 && <MacroStep formData={formData} onMacroChange={handleMacroChange} />}
          {currentStep === 4 && <ReviewGoalsStep formData={formData} />}
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>Previous</Button>
        {currentStep < steps.length ? (
          <Button onClick={handleNext} className="bg-gradient-to-r from-primary to-primary/80">Continue</Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-primary to-primary/80">Save Goals</Button>
        )}
      </div>
    </div>
  );
};

export default GoalWizard;
