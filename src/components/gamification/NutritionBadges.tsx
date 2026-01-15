
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Gift, Crown, Zap, Award, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface NutritionBadgesProps {
  userId?: string;
  addPoints?: (points: number, reason: string) => void;
}

interface UserLevel {
  level: number;
  total_points: number;
  points_to_next_level: number;
}

interface LevelBenefit {
  level: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  badgeType: 'achievement' | 'milestone' | 'skill' | 'special';
}

const NutritionBadges = ({ userId, addPoints }: NutritionBadgesProps) => {
  const [userLevel, setUserLevel] = useState<UserLevel>({ level: 1, total_points: 0, points_to_next_level: 100 });
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Nutrition Badges",
      achievement: "Achievement",
      milestone: "Milestone", 
      skill: "Skill",
      special: "Special",
      unlocked: "Unlocked",
      locked: "Locked",
      progress: "Progress",
      level: "Level",
      loading: "Loading badges..."
    },
    fr: {
      title: "Badges Nutritionnels",
      achievement: "Réalisation",
      milestone: "Étape",
      skill: "Compétence", 
      special: "Spécial",
      unlocked: "Débloqué",
      locked: "Verrouillé",
      progress: "Progrès",
      level: "Niveau",
      loading: "Chargement des badges..."
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  // Generate badges based on level benefits
  const levelBenefits: LevelBenefit[] = [
    {
      level: 1,
      title: "Welcome Badge",
      description: "Started your nutrition journey",
      icon: "star",
      unlocked: userLevel.level >= 1,
      badgeType: 'milestone'
    },
    {
      level: 2,
      title: "Streak Tracker",
      description: "Unlocked daily nutrition streaks",
      icon: "zap",
      unlocked: userLevel.level >= 2,
      badgeType: 'skill'
    },
    {
      level: 3,
      title: "Meal Planner",
      description: "Access to advanced meal planning",
      icon: "gift",
      unlocked: userLevel.level >= 3,
      badgeType: 'skill'
    },
    {
      level: 4,
      title: "Progress Tracker",
      description: "Advanced progress tracking unlocked",
      icon: "star",
      unlocked: userLevel.level >= 4,
      badgeType: 'achievement'
    },
    {
      level: 5,
      title: "Nutrition Expert",
      description: "Premium nutrition insights unlocked",
      icon: "crown",
      unlocked: userLevel.level >= 5,
      badgeType: 'special'
    },
    {
      level: 6,
      title: "Health Guru",
      description: "Mastered basic nutrition principles",
      icon: "star",
      unlocked: userLevel.level >= 6,
      badgeType: 'achievement'
    },
    {
      level: 7,
      title: "Community Leader",
      description: "Access to exclusive challenges",
      icon: "crown",
      unlocked: userLevel.level >= 7,
      badgeType: 'special'
    },
    {
      level: 8,
      title: "Wellness Warrior",
      description: "Advanced wellness features unlocked",
      icon: "zap",
      unlocked: userLevel.level >= 8,
      badgeType: 'skill'
    },
    {
      level: 9,
      title: "Nutrition Mentor",
      description: "Help others on their journey",
      icon: "gift",
      unlocked: userLevel.level >= 9,
      badgeType: 'achievement'
    },
    {
      level: 10,
      title: "Master Nutritionist",
      description: "All features unlocked - Ultimate mastery",
      icon: "crown",
      unlocked: userLevel.level >= 10,
      badgeType: 'special'
    }
  ];

  useEffect(() => {
    const fetchUserLevel = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_points')
          .select('current_level, total_points, points_to_next_level')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user level:', error);
          return;
        }

        if (data) {
          setUserLevel({
            level: data.current_level,
            total_points: data.total_points,
            points_to_next_level: data.points_to_next_level
          });
        }
      } catch (error) {
        console.error('Error in fetchUserLevel:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLevel();
  }, [userId]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'star': return <Star className="h-5 w-5" />;
      case 'zap': return <Zap className="h-5 w-5" />;
      case 'gift': return <Gift className="h-5 w-5" />;
      case 'crown': return <Crown className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  const getBadgeColor = (badgeType: string, unlocked: boolean) => {
    if (!unlocked) return 'bg-gray-100 text-gray-400 border-gray-200';
    
    switch (badgeType) {
      case 'achievement': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'milestone': return 'bg-green-100 text-green-600 border-green-200';
      case 'skill': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'special': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getBadgeTypeLabel = (badgeType: string) => {
    return t[badgeType as keyof typeof t] || badgeType;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const unlockedBadges = levelBenefits.filter(badge => badge.unlocked);
  const lockedBadges = levelBenefits.filter(badge => !badge.unlocked);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          {t.title}
        </CardTitle>
        <div className="text-sm text-gray-500">
          {unlockedBadges.length} of {levelBenefits.length} badges unlocked
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t.level} {userLevel.level}</span>
            <span className="text-sm text-gray-500">{userLevel.total_points} points</span>
          </div>
          <Progress 
            value={userLevel.points_to_next_level > 0 ? 
              ((userLevel.total_points / (userLevel.total_points + userLevel.points_to_next_level)) * 100) : 100
            } 
            className="h-2" 
          />
          <p className="text-xs text-gray-500">
            {userLevel.points_to_next_level > 0 ? 
              `${userLevel.points_to_next_level} points to level ${userLevel.level + 1}` :
              'Max level reached!'
            }
          </p>
        </div>

        {/* Unlocked Badges */}
        {unlockedBadges.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-green-600">{t.unlocked} ({unlockedBadges.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {unlockedBadges.map((badge) => (
                <motion.div
                  key={badge.level}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3 rounded-lg border-2 ${getBadgeColor(badge.badgeType, badge.unlocked)} cursor-pointer hover:shadow-md transition-all`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`p-2 rounded-full ${getBadgeColor(badge.badgeType, badge.unlocked)}`}>
                      {getIcon(badge.icon)}
                    </div>
                    <div>
                      <h5 className="font-medium text-xs">{badge.title}</h5>
                      <p className="text-xs opacity-75">{badge.description}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {getBadgeTypeLabel(badge.badgeType)}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-500">{t.locked} ({lockedBadges.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {lockedBadges.slice(0, 4).map((badge) => (
                <div
                  key={badge.level}
                  className={`p-3 rounded-lg border-2 ${getBadgeColor(badge.badgeType, badge.unlocked)} opacity-60`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-xs">{badge.title}</h5>
                      <p className="text-xs opacity-75">{badge.description}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {t.level} {badge.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NutritionBadges;
