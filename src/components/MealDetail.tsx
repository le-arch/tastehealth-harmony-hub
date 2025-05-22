
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/SupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Clock, Users, Star } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TabsTrigger } from '@/components/ui/scrollable-tabs';
import { ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { getMealImagePublicUrl } from '@/services/mealService';
import { useLanguage } from '@/contexts/LanguageContext';

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
      notAvailable: "Not available"
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
      notAvailable: "Non disponible"
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
          .select('*')
          .eq('id', mealId)
          .single();

        if (mealError) throw mealError;
        setMeal(mealData);

        // Get the image URL
        if (mealData?.image_url) {
          const url = await getMealImagePublicUrl(mealId);
          setImageUrl(url);
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

      } catch (error) {
        console.error('Error fetching meal details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mealId) {
      fetchMealDetails();
    }
  }, [mealId]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="p-6">
        <p>Meal not found.</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          {t.back}
        </Button>
      </div>
    );
  }

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

  return (
    <div className="relative">
      {renderFavoriteButton && renderFavoriteButton(mealId)}
      
      <div className="relative h-48 overflow-hidden">
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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{meal.meal_name}</h2>
          <Button onClick={() => onAddToMealPlan(mealId)} size="sm">
            {t.addToMealPlan}
          </Button>
        </div>

        <Tabs defaultValue="overview" className="mt-4">
          <ScrollableTabsList>
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="nutrition">{t.nutrition}</TabsTrigger>
            <TabsTrigger value="recipe">{t.recipe}</TabsTrigger>
          </ScrollableTabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            {meal.description && <p>{meal.description}</p>}
            
            <div className="grid grid-cols-2 gap-4">
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
                      <span>{nutrition.carbs || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.fat}</span>
                      <span>{nutrition.fat || '-'}</span>
                    </div>
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
