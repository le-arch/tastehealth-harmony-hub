
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Compass, 
  Play, 
  CheckCircle, 
  Clock, 
  Star,
  Trophy,
  Target,
  Zap
} from "lucide-react";
import { supabase } from "@/lib/SupabaseClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface NutritionQuestProps {
  userId?: string;
  addPoints?: (points: number, reason: string) => void;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: string;
  category: string;
  icon: string | null;
  requirements: any;
  is_daily: boolean;
  reset_frequency: string;
  active: boolean;
}

interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
}

const NutritionQuest = ({ userId, addPoints }: NutritionQuestProps) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userQuests, setUserQuests] = useState<UserQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Nutrition Quests",
      startQuest: "Start Quest",
      completeQuest: "Complete Quest",
      completed: "Completed",
      inProgress: "In Progress",
      available: "Available",
      points: "points",
      difficulty: "Difficulty",
      category: "Category",
      daily: "Daily",
      weekly: "Weekly",
      easy: "Easy",
      medium: "Medium", 
      hard: "Hard",
      loading: "Loading quests...",
      questStarted: "Quest started successfully!",
      questCompleted: "Quest completed! Points awarded.",
      alreadyStarted: "Quest already started",
      alreadyCompleted: "Quest already completed today",
      noQuests: "No quests available at the moment."
    },
    fr: {
      title: "Quêtes Nutritionnelles",
      startQuest: "Commencer la Quête",
      completeQuest: "Terminer la Quête", 
      completed: "Terminé",
      inProgress: "En Cours",
      available: "Disponible",
      points: "points",
      difficulty: "Difficulté",
      category: "Catégorie",
      daily: "Quotidien",
      weekly: "Hebdomadaire",
      easy: "Facile",
      medium: "Moyen",
      hard: "Difficile",
      loading: "Chargement des quêtes...",
      questStarted: "Quête commencée avec succès !",
      questCompleted: "Quête terminée ! Points attribués.",
      alreadyStarted: "Quête déjà commencée",
      alreadyCompleted: "Quête déjà terminée aujourd'hui",
      noQuests: "Aucune quête disponible pour le moment."
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    fetchQuests();
    if (userId) {
      fetchUserQuests();
    }
  }, [userId]);

  const fetchQuests = async () => {
    try {
      const { data, error } = await supabase
        .from('nutrition_quests')
        .select('*')
        .eq('active', true)
        .order('points', { ascending: false });

      if (error) {
        console.error('Error fetching quests:', error);
        return;
      }

      console.log('Fetched quests:', data);
      setQuests(data || []);
    } catch (error) {
      console.error('Error in fetchQuests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserQuests = async () => {
    if (!userId) return;

    try {
      // First check if user_nutrition_quests table exists, if not create user quest records
      const { data, error } = await supabase
        .from('user_quests')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user quests:', error);
        return;
      }

      setUserQuests(data || []);
    } catch (error) {
      console.error('Error in fetchUserQuests:', error);
    }
  };

  const startQuest = async (questId: string) => {
    if (!userId) {
      toast.error('Please log in to start quests');
      return;
    }

    // Check if quest is already started
    const existingUserQuest = userQuests.find(
      uq => uq.quest_id === questId && !uq.completed
    );

    if (existingUserQuest) {
      toast.info(t.alreadyStarted);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_quests')
        .insert({
          user_id: userId,
          quest_id: questId,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting quest:', error);
        toast.error('Failed to start quest');
        return;
      }

      setUserQuests(prev => [...prev, data]);
      toast.success(t.questStarted);
    } catch (error) {
      console.error('Error in startQuest:', error);
      toast.error('Failed to start quest');
    }
  };

  const completeQuest = async (questId: string, questPoints: number, questTitle: string) => {
    if (!userId) return;

    const userQuest = userQuests.find(
      uq => uq.quest_id === questId && !uq.completed
    );

    if (!userQuest) {
      toast.error('Quest not started');
      return;
    }

    try {
      // Update quest as completed
      const { error } = await supabase
        .from('user_quests')
        .update({
          completed_at: new Date().toISOString()
        })
        .eq('id', userQuest.id);

      if (error) {
        console.error('Error completing quest:', error);
        toast.error('Failed to complete quest');
        return;
      }

      // Award points using the gamification service
      if (addPoints) {
        addPoints(questPoints, `Completed quest: ${questTitle}`);
      }

      // Update local state
      setUserQuests(prev => 
        prev.map(uq => 
          uq.id === userQuest.id 
            ? { ...uq, completed: true, completed_at: new Date().toISOString() }
            : uq
        )
      );

      toast.success(t.questCompleted);

      // Refresh user quests
      fetchUserQuests();
    } catch (error) {
      console.error('Error in completeQuest:', error);
      toast.error('Failed to complete quest');
    }
  };

  const getQuestStatus = (quest: Quest) => {
    if (!userId) return 'available';
    
    const userQuest = userQuests.find(uq => uq.quest_id === quest.id);
    
    if (!userQuest) return 'available';
    
    if (quest.is_daily) {
      const today = new Date().toISOString().split('T')[0];
      const completedToday = userQuests.find(
        uq => uq.quest_id === quest.id && 
        uq.completed_at && 
        uq.completed_at.split('T')[0] === today
      );
      
      if (completedToday) return 'completed';
      return userQuest.completed_at ? 'available' : 'in_progress';
    }
    
    if (userQuest.completed_at) return 'completed';
    return 'in_progress';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'available': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getQuestIcon = (category: string, icon: string | null) => {
    if (icon) {
      return <Star className="h-5 w-5" />;
    }
    
    switch (category.toLowerCase()) {
      case 'hydration': return <Zap className="h-5 w-5 text-blue-500" />;
      case 'nutrition': return <Target className="h-5 w-5 text-green-500" />;
      case 'exercise': return <Trophy className="h-5 w-5 text-orange-500" />;
      default: return <Compass className="h-5 w-5 text-purple-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-purple-500" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Compass className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>{t.noQuests}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quests.map((quest) => {
              const status = getQuestStatus(quest);
              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-purple-100">
                        {getQuestIcon(quest.category, quest.icon)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{quest.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{quest.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={getDifficultyColor(quest.difficulty)}>
                            {t[quest.difficulty.toLowerCase() as keyof typeof t] || quest.difficulty}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                            {quest.category}
                          </Badge>
                          {quest.is_daily && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                              {t.daily}
                            </Badge>
                          )}
                          <Badge variant="outline" className={getStatusColor(status)}>
                            {t[status as keyof typeof t] || status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-amber-600 mb-2">
                        +{quest.points} {t.points}
                      </div>
                      {status === 'available' && (
                        <Button
                          size="sm"
                          onClick={() => startQuest(quest.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {t.startQuest}
                        </Button>
                      )}
                      {status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => completeQuest(quest.id, quest.points, quest.title)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t.completeQuest}
                        </Button>
                      )}
                      {status === 'completed' && quest.is_daily && (
                        <Button
                          size="sm"
                          onClick={() => startQuest(quest.id)}
                          variant="outline"
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {t.startQuest}
                        </Button>
                      )}
                      {status === 'completed' && !quest.is_daily && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t.completed}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NutritionQuest;
