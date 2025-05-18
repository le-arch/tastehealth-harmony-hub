
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/SupabaseClient";
import questService, { type UserQuest } from "@/services/questService";
import { Award, CheckCircle, Clock, Star } from "lucide-react";
import { toast } from "sonner";
import gamificationService from "@/services/gamificationService";

export default function DailyQuestsList() {
  const [userQuests, setUserQuests] = useState<UserQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndQuests = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        if (data?.user?.id) {
          setUserId(data.user.id);
          const activeQuests = await questService.getUserActiveQuests(
            data.user.id
          );

          // If no active quests, generate daily quests
          if (activeQuests.length === 0) {
            await questService.generateDailyQuestsForUser(data.user.id);
            const newQuests = await questService.getUserActiveQuests(
              data.user.id
            );
            setUserQuests(newQuests);
          } else {
            setUserQuests(activeQuests);
          }
        }
      } catch (error) {
        console.error("Error fetching quests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndQuests();
  }, []);

  const handleAcceptQuest = async (questId: string) => {
    if (!userId) return;

    try {
      const userQuest = await questService.acceptQuest(userId, questId);
      if (userQuest) {
        // Refresh quests list
        const activeQuests = await questService.getUserActiveQuests(userId);
        setUserQuests(activeQuests);
        
        toast.success("Quest started!");
      }
    } catch (error) {
      console.error("Error accepting quest:", error);
    }
  };

  const handleCompleteQuestStep = async (userQuest: UserQuest, stepIndex: number) => {
    if (!userId || !userQuest.quest) return;

    try {
      const result = await questService.completeQuestStep(userId, userQuest.quest_id, stepIndex);
      
      if (result.success) {
        // Refresh quests list
        const activeQuests = await questService.getUserActiveQuests(userId);
        setUserQuests(activeQuests);
        
        if (result.completed && userQuest.quest.rewards?.points) {
          // Award points when quest is completed
          await gamificationService.awardPoints(
            userId,
            userQuest.quest.rewards.points,
            "Quest completed",
            userQuest.quest_id,
            "quest"
          );
          
          toast.success(`Quest completed! Earned ${userQuest.quest.rewards.points} points.`);
          
          // Play completion sound
          const audio = new Audio("/sounds/quest-complete.mp3");
          audio.play().catch(e => console.log("Audio play failed:", e));
        } else {
          toast.success("Quest step completed!");
          
          // Play step completion sound
          const audio = new Audio("/sounds/step-complete.mp3");
          audio.play().catch(e => console.log("Audio play failed:", e));
        }
      }
    } catch (error) {
      console.error("Error completing quest step:", error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getProgressPercentage = (quest: UserQuest) => {
    if (!quest.progress) return 0;
    return (
      quest.progress.percentage ||
      (quest.progress.current / quest.progress.target) * 100 ||
      0
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <p>Loading quests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userQuests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 py-8">
            <Award size={48} className="text-gray-400" />
            <p className="text-center text-gray-500">
              No active quests available.
            </p>
            <Button
              onClick={() =>
                userId && questService.generateDailyQuestsForUser(userId)
              }
            >
              Generate Daily Quests
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Daily Quests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {userQuests.map((userQuest) => (
            <div key={userQuest.id} className="rounded-lg border p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{userQuest.quest?.title}</h3>
                  <p className="text-sm text-gray-500">
                    {userQuest.quest?.description}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{userQuest.quest?.rewards?.points}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span
                    className={getDifficultyColor(
                      userQuest.quest?.difficulty || "easy"
                    )}
                  >
                    {userQuest.quest?.difficulty}
                  </span>
                  <span>
                    {userQuest.progress?.current || 0} /{" "}
                    {userQuest.progress?.target || 0}
                  </span>
                </div>
                <Progress
                  value={getProgressPercentage(userQuest)}
                  className="h-2"
                />
              </div>

              {/* Quest steps */}
              {userQuest.quest?.steps && (
                <div className="mt-4 space-y-2">
                  {userQuest.quest.steps.map((step, index) => (
                    <div 
                      key={step.id} 
                      className={`p-2 rounded-md ${step.completed ? 'bg-green-50 dark:bg-green-900/20' : 
                        index === userQuest.current_step ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                        ) : (
                          <div className="h-4 w-4 border rounded-full mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{step.title}</p>
                          {index === userQuest.current_step && !step.completed && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => handleCompleteQuestStep(userQuest, index)}
                            >
                              Complete Step
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Started {new Date(userQuest.started_at).toLocaleDateString()}
                </div>
                {getProgressPercentage(userQuest) >= 100 ? (
                  <div className="flex items-center text-green-500 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
