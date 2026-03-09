
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Trash2, Save, Utensils, Calendar, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { soundManager } from '@/utils/sounds';

interface MealMoodEntry {
  id: string;
  date: string;
  mealName: string;
  mood: string;
  notes: string;
  calories?: number;
}

interface TodayMealLog {
  id: string;
  date: string;
  mealName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  calories: number;
  timestamp: string;
}

const moodOptions = [
  { value: 'amazing', label: 'Amazing', emoji: '🤩', color: 'bg-green-500' },
  { value: 'great', label: 'Great', emoji: '😄', color: 'bg-green-400' },
  { value: 'good', label: 'Good', emoji: '😊', color: 'bg-blue-400' },
  { value: 'ok', label: 'Okay', emoji: '😐', color: 'bg-yellow-400' },
  { value: 'bad', label: 'Bad', emoji: '😔', color: 'bg-orange-400' },
  { value: 'terrible', label: 'Terrible', emoji: '🤢', color: 'bg-red-400' },
];

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;

export const MealMoodSaver: React.FC = () => {
  const [mealMoods, setMealMoods] = useState<MealMoodEntry[]>(() => {
    try {
      const stored = localStorage.getItem('th_meal_mood_saver');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mealName: '',
    mood: 'good',
    notes: '',
    calories: '',
  });

  useEffect(() => {
    localStorage.setItem('th_meal_mood_saver', JSON.stringify(mealMoods));
  }, [mealMoods]);

  const saveMealMood = () => {
    if (!formData.mealName.trim()) {
      toast.error('Please enter a meal name');
      return;
    }

    const newEntry: MealMoodEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      mealName: formData.mealName,
      mood: formData.mood,
      notes: formData.notes,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
    };

    setMealMoods([newEntry, ...mealMoods]);
    soundManager.playSuccess();
    toast.success('Meal mood saved!');
    setFormData({ mealName: '', mood: 'good', notes: '', calories: '' });
    setShowForm(false);
  };

  const deleteMealMood = (id: string) => {
    setMealMoods(mealMoods.filter(m => m.id !== id));
    toast.success('Entry deleted');
  };

  const todayMoods = mealMoods.filter(m => m.date === new Date().toISOString().split('T')[0]);

  return (
    <Card className="glow-effect">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          Meal Mood Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Log Meal Mood
          </Button>
        ) : (
          <div className="space-y-3">
            <div>
              <Label>Meal Name</Label>
              <Input
                value={formData.mealName}
                onChange={(e) => setFormData({ ...formData, mealName: e.target.value })}
                placeholder="e.g., Grilled Chicken Salad"
              />
            </div>
            <div>
              <Label>Calories (optional)</Label>
              <Input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                placeholder="e.g., 450"
              />
            </div>
            <div>
              <Label>How did you feel?</Label>
              <div className="grid grid-cols-6 gap-1 mt-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setFormData({ ...formData, mood: mood.value })}
                    className={`p-2 rounded-lg text-xl transition-all hover:scale-110 ${
                      formData.mood === mood.value ? `${mood.color} ring-2 ring-offset-2 ring-primary` : 'bg-muted'
                    }`}
                    title={mood.label}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any thoughts about this meal..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveMealMood} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {todayMoods.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Today's Meals</p>
            {todayMoods.map((mood) => (
              <div
                key={mood.id}
                className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {moodOptions.find((m) => m.value === mood.mood)?.emoji}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{mood.mealName}</p>
                    {mood.calories && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {mood.calories} kcal
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => deleteMealMood(mood.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const TodayMealCard: React.FC = () => {
  const [todayMeals, setTodayMeals] = useState<TodayMealLog[]>(() => {
    try {
      const stored = localStorage.getItem('th_today_meal_log');
      const storedData = stored ? JSON.parse(stored) : [];
      const today = new Date().toISOString().split('T')[0];
      return storedData.filter((m: TodayMealLog) => m.date === today);
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mealName: '',
    mealType: 'breakfast' as typeof mealTypes[number],
    calories: '',
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const allMeals = JSON.parse(localStorage.getItem('th_today_meal_log') || '[]');
    const todayMealsOnly = allMeals.filter((m: TodayMealLog) => m.date === today);
    localStorage.setItem('th_today_meal_log', JSON.stringify(todayMealsOnly));
    setTodayMeals(todayMealsOnly);
  }, []);

  const addMeal = () => {
    if (!formData.mealName.trim()) {
      toast.error('Please enter a meal name');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newMeal: TodayMealLog = {
      id: crypto.randomUUID(),
      date: today,
      mealName: formData.mealName,
      mealType: formData.mealType,
      calories: parseInt(formData.calories) || 0,
      timestamp: new Date().toISOString(),
    };

    const allMeals = JSON.parse(localStorage.getItem('th_today_meal_log') || '[]');
    allMeals.push(newMeal);
    localStorage.setItem('th_today_meal_log', JSON.stringify(allMeals));

    setTodayMeals([...todayMeals, newMeal]);
    soundManager.playClick();
    toast.success('Meal logged!');
    setFormData({ mealName: '', mealType: 'breakfast', calories: '' });
    setShowForm(false);
  };

  const removeMeal = (id: string) => {
    const allMeals = JSON.parse(localStorage.getItem('th_today_meal_log') || '[]');
    const filtered = allMeals.filter((m: TodayMealLog) => m.id !== id);
    localStorage.setItem('th_today_meal_log', JSON.stringify(filtered));
    setTodayMeals(todayMeals.filter(m => m.id !== id));
  };

  const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const mealsByType = mealTypes.map((type) => ({
    type,
    meals: todayMeals.filter((m) => m.mealType === type),
  }));

  return (
    <Card className="glow-effect">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Meals
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {totalCalories} kcal total
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="w-full mb-4" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Log a Meal
          </Button>
        ) : (
          <div className="space-y-3 mb-4 p-3 bg-muted/30 rounded-lg">
            <div>
              <Label>Meal</Label>
              <Input
                value={formData.mealName}
                onChange={(e) => setFormData({ ...formData, mealName: e.target.value })}
                placeholder="e.g., Oatmeal with berries"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Type</Label>
                <Select
                  value={formData.mealType}
                  onValueChange={(v) => setFormData({ ...formData, mealType: v as typeof mealTypes[number] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Calories</Label>
                <Input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addMeal} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Log
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {mealsByType.map(({ type, meals }) => (
            <div key={type}>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-1">{type}</p>
              {meals.length === 0 ? (
                <p className="text-xs text-muted-foreground/50 italic">No meals logged</p>
              ) : (
                meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between py-1.5 px-2 bg-white dark:bg-gray-800 rounded border mb-1"
                  >
                    <span className="text-sm">{meal.mealName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{meal.calories} kcal</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => removeMeal(meal.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        {todayMeals.length === 0 && !showForm && (
          <p className="text-center text-sm text-muted-foreground py-4">
            No meals logged today. Start tracking!
          </p>
        )}
      </CardContent>
    </Card>
  );
};
