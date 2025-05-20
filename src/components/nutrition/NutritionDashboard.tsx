import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import MealPrepTimer from "./MealPrepTimer";
import HydrationTracker from "./HydrationTracker";
import NutritionProgressWheel from "./NutritionProgressWheel";
import { ChefHat, LayoutDashboard, Award, Pencil } from "lucide-react";
import { useScreenSize } from "@/utils/mobile";

const NutritionDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { isMobile, isTablet } = useScreenSize();

  const translations = {
    en: {
      dashboard: "Nutrition Dashboard",
      dailyProgress: "Daily Tools",
      summary: "Progress Summary",
      achievements: "Achievements",
    },
    fr: {
      dashboard: "Tableau de Bord Nutritionnel",
      dailyProgress: "Outils Quotidiens",
      summary: "Résumé des Progrès",
      achievements: "Réussites",
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            {t.dashboard}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="space-y-4 sm:space-y-6">
            <ScrollableTabsList>
              <TabsTrigger value="daily" className="flex items-center">
                <ChefHat className="h-4 w-4 mr-2" />
                {isMobile ? "" : t.dailyProgress}
              </TabsTrigger>
              <TabsTrigger value="summary">
                <Pencil className="h-4 w-4 mr-2" />
                {isMobile ? "" : t.summary}
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                {isMobile ? "" : t.achievements}
              </TabsTrigger>
            </ScrollableTabsList>

            <TabsContent value="daily" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <MealPrepTimer />
                <HydrationTracker />
                <NutritionProgressWheel />
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <div className="min-h-[300px] sm:min-h-[400px]">
                {/* Summary content will be implemented later */}
                <p>Progress summary will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="min-h-[300px] sm:min-h-[400px]">
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
