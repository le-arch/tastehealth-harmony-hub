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
import { Trophy, Target, Trash2 } from "lucide-react";
import { getLS, setLS, LS_KEYS, Challenge } from "@/utils/localStorage";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Confetti from "@/components/Confetti";

const ChallengesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [challenges, setChallenges] = useState<Challenge[]>(getLS(LS_KEYS.CHALLENGES, []));
  const [showConfetti, setShowConfetti] = useState(false);

  const refresh = useCallback(() => setChallenges(getLS(LS_KEYS.CHALLENGES, [])), []);
  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  const advanceProgress = (id: string) => {
    const updated = challenges.map(c => {
      if (c.id !== id || c.completed) return c;
      const newProgress = Math.min(c.progress + 1, c.target);
      const completed = newProgress >= c.target;
      if (completed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3500);
        toast.success(`🏆 Challenge "${c.name}" completed!`);
        const pts = getLS<number>(LS_KEYS.POINTS, 0);
        setLS(LS_KEYS.POINTS, pts + 50);
      }
      return { ...c, progress: newProgress, completed };
    });
    setChallenges(updated);
    setLS(LS_KEYS.CHALLENGES, updated);
  };

  const deleteChallenge = (id: string) => {
    const updated = challenges.filter(c => c.id !== id);
    setChallenges(updated);
    setLS(LS_KEYS.CHALLENGES, updated);
    toast.success("Challenge deleted");
  };

  return (
    <ProgressGuard requiredStage="challenges" currentPageName="Challenges">
      <PageLayout activePage="challenges">
        <Confetti active={showConfetti} />
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                <Trophy className="h-7 w-7 text-amber-500" />
              </motion.span>
              Nutrition Challenges
            </h1>
            <p className="text-muted-foreground mb-6 text-sm">Complete challenges to earn points and improve your nutrition habits.</p>
          </motion.div>
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); if (v === 'active') refresh(); }} className="w-full">
            <ScrollableTabsList className="mb-6">
              <TabsTrigger value="active">Active ({activeChallenges.length})</TabsTrigger>
              <TabsTrigger value="create">Create Challenge</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedChallenges.length})</TabsTrigger>
            </ScrollableTabsList>
            <TabsContent value="active">
              {activeChallenges.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Target className="h-16 w-16 mx-auto text-primary/40" />
                  </motion.div>
                  <p className="text-muted-foreground mt-4">No active challenges. Create or explore one!</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeChallenges.map((c, idx) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                      <Card className="hover:shadow-lg transition-all hover:border-primary/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" />{c.name}</span>
                            <Badge variant={c.difficulty <= 2 ? "secondary" : c.difficulty <= 4 ? "default" : "destructive"}>{c.difficulty <= 2 ? 'Easy' : c.difficulty <= 4 ? 'Medium' : 'Hard'}</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className="font-medium">{c.progress}/{c.target}</span></div>
                          <Progress value={Math.min((c.progress / c.target) * 100, 100)} className="h-2" />
                          <div className="flex flex-wrap gap-2">{c.types.map(t => <Badge key={t} variant="outline" className="text-xs capitalize">{t}</Badge>)}</div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" onClick={() => advanceProgress(c.id)} className="flex-1">+1 Progress</Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteChallenge(c.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
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
                  {completedChallenges.map((c, idx) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
                        <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Trophy className="h-5 w-5 text-green-500" />{c.name}<Badge variant="secondary">Completed ✓</Badge></CardTitle></CardHeader>
                        <CardContent><Progress value={100} className="h-2" /></CardContent>
                      </Card>
                    </motion.div>
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
