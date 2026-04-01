import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { getLS, LS_KEYS, ProfileData } from '@/utils/localStorage';
import { MEAL_DATABASE, MealDBItem } from '@/data/mealDatabase';

const MealRecommendations: React.FC = () => {
  const profile = getLS<ProfileData | null>(LS_KEYS.PROFILE, null);
  const prefs = getLS<any>('th_nutrition_prefs', { dietType: 'balanced', allergies: '', calorieGoal: '2000' });
  
  const calorieGoal = parseInt(profile?.calorieGoal || prefs.calorieGoal) || 2000;
  const perMealCal = Math.round(calorieGoal / 3);
  
  // Get dietary restrictions from profile
  const dietaryRestrictions = useMemo(() => {
    if (!profile?.dietaryRestrictions) return [];
    return profile.dietaryRestrictions.split(',').map(r => r.trim().toLowerCase()).filter(Boolean);
  }, [profile?.dietaryRestrictions]);

  const allergies = useMemo(() => {
    const a = (profile?.allergies || prefs.allergies || '').toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean);
    return a;
  }, [profile?.allergies, prefs.allergies]);

  const recommended = useMemo(() => {
    const filtered = MEAL_DATABASE.filter(m => {
      const nameLC = m.name.toLowerCase();
      const ingsLC = m.recipe.ingredients.map(i => i.toLowerCase());
      
      // Allergy check
      if (allergies.some((a: string) => nameLC.includes(a) || ingsLC.some(ing => ing.includes(a)))) return false;
      
      // Dietary restriction checks
      const meatKeywords = ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'bacon'];
      const fishKeywords = ['salmon', 'fish', 'tuna', 'shrimp', 'seafood'];
      const dairyKeywords = ['yogurt', 'cheese', 'milk', 'butter', 'cream'];
      const eggKeywords = ['egg'];
      const glutenKeywords = ['bread', 'pasta', 'flour', 'wheat', 'cereal', 'oat'];
      const nutKeywords = ['almond', 'walnut', 'cashew', 'peanut', 'nut', 'pecan'];
      
      const hasIngredient = (keywords: string[]) => keywords.some(k => nameLC.includes(k) || ingsLC.some(ing => ing.includes(k)));

      if (dietaryRestrictions.includes('vegan') && (hasIngredient(meatKeywords) || hasIngredient(fishKeywords) || hasIngredient(dairyKeywords) || hasIngredient(eggKeywords))) return false;
      if (dietaryRestrictions.includes('vegetarian') && (hasIngredient(meatKeywords) || hasIngredient(fishKeywords))) return false;
      if (dietaryRestrictions.includes('pescatarian') && hasIngredient(meatKeywords)) return false;
      if (dietaryRestrictions.includes('gluten-free') && hasIngredient(glutenKeywords)) return false;
      if (dietaryRestrictions.includes('dairy-free') && hasIngredient(dairyKeywords)) return false;
      if (dietaryRestrictions.includes('nut-free') && hasIngredient(nutKeywords)) return false;
      
      return true;
    });

    return filtered
      .sort((a, b) => Math.abs(a.nutrition.calories - perMealCal) - Math.abs(b.nutrition.calories - perMealCal))
      .slice(0, 6);
  }, [allergies, dietaryRestrictions, perMealCal]);

  if (recommended.length === 0) return null;

  const restrictionLabels = dietaryRestrictions.length > 0 
    ? dietaryRestrictions.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')
    : 'balanced';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Recommended For You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {recommended.map(meal => (
            <div key={meal.id} className="rounded-lg overflow-hidden border group cursor-pointer hover:shadow-md transition-shadow">
              <img src={meal.image} alt={meal.name} className="w-full h-20 object-cover group-hover:scale-105 transition-transform" />
              <div className="p-2">
                <p className="text-xs font-medium truncate">{meal.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-[10px]">{meal.nutrition.calories} kcal</Badge>
                  <Badge variant="outline" className="text-[10px]">P:{meal.nutrition.protein}g</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Based on {restrictionLabels} diet • ~{perMealCal} kcal/meal target
          {allergies.length > 0 && ` • Avoiding: ${allergies.join(', ')}`}
        </p>
      </CardContent>
    </Card>
  );
};

export default MealRecommendations;
