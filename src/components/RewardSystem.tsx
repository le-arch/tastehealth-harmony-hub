import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Confetti from "@/components/Confetti";
import { Trophy, Award, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface RewardType {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: string;
  achieved: boolean;
  date_achieved: string;
}

const RewardsSystem = () => {
  const [rewards, setRewards] = useState<RewardType[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  // Translations
  const translations = {
    en: {
      title: "Rewards & Achievements",
      weeklyProgress: "Weekly Progress",
      progressDescription: "Your health goals achievement for this week",
      noRewards: "Complete health goals to earn rewards!",
      progressFeedback: {
        great: "Great work! Keep it up!",
        good: "Good progress! You're on your way.",
        steps: "You're making steps toward your goals."
      },
      viewAll: "View All Rewards"
    },
    fr: {
      title: "Récompenses & Succès",
      weeklyProgress: "Progrès Hebdomadaire",
      progressDescription: "Vos réalisations de santé cette semaine",
      noRewards: "Complétez vos objectifs de santé pour gagner des récompenses !",
      progressFeedback: {
        great: "Excellent travail ! Continuez comme ça !",
        good: "Bon progrès ! Vous êtes sur la bonne voie.",
        steps: "Vous progressez vers vos objectifs."
      },
      viewAll: "Voir Toutes les Récompenses"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    fetchRewards();
    fetchWeeklyProgress();
  }, []);

  const fetchRewards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('date_achieved', { ascending: false });
      
      if (error) throw error;
      
      setRewards(data || []);
      
      // Check if there's any new reward achieved in the last hour
      const recentRewards = data?.filter(reward => {
        const achievedTime = new Date(reward.date_achieved).getTime();
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        return achievedTime > oneHourAgo && reward.achieved;
      });
      
      if (recentRewards && recentRewards.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // Get daily progress for the past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', oneWeekAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Calculate average overall progress
        const totalProgress = data.reduce((sum, day) => sum + (day.overall_progress_percentage || 0), 0);
        const avgProgress = totalProgress / data.length;
        setWeeklyProgress(Math.round(avgProgress));
      }
    } catch (error) {
      console.error("Error fetching weekly progress:", error);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="h-6 w-6" />;
      case 'award':
        return <Award className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <Confetti active={showConfetti} />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {t.weeklyProgress}
          </CardTitle>
          <CardDescription>
            {t.progressDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Progress</span>
              <span>{weeklyProgress !== null && weeklyProgress !== undefined ? `${weeklyProgress}%` : "0%"}</span>
            </div>
            <Progress 
              value={weeklyProgress || 0} 
              className="h-2" 
              indicatorClassName={`${weeklyProgress > 75 ? 'bg-green-500' : weeklyProgress > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
            />
            <p className="text-sm text-muted-foreground mt-2">
              {weeklyProgress > 75 
                ? t.progressFeedback.great
                : weeklyProgress > 50 
                ? t.progressFeedback.good
                : t.progressFeedback.steps}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <p className="text-center col-span-2">Loading rewards...</p>
        ) : rewards.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-muted-foreground" />
              </div>
              <p>{t.noRewards}</p>
            </CardContent>
          </Card>
        ) : (
          rewards.map((reward) => (
            <Card key={reward.id} className={`overflow-hidden transition-all duration-300 ${reward.achieved ? 'border-yellow-500/50 shadow-yellow-500/20 shadow-md' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-yellow-500">{getIconComponent(reward.icon)}</span>
                  {reward.name}
                  {reward.achieved && <Badge variant="outline" className="ml-auto">Achieved</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{reward.description}</p>
                {reward.achieved && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Earned on {new Date(reward.date_achieved).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="text-center">
        <button className="btn btn-primary">{t.viewAll}</button>
      </div>
    </div>
  );
};

export default RewardsSystem;
