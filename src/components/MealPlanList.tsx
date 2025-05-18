
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays } from 'lucide-react';

export interface MealPlan {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export function MealPlanList() {
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
  });

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
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No meal plans</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new meal plan.</p>
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
                Created {new Date(plan.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
