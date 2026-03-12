import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MEAL_DATABASE, MealDBItem } from '@/data/mealDatabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { getLS, setLS, LS_KEYS, CalorieEntry, MealPlanItem } from '@/utils/localStorage';
import { Plus, Trash2, Activity, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';

interface DailyMealEntry {
  id: string;
  meal: MealDBItem;
  timestamp: Date;
  scheduledTime?: string;
  logged: boolean;
  mealPlanId?: string;
}

interface DailyMealSelectorProps {
  mealPlanMeals?: MealPlanItem[];
  selectedDate?: Date;
}

const DailyMealSelector: React.FC<DailyMealSelectorProps> = ({ 
  mealPlanMeals = [], 
  selectedDate = new Date() 
}) => {
  const [selectedMeals, setSelectedMeals] = useState<DailyMealEntry[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('breakfast');
  const [viewDate, setViewDate] = useState<Date>(selectedDate);
  const { language } = useLanguage();
  const { addNotification } = useNotifications();

  const t = language === 'fr'
    ? { 
        title: 'Repas d\'Aujourd\'hui', 
        selectMeals: 'Sélectionner et Enregistrer', 
        totalCalories: 'Calories Totales', 
        breakfast: 'Petit déjeuner', 
        lunch: 'Déjeuner', 
        dinner: 'Dîner', 
        snacks: 'Collations', 
        drinks: 'Boissons', 
        removeAll: 'Effacer Tout', 
        empty: 'Aucun repas sélectionné',
        fromMealPlan: 'Du plan de repas',
        logMeal: 'Enregistrer',
        logged: 'Enregistré',
        scheduled: 'Prévu',
        addToToday: 'Ajouter aux repas du jour',
        selectDate: 'Choisir une date'
      }
    : { 
        title: 'Today\'s Meals', 
        selectMeals: 'Select & Log Meals', 
        totalCalories: 'Total Calories', 
        breakfast: 'Breakfast', 
        lunch: 'Lunch', 
        dinner: 'Dinner', 
        snacks: 'Snacks', 
        drinks: 'Drinks', 
        removeAll: 'Clear All', 
        empty: 'No meals selected yet',
        fromMealPlan: 'From Meal Plan',
        logMeal: 'Log',
        logged: 'Logged',
        scheduled: 'Scheduled',
        addToToday: 'Add to Today\'s Meals',
        selectDate: 'Select Date'
      };

  const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'drinks'] as const;
  
  const mealsByCategory = categories.reduce((acc, category) => {
    acc[category] = MEAL_DATABASE.filter(meal => meal.category === category);
    return acc;
  }, {} as Record<string, MealDBItem[]>);

  // Load meals from localStorage on mount and when date changes
  useEffect(() => {
    loadMealsForDate(viewDate);
  }, [viewDate]);

  const loadMealsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const stored = localStorage.getItem(`th_daily_meals_${dateKey}`);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const meals = parsed
          .map((item: any) => {
            const meal = MEAL_DATABASE.find(m => m.id === item.mealId);
            return meal ? { 
              id: item.id, 
              meal, 
              timestamp: new Date(item.timestamp),
              scheduledTime: item.scheduledTime,
              logged: item.logged || false,
              mealPlanId: item.mealPlanId
            } : null;
          })
          .filter((item: any) => item !== null);
        setSelectedMeals(meals);
      } catch (error) {
        console.error('Error loading meals:', error);
        setSelectedMeals([]);
      }
    } else {
      setSelectedMeals([]);
    }
  };

  // Auto-load meal plan meals for the selected date
  useEffect(() => {
    if (mealPlanMeals.length > 0) {
      const mealPlanEntries = mealPlanMeals
        .map(mealPlanItem => {
          const meal = MEAL_DATABASE.find(m => m.name === mealPlanItem.name);
          if (!meal) return null;
          
          return {
            id: `plan-${mealPlanItem.id}`,
            meal,
            timestamp: viewDate,
            scheduledTime: mealPlanItem.time,
            logged: false,
            mealPlanId: mealPlanItem.id
          } as DailyMealEntry;
        })
        .filter((entry): entry is DailyMealEntry => entry !== null);

      // Merge with existing meals, avoiding duplicates
      setSelectedMeals(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const newEntries = mealPlanEntries.filter(e => !existingIds.has(e.id));
        return [...prev, ...newEntries];
      });
    }
  }, [mealPlanMeals, viewDate]);

  // Save to localStorage whenever selectedMeals changes
  useEffect(() => {
    const dateKey = format(viewDate, 'yyyy-MM-dd');
    const mealsToSave = selectedMeals.map(entry => ({
      id: entry.id,
      mealId: entry.meal.id,
      mealName: entry.meal.name,
      calories: entry.meal.nutrition.calories,
      protein: entry.meal.nutrition.protein,
      carbs: entry.meal.nutrition.carbs,
      fats: entry.meal.nutrition.fats,
      category: entry.meal.category,
      timestamp: entry.timestamp.toISOString(),
      scheduledTime: entry.scheduledTime,
      logged: entry.logged,
      mealPlanId: entry.mealPlanId
    }));
    localStorage.setItem(`th_daily_meals_${dateKey}`, JSON.stringify(mealsToSave));
  }, [selectedMeals, viewDate]);

  const totalNutrition = selectedMeals.reduce((acc, entry) => ({
    calories: acc.calories + entry.meal.nutrition.calories,
    protein: acc.protein + entry.meal.nutrition.protein,
    carbs: acc.carbs + entry.meal.nutrition.carbs,
    fats: acc.fats + entry.meal.nutrition.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const addMeal = (meal: MealDBItem, scheduledTime?: string) => {
    const newEntry: DailyMealEntry = { 
      id: `${meal.id}-${Date.now()}`, 
      meal, 
      timestamp: viewDate,
      scheduledTime,
      logged: false 
    };
    const updated = [...selectedMeals, newEntry];
    setSelectedMeals(updated);
    
    addNotification({ 
      title: 'Meal Added', 
      message: `${meal.name} (${meal.nutrition.calories} kcal) added to ${format(viewDate, 'MMM d')}'s meals`, 
      type: 'meal' 
    });
  };

  const logMeal = (entry: DailyMealEntry) => {
    // Mark as logged in the daily meals
    const updated = selectedMeals.map(e => 
      e.id === entry.id ? { ...e, logged: true } : e
    );
    setSelectedMeals(updated);

    // Add to calorie tracker
    const calorieEntry: CalorieEntry = {
      id: crypto.randomUUID(),
      date: viewDate.toISOString(),
      calories: entry.meal.nutrition.calories,
      meal: entry.meal.category,
      notes: entry.meal.name,
    };
    
    const existing = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []);
    setLS(LS_KEYS.CALORIE_LOG, [calorieEntry, ...existing]);

    addNotification({ 
      title: 'Meal Logged', 
      message: `${entry.meal.name} (${entry.meal.nutrition.calories} kcal) logged to calorie tracker`, 
      type: 'success' 
    });
  };

  const removeMeal = (id: string) => { 
    setSelectedMeals(selectedMeals.filter(entry => entry.id !== id)); 
  };

  const clearAll = () => { 
    setSelectedMeals([]); 
  };

  const groupedByCategory = categories.reduce((acc, category) => {
    acc[category] = selectedMeals.filter(entry => entry.meal.category === category);
    return acc;
  }, {} as Record<string, DailyMealEntry[]>);

  const loggedMeals = selectedMeals.filter(m => m.logged);
  const pendingMeals = selectedMeals.filter(m => !m.logged);

  return (
    <div className="space-y-4">
      {/* Date Selector */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={format(viewDate, 'yyyy-MM-dd')}
            onChange={(e) => setViewDate(new Date(e.target.value))}
            className="text-sm bg-transparent border rounded px-2 py-1"
          />
        </div>
        {isToday(viewDate) && (
          <Badge variant="outline" className="text-xs">Today</Badge>
        )}
      </div>

      {/* Today's Meals Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{t.title} - {format(viewDate, 'MMM d, yyyy')}</span>
            <div className="flex items-center gap-2">
              {selectedMeals.length > 0 && (
                <Badge variant="secondary">{selectedMeals.length} meals</Badge>
              )}
              {pendingMeals.length > 0 && (
                <Badge variant="outline" className="bg-yellow-500/10">
                  {pendingMeals.length} pending
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedMeals.length === 0 ? (
            <div className="text-center py-6">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">{t.empty}</p>
              {mealPlanMeals.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {t.fromMealPlan} • Click + to add
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Nutrition Summary */}
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

              {/* Meals by Category */}
              <div className="space-y-3">
                {categories.map((category) => {
                  const meals = groupedByCategory[category];
                  if (meals.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-sm capitalize flex items-center gap-2">
                        <span>{t[category as keyof typeof t] || category}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {meals.length} meals
                        </Badge>
                      </h4>
                      <AnimatePresence>
                        {meals.map((entry) => (
                          <motion.div 
                            key={entry.id} 
                            initial={{ opacity: 0, x: -20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              entry.logged 
                                ? 'bg-green-500/10 border border-green-500/20' 
                                : 'bg-muted'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {entry.scheduledTime && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {entry.scheduledTime}
                                  </div>
                                )}
                                {entry.mealPlanId && (
                                  <Badge variant="outline" className="text-[8px]">
                                    {t.fromMealPlan}
                                  </Badge>
                                )}
                                {entry.logged && (
                                  <Badge variant="default" className="text-[8px] bg-green-600">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    {t.logged}
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium text-sm truncate mt-1">{entry.meal.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {entry.meal.nutrition.calories} kcal • P: {entry.meal.nutrition.protein}g • C: {entry.meal.nutrition.carbs}g • F: {entry.meal.nutrition.fats}g
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {!entry.logged && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => logMeal(entry)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  {t.logMeal}
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeMeal(entry.id)} 
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Logged: {loggedMeals.length} meals</span>
                  <span className="text-muted-foreground">Pending: {pendingMeals.length} meals</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Meal Selection Card */}
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
                <span className="font-medium capitalize">{t[category as keyof typeof t] || category}</span>
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
                    {mealsByCategory[category].map((meal) => {
                      const isAlreadySelected = selectedMeals.some(
                        e => e.meal.id === meal.id && !e.logged
                      );
                      
                      return (
                        <div 
                          key={meal.id} 
                          className={`flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors ${
                            isAlreadySelected ? 'opacity-50' : ''
                          }`}
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
                            disabled={isAlreadySelected}
                            className="ml-2"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      );
                    })}
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