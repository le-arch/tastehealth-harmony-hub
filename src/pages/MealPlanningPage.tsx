
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, ChefHat, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealPlanList } from "@/components/MealPlanList";
import { CreateMealPlanDialog } from "@/components/CreateMealPlanDialog";
import MealSearch from "@/components/MealSearch";
import { useLanguage } from "@/contexts/LanguageContext";
import {ProfileSidebar } from "@/components/profile/ProfileSidebar";

const MealPlanningPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const { language } = useLanguage();
  const t = language === 'fr'
    ? { title: "Planification des Repas", subtitle: "Planifiez vos repas", myMealPlans: "Mes Plans", mealSearch: "Recherche", backToDashboard: "Retour", searchPlaceholder: "Rechercher...", createMealPlan: "Créer" }
    : { title: "Meal Planning", subtitle: "Plan your meals for the week ahead", myMealPlans: "My Meal Plans", mealSearch: "Meal Search", backToDashboard: "Back to Dashboard", searchPlaceholder: "Search meal plans...", createMealPlan: "Create Meal Plan" };

  // Listen for storage changes to refresh meal plan list
  useEffect(() => {
    const handler = () => setRefreshKey(k => k + 1);
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <ProfileSidebar />
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center"><ChefHat className="h-8 w-8 mr-3 text-green-600" />{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </motion.div>
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="plans" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="plans" className="flex items-center gap-2"><Calendar className="h-4 w-4" />{t.myMealPlans}</TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2"><Search className="h-4 w-4" />{t.mealSearch}</TabsTrigger>
            </TabsList>
            <TabsContent value="plans" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder={t.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div>
                <CreateMealPlanDialog onMealPlanCreated={() => setRefreshKey(k => k + 1)} />
              </div>
              <MealPlanList key={refreshKey} />
            </TabsContent>
            <TabsContent value="search">
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" />{t.mealSearch}</CardTitle></CardHeader><CardContent><MealSearch onSelectMeal={() => {}} /></CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MealPlanningPage;
