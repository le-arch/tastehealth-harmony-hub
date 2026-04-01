"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, Challenge, MoodEntry } from "@/utils/localStorage";
import { MEAL_DATABASE } from "@/data/mealDatabase";
import {
  Trophy, Smile, ChefHat, Leaf, Plus, Check, Clock, Star, Search,
  Mountain, Flame, Target, Zap, Award
} from "lucide-react";

const NutritionGamificationPage = () => {
  const [activeTab, setActiveTab] = useState("challenges");
  const [challenges, setChallenges] = useState<Challenge[]>(getLS(LS_KEYS.CHALLENGES, []));
  const [moodLog, setMoodLog] = useState<MoodEntry[]>(getLS(LS_KEYS.MOOD_LOG, []));
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [moodNotes, setMoodNotes] = useState("");
  const [moodMealName, setMoodMealName] = useState("");

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  const moods = [
    { emoji: "😋", label: "Delicious", value: "delicious" },
    { emoji: "😊", label: "Satisfied", value: "satisfied" },
    { emoji: "😐", label: "Neutral", value: "neutral" },
    { emoji: "😞", label: "Disappointed", value: "disappointed" },
    { emoji: "😖", label: "Uncomfortable", value: "uncomfortable" },
  ];

  const advanceChallenge = (id: string) => {
    const today = new Date().toDateString();
    const updated = challenges.map(c => {
      if (c.id !== id) return c;
      const lastAdv = localStorage.getItem(`th_challenge_adv_${id}`);
      if (lastAdv === today) {
        toast.error("Already advanced today! Come back tomorrow.");
        return c;
      }
      localStorage.setItem(`th_challenge_adv_${id}`, today);
      const newProgress = Math.min(c.progress + 1, c.target);
      const completed = newProgress >= c.target;
      if (completed) {
        toast.success(`🎉 Challenge "${c.name}" completed!`);
        // Award points
        const pts = getLS<number>(LS_KEYS.POINTS, 0);
        setLS(LS_KEYS.POINTS, pts + 50);
        const history = getLS<any[]>(LS_KEYS.POINTS_HISTORY, []);
        history.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), points: 50, reason: `Completed challenge: ${c.name}` });
        setLS(LS_KEYS.POINTS_HISTORY, history);
      }
      return { ...c, progress: newProgress, completed };
    });
    setChallenges(updated);
    setLS(LS_KEYS.CHALLENGES, updated);
  };

  const saveMood = () => {
    if (!selectedMood) { toast.error("Please select a mood"); return; }
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood: selectedMood,
      notes: moodNotes,
      mealName: moodMealName,
    };
    const updated = [entry, ...moodLog];
    setMoodLog(updated);
    setLS(LS_KEYS.MOOD_LOG, updated);
    setSelectedMood("");
    setMoodNotes("");
    setMoodMealName("");
    toast.success("Mood saved!");
  };

  const getDifficultyColor = (diff: number) => {
    if (diff <= 2) return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
    if (diff <= 3) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
    return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
  };
  const getDifficultyLabel = (diff: number) => diff <= 2 ? "Easy" : diff <= 3 ? "Medium" : "Hard";

  return (
    <PageLayout activePage="nutrition-game">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Mountain className="h-7 w-7 text-primary" />
            Nutrition Challenges
          </h1>
          <p className="text-muted-foreground mt-1">Track challenges, mood, and meal prep progress</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" /> Challenges
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <Smile className="h-4 w-4" /> Mood
            </TabsTrigger>
            <TabsTrigger value="mealPrep" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" /> Meal Prep
            </TabsTrigger>
          </Tabs>

          <TabsContent value="challenges" className="space-y-6">
            {/* Active Challenges */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Active Challenges ({activeChallenges.length})
              </h2>
              {activeChallenges.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Mountain className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No active challenges. Create one from Explore Challenges in the Nutrition Game!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeChallenges.map(c => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="border-l-4 border-l-primary">
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-sm">{c.name}</h3>
                            <Badge className={getDifficultyColor(c.difficulty)}>{getDifficultyLabel(c.difficulty)}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{c.duration} days</span>
                            <span>•</span>
                            <span>{c.types.join(", ")}</span>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{c.progress}/{c.target}</span>
                            </div>
                            <Progress value={(c.progress / c.target) * 100} className="h-2" />
                          </div>
                          <Button size="sm" className="w-full" onClick={() => advanceChallenge(c.id)}>
                            <Zap className="h-4 w-4 mr-1" />
                            Mark Today Complete
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Challenges */}
            {completedChallenges.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-500" />
                  Completed ({completedChallenges.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {completedChallenges.map(c => (
                    <Card key={c.id} className="border-l-4 border-l-green-500 opacity-80">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-sm">{c.name}</span>
                          <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Done</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mood" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How did you feel after your last meal?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select a meal</label>
                  <select
                    value={moodMealName}
                    onChange={e => setMoodMealName(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background text-foreground"
                  >
                    <option value="">Select a meal</option>
                    {MEAL_DATABASE.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3">Select your mood</h3>
                  <div className="flex flex-wrap gap-3">
                    {moods.map(mood => (
                      <button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`flex flex-col items-center p-3 border rounded-lg transition-all ${
                          selectedMood === mood.value 
                            ? 'border-primary bg-primary/10 ring-2 ring-primary' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-2xl mb-1">{mood.emoji}</span>
                        <span className="text-xs">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                  <textarea
                    value={moodNotes}
                    onChange={e => setMoodNotes(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background text-foreground h-20"
                    placeholder="How did the meal make you feel?"
                  />
                </div>
                <Button onClick={saveMood} className="w-full">Save Mood</Button>
              </CardContent>
            </Card>

            {/* Mood History */}
            <Card>
              <CardHeader><CardTitle>Recent Mood History</CardTitle></CardHeader>
              <CardContent>
                {moodLog.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">No mood entries yet.</p>
                ) : (
                  <div className="space-y-2">
                    {moodLog.slice(0, 10).map(entry => {
                      const emoji = moods.find(m => m.value === entry.mood)?.emoji || "😐";
                      return (
                        <div key={entry.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <span className="text-xl">{emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{entry.mealName || "General"}</p>
                            {entry.notes && <p className="text-xs text-muted-foreground truncate">{entry.notes}</p>}
                          </div>
                          <span className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mealPrep">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><ChefHat className="h-5 w-5 text-orange-500" />Meal Prep Assistant</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">Use the Meal Prep Timer in the Nutrition Dashboard for guided prep sessions.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default NutritionGamificationPage;
