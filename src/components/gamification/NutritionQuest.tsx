
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapIcon,
  Clock,
  Award,
  CheckCircle,
  Circle,
  ArrowLeft,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import questService from "@/services/questService";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tab, Tabs } from "@/components/ui/tabs";

interface NutritionQuestProps {
  userId?: string;
  addPoints: (points: number, reason: string) => Promise<void>;
}

interface QuestStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: string;
  category: string;
  requirements: any;
  icon?: string | null;
  is_daily: boolean;
  reset_frequency: string;
  active: boolean;
  steps?: QuestStep[];
  created_at?: string;
  updated_at?: string;
}

interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  started_at: string;
  completed_at: string | null;
  completed: boolean;
  current_step: number;
  progress?: {
    steps: QuestStep[];
  };
}

const translations = {
  en: {
    title: "Today's Quests",
    available: "Available",
    active: "Active",
    completed: "Completed",
    start: "Start Quest",
    continue: "Continue",
    claim: "Claim Rewards",
    difficulty: "Difficulty",
    duration: "Duration",
    days: "days",
    rewards: "Rewards",
    points: "points",
    steps: "Steps",
    progress: "Progress",
    questStarted: "Quest started!",
    questCompleted: "Quest completed!",
    rewardsEarned: "Rewards earned",
    timeLeft: "Time left",
    noActiveQuests: "No active quests. Start a new quest from the Available tab!",
    noAvailableQuests: "No available quests at the moment. Check back later!",
    noCompletedQuests: "You haven't completed any quests yet. Complete quests to earn rewards!",
    back: "Back to quests",
    completeStep: "Complete Step",
  },
  fr: {
    title: "Quêtes du Jour",
    available: "Disponibles",
    active: "Actives",
    completed: "Terminées",
    start: "Commencer la Quête",
    continue: "Continuer",
    claim: "Réclamer Récompenses",
    difficulty: "Difficulté",
    duration: "Durée",
    days: "jours",
    rewards: "Récompenses",
    points: "points",
    steps: "Steps",
    progress: "Progrès",
    questStarted: "Quête commencée !",
    questCompleted: "Quête terminée !",
    rewardsEarned: "Récompenses gagnées",
    timeLeft: "Temps restant",
    noActiveQuests: "Pas de quêtes actives. Commencez une nouvelle quête depuis l'onglet Disponibles !",
    noAvailableQuests: "Pas de quêtes disponibles pour le moment. Revenez plus tard !",
    noCompletedQuests: "Vous n'avez pas encore terminé de quêtes. Complétez des quêtes pour gagner des récompenses !",
    back: "Retour aux quêtes",
    completeStep: "Compléter l'étape",
  },
};

const NutritionQuest = ({ userId, addPoints }: NutritionQuestProps) => {
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [activeQuests, setActiveQuests] = useState<UserQuest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<UserQuest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [selectedUserQuest, setSelectedUserQuest] = useState<UserQuest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "active" | "completed">("available");
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  // Generate default quest steps based on the quest description
  const generateDefaultSteps = (quest: Quest): QuestStep[] => {
    // Extract requirements from quest if available or create a simple one-step quest
    if (quest.requirements && Array.isArray(quest.requirements.steps)) {
      return quest.requirements.steps;
    }
    
    return [
      {
        id: 1,
        title: quest.title,
        description: quest.description,
        completed: false
      }
    ];
  };

  // Load quests
  useEffect(() => {
    const loadQuests = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        // Fetch available quests from nutrition_quests table
        const questsData = await questService.getNutritionQuests();
        
        // Fetch user's active quests
        const userActiveQuests = await questService.getUserActiveQuests(userId);
        
        // Fetch user's completed quests
        const completedQuests = await questService.getUserCompletedQuests(userId);
        
        // Filter out quests that user has already started or completed
        const activeQuestIds = userActiveQuests.map(q => q.quest_id);
        const completedQuestIds = completedQuests.map(q => q.quest_id);
        
        const availableQuestsFiltered = questsData.filter(quest => 
          !activeQuestIds.includes(quest.id) && !completedQuestIds.includes(quest.id)
        );
        
        // Add default steps to available quests if they don't have steps
        const availableQuestsWithSteps = availableQuestsFiltered.map(quest => ({
          ...quest,
          steps: generateDefaultSteps(quest)
        }));
        
        setAvailableQuests(availableQuestsWithSteps);
        setActiveQuests(userActiveQuests);
        setCompletedQuests(completedQuests);
      } catch (error) {
        console.error("Error loading quests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuests();
  }, [userId]);

  // Start a quest
  const startQuest = async (quest: Quest) => {
    if (!userId) return;
    try {
      const now = new Date().toISOString();
      // Start the quest in the database
      const startedQuest = await questService.startQuest(userId, quest.id);
      if (!startedQuest) throw new Error("Failed to start quest");

      // Generate steps if not present
      const questWithSteps = {
        ...quest,
        steps: quest.steps || generateDefaultSteps(quest)
      };

      // Create user quest with progress
      const userQuest: UserQuest = {
        id: startedQuest.id,
        user_id: userId,
        quest_id: quest.id,
        started_at: now,
        completed_at: null,
        completed: false,
        current_step: 0,
        progress: {
          steps: questWithSteps.steps
        }
      };

      // Update local state
      setAvailableQuests(prev => prev.filter(q => q.id !== quest.id));
      setActiveQuests(prev => [...prev, userQuest]);
      setSelectedQuest(questWithSteps);
      setSelectedUserQuest(userQuest);
      setActiveTab("active");

      toast.success(t.questStarted, {
        description: quest.title,
      });

      const audio = new Audio("/sounds/quest-start.mp3");
      audio.play().catch((e) => console.log("Audio play failed:", e));
    } catch (error) {
      console.error("Error starting quest:", error);
    }
  };

  // Complete a quest step
  const completeQuestStep = async (userQuestId: string, questId: string, stepIndex: number) => {
    if (!userId) return;
    
    try {
      const result = await questService.completeQuestStep(userId, questId, stepIndex);
      
      if (result.success) {
        // Find the quest in our state
        const quest = availableQuests.find(q => q.id === questId) || 
                      activeQuests.find(q => q.quest_id === questId)?.quest;
        
        if (!quest) return;
        
        // Update the user quest in our local state
        const updatedActiveQuests = activeQuests.map(uq => {
          if (uq.id === userQuestId) {
            // Update the step completion status
            const updatedProgress = { ...uq.progress };
            if (updatedProgress?.steps && updatedProgress.steps[stepIndex]) {
              updatedProgress.steps[stepIndex].completed = true;
            }
            
            return {
              ...uq,
              current_step: stepIndex + 1,
              progress: updatedProgress,
              completed: result.completed,
              completed_at: result.completed ? new Date().toISOString() : null
            };
          }
          return uq;
        });
        
        setActiveQuests(updatedActiveQuests);
        
        // If the quest is completed
        if (result.completed) {
          const completedQuest = activeQuests.find(q => q.id === userQuestId);
          if (completedQuest) {
            // Move from active to completed
            setActiveQuests(prev => prev.filter(q => q.id !== userQuestId));
            setCompletedQuests(prev => [...prev, { ...completedQuest, completed: true, completed_at: new Date().toISOString() }]);
            
            // Award points
            await addPoints(quest.points, `Completed quest: ${quest.title}`);
            
            toast.success(t.questCompleted, {
              description: `${t.rewardsEarned}: ${quest.points} ${t.points}`,
            });
            
            // Play completion sound
            const audio = new Audio("/sounds/quest-complete.mp3");
            audio.play().catch((e) => console.log("Audio play failed:", e));
            
            // Reset selected quest if this was the one being viewed
            if (selectedUserQuest?.id === userQuestId) {
              setSelectedUserQuest(null);
              setSelectedQuest(null);
            }
          }
        } else {
          // Just step completed
          toast.success(`${t.completeStep} completed!`);
          
          // Update selected user quest if this was the one being viewed
          if (selectedUserQuest?.id === userQuestId) {
            setSelectedUserQuest(prev => {
              if (!prev) return null;
              
              const updatedProgress = { ...prev.progress };
              if (updatedProgress?.steps && updatedProgress.steps[stepIndex]) {
                updatedProgress.steps[stepIndex].completed = true;
              }
              
              return {
                ...prev,
                current_step: stepIndex + 1,
                progress: updatedProgress
              };
            });
          }
          
          // Play step completion sound
          const audio = new Audio("/sounds/step-complete.mp3");
          audio.play().catch((e) => console.log("Audio play failed:", e));
        }
      }
    } catch (error) {
      console.error("Error completing quest step:", error);
    }
  };

  // Get difficulty class for styling
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "hard":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Calculate progress percentage for active quests
  const getProgressPercentage = (userQuest: UserQuest) => {
    if (!userQuest.progress?.steps || userQuest.progress.steps.length === 0) return 0;
    const completedSteps = userQuest.progress.steps.filter(step => step.completed).length;
    return Math.round((completedSteps / userQuest.progress.steps.length) * 100);
  };

  // Render quest card
  const renderQuestCard = (quest: Quest) => (
    <motion.div
      key={quest.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
      onClick={() => setSelectedQuest(quest)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{quest.title}</h3>
        <div className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyClass(quest.difficulty)}`}>
          {quest.difficulty}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {quest.description}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <span>Points: {quest.points}</span>
        <span>Category: {quest.category}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          startQuest(quest);
        }}
        className="mt-2 bg-primary text-white py-1 px-4 rounded-md text-sm hover:bg-primary/90 transition-colors"
      >
        {t.start}
      </button>
    </motion.div>
  );

  // Render active quest card
  const renderActiveQuestCard = (userQuest: UserQuest) => {
    const quest = activeQuests.find(q => q.id === userQuest.id)?.quest;
    if (!quest) return null;
    
    const progressPercentage = getProgressPercentage(userQuest);
    
    return (
      <motion.div
        key={userQuest.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
        onClick={() => {
          setSelectedQuest(quest);
          setSelectedUserQuest(userQuest);
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{quest.title}</h3>
          <div className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyClass(quest.difficulty)}`}>
            {quest.difficulty}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {quest.description}
        </p>
        
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-4 w-4 text-primary" />
          <span className="text-sm">{quest.points} {t.points}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1 dark:bg-gray-700">
          <div 
            className="bg-primary h-1.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mb-3">
          <span>{progressPercentage}% {t.progress}</span>
          <span>{userQuest.current_step} / {userQuest.progress?.steps?.length || 1} {t.steps}</span>
        </div>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedQuest(quest);
            setSelectedUserQuest(userQuest);
          }}
        >
          {t.continue}
        </Button>
      </motion.div>
    );
  };

  // Render completed quest card
  const renderCompletedQuestCard = (userQuest: UserQuest) => {
    const quest = completedQuests.find(q => q.id === userQuest.id)?.quest;
    if (!quest) return null;
    
    return (
      <motion.div
        key={userQuest.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
        onClick={() => {
          setSelectedQuest(quest);
          setSelectedUserQuest(userQuest);
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{quest.title}</h3>
          <div className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyClass(quest.difficulty)}`}>
            {quest.difficulty}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {quest.description}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">{quest.points} {t.points}</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs">{t.completed}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          {userQuest.completed_at && (
            <p>Completed: {new Date(userQuest.completed_at).toLocaleDateString()}</p>
          )}
        </div>
      </motion.div>
    );
  };

  // Render quest detail view
  const renderQuestDetail = () => {
    if (!selectedQuest) return null;
    
    // If we have a selected user quest (active or completed)
    const isActive = selectedUserQuest && !selectedUserQuest.completed;
    const isCompleted = selectedUserQuest?.completed;
    
    const steps = selectedUserQuest?.progress?.steps || selectedQuest.steps || generateDefaultSteps(selectedQuest);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedQuest(null);
              setSelectedUserQuest(null);
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">{selectedQuest.title}</h2>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedQuest.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">{t.difficulty}</p>
                  <p className={`inline-block px-2 py-0.5 rounded-full text-xs ${getDifficultyClass(selectedQuest.difficulty)}`}>
                    {selectedQuest.difficulty}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t.rewards}</p>
                  <p className="font-medium flex items-center">
                    <Award className="h-4 w-4 mr-1 text-yellow-500" />
                    {selectedQuest.points} {t.points}
                  </p>
                </div>
              </div>
            </div>
            
            {!isActive && !isCompleted && (
              <Button
                onClick={() => startQuest(selectedQuest)}
                className="bg-primary hover:bg-primary/90"
              >
                {t.start}
              </Button>
            )}
            
            {isCompleted && (
              <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                {t.completed}
              </div>
            )}
          </div>
          
          {(isActive || isCompleted) && selectedUserQuest && (
            <>
              {/* Progress bar for active quests */}
              {isActive && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t.progress}</span>
                    <span>{getProgressPercentage(selectedUserQuest)}%</span>
                  </div>
                  <Progress value={getProgressPercentage(selectedUserQuest)} />
                </div>
              )}
              
              {/* Steps list */}
              <div className="mt-6">
                <h3 className="font-medium mb-3">{t.steps}</h3>
                <div className="space-y-3">
                  {steps.map((step, index) => {
                    const isCurrentStep = isActive && index === selectedUserQuest.current_step;
                    const stepCompleted = step.completed || (isActive && index < selectedUserQuest.current_step) || isCompleted;
                    
                    return (
                      <div 
                        key={index} 
                        className={`p-3 border rounded-md ${
                          stepCompleted 
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' 
                            : isCurrentStep 
                            ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30' 
                            : ''
                        }`}
                      >
                        <div className="flex">
                          <div className="mr-3 mt-0.5">
                            {stepCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{step.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                            
                            {isActive && isCurrentStep && (
                              <Button 
                                className="mt-3"
                                onClick={() => completeQuestStep(selectedUserQuest.id, selectedQuest.id, index)}
                              >
                                {t.completeStep}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render empty state
  const renderEmptyState = (
    type: "available" | "active" | "completed",
  ) => {
    let message = "";

    switch (type) {
      case "available":
        message = t.noAvailableQuests;
        break;
      case "active":
        message = t.noActiveQuests;
        break;
      case "completed":
        message = t.noCompletedQuests;
        break;
    }

    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <MapIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400">{message}</p>
        {type === "active" && (
          <button
            onClick={() => setActiveTab("available")}
            className="mt-4 text-primary hover:underline text-sm"
          >
            {t.available}
          </button>
        )}
      </div>
    );
  };

  // If quest detail is being viewed
  if (selectedQuest) {
    return renderQuestDetail();
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold">{t.title}</h2>
      </div>
      
      <div className="border-b dark:border-gray-700">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "available" | "active" | "completed")}
        >
          <Tab value="available" label={t.available} icon={<Star className="h-4 w-4" />} />
          <Tab value="active" label={t.active} icon={<Clock className="h-4 w-4" />} />
          <Tab value="completed" label={t.completed} icon={<CheckCircle className="h-4 w-4" />} />
        </Tabs>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {activeTab === "available" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableQuests.length > 0
                  ? availableQuests.map((quest) => renderQuestCard(quest))
                  : renderEmptyState("available")}
              </div>
            )}
            
            {activeTab === "active" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeQuests.length > 0
                  ? activeQuests.map((userQuest) => renderActiveQuestCard(userQuest))
                  : renderEmptyState("active")}
              </div>
            )}
            
            {activeTab === "completed" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedQuests.length > 0
                  ? completedQuests.map((userQuest) => renderCompletedQuestCard(userQuest))
                  : renderEmptyState("completed")}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NutritionQuest;
