import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, ChefHat, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealPlanList } from "@/components/MealPlanList";
import { CreateMealPlanDialog } from "@/components/CreateMealPlanDialog";
import MealSearch from "@/components/MealSearch";
import Favorites from "./Favorites";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";

const MealPlanningPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const { language } = useLanguage();
  const t = language === 'fr'
    ? { title: "Planification des Repas", subtitle: "Planifiez vos repas", myMealPlans: "Mes Plans", mealSearch: "Recherche", searchPlaceholder: "Rechercher...", favorites: "Favoris" }
    : { title: "Meal Planning", subtitle: "Plan your meals for the week ahead", myMealPlans: "My Meal Plans", mealSearch: "Meal Search", searchPlaceholder: "Search meal plans...", favorites: "Favorites" };

  useEffect(() => {
    const handler = () => setRefreshKey(k => k + 1);
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <PageLayout activePage="meal planning">
      <div className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center">
            <ChefHat className="h-7 w-7 mr-2 text-primary" />{t.title}
          </h1>
          <p className="text-muted-foreground text-sm">{t.subtitle}</p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="plans" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plans" className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500 fill-blue-200" />{t.myMealPlans}</TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2"><Search className="h-4 w-4 text-green-500" />{t.mealSearch}</TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2"><Heart className="h-4 w-4 text-red-500 fill-red-500" />{t.favorites}</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <CreateMealPlanDialog onMealPlanCreated={() => setRefreshKey(k => k + 1)} />
              </div>
              <MealPlanList key={refreshKey} />
            </TabsContent>

            <TabsContent value="search">
              <MealSearch onSelectMeal={() => {}} />
            </TabsContent>

            <TabsContent value="favorites">
              <Favorites />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default MealPlanningPage;
