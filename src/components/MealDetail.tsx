
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/SupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Clock, Users, Star, Heart } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TabsTrigger } from '@/components/ui/scrollable-tabs';
import { ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { getMealImagePublicUrl } from '@/services/mealService';
import { useLanguage } from '@/contexts/LanguageContext';
import { addToFavorites, isFavorite } from '@/services/favoriteService';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface MealDetailProps {
  mealId: string;
  onBack: () => void;
  onAddToMealPlan: (mealId: string) => void;
  renderFavoriteButton?: (mealId: string) => React.ReactNode;
}

interface Ingredient {
  id: string;
  meal_id: string;
  ingredients: string;
}

interface NutritionFacts {
  id: string;
  meal_id: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  serving_size: string;
  total_fat?: string;
  saturated_fat?: string;
  trans_fat?: string;
  cholesterol?: string;
  sodium?: string;
  total_carbohydrate?: string;
  dietary_fiber?: string;
  total_sugars?: string;
  added_sugars?: string;
  additional_nutrients?: Record<string, string>;
}

interface Recipe {
  id: string;
  meal_id: string;
  instructions: string;
}

interface Meal {
  id: string;
  meal_name: string;
  image_url: string;
  description?: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty?: number;
  category_name?: string;
  subcategory_name?: string;
}

const MealDetail: React.FC<MealDetailProps> = ({
  mealId,
  onBack,
  onAddToMealPlan,
  renderFavoriteButton,
}) => {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient | null>(null);
  const [nutrition, setNutrition] = useState<NutritionFacts | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

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
    const fetchMealDetails = async () => {
      setLoading(true);
      try {
        // Fetch the meal
        const { data: mealData, error: mealError } = await supabase
          .from('meals')
          .select(`
            *,
            meal_categories(name),
            meal_subcategories(name)
          `)
          .eq('id', mealId)
          .single();

        if (mealError) throw mealError;
        
        setMeal({
          ...mealData,
          category_name: mealData.meal_categories?.name,
          subcategory_name: mealData.meal_subcategories?.name
        });

        // Get the image URL using the mealService function
        if (mealData?.image_url) {
          try {
            const imageUrl = await getMealImagePublicUrl(mealId);
            console.log("Fetched meal image URL:", imageUrl); // Debug log
            if (imageUrl) {
              setImageUrl(imageUrl);
            }
          } catch (imageError) {
            console.error('Error getting image URL:', imageError);
          }
        }

        // Fetch ingredients
        const { data: ingredientsData } = await supabase
          .from('ingredients')
          .select('*')
          .eq('meal_id', mealId)
          .maybeSingle();

        setIngredients(ingredientsData);

        // Fetch nutrition
        const { data: nutritionData } = await supabase
          .from('nutrition_facts')
          .select('*')
          .eq('meal_id', mealId)
          .maybeSingle();

        setNutrition(nutritionData);

        // Fetch recipe
        const { data: recipeData } = await supabase
          .from('recipes')
          .select('*')
          .eq('meal_id', mealId)
          .maybeSingle();
        
        setRecipe(recipeData);

        // Check favorite status
        const favorited = await isFavorite(mealId);
        setIsFavorited(favorited);

      } catch (error) {
        console.error('Error fetching meal details:', error);
        toast.error('Failed to load meal details');
      } finally {
        setLoading(false);
      }
    };

    if (mealId) {
      fetchMealDetails();
    }
  }, [mealId]);

  const handleToggleFavorite = async () => {
    if (favoriteLoading) return;
    
    setFavoriteLoading(true);
    try {
      await addToFavorites(mealId);
      setIsFavorited(true);
      toast.success('Added to favorites');
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error('Failed to add to favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <div className="space-y-4 w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-48 w-full rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="p-6">
        <p>Meal not found.</p>
        <Button onClick={onBack} variant="outline" className="mt-4 flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" /> {t.back}
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {renderFavoriteButton && renderFavoriteButton(mealId)}
      
      <div className="relative h-48 sm:h-64 overflow-hidden rounded-lg mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={meal.meal_name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm shadow-sm"
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{meal.meal_name}</h2>
            {(meal.category_name || meal.subcategory_name) && (
              <div className="flex flex-wrap gap-2 mt-1">
                {meal.category_name && (
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    {meal.category_name}
                  </span>
                )}
                {meal.subcategory_name && (
                  <span className="bg-green-100 px-2 py-1 rounded-full text-xs font-medium text-green-700">
                    {meal.subcategory_name}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleToggleFavorite} 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              className={isFavorited ? "bg-red-50" : ""}
              disabled={favoriteLoading}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
              {!(isMobile || isTablet) && (
                <span className="ml-2">{isFavorited ? t.favorited : t.addToFavorites}</span>
              )}
            </Button>
            <Button 
              onClick={() => onAddToMealPlan(mealId)} 
              size={isMobile ? "sm" : "default"}
            >
              {!(isMobile || isTablet) ? t.addToMealPlan : (
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                </span>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-6">
          <ScrollableTabsList>
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="nutrition">{t.nutrition}</TabsTrigger>
            <TabsTrigger value="recipe">{t.recipe}</TabsTrigger>
          </ScrollableTabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            {meal.description && <p className="text-gray-700">{meal.description}</p>}
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{t.prepTime} {meal.prep_time || t.notAvailable} {meal.prep_time ? t.min : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{t.cookTime} {meal.cook_time || t.notAvailable} {meal.cook_time ? t.min : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{t.servings} {meal.servings || t.notAvailable}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{t.difficulty}</span>
                {meal.difficulty ? renderDifficultyStars(meal.difficulty) : t.notAvailable}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.nutritionFacts}</CardTitle>
              </CardHeader>
              <CardContent>
                {nutrition ? (
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-1">
                      <span>{t.servingSize}</span>
                      <span>{nutrition.serving_size || '-'}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>{t.calories}</span>
                      <span>{nutrition.calories || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.protein}</span>
                      <span>{nutrition.protein || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.carbs}</span>
                      <span>{nutrition.total_carbohydrate || nutrition.carbs || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.fat}</span>
                      <span>{nutrition.total_fat || nutrition.fat || '-'}</span>
                    </div>
                    
                    {nutrition.dietary_fiber && (
                      <div className="flex justify-between">
                        <span className="pl-4">Dietary Fiber</span>
                        <span>{nutrition.dietary_fiber}</span>
                      </div>
                    )}
                    
                    {nutrition.total_sugars && (
                      <div className="flex justify-between">
                        <span className="pl-4">Total Sugars</span>
                        <span>{nutrition.total_sugars}</span>
                      </div>
                    )}
                    
                    {nutrition.added_sugars && (
                      <div className="flex justify-between">
                        <span className="pl-4">Added Sugars</span>
                        <span>{nutrition.added_sugars}</span>
                      </div>
                    )}
                    
                    {nutrition.saturated_fat && (
                      <div className="flex justify-between">
                        <span className="pl-4">Saturated Fat</span>
                        <span>{nutrition.saturated_fat}</span>
                      </div>
                    )}
                    
                    {nutrition.trans_fat && (
                      <div className="flex justify-between">
                        <span className="pl-4">Trans Fat</span>
                        <span>{nutrition.trans_fat}</span>
                      </div>
                    )}
                    
                    {nutrition.cholesterol && (
                      <div className="flex justify-between">
                        <span className="pl-4">Cholesterol</span>
                        <span>{nutrition.cholesterol}</span>
                      </div>
                    )}
                    
                    {nutrition.sodium && (
                      <div className="flex justify-between">
                        <span className="pl-4">Sodium</span>
                        <span>{nutrition.sodium}</span>
                      </div>
                    )}
                    
                    {nutrition.additional_nutrients && Object.entries(nutrition.additional_nutrients).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="pl-4">{key.replace(/_/g, ' ')}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">{t.notAvailable}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipe" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.ingredients}</CardTitle>
              </CardHeader>
              <CardContent>
                {ingredients && ingredients.ingredients ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {ingredients.ingredients.split('\n').map((ingredient, index) => (
                      <li key={index}>{ingredient.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">{t.notAvailable}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.instructions}</CardTitle>
              </CardHeader>
              <CardContent>
                {recipe && recipe.instructions ? (
                  <ol className="list-decimal pl-5 space-y-2">
                    {recipe.instructions.split('\n').map((step, index) => (
                      <li key={index} className="pl-1">{step.trim()}</li>
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
    </div>
  );
};

export default MealDetail;
