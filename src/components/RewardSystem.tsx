
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gift, Star, Zap, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, Reward } from "@/utils/localStorage";

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', name: 'First Step', description: 'Log your first calorie entry', points: 10, claimed: false, icon: 'star' },
  { id: '2', name: 'Hydration Starter', description: 'Drink 8 cups of water in a day', points: 25, claimed: false, icon: 'zap' },
  { id: '3', name: 'Week Warrior', description: 'Log data for 7 consecutive days', points: 50, claimed: false, icon: 'trophy' },
  { id: '4', name: 'Meal Master', description: 'Create your first meal plan', points: 30, claimed: false, icon: 'gift' },
  { id: '5', name: 'Nutrition King', description: 'Reach 1000 total points', points: 100, claimed: false, icon: 'crown' },
];

const iconMap: Record<string, React.ReactNode> = {
  star: <Star className="h-5 w-5 text-yellow-500" />,
  zap: <Zap className="h-5 w-5 text-purple-500" />,
  trophy: <Trophy className="h-5 w-5 text-amber-500" />,
  gift: <Gift className="h-5 w-5 text-green-500" />,
  crown: <Crown className="h-5 w-5 text-amber-600" />,
};

const RewardsSystem = () => {
  const { language } = useLanguage();
  const [rewards, setRewards] = useState<Reward[]>(getLS(LS_KEYS.REWARDS, DEFAULT_REWARDS));

  const claimReward = (id: string) => {
    const updated = rewards.map(r => r.id === id ? { ...r, claimed: true } : r);
    setRewards(updated); setLS(LS_KEYS.REWARDS, updated);
    const reward = rewards.find(r => r.id === id);
    // Add points
    const points = getLS<number>(LS_KEYS.POINTS, 0);
    setLS(LS_KEYS.POINTS, points + (reward?.points || 0));
    toast.success(`+${reward?.points} points! ${reward?.name} claimed!`);
  };

  const claimed = rewards.filter(r => r.claimed).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {language === 'fr' ? "Récompenses & Succès" : "Rewards & Achievements"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{claimed}/{rewards.length} {language === 'fr' ? 'réclamés' : 'claimed'}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {rewards.map(r => (
            <div key={r.id} className={`flex items-center justify-between p-3 border rounded-lg ${r.claimed ? 'bg-green-50 dark:bg-green-950 border-green-200' : ''}`}>
              <div className="flex items-center gap-3">
                {iconMap[r.icon] || <Star className="h-5 w-5" />}
                <div>
                  <h4 className="font-medium">{r.name}</h4>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{r.points} pts</Badge>
                {r.claimed ? (
                  <Badge className="bg-green-600">Claimed</Badge>
                ) : (
                  <Button size="sm" onClick={() => claimReward(r.id)}>Claim</Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsSystem;
