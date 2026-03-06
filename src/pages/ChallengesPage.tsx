import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import ChallengeCreator from "@/components/ChallengeCreator";
import ProgressGuard from "@/components/ProgressGuard";
import ExploreChallenges from "@/components/gamification/ExploreChallenges";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target } from "lucide-react";
import { getLS, LS_KEYS, Challenge } from "@/utils/localStorage";

const ChallengesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  const challenges = getLS<Challenge[]>(LS_KEYS.CHALLENGES, []);
  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  return (
    <ProgressGuard requiredStage="challenges" currentPageName="Challenges">
      <PageLayout activePage="challenges">
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Nutrition Challenges</h1>
          <p className="text-muted-foreground mb-6 text-sm">Complete challenges to earn points and improve your nutrition habits.</p>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ScrollableTabsList className="mb-6">
              <TabsTrigger value="active">Active ({activeChallenges.length})</TabsTrigger>
              <TabsTrigger value="create">Create Challenge</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedChallenges.length})</TabsTrigger>
            </ScrollableTabsList>
            <TabsContent value="active">
              {activeChallenges.length === 0 ? (
                <div className="text-center py-12"><Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No active challenges.</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeChallenges.map(c => (
                    <Card key={c.id}>
                      <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center justify-between"><span className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" />{c.name}</span><Badge variant={c.difficulty <= 2 ? "secondary" : c.difficulty <= 4 ? "default" : "destructive"}>{c.difficulty <= 2 ? 'Easy' : c.difficulty <= 4 ? 'Medium' : 'Hard'}</Badge></CardTitle></CardHeader>
                      <CardContent><div className="space-y-3"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className="font-medium">{c.progress}/{c.target}</span></div><Progress value={Math.min((c.progress / c.target) * 100, 100)} className="h-2" /><div className="flex flex-wrap gap-2">{c.types.map(t => <Badge key={t} variant="outline" className="text-xs capitalize">{t}</Badge>)}</div></div></CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="create"><ChallengeCreator /></TabsContent>
            <TabsContent value="explore"><ExploreChallenges userId="local" /></TabsContent>
            <TabsContent value="completed">
              {completedChallenges.length === 0 ? (
                <div className="text-center py-12"><Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No completed challenges yet.</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedChallenges.map(c => (
                    <Card key={c.id} className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
                      <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Trophy className="h-5 w-5 text-green-500" />{c.name}<Badge variant="secondary">Completed</Badge></CardTitle></CardHeader>
                      <CardContent><Progress value={100} className="h-2" /></CardContent>
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
