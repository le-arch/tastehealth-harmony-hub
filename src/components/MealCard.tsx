"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "./FavoriteButton";
import { Utensils, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface MealCardProps {
  meal: {
    id: string;
    meal_name: string;
    image_url: string;
    description?: string;
    category_name?: string;
    subcategory_name?: string;
  };
  onAddToMealPlan?: (mealId: string) => void;
  onViewDetails?: (mealId: string) => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (mealId: string) => void;
}

export function MealCard({
  meal,
  onAddToMealPlan,
  onViewDetails,
  isSelectable = false,
  isSelected = false,
  onToggleSelect,
}: MealCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col relative">
      {isSelectable && (
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={() => onToggleSelect?.(meal.id)}
        >
          <div className="absolute top-2 left-2">
            <Checkbox
              checked={isSelected}
              className={`h-5 w-5 ${
                isSelected
                  ? "bg-primary border-primary"
                  : "bg-white/80 backdrop-blur-sm"
              }`}
            />
          </div>
        </div>
      )}

      <div className="relative">
        <img
          src={meal.image_url || "../assets/images/achu.jpg"}
          alt={meal.meal_name}
          className="w-full h-48 object-cover"
        />
        {/* Position the favorite button in the top-right corner */}
        <div
          className="absolute top-2 right-2 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <FavoriteButton
            mealId={meal.id}
            className="bg-white/80 backdrop-blur-sm shadow-sm"
          />
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <h3 className="text-lg font-semibold line-clamp-1">{meal.meal_name}</h3>
        <div className="flex gap-2 text-xs text-muted-foreground">
          {meal.category_name && (
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-gray-900 dark:text-gray-100">
              {meal.category_name}
            </span>
          )}
          {meal.subcategory_name && (
            <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
              {meal.subcategory_name}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {meal.description || "No description available"}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails?.(meal.id)}
          disabled={isSelectable}
        >
          <Utensils className="mr-1 h-4 w-4" />
          Details
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => onAddToMealPlan?.(meal.id)}
          disabled={isSelectable}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add to Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
