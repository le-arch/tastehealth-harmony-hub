
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Users, Target } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

const FEATURED_CHALLENGES = [
  { id: "hydration-hero", name: "Hydration Hero", description: "Drink 8 glasses of water daily for 7 days", types: ["water"], duration_days: 7, difficulty_level: 2, participants: 156, points_reward: 100, icon: "💧" },
  { id: "veggie-champion", name: "Veggie Champion", description: "Eat 5 servings of vegetables every day for 2 weeks", types: ["vegetables"], duration_days: 14, difficulty_level: 4, participants: 89, points_reward: 200, icon: "🥦" },
  { id: "protein-power", name: "Protein Power", description: "Meet your daily protein goals for 10 days", types: ["protein"], duration_days: 10, difficulty_level: 3, participants: 124, points_reward: 150, icon: "🥩" },
];

interface ExploreChallengesProps { userId: string; }

const ExploreChallenges = ({ userId }: ExploreChallengesProps) => {
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const handleJoin = (id: string, name: string) => {
    setJoined(prev => new Set([...prev, id]));
    toast.success(`Joined ${name} (local only)!`);
  };

  const getDifficultyColor = (level: number) => level <= 3 ? "bg-green-100 text-green-800" : level <= 6 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Explore Challenges</h2>
        <p className="text-muted-foreground">Join popular challenges to improve your nutrition habits</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_CHALLENGES.map((challenge, index) => (
          <motion.div key={challenge.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{challenge.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{challenge.name}</CardTitle>
                    <Badge className={getDifficultyColor(challenge.difficulty_level)}>{challenge.difficulty_level <= 3 ? "Easy" : "Medium"}</Badge>
                  </div>
                </div>
                <CardDescription className="mt-2">{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /><span>{challenge.duration_days} days</span></div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Trophy className="h-3 w-3" /><span>{challenge.points_reward} pts</span></div>
                </div>
                <Button onClick={() => handleJoin(challenge.id, challenge.name)} disabled={joined.has(challenge.id)} variant={joined.has(challenge.id) ? "outline" : "default"} className="w-full">
                  {joined.has(challenge.id) ? "Already Joined" : "Join Challenge"}
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
