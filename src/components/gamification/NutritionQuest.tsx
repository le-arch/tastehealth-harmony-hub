
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Compass, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS } from "@/utils/localStorage";

interface Quest {
  id: string; name: string; description: string; target: number; progress: number; points: number; completed: boolean;
}

const DEFAULT_QUESTS: Quest[] = [
  { id: 'q1', name: 'Log 3 Meals', description: 'Log breakfast, lunch, and dinner today', target: 3, progress: 0, points: 15, completed: false },
  { id: 'q2', name: 'Drink Water', description: 'Drink 8 cups of water today', target: 8, progress: 0, points: 20, completed: false },
  { id: 'q3', name: 'Exercise 30min', description: 'Do at least 30 minutes of exercise', target: 30, progress: 0, points: 25, completed: false },
];

interface NutritionQuestProps { userId?: string; addPoints?: (points: number, reason: string) => void; }

const NutritionQuest = ({ addPoints }: NutritionQuestProps) => {
  const { language } = useLanguage();
  const [quests, setQuests] = useState<Quest[]>(getLS('th_quests_active', DEFAULT_QUESTS));

  const save = (updated: Quest[]) => { setQuests(updated); setLS('th_quests_active', updated); };

  const advance = (id: string) => {
    const updated = quests.map(q => {
      if (q.id !== id || q.completed) return q;
      const newProgress = Math.min(q.progress + 1, q.target);
      const completed = newProgress >= q.target;
      if (completed) {
        addPoints?.(q.points, q.name);
        const pts = getLS<number>(LS_KEYS.POINTS, 0);
        setLS(LS_KEYS.POINTS, pts + q.points);
        toast.success(`Quest complete! +${q.points} points`);
      }
      return { ...q, progress: newProgress, completed };
    });
    save(updated);
  };

  const resetQuests = () => { save(DEFAULT_QUESTS); toast.success("Quests reset!"); };

  return (
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
              {q.completed ? <Check className="h-5 w-5 text-green-600" /> : <Button size="sm" onClick={() => advance(q.id)}>+1</Button>}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{q.description}</p>
            <Progress value={(q.progress / q.target) * 100} className="h-1.5" />
            <span className="text-xs text-muted-foreground">{q.progress}/{q.target}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NutritionQuest;
