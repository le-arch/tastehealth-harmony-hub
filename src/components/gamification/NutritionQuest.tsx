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
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import questService from "@/services/questService";

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
  },
};

const NutritionQuest = ({ userId, addPoints }: NutritionQuestProps) => {
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "active" | "completed">("available");
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  // Load quests
  useEffect(() => {
    const loadQuests = async () => {
      setIsLoading(true);
      try {
        // Fetch quests from nutrition_quests table
        const questsData = await questService.getNutritionQuests();
        setAvailableQuests(questsData || []);
      } catch (error) {
        console.error("Error loading quests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuests();
  }, []);

  // Start a quest
  const startQuest = async (quest: Quest) => {
    if (!userId) return;
    try {
      const now = new Date().toISOString();
      // Implement questService.startQuest if needed
      const startedQuest = await questService.startQuest(userId, quest.id);
      if (!startedQuest) throw new Error("Failed to start quest");

      // Update local state
      const updatedQuest = { ...quest, started_at: now };
      setAvailableQuests((prev) => prev.filter((q) => q.id !== quest.id));
      setActiveQuests((prev) => [...prev, updatedQuest]);
      setSelectedQuest(updatedQuest);

      toast.success(t.questStarted, {
        description: quest.title,
      });

      const audio = new Audio("/sounds/quest-start.mp3");
      audio.play().catch((e) => console.log("Audio play failed:", e));
    } catch (error) {
      console.error("Error starting quest:", error);
    }
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
        <div className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
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
      {/* Add more fields as needed */}
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

  // Render empty state
  const renderEmptyState = (
    type: "available" | "active" | "completed",
    t: typeof translations["en"]
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold">{t.title}</h2>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableQuests.length > 0
              ? availableQuests.map((quest) => renderQuestCard(quest))
              : renderEmptyState("available", t)}
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionQuest;
