
"use client";

import type React from "react";
import { useScreenSize } from "@/utils/mobile";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMealDetails, getMealImagePublicUrl } from "@/services/mealService";
import { ArrowLeft, Clock, Users, Star } from "lucide-react";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { addToFavorites, isFavorite } from "@/services/favoriteService";
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { toast } from "sonner";

interface MealDetailProps {
  mealId: string;
  onBack: () => void;
  onAddToMealPlan: (mealId: string) => void;
  renderFavoriteButton?: (mealId: string) => React.ReactNode;
}

const MealDetail = ({
  mealId,
  onBack,
  onAddToMealPlan,
  renderFavoriteButton,
}: MealDetailProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: () => getMealDetails(mealId),
    enabled: !!mealId,
  });
  const { isMobile, isTablet } = useScreenSize();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations = {
    en: {
      back: "Back",
      addToMealPlan: "Add to Meal Plan",
      overview: "Overview",
      nutrition: "Nutrition",
      recipe: "Recipe",
      prepTime: "Prep Time:",
      cookTime: "Cook Time:",
      servings: "Servings:",
      difficulty: "Difficulty:",
      min: "min",
      nutritionFacts: "Nutrition Facts",
      servingSize: "Serving Size",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
      ingredients: "Ingredients",
      instructions: "Instructions",
      notAvailable: "Not available",
      addToFavorites: "Add to Favorites",
      favorited: "Favorited"
    },
    fr: {
      back: "Retour",
      addToMealPlan: "Ajouter au Plan de Repas",
      overview: "Aperçu",
      nutrition: "Nutrition",
      recipe: "Recette",
      prepTime: "Temps de Préparation:",
      cookTime: "Temps de Cuisson:",
      servings: "Portions:",
      difficulty: "Difficulté:",
      min: "min",
      nutritionFacts: "Informations Nutritionnelles",
      servingSize: "Portion",
      calories: "Calories",
      protein: "Protéines",
      carbs: "Glucides",
      fat: "Lipides",
      ingredients: "Ingrédients",
      instructions: "Instructions",
      notAvailable: "Non disponible",
      addToFavorites: "Ajouter aux favoris",
      favorited: "Favori"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (mealId) {
        const favorited = await isFavorite(mealId);
        setIsFavorited(favorited);
      }
    };

    checkFavoriteStatus();
  }, [mealId]);

  useEffect(() => {
    const fetchMealImage = async () => {
      if (mealId) {
        try {
          const url = await getMealImagePublicUrl(mealId);
          console.log("Fetched meal image URL:", url);
          if (url) {
            setImageUrl(url);
          }
        } catch (error) {
          console.error("Error fetching meal image:", error);
        }
      }
    };

    fetchMealImage();
  }, [mealId]);

  const handleToggleFavorite = async () => {
    setFavoriteLoading(true);
    try {
      await addToFavorites(mealId);
      setIsFavorited(true);
      toast.success("Added to favorites");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to add to favorites");
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching meal details:", error);
      toast.error("Failed to load meal details");
    }
  }, [error]);

  const renderDifficultyStars = (difficulty: number = 1) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < difficulty ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-500">Meal not found.</p>
        </div>
      </div>
    );
  }

  const { meal, recipe, nutritionFacts } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={handleToggleFavorite}
            variant="outline"
            className={`flex items-center gap-2 ${
              isFavorited ? "text-red-500 border-red-500 hover:bg-red-50" : ""
            }`}
            disabled={favoriteLoading}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500" : ""}`} />
            {!(isMobile || isTablet) &&
              (isFavorited ? t.favorited : t.addToFavorites)}
          </Button>

          {onAddToMealPlan && (
            <Button onClick={() => onAddToMealPlan(mealId)} variant="default">
              <Users className="h-4 w-4 mr-2" />
              {!(isMobile || isTablet) && <span>{t.addToMealPlan}</span>}
            </Button>
          )}
        </div>
      </div>

      <div className="relative h-48 md:h-64 bg-gray-200 rounded-md overflow-hidden">
        {renderFavoriteButton && renderFavoriteButton(mealId)}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={meal.meal_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      
      <div>
        <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {meal.meal_name}
        </h1>
        
        {(meal.category_name || meal.subcategory_name) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {meal.category_name && (
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-900 dark:text-gray-900">
                {meal.category_name}
              </span>
            )}
            {meal.subcategory_name && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {meal.subcategory_name}
              </span>
            )}
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <ScrollableTabsList>
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="nutrition">{t.nutrition}</TabsTrigger>
          <TabsTrigger value="recipe">{t.recipe}</TabsTrigger>
        </ScrollableTabsList>
        
        <TabsContent value="overview" className="mt-4">
          {meal.description && <p className="text-gray-700 mb-4">{meal.description}</p>}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {meal.prep_time !== undefined && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{t.prepTime} {meal.prep_time} {t.min}</span>
              </div>
            )}
            {meal.cook_time !== undefined && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{t.cookTime} {meal.cook_time} {t.min}</span>
              </div>
            )}
            {meal.servings !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{t.servings} {meal.servings}</span>
              </div>
            )}
            {meal.difficulty !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-sm">{t.difficulty}</span>
                {renderDifficultyStars(meal.difficulty)}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-4">
          {nutritionFacts ? (
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-lg">{t.nutritionFacts}</CardTitle>
                {nutritionFacts.serving_size && (
                  <p className="text-sm text-gray-500">
                    {t.servingSize}: {nutritionFacts.serving_size}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-bold">{t.calories}</td>
                      <td className="py-2 text-right">
                        {nutritionFacts.calories || "-"}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <span className="font-bold">{t.fat}</span>
                      </td>
                      <td className="py-2 text-right">
                        {nutritionFacts.total_fat || nutritionFacts.fat || "-"}
                      </td>
                    </tr>
                    {nutritionFacts.saturated_fat && (
                      <tr className="border-b pl-4">
                        <td className="py-2 pl-4">Saturated Fat</td>
                        <td className="py-2 text-right">
                          {nutritionFacts.saturated_fat}
                        </td>
                      </tr>
                    )}
                    {nutritionFacts.trans_fat && (
                      <tr className="border-b">
                        <td className="py-2 pl-4">Trans Fat</td>
                        <td className="py-2 text-right">
                          {nutritionFacts.trans_fat}
                        </td>
                      </tr>
                    )}
                    {nutritionFacts.cholesterol && (
                      <tr className="border-b">
                        <td className="py-2">
                          <span className="font-bold">Cholesterol</span>
                        </td>
                        <td className="py-2 text-right">
                          {nutritionFacts.cholesterol}
                        </td>
                      </tr>
                    )}
                    {nutritionFacts.sodium && (
                      <tr className="border-b">
                        <td className="py-2">
                          <span className="font-bold">Sodium</span>
                        </td>
                        <td className="py-2 text-right">
                          {nutritionFacts.sodium}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b">
                      <td className="py-2">
                        <span className="font-bold">{t.carbs}</span>
                      </td>
                      <td className="py-2 text-right">
                        {nutritionFacts.total_carbohydrate || nutritionFacts.carbs || "-"}
                      </td>
                    </tr>
                    {nutritionFacts.dietary_fiber && (
                      <tr className="border-b">
                        <td className="py-2 pl-4">Dietary Fiber</td>
                        <td className="py-2 text-right">
                          {nutritionFacts.dietary_fiber}
                        </td>
                      </tr>
                    )}
                    {nutritionFacts.total_sugars && (
                      <tr className="border-b">
                        <td className="py-2 pl-4">Total Sugars</td>
                        <td className="py-2 text-right">
                          {nutritionFacts.total_sugars}
                        </td>
                      </tr>
                    )}
                    {nutritionFacts.added_sugars && (
                      <tr className="border-b">
                        <td className="py-2 pl-8">Added Sugars</td>
                        <td className="py-2 text-right">
                          {nutritionFacts.added_sugars}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b">
                      <td className="py-2">
                        <span className="font-bold">{t.protein}</span>
                      </td>
                      <td className="py-2 text-right">
                        {nutritionFacts.protein || "-"}
                      </td>
                    </tr>
                    {nutritionFacts.additional_nutrients &&
                      Object.entries(nutritionFacts.additional_nutrients).map(
                        ([key, value]) => (
                          <tr key={key} className="border-b">
                            <td className="py-2">{key.replace(/_/g, " ")}</td>
                            <td className="py-2 text-right">{value}</td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ) : (
            <p className="text-gray-500">{t.notAvailable}</p>
          )}
        </TabsContent>

        <TabsContent value="recipe" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.ingredients}</CardTitle>
            </CardHeader>
            <CardContent>
              {recipe?.ingredients?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="text-gray-700 dark:text-gray-100"
                    >
                      {ingredient.quantity && `${ingredient.quantity} `}
                      {ingredient.meal}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">{t.notAvailable}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t.instructions}</CardTitle>
            </CardHeader>
            <CardContent>
              {recipe?.instructions ? (
                <ol className="list-decimal pl-5 space-y-2">
                  {recipe.instructions.split('\n').map((step, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-100 pl-1">
                      {step.trim()}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-500">{t.notAvailable}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MealDetail;
