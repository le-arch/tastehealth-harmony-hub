
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays } from 'lucide-react';
import { saveMealPlanCalories } from '@/services/mealPlanCalorieService';
import { useLanguage } from '@/contexts/LanguageContext';

export interface MealPlan {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export function MealPlanList() {
  const { language } = useLanguage();
  const [userId, setUserId] = useState<string | null>(null);

  const translations = {
    en: {
      noMealPlans: "No meal plans",
      getStarted: "Get started by creating a new meal plan.",
      created: "Created"
    },
    fr: {
      noMealPlans: "Aucun plan de repas",
      getStarted: "Commencez par créer un nouveau plan de repas.",
      created: "Créé le"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      }
    };
    getUser();
  }, []);

  const { data: mealPlans, isLoading } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MealPlan[];
    },
    enabled: !!userId,
  });

  useEffect(() => {
    // Update calorie information when meal plans are loaded
    const updateCalorieTracking = async () => {
      if (mealPlans && mealPlans.length > 0 && userId) {
        for (const plan of mealPlans) {
          await saveMealPlanCalories(plan.id, userId);
        }
      }
    };

    updateCalorieTracking();
  }, [mealPlans, userId]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (!mealPlans?.length) {
    return (
      <div className="text-center py-12">
        <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">{t.noMealPlans}</h3>
        <p className="mt-1 text-sm text-gray-500">{t.getStarted}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mealPlans.map((plan) => (
        <div key={plan.id} className="w-full">
          <Card className="hover:shadow-md transition-shadow text-gray-700 dark:text-gray-100">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              {plan.description && (
                <CardDescription>{plan.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {t.created} {new Date(plan.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
