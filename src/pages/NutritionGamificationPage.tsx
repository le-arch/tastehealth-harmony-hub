"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, Challenge } from "@/utils/localStorage";
import {
  Trophy, ChefHat, Plus, Check, Clock, Star,
  Mountain, Flame, Target, Zap, Award, Crown
} from "lucide-react";
import WeeklyMealPrepPlanner from "@/components/nutrition/WeeklyMealPrepPlanner";
import MealPrepFeedback from "@/components/nutrition/MealPrepFeedback";
import LevelBenefits from "@/components/gamification/LevelBenefits";
import ChallengeCreator from "@/components/ChallengeCreator";

const NutritionGamificationPage = () => {
  const [activeTab, setActiveTab] = useState("challenges");
  const [challenges, setChallenges] = useState<Challenge[]>(getLS(LS_KEYS.CHALLENGES, []));

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  const advanceChallenge = (id: string) => {
    const today = new Date().toDateString();
    const updated = challenges.map(c => {
      if (c.id !== id) return c;
      const lastAdv = localStorage.getItem(`th_challenge_adv_${id}`);
      if (lastAdv === today) {
        toast.error("Already advanced today! Come back tomorrow.");
        return c;
      }
      localStorage.setItem(`th_challenge_adv_${id}`, today);
      const newProgress = Math.min(c.progress + 1, c.target);
      const completed = newProgress >= c.target;
      if (completed) {
        toast.success(`🎉 Challenge "${c.name}" completed!`);
        const pts = getLS<number>(LS_KEYS.POINTS, 0);
        setLS(LS_KEYS.POINTS, pts + 50);
        const history = getLS<any[]>(LS_KEYS.POINTS_HISTORY, []);
        history.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), points: 50, reason: `Completed challenge: ${c.name}` });
        setLS(LS_KEYS.POINTS_HISTORY, history);
      }
      return { ...c, progress: newProgress, completed };
    });
    setChallenges(updated);
    setLS(LS_KEYS.CHALLENGES, updated);
  };

  const getDifficultyColor = (diff: number) => {
    if (diff <= 2) return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
    if (diff <= 3) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
    return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
  };
  const getDifficultyLabel = (diff: number) => diff <= 2 ? "Easy" : diff <= 3 ? "Medium" : "Hard";

  return (
    <PageLayout activePage="nutrition-game">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Mountain className="h-7 w-7 text-primary" />
            Nutrition Gamification
          </h1>
          <p className="text-muted-foreground mt-1">Track challenges, level up, and plan your meals</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" /> Challenges
            </TabsTrigger>
            <TabsTrigger value="levels" className="flex items-center gap-2">
              <Crown className="h-4 w-4" /> Levels
            </TabsTrigger>
            <TabsTrigger value="mealPrep" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" /> Meal Prep
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-6">
            <ChallengeCreator onCreate={(challenge) => {
              setChallenges(prev => {
                const updated = [challenge, ...prev];
                setLS(LS_KEYS.CHALLENGES, updated);
                return updated;
              });
            }} />
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Active Challenges ({activeChallenges.length})
              </h2>
              {activeChallenges.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Mountain className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No active challenges. Create one from Explore Challenges in the Nutrition Game!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeChallenges.map(c => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="border-l-4 border-l-primary">
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-sm">{c.name}</h3>
                            <Badge className={getDifficultyColor(c.difficulty)}>{getDifficultyLabel(c.difficulty)}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{c.duration} days</span>
                            <span>•</span>
                            <span>{c.types.join(", ")}</span>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{c.progress}/{c.target}</span>
                            </div>
                            <Progress value={(c.progress / c.target) * 100} className="h-2" />
                          </div>
                          <Button size="sm" className="w-full" onClick={() => advanceChallenge(c.id)}>
                            <Zap className="h-4 w-4 mr-1" />
                            Mark Today Complete
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {completedChallenges.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-500" />
                  Completed ({completedChallenges.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {completedChallenges.map(c => (
                    <Card key={c.id} className="border-l-4 border-l-green-500 opacity-80">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-sm">{c.name}</span>
                          <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Done</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="levels" className="space-y-6">
            <LevelBenefits userId="local" />
          </TabsContent>

          <TabsContent value="mealPrep" className="space-y-6">
            <WeeklyMealPrepPlanner />
            <MealPrepFeedback />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default NutritionGamificationPage;
