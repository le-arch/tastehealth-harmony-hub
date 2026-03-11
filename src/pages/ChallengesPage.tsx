import React, { useState, useCallback, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import ChallengeCreator from "@/components/ChallengeCreator";
import ProgressGuard from "@/components/ProgressGuard";
import ExploreChallenges from "@/components/gamification/ExploreChallenges";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger, ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Trash2,
  Apple,
  Droplet,
  Beef,
  Salad,
  Footprints,
  Moon,
  Heart,
  Award,
  CheckCircle2,
  Flame,
  Zap,
  Coffee,
  Bike,
  Dumbbell,
  Medal,
  Calendar,
  Plus,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { getLS, setLS, LS_KEYS, PointsTransaction } from "@/utils/localStorage";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Confetti from "@/components/Confetti";
import { playMilestoneSound } from "@/utils/sounds";

// Types
type ChallengeCategory = 'nutrition' | 'hydration' | 'fitness' | 'wellness' | 'mindfulness';

interface Milestone {
  progress: number;
  reward: string;
}

interface DailyLog {
  date: string;
  completed: boolean;
  value?: number;
}

interface EnhancedChallenge {
  id: string;
  name: string;
  category: ChallengeCategory;
  icon: React.ReactNode;
  color: string;
  description: string;
  duration: number;
  difficulty: number;
  target: number;
  progress: number;
  completed: boolean;
  startDate: string;
  milestones: Milestone[];
  streak: number;
  lastUpdated: string | null;
  dailyLogs: DailyLog[];
  types: string[];
}

// Color mapping
const colorClasses = {
  green: 'bg-green-100 dark:bg-green-950 text-green-600',
  red: 'bg-red-100 dark:bg-red-950 text-red-500',
  blue: 'bg-blue-100 dark:bg-blue-950 text-blue-600',
  amber: 'bg-amber-100 dark:bg-amber-950 text-amber-700',
  yellow: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-500',
  pink: 'bg-pink-100 dark:bg-pink-950 text-pink-500',
  cyan: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-600',
  purple: 'bg-purple-100 dark:bg-purple-950 text-purple-600',
  orange: 'bg-orange-100 dark:bg-orange-950 text-orange-500',
  lime: 'bg-lime-100 dark:bg-lime-950 text-lime-600',
  indigo: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600',
  violet: 'bg-violet-100 dark:bg-violet-950 text-violet-600',
};

// Helper component for difficulty stars
const DifficultyStars = ({ difficulty }: { difficulty: number }) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: difficulty }).map((_, i) => (
      <Flame key={i} className="h-3 w-3 text-orange-500" />
    ))}
  </span>
);

// Icon mapping for categories - returns string names instead of elements
const getCategoryIconName = (category: ChallengeCategory): string => {
  switch(category) {
    case 'nutrition': return 'apple';
    case 'hydration': return 'droplet';
    case 'fitness': return 'dumbbell';
    case 'wellness': return 'heart';
    case 'mindfulness': return 'moon';
    default: return 'trophy';
  }
};

const ChallengesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [challenges, setChallenges] = useState<EnhancedChallenge[]>(() => {
    const saved = getLS(LS_KEYS.CHALLENGES, []);
    // Migrate old format to new format if needed
    return saved.map((c: any) => ({
      ...c,
      streak: c.streak || 0,
      lastUpdated: c.lastUpdated || null,
      dailyLogs: c.dailyLogs || [],
      milestones: c.milestones || [],
      category: c.category || 'nutrition',
      color: c.color || 'green',
      description: c.description || '',
      icon: c.icon || <Trophy className="h-4 w-4" />
    }));
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const refresh = useCallback(() => {
    setChallenges(getLS(LS_KEYS.CHALLENGES, []));
  }, []);

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  const save = (updated: EnhancedChallenge[]) => {
    setChallenges(updated);
    setLS(LS_KEYS.CHALLENGES, updated);
  };

  const updateProgress = (id: string, value: number = 1) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updated = challenges.map(c => {
      if (c.id !== id) return c;

      // Check if already logged today
      const alreadyLoggedToday = c.dailyLogs.some(log => log.date === today);
      if (alreadyLoggedToday) {
        toast.info("You've already logged today's progress!");
        return c;
      }

      const newProgress = Math.min(c.progress + value, c.target);
      const completed = newProgress >= c.target;
      
      // Calculate streak
      let newStreak = c.streak;
      const lastLogDate = c.lastUpdated ? new Date(c.lastUpdated).toISOString().split('T')[0] : null;
      
      if (lastLogDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastLogDate === yesterdayStr) {
          newStreak += 1;
        } else if (lastLogDate !== today) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      // Add daily log
      const dailyLogs = [...c.dailyLogs];
      dailyLogs.push({ date: today, completed: true, value });

      // Check for milestone achievements
      const newMilestone = c.milestones?.find(m => m.progress === newProgress);
      if (newMilestone) {
        toast.success(`🎯 Milestone Unlocked: ${newMilestone.reward}!`);
        playMilestoneSound('reward');
      }

      if (completed && !c.completed) {
        setShowConfetti(true);
        playMilestoneSound('reward');
        setTimeout(() => setShowConfetti(false), 3500);
        
        const pointsEarned = c.difficulty * 25;
        toast.success(`🎉 Challenge "${c.name}" completed! +${pointsEarned} pts`, {
          description: `You've earned the ${c.milestones?.slice(-1)[0]?.reward || 'Final Badge'}!`,
          icon: '🏆' // Use string emoji instead of React element
        });

        // Award points
        const pts = getLS<number>(LS_KEYS.POINTS, 0);
        setLS(LS_KEYS.POINTS, pts + pointsEarned);

        // Save to points history
        const history = getLS<PointsTransaction[]>(LS_KEYS.POINTS_HISTORY, []);
        history.unshift({ 
          id: crypto.randomUUID(), 
          date: new Date().toISOString(), 
          points: pointsEarned, 
          reason: `Completed Challenge: ${c.name}` 
        });
        setLS(LS_KEYS.POINTS_HISTORY, history.slice(0, 100));
      }

      return { 
        ...c, 
        progress: newProgress, 
        completed,
        streak: newStreak,
        lastUpdated: new Date().toISOString(),
        dailyLogs
      };
    });

    save(updated);
  };

  const deleteChallenge = (id: string) => {
    const updated = challenges.filter(c => c.id !== id);
    save(updated);
    toast.success("Challenge deleted");
  };

  const resetChallenge = (id: string) => {
    const updated = challenges.map(c => {
      if (c.id !== id) return c;
      return { ...c, progress: 0, completed: false, streak: 0, dailyLogs: [] };
    });
    save(updated);
    toast.info("Challenge progress reset");
  };

  const filteredActiveChallenges = activeChallenges.filter(c => 
    selectedCategory === 'all' || c.category === selectedCategory
  );

  return (
    <ProgressGuard requiredStage="challenges" currentPageName="Challenges">
      <PageLayout activePage="challenges">
        <Confetti active={showConfetti} />
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                <Trophy className="h-7 w-7 text-amber-500" />
              </motion.span>
              Nutrition Challenges
            </h1>
            <p className="text-muted-foreground mb-4 text-sm">Complete challenges to earn points. Track daily progress and unlock achievements!</p>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button 
                size="sm" 
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              {['nutrition', 'hydration', 'fitness', 'wellness', 'mindfulness'].map(category => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); if (v === 'active') refresh(); }} className="w-full">
            <ScrollableTabsList className="mb-6">
              <TabsTrigger value="active">Active ({activeChallenges.length})</TabsTrigger>
              <TabsTrigger value="create">Create Challenge</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedChallenges.length})</TabsTrigger>
            </ScrollableTabsList>

            <TabsContent value="active">
              {filteredActiveChallenges.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Target className="h-16 w-16 mx-auto text-primary/40" />
                  </motion.div>
                  <p className="text-muted-foreground mt-4">
                    {selectedCategory === 'all' 
                      ? "No active challenges. Create or explore one!" 
                      : `No active ${selectedCategory} challenges. Try a different category!`}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredActiveChallenges.map((c, idx) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                      <Card className="hover:shadow-lg transition-all hover:border-primary/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${colorClasses[c.color as keyof typeof colorClasses] || 'bg-gray-100'}`}>
                                {c.icon}
                              </div>
                              {c.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {c.category}
                              </Badge>
                              <Badge variant={c.difficulty <= 2 ? "secondary" : c.difficulty <= 4 ? "default" : "destructive"} className="flex items-center gap-1">
                                <DifficultyStars difficulty={c.difficulty} />
                              </Badge>
                            </div>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{c.description}</p>
                        </CardHeader>
                        
                        <CardContent className="space-y-3">
                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Daily Progress</span>
                              <span className="font-medium">{c.progress}/{c.target}</span>
                            </div>
                            <Progress value={Math.min((c.progress / c.target) * 100, 100)} className="h-2" />
                          </div>

                          {/* Streak and Stats */}
                          <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-1 text-orange-500">
                              <Flame className="h-3 w-3" /> {c.streak} day streak
                            </span>
                            <span className="flex items-center gap-1 text-blue-500">
                              <Calendar className="h-3 w-3" /> Started {new Date(c.startDate).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Weekly Calendar View */}
                          <div className="flex gap-1 pt-1">
                            {Array.from({ length: 7 }).map((_, i) => {
                              const date = new Date();
                              date.setDate(date.getDate() - i);
                              const dateStr = date.toISOString().split('T')[0];
                              const log = c.dailyLogs.find(l => l.date === dateStr);
                              return (
                                <div key={i} className="flex-1 text-center">
                                  <div className={`h-8 rounded-md flex items-center justify-center text-xs
                                    ${log ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                    {log ? '✓' : '○'}
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">
                                    {date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Milestones */}
                          {c.milestones && c.milestones.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {c.milestones.map((milestone, i) => (
                                <Badge 
                                  key={i}
                                  variant={c.progress >= milestone.progress ? "default" : "outline"}
                                  className={`text-[10px] ${c.progress >= milestone.progress ? 'bg-green-600' : ''}`}
                                >
                                  {milestone.reward}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-2">
                            <Button 
                              size="sm" 
                              onClick={() => updateProgress(c.id)} 
                              className="flex-1"
                              variant={c.dailyLogs.some(log => log.date === new Date().toISOString().split('T')[0]) ? "outline" : "default"}
                              disabled={c.dailyLogs.some(log => log.date === new Date().toISOString().split('T')[0])}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              {c.dailyLogs.some(log => log.date === new Date().toISOString().split('T')[0]) 
                                ? 'Logged Today' 
                                : 'Log Daily Progress'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => deleteChallenge(c.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create">
              <ChallengeCreator />
            </TabsContent>

            <TabsContent value="explore">
              <ExploreChallenges userId="local" />
            </TabsContent>

            <TabsContent value="completed">
              {completedChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No completed challenges yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedChallenges.map((c, idx) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${colorClasses[c.color as keyof typeof colorClasses] || 'bg-gray-100'}`}>
                                {c.icon}
                              </div>
                              {c.name}
                            </span>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Completed
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{c.description}</p>
                        </CardHeader>
                        <CardContent>
                          <Progress value={100} className="h-2 mb-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Completed in {c.dailyLogs.length} days</span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {c.streak} day max streak
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => resetChallenge(c.id)}
                            className="w-full mt-3"
                          >
                            <Sparkles className="h-4 w-4 mr-1" />
                            Restart Challenge
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </ProgressGuard>
  );
};

export default ChallengesPage;