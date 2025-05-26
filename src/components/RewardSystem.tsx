
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Confetti from "@/components/Confetti";
import { Trophy, Award, Star, Gift, Crown } from "lucide-react";
import { supabase } from "@/lib/SupabaseClient";
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
  points?: number;
}

const RewardsSystem = () => {
  const [rewards, setRewards] = useState<RewardType[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
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
      viewAll: "View All Rewards",
      totalPoints: "Total Points",
      recentRewards: "Recent Rewards"
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
      viewAll: "Voir Toutes les Récompenses",
      totalPoints: "Points Totaux",
      recentRewards: "Récompenses Récentes"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    fetchRewards();
    fetchWeeklyProgress();
    fetchUserPoints();
  }, []);

  const fetchUserPoints = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_points')
        .select('total_points')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user points:', error);
        return;
      }
      
      setUserPoints(data?.total_points || 0);
    } catch (error) {
      console.error('Error in fetchUserPoints:', error);
    }
  };

  const fetchRewards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Create mock rewards for demonstration
        const mockRewards = [
          {
            id: '1',
            name: 'First Quest Complete',
            description: 'Completed your first nutrition quest',
            type: 'quest',
            icon: 'trophy',
            achieved: true,
            date_achieved: new Date().toISOString(),
            points: 50
          },
          {
            id: '2',
            name: 'Hydration Hero',
            description: 'Drank 8 glasses of water in a day',
            type: 'challenge',
            icon: 'award',
            achieved: true,
            date_achieved: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            points: 30
          },
          {
            id: '3',
            name: 'Weekly Streak',
            description: 'Maintained health goals for 7 days',
            type: 'achievement',
            icon: 'star',
            achieved: false,
            date_achieved: '',
            points: 100
          }
        ];
        setRewards(mockRewards);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('date_achieved', { ascending: false });
      
      if (error) {
        console.error('Error fetching rewards:', error);
        // Fallback to mock data
        const mockRewards = [
          {
            id: '1',
            name: 'Quest Master',
            description: 'Completed 5 nutrition quests',
            type: 'quest',
            icon: 'trophy',
            achieved: true,
            date_achieved: new Date().toISOString(),
            points: 150
          },
          {
            id: '2',
            name: 'Health Champion',
            description: 'Achieved all daily health goals',
            type: 'challenge',
            icon: 'crown',
            achieved: true,
            date_achieved: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            points: 200
          }
        ];
        setRewards(mockRewards);
      } else {
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
      
      if (!user) {
        setWeeklyProgress(75); // Mock progress
        return;
      }
      
      // Get daily progress for the past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', oneWeekAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching weekly progress:', error);
        setWeeklyProgress(65); // Fallback progress
        return;
      }
      
      if (data && data.length > 0) {
        // Calculate average overall progress
        const totalProgress = data.reduce((sum, day) => sum + (day.overall_progress_percentage || 0), 0);
        const avgProgress = totalProgress / data.length;
        setWeeklyProgress(Math.round(avgProgress));
      } else {
        setWeeklyProgress(45); // Default if no data
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
      case 'crown':
        return <Crown className="h-6 w-6" />;
      case 'gift':
        return <Gift className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getRewardTypeColor = (type: string) => {
    switch (type) {
      case 'quest': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'challenge': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'achievement': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Confetti active={showConfetti} />
      
      {/* Points and Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {t.totalPoints}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {userPoints.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">
              Keep completing quests and challenges!
            </p>
          </CardContent>
        </Card>

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
                <span>{weeklyProgress}%</span>
              </div>
              <Progress 
                value={weeklyProgress} 
                className="h-2" 
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
      </div>
      
      {/* Recent Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            {t.recentRewards}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mx-auto mb-2"></div>
              <p>Loading rewards...</p>
            </div>
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
            <div className="grid gap-4 md:grid-cols-2">
              {rewards.slice(0, 6).map((reward) => (
                <div 
                  key={reward.id} 
                  className={`p-4 border rounded-lg transition-all duration-300 ${
                    reward.achieved 
                      ? 'border-yellow-500/50 shadow-yellow-500/20 shadow-md bg-yellow-50/30' 
                      : 'border-gray-200 bg-gray-50/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${reward.achieved ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                      <span className={reward.achieved ? 'text-yellow-600' : 'text-gray-400'}>
                        {getIconComponent(reward.icon)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{reward.name}</h3>
                        {reward.achieved && <Badge variant="outline" className="text-xs bg-green-100 text-green-700">Achieved</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getRewardTypeColor(reward.type)}`}>
                          {reward.type}
                        </Badge>
                        {reward.points && (
                          <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700">
                            +{reward.points} pts
                          </Badge>
                        )}
                      </div>
                      {reward.achieved && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Earned on {new Date(reward.date_achieved).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsSystem;
