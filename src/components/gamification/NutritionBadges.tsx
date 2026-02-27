
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLS, setLS, LS_KEYS } from "@/utils/localStorage";
import { Badge } from "@/components/ui/badge";

interface BadgeItem { id: string; name: string; description: string; icon: string; earned: boolean; }

const DEFAULT_BADGES: BadgeItem[] = [
  { id: 'b1', name: 'Welcome', icon: '🌟', description: 'Created an account', earned: true },
  { id: 'b2', name: 'First Log', icon: '📝', description: 'Logged first calorie entry', earned: false },
  { id: 'b3', name: 'Hydrated', icon: '💧', description: 'Drank 8 cups in a day', earned: false },
  { id: 'b4', name: 'Meal Planner', icon: '📅', description: 'Created a meal plan', earned: false },
  { id: 'b5', name: 'Streak 7', icon: '🔥', description: '7 day logging streak', earned: false },
  { id: 'b6', name: 'Fitness Fan', icon: '💪', description: 'Logged 10 workouts', earned: false },
  { id: 'b7', name: 'Nutrition Expert', icon: '🏆', description: 'Reached level 5', earned: false },
  { id: 'b8', name: 'Master Chef', icon: '👨‍🍳', description: 'Added 20 favorite meals', earned: false },
];

interface NutritionBadgesProps { userId?: string; addPoints?: (points: number, reason: string) => void; }

const NutritionBadges = ({ addPoints }: NutritionBadgesProps) => {
  const { language } = useLanguage();
  const [badges] = useState<BadgeItem[]>(getLS('th_badges_list', DEFAULT_BADGES));
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
