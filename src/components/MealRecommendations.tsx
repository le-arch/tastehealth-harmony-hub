import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { getLS } from '@/utils/localStorage';
import { MEAL_DATABASE, MealDBItem } from '@/data/mealDatabase';

interface NutritionPrefs {
  dietType: string;
  allergies: string;
  calorieGoal: string;
}

const MealRecommendations: React.FC = () => {
  const prefs = getLS<NutritionPrefs>('th_nutrition_prefs', { dietType: 'balanced', allergies: '', calorieGoal: '2000' });
  const calorieGoal = parseInt(prefs.calorieGoal) || 2000;
  const perMealCal = Math.round(calorieGoal / 3);
  const allergies = prefs.allergies.toLowerCase().split(',').map(a => a.trim()).filter(Boolean);

  const filtered = MEAL_DATABASE.filter(m => {
    if (allergies.some(a => m.name.toLowerCase().includes(a) || m.recipe.ingredients.some(ing => ing.toLowerCase().includes(a)))) return false;
    if (prefs.dietType === 'vegan' && ['chicken', 'salmon', 'egg', 'yogurt', 'cheese', 'milk'].some(a => m.name.toLowerCase().includes(a) || m.recipe.ingredients.some(ing => ing.toLowerCase().includes(a)))) return false;
    if (prefs.dietType === 'vegetarian' && ['chicken', 'salmon', 'beef', 'fish'].some(a => m.name.toLowerCase().includes(a) || m.recipe.ingredients.some(ing => ing.toLowerCase().includes(a)))) return false;
    return true;
  });

  const recommended = filtered
    .sort((a, b) => Math.abs(a.nutrition.calories - perMealCal) - Math.abs(b.nutrition.calories - perMealCal))
    .slice(0, 4);

  if (recommended.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Recommended For You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recommended.map(meal => (
            <div key={meal.id} className="rounded-lg overflow-hidden border group cursor-pointer hover:shadow-md transition-shadow">
              <img src={meal.image} alt={meal.name} className="w-full h-20 object-cover group-hover:scale-105 transition-transform" />
              <div className="p-2">
                <p className="text-xs font-medium truncate">{meal.name}</p>
                <Badge variant="secondary" className="text-[10px] mt-1">{meal.nutrition.calories} kcal</Badge>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Based on your {prefs.dietType} diet • ~{perMealCal} kcal/meal
        </p>
      </CardContent>
    </Card>
  );
};

export default MealRecommendations;
