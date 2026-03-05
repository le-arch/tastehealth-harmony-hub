
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLS, setLS, LS_KEYS, CalorieEntry, ExerciseEntry, MealPlan } from "@/utils/localStorage";
import { Badge } from "@/components/ui/badge";

interface BadgeItem { id: string; name: string; description: string; icon: string; earned: boolean; requiredPoints?: number; }

const DEFAULT_BADGES: BadgeItem[] = [
  { id: 'b1', name: 'Welcome', icon: '🌟', description: 'Created an account', earned: true, requiredPoints: 0 },
  { id: 'b2', name: 'First Log', icon: '📝', description: 'Logged first calorie entry', earned: false, requiredPoints: 0 },
  { id: 'b3', name: 'Hydrated', icon: '💧', description: 'Drank 8 cups in a day', earned: false, requiredPoints: 0 },
  { id: 'b4', name: 'Meal Planner', icon: '📅', description: 'Created a meal plan', earned: false, requiredPoints: 0 },
  { id: 'b5', name: 'Streak 7', icon: '🔥', description: '7 day logging streak', earned: false, requiredPoints: 50 },
  { id: 'b6', name: 'Fitness Fan', icon: '💪', description: 'Logged 10 workouts', earned: false, requiredPoints: 100 },
  { id: 'b7', name: 'Nutrition Expert', icon: '🏆', description: 'Reached 500 points', earned: false, requiredPoints: 500 },
  { id: 'b8', name: 'Master Chef', icon: '👨‍🍳', description: 'Reached 1000 points', earned: false, requiredPoints: 1000 },
];

interface NutritionBadgesProps { userId?: string; addPoints?: (points: number, reason: string) => void; }

const NutritionBadges = ({ addPoints }: NutritionBadgesProps) => {
  const { language } = useLanguage();
  const [badges, setBadges] = useState<BadgeItem[]>(getLS('th_badges_list', DEFAULT_BADGES));

  useEffect(() => {
    const calorieLog = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []);
    const hydrationLog = getLS<any[]>(LS_KEYS.HYDRATION_LOG, []);
    const mealPlans = getLS<MealPlan[]>(LS_KEYS.MEAL_PLANS, []);
    const streak = getLS<number>(LS_KEYS.STREAK, 0);
    const exerciseLog = getLS<ExerciseEntry[]>(LS_KEYS.EXERCISE_LOG, []);
    const points = getLS<number>(LS_KEYS.POINTS, 0);

    const conditions: Record<string, boolean> = {
      'b1': true,
      'b2': calorieLog.length > 0,
      'b3': hydrationLog.some(h => h.cups >= 8),
      'b4': mealPlans.length > 0,
      'b5': streak >= 7,
      'b6': exerciseLog.length >= 10,
      'b7': points >= 500,
      'b8': points >= 1000,
    };

    const updated = badges.map(b => ({
      ...b,
      earned: conditions[b.id] || b.earned,
    }));

    const changed = updated.some((b, i) => b.earned !== badges[i].earned);
    if (changed) {
      setBadges(updated);
      setLS('th_badges_list', updated);
    }
  }, []);

  const earned = badges.filter(b => b.earned).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          {language === 'fr' ? "Badges Nutritionnels" : "Nutrition Badges"}
          <Badge variant="secondary" className="ml-auto">{earned}/{badges.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map(b => (
            <div key={b.id} className={`flex flex-col items-center p-3 border rounded-lg text-center ${b.earned ? 'bg-amber-50 dark:bg-amber-950 border-amber-200' : 'opacity-50'}`}>
              <span className="text-3xl mb-1">{b.icon}</span>
              <span className="text-xs font-medium">{b.name}</span>
              <span className="text-xs text-muted-foreground">{b.description}</span>
              {b.earned && <Check className="h-4 w-4 text-green-600 mt-1" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionBadges;
