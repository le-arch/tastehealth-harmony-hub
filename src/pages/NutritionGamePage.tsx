
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import NutritionGamificationSystem from "../components/gamification/NutritionGamificationSystem";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { useScreenSize } from "@/utils/mobile";
import { Trophy, Star, Users, Activity } from "lucide-react";
import NutritionQuest from "../components/gamification/NutritionQuest";
import NutritionLeaderboard from "../components/gamification/NutritionLeaderboard";
import { useLanguage } from "@/contexts/LanguageContext";

const NutritionGamePage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isMobile, isTablet } = useScreenSize();
  const [activeTab, setActiveTab] = useState("main");
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Nutrition Game Center",
      tabs: {
        main: "Main Dashboard",
        challenges: "Challenges",
        leaderboard: "Leaderboard",
        progress: "Progress",
      },
      progressTracking: "Progress Tracking",
      comingSoon: "Coming soon: Track your nutrition game progress over time!",
      pleaseLogin: "Please log in to access the Nutrition Game Center.",
    },
    fr: {
      title: "Centre de Jeu Nutritionnel",
      tabs: {
        main: "Tableau de Bord Principal",
        challenges: "Défis",
        leaderboard: "Classement",
        progress: "Progrès",
      },
      progressTracking: "Suivi de Progrès",
      comingSoon: "Bientôt disponible : Suivez vos progrès nutritionnels au fil du temps !",
      pleaseLogin: "Veuillez vous connecter pour accéder au Centre de Jeu Nutritionnel.",
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const addPoints = async (points: number, reason: string) => {
    if (!userId) return;
    
    try {
      // Using gamificationService through RPC
      await supabase.rpc('record_points_transaction', {
        p_user_id: userId,
        p_points: points,
        p_transaction_type: 'earn',
        p_reason: reason
      });
      
      return true;
    } catch (error) {
      console.error("Error adding points:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>{t.pleaseLogin}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{t.title}</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <ScrollableTabsList>
          <TabsTrigger value="main" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            {!isMobile && t.tabs.main}
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            {!isMobile && t.tabs.challenges}
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {!isMobile && t.tabs.leaderboard}
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {!isMobile && t.tabs.progress}
          </TabsTrigger>
        </ScrollableTabsList>
        
        <TabsContent value="main" className="mt-4">
          <NutritionGamificationSystem userId={userId} standalone={true} />
        </TabsContent>
        
        <TabsContent value="challenges" className="mt-4">
          <NutritionQuest userId={userId} addPoints={addPoints} />
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-4">
          <NutritionLeaderboard />
        </TabsContent>
        
        <TabsContent value="progress" className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t.progressTracking}</h2>
            <p>{t.comingSoon}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionGamePage;
