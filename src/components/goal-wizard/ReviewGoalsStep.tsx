
import React from "react";
import { useScreenSize } from "@/utils/mobile";

interface Props {
  formData: any;
}

const ReviewGoalsStep: React.FC<Props> = ({ formData }) => {
  const { isMobile, isTablet } = useScreenSize();
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">Review Your Nutrition Goals</h2>
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-muted/30 p-3 sm:p-4 rounded-md">
          <h3 className="font-medium mb-2 sm:mb-3">Daily Calorie Goal</h3>
          <div className="text-xl sm:text-2xl font-bold">{formData.dailyCalories} kcal</div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <h3 className="font-medium">Macronutrient Distribution</h3>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
            <div className="bg-nutrition-protein/10 p-3 sm:p-4 rounded-md text-center">
              <div className="text-sm text-muted-foreground">Protein</div>
              <div className="text-lg sm:text-xl font-bold">{formData.proteinPercentage}%</div>
              <div className="text-sm">{Math.round((formData.dailyCalories * formData.proteinPercentage / 100) / 4)}g</div>
            </div>
            <div className="bg-nutrition-carbs/10 p-3 sm:p-4 rounded-md text-center">
              <div className="text-sm text-muted-foreground">Carbs</div>
              <div className="text-lg sm:text-xl font-bold">{formData.carbsPercentage}%</div>
              <div className="text-sm">{Math.round((formData.dailyCalories * formData.carbsPercentage / 100) / 4)}g</div>
            </div>
            <div className="bg-nutrition-fats/10 p-3 sm:p-4 rounded-md text-center">
              <div className="text-sm text-muted-foreground">Fats</div>
              <div className="text-lg sm:text-xl font-bold">{formData.fatsPercentage}%</div>
              <div className="text-sm">{Math.round((formData.dailyCalories * formData.fatsPercentage / 100) / 9)}g</div>
            </div>
          </div>
        </div>
        <div className="pt-1 sm:pt-2">
          <p className="text-sm text-muted-foreground">
            These goals will be used to provide personalized recommendations throughout the app.
            You can always update them later if your needs change.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewGoalsStep;
