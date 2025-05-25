"use client";

import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/SupabaseClient";

interface NutritionBadgesProps {
  userId?: string;
  addPoints: (points: number, reason: string) => Promise<void>;
}

interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  points: number;
  requirement_count: number;
  active: boolean;
  created_at?: string;
  // Fields from user_badges
  unlocked: boolean;
  progress?: number;
  total?: number;
  unlocked_at?: string;
  is_equipped?: boolean;
}

const NutritionBadges = ({ userId, addPoints }: NutritionBadgesProps) => {
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Nutrition Badges",
      all: "All",
      locked: "Locked",
      unlocked: "Unlocked",
      progress: "Progress",
      badgeUnlocked: "Badge Unlocked!",
      earnedPoints: "You earned",
      points: "points",
      continue: "Continue",
    },
    fr: {
      title: "Badges Nutritionnels",
      all: "Tous",
      locked: "Verrouillés",
      unlocked: "Déverrouillés",
      progress: "Progrès",
      badgeUnlocked: "Badge Déverrouillé !",
      earnedPoints: "Vous avez gagné",
      points: "points",
      continue: "Continuer",
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.en;

  // Load badges
  useEffect(() => {
    const loadBadges = async () => {
      if (!userId) return;

      try {
        // Get all available badges
        const { data: badgesData, error: badgesError } = await supabase
          .from("badges")
          .select("*")
          .eq("active", true)
          .order("rarity", { ascending: false });

        if (badgesError) throw badgesError;

        // Get user's unlocked badges
        const { data: userBadges, error: userBadgesError } = await supabase
          .from("user_badges")
          .select("badge_id, progress, total, unlocked_at, is_equipped")
          .eq("user_id", userId);

        if (userBadgesError) throw userBadgesError;

        // Combine data
        const userBadgesMap = new Map();
        userBadges?.forEach((ub) => {
          userBadgesMap.set(ub.badge_id, {
            unlocked: !!ub.unlocked_at,
            progress: ub.progress || 0,
            total: ub.total || 1,
            unlocked_at: ub.unlocked_at,
            is_equipped: ub.is_equipped || false,
          });
        });

        const processedBadges = badgesData?.map((badge) => {
          const userBadge = userBadgesMap.get(badge.id);
          return {
            ...badge,
            unlocked: userBadge?.unlocked || false,
            progress: userBadge?.progress || 0,
            total: userBadge?.total || badge.requirement_count || 1,
            unlocked_at: userBadge?.unlocked_at,
            is_equipped: userBadge?.is_equipped || false,
          };
        });

        setBadges(processedBadges || []);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(processedBadges?.map((badge) => badge.category) || [])
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading badges:", error);
      }
    };

    loadBadges();
  }, [userId]);

  // Filter badges by category
  const filteredBadges = badges.filter(
    (badge) => activeCategory === "all" || badge.category === activeCategory
  );

  // Handle badge click
  const handleBadgeClick = (badge: BadgeType) => {
    setSelectedBadge(badge);
  };

  // Get badge rarity class
  const getBadgeRarityClass = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "uncommon":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "legendary":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg font-medium">
            <Badge className="h-5 w-5 mr-2 text-purple-500" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1 text-sm rounded-full ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {t.all}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Badges grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredBadges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBadgeClick(badge)}
                className={`relative cursor-pointer rounded-lg p-4 flex flex-col items-center text-center ${
                  badge.unlocked
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <div
                  className={`text-2xl mb-2 ${
                    badge.unlocked ? "opacity-100" : "opacity-50"
                  }`}
                >
                  {badge.icon}
                </div>
                <div className="font-medium text-sm">{badge.name}</div>
                {badge.progress !== undefined && badge.total !== undefined && (
                  <div className="w-full mt-2">
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (badge.progress / badge.total) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs mt-1 text-gray-500">
                      {badge.progress}/{badge.total}
                    </div>
                  </div>
                )}
                {!badge.unlocked && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                )}
                <div
                  className={`absolute bottom-2 right-2 text-xs px-1.5 py-0.5 rounded-full ${getBadgeRarityClass(
                    badge.rarity
                  )}`}
                >
                  {badge.rarity}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badge detail modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setSelectedBadge(null);
            setShowUnlockAnimation(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {showUnlockAnimation ? (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4 mx-auto"
                >
                  {selectedBadge.icon}
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2"
                >
                  {t.badgeUnlocked}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg mb-2"
                >
                  {selectedBadge.name}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-sm text-gray-500 mb-4"
                >
                  {selectedBadge.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-amber-500 font-bold mb-6"
                >
                  {t.earnedPoints} {selectedBadge.points} {t.points}!
                </motion.div>
                <Button onClick={() => setShowUnlockAnimation(false)}>
                  {t.continue}
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{selectedBadge.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedBadge.name}</h3>
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full inline-block ${getBadgeRarityClass(
                        selectedBadge.rarity
                      )}`}
                    >
                      {selectedBadge.rarity}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {selectedBadge.description}
                </p>
                {selectedBadge.progress !== undefined &&
                  selectedBadge.total !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t.progress}</span>
                        <span>
                          {selectedBadge.progress}/{selectedBadge.total}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (selectedBadge.progress / selectedBadge.total) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                <div className="text-sm text-gray-500 mb-4">
                  {t.earnedPoints}: {selectedBadge.points} {t.points}
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedBadge(null)}
                  >
                    {t.continue}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NutritionBadges;
