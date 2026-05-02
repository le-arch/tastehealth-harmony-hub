import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { getLS, LS_KEYS, ProfileData } from '@/utils/localStorage';
import { MEAL_DATABASE, MealDBItem } from '@/data/mealDatabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';

const MealRecommendations: React.FC = () => {
  const { language } = useLanguage();
  const profile = getLS<ProfileData | null>(LS_KEYS.PROFILE, null);
  const prefs = getLS<any>('th_nutrition_prefs', { dietType: 'balanced', allergies: '', calorieGoal: '2000' });
  const [selected, setSelected] = useState<MealDBItem | null>(null);

  const calorieGoal = parseInt(profile?.calorieGoal || prefs.calorieGoal) || 2000;
  const perMealCal = Math.round(calorieGoal / 3);

  const dietaryRestrictions = useMemo(() => {
    if (!profile?.dietaryRestrictions) return [];
    return profile.dietaryRestrictions.split(',').map(r => r.trim().toLowerCase()).filter(Boolean);
  }, [profile?.dietaryRestrictions]);

  const allergies = useMemo(() => {
    return (profile?.allergies || prefs.allergies || '').toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean);
  }, [profile?.allergies, prefs.allergies]);

  const recommended = useMemo(() => {
    const filtered = MEAL_DATABASE.filter(m => {
      const nameLC = m.name.toLowerCase();
      const ingsLC = m.recipe.ingredients.map(i => i.toLowerCase());
      if (allergies.some((a: string) => nameLC.includes(a) || ingsLC.some(ing => ing.includes(a)))) return false;
      const meatKeywords = ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'bacon'];
      const fishKeywords = ['salmon', 'fish', 'tuna', 'shrimp', 'seafood'];
      const dairyKeywords = ['yogurt', 'cheese', 'milk', 'butter', 'cream'];
      const eggKeywords = ['egg'];
      const glutenKeywords = ['bread', 'pasta', 'flour', 'wheat', 'cereal', 'oat'];
      const nutKeywords = ['almond', 'walnut', 'cashew', 'peanut', 'nut', 'pecan'];
      const has = (k: string[]) => k.some(x => nameLC.includes(x) || ingsLC.some(ing => ing.includes(x)));
      if (dietaryRestrictions.includes('vegan') && (has(meatKeywords) || has(fishKeywords) || has(dairyKeywords) || has(eggKeywords))) return false;
      if (dietaryRestrictions.includes('vegetarian') && (has(meatKeywords) || has(fishKeywords))) return false;
      if (dietaryRestrictions.includes('pescatarian') && has(meatKeywords)) return false;
      if (dietaryRestrictions.includes('gluten-free') && has(glutenKeywords)) return false;
      if (dietaryRestrictions.includes('dairy-free') && has(dairyKeywords)) return false;
      if (dietaryRestrictions.includes('nut-free') && has(nutKeywords)) return false;
      return true;
    });
    return filtered
      .sort((a, b) => Math.abs(a.nutrition.calories - perMealCal) - Math.abs(b.nutrition.calories - perMealCal))
      .slice(0, 6);
  }, [allergies, dietaryRestrictions, perMealCal]);

  if (recommended.length === 0) return null;

  const tt = language === 'fr'
    ? { title: 'Recommandé pour vous', viewHint: 'Cliquez pour les valeurs nutritionnelles', basedOn: 'Basé sur', perMeal: 'kcal/repas cible', avoiding: 'Évite', nutrition: 'Valeurs nutritionnelles' }
    : { title: 'Recommended For You', viewHint: 'Click to view nutrition', basedOn: 'Based on', perMeal: 'kcal/meal target', avoiding: 'Avoiding', nutrition: 'Nutrition Facts' };

  const restrictionLabels = dietaryRestrictions.length > 0
    ? dietaryRestrictions.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')
    : 'balanced';

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            {tt.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {recommended.map(meal => (
              <button
                type="button"
                key={meal.id}
                onClick={() => setSelected(meal)}
                className="text-left rounded-lg overflow-hidden border group hover:shadow-md focus:ring-2 focus:ring-primary/50 transition-all"
                title={tt.viewHint}
              >
                <img src={meal.image} alt={meal.name} className="w-full h-20 object-cover group-hover:scale-105 transition-transform" />
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{meal.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className="text-[10px]">{meal.nutrition.calories} kcal</Badge>
                    <Badge variant="outline" className="text-[10px]">P:{meal.nutrition.protein}g</Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {tt.basedOn} {restrictionLabels} • ~{perMealCal} {tt.perMeal}
            {allergies.length > 0 && ` • ${tt.avoiding}: ${allergies.join(', ')}`}
          </p>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
              </DialogHeader>
              <img src={selected.image} alt={selected.name} className="w-full h-40 object-cover rounded-lg" />
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <h3 className="font-semibold text-sm">{tt.nutrition}</h3>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Nutrient</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>Calories</TableCell><TableCell className="text-right font-medium">{selected.nutrition.calories} kcal</TableCell></TableRow>
                  <TableRow><TableCell>Protein</TableCell><TableCell className="text-right">{selected.nutrition.protein}g</TableCell></TableRow>
                  <TableRow><TableCell>Carbs</TableCell><TableCell className="text-right">{selected.nutrition.carbs}g</TableCell></TableRow>
                  <TableRow><TableCell>Fats</TableCell><TableCell className="text-right">{selected.nutrition.fats}g</TableCell></TableRow>
                  <TableRow><TableCell>Fiber</TableCell><TableCell className="text-right">{selected.nutrition.fiber}g</TableCell></TableRow>
                  <TableRow><TableCell>Sugar</TableCell><TableCell className="text-right">{selected.nutrition.sugar}g</TableCell></TableRow>
                  <TableRow><TableCell>Sodium</TableCell><TableCell className="text-right">{selected.nutrition.sodium}mg</TableCell></TableRow>
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MealRecommendations;
