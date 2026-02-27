
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, Challenge } from "@/utils/localStorage";

const PRESET_CHALLENGES: Omit<Challenge, 'id' | 'startDate' | 'progress' | 'completed'>[] = [
  { name: "5-a-Day", types: ["vegetables"], duration: 7, difficulty: 1, target: 35 },
  { name: "Hydration Hero", types: ["water"], duration: 7, difficulty: 2, target: 56 },
  { name: "Protein Power", types: ["protein"], duration: 14, difficulty: 3, target: 14 },
];

const NutritionChallenge = () => {
  const [challenges, setChallenges] = useState<Challenge[]>(getLS(LS_KEYS.CHALLENGES, []));

  const save = (updated: Challenge[]) => { setChallenges(updated); setLS(LS_KEYS.CHALLENGES, updated); };

  const joinChallenge = (preset: typeof PRESET_CHALLENGES[0]) => {
    const challenge: Challenge = { ...preset, id: crypto.randomUUID(), startDate: new Date().toISOString(), progress: 0, completed: false };
    save([...challenges, challenge]);
    toast.success(`Joined "${preset.name}"!`);
  };

  const updateProgress = (id: string) => {
    const updated = challenges.map(c => {
      if (c.id !== id) return c;
      const newProgress = Math.min(c.progress + 1, c.target);
      const completed = newProgress >= c.target;
      if (completed) toast.success(`🎉 Challenge "${c.name}" completed!`);
      return { ...c, progress: newProgress, completed };
    });
    save(updated);
  };

  const deleteChallenge = (id: string) => { save(challenges.filter(c => c.id !== id)); toast.success("Challenge removed"); };

  return (
    <Card className="w-full">
      <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" />Nutrition Challenges</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {challenges.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Active Challenges</h4>
            {challenges.map(c => (
              <div key={c.id} className={`p-3 border rounded-lg ${c.completed ? 'bg-green-50 dark:bg-green-950' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{c.name}</span>
                  <div className="flex gap-1">
                    {!c.completed && <Button size="sm" variant="outline" onClick={() => updateProgress(c.id)}><Plus className="h-3 w-3 mr-1" />Progress</Button>}
                    <Button size="sm" variant="ghost" onClick={() => deleteChallenge(c.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </div>
                <Progress value={(c.progress / c.target) * 100} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{c.progress}/{c.target}</span>
                  {c.completed && <Badge className="bg-green-600 text-xs">Complete!</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Available Challenges</h4>
          {PRESET_CHALLENGES.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">{p.name}</span>
                <span className="text-sm text-muted-foreground ml-2">{p.duration} days</span>
              </div>
              <Button size="sm" onClick={() => joinChallenge(p)}>Join</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionChallenge;
