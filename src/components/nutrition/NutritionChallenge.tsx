"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Target, Calendar, Check, Plus } from "lucide-react";
import {
  createNutritionChallenge,
  getUserChallenges,
  completeChallengeDailyTask,
  type NutritionChallenge,
  type ChallengeProgress,
} from "@/services/challengeService";

const CHALLENGE_TYPES = [
  {
    id: "water",
    label: "Water Intake",
    icon: "💧",
    description: "Drink more water daily",
  },
  {
    id: "vegetables",
    label: "Vegetable Servings",
    icon: "🥦",
    description: "Eat more vegetables",
  },
  {
    id: "protein",
    label: "Protein Intake",
    icon: "🥩",
    description: "Increase protein consumption",
  },
  {
    id: "sugar",
    label: "Sugar Reduction",
    icon: "🍬",
    description: "Reduce sugar intake",
  },
  {
    id: "meal_prep",
    label: "Meal Preparation",
    icon: "🍱",
    description: "Prepare meals in advance",
  },
  {
    id: "snacking",
    label: "Healthy Snacking",
    icon: "🍎",
    description: "Choose healthier snacks",
  },
];

const NutritionChallenge = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [duration, setDuration] = useState(7); // days
  const [difficulty, setDifficulty] = useState(5); // 1-10
  const [challenges, setChallenges] = useState<NutritionChallenge[]>([]);
  const [progress, setProgress] = useState<Record<string, ChallengeProgress>>(
    {}
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();

  // Translations
  const translations = {
    en: {
      title: "Nutrition Challenges",
      createChallenge: "Create Challenge",
      challengeName: "Challenge Name",
      challengeTypes: "Challenge Types",
      duration: "Duration (days)",
      difficulty: "Difficulty Level",
      easy: "Easy",
      hard: "Hard",
      create: "Create Challenge",
      creating: "Creating...",
      cancel: "Cancel",
      activeChallenges: "Active Challenges",
      noChallenges: "No active challenges. Create one to get started!",
      daysLeft: "days left",
      day: "day",
      days: "days",
      markComplete: "Mark Today Complete",
      completed: "Completed Today",
      progress: "Progress",
      challengeCreated: "Challenge created successfully!",
      taskCompleted: "Task completed for today!",
      deleteChallenge: "Delete Challenge",
    },
    fr: {
      title: "Défis Nutritionnels",
      createChallenge: "Créer un Défi",
      challengeName: "Nom du Défi",
      challengeTypes: "Types de Défi",
      duration: "Durée (jours)",
      difficulty: "Niveau de Difficulté",
      easy: "Facile",
      hard: "Difficile",
      create: "Créer le Défi",
      creating: "Création...",
      cancel: "Annuler",
      activeChallenges: "Défis Actifs",
      noChallenges: "Pas de défis actifs. Créez-en un pour commencer!",
      daysLeft: "jours restants",
      day: "jour",
      days: "jours",
      markComplete: "Marquer Aujourd'hui Complet",
      completed: "Complété Aujourd'hui",
      progress: "Progrès",
      challengeCreated: "Défi créé avec succès!",
      taskCompleted: "Tâche complétée pour aujourd'hui!",
      deleteChallenge: "Supprimer le Défi",
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setUserId(session.user.id);
          await loadChallenges(session.user.id);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const loadChallenges = async (userId: string) => {
    try {
      const { challenges, progress } = await getUserChallenges(userId);
      setChallenges(challenges);

      // Convert progress array to a record for easier lookup
      const progressRecord: Record<string, ChallengeProgress> = {};
      progress.forEach((p) => {
        progressRecord[p.challenge_id] = p;
      });
      setProgress(progressRecord);
    } catch (error) {
      console.error("Error loading challenges:", error);
    }
  };

  const handleCreateChallenge = async () => {
    if (!challengeName.trim()) {
      toast.error("Please enter a challenge name");
      return;
    }

    if (selectedTypes.length === 0) {
      toast.error("Please select at least one challenge type");
      return;
    }

    if (!userId) return;

    setIsSubmitting(true);

    try {
      await createNutritionChallenge({
        user_id: userId,
        name: challengeName,
        types: selectedTypes,
        duration_days: duration,
        difficulty_level: difficulty,
      });

      // Play a celebratory sound
      const audio = new Audio("/sounds/challenge-created.mp3");
      audio.play().catch((e) => console.log("Audio play failed:", e));

      toast.success(t.challengeCreated);

      // Reset form
      setChallengeName("");
      setSelectedTypes([]);
      setDuration(7);
      setDifficulty(5);
      setIsCreating(false);

      // Reload challenges
      await loadChallenges(userId);
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast.error("Failed to create challenge");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async (challengeId: string) => {
    if (!userId) return;

    try {
      await completeChallengeDailyTask(userId, challengeId);

      // Play a celebratory sound
      const audio = new Audio("/sounds/task-complete.mp3");
      audio.play().catch((e) => console.log("Audio play failed:", e));

      toast.success(t.taskCompleted);

      // Reload challenges
      await loadChallenges(userId);
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete task");
    }
  };

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const getDaysLeft = (challenge: NutritionChallenge) => {
    const startDate = new Date(challenge.created_at);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + challenge.duration_days);

    const today = new Date();
    const daysLeft = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysLeft > 0 ? daysLeft : 0;
  };

  const getProgressPercentage = (challengeId: string) => {
    const challengeProgress = progress[challengeId];
    if (!challengeProgress) return 0;

    return Math.round(
      (challengeProgress.days_completed / challengeProgress.total_days) * 100
    );
  };

  const isCompletedToday = (challengeId: string) => {
    const challengeProgress = progress[challengeId];
    if (!challengeProgress) return false;

    const lastCompletedDate = new Date(challengeProgress.last_completed_at);
    const today = new Date();

    return (
      lastCompletedDate.getDate() === today.getDate() &&
      lastCompletedDate.getMonth() === today.getMonth() &&
      lastCompletedDate.getFullYear() === today.getFullYear()
    );
  };

  const getChallengeTypeIcons = (types: string[]) => {
    return types
      .map((type) => {
        const challengeType = CHALLENGE_TYPES.find((t) => t.id === type);
        return challengeType ? challengeType.icon : "";
      })
      .join(" ");
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg font-medium">
          <Trophy className="mr-2 h-5 w-5 text-amber-500" />
          {t.title}
        </CardTitle>
        {!isCreating && (
          <Button
            onClick={() => setIsCreating(true)}
            size="sm"
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" />
            {t.createChallenge}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isCreating ? (
            <motion.div
              key="create-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.challengeName}</label>
                <Input
                  value={challengeName}
                  onChange={(e) => setChallengeName(e.target.value)}
                  placeholder="e.g., 7-Day Hydration Challenge"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t.challengeTypes}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CHALLENGE_TYPES.map((type) => (
                    <div key={type.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`type-${type.id}`}
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={() => handleTypeToggle(type.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`type-${type.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type.icon} {type.label}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">{t.duration}</label>
                  <span className="text-sm">
                    {duration} {duration === 1 ? t.day : t.days}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={30}
                  step={1}
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">{t.difficulty}</label>
                  <span className="text-sm">{difficulty}/10</span>
                </div>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[difficulty]}
                  onValueChange={(value) => setDifficulty(value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{t.easy}</span>
                  <span>{t.hard}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  {t.cancel}
                </Button>
                <Button onClick={handleCreateChallenge} disabled={isSubmitting}>
                  {isSubmitting ? t.creating : t.create}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="challenges-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-md font-medium mb-4">{t.activeChallenges}</h3>

              {challenges.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">{t.noChallenges}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium flex items-center">
                            <span className="mr-2">
                              {getChallengeTypeIcons(challenge.types)}
                            </span>
                            {challenge.name}
                          </h4>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {getDaysLeft(challenge)} {t.daysLeft}
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                          {t.difficulty}: {challenge.difficulty_level}/10
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{t.progress}</span>
                          <span>{getProgressPercentage(challenge.id)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{
                              width: `${getProgressPercentage(challenge.id)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between">
                        {isCompletedToday(challenge.id) ? (
                          <Button variant="outline" disabled className="w-full">
                            <Check className="mr-1 h-4 w-4" />
                            {t.completed}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleCompleteTask(challenge.id)}
                            variant="default"
                            className="w-full"
                          >
                            <Check className="mr-1 h-4 w-4" />
                            {t.markComplete}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default NutritionChallenge;
