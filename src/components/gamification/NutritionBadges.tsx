import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLS, setLS, LS_KEYS, CalorieEntry, ExerciseEntry, MealPlan } from "@/utils/localStorage";
import { Badge } from "@/components/ui/badge";

interface BadgeItem { id: string; name: string; description: string; icon: string; earned: boolean; requiredPoints?: number; }

const DEFAULT_BADGES: BadgeItem[] = [
  { id: 'b1', name: 'Welcome', icon: '🌟', description: 'Created an account', earned: true, requiredPoints: 0 },
  { id: 'b2', name: 'First Log', icon: '📝', description: 'Logged first calorie entry', earned: false },
  { id: 'b3', name: 'Hydrated', icon: '💧', description: 'Drank 8 cups in a day', earned: false },
  { id: 'b4', name: 'Meal Planner', icon: '📅', description: 'Created a meal plan', earned: false },
  { id: 'b5', name: 'Streak 7', icon: '🔥', description: '7 day logging streak', earned: false, requiredPoints: 50 },
  { id: 'b6', name: 'Fitness Fan', icon: '💪', description: 'Logged 10 workouts', earned: false, requiredPoints: 100 },
  { id: 'b7', name: 'Nutrition Expert', icon: '🏆', description: 'Reached 500 points', earned: false, requiredPoints: 500 },
  { id: 'b8', name: 'Master Chef', icon: '👨‍🍳', description: 'Reached 1000 points', earned: false, requiredPoints: 1000 },
  { id: 'b9', name: 'Quiz Whiz', icon: '🧠', description: 'Score 90%+ on a quiz', earned: false },
  { id: 'b10', name: 'Challenge Crusher', icon: '⚡', description: 'Complete 3 challenges', earned: false },
  { id: 'b11', name: 'Mood Master', icon: '😊', description: 'Log 10 meal moods', earned: false },
  { id: 'b12', name: 'Goal Getter', icon: '🎯', description: 'Complete 5 goals', earned: false },
  { id: 'b13', name: 'Social Star', icon: '⭐', description: 'Streak of 30 days', earned: false, requiredPoints: 300 },
  { id: 'b14', name: 'Legendary', icon: '👑', description: 'Reached 5000 points', earned: false, requiredPoints: 5000 },
  { id: 'b15', name: 'Recipe Creator', icon: '📖', description: 'Create 5 custom recipes', earned: false },
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
    const quizScores = getLS<any[]>('th_quiz_scores', []);
    const challenges = getLS<any[]>(LS_KEYS.CHALLENGES, []);
    const completedChallenges = challenges.filter(c => c.completed);
    const moodLog = getLS<any[]>(LS_KEYS.MOOD_LOG, []);
    const goals = getLS<any[]>('th_saved_goals', []);
    const completedGoals = goals.filter(g => g.completed);
    const recipes = getLS<any[]>('th_custom_recipes', []);

    const conditions: Record<string, boolean> = {
      'b1': true,
      'b2': calorieLog.length > 0,
      'b3': hydrationLog.some(h => h.cups >= 8),
      'b4': mealPlans.length > 0,
      'b5': streak >= 7,
      'b6': exerciseLog.length >= 10,
      'b7': points >= 500,
      'b8': points >= 1000,
      'b9': quizScores.some((s: any) => s.score >= 90),
      'b10': completedChallenges.length >= 3,
      'b11': moodLog.length >= 10,
      'b12': completedGoals.length >= 5,
      'b13': streak >= 30,
      'b14': points >= 5000,
      'b15': recipes.length >= 5,
    };

    // Merge with existing badges (keep any extra ones)
    const currentBadges = badges.length >= DEFAULT_BADGES.length ? badges : DEFAULT_BADGES;
    const updated = currentBadges.map(b => ({ ...b, earned: conditions[b.id] || b.earned }));
    const changed = updated.some((b, i) => b.earned !== (currentBadges[i]?.earned || false));
    if (changed) { setBadges(updated); setLS('th_badges_list', updated); }
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {badges.map(b => (
            <div key={b.id} className={`flex flex-col items-center p-3 border rounded-lg text-center transition-all ${b.earned ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 shadow-sm' : 'opacity-50 grayscale'}`}>
              <span className="text-3xl mb-1">{b.icon}</span>
              <span className="text-xs font-medium">{b.name}</span>
              <span className="text-[10px] text-muted-foreground">{b.description}</span>
              {b.earned && <Check className="h-4 w-4 text-green-600 mt-1" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionBadges;
