import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { getLS, setLS, LS_KEYS, Challenge } from "@/utils/localStorage";
import { playMilestoneSound } from "@/utils/sounds";

const FEATURED_CHALLENGES = [
  { id: "hydration-hero", name: "Hydration Hero", description: "Drink 8 glasses of water daily for 7 days", types: ["water"], duration_days: 7, difficulty_level: 2, points_reward: 100, icon: "💧" },
  { id: "veggie-champion", name: "Veggie Champion", description: "Eat 5 servings of vegetables every day for 2 weeks", types: ["vegetables"], duration_days: 14, difficulty_level: 4, points_reward: 200, icon: "🥦" },
  { id: "protein-power", name: "Protein Power", description: "Meet your daily protein goals for 10 days", types: ["protein"], duration_days: 10, difficulty_level: 3, points_reward: 150, icon: "🥩" },
  { id: "sugar-detox", name: "Sugar Detox", description: "Avoid added sugars for 5 days straight", types: ["nutrition"], duration_days: 5, difficulty_level: 4, points_reward: 120, icon: "🚫🍬" },
  { id: "morning-fuel", name: "Morning Fuel", description: "Eat a healthy breakfast every day for 7 days", types: ["nutrition"], duration_days: 7, difficulty_level: 2, points_reward: 80, icon: "🌅" },
  { id: "sleep-master", name: "Sleep Master", description: "Get 8 hours of sleep for 7 consecutive nights", types: ["sleep"], duration_days: 7, difficulty_level: 3, points_reward: 120, icon: "😴" },
  { id: "step-counter", name: "Step Counter", description: "Walk 10,000 steps daily for 10 days", types: ["exercise"], duration_days: 10, difficulty_level: 3, points_reward: 150, icon: "🚶" },
  { id: "meal-prep-pro", name: "Meal Prep Pro", description: "Prepare home-cooked meals for 5 days", types: ["nutrition"], duration_days: 5, difficulty_level: 3, points_reward: 130, icon: "👨‍🍳" },
  { id: "fiber-focus", name: "Fiber Focus", description: "Eat 30g+ fiber daily for a week", types: ["nutrition"], duration_days: 7, difficulty_level: 4, points_reward: 140, icon: "🌾" },
  { id: "mindful-eating", name: "Mindful Eating", description: "Practice mindful eating for every meal for 5 days", types: ["nutrition"], duration_days: 5, difficulty_level: 2, points_reward: 90, icon: "🧘" },
  { id: "no-processed", name: "No Processed Food", description: "Eat only whole foods for 7 days", types: ["nutrition"], duration_days: 7, difficulty_level: 5, points_reward: 200, icon: "🥬" },
  { id: "fruit-rainbow", name: "Fruit Rainbow", description: "Eat fruits of 5 different colors in a week", types: ["nutrition"], duration_days: 7, difficulty_level: 2, points_reward: 80, icon: "🌈" },
];

interface ExploreChallengesProps { userId?: string; }

const ExploreChallenges = ({ userId }: ExploreChallengesProps) => {
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const handleJoin = (challenge: typeof FEATURED_CHALLENGES[0]) => {
    const newChallenge: Challenge = {
      id: crypto.randomUUID(),
      name: challenge.name,
      types: challenge.types,
      duration: challenge.duration_days,
      difficulty: challenge.difficulty_level,
      startDate: new Date().toISOString(),
      progress: 0,
      target: challenge.duration_days,
      completed: false,
    };
    const existing = getLS<Challenge[]>(LS_KEYS.CHALLENGES, []);
    setLS(LS_KEYS.CHALLENGES, [newChallenge, ...existing]);
    setJoined(prev => new Set([...prev, challenge.id]));
    playMilestoneSound('success');
    toast.success(`Joined "${challenge.name}" — check Active Challenges!`);
  };

  const getDifficultyColor = (level: number) => level <= 2 ? "bg-green-100 text-green-800" : level <= 3 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Explore Challenges</h2>
        <p className="text-muted-foreground">Join popular challenges to improve your nutrition habits</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_CHALLENGES.map((challenge, index) => (
          <motion.div key={challenge.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            <Card className="h-full flex flex-col hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{challenge.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{challenge.name}</CardTitle>
                    <Badge className={getDifficultyColor(challenge.difficulty_level)}>
                      {challenge.difficulty_level <= 2 ? "Easy" : challenge.difficulty_level <= 3 ? "Medium" : "Hard"}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="mt-2">{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /><span>{challenge.duration_days} days</span></div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Trophy className="h-3 w-3" /><span>{challenge.points_reward} pts</span></div>
                </div>
                <Button onClick={() => handleJoin(challenge)} disabled={joined.has(challenge.id)} variant={joined.has(challenge.id) ? "outline" : "default"} className="w-full">
                  {joined.has(challenge.id) ? "Joined ✓" : "Join Challenge"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExploreChallenges;
