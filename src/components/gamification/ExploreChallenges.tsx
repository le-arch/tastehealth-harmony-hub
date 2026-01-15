
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Trophy, Users, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createNutritionChallenge, getUserChallenges, type NutritionChallenge } from "@/services/challengeService";
import { supabase } from "@/integrations/supabase/client";

interface ExploreChallenge {
  id: string;
  name: string;
  description: string;
  types: string[];
  duration_days: number;
  difficulty_level: number;
  participants: number;
  points_reward: number;
  icon: string;
}

const FEATURED_CHALLENGES: ExploreChallenge[] = [
  {
    id: "hydration-hero",
    name: "Hydration Hero",
    description: "Drink 8 glasses of water daily for 7 days straight",
    types: ["water"],
    duration_days: 7,
    difficulty_level: 2,
    participants: 156,
    points_reward: 100,
    icon: "💧"
  },
  {
    id: "veggie-champion",
    name: "Veggie Champion",
    description: "Eat 5 servings of vegetables every day for 2 weeks",
    types: ["vegetables"],
    duration_days: 14,
    difficulty_level: 4,
    participants: 89,
    points_reward: 200,
    icon: "🥦"
  },
  {
    id: "protein-power",
    name: "Protein Power",
    description: "Meet your daily protein goals for 10 days",
    types: ["protein"],
    duration_days: 10,
    difficulty_level: 3,
    participants: 124,
    points_reward: 150,
    icon: "🥩"
  },
  {
    id: "sugar-detox",
    name: "Sugar Detox",
    description: "Eliminate added sugars for 21 days",
    types: ["sugar"],
    duration_days: 21,
    difficulty_level: 8,
    participants: 67,
    points_reward: 400,
    icon: "🚫"
  },
  {
    id: "meal-prep-master",
    name: "Meal Prep Master",
    description: "Prepare healthy meals in advance for 2 weeks",
    types: ["meal_prep"],
    duration_days: 14,
    difficulty_level: 5,
    participants: 98,
    points_reward: 250,
    icon: "🍱"
  },
  {
    id: "mindful-eating",
    name: "Mindful Eating",
    description: "Practice mindful eating techniques for 30 days",
    types: ["snacking"],
    duration_days: 30,
    difficulty_level: 6,
    participants: 45,
    points_reward: 500,
    icon: "🧘"
  }
];

interface ExploreChallengesProps {
  userId: string;
}

const ExploreChallenges = ({ userId }: ExploreChallengesProps) => {
  const [userChallenges, setUserChallenges] = useState<NutritionChallenge[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadUserChallenges = async () => {
      try {
        const result = await getUserChallenges(userId);
        setUserChallenges(result.challenges || []);
        
        // Track which challenge types user has already joined
        const joinedTypes = new Set();
        result.challenges?.forEach(challenge => {
          challenge.types.forEach(type => joinedTypes.add(type));
        });
        
        // Mark featured challenges as joined if user has similar challenge
        const joined = new Set<string>();
        FEATURED_CHALLENGES.forEach(featuredChallenge => {
          const hasJoinedSimilar = featuredChallenge.types.some(type => joinedTypes.has(type));
          if (hasJoinedSimilar) {
            joined.add(featuredChallenge.id);
          }
        });
        setJoinedChallenges(joined);
      } catch (error) {
        console.error("Error loading user challenges:", error);
      }
    };

    if (userId) {
      loadUserChallenges();
    }
  }, [userId]);

  const getDifficultyColor = (level: number) => {
    if (level <= 3) return "bg-green-100 text-green-800";
    if (level <= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getDifficultyText = (level: number) => {
    if (level <= 3) return "Easy";
    if (level <= 6) return "Medium";
    return "Hard";
  };

  const handleJoinChallenge = async (challenge: ExploreChallenge) => {
    if (joinedChallenges.has(challenge.id)) return;

    setIsLoading(prev => ({ ...prev, [challenge.id]: true }));

    try {
      await createNutritionChallenge({
        user_id: userId,
        name: challenge.name,
        types: challenge.types,
        duration_days: challenge.duration_days,
        difficulty_level: challenge.difficulty_level,
      });

      setJoinedChallenges(prev => new Set([...prev, challenge.id]));
      toast.success(`Successfully joined ${challenge.name}!`);
      
      // Reload user challenges
      const result = await getUserChallenges(userId);
      setUserChallenges(result.challenges || []);
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast.error("Failed to join challenge. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [challenge.id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Explore Challenges</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Join popular challenges and compete with other users to improve your nutrition habits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_CHALLENGES.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{challenge.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{challenge.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getDifficultyColor(challenge.difficulty_level)}>
                          {getDifficultyText(challenge.difficulty_level)}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Trophy className="h-3 w-3" />
                          <span>{challenge.points_reward} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {challenge.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{challenge.duration_days} days</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{challenge.participants} participants</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>{challenge.types.join(", ")}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleJoinChallenge(challenge)}
                  disabled={joinedChallenges.has(challenge.id) || isLoading[challenge.id]}
                  variant={joinedChallenges.has(challenge.id) ? "outline" : "default"}
                  className="w-full"
                >
                  {isLoading[challenge.id] ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : joinedChallenges.has(challenge.id) ? (
                    "Already Joined"
                  ) : (
                    "Join Challenge"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {userChallenges.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Your Active Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userChallenges.slice(0, 3).map((challenge) => (
              <Card key={challenge.id} className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{challenge.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(challenge.difficulty_level)}>
                      {getDifficultyText(challenge.difficulty_level)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{challenge.duration_days} days</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreChallenges;
