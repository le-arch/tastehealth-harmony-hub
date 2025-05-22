
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
import { useScreenSize } from "@/utils/mobile";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const MealPlanningPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const { toast } = useToast();
  const { isMobile, isTablet } = useScreenSize();
  const isSmallScreen = isMobile || isTablet;
  const { language } = useLanguage();

  const translations = {
    en: {
      back: "Back",
      mealPlanning: "Meal Planning",
      favorites: "Favorites",
      yourMealPlans: "Your Meal Plans",
      browseMeals: "Browse Meals",
      addedToFavorites: "Added to favorites",
      removedFromFavorites: "Removed from favorites",
      mealAddedToFavorites: "This meal has been added to your favorites",
      mealRemovedFromFavorites: "This meal has been removed from your favorites"
    },
    fr: {
      back: "Retour",
      mealPlanning: "Planification des Repas",
      favorites: "Favoris",
      yourMealPlans: "Vos Plans de Repas",
      browseMeals: "Parcourir les Repas",
      addedToFavorites: "Ajouté aux favoris",
      removedFromFavorites: "Retiré des favoris",
      mealAddedToFavorites: "Ce repas a été ajouté à vos favoris",
      mealRemovedFromFavorites: "Ce repas a été retiré de vos favoris"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

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
      title: isFavorited ? t.addedToFavorites : t.removedFromFavorites,
      description: isFavorited
        ? t.mealAddedToFavorites
        : t.mealRemovedFromFavorites,
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
            {!isSmallScreen && <span className="ml-1">{t.back}</span>}
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">{t.mealPlanning}</h1>
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
                {t.favorites}
              </Button>
              <CreateMealPlanDialog />
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            {t.yourMealPlans}
          </h2>
          <div className="card-scroll-container">
            <div className="card-scroll-content">
              <MealPlanList />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            {t.browseMeals}
          </h2>
          {selectedMealId ? (
            <Card className="overflow-hidden">
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
            </Card>
          ) : (
            <div className="table-scroll-container">
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
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MealPlanningPage;
