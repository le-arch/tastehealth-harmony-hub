import React, { useEffect, useState } from 'react';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import NutritionDashboard from '@/components/nutrition/NutritionDashboard';
import BMICalculator from '@/components/health/BMICalculator';
import ProgressTracker from '@/components/health/ProgressTracker';
import RewardsSystem from '../components/RewardSystem';
import WeeklySummary from '@/components/WeeklySummary';
import MealMoodTracker from '@/components/MealMoodTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import ChallengeCreator from '../components/ChallengeCreator'; // Import the ChallengeCreator component
import TasteHealthLoader from "../components/TastehealthLoader";

const DashboardPage = () => {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTab, setSelectedTab] = useState("dashboard");
   const [loading, setLoading] = useState(true);
  const translations = {
    en: {
      title: "Health Dashboard",
      subtitle: "Track your nutrition and health metrics",
      tabs: {
        dashboard: "Dashboard",
        rewards: "Rewards",
        summary: "Weekly Summary",
        mood: "Mood Tracker",
        challenges: "Challenges", // Added Challenges tab
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
        challenges: "Défis", // Added Challenges tab
      },
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    checkAuthStatus();
    toast.success("Welcome to your Health Dashboard!", {
      description: "Track your progress and stay motivated.",
    });
  }, []);

  const checkAuthStatus = async () => {
    const { data } = await supabase.auth.getSession();
    setIsAuthenticated(!!data.session);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <TasteHealthLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-auto align-stretch">
      <ProfileSidebar activePage="dashboard" />

      <div className="flex-1 p-4 sm:ml-64">
        <div className="p-4 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">{t.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{t.subtitle}</p>

          <Tabs
            defaultValue="dashboard"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
              <TabsTrigger value="dashboard">{t.tabs.dashboard}</TabsTrigger>
              <TabsTrigger value="rewards">{t.tabs.rewards}</TabsTrigger>
              <TabsTrigger value="summary">{t.tabs.summary}</TabsTrigger>
              <TabsTrigger value="mood">{t.tabs.mood}</TabsTrigger>
              <TabsTrigger value="challenges">{t.tabs.challenges}</TabsTrigger> {/* Added Challenges tab */}
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
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

            <TabsContent value="challenges"> {/* Added Challenges content */}
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
