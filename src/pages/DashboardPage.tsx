
import React from 'react';
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
import { useLanguage } from '@/contexts/LanguageContext';
import ChallengeCreator from '../components/ChallengeCreator';
import { useScreenSize } from '@/utils/mobile';
import { LayoutDashboard, Award, Calendar, Smile, Trophy } from 'lucide-react';
import { useState } from 'react';

const DashboardPage = () => {
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const { isMobile } = useScreenSize();
  const t = language === 'fr'
    ? { title: "Tableau de Bord Santé", subtitle: "Suivez vos indicateurs", tabs: { dashboard: "Tableau de Bord", rewards: "Récompenses", summary: "Résumé", mood: "Humeur", challenges: "Défis" } }
    : { title: "Health Dashboard", subtitle: "Track your nutrition and health metrics", tabs: { dashboard: "Dashboard", rewards: "Rewards", summary: "Weekly Summary", mood: "Mood Tracker", challenges: "Challenges" } };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <ProfileSidebar activePage="dashboard" />
      <div className={`flex-1 p-3 sm:p-4 ${isMobile ? 'mt-16' : 'md:ml-64'}`}>
        <div className="p-2 sm:p-4 max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">{t.title}</h1>
          <p className="text-muted-foreground mb-4 sm:mb-6">{t.subtitle}</p>
          <Tabs defaultValue="dashboard" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4 sm:space-y-6">
            <ScrollableTabsList className="w-full max-w-3xl mx-auto">
              <TabsTrigger value="dashboard" className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" />{!isMobile && t.tabs.dashboard}</TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2"><Trophy className="h-4 w-4" />{!isMobile && t.tabs.rewards}</TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2"><Calendar className="h-4 w-4" />{!isMobile && t.tabs.summary}</TabsTrigger>
              <TabsTrigger value="mood" className="flex items-center gap-2"><Smile className="h-4 w-4" />{!isMobile && t.tabs.mood}</TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-2"><Award className="h-4 w-4" />{!isMobile && t.tabs.challenges}</TabsTrigger>
            </ScrollableTabsList>
            <TabsContent value="dashboard" className="space-y-6 sm:space-y-8"><div className="grid grid-cols-1 gap-4 sm:gap-6"><ProgressTracker /><BMICalculator /><NutritionDashboard /></div></TabsContent>
            <TabsContent value="rewards"><RewardsSystem /></TabsContent>
            <TabsContent value="summary"><WeeklySummary /></TabsContent>
            <TabsContent value="mood"><MealMoodTracker /></TabsContent>
            <TabsContent value="challenges"><ChallengeCreator /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
