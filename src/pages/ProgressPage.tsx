
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import RewardSystem from '@/components/RewardSystem';
import BMICalculator from '@/components/health/BMICalculator';
import ProgressTracker from '@/components/health/ProgressTracker';
import CalorieTracker from '@/components/health/CalorieTracker';
import SleepTracker from '@/components/health/SleepTracker';
import ExerciseTracker from '@/components/health/ExerciseTracker';
import HydrationInput from '@/components/health/HydrationInput';
import { BarChart, TrendingUp, Trophy, History, ChevronLeft, PlusCircle, Edit } from 'lucide-react';
import ChallengeCreator from '@/components/ChallengeCreator';
import { useScreenSize } from '@/utils/mobile';

const ProgressPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { isMobile, isTablet } = useScreenSize();
  
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
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      <ProfileSidebar activePage="progress" />
      
      <div className={`flex-1 p-3 sm:p-4 ${isMobile ? 'mt-14' : isTablet ? 'sm:ml-16' : 'sm:ml-64'}`}>
        <div className="p-2 sm:p-4 max-w-6xl mx-auto">
          <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{t.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{t.subtitle}</p>
            </div>
            <Button 
              variant="default"
              className="flex items-center text-sm" 
              onClick={handleAddProgress}
            >
              {activeTab === "trackers" ? (
                <Edit className="h-3.5 w-3.5 mr-1" />
              ) : (
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
              )}
              <span className="hidden sm:inline">{activeTab === "trackers" ? t.editProgress : t.addProgress}</span>
              <span className="sm:hidden">
                {activeTab === "trackers" ? "Edit" : "Add"}
              </span>
            </Button>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-5'} text-xs sm:text-sm`}>
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <BarChart className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.overview}</span>
              </TabsTrigger>
              <TabsTrigger value="trackers" className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.trackers}</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.rewards}</span>
              </TabsTrigger>
              {!isMobile && (
                <>
                  <TabsTrigger value="challenges" className="flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t.challenges}</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-1">
                    <History className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t.history}</span>
                  </TabsTrigger>
                </>
              )}
            </TabsList>
            
            {isMobile && (
              <TabsList className="grid w-full grid-cols-2 mt-2 gap-1 text-xs sm:text-sm">
                <TabsTrigger value="challenges" className="flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.challenges}</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-1">
                  <History className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.history}</span>
                </TabsTrigger>
              </TabsList>
            )}
            
            <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <ProgressTracker />
              <BMICalculator />
            </TabsContent>
            
            <TabsContent value="trackers" className="mt-4 sm:mt-6">
              <Card className="mb-4 sm:mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg sm:text-xl">{t.trackers}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{t.trackDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="calories" className="w-full">
                    <TabsList className={`flex w-full ${isMobile ? 'flex-wrap gap-1' : ''} text-xs sm:text-sm`}>
                      <TabsTrigger value="calories" className="flex-1">{t.calories}</TabsTrigger>
                      <TabsTrigger value="sleep" className="flex-1">{t.sleep}</TabsTrigger>
                      <TabsTrigger value="exercise" className="flex-1">{t.exercise}</TabsTrigger>
                      <TabsTrigger value="water" className="flex-1">{t.water}</TabsTrigger>
                      <TabsTrigger value="bmi" className="flex-1">{t.bmiTracker}</TabsTrigger>
                    </TabsList>
                    
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
