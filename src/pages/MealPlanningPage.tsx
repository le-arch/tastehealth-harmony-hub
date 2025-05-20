
"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart, Plus } from "lucide-react";
import MealSearch from "@/components/MealSearch";
import MealDetail from "@/components/MealDetail";
import { CreateMealPlanDialog } from "@/components/CreateMealPlanDialog";
import { MealPlanList } from "@/components/MealPlanList";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

const MealPlanningPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isSmallScreen = isMobile || isTablet;

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleSelectMeal = (mealId: string) => {
    setSelectedMealId(mealId);
  };

  const handleBackToSearch = () => {
    setSelectedMealId(null);
  };

  const handleAddToMealPlan = (mealId: string) => {
    console.log(`Adding meal ${mealId} to meal plan`);
    setSelectedMealId(null);
  };

  const handleToggleFavorite = (mealId: string, isFavorited: boolean) => {
    toast({
      title: isFavorited ? "Added to favorites" : "Removed from favorites",
      description: isFavorited
        ? "This meal has been added to your favorites"
        : "This meal has been removed from your favorites",
    });
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-2 sm:mr-4"
            onClick={handleBackToDashboard}
            size={isSmallScreen ? "icon" : "default"}
          >
            <ChevronLeft className="h-4 w-4" />
            {!isSmallScreen && <span className="ml-1">Back</span>}
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Meal Planning</h1>
        </div>
        <div className="flex items-center gap-2">
          {isSmallScreen ? (
            <>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => navigate("/favorites")}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <CreateMealPlanDialog
                buttonIcon={<Plus className="h-4 w-4" />}
                buttonText=""
              />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate("/favorites")}
              >
                <Heart className="h-4 w-4" />
                Favorites
              </Button>
              <CreateMealPlanDialog />
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Your Meal Plans</h2>
          <MealPlanList />
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Browse Meals</h2>
          {selectedMealId ? (
            <MealDetail
              mealId={selectedMealId}
              onBack={handleBackToSearch}
              onAddToMealPlan={handleAddToMealPlan}
              renderFavoriteButton={(mealId) => (
                <FavoriteButton
                  mealId={mealId}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm shadow-sm z-10"
                  size={24}
                  onToggle={(isFavorited) =>
                    handleToggleFavorite(mealId, isFavorited)
                  }
                />
              )}
            />
          ) : (
            <MealSearch
              onSelectMeal={handleSelectMeal}
              renderFavoriteButton={(mealId) => (
                <FavoriteButton
                  mealId={mealId}
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm shadow-sm"
                  onToggle={(isFavorited) =>
                    handleToggleFavorite(mealId, isFavorited)
                  }
                />
              )}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default MealPlanningPage;
