
import type React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MealDetailProps {
  mealId: string;
  onBack: () => void;
  onAddToMealPlan: (mealId: string) => void;
  renderFavoriteButton?: (mealId: string) => React.ReactNode;
}

const MealDetail = ({ mealId, onBack }: MealDetailProps) => {
  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <div className="text-center py-12">
        <p className="text-muted-foreground">Meal details unavailable - database features have been removed.</p>
      </div>
    </div>
  );
};

export default MealDetail;
