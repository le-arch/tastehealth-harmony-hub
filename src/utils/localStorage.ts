
export function getLS<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

export function setLS<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function updateLS<T>(key: string, updater: (prev: T) => T, fallback: T): T {
  const prev = getLS(key, fallback);
  const next = updater(prev);
  setLS(key, next);
  return next;
}

// Keys
export const LS_KEYS = {
  PROFILE: 'th_profile',
  SETTINGS: 'th_settings',
  MEAL_PLANS: 'th_meal_plans',
  FAVORITES: 'th_favorites',
  CALORIE_LOG: 'th_calorie_log',
  SLEEP_LOG: 'th_sleep_log',
  EXERCISE_LOG: 'th_exercise_log',
  HYDRATION_LOG: 'th_hydration_log',
  BMI_LOG: 'th_bmi_log',
  MOOD_LOG: 'th_mood_log',
  CHALLENGES: 'th_challenges',
  POINTS: 'th_points',
  POINTS_HISTORY: 'th_points_history',
  STREAK: 'th_streak',
  STREAK_DATE: 'th_streak_date',
  LEVEL: 'th_level',
  BADGES: 'th_badges',
  QUESTS: 'th_quests',
  NOTIFICATIONS: 'th_notifications',
  REWARDS: 'th_rewards',
} as const;

export interface ProfileData {
  age: string; height: string; weight: string; gender: string;
  activityLevel: string; healthGoals: string; dietaryRestrictions: string;
  allergies: string; calorieGoal: string;
}

export interface MealPlanItem {
  id: string; name: string; calories: number;
}

export interface MealPlanDay {
  breakfast: MealPlanItem[];
  lunch: MealPlanItem[];
  dinner: MealPlanItem[];
  snacks: MealPlanItem[];
}

export interface MealPlan {
  id: string; name: string; description: string; created_at: string;
  days: Record<string, MealPlanDay>;
}

export interface CalorieEntry {
  id: string; date: string; calories: number; meal: string; notes: string;
}

export interface SleepEntry {
  id: string; date: string; hours: number; quality: number;
}

export interface ExerciseEntry {
  id: string; date: string; type: string; duration: number; calories_burned: number;
}

export interface HydrationEntry {
  id: string; date: string; cups: number;
}

export interface BMIEntry {
  id: string; date: string; height: number; weight: number; bmi: number; status: string;
}

export interface MoodEntry {
  id: string; date: string; mood: string; notes: string; mealName?: string;
}

export interface PointsTransaction {
  id: string; date: string; points: number; reason: string;
}

export interface Challenge {
  id: string; name: string; types: string[]; duration: number;
  difficulty: number; startDate: string; progress: number; target: number;
  completed: boolean;
}

export interface Notification {
  id: string; date: string; title: string; message: string; read: boolean;
}

export interface FavoriteMeal {
  id: string; name: string; calories: number; protein: number;
  carbs: number; fats: number; imageUrl?: string;
}

export interface Reward {
  id: string; name: string; description: string; points: number; claimed: boolean; icon: string;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function createEmptyWeek(): Record<string, MealPlanDay> {
  const days: Record<string, MealPlanDay> = {};
  DAYS_OF_WEEK.forEach(d => {
    days[d] = { breakfast: [], lunch: [], dinner: [], snacks: [] };
  });
  return days;
}

export { DAYS_OF_WEEK };
