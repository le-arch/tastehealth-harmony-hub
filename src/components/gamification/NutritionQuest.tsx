import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Compass, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, PointsTransaction } from "@/utils/localStorage";
import Confetti from "@/components/Confetti";
import { playMilestoneSound } from "@/utils/sounds";

interface Quest {
  id: string; name: string; description: string; target: number; progress: number; points: number; completed: boolean; lastAdvanced?: string;
}

const DEFAULT_QUESTS: Quest[] = [
  { id: 'q1', name: 'Log 3 Meals', description: 'Log breakfast, lunch, and dinner today', target: 3, progress: 0, points: 15, completed: false },
  { id: 'q2', name: 'Drink Water', description: 'Drink 8 cups of water today', target: 8, progress: 0, points: 20, completed: false },
  { id: 'q3', name: 'Exercise 30min', description: 'Do at least 30 minutes of exercise', target: 30, progress: 0, points: 25, completed: false },
  { id: 'q4', name: 'Eat 5 Fruits/Veggies', description: 'Eat 5 servings of fruits or vegetables', target: 5, progress: 0, points: 20, completed: false },
  { id: 'q5', name: 'Track Calories', description: 'Log all your calories for the day', target: 4, progress: 0, points: 15, completed: false },
  { id: 'q6', name: 'Cook a Healthy Meal', description: 'Prepare a home-cooked nutritious meal', target: 1, progress: 0, points: 30, completed: false },
  { id: 'q7', name: 'Sleep 8 Hours', description: 'Get at least 8 hours of quality sleep', target: 1, progress: 0, points: 20, completed: false },
  { id: 'q8', name: 'No Sugar Challenge', description: 'Avoid added sugars for the entire day', target: 1, progress: 0, points: 35, completed: false },
  { id: 'q9', name: 'Meditation Break', description: 'Take a 10-minute mindfulness break', target: 1, progress: 0, points: 15, completed: false },
  { id: 'q10', name: 'Protein Goal', description: 'Hit your daily protein target', target: 1, progress: 0, points: 25, completed: false },
];

interface NutritionQuestProps { userId?: string; addPoints?: (points: number, reason: string) => void; }

const NutritionQuest = ({ addPoints }: NutritionQuestProps) => {
  const { language } = useLanguage();
  const [quests, setQuests] = useState<Quest[]>(getLS('th_quests_active', DEFAULT_QUESTS));
  const [showConfetti, setShowConfetti] = useState(false);

  const save = (updated: Quest[]) => { setQuests(updated); setLS('th_quests_active', updated); };

  const canAdvanceToday = (quest: Quest) => {
    if (quest.completed) return false;
    const today = new Date().toDateString();
    return quest.lastAdvanced !== today;
  };

  const advance = (id: string) => {
    const updated = quests.map(q => {
      if (q.id !== id || q.completed) return q;
      const today = new Date().toDateString();
      if (q.lastAdvanced === today) { toast.info("You can only advance once per day!"); return q; }
      const newProgress = Math.min(q.progress + 1, q.target);
      const completed = newProgress >= q.target;
      if (completed) {
        addPoints?.(q.points, q.name);
        const pts = getLS<number>(LS_KEYS.POINTS, 0);
        setLS(LS_KEYS.POINTS, pts + q.points);
        // Save to points history
        const history = getLS<PointsTransaction[]>(LS_KEYS.POINTS_HISTORY, []);
        history.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), points: q.points, reason: `Quest: ${q.name}` });
        setLS(LS_KEYS.POINTS_HISTORY, history.slice(0, 100));
        setShowConfetti(true);
        playMilestoneSound('reward');
        setTimeout(() => setShowConfetti(false), 3500);
        toast.success(`Quest complete! +${q.points} points 🎉`);
      }
      return { ...q, progress: newProgress, completed, lastAdvanced: today };
    });
    save(updated);
  };

  const resetQuests = () => { save(DEFAULT_QUESTS); toast.success("Quests reset!"); };

  return (
    <>
      <Confetti active={showConfetti} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Compass className="h-5 w-5 text-purple-500" />{language === 'fr' ? "Quêtes Nutritionnelles" : "Nutrition Quests"}</span>
            <Button size="sm" variant="outline" onClick={resetQuests}>Reset</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quests.map(q => (
            <div key={q.id} className={`p-3 border rounded-lg ${q.completed ? 'bg-green-50 dark:bg-green-950' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="font-medium">{q.name}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">{q.points} pts</Badge>
                </div>
                {q.completed ? <Check className="h-5 w-5 text-green-600" /> : (
                  <Button size="sm" onClick={() => advance(q.id)} disabled={!canAdvanceToday(q)}>
                    {canAdvanceToday(q) ? '+1' : 'Done today'}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{q.description}</p>
              <Progress value={(q.progress / q.target) * 100} className="h-1.5" />
              <span className="text-xs text-muted-foreground">{q.progress}/{q.target}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default NutritionQuest;
