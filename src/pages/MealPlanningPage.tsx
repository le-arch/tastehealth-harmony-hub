
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Calendar, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealPlanList } from "@/components/MealPlanList";
import { CreateMealPlanDialog } from "@/components/CreateMealPlanDialog";
import MealSearch from "@/components/MealSearch";
import { AddToMealPlanDialog } from "@/components/AddToMealPlanDialog";
import { supabase } from "@/lib/SupabaseClient";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlan {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

const MealPlanningPage = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [selectedMealPlanId, setSelectedMealPlanId] = useState<string | null>(
    null
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddToMealPlanDialogOpen, setIsAddToMealPlanDialogOpen] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Meal Planning",
      subtitle: "Plan your meals for the week ahead",
      createMealPlan: "Create Meal Plan",
      searchPlaceholder: "Search meal plans...",
      myMealPlans: "My Meal Plans",
      mealSearch: "Meal Search",
      noMealPlans: "No meal plans found",
      createFirst: "Create your first meal plan to get started",
      searchMeals: "Search for meals to add to your plans",
      selectMeal: "Select a meal to add to your meal plan",
    },
    fr: {
      title: "Planification des Repas",
      subtitle: "Planifiez vos repas pour la semaine à venir",
      createMealPlan: "Créer un Plan de Repas",
      searchPlaceholder: "Rechercher des plans de repas...",
      myMealPlans: "Mes Plans de Repas",
      mealSearch: "Recherche de Repas",
      noMealPlans: "Aucun plan de repas trouvé",
      createFirst: "Créez votre premier plan de repas pour commencer",
      searchMeals: "Recherchez des repas à ajouter à vos plans",
      selectMeal: "Sélectionnez un repas à ajouter à votre plan de repas",
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const initializePage = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          await fetchMealPlans(user.id);
        }
      } catch (error) {
        console.error("Error initializing page:", error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  const fetchMealPlans = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error) {
      console.error("Error fetching meal plans:", error);
    }
  };

  const handleCreateMealPlan = async () => {
    if (userId) {
      await fetchMealPlans(userId);
    }
  };

  const handleSelectMeal = (mealId: string) => {
    setSelectedMealId(mealId);
    setIsAddToMealPlanDialogOpen(true);
  };

  const handleMealPlanSelect = (mealPlanId: string) => {
    setSelectedMealPlanId(mealPlanId);
  };

  const filteredMealPlans = mealPlans.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center">
            <ChefHat className="h-8 w-8 mr-3 text-green-600" />
            {t.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="plans" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="plans" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t.myMealPlans}
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                {t.mealSearch}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t.createMealPlan}
                </Button>
              </div>

              {/* Meal Plans List */}
              {filteredMealPlans.length > 0 ? (
                <MealPlanList />
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {t.noMealPlans}
                    </h3>
                    <p className="text-gray-500 mb-4">{t.createFirst}</p>
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {t.createMealPlan}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="search">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    {t.mealSearch}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MealSearch onSelectMeal={handleSelectMeal} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialogs */}
        <CreateMealPlanDialog
          onMealPlanCreated={handleCreateMealPlan}
        />

        <AddToMealPlanDialog
          open={isAddToMealPlanDialogOpen}
          onOpenChange={setIsAddToMealPlanDialogOpen}
          mealId={selectedMealId}
          mealPlans={mealPlans}
        />
      </div>
    </div>
  );
};

export default MealPlanningPage;
