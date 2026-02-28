import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MEAL_DATABASE, MealDBItem } from '@/data/mealDatabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Plus, Trash2, Clock, Activity } from 'lucide-react';

interface DailyMealEntry {
  id: string;
  meal: MealDBItem;
  timestamp: Date;
}

const DailyMealSelector: React.FC = () => {
  const [selectedMeals, setSelectedMeals] = useState<DailyMealEntry[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('breakfast');
  const { language } = useLanguage();
  const { addNotification } = useNotifications();

  const translations = {
    en: {
      title: 'Today\'s Meals',
      selectMeals: 'Select & Log Meals',
      totalCalories: 'Total Calories',
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snacks: 'Snacks',
      drinks: 'Drinks',
      addMeal: 'Add Meal',
      removeAll: 'Clear All',
      empty: 'No meals selected yet',
      caloriesLogged: 'Calories logged successfully!',
    },
    fr: {
      title: 'Repas d\'Aujourd\'hui',
      selectMeals: 'Sélectionner et Enregistrer les Repas',
      totalCalories: 'Calories Totales',
      breakfast: 'Petit déjeuner',
      lunch: 'Déjeuner',
      dinner: 'Dîner',
      snacks: 'Collations',
      drinks: 'Boissons',
      addMeal: 'Ajouter un Repas',
      removeAll: 'Effacer Tout',
      empty: 'Aucun repas sélectionné',
      caloriesLogged: 'Calories enregistrées avec succès!',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'drinks'] as const;
  
  const mealsByCategory = categories.reduce((acc, category) => {
    acc[category] = MEAL_DATABASE.filter(meal => meal.category === category);
    return acc;
  }, {} as Record<string, MealDBItem[]>);

  const totalNutrition = selectedMeals.reduce((acc, entry) => ({
    calories: acc.calories + entry.meal.nutrition.calories,
    protein: acc.protein + entry.meal.nutrition.protein,
    carbs: acc.carbs + entry.meal.nutrition.carbs,
    fats: acc.fats + entry.meal.nutrition.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const addMeal = (meal: MealDBItem) => {
    const newEntry: DailyMealEntry = {
      id: `${meal.id}-${Date.now()}`,
      meal,
      timestamp: new Date(),
    };
    setSelectedMeals([...selectedMeals, newEntry]);
    addNotification({
      title: 'Meal Added',
      message: `${meal.name} (${meal.nutrition.calories} kcal) added to today's meals`,
      type: 'meal',
    });
  };

  const removeMeal = (id: string) => {
    setSelectedMeals(selectedMeals.filter(entry => entry.id !== id));
  };

  const clearAll = () => {
    setSelectedMeals([]);
  };

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('th_daily_meals', JSON.stringify(selectedMeals.map(entry => ({
      mealId: entry.meal.id,
      timestamp: entry.timestamp,
    }))));
  }, [selectedMeals]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('th_daily_meals');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const meals = parsed
          .map((item: any) => {
            const meal = MEAL_DATABASE.find(m => m.id === item.mealId);
            return meal ? { id: `${meal.id}-${item.timestamp}`, meal, timestamp: new Date(item.timestamp) } : null;
          })
          .filter((item: any) => item !== null);
        setSelectedMeals(meals);
      } catch (error) {
        console.error('Failed to load daily meals:', error);
      }
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{t.title}</span>
            {selectedMeals.length > 0 && (
              <Badge variant="secondary">{selectedMeals.length} meals</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedMeals.length === 0 ? (
            <div className="text-center py-6">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">{t.empty}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground font-medium">{t.totalCalories}</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{Math.round(totalNutrition.calories)}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground font-medium">Protein</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(totalNutrition.protein)}</p>
                  <p className="text-xs text-muted-foreground">g</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground font-medium">Carbs</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{Math.round(totalNutrition.carbs)}</p>
                  <p className="text-xs text-muted-foreground">g</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground font-medium">Fat</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(totalNutrition.fats)}</p>
                  <p className="text-xs text-muted-foreground">g</p>
                </div>
              </div>

              {selectedMeals.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Selected Meals:</h4>
                  <AnimatePresence>
                    {selectedMeals.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{entry.meal.name}</p>
                          <p className="text-xs text-muted-foreground">{entry.meal.nutrition.calories} kcal</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMeal(entry.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Meal Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t.selectMeals}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category}>
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <span className="font-medium capitalize">{t[category as keyof typeof t]}</span>
                <span className="text-xs text-muted-foreground">{mealsByCategory[category].length}</span>
              </button>

              <AnimatePresence>
                {expandedCategory === category && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-2 max-h-64 overflow-y-auto"
                  >
                    {mealsByCategory[category].map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{meal.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{meal.nutrition.calories} kcal</span>
                            <span>•</span>
                            <span>P: {meal.nutrition.protein}g</span>
                            <span>•</span>
                            <span>C: {meal.nutrition.carbs}g</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addMeal(meal)}
                          className="ml-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {selectedMeals.length > 0 && (
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={clearAll}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t.removeAll}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyMealSelector;
