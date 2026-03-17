import React, { useState, useCallback } from "react";
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
  Flame,
  Calendar,
  Plus,
  Sparkles,
  CheckCircle2,
  Apple,
  Droplet,
  Dumbbell,
  Heart,
  Moon
} from "lucide-react";
import { getLS, setLS, LS_KEYS, PointsTransaction, Challenge as LSChallenge } from "@/utils/localStorage";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Confetti from "@/components/Confetti";
import { playMilestoneSound } from "@/utils/sounds";

// Simple string constants for toast icons - NO REACT ELEMENTS
const TOAST_ICONS = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  trophy: '🏆',
  medal: '🎖️',
  target: '🎯',
  fire: '🔥',
  joined: '🎉',
  milestone: '🎯',
  completed: '🏆',
  deleted: '🗑️',
  reset: '🔄'
};

type ChallengeCategory = 'nutrition' | 'hydration' | 'fitness' | 'wellness' | 'mindfulness';

interface Challenge extends LSChallenge {
  category: ChallengeCategory;
  color: string;
  description: string;
  streak: number;
  lastUpdated: string | null;
  dailyLogs: { date: string; completed: boolean }[];
}

const colorClasses = {
  green: 'bg-green-100 dark:bg-green-950',
  red: 'bg-red-100 dark:bg-red-950',
  blue: 'bg-blue-100 dark:bg-blue-950',
  amber: 'bg-amber-100 dark:bg-amber-950',
  yellow: 'bg-yellow-100 dark:bg-yellow-950',
  pink: 'bg-pink-100 dark:bg-pink-950',
  cyan: 'bg-cyan-100 dark:bg-cyan-950',
  purple: 'bg-purple-100 dark:bg-purple-950',
  orange: 'bg-orange-100 dark:bg-orange-950',
  lime: 'bg-lime-100 dark:bg-lime-950',
  indigo: 'bg-indigo-100 dark:bg-indigo-950',
  violet: 'bg-violet-100 dark:bg-violet-950',
};

// Map category to icon component - for RENDERING only, not storage
const getCategoryIcon = (category: ChallengeCategory, color: string) => {
  const iconProps = { className: "h-4 w-4" };
  
  switch(category) {
    case 'nutrition':
      return <Apple {...iconProps} />;
    case 'hydration':
      return <Droplet {...iconProps} />;
    case 'fitness':
      return <Dumbbell {...iconProps} />;
    case 'wellness':
      return <Heart {...iconProps} />;
    case 'mindfulness':
      return <Moon {...iconProps} />;
    default:
      return <Trophy {...iconProps} />;
  }
};

// PRESET CHALLENGES - WITHOUT storing React elements
const PRESET_CHALLENGES: Omit<Challenge, 'id' | 'startDate' | 'progress' | 'completed' | 'streak' | 'lastUpdated' | 'dailyLogs'>[] = [
  {
    name: "5-a-Day",
    category: "nutrition",
    color: "green",
    description: "Eat 5 servings of fruits and vegetables daily",
    duration: 7,
    difficulty: 1,
    target: 35
  },
  {
    name: "Hydration Hero",
    category: "hydration",
    color: "blue",
    description: "Drink 8 glasses of water daily",
    duration: 7,
    difficulty: 2,
    target: 56
  },
  {
    name: "10K Steps",
    category: "fitness",
    color: "purple",
    description: "Walk 10,000 steps daily",
    duration: 30,
    difficulty: 3,
    target: 30
  },
  {
    name: "Sleep Champion",
    category: "wellness",
    color: "indigo",
    description: "Get 7-8 hours of sleep",
    duration: 14,
    difficulty: 2,
    target: 14
  },
  {
    name: "Meditation",
    category: "mindfulness",
    color: "violet",
    description: "Meditate for 10 minutes daily",
    duration: 21,
    difficulty: 3,
    target: 21
  }
];

const DifficultyStars = ({ difficulty }: { difficulty: number }) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: difficulty }).map((_, i) => (
      <Flame key={i} className="h-3 w-3 text-orange-500" />
    ))}
  </span>
);

const ChallengesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const saved = getLS(LS_KEYS.CHALLENGES, []);
      // Ensure we have clean data without React elements
      return saved.map((c: any) => ({
        id: c.id || crypto.randomUUID(),
        name: c.name || '',
        category: c.category || 'nutrition',
        color: c.color || 'green',
        description: c.description || '',
        duration: c.duration || 7,
        difficulty: c.difficulty || 1,
        target: c.target || 1,
        progress: c.progress || 0,
        completed: c.completed || false,
        startDate: c.startDate || new Date().toISOString(),
        streak: c.streak || 0,
        lastUpdated: c.lastUpdated || null,
        dailyLogs: Array.isArray(c.dailyLogs) ? c.dailyLogs : []
      }));
    } catch (e) {
      console.error('Error loading challenges:', e);
      return [];
    }
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  const save = (updated: Challenge[]) => {
    try {
      // Strip any potential React elements before saving
      const cleanData = updated.map(({ ...c }) => ({
        ...c,
        // Ensure no React elements sneak in
        icon: undefined
      }));
      setChallenges(updated);
      setLS(LS_KEYS.CHALLENGES, cleanData);
    } catch (e) {
      console.error('Error saving challenges:', e);
    }
  };

  const showToast = (type: keyof typeof TOAST_ICONS, message: string, description?: string) => {
    // Use setTimeout to avoid React rendering issues
    setTimeout(() => {
      toast(message, {
        description,
        icon: TOAST_ICONS[type],
        duration: 3000
      });
    }, 0);
  };

  const updateProgress = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updated = challenges.map(c => {
      if (c.id !== id) return c;

      const alreadyLoggedToday = c.dailyLogs.some(log => log.date === today);
      if (alreadyLoggedToday) {
        showToast('info', "You've already logged today's progress!");
        return c;
      }

      const newProgress = Math.min(c.progress + 1, c.target);
      const completed = newProgress >= c.target;
      
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

      const dailyLogs = [...c.dailyLogs, { date: today, completed: true }];

      if (completed && !c.completed) {
        setShowConfetti(true);
        playMilestoneSound('reward');
        setTimeout(() => setShowConfetti(false), 3500);
        
        const pointsEarned = c.difficulty * 25;
        showToast('completed', `🎉 Challenge "${c.name}" completed! +${pointsEarned} pts`);

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

  const addChallenge = (incoming: LSChallenge) => {
    const challenge: Challenge = {
      ...incoming,
      category: 'nutrition',
      color: 'green',
      description: incoming.name,
      streak: 0,
      lastUpdated: null,
      dailyLogs: [],
    };

    const alreadyActive = challenges.some(c => c.id === challenge.id || c.name === challenge.name);
    if (alreadyActive) {
      showToast('info', `Challenge "${challenge.name}" is already active.`);
      return;
    }

    save([...challenges, challenge]);
    showToast('joined', `Joined "${challenge.name}"!`, challenge.description);
  };

  const joinChallenge = (preset: typeof PRESET_CHALLENGES[0]) => {
    const challenge: LSChallenge = {
      id: crypto.randomUUID(),
      name: preset.name,
      types: preset.types,
      duration: preset.duration,
      difficulty: preset.difficulty,
      startDate: new Date().toISOString(),
      progress: 0,
      target: preset.target,
      completed: false,
    };

    addChallenge(challenge);
  };

  const deleteChallenge = (id: string) => {
    save(challenges.filter(c => c.id !== id));
    showToast('deleted', "Challenge deleted");
  };

  const resetChallenge = (id: string) => {
    const updated = challenges.map(c => {
      if (c.id !== id) return c;
      return { ...c, progress: 0, completed: false, streak: 0, dailyLogs: [] };
    });
    save(updated);
    showToast('reset', "Challenge progress reset");
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
                <Trophy className="h-7 w-7 text-amber-500 fill-amber-500" />
              </motion.span>
              Challenges
            </h1>
            
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ScrollableTabsList className="mb-6">
              <TabsTrigger value="active">Active ({activeChallenges.length})</TabsTrigger>
              <TabsTrigger value="create">Create Challenge</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedChallenges.length})</TabsTrigger>
            </ScrollableTabsList>

            <TabsContent value="active">
              {filteredActiveChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto text-primary/40" />
                  <p className="text-muted-foreground mt-4">No active challenges. Create or explore one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredActiveChallenges.map(c => (
                    <Card key={c.id} className="hover:shadow-lg">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${colorClasses[c.color]}`}>
                              {getCategoryIcon(c.category, c.color)}
                            </div>
                            {c.name}
                          </span>
                          <Badge variant="outline" className="capitalize">
                            {c.category}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{c.description}</p>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{c.progress}/{c.target}</span>
                          </div>
                          <Progress value={(c.progress / c.target) * 100} className="h-2" />
                        </div>

                        <div className="flex justify-between text-xs">
                          <span className="flex items-center gap-1 text-orange-500">
                            <Flame className="h-3 w-3" /> {c.streak} day streak
                          </span>
                          <span className="flex items-center gap-1 text-blue-500">
                            <Calendar className="h-3 w-3" /> Started {new Date(c.startDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => updateProgress(c.id)} 
                            className="flex-1"
                            disabled={c.dailyLogs.some(log => log.date === new Date().toISOString().split('T')[0])}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Log Progress
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
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create">
              <ChallengeCreator onCreate={addChallenge} />
            </TabsContent>

            <TabsContent value="explore">
              <ExploreChallenges userId="local" onJoin={addChallenge} />
            </TabsContent>

            <TabsContent value="completed">
              {completedChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No completed challenges yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedChallenges.map(c => (
                    <Card key={c.id} className="border-green-200 bg-green-50/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          {c.name}
                          <Badge variant="outline" className="capitalize">
                            {c.category}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Progress value={100} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mb-3">
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
                          className="w-full"
                        >
                          <Sparkles className="h-4 w-4 mr-1" />
                          Restart
                        </Button>
                      </CardContent>
                    </Card>
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