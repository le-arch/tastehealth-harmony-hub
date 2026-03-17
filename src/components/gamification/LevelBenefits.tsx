
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Gift, Crown, Zap } from 'lucide-react';
import { getLS, LS_KEYS } from '@/utils/localStorage';

interface LevelBenefitsProps { userId: string; }

const LevelBenefits: React.FC<LevelBenefitsProps> = () => {
  const points = getLS<number>(LS_KEYS.POINTS, 0);
  const level = getLS<number>(LS_KEYS.LEVEL, 1);
  const getPointsForNextLevel = (lvl: number) => Math.floor(100 * Math.pow(1.5, lvl - 1));
  const nextLevelPts = getPointsForNextLevel(level);
  const progress = Math.min(100, Math.round((points / nextLevelPts) * 100));

  const levelBenefits = [
    { level: 1, title: "Welcome Badge", description: "Get started with your nutrition journey", icon: "star", unlocked: level >= 1 },
    { level: 2, title: "Streak Tracker", description: "Track daily nutrition streaks", icon: "zap", unlocked: level >= 2 },
    { level: 3, title: "Meal Planner Pro", description: "Advanced meal planning features", icon: "gift", unlocked: level >= 3 },
    { level: 5, title: "Nutrition Expert", description: "Unlock premium nutrition insights", icon: "crown", unlocked: level >= 5 },
    { level: 7, title: "Health Master", description: "Access exclusive health analytics", icon: "star", unlocked: level >= 7 },
    { level: 10, title: "Master Nutritionist", description: "All features unlocked", icon: "crown", unlocked: level >= 10 },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'star': return <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />;
      case 'zap': return <Zap className="h-5 w-5 text-purple-500 fill-purple-500" />;
      case 'gift': return <Gift className="h-5 w-5 text-orange-700 fill-yellow-600" />;
      case 'crown': return <Crown className="h-5 w-5 text-yellow-600 fill-yellow-600" />;
      default: return <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-amber-500 fill-amber-500" />Level Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Level {level}</span>
              <span className="text-sm text-muted-foreground">{points} points</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{nextLevelPts - points} points to level {level + 1}</p>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {levelBenefits.map((benefit) => (
          <Card key={benefit.level} className={benefit.unlocked ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-border'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${benefit.unlocked ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>{getIcon(benefit.icon)}</div>
                  <div><h4 className="font-medium">{benefit.title}</h4><p className="text-sm text-muted-foreground">{benefit.description}</p></div>
                </div>
                <Badge variant={benefit.unlocked ? 'default' : 'secondary'}>Level {benefit.level}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LevelBenefits;
