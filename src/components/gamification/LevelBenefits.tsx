
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Gift, Crown, Zap } from 'lucide-react';

interface LevelBenefitsProps { userId: string; }

const LevelBenefits: React.FC<LevelBenefitsProps> = () => {
  const userLevel = { level: 1, total_points: 0, points_to_next_level: 100 };

  const levelBenefits = [
    { level: 1, title: "Welcome Badge", description: "Get started with your nutrition journey", icon: "star", unlocked: true },
    { level: 2, title: "Streak Tracker", description: "Track daily nutrition streaks", icon: "zap", unlocked: false },
    { level: 5, title: "Nutrition Expert", description: "Unlock premium nutrition insights", icon: "crown", unlocked: false },
    { level: 10, title: "Master Nutritionist", description: "All features unlocked", icon: "crown", unlocked: false },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'star': return <Star className="h-5 w-5" />;
      case 'zap': return <Zap className="h-5 w-5" />;
      case 'gift': return <Gift className="h-5 w-5" />;
      case 'crown': return <Crown className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-amber-500" />Level Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center"><span className="text-sm font-medium">Level {userLevel.level}</span><span className="text-sm text-muted-foreground">{userLevel.total_points} points</span></div>
            <Progress value={0} className="h-2" />
            <p className="text-xs text-muted-foreground">{userLevel.points_to_next_level} points to level {userLevel.level + 1}</p>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {levelBenefits.map((benefit) => (
          <Card key={benefit.level} className={benefit.unlocked ? 'border-green-200 bg-green-50' : 'border-border'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${benefit.unlocked ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>{getIcon(benefit.icon)}</div>
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
