
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import RewardSystem from '@/components/RewardSystem';
import BMICalculator from '@/components/health/BMICalculator';
import ProgressTracker from '@/components/health/ProgressTracker';
import CalorieTracker from '@/components/health/CalorieTracker';
import SleepTracker from '@/components/health/SleepTracker';
import ExerciseTracker from '@/components/health/ExerciseTracker';
import HydrationInput from '@/components/health/HydrationInput';
import { BarChart, TrendingUp, Trophy, History, ChevronLeft, PlusCircle, Edit, Gift, Droplet, Moon, Flame, Scale, Dumbbell, } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChallengeCreator from '@/components/ChallengeCreator';
import { useScreenSize } from '@/utils/mobile';

const ProgressPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { isMobile, isTablet } = useScreenSize();
  const isSmallScreen = isMobile || isTablet;
  
  const translations = {
    en: {
      title: "Progress & Goals",
      overview: "Overview",
      trackers: "Track Data",
      rewards: "Rewards",
      challenges: "Challenges",
      history: "History",
      bmi: "BMI History",
      subtitle: "Track your health journey",
      calories: "Calories",
      sleep: "Sleep",
      exercise: "Exercise",
      water: "Water Intake",
      bmiTracker: "BMI",
      trackDescription: "Enter your health data to see it reflected in your charts and progress tracking",
      addProgress: "Add Progress",
      editProgress: "Edit Progress",
      backToDashboard: "Back to Dashboard"
    },
    fr: {
      title: "Progrès & Objectifs",
      overview: "Vue d'ensemble",
      trackers: "Saisir données",
      rewards: "Récompenses",
      challenges: "Défis",
      history: "Historique", 
      bmi: "Historique IMC",
      subtitle: "Suivez votre parcours santé",
      calories: "Calories",
      sleep: "Sommeil",
      exercise: "Exercice",
      water: "Hydratation",
      bmiTracker: "IMC",
      trackDescription: "Saisissez vos données de santé pour les voir reflétées dans vos graphiques et suivi de progrès",
      addProgress: "Ajouter des données",
      editProgress: "Modifier les données",
      backToDashboard: "Retour au Tableau de Bord"
    }
  };
  
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const handleAddProgress = () => {
    setActiveTab("trackers");
  };
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <ProfileSidebar activePage="progress" />
      
      <div className="flex-1 p-3 sm:p-4 sm:ml-64">
        <div className="p-3 sm:p-4 max-w-6xl mx-auto">
          <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{t.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{t.subtitle}</p>
            </div>
            <div>
              <Button 
                variant="default"
                className="flex items-center" 
                onClick={handleAddProgress}
                size={isSmallScreen ? "icon" : "default"}
              >
                {activeTab === "trackers" ? (
                  <Edit className="h-4 w-4" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
                {!isSmallScreen && (
                  <span className="ml-1">
                    {activeTab === "trackers" ? t.editProgress : t.addProgress}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ScrollableTabsList className="w-full">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                {!isSmallScreen && <span>{t.overview}</span>}
              </TabsTrigger>
              <TabsTrigger value="trackers" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {!isSmallScreen && <span>{t.trackers}</span>}
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-1">
                <Gift className="h-4 w-4" />
                {!isSmallScreen && <span>{t.rewards}</span>}
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                {!isSmallScreen && <span>{t.challenges}</span>}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <History className="h-4 w-4" />
                {!isSmallScreen && <span>{t.history}</span>}
              </TabsTrigger>
            </ScrollableTabsList>
            
            <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <ProgressTracker />
              <BMICalculator />
            </TabsContent>
            
            <TabsContent value="trackers" className="mt-4 sm:mt-6">
              <Card className="mb-4 sm:mb-6">
                <CardHeader className="p-4">
                  <CardTitle>{t.trackers}</CardTitle>
                  <CardDescription className="text-sm">{t.trackDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="calories" className="w-full">
                    <ScrollableTabsList className="flex w-full">
                      <TabsTrigger value="calories" className="flex-1">
                        <Flame className="h-4 w-4" />
                        {isSmallScreen ? "" : t.calories}
                      </TabsTrigger>
                      <TabsTrigger value="sleep" className="flex-1">
                        <Moon className="h-4 w-4" />
                        {isSmallScreen ? "" : t.sleep}
                      </TabsTrigger>
                      <TabsTrigger value="exercise" className="flex-1">
                        <Dumbbell className="h-4 w-4" />
                        {isSmallScreen ? "" : t.exercise}
                      </TabsTrigger>
                      <TabsTrigger value="water" className="flex-1">
                        <Droplet className="h-4 w-4" />
                        {isSmallScreen ? "" : t.water}
                      </TabsTrigger>
                      <TabsTrigger value="bmi" className="flex-1">
                        <Scale className="h-4 w-4" />
                        {isSmallScreen ? "" : t.bmiTracker}
                      </TabsTrigger>
                    </ScrollableTabsList>
                    
                    <div className="my-4 sm:my-6">
                      <TabsContent value="calories">
                        <CalorieTracker />
                      </TabsContent>
                      
                      <TabsContent value="sleep">
                        <SleepTracker />
                      </TabsContent>
                      
                      <TabsContent value="exercise">
                        <ExerciseTracker />
                      </TabsContent>
                      
                      <TabsContent value="water">
                        <HydrationInput />
                      </TabsContent>
                      
                      <TabsContent value="bmi">
                        <BMICalculator />
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rewards" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.rewards}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RewardSystem />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="challenges" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.challenges}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChallengeCreator />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.history}</CardTitle>
                </CardHeader>
                <CardContent>
                  <BMICalculator />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
