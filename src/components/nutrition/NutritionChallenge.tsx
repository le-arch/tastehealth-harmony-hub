import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  Calendar,
  CheckCircle2,
  Flame,
  Zap,
  Target,
  TrendingUp,
  Coffee,
  Bike,
  Dumbbell,
  Medal
} from "lucide-react";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, Challenge } from "@/utils/localStorage";

// Enhanced challenge types
type ChallengeCategory = 'nutrition' | 'hydration' | 'fitness' | 'wellness' | 'mindfulness';

interface EnhancedChallenge extends Omit<Challenge, 'types'> {
  category: ChallengeCategory;
  icon: JSX.Element;
  color: string;
  description: string;
  milestones: { progress: number; reward: string }[];
  streak: number;
  lastUpdated: string | null;
  dailyLogs: { date: string; completed: boolean; value?: number }[];
}

const PRESET_CHALLENGES: Omit<EnhancedChallenge, 'id' | 'startDate' | 'progress' | 'completed' | 'streak' | 'lastUpdated' | 'dailyLogs'>[] = [
  // Nutrition Challenges
  { 
    name: "5-a-Day", 
    category: "nutrition",
    icon: <Apple className="h-4 w-4" />,
    color: "green",
    description: "Eat 5 servings of fruits and vegetables daily",
    duration: 7, 
    difficulty: 1, 
    target: 35,
    milestones: [
      { progress: 10, reward: "🥕 Baby Carrot Badge" },
      { progress: 25, reward: "🍎 Apple Enthusiast" },
      { progress: 35, reward: "🥗 Salad Master" }
    ]
  },
  { 
    name: "Protein Power", 
    category: "nutrition",
    icon: <Beef className="h-4 w-4" />,
    color: "red",
    description: "Hit your daily protein target",
    duration: 14, 
    difficulty: 3, 
    target: 14,
    milestones: [
      { progress: 5, reward: "🥚 Egg-cellent Start" },
      { progress: 10, reward: "💪 Protein Builder" },
      { progress: 14, reward: "🏋️ Muscle Master" }
    ]
  },
  { 
    name: "Sugar Detox", 
    category: "nutrition",
    icon: <Salad className="h-4 w-4" />,
    color: "yellow",
    description: "Stay under 25g of added sugar daily",
    duration: 14, 
    difficulty: 4, 
    target: 14,
    milestones: [
      { progress: 5, reward: "🍃 Sugar Free Day" },
      { progress: 10, reward: "✨ Clean Eater" },
      { progress: 14, reward: "🏆 Sugar Master" }
    ]
  },
  { 
    name: "Mindful Eating", 
    category: "nutrition",
    icon: <Heart className="h-4 w-4" />,
    color: "pink",
    description: "Practice mindful eating (no screens, chew slowly)",
    duration: 10, 
    difficulty: 2, 
    target: 10,
    milestones: [
      { progress: 3, reward: "🧘 Present Moment" },
      { progress: 7, reward: "🌟 Mindful Eater" },
      { progress: 10, reward: "🕊️ Zen Master" }
    ]
  },

  // Hydration Challenges
  { 
    name: "Hydration Hero", 
    category: "hydration",
    icon: <Droplet className="h-4 w-4" />,
    color: "blue",
    description: "Drink 8 glasses of water daily",
    duration: 7, 
    difficulty: 2, 
    target: 56,
    milestones: [
      { progress: 20, reward: "💧 Thirst Quencher" },
      { progress: 40, reward: "🌊 Wave Rider" },
      { progress: 56, reward: "🏄 Hydration Hero" }
    ]
  },
  { 
    name: "Electrolyte Balance", 
    category: "hydration",
    icon: <Zap className="h-4 w-4" />,
    color: "cyan",
    description: "Add electrolytes to your water post-workout",
    duration: 10, 
    difficulty: 2, 
    target: 10,
    milestones: [
      { progress: 3, reward: "⚡ Energized" },
      { progress: 7, reward: "🔋 Fully Charged" },
      { progress: 10, reward: "⚡ Power House" }
    ]
  },

  // Fitness Challenges
  { 
    name: "10K Steps", 
    category: "fitness",
    icon: <Footprints className="h-4 w-4" />,
    color: "purple",
    description: "Walk 10,000 steps daily",
    duration: 30, 
    difficulty: 3, 
    target: 30,
    milestones: [
      { progress: 10, reward: "🚶 Walker" },
      { progress: 20, reward: "🏃 Jogger" },
      { progress: 30, reward: "🏅 Marathoner" }
    ]
  },
  { 
    name: "Workout Streak", 
    category: "fitness",
    icon: <Dumbbell className="h-4 w-4" />,
    color: "orange",
    description: "Complete a 30-min workout daily",
    duration: 21, 
    difficulty: 4, 
    target: 21,
    milestones: [
      { progress: 7, reward: "💪 Getting Stronger" },
      { progress: 14, reward: "🏋️ Fitness Enthusiast" },
      { progress: 21, reward: "🔥 Beast Mode" }
    ]
  },
  { 
    name: "Morning Stretch", 
    category: "fitness",
    icon: <Bike className="h-4 w-4" />,
    color: "lime",
    description: "15 minutes of morning stretching",
    duration: 14, 
    difficulty: 2, 
    target: 14,
    milestones: [
      { progress: 5, reward: "🌅 Early Riser" },
      { progress: 10, reward: "🧘 Flexible" },
      { progress: 14, reward: "🦢 Yoga Master" }
    ]
  },

  // Wellness Challenges
  { 
    name: "Sleep Champion", 
    category: "wellness",
    icon: <Moon className="h-4 w-4" />,
    color: "indigo",
    description: "Get 7-8 hours of sleep",
    duration: 14, 
    difficulty: 2, 
    target: 14,
    milestones: [
      { progress: 5, reward: "😴 Well Rested" },
      { progress: 10, reward: "🛌 Sleep Pro" },
      { progress: 14, reward: "👑 Sleep Champion" }
    ]
  },
  { 
    name: "Meditation", 
    category: "mindfulness",
    icon: <Heart className="h-4 w-4" />,
    color: "violet",
    description: "Meditate for 10 minutes daily",
    duration: 21, 
    difficulty: 3, 
    target: 21,
    milestones: [
      { progress: 7, reward: "🧘 Beginner's Mind" },
      { progress: 14, reward: "🌿 Zen State" },
      { progress: 21, reward: "🕉️ Enlightened" }
    ]
  },
  { 
    name: "No Alcohol", 
    category: "wellness",
    icon: <Coffee className="h-4 w-4" />,
    color: "amber",
    description: "No alcohol consumption",
    duration: 30, 
    difficulty: 5, 
    target: 30,
    milestones: [
      { progress: 10, reward: "🍃 Clean Week" },
      { progress: 20, reward: "🌱 Sober Month Progress" },
      { progress: 30, reward: "🏆 Alcohol-Free Champion" }
    ]
  }
];

// Group challenges by category
const challengesByCategory = PRESET_CHALLENGES.reduce((acc, challenge) => {
  if (!acc[challenge.category]) {
    acc[challenge.category] = [];
  }
  acc[challenge.category].push(challenge);
  return acc;
}, {} as Record<string, typeof PRESET_CHALLENGES>);

const NutritionChallenge = () => {
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
      icon: c.icon || <Trophy className="h-4 w-4" />,
      color: c.color || 'gray',
      description: c.description || ''
    }));
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const save = (updated: EnhancedChallenge[]) => { 
    setChallenges(updated); 
    setLS(LS_KEYS.CHALLENGES, updated); 
  };

  const joinChallenge = (preset: typeof PRESET_CHALLENGES[0]) => {
    const today = new Date().toISOString().split('T')[0];
    const challenge: EnhancedChallenge = { 
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
    toast.success(`Joined "${preset.name}"!`, {
      description: preset.description,
      icon: preset.icon
    });
  };

  const updateProgress = (id: string, value: number = 1) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updated = challenges.map(c => {
      if (c.id !== id) return c;

      // Check if already logged today
      const alreadyLoggedToday = c.dailyLogs.some(log => log.date === today);
      if (alreadyLoggedToday && c.category !== 'nutrition') {
        toast.error("You've already logged today's progress!");
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
      const existingLogIndex = dailyLogs.findIndex(log => log.date === today);
      
      if (existingLogIndex >= 0) {
        dailyLogs[existingLogIndex] = { date: today, completed: true, value };
      } else {
        dailyLogs.push({ date: today, completed: true, value });
      }

      // Check for milestone achievements
      const newMilestone = c.milestones?.find(m => m.progress === newProgress);
      if (newMilestone) {
        toast.success(`🎯 Milestone Unlocked: ${newMilestone.reward}!`);
      }

      if (completed && !c.completed) {
        toast.success(`🎉 Congratulations! You've completed "${c.name}"!`, {
          description: `You've earned the ${c.milestones?.slice(-1)[0]?.reward || 'Final Badge'}!`,
          icon: <Medal className="h-5 w-5 text-yellow-500" />
        });
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
    toast.success("Challenge removed"); 
  };

  const resetChallenge = (id: string) => {
    const updated = challenges.map(c => {
      if (c.id !== id) return c;
      return { ...c, progress: 0, completed: false, streak: 0, dailyLogs: [] };
    });
    save(updated);
    toast.info("Challenge progress reset");
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array(difficulty).fill(0).map((_, i) => (
      <Flame key={i} className="h-3 w-3 text-orange-500 inline" />
    ));
  };

  const filteredChallenges = challenges.filter(c => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (!showCompleted && c.completed) return false;
    return true;
  });

  const activeChallenges = filteredChallenges.filter(c => !c.completed);
  const completedChallenges = filteredChallenges.filter(c => c.completed);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Nutrition Challenges
        </CardTitle>
        
        {/* Filters */}
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
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCompleted(!showCompleted)}
            className="ml-auto"
          >
            {showCompleted ? 'Hide' : 'Show'} Completed
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Active Challenges ({activeChallenges.length})
            </h4>
            {activeChallenges.map(c => (
              <div key={c.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-${c.color}-100 dark:bg-${c.color}-950`}>
                      {c.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {c.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Difficulty: {getDifficultyStars(c.difficulty)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateProgress(c.id)}
                      className="bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Log Daily
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => deleteChallenge(c.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 mt-3">
                  <Progress value ={(c.progress / c.target) * 100} className="h-2" />
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

                {/* Milestones */}
                {c.milestones && (
                  <div className="mt-3 flex gap-2">
                    {c.milestones.map((milestone, i) => (
                      <Badge 
                        key={i}
                        variant={c.progress >= milestone.progress ? "default" : "outline"}
                        className={`text-xs ${c.progress >= milestone.progress ? 'bg-green-600' : ''}`}
                      >
                        {milestone.reward}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Completed Challenges */}
        {showCompleted && completedChallenges.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Medal className="h-4 w-4 text-yellow-500" />
              Completed Challenges ({completedChallenges.length})
            </h4>
            {completedChallenges.map(c => (
              <div key={c.id} className="p-3 border rounded-lg bg-green-50 dark:bg-green-950">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => resetChallenge(c.id)}
                    >
                      Restart
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => deleteChallenge(c.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Completed in {c.dailyLogs.length} days with a {c.streak}-day streak!
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Available Challenges */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            Available Challenges
          </h4>
          
          {Object.entries(challengesByCategory).map(([category, categoryChallenges]) => (
            (selectedCategory === 'all' || selectedCategory === category) && (
              <div key={category} className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {category}
                </h5>
                {categoryChallenges.map((p, i) => {
                  const isJoined = challenges.some(c => c.name === p.name && !c.completed);
                  return (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-${p.color}-100 dark:bg-${p.color}-950`}>
                          {p.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{p.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {p.duration} days
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{p.description}</p>
                          <div className="flex gap-2 mt-1">
                            {p.milestones.map((m, idx) => (
                              <span key={idx} className="text-xs text-muted-foreground">
                                🏆 {m.reward}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => joinChallenge(p)}
                        disabled={isJoined}
                      >
                        {isJoined ? 'Joined' : 'Join'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionChallenge;