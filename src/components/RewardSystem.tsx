import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gift, Star, Zap, Crown, Check, Heart, Sparkles, Gem, Medal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, Reward, CalorieEntry, HydrationEntry, MealPlan, Challenge, PointsTransaction } from "@/utils/localStorage";
import Confetti from "@/components/Confetti";
import { playMilestoneSound } from "@/utils/sounds";

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', name: 'First Step', description: 'Log your first calorie entry', points: 10, claimed: false, icon: 'star' },
  { id: '2', name: 'Hydration Starter', description: 'Drink 8 cups of water in a day', points: 25, claimed: false, icon: 'zap' },
  { id: '3', name: 'Week Warrior', description: 'Log data for 7 consecutive days', points: 50, claimed: false, icon: 'trophy' },
  { id: '4', name: 'Meal Master', description: 'Create your first meal plan', points: 30, claimed: false, icon: 'gift' },
  { id: '5', name: 'Nutrition King', description: 'Reach 1000 total points', points: 100, claimed: false, icon: 'crown' },
  { id: '6', name: 'Goal Setter', description: 'Save a nutrition goal', points: 20, claimed: false, icon: 'star' },
  { id: '7', name: 'Challenge Champion', description: 'Complete a challenge', points: 40, claimed: false, icon: 'trophy' },
  { id: '8', name: 'Quest Master', description: 'Complete all quests', points: 60, claimed: false, icon: 'crown' },
  { id: '9', name: 'Quiz Scholar', description: 'Score 80%+ on a quiz', points: 35, claimed: false, icon: 'sparkles' },
  { id: '10', name: 'Healthy Heart', description: 'Log 30 days of exercise', points: 75, claimed: false, icon: 'heart' },
  { id: '11', name: 'Mood Explorer', description: 'Track 20 meal moods', points: 30, claimed: false, icon: 'gem' },
  { id: '12', name: 'Recipe Pioneer', description: 'Create 3 custom recipes', points: 40, claimed: false, icon: 'medal' },
  { id: '13', name: 'Streak Legend', description: 'Maintain a 30-day streak', points: 150, claimed: false, icon: 'crown' },
  { id: '14', name: 'Point Collector', description: 'Earn 2500 total points', points: 100, claimed: false, icon: 'gem' },
  { id: '15', name: 'Ultimate Champion', description: 'Reach level 10', points: 200, claimed: false, icon: 'trophy' },
];

const iconMap: Record<string, React.ReactNode> = {
  star: <Star className="h-5 w-5 text-yellow-500" />,
  zap: <Zap className="h-5 w-5 text-purple-500" />,
  trophy: <Trophy className="h-5 w-5 text-amber-500" />,
  gift: <Gift className="h-5 w-5 text-green-500" />,
  crown: <Crown className="h-5 w-5 text-amber-600" />,
  heart: <Heart className="h-5 w-5 text-red-500" />,
  sparkles: <Sparkles className="h-5 w-5 text-blue-500" />,
  gem: <Gem className="h-5 w-5 text-cyan-500" />,
  medal: <Medal className="h-5 w-5 text-orange-500" />,
};

const RewardsSystem = () => {
  const { language } = useLanguage();
  const [rewards, setRewards] = useState<Reward[]>(getLS(LS_KEYS.REWARDS, DEFAULT_REWARDS));
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Ensure we have all rewards (in case new ones were added)
    const current = getLS<Reward[]>(LS_KEYS.REWARDS, DEFAULT_REWARDS);
    const merged = DEFAULT_REWARDS.map(dr => {
      const existing = current.find(c => c.id === dr.id);
      return existing || dr;
    });

    const updated = [...merged];
    let changed = false;

    const calorieLog = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []);
    const hydrationLog = getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []);
    const mealPlans = getLS<MealPlan[]>(LS_KEYS.MEAL_PLANS, []);
    const points = getLS<number>(LS_KEYS.POINTS, 0);
    const streak = getLS<number>(LS_KEYS.STREAK, 0);
    const challenges = getLS<Challenge[]>(LS_KEYS.CHALLENGES, []);
    const completedChallenges = challenges.filter(c => c.completed);
    const nutritionGoal = getLS<any>('th_nutrition_goal', null);
    const quests = getLS<any[]>('th_quests_active', []);
    const allQuestsComplete = quests.length > 0 && quests.every((q: any) => q.completed);
    const quizScores = getLS<any[]>('th_quiz_scores', []);
    const exerciseLog = getLS<any[]>(LS_KEYS.EXERCISE_LOG, []);
    const moodLog = getLS<any[]>(LS_KEYS.MOOD_LOG, []);
    const recipes = getLS<any[]>('th_custom_recipes', []);
    const level = getLS<number>(LS_KEYS.LEVEL, 1);

    const conditions: Record<string, boolean> = {
      '1': calorieLog.length > 0,
      '2': hydrationLog.some(h => h.cups >= 8),
      '3': streak >= 7,
      '4': mealPlans.length > 0,
      '5': points >= 1000,
      '6': !!nutritionGoal,
      '7': completedChallenges.length > 0,
      '8': allQuestsComplete,
      '9': quizScores.some((s: any) => s.score >= 80),
      '10': exerciseLog.length >= 30,
      '11': moodLog.length >= 20,
      '12': recipes.length >= 3,
      '13': streak >= 30,
      '14': points >= 2500,
      '15': level >= 10,
    };

    updated.forEach((r, i) => {
      if (!r.claimed && conditions[r.id]) {
        updated[i] = { ...r, claimed: true };
        changed = true;
        const currentPts = getLS<number>(LS_KEYS.POINTS, 0);
        setLS(LS_KEYS.POINTS, currentPts + r.points);
        // Save to points history
        const history = getLS<PointsTransaction[]>(LS_KEYS.POINTS_HISTORY, []);
        history.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), points: r.points, reason: `Reward: ${r.name}` });
        setLS(LS_KEYS.POINTS_HISTORY, history.slice(0, 100));
        toast.success(`🎉 Auto-claimed: ${r.name} (+${r.points} pts)`);
      }
    });

    if (changed) {
      setRewards(updated);
      setLS(LS_KEYS.REWARDS, updated);
      setShowConfetti(true);
      playMilestoneSound('reward');
      setTimeout(() => setShowConfetti(false), 3500);
    } else {
      setRewards(updated);
    }
  }, []);

  const claimed = rewards.filter(r => r.claimed).length;

  return (
    <div className="space-y-6">
      <Confetti active={showConfetti} />
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
            <div key={r.id} className={`flex items-center justify-between p-3 border rounded-lg transition-all ${r.claimed ? 'bg-green-50 dark:bg-green-950 border-green-200' : ''}`}>
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
                  <Badge className="bg-green-600 flex items-center gap-1"><Check className="h-3 w-3" />Claimed</Badge>
                ) : (
                  <Badge variant="outline">Locked</Badge>
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
