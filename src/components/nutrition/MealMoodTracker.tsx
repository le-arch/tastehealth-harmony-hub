"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { getMeals } from "@/services/mealService";
import { saveMealMood, getMealMoods } from "@/services/moodTrackerService";
import { useScreenSize } from "@/utils/mobile";
type MoodEntry = {
  id: string;
  user_id: string;
  meal_id: string;
  meal_name: string;
  mood: string;
  notes: string | null;
  created_at: string;
};

const MOODS = [
  { emoji: "😋", label: "Delicious", value: "delicious" },
  { emoji: "😊", label: "Satisfied", value: "satisfied" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😞", label: "Disappointed", value: "disappointed" },
  { emoji: "😖", label: "Uncomfortable", value: "uncomfortable" },
];

const MealMoodTracker = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();
  const { isMobile, isTablet } = useScreenSize();
  // Translations
  const translations = {
    en: {
      title: "Meal Mood Tracker",
      selectMeal: "Select a meal",
      howDidYouFeel: "How did you feel after this meal?",
      notes: "Notes (optional)",
      submit: "Save Mood",
      submitting: "Saving...",
      recentMoods: "Your Recent Moods",
      noMoods: "No mood entries yet. Start tracking how you feel after meals!",
      moodSaved: "Your mood has been saved!",
      selectMoodFirst: "Please select a mood first",
      selectMealFirst: "Please select a meal first",
    },
    fr: {
      title: "Suivi d'Humeur des Repas",
      selectMeal: "Sélectionner un repas",
      howDidYouFeel: "Comment vous êtes-vous senti après ce repas?",
      notes: "Notes (optionnel)",
      submit: "Enregistrer l'Humeur",
      submitting: "Enregistrement...",
      recentMoods: "Vos Humeurs Récentes",
      noMoods:
        "Pas encore d'entrées d'humeur. Commencez à suivre comment vous vous sentez après les repas!",
      moodSaved: "Votre humeur a été enregistrée!",
      selectMoodFirst: "Veuillez d'abord sélectionner une humeur",
      selectMealFirst: "Veuillez d'abord sélectionner un repas",
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setUserId(session.user.id);
          await loadMeals();
          await loadMoodEntries(session.user.id);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const loadMeals = async () => {
    try {
      const mealsData = await getMeals();
      setMeals(mealsData);
    } catch (error) {
      console.error("Error loading meals:", error);
    }
  };

  const loadMoodEntries = async (userId: string) => {
    try {
      const entries = await getMealMoods(userId);
      setMoodEntries(entries);
    } catch (error) {
      console.error("Error loading mood entries:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMeal) {
      toast.error(t.selectMealFirst);
      return;
    }

    if (!selectedMood) {
      toast.error(t.selectMoodFirst);
      return;
    }

    if (!userId) return;

    setIsSubmitting(true);

    try {
      const mealName =
        meals.find((meal) => meal.id === selectedMeal)?.meal_name || "";

      await saveMealMood({
        user_id: userId,
        meal_id: selectedMeal,
        meal_name: mealName,
        mood: selectedMood,
        notes: notes || null,
      });

      // Play a celebratory sound
      const audio = new Audio("/sounds/success.mp3");
      audio.play().catch((e) => console.log("Audio play failed:", e));

      toast.success(t.moodSaved);

      // Reset form
      setSelectedMeal("");
      setSelectedMood("");
      setNotes("");

      // Reload entries
      await loadMoodEntries(userId);
    } catch (error) {
      console.error("Error saving mood:", error);
      toast.error("Failed to save mood");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    return MOODS.find((m) => m.value === mood)?.emoji || "😐";
  };

  const getMoodLabel = (mood: string) => {
    return MOODS.find((m) => m.value === mood)?.label || "Neutral";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <span role="img" aria-label="mood" className="mr-2 text-xl">
            😋
          </span>
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.selectMeal}</label>
          <Select value={selectedMeal} onValueChange={setSelectedMeal}>
            <SelectTrigger>
              <SelectValue placeholder={t.selectMeal} />
            </SelectTrigger>
            <SelectContent>
              {meals.map((meal) => (
                <SelectItem key={meal.id} value={meal.id}>
                  {meal.meal_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-small">{t.howDidYouFeel}</label>
          <div className="flex">
            {MOODS.map((mood) => (
              <motion.button
                key={mood.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex flex-col items-center p-1 rounded-md ${
                  selectedMood === mood.value
                    ? "bg-primary/20 ring-2 ring-primary"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span role="img" aria-label={mood.label} className="text-2xl">
                  {mood.emoji}
                </span>
                <span className="text-xs mt-1">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            {t.notes}
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded-md h-20 resize-none"
            placeholder="How did the meal make you feel? Any digestive issues?"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? t.submitting : t.submit}
        </Button>
      </CardContent>

      <CardFooter className="flex flex-col items-start">
        <h3 className="text-md font-medium mb-2">{t.recentMoods}</h3>

        {moodEntries.length === 0 ? (
          <p className="text-sm text-gray-500">{t.noMoods}</p>
        ) : (
          <div className="w-full space-y-2">
            <AnimatePresence>
              {moodEntries.slice(0, 5).map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center p-2 border rounded-md"
                >
                  <div className="text-2xl mr-3">
                    {getMoodEmoji(entry.mood)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{entry.meal_name}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(entry.created_at)}
                    </div>
                    {entry.notes && (
                      <div className="text-sm mt-1">{entry.notes}</div>
                    )}
                  </div>
                  <div className="text-sm font-medium">
                    {getMoodLabel(entry.mood)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MealMoodTracker;
