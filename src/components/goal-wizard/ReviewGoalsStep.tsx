import React from "react";

interface Props {
  formData: any;
}

const ReviewGoalsStep: React.FC<Props> = ({ formData }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold">Review Your Nutrition Goals</h2>
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-md">
        <h3 className="font-medium mb-3">Daily Calorie Goal</h3>
        <div className="text-2xl font-bold">{formData.dailyCalories} kcal</div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Macronutrient Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-nutrition-protein/10 p-4 rounded-md text-center">
            <div className="text-sm text-muted-foreground">Protein</div>
            <div className="text-xl font-bold">{formData.proteinPercentage}%</div>
            <div className="text-sm">{Math.round((formData.dailyCalories * formData.proteinPercentage / 100) / 4)}g</div>
          </div>
          <div className="bg-nutrition-carbs/10 p-4 rounded-md text-center">
            <div className="text-sm text-muted-foreground">Carbs</div>
            <div className="text-xl font-bold">{formData.carbsPercentage}%</div>
            <div className="text-sm">{Math.round((formData.dailyCalories * formData.carbsPercentage / 100) / 4)}g</div>
          </div>
          <div className="bg-nutrition-fats/10 p-4 rounded-md text-center">
            <div className="text-sm text-muted-foreground">Fats</div>
            <div className="text-xl font-bold">{formData.fatsPercentage}%</div>
            <div className="text-sm">{Math.round((formData.dailyCalories * formData.fatsPercentage / 100) / 9)}g</div>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <p className="text-sm text-muted-foreground">
          These goals will be used to provide personalized recommendations throughout the app.
          You can always update them later if your needs change.
        </p>
      </div>
    </div>
  </div>
);

export default ReviewGoalsStep;
