
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import MealPrepTimer from './MealPrepTimer';
import HydrationTracker from './HydrationTracker';
import NutritionProgressWheel from './NutritionProgressWheel';
import { ChefHat, LayoutDashboard, Award } from 'lucide-react';

const NutritionDashboard: React.FC = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      dashboard: "Nutrition Dashboard",
      dailyProgress: "Daily Tools",
      summary: "Progress Summary",
      achievements: "Achievements"
    },
    fr: {
      dashboard: "Tableau de Bord Nutritionnel",
      dailyProgress: "Outils Quotidiens",
      summary: "Résumé des Progrès",
      achievements: "Réussites"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            {t.dashboard}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="space-y-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="daily">
                <ChefHat className="h-4 w-4 mr-2" />
                {t.dailyProgress}
              </TabsTrigger>
              <TabsTrigger value="summary">
                {t.summary}
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Award className="h-4 w-4 mr-2" />
                {t.achievements}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <MealPrepTimer />
                <HydrationTracker />
                <NutritionProgressWheel />
              </div>
            </TabsContent>
            
            <TabsContent value="summary">
              <div className="min-h-[400px]">
                {/* Summary content will be implemented later */}
                <p>Progress summary will appear here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="achievements">
              <div className="min-h-[400px]">
                {/* Achievements content will be implemented later */}
                <p>Achievements will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionDashboard;
