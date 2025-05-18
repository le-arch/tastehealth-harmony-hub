"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Award, Clock, Filter } from "lucide-react";
import { toast } from "sonner";
import questService, {
  type Quest,
  type UserQuest,
} from "../../services/questService";
import { useLanguage } from "../../contexts/LanguageContext";

interface DailyQuestsProps {
  userId?: string;
  onQuestComplete: (questId: string, points: number) => Promise<void>;
}

const DailyQuests = ({ userId, onQuestComplete }: DailyQuestsProps) => {
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [activeQuests, setActiveQuests] = useState<UserQuest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<UserQuest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questType, setQuestType] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Nutrition Quests",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      available: "Available",
      active: "In Progress",
      completed: "Completed",
      start: "Start Quest",
      completeStep: "Complete Step",
      noQuests: "No quests available. Check back later!",
      noActiveQuests: "No active quests. Start a new quest!",
      noCompletedQuests: "You haven't completed any quests of this type.",
      questStarted: "Quest started!",
      stepCompleted: "Step completed!",
      questCompleted: "Quest completed!",
      rewardsEarned: "Rewards earned",
      points: "points",
      filterBy: "Filter by",
    },
    fr: {
      title: "Quêtes Nutritionnelles",
      daily: "Quotidien",
      weekly: "Hebdomadaire",
      monthly: "Mensuel",
      available: "Disponibles",
      active: "En Cours",
      completed: "Terminées",
      start: "Commencer",
      completeStep: "Compléter",
      noQuests: "Pas de quêtes disponibles. Revenez plus tard !",
      noActiveQuests: "Pas de quêtes actives. Commencez une nouvelle quête !",
      noCompletedQuests: "Vous n'avez pas encore terminé de quêtes de ce type.",
      questStarted: "Quête commencée !",
      stepCompleted: "Étape complétée !",
      questCompleted: "Quête terminée !",
      rewardsEarned: "Récompenses gagnées",
      points: "points",
      filterBy: "Filtrer par",
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.en;

  // Load quests
  const loadQuests = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // Get all quests of the selected type
      const quests = await questService.getQuestsByType(questType);

      // Get user's active quests of the selected type
      const userActiveQuests = await questService.getActiveQuestsByType(
        userId,
        questType
      );

      // Get user's completed quests of the selected type
      const userCompletedQuests = await questService.getCompletedQuestsByType(
        userId,
        questType
      );

      // Filter out quests that are already active or completed
      const activeQuestIds = new Set(userActiveQuests.map((uq) => uq.quest_id));
      const completedQuestIds = new Set(
        userCompletedQuests.map((uq) => uq.quest_id)
      );

      const availableQuestsFiltered = quests.filter(
        (quest) =>
          !activeQuestIds.has(quest.id) && !completedQuestIds.has(quest.id)
      );

      setAvailableQuests(availableQuestsFiltered);
      setActiveQuests(userActiveQuests);
      setCompletedQuests(userCompletedQuests);
    } catch (error) {
      console.error("Error loading quests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuests();
  }, [userId, questType]);

  // Start a quest
  const startQuest = async (quest: Quest) => {
    if (!userId) return;

    try {
      await questService.startQuest(userId, quest.id);

      // Show toast
      toast.success(t.questStarted, {
        description: quest.title,
      });

      // Play sound
      const audio = new Audio("/sounds/quest-start.mp3");
      audio.play().catch((e) => console.log("Audio play failed:", e));

      // Reload quests
      loadQuests();
    } catch (error) {
      console.error("Error starting quest:", error);
    }
  };

  // Complete a quest step
  const completeQuestStep = async (userQuest: UserQuest, stepIndex: number) => {
    if (!userId || !userQuest.quest) return;

    try {
      const result = await questService.completeQuestStep(
        userId,
        userQuest.quest_id,
        stepIndex
      );

      if (result.success) {
        if (result.completed) {
          // Quest fully completed
          toast.success(t.questCompleted, {
            description: `${t.rewardsEarned}: ${userQuest.quest.rewards.points} ${t.points}`,
          });

          // Award points
          await onQuestComplete(
            userQuest.quest_id,
            userQuest.quest.rewards.points
          );

          // Play sound
          const audio = new Audio("/sounds/quest-complete.mp3");
          audio.play().catch((e) => console.log("Audio play failed:", e));
        } else {
          // Just step completed
          toast.success(t.stepCompleted);

          // Play sound
          const audio = new Audio("/sounds/step-complete.mp3");
          audio.play().catch((e) => console.log("Audio play failed:", e));
        }

        // Reload quests
        loadQuests();
      }
    } catch (error) {
      console.error("Error completing quest step:", error);
    }
  };

  // Get difficulty class
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

  // Calculate progress percentage
  const getProgressPercentage = (userQuest: UserQuest) => {
    if (!userQuest.quest?.steps || userQuest.quest.steps.length === 0) return 0;
    const completedSteps = userQuest.quest.steps.filter(
      (step) => step.completed
    ).length;
    return Math.round((completedSteps / userQuest.quest.steps.length) * 100);
  };

  // Render available quest card
  const renderAvailableQuestCard = (quest: Quest) => (
    <motion.div
      key={quest.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="border rounded-lg p-4 hover:border-primary transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{quest.title}</h3>
        <div
          className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyClass(
            quest.difficulty
          )}`}
        >
          {quest.difficulty}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {quest.description}
      </p>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {quest.duration_days} {quest.duration_days === 1 ? "day" : "days"}
          </span>
        </div>
        <div className="flex items-center">
          <Award className="h-3 w-3 mr-1" />
          <span>
            {quest.rewards.points} {t.points}
          </span>
        </div>
      </div>

      <button
        onClick={() => startQuest(quest)}
        className="w-full mt-2 bg-primary text-white py-1 px-3 rounded-md text-sm hover:bg-primary/90 transition-colors"
      >
        {t.start}
      </button>
    </motion.div>
  );

  // Render active quest card
  const renderActiveQuestCard = (userQuest: UserQuest) => {
    if (!userQuest.quest) return null;

    return (
      <motion.div
        key={userQuest.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="border rounded-lg p-4 hover:border-primary transition-colors"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{userQuest.quest.title}</h3>
          <div
            className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyClass(
              userQuest.quest.difficulty
            )}`}
          >
            {userQuest.quest.difficulty}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {userQuest.quest.description}
        </p>

        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1 dark:bg-gray-700">
          <motion.div
            className="bg-primary h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage(userQuest)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs mb-3">
          <span>{getProgressPercentage(userQuest)}%</span>
          <span className="flex items-center">
            <Award className="h-3 w-3 mr-1" />
            <span>
              {userQuest.quest.rewards.points} {t.points}
            </span>
          </span>
        </div>

        {/* Steps */}
        <div className="space-y-2 mt-3">
          {userQuest.quest.steps.map((step, index) => (
            <div
              key={step.id}
              className={`border rounded-lg p-2 ${
                step.completed
                  ? "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20"
                  : index === userQuest.current_step
                  ? "border-primary/30 bg-primary/5"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{step.title}</h4>
                  {index === userQuest.current_step && !step.completed && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => completeQuestStep(userQuest, index)}
                      className="mt-1 bg-primary text-white py-0.5 px-2 rounded-md text-xs hover:bg-primary/90 transition-colors"
                    >
                      {t.completeStep}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Render completed quest card
  const renderCompletedQuestCard = (userQuest: UserQuest) => {
    if (!userQuest.quest) return null;

    return (
      <motion.div
        key={userQuest.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="border rounded-lg p-4 hover:border-primary transition-colors"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{userQuest.quest.title}</h3>
          <div
            className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyClass(
              userQuest.quest.difficulty
            )}`}
          >
            {userQuest.quest.difficulty}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {userQuest.quest.description}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <div className="flex items-center text-green-500">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>{t.completed}</span>
          </div>
          <div className="flex items-center">
            <Award className="h-3 w-3 mr-1" />
            <span>
              {userQuest.quest.rewards.points} {t.points}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render empty state
  const renderEmptyState = (type: "available" | "active" | "completed") => {
    let message = "";

    switch (type) {
      case "available":
        message = t.noQuests;
        break;
      case "active":
        message = t.noActiveQuests;
        break;
      case "completed":
        message = t.noCompletedQuests;
        break;
    }

    return (
      <div className="text-center py-4 text-gray-500">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold">{t.title}</h2>
      </div>

      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center mb-2">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-500">{t.filterBy}:</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setQuestType("daily")}
            className={`px-3 py-1 rounded-full text-sm ${
              questType === "daily"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t.daily}
          </button>
          <button
            onClick={() => setQuestType("weekly")}
            className={`px-3 py-1 rounded-full text-sm ${
              questType === "weekly"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t.weekly}
          </button>
          <button
            onClick={() => setQuestType("monthly")}
            className={`px-3 py-1 rounded-full text-sm ${
              questType === "monthly"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t.monthly}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="p-4">
          {/* Available Quests */}
          {availableQuests.length > 0 && (
            <>
              <h3 className="font-medium mb-3">{t.available}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {availableQuests.map(renderAvailableQuestCard)}
              </div>
            </>
          )}

          {/* Active Quests */}
          <h3 className="font-medium mb-3">{t.active}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {activeQuests.length > 0
              ? activeQuests.map(renderActiveQuestCard)
              : renderEmptyState("active")}
          </div>

          {/* Completed Quests */}
          <h3 className="font-medium mb-3">{t.completed}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedQuests.length > 0
              ? completedQuests.map(renderCompletedQuestCard)
              : renderEmptyState("completed")}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyQuests;
