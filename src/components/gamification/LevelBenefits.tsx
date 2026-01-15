
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Gift, Crown, Zap } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface LevelBenefitsProps {
  userId: string;
}

interface UserLevel {
  level: number;
  total_points: number;
  points_to_next_level: number;
}

interface LevelBenefit {
  level: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const LevelBenefits: React.FC<LevelBenefitsProps> = ({ userId }) => {
  const [userLevel, setUserLevel] = useState<UserLevel>({ level: 1, total_points: 0, points_to_next_level: 100 });
  const [loading, setLoading] = useState(true);

  const levelBenefits: LevelBenefit[] = [
    {
      level: 1,
      title: "Welcome Badge",
      description: "Get started with your nutrition journey",
      icon: "star",
      unlocked: true
    },
    {
      level: 2,
      title: "Streak Tracker",
      description: "Track daily nutrition streaks",
      icon: "zap",
      unlocked: userLevel.level >= 2
    },
    {
      level: 3,
      title: "Meal Planner",
      description: "Access advanced meal planning features",
      icon: "gift",
      unlocked: userLevel.level >= 3
    },
    {
      level: 5,
      title: "Nutrition Expert",
      description: "Unlock premium nutrition insights",
      icon: "crown",
      unlocked: userLevel.level >= 5
    },
    {
      level: 7,
      title: "Community Leader",
      description: "Access to exclusive challenges",
      icon: "crown",
      unlocked: userLevel.level >= 7
    },
    {
      level: 10,
      title: "Master Nutritionist",
      description: "All features unlocked",
      icon: "crown",
      unlocked: userLevel.level >= 10
    }
  ];

  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        const { data, error } = await supabase
          .from('user_points')
          .select('current_level, total_points, points_to_next_level')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user level:', error);
          return;
        }

        if (data) {
          setUserLevel({
            level: data.current_level,
            total_points: data.total_points,
            points_to_next_level: data.points_to_next_level
          });
        }
      } catch (error) {
        console.error('Error in fetchUserLevel:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserLevel();
    }
  }, [userId]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'star': return <Star className="h-5 w-5" />;
      case 'zap': return <Zap className="h-5 w-5" />;
      case 'gift': return <Gift className="h-5 w-5" />;
      case 'crown': return <Crown className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Level {userLevel.level}</span>
              <span className="text-sm text-gray-500">{userLevel.total_points} points</span>
            </div>
            <Progress 
              value={userLevel.points_to_next_level > 0 ? 
                ((userLevel.total_points / (userLevel.total_points + userLevel.points_to_next_level)) * 100) : 100
              } 
              className="h-2" 
            />
            <p className="text-xs text-gray-500">
              {userLevel.points_to_next_level > 0 ? 
                `${userLevel.points_to_next_level} points to level ${userLevel.level + 1}` :
                'Max level reached!'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {levelBenefits.map((benefit) => (
          <Card key={benefit.level} className={benefit.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${benefit.unlocked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {getIcon(benefit.icon)}
                  </div>
                  <div>
                    <h4 className="font-medium">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={benefit.unlocked ? 'default' : 'secondary'}>
                    Level {benefit.level}
                  </Badge>
                  {benefit.unlocked && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Unlocked
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LevelBenefits;
