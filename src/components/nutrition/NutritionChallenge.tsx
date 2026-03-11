import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Plus, 
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
  Target,
  Coffee,
  Bike,
  Dumbbell,
  Calendar,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, PointsTransaction } from "@/utils/localStorage";
import { motion } from "framer-motion";
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
  reset: '🔄',
  apple: '🍎',
  water: '💧',
  workout: '💪',
  sleep: '😴'
};

type ChallengeCategory = 'nutrition' | 'hydration' | 'fitness' | 'wellness' | 'mindfulness';

// SIMPLIFIED TYPE - no React elements in stored data
interface Challenge {
  id: string;
  name: string;
  category: ChallengeCategory;
  color: string;
  description: string;
  duration: number;
  difficulty: number;
  target: number;
  progress: number;
  completed: boolean;
  startDate: string;
  streak: number;
  lastUpdated: string | null;
  dailyLogs: { date: string; completed: boolean; value?: number }[];
  types: string[];
}

// Color mapping for Tailwind classes
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
const getCategoryIcon = (category: ChallengeCategory, color: string, className: string = "h-4 w-4") => {
  const iconProps = { className };
  
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

// Helper component for difficulty stars
const DifficultyStars = ({ difficulty }: { difficulty: number }) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: difficulty }).map((_, i) => (
      <Flame key={i} className="h-3 w-3 text-orange-500" />
    ))}
  </span>
);

// PRESET CHALLENGES - WITHOUT storing React elements
const PRESET_CHALLENGES: Omit<Challenge, 'id' | 'startDate' | 'progress' | 'completed' | 'streak' | 'lastUpdated' | 'dailyLogs'>[] = [
  // Nutrition Challenges
  { 
    name: "5-a-Day", 
    category: "nutrition",
    color: "green",
    description: "Eat 5 servings of fruits and vegetables daily",
    duration: 7, 
    difficulty: 1, 
    target: 35,
    types: ["vegetables", "fruits"]
  },
  { 
    name: "Protein Power", 
    category: "nutrition",
    color: "red",
    description: "Hit your daily protein target",
    duration: 14, 
    difficulty: 3, 
    target: 14,
    types: ["protein"]
  },
  { 
    name: "Sugar Detox", 
    category: "nutrition",
    color: "yellow",
    description: "Stay under 25g of added sugar daily",
    duration: 14, 
    difficulty: 4, 
    target: 14,
    types: ["healthy"]
  },
  { 
    name: "Mindful Eating", 
    category: "nutrition",
    color: "pink",
    description: "Practice mindful eating (no screens, chew slowly)",
    duration: 10, 
    difficulty: 2, 
    target: 10,
    types: ["mindfulness"]
  },
  // Hydration Challenges
  { 
    name: "Hydration Hero", 
    category: "hydration",
    color: "blue",
    description: "Drink 8 glasses of water daily",
    duration: 7, 
    difficulty: 2, 
    target: 56,
    types: ["water"]
  },
  { 
    name: "Electrolyte Balance", 
    category: "hydration",
    color: "cyan",
    description: "Add electrolytes to your water post-workout",
    duration: 10, 
    difficulty: 2, 
    target: 10,
    types: ["hydration"]
  },
  // Fitness Challenges
  { 
    name: "10K Steps", 
    category: "fitness",
    color: "purple",
    description: "Walk 10,000 steps daily",
    duration: 30, 
    difficulty: 3, 
    target: 30,
    types: ["steps"]
  },
  { 
    name: "Workout Streak", 
    category: "fitness",
    color: "orange",
    description: "Complete a 30-min workout daily",
    duration: 21, 
    difficulty: 4, 
    target: 21,
    types: ["workout"]
  },
  { 
    name: "Morning Stretch", 
    category: "fitness",
    color: "lime",
    description: "15 minutes of morning stretching",
    duration: 14, 
    difficulty: 2, 
    target: 14,
    types: ["stretching"]
  },
  // Wellness Challenges
  { 
    name: "Sleep Champion", 
    category: "wellness",
    color: "indigo",
    description: "Get 7-8 hours of sleep",
    duration: 14, 
    difficulty: 2, 
    target: 14,
    types: ["sleep"]
  },
  { 
    name: "Meditation", 
    category: "mindfulness",
    color: "violet",
    description: "Meditate for 10 minutes daily",
    duration: 21, 
    difficulty: 3, 
    target: 21,
    types: ["meditation"]
  },
  { 
    name: "No Alcohol", 
    category: "wellness",
    color: "amber",
    description: "No alcohol consumption",
    duration: 30, 
    difficulty: 5, 
    target: 30,
    types: ["healthy"]
  }
];

// Group challenges by category for filtering
const challengesByCategory = PRESET_CHALLENGES.reduce((acc, challenge) => {
  if (!acc[challenge.category]) {
    acc[challenge.category] = [];
  }
  acc[challenge.category].push(challenge);
  return acc;
}, {} as Record<string, typeof PRESET_CHALLENGES>);

interface NutritionChallengeProps {
  onChallengeJoined?: () => void;
}

const NutritionChallenge: React.FC<NutritionChallengeProps> = ({ onChallengeJoined }) => {
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
        dailyLogs: Array.isArray(c.dailyLogs) ? c.dailyLogs : [],
        types: Array.isArray(c.types) ? c.types : []
      }));
    } catch (e) {
      console.error('Error loading challenges:', e);
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConfetti, setShowConfetti] = useState(false);

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

  const joinChallenge = (preset: typeof PRESET_CHALLENGES[0]) => {
    const challenge: Challenge = {
      ...preset,
      id: crypto.randomUUID(),
      startDate: new Date().toISOString(),
      progress: 0,
      completed: false,
      streak: 0,
      lastUpdated: null,
      dailyLogs: []
    };
    save([...challenges, challenge]);
    showToast('joined', `Joined "${preset.name}"!`, preset.description);
    if (onChallengeJoined) onChallengeJoined();
  };

  const updateProgress = (id: string, value: number = 1) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updated = challenges.map(c => {
      if (c.id !== id) return c;

      // Check if already logged today
      const alreadyLoggedToday = c.dailyLogs.some(log => log.date === today);
      if (alreadyLoggedToday) {
        showToast('info', "You've already logged today's progress!");
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
      const dailyLogs = [...c.dailyLogs, { date: today, completed: true, value }];

      // Simulate milestone achievements
      const milestonesMet = [5, 10, 15, 20, 25].some(m => newProgress === m);
      if (milestonesMet) {
        showToast('milestone', `🎯 Progress Milestone: ${newProgress}/${c.target}!`);
        playMilestoneSound('reward');
      }

      if (completed && !c.completed) {
        setShowConfetti(true);
        playMilestoneSound('reward');
        setTimeout(() => setShowConfetti(false), 3500);
        
        const pointsEarned = c.difficulty * 25;
        showToast('completed', `🎉 Challenge "${c.name}" completed! +${pointsEarned} pts`);

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
    <Card className="w-full">
      <Confetti active={showConfetti} />
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
            <Trophy className="h-5 w-5 text-amber-500" />
          </motion.span>
          Nutrition Challenges
        </CardTitle>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Button 
            size="sm" 
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {Object.keys(challengesByCategory).map(category => (
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

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-primary/5 rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground">Active</div>
            <div className="text-lg font-bold">{activeChallenges.length}</div>
          </div>
          <div className="bg-green-500/5 rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground">Completed</div>
            <div className="text-lg font-bold">{completedChallenges.length}</div>
          </div>
          <div className="bg-orange-500/5 rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground">Total Streak</div>
            <div className="text-lg font-bold">
              {activeChallenges.reduce((sum, c) => sum + c.streak, 0)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active ({activeChallenges.length})</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedChallenges.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-4">
            {filteredActiveChallenges.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="text-center py-8"
              >
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Target className="h-12 w-12 mx-auto text-primary/40" />
                </motion.div>
                <p className="text-muted-foreground mt-4">
                  {selectedCategory === 'all' 
                    ? "No active challenges. Join one from the Available tab!" 
                    : `No active ${selectedCategory} challenges.`}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredActiveChallenges.map(c => (
                  <motion.div 
                    key={c.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${colorClasses[c.color]}`}>
                          {getCategoryIcon(c.category, c.color)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{c.name}</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {c.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs flex items-center gap-1">
                              <DifficultyStars difficulty={c.difficulty} />
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                          <div className="flex gap-1 mt-1">
                            {c.types.map(type => (
                              <Badge key={type} variant="outline" className="text-[10px] capitalize">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => deleteChallenge(c.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mt-3">
                      <Progress value={(c.progress / c.target) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{c.progress}/{c.target} completed</span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {c.streak} day streak
                        </span>
                      </div>
                    </div>

                    {/* Weekly Calendar View */}
                    <div className="mt-3 flex gap-1">
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

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
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
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-4 mt-4">
            <div className="space-y-4">
              {Object.entries(challengesByCategory).map(([category, categoryChallenges]) => (
                (selectedCategory === 'all' || selectedCategory === category) && (
                  <div key={category} className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {category}
                    </h5>
                    {categoryChallenges.map((p, i) => {
                      const isJoined = challenges.some(c => c.name === p.name && !c.completed);
                      return (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${colorClasses[p.color]}`}>
                              {getCategoryIcon(p.category, p.color)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{p.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {p.duration} days
                                </Badge>
                                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                  <DifficultyStars difficulty={p.difficulty} />
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{p.description}</p>
                              <div className="flex gap-1 mt-1">
                                {p.types.map(type => (
                                  <Badge key={type} variant="outline" className="text-[10px] capitalize">
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => joinChallenge(p)}
                            disabled={isJoined}
                            variant={isJoined ? "outline" : "default"}
                          >
                            {isJoined ? 'Joined' : 'Join'}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                )
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {completedChallenges.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed challenges yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedChallenges.map(c => (
                  <motion.div 
                    key={c.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 border rounded-lg bg-green-50 dark:bg-green-950"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{c.name}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {c.category}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => resetChallenge(c.id)}
                        >
                          <Sparkles className="h-4 w-4 mr-1" />
                          Restart
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => deleteChallenge(c.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Completed in {c.dailyLogs.length} days with a {c.streak}-day streak! 
                      Earned {c.difficulty * 25} points.
                    </p>
                    <Progress value={100} className="h-1 mt-2" />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NutritionChallenge;