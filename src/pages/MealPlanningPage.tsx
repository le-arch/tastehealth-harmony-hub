import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChefHat, Heart, Calendar, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MealSearch from "@/components/MealSearch";
import Favorites from "./Favorites";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import { Link } from "react-router-dom";
import { CreateMealPlanDialog } from "@/components/CreateMealPlanDialog";
import { MealPlanList } from "@/components/MealPlanList";

const MealPlanningPage = () => {
  const { language } = useLanguage();
  const [refreshKey, setRefreshKey] = useState(0);
  const t = language === 'fr'
    ? { title: "Planification des Repas", subtitle: "Recherchez des repas, gérez vos favoris et planifiez votre semaine", mealSearch: "Recherche", favorites: "Favoris", timetable: "Emploi du Temps", openPlans: "Voir mes plans" }
    : { title: "Meal Planning", subtitle: "Search meals, manage favorites and plan your week", mealSearch: "Meal Search", favorites: "Favorites", timetable: "Meal Timetable", openPlans: "View my plans" };

  return (
    <PageLayout activePage="meal planning">
      <div className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center">
            <ChefHat className="h-7 w-7 mr-2 text-primary" />{t.title}
          </h1>
          <p className="text-muted-foreground text-sm">{t.subtitle}</p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-4">
          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search" className="flex items-center gap-2"><Search className="h-4 w-4 text-green-500" />{t.mealSearch}</TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2"><Heart className="h-4 w-4 text-red-500 fill-red-500" />{t.favorites}</TabsTrigger>
              <TabsTrigger value="timetable" className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500" />{t.timetable}</TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <MealSearch onSelectMeal={() => {}} />
            </TabsContent>

            <TabsContent value="favorites">
              <Favorites />
            </TabsContent>

            <TabsContent value="timetable" className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Link to="/meal-plans">
                  <Button variant="outline" className="gap-2"><ListChecks className="h-4 w-4" />{t.openPlans}</Button>
                </Link>
                <CreateMealPlanDialog onMealPlanCreated={() => setRefreshKey(k => k + 1)} />
              </div>
              <MealPlanList key={refreshKey} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default MealPlanningPage;
