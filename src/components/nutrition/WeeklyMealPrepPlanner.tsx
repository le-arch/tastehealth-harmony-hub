import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, RefreshCw, ShoppingCart, Calendar, Check } from 'lucide-react';
import { getLS, LS_KEYS, ProfileData } from '@/utils/localStorage';
import { MEAL_DATABASE, MealDBItem } from '@/data/mealDatabase';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks', 'fruits'] as const;

const WeeklyMealPrepPlanner: React.FC = () => {
  const [seed, setSeed] = useState(0);
  const [checkedMeals, setCheckedMeals] = useState<Set<string>>(new Set());

  const profile = getLS<ProfileData | null>(LS_KEYS.PROFILE, null);

  const dietaryRestrictions = useMemo(() => {
    if (!profile?.dietaryRestrictions) return [];
    return profile.dietaryRestrictions.split(',').map(r => r.trim().toLowerCase()).filter(Boolean);
  }, [profile?.dietaryRestrictions]);

  const allergies = useMemo(() => {
    return (profile?.allergies || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  }, [profile?.allergies]);

  const filteredMeals = useMemo(() => {
    const meatKw = ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'bacon', 'goat', 'bushmeat'];
    const fishKw = ['salmon', 'fish', 'tuna', 'shrimp', 'seafood', 'crayfish', 'catfish'];
    const dairyKw = ['yogurt', 'cheese', 'milk', 'butter', 'cream'];
    const eggKw = ['egg'];
    const glutenKw = ['bread', 'pasta', 'flour', 'wheat'];
    const nutKw = ['almond', 'walnut', 'cashew', 'peanut', 'nut', 'groundnut'];

    const hasIng = (m: MealDBItem, kws: string[]) => {
      const n = m.name.toLowerCase();
      const ings = m.recipe.ingredients.map(i => i.toLowerCase());
      return kws.some(k => n.includes(k) || ings.some(i => i.includes(k)));
    };

    return MEAL_DATABASE.filter(m => {
      const n = m.name.toLowerCase();
      const ings = m.recipe.ingredients.map(i => i.toLowerCase());
      if (allergies.some(a => n.includes(a) || ings.some(i => i.includes(a)))) return false;
      if (dietaryRestrictions.includes('vegan') && (hasIng(m, meatKw) || hasIng(m, fishKw) || hasIng(m, dairyKw) || hasIng(m, eggKw))) return false;
      if (dietaryRestrictions.includes('vegetarian') && (hasIng(m, meatKw) || hasIng(m, fishKw))) return false;
      if (dietaryRestrictions.includes('gluten-free') && hasIng(m, glutenKw)) return false;
      if (dietaryRestrictions.includes('dairy-free') && hasIng(m, dairyKw)) return false;
      if (dietaryRestrictions.includes('nut-free') && hasIng(m, nutKw)) return false;
      return true;
    });
  }, [dietaryRestrictions, allergies]);

  const weekPlan = useMemo(() => {
    const plan: Record<string, Record<string, MealDBItem>> = {};
    const used = new Set<string>();

    const pickMeal = (cat: string) => {
      const pool = filteredMeals.filter(m => m.category === cat && !used.has(m.id));
      if (pool.length === 0) return filteredMeals.find(m => m.category === cat) || filteredMeals[0];
      const idx = Math.floor(Math.random() * pool.length);
      used.add(pool[idx].id);
      return pool[idx];
    };

    for (const day of DAYS) {
      plan[day] = {};
      for (const slot of SLOTS) {
        const cat = slot === 'snacks' ? 'snacks' : slot;
        plan[day][slot] = pickMeal(cat);
      }
    }
    return plan;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredMeals, seed]);

  const shoppingList = useMemo(() => {
    const ingredients = new Set<string>();
    for (const day of DAYS) {
      for (const slot of SLOTS) {
        const meal = weekPlan[day]?.[slot];
        if (meal) meal.recipe.ingredients.forEach(i => ingredients.add(i));
      }
    }
    return Array.from(ingredients).sort();
  }, [weekPlan]);

  const toggleCheck = (key: string) => {
    setCheckedMeals(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const totalCalories = useMemo(() => {
    let total = 0;
    for (const day of DAYS) {
      for (const slot of SLOTS) {
        total += weekPlan[day]?.[slot]?.nutrition.calories || 0;
      }
    }
    return Math.round(total / 7);
  }, [weekPlan]);

  const [showShopping, setShowShopping] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-500" />
            Weekly Meal Prep Plan
          </h3>
          <p className="text-xs text-muted-foreground">
            ~{totalCalories} kcal/day avg
            {dietaryRestrictions.length > 0 && ` • ${dietaryRestrictions.join(', ')}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowShopping(!showShopping)}>
            <ShoppingCart className="h-4 w-4 mr-1" />
            Shopping List
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setSeed(s => s + 1); setCheckedMeals(new Set()); }}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Regenerate
          </Button>
        </div>
      </div>

      {showShopping && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Shopping List ({shoppingList.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 max-h-60 overflow-y-auto">
              {shoppingList.map((item, i) => (
                <label key={i} className="flex items-center gap-2 text-xs p-1 cursor-pointer hover:bg-muted/50 rounded">
                  <input type="checkbox" className="rounded" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-semibold bg-muted/50 border-b border-r w-20">
                <Calendar className="h-3 w-3 inline mr-1" />Day
              </th>
              {SLOTS.map(s => (
                <th key={s} className="p-2 text-left text-xs font-semibold bg-muted/50 border-b border-r capitalize">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day} className="hover:bg-muted/20">
                <td className="p-2 text-xs font-medium border-b border-r">{day.slice(0, 3)}</td>
                {SLOTS.map(slot => {
                  const meal = weekPlan[day]?.[slot];
                  const key = `${day}-${slot}`;
                  const checked = checkedMeals.has(key);
                  return (
                    <td key={slot} className="p-1.5 border-b border-r align-top">
                      {meal && (
                        <button
                          onClick={() => toggleCheck(key)}
                          className={`w-full text-left p-1.5 rounded-md transition-all text-xs ${
                            checked ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800' : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-start gap-1">
                            {checked && <Check className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />}
                            <div>
                              <p className={`font-medium leading-tight ${checked ? 'line-through text-muted-foreground' : ''}`}>
                                {meal.name}
                              </p>
                              <span className="text-muted-foreground">{meal.nutrition.calories} kcal</span>
                            </div>
                          </div>
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyMealPrepPlanner;
