
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Lock, Gift, Sparkles, Award, Filter } from "lucide-react";

interface ChallengeType {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: string;
  category: string;
  icon: string;
  active: boolean;
}

interface UserChallengeType {
  id: string;
  user_id: string;
  challenge_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  challenge?: ChallengeType;
}

interface ChallengeListProps {
  userId: string;
}

const ChallengesList: React.FC<ChallengeListProps> = ({ userId }) => {
  const [availableChallenges, setAvailableChallenges] = useState<ChallengeType[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallengeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        
        // Fetch available challenges from nutrition_quests
        const { data: challengesData, error: challengesError } = await supabase
          .from("nutrition_quests")
          .select("*, id, title:title, description, points, difficulty, category, icon, active")
          .eq("active", true);

        if (challengesError) {
          throw challengesError;
        }
        
        const formattedChallenges = challengesData.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          points: challenge.points,
          difficulty: challenge.difficulty,
          category: challenge.category,
          icon: challenge.icon || "award",
          active: challenge.active
        }));
        
        setAvailableChallenges(formattedChallenges);
        
        // Fetch user's accepted challenges
        const { data: userChallengesData, error: userChallengesError } = await supabase
          .from("user_nutrition_quests")
          .select("*, quest:quest_id(*)")
          .eq("user_id", userId);
          
        if (userChallengesError) {
          throw userChallengesError;
        }
        
        const formattedUserChallenges = userChallengesData.map(userChallenge => ({
          id: userChallenge.id,
          user_id: userChallenge.user_id,
          challenge_id: userChallenge.quest_id,
          status: userChallenge.completed ? "completed" : "in_progress",
          started_at: userChallenge.started_at,
          completed_at: userChallenge.completed_at,
          challenge: {
            id: userChallenge.quest?.id,
            title: userChallenge.quest?.title,
            description: userChallenge.quest?.description,
            points: userChallenge.quest?.points,
            difficulty: userChallenge.quest?.difficulty,
            category: userChallenge.quest?.category,
            icon: userChallenge.quest?.icon || "award",
            active: userChallenge.quest?.active
          }
        }));
        
        setUserChallenges(formattedUserChallenges);
      } catch (error) {
        console.error("Error fetching challenges:", error);
        toast.error("Failed to load challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [userId]);

  const acceptChallenge = async (challengeId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_nutrition_quests")
        .insert({
          user_id: userId,
          quest_id: challengeId,
          completed: false
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Challenge accepted!");
      
      // Refetch user challenges
      const { data: userChallengesData, error: userChallengesError } = await supabase
        .from("user_nutrition_quests")
        .select("*, quest:quest_id(*)")
        .eq("user_id", userId);
        
      if (userChallengesError) throw userChallengesError;
      
      const formattedUserChallenges = userChallengesData.map(userChallenge => ({
        id: userChallenge.id,
        user_id: userChallenge.user_id,
        challenge_id: userChallenge.quest_id,
        status: userChallenge.completed ? "completed" : "in_progress",
        started_at: userChallenge.started_at,
        completed_at: userChallenge.completed_at,
        challenge: {
          id: userChallenge.quest?.id,
          title: userChallenge.quest?.title,
          description: userChallenge.quest?.description,
          points: userChallenge.quest?.points,
          difficulty: userChallenge.quest?.difficulty,
          category: userChallenge.quest?.category,
          icon: userChallenge.quest?.icon || "award",
          active: userChallenge.quest?.active
        }
      }));
      
      setUserChallenges(formattedUserChallenges);
    } catch (error) {
      console.error("Error accepting challenge:", error);
      toast.error("Failed to accept challenge");
    }
  };

  const isAlreadyAccepted = (challengeId: string) => {
    return userChallenges.some(
      (uc) => uc.challenge_id === challengeId && uc.status !== "failed"
    );
  };

  const getDifficultyHeaderClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const filteredChallenges = availableChallenges.filter((challenge) => {
    if (filter === "all") return true;
    return challenge.difficulty === filter || challenge.category === filter;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={() => setFilter("all")}
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
        >
          All Challenges
        </Button>
        <Button
          onClick={() => setFilter("easy")}
          variant={filter === "easy" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
        >
          Easy
        </Button>
        <Button
          onClick={() => setFilter("medium")}
          variant={filter === "medium" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
        >
          Medium
        </Button>
        <Button
          onClick={() => setFilter("hard")}
          variant={filter === "hard" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
        >
          Hard
        </Button>
        <Button
          onClick={() => setFilter("daily")}
          variant={filter === "daily" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
        >
          Daily
        </Button>
        <Button
          onClick={() => setFilter("nutrition")}
          variant={filter === "nutrition" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
        >
          Nutrition
        </Button>
      </div>

      {filteredChallenges.length === 0 ? (
        <div className="text-center py-8">
          <Filter className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            No challenges found with the selected filter.
          </p>
          <Button onClick={() => setFilter("all")}>
            Show All Challenges
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
              <CardHeader className={`p-4 ${getDifficultyHeaderClass(challenge.difficulty)}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-white">
                    {challenge.title}
                  </CardTitle>
                  <span className="text-2xl text-white">
                    <Award className="h-6 w-6" />
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {challenge.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    {challenge.points} points
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 capitalize">
                    {challenge.category}
                  </Badge>
                </div>

                <Button
                  onClick={() => acceptChallenge(challenge.id)}
                  disabled={isAlreadyAccepted(challenge.id)}
                  className="w-full"
                  variant={isAlreadyAccepted(challenge.id) ? "outline" : "default"}
                >
                  {isAlreadyAccepted(challenge.id) ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Challenge Accepted
                    </>
                  ) : (
                    <>
                      <Gift className="mr-2 h-4 w-4" />
                      Accept Challenge
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Active User Challenges */}
      {userChallenges.filter(uc => uc.status === "in_progress").length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Your Active Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userChallenges
              .filter(uc => uc.status === "in_progress")
              .map(userChallenge => (
                <Card key={userChallenge.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      {userChallenge.challenge?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      {userChallenge.challenge?.description}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Started: {new Date(userChallenge.started_at).toLocaleDateString()}</span>
                      <Badge>{userChallenge.challenge?.points} points</Badge>
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

export default ChallengesList;