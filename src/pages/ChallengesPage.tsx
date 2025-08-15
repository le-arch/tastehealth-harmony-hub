
import React, { useEffect, useState } from "react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ChallengeCreator from "@/components/ChallengeCreator";
import ProgressGuard from "@/components/ProgressGuard";
import progressionService from "@/services/progressionService";
import ChallengesList from "@/components/gamification/ChallengeList";
import ExploreChallenges from "@/components/gamification/ExploreChallenges";
import { useScreenSize } from "@/utils/mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { supabase } from "@/lib/SupabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Star, Crown, Timer } from "lucide-react";
import { getUserChallenges } from "@/services/challengeService";
import { type ChallengeProgress, type NutritionChallenge } from "@/services/challengeService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const ChallengesPage: React.FC = () => {
  const { isMobile, isTablet } = useScreenSize();
  const [activeTab, setActiveTab] = useState("active");
  const [userId, setUserId] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<NutritionChallenge[]>([]);
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserAndChallenges = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          setLoading(false);
          return;
        }
        
        setUserId(sessionData.session.user.id);
        
        // Fetch challenges and progress
        const result = await getUserChallenges(sessionData.session.user.id);
        setChallenges(result.challenges || []);
        setProgress(result.progress || []);
        
        // Check if user has challenges and advance progression
        if (result.challenges && result.challenges.length > 0) {
          await progressionService.advanceProgression(sessionData.session.user.id, 'challenge_joined');
        }
      } catch (error) {
        console.error("Error fetching challenges:", error);
        toast.error("Failed to load challenges");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndChallenges();
  }, []);

  // Filter challenges based on their completion status
  const activeChallenges = challenges.filter(challenge => {
    const challengeProgress = progress.find(p => p.challenge_id === challenge.id);
    return challengeProgress && challengeProgress.days_completed < challengeProgress.total_days;
  });
  
  const completedChallenges = challenges.filter(challenge => {
    const challengeProgress = progress.find(p => p.challenge_id === challenge.id);
    return challengeProgress && challengeProgress.days_completed >= challengeProgress.total_days;
  });
  
  // Helper function to get the challenge progress
  const getChallengeProgress = (challengeId: string) => {
    const challengeProgress = progress.find(p => p.challenge_id === challengeId);
    if (!challengeProgress) return 0;
    return Math.round((challengeProgress.days_completed / challengeProgress.total_days) * 100);
  };

  // Helper function to get difficulty class
  const getDifficultyClass = (level: number) => {
    if (level <= 2) return "bg-green-100 text-green-800";
    if (level <= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Helper function to get difficulty text
  const getDifficultyText = (level: number) => {
    if (level <= 2) return "Easy";
    if (level <= 4) return "Medium";
    return "Hard";
  };
  
  return (
    <ProgressGuard requiredStage="challenges" currentPageName="Challenges">
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="Challenges" />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? '' : 'md:ml-64'} overflow-auto`}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Nutrition Challenges</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
          Complete challenges to earn points and improve your nutrition habits.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollableTabsList className="mb-6">
            <TabsTrigger value="active">Active Challenges</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="create">Create Challenge</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </ScrollableTabsList>
          
          <TabsContent value="active">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : activeChallenges.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You don't have any active challenges.
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  Create Your First Challenge
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeChallenges.map((challenge) => (
                  <Card key={challenge.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{challenge.name}</CardTitle>
                        <Badge className={getDifficultyClass(challenge.difficulty_level)}>
                          {getDifficultyText(challenge.difficulty_level)}
                        </Badge>
                      </div>
                      <CardDescription>
                        {challenge.types.join(", ")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-muted-foreground">
                              {getChallengeProgress(challenge.id)}%
                            </span>
                          </div>
                          <Progress value={getChallengeProgress(challenge.id)} className="h-2" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{challenge.duration_days} days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : completedChallenges.length === 0 ? (
              <div className="text-center py-12">
                <Crown className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You haven't completed any challenges yet.
                </p>
                <Button onClick={() => setActiveTab("active")}>
                  View Active Challenges
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedChallenges.map((challenge) => (
                  <Card key={challenge.id} className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                          {challenge.name}
                        </CardTitle>
                        <Badge className={getDifficultyClass(challenge.difficulty_level)}>
                          {getDifficultyText(challenge.difficulty_level)}
                        </Badge>
                      </div>
                      <CardDescription>
                        {challenge.types.join(", ")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Completed</span>
                            <span className="text-sm text-muted-foreground">
                              100%
                            </span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Timer className="h-4 w-4" />
                          <span>Completed {challenge.duration_days}-day challenge</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create">
            <ChallengeCreator />
          </TabsContent>
          
          <TabsContent value="explore">
            {userId ? (
              <ExploreChallenges userId={userId} />
            ) : (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Please log in to explore challenges.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </ProgressGuard>
  );
};

export default ChallengesPage;
