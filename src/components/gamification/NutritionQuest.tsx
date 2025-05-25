
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
  Play,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/SupabaseClient";

interface NutritionQuestProps {
  userId?: string;
  addPoints: (points: number, reason: string) => Promise<void>;
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
  created_at?: string;
  updated_at?: string;
}

interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  completed: boolean;
  started_at: string;
  completed_at?: string;
  quest?: Quest;
}

const translations = {
  en: {
    title: "Nutrition Quests",
    available: "Available Quests",
    active: "Active Quests",
    completed: "Completed Quests",
    start: "Start Quest",
    continue: "Continue",
    complete: "Complete Quest",
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
    playToEarn: "Play to Earn Points!",
  },
  fr: {
    title: "Quêtes Nutritionnelles",
    available: "Quêtes Disponibles",
    active: "Quêtes Actives",
    completed: "Quêtes Terminées",
    start: "Commencer la Quête",
    continue: "Continuer",
    complete: "Terminer la Quête",
    claim: "Réclamer Récompenses",
    difficulty: "Difficulté",
    duration: "Durée",
    days: "jours",
    rewards: "Récompenses",
    points: "points",
    steps: "Étapes",
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
    playToEarn: "Jouez pour Gagner des Points !",
  },
};

const NutritionQuest = ({ userId, addPoints }: NutritionQuestProps) => {
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [activeQuests, setActiveQuests] = useState<UserQuest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<UserQuest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "active" | "completed">("available");
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  // Load quests
  useEffect(() => {
    const loadQuests = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        // Fetch available quests from nutrition_quests table
        const { data: questsData, error: questsError } = await supabase
          .from("nutrition_quests")
          .select("*")
          .eq("active", true);

        if (questsError) {
          console.error("Error loading quests:", questsError);
          return;
        }

        // Fetch user's quest progress
        const { data: userQuestsData, error: userQuestsError } = await supabase
          .from("user_nutrition_quests")
          .select("*, nutrition_quests(*)")
          .eq("user_id", userId);

        if (userQuestsError) {
          console.error("Error loading user quests:", userQuestsError);
          return;
        }

        // Separate active and completed quests
        const activeUserQuests = userQuestsData?.filter(uq => !uq.completed) || [];
        const completedUserQuests = userQuestsData?.filter(uq => uq.completed) || [];

        // Filter available quests (exclude those already started)
        const startedQuestIds = new Set(userQuestsData?.map(uq => uq.quest_id) || []);
        const filteredAvailableQuests = questsData?.filter(quest => !startedQuestIds.has(quest.id)) || [];

        setAvailableQuests(filteredAvailableQuests);
        setActiveQuests(activeUserQuests);
        setCompletedQuests(completedUserQuests);
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
      const { error } = await supabase
        .from("user_nutrition_quests")
        .insert({
          user_id: userId,
          quest_id: quest.id,
          completed: false,
          started_at: new Date().toISOString()
        });

      if (error) {
        console.error("Error starting quest:", error);
        return;
      }

      toast.success(t.questStarted, {
        description: quest.title,
      });

      // Refresh quests
      const updatedAvailable = availableQuests.filter(q => q.id !== quest.id);
      const newActiveQuest: UserQuest = {
        id: `temp-${quest.id}`,
        user_id: userId,
        quest_id: quest.id,
        completed: false,
        started_at: new Date().toISOString(),
        quest: quest
      };

      setAvailableQuests(updatedAvailable);
      setActiveQuests([...activeQuests, newActiveQuest]);

      const audio = new Audio("/sounds/quest-start.mp3");
      audio.play().catch((e) => console.log("Audio play failed:", e));
    } catch (error) {
      console.error("Error starting quest:", error);
    }
  };

  // Complete a quest
  const completeQuest = async (userQuest: UserQuest) => {
    if (!userId || !userQuest.quest) return;

    try {
      const { error } = await supabase
        .from("user_nutrition_quests")
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .eq("quest_id", userQuest.quest_id);

      if (error) {
        console.error("Error completing quest:", error);
        return;
      }

      // Award points
      await addPoints(userQuest.quest.points, `Completed quest: ${userQuest.quest.title}`);

      toast.success(t.questCompleted, {
        description: `${t.rewardsEarned}: ${userQuest.quest.points} ${t.points}`,
      });

      // Update local state
      const updatedActiveQuests = activeQuests.filter(q => q.quest_id !== userQuest.quest_id);
      const completedQuest = { ...userQuest, completed: true, completed_at: new Date().toISOString() };

      setActiveQuests(updatedActiveQuests);
      setCompletedQuests([...completedQuests, completedQuest]);

      const audio = new Audio("/sounds/quest-complete.mp3");
      audio.play().catch((e) => console.log("Audio play failed:", e));
    } catch (error) {
      console.error("Error completing quest:", error);
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

  // Render quest card
  const renderAvailableQuestCard = (quest: Quest) => (
    <motion.div
      key={quest.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="border rounded-lg p-4 hover:border-primary transition-colors"
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
        <span className="flex items-center">
          <Award className="h-3 w-3 mr-1" />
          {quest.points} {t.points}
        </span>
        <span>Category: {quest.category}</span>
      </div>
      <button
        onClick={() => startQuest(quest)}
        className="w-full mt-2 bg-primary text-white py-2 px-4 rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <Play className="h-4 w-4" />
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
          <div className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyClass(userQuest.quest.difficulty)}`}>
            {userQuest.quest.difficulty}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {userQuest.quest.description}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span className="flex items-center">
            <Award className="h-3 w-3 mr-1" />
            {userQuest.quest.points} {t.points}
          </span>
          <span>Category: {userQuest.quest.category}</span>
        </div>
        <button
          onClick={() => completeQuest(userQuest)}
          className="w-full mt-2 bg-green-500 text-white py-2 px-4 rounded-md text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <Trophy className="h-4 w-4" />
          {t.complete}
        </button>
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
        className="border rounded-lg p-4 hover:border-primary transition-colors opacity-75"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{userQuest.quest.title}</h3>
          <div className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyClass(userQuest.quest.difficulty)}`}>
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
            <span>{userQuest.quest.points} {t.points}</span>
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{t.title}</h2>
          <div className="text-sm text-gray-500">{t.playToEarn}</div>
        </div>
      </div>

      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeTab === "available"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t.available}
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeTab === "active"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t.active} ({activeQuests.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeTab === "completed"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t.completed} ({completedQuests.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="p-4">
          {activeTab === "available" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableQuests.length > 0
                ? availableQuests.map(renderAvailableQuestCard)
                : renderEmptyState("available")}
            </div>
          )}

          {activeTab === "active" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeQuests.length > 0
                ? activeQuests.map(renderActiveQuestCard)
                : renderEmptyState("active")}
            </div>
          )}

          {activeTab === "completed" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedQuests.length > 0
                ? completedQuests.map(renderCompletedQuestCard)
                : renderEmptyState("completed")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NutritionQuest;
