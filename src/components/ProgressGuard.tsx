import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import progressionService from '@/services/progressionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight } from 'lucide-react';

interface ProgressGuardProps {
  children: React.ReactNode;
  requiredStage: 'goals' | 'game' | 'points' | 'challenges' | 'level';
  currentPageName: string;
}

const stageInfo = {
  goals: { name: 'Goal Wizard', route: '/goal-wizard', description: 'Set up your nutrition goals first' },
  game: { name: 'Nutrition Game', route: '/games', description: 'Play the nutrition game to earn points' },
  points: { name: 'Points History', route: '/points-transactions', description: 'View your points after earning some' },
  challenges: { name: 'Challenges', route: '/challenges', description: 'Join challenges to advance further' },
  level: { name: 'Level Benefits', route: '/level-benefits', description: 'View level benefits after completing challenges' }
};

const ProgressGuard: React.FC<ProgressGuardProps> = ({ children, requiredStage, currentPageName }) => {
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/');
          return;
        }

        setUserId(user.id);
        const hasAccess = await progressionService.canAccess(user.id, requiredStage);
        setCanAccess(hasAccess);
      } catch (error) {
        console.error('Error checking progression access:', error);
        setCanAccess(false);
      }
    };

    checkAccess();
  }, [requiredStage, navigate]);

  if (canAccess === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canAccess) {
    const stages = ['goals', 'game', 'points', 'challenges', 'level'];
    const currentIndex = stages.indexOf(requiredStage);
    const nextStage = currentIndex > 0 ? stages[currentIndex - 1] : 'goals';
    const nextStageInfo = stageInfo[nextStage as keyof typeof stageInfo];

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle>Access Locked</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You need to complete <strong>{nextStageInfo.name}</strong> before accessing {currentPageName}.
            </p>
            <p className="text-sm text-muted-foreground">
              {nextStageInfo.description}
            </p>
            <Button 
              onClick={() => navigate(nextStageInfo.route)}
              className="w-full"
            >
              Go to {nextStageInfo.name}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProgressGuard;