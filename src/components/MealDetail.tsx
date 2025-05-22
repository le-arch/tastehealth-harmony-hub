
"use client";

import type React from "react";
import { useScreenSize } from "@/utils/mobile";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMealDetails } from "@/services/mealService";
import { ArrowLeft } from "lucide-react";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { addToFavorites, isFavorite } from "@/services/favoriteService";

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

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (mealId) {
        const favorited = await isFavorite(mealId);
        setIsFavorited(favorited);
      }
    };

    checkFavoriteStatus();
  }, [mealId]);

  const handleToggleFavorite = async () => {
    setFavoriteLoading(true);
    try {
      await addToFavorites(mealId);
      setIsFavorited(true);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching meal details:", error);
    }
  }, [error]);

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
          <ArrowLeft className="h-4 w-4" /> Back to search
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
          <ArrowLeft className="h-4 w-4" /> Back to search
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
              (isFavorited ? "Favorited" : "Add to Favorites")}
          </Button>

          {onAddToMealPlan && (
            <Button onClick={() => onAddToMealPlan(mealId)} variant="default">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {!(isMobile || isTablet) && <span>Add to Meal Plan</span>}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {meal.meal_name}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-900 dark:text-gray-900">
                {meal.category_name}
              </span>
              <span className="bg-th-green-100 text-th-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {meal.subcategory_name}
              </span>
            </div>

            <div className="h-48 md:h-64 bg-gray-200 rounded-md overflow-hidden">
              <div className="relative">
                {renderFavoriteButton && renderFavoriteButton(mealId)}
                <img
                  src={meal.image_url || "/assets/images/achu.jpg"}
                  alt={meal.meal_name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              </div>
            </div>
          </div>

          {recipe && (
            <Card>
              <CardHeader>
                <CardTitle>Recipe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Ingredients</h3>
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li
                          key={index}
                          className="text-gray-700 dark:text-gray-100"
                        >
                          {ingredient.quantity && `${ingredient.quantity} `}
                          {ingredient.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No ingredients listed.</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Instructions</h3>
                  {recipe.instructions ? (
                    <p className="text-gray-700 dark:text-gray-100 whitespace-pre-line">
                      {recipe.instructions}
                    </p>
                  ) : (
                    <p className="text-gray-100 dark:text-gray-100">
                      No instructions provided.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          {nutritionFacts && (
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-lg">Nutrition Facts</CardTitle>
                <p className="text-sm text-gray-500">
                  Serving Size: {nutritionFacts.serving_size}
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-bold">Calories</td>
                      <td className="py-2 text-right">
                        {nutritionFacts.calories}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <span className="font-bold">Total Fat</span>{" "}
                        {nutritionFacts.total_fat}
                      </td>
                      <td className="py-2 text-right">
                        {nutritionFacts.total_fat}
                      </td>
                    </tr>
                    <tr className="border-b pl-4">
                      <td className="py-2 pl-4">Saturated Fat</td>
                      <td className="py-2 text-right">
                        {nutritionFacts.saturated_fat}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pl-4">Trans Fat</td>
                      <td className="py-2 text-right">
                        {nutritionFacts.trans_fat}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <span className="font-bold">Cholesterol</span>
                      </td>
                      <td className="py-2 text-right">
                        {nutritionFacts.cholesterol}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <span className="font-bold">Sodium</span>
                      </td>
                      <td className="py-2 text-right">
                        {nutritionFacts.sodium}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <span className="font-bold">Total Carbohydrate</span>
                      </td>
                      <td className="py-2 text-right">
                        {nutritionFacts.total_carbohydrate}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pl-4">Dietary Fiber</td>
                      <td className="py-2 text-right">
                        {nutritionFacts.dietary_fiber}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pl-4">Total Sugars</td>
                      <td className="py-2 text-right">
                        {nutritionFacts.total_sugars}
                      </td>
                    </tr>
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
                        <span className="font-bold">Protein</span>
                      </td>
                      <td className="py-2 text-right">
                        {nutritionFacts.protein}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
