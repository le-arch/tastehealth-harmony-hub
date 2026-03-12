import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import NutritionDashboard from '@/components/nutrition/NutritionDashboard';
import BMICalculator from '@/components/health/BMICalculator';
import ProgressTracker from '@/components/health/ProgressTracker';
import WeeklySummary from '@/components/WeeklySummary';
import MealMoodTracker from '@/components/MealMoodTracker';
import DashboardGreeting from '@/components/DashboardGreeting';
import MealRecommendations from '@/components/MealRecommendations';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import PointsTransactionsPage from './PointsTransactionsPage';
import { useScreenSize } from '@/utils/mobile';
import { LayoutDashboard, Apple, Calendar, Smile, Award } from 'lucide-react';

const DashboardPage = () => {
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const { isMobile } = useScreenSize();
  const t = language === 'fr'
    ? { tabs: { dashboard: "Tableau de Bord", nutrition: "Nutrition", summary: "Résumé", mood: "Humeur", points: "Historique" } }
    : { tabs: { dashboard: "Dashboard", nutrition: "Nutrition", summary: "Weekly Summary", mood: "Mood Tracker", points: "Points History" } };

  return (
    <PageLayout activePage="dashboard" showChatbot>
      <div className="p-3 sm:p-6 max-w-6xl mx-auto">
        <DashboardGreeting />
        <Tabs defaultValue="dashboard" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4 sm:space-y-6">
          <ScrollableTabsList className="w-full max-w-3xl mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4 text-yellow-500 fill-yellow-300" />{!isMobile && t.tabs.dashboard}</TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2"><Apple className="h-4 w-4 text-red-500 fill-red-300" />{!isMobile && t.tabs.nutrition}</TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500 fill-blue-200" />{!isMobile && t.tabs.summary}</TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2"><Smile className="h-4 w-4 text-orange-500 fill-yellow-300" />{!isMobile && t.tabs.mood}</TabsTrigger>
            <TabsTrigger value="points" className="flex items-center gap-2"><Award className="h-4 w-4 text-indigo-600 fill-indigo-300" />{!isMobile && t.tabs.points}</TabsTrigger>
          </ScrollableTabsList>
          <TabsContent value="dashboard" className="space-y-6">
            <ProgressTracker />
            <MealRecommendations />
            <BMICalculator />
          </TabsContent>
          <TabsContent value="nutrition"><NutritionDashboard /></TabsContent>
          <TabsContent value="summary"><WeeklySummary /></TabsContent>
          <TabsContent value="mood"><MealMoodTracker /></TabsContent>
          <TabsContent value="points"><PointsTransactionsPage /></TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
