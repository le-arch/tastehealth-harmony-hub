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
import ProfileSidebar from "@/components/profile/ProfileSidebar";

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
    setShowConfetti(true);
    toast.success("Goals saved successfully!");
    setTimeout(() => navigate("/games"), 3000);
  };

  const handleNext = () => {
    if (currentStep === 2) handleCalculateCalories();
    if (currentStep < steps.length) { setCurrentStep(currentStep + 1); window.scrollTo(0, 0); }
  };

  const handlePrevious = () => {
    if (currentStep > 1) { setCurrentStep(currentStep - 1); window.scrollTo(0, 0); }
  };

  return (
    <div className="mx-auto space-y-8 flex">
      <ProfileSidebar activePage="goals" />
      <Confetti active={showConfetti} />
      <div className="settings-page ml-16 md:ml-64 w-full transition-all duration-300 ease-in-out">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Personalized Nutrition Goal Wizard</h1>
          <p className="text-muted-foreground">Set your nutrition goals in just a few steps.</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep} of {steps.length}</span>
            <span>{steps[currentStep - 1].title}</span>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>
        <Card className="nutrition-card animate-fade-in">
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
            <Button onClick={handleNext}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">Save Goals</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalWizard;
