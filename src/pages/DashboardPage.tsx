
import React, { useEffect, useState } from 'react';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import NutritionDashboard from '@/components/nutrition/NutritionDashboard';
import BMICalculator from '@/components/health/BMICalculator';
import ProgressTracker from '@/components/health/ProgressTracker';
import RewardsSystem from '../components/RewardSystem';
import WeeklySummary from '@/components/WeeklySummary';
import MealMoodTracker from '@/components/MealMoodTracker';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import ChallengeCreator from '../components/ChallengeCreator';
import TasteHealthLoader from "../components/TastehealthLoader";
import { useScreenSize } from '@/utils/mobile';
import { LayoutDashboard, Award, Calendar, Smile, Trophy } from 'lucide-react';
import { checkAndFixGamificationData } from '@/services/gamificationFixService';

const DashboardPage = () => {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const { isMobile, isTablet } = useScreenSize();

  const translations = {
    en: {
      title: "Health Dashboard",
      subtitle: "Track your nutrition and health metrics",
      tabs: {
        dashboard: "Dashboard",
        rewards: "Rewards",
        summary: "Weekly Summary",
        mood: "Mood Tracker",
        challenges: "Challenges",
      },
    },
    fr: {
      title: "Tableau de Bord Santé",
      subtitle: "Suivez vos indicateurs de nutrition et de santé",
      tabs: {
        dashboard: "Tableau de Bord",
        rewards: "Récompenses",
        summary: "Résumé Hebdomadaire",
        mood: "Suivi de l'Humeur",
        challenges: "Défis",
      },
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const checkAuthAndShowLoader = async () => {
      setLoading(true);
      
      // Check authentication status
      const { data } = await supabase.auth.getSession();
      const isLoggedIn = !!data.session;
      setIsAuthenticated(isLoggedIn);
      
      if (isLoggedIn) {
        // Fix gamification data if needed
        await checkAndFixGamificationData(data.session.user.id);
        
        // Show the loader animation for a moment
        setShowLoader(true);
        
        // Welcome toast
        toast.success("Welcome to your Health Dashboard!", {
          description: "Track your progress and stay motivated.",
        });
        
        // Hide loader after 2.5 seconds
        setTimeout(() => {
          setShowLoader(false);
          setLoading(false);
        }, 2500);
      } else {
        setLoading(false);
      }
    };
    
    checkAuthAndShowLoader();
  }, []);

  if (loading && showLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <TasteHealthLoader />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      <ProfileSidebar activePage="dashboard" />

      <div className={`flex-1 p-3 sm:p-4 ${isMobile ? 'mt-16' : 'md:ml-64'}`}>
        <div className="p-2 sm:p-4 max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">{t.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">{t.subtitle}</p>

          <Tabs
            defaultValue="dashboard"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="space-y-4 sm:space-y-6"
          >
            <ScrollableTabsList className="w-full max-w-3xl mx-auto">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                {!isMobile && t.tabs.dashboard}
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                {!isMobile && t.tabs.rewards}
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {!isMobile && t.tabs.summary}
              </TabsTrigger>
              <TabsTrigger value="mood" className="flex items-center gap-2">
                <Smile className="h-4 w-4" />
                {!isMobile && t.tabs.mood}
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                {!isMobile && t.tabs.challenges}
              </TabsTrigger>
            </ScrollableTabsList>

            <TabsContent value="dashboard" className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <ProgressTracker />
                <BMICalculator />
                <NutritionDashboard />
              </div>
            </TabsContent>

            <TabsContent value="rewards">
              <RewardsSystem />
            </TabsContent>

            <TabsContent value="summary">
              {isAuthenticated ? (
                <WeeklySummary />
              ) : (
                <p className="text-center text-gray-500">
                  Please log in to view your weekly summary.
                </p>
              )}
            </TabsContent>

            <TabsContent value="mood">
              {isAuthenticated ? (
                <MealMoodTracker />
              ) : (
                <p className="text-center text-gray-500">
                  Please log in to track your mood.
                </p>
              )}
            </TabsContent>

            <TabsContent value="challenges">
              {isAuthenticated ? (
                <ChallengeCreator />
              ) : (
                <p className="text-center text-gray-500">
                  Please log in to create and view challenges.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;