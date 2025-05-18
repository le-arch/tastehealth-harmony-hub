
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNutrition } from "../contexts/NutritionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Confetti from "@/components/Confetti";
import { toast } from "sonner";
import NutritionGoalForm from "@/components/goal-wizard/NutritionGoalForm";
import CalorieGoalStep from "@/components/goal-wizard/CalorieGoalStep";
import MacroStep from "@/components/goal-wizard/MacroStep";
import ReviewGoalsStep from "@/components/goal-wizard/ReviewGoalsStep";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { useScreenSize } from "@/utils/mobile";

const steps = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Calorie Goals" },
  { id: 3, title: "Macronutrient Distribution" },
  { id: 4, title: "Review & Complete" },
];

// Define proper type for form data
interface FormData {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  goal: string;
  dailyCalories: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatsPercentage: number;
  [key: string]: string | number; // Index signature for dynamic access
}

type MacroField = "proteinPercentage" | "carbsPercentage" | "fatsPercentage";

const GoalWizard = () => {
  const navigate = useNavigate();
  const { nutritionGoal, saveNutritionGoal } = useNutrition();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const { isMobile, isTablet } = useScreenSize();

  const [formData, setFormData] = useState<FormData>({
    age: 20,
    weight: 70, // in kg
    height: 170, // in cm
    gender: "female",
    activityLevel: "moderate",
    goal: "maintain",
    dailyCalories: nutritionGoal?.dailyCalories || 2000,
    proteinPercentage: nutritionGoal?.proteinPercentage || 30,
    carbsPercentage: nutritionGoal?.carbsPercentage || 40,
    fatsPercentage: nutritionGoal?.fatsPercentage || 30,
  });

  const calculateCalories = () => {
    let bmr = 0;

    if (formData.gender === "male") {
      bmr =
        10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5;
    } else {
      bmr =
        10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
    }

    let activityMultiplier = 1.2; // sedentary
    switch (formData.activityLevel) {
      case "light":
        activityMultiplier = 1.375;
        break;
      case "moderate":
        activityMultiplier = 1.55;
        break;
      case "active":
        activityMultiplier = 1.725;
        break;
      case "veryActive":
        activityMultiplier = 1.9;
        break;
    }

    let calories = bmr * activityMultiplier;

    switch (formData.goal) {
      case "lose":
        calories = calories * 0.8; // 20% deficit
        break;
      case "gain":
        calories = calories * 1.15; // 15% surplus
        break;
    }

    return Math.round(calories);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMacroChange = (macro: MacroField, value: number) => {
    const newFormData = { ...formData };

    const macroFields: MacroField[] = [
      "proteinPercentage",
      "carbsPercentage",
      "fatsPercentage",
    ];
    newFormData[macro] = value;
    const others = macroFields.filter((m) => m !== macro) as MacroField[];
    const total =
      newFormData.proteinPercentage +
      newFormData.carbsPercentage +
      newFormData.fatsPercentage;

    if (total !== 100) {
      const diff = 100 - total;
      const totalOthers = newFormData[others[0]] + newFormData[others[1]];

      if (totalOthers > 0) {
        const ratio0 = newFormData[others[0]] / totalOthers;
        const ratio1 = newFormData[others[1]] / totalOthers;

        newFormData[others[0]] += Math.round(diff * ratio0);
        newFormData[others[1]] += Math.round(diff * ratio1);
      } else {
        newFormData[others[0]] += Math.round(diff / 2);
        newFormData[others[1]] += Math.round(diff / 2);
      }
    }

    // Adjust so all add up exactly to 100
    const roundedTotal =
      newFormData.proteinPercentage +
      newFormData.carbsPercentage +
      newFormData.fatsPercentage;
    if (roundedTotal !== 100) {
      newFormData[others[0]] += 100 - roundedTotal;
    }

    setFormData({ ...newFormData });
  };

  const handleCalculateCalories = () => {
    const calculated = calculateCalories();
    setFormData((prev) => ({ ...prev, dailyCalories: calculated }));
    toast.success("Calories calculated", {
      description: `Based on your inputs, we recommend ${calculated} calories per day.`,
    });
  };

  const handleSubmit = async () => {
    const goals = {
      dailyCalories: formData.dailyCalories,
      proteinPercentage: formData.proteinPercentage,
      carbsPercentage: formData.carbsPercentage,
      fatsPercentage: formData.fatsPercentage,
    };

    await saveNutritionGoal(goals);
    setShowConfetti(true);

    toast.success("Goals saved successfully!", {
      description: "Your nutrition goals have been updated.",
    });

    setTimeout(() => {
      navigate("/meal-builder");
    }, 3000);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      handleCalculateCalories();
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="goals" />
      <Confetti active={showConfetti} />
      
      <div className={`flex-1 p-3 sm:p-6 ${isMobile ? 'mt-14' : isTablet ? 'sm:ml-16' : 'sm:ml-64'}`}>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-3xl font-bold">
              Personalized Nutrition Goal Wizard
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Set your nutrition goals in just a few steps to get personalized
              recommendations.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span>
                Step {currentStep} of {steps.length}
              </span>
              <span className="hidden sm:block">{steps[currentStep - 1].title}</span>
            </div>
            <Progress
              value={(currentStep / steps.length) * 100}
              className="h-2"
            />
          </div>

          <Card className="nutrition-card animate-fade-in">
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
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
              {currentStep === 4 && <ReviewGoalsStep formData={formData} />}
            </CardContent>
          </Card>

          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              size={isMobile ? "sm" : "default"}
            >
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext} size={isMobile ? "sm" : "default"}>Continue</Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90"
                size={isMobile ? "sm" : "default"}
              >
                Save Goals
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalWizard;
