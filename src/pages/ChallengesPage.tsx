
import React, { useState } from "react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ChallengeCreator from "@/components/ChallengeCreator";
import ProgressGuard from "@/components/ProgressGuard";
import ExploreChallenges from "@/components/gamification/ExploreChallenges";
import { useScreenSize } from "@/utils/mobile";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target } from "lucide-react";
import { getLS, LS_KEYS, Challenge } from "@/utils/localStorage";

const ChallengesPage: React.FC = () => {
  const { isMobile } = useScreenSize();
  const [activeTab, setActiveTab] = useState("active");
  const challenges = getLS<Challenge[]>(LS_KEYS.CHALLENGES, []);
  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  return (
    <ProgressGuard requiredStage="challenges" currentPageName="Challenges">
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <ProfileSidebar activePage="Challenges" />
        <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? '' : 'md:ml-64'} overflow-auto`}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Nutrition Challenges</h1>
          <p className="text-muted-foreground mb-6">Complete challenges to earn points and improve your nutrition habits.</p>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ScrollableTabsList className="mb-6">
              <TabsTrigger value="active">Active ({activeChallenges.length})</TabsTrigger>
              <TabsTrigger value="create">Create Challenge</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedChallenges.length})</TabsTrigger>
            </ScrollableTabsList>

            <TabsContent value="active">
              {activeChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active challenges. Create one or explore available challenges!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeChallenges.map(challenge => {
                    const progressPct = Math.min((challenge.progress / challenge.target) * 100, 100);
                    return (
                      <Card key={challenge.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" />{challenge.name}</span>
                            <Badge variant={challenge.difficulty <= 2 ? "secondary" : challenge.difficulty <= 4 ? "default" : "destructive"}>
                              {challenge.difficulty <= 2 ? 'Easy' : challenge.difficulty <= 4 ? 'Medium' : 'Hard'}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{challenge.progress}/{challenge.target}</span>
                            </div>
                            <Progress value={progressPct} className="h-2" />
                            <div className="flex flex-wrap gap-2">
                              {challenge.types.map(t => <Badge key={t} variant="outline" className="text-xs capitalize">{t}</Badge>)}
                              <Badge variant="outline" className="text-xs">{challenge.duration} days</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Started: {new Date(challenge.startDate).toLocaleDateString()}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create"><ChallengeCreator /></TabsContent>
            <TabsContent value="explore"><ExploreChallenges userId="local" /></TabsContent>

            <TabsContent value="completed">
              {completedChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No completed challenges yet. Keep going!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedChallenges.map(c => (
                    <Card key={c.id} className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-green-500" />{c.name}
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Progress value={100} className="h-2 mb-2" />
                        <p className="text-sm text-muted-foreground">{c.target}/{c.target} — Well done!</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProgressGuard>
  );
};

export default ChallengesPage;
