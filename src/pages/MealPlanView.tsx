"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getMealPlanDetails, removeMealFromPlan } from "@/services/mealService";
import { getCurrentUser } from "@/services/authService";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { AddMealToMealPlanDialog } from "@/components/AddToMealPlanDialog";

interface DayMeals {
  [mealTime: string]: any[];
}

interface WeekMeals {
  [day: string]: DayMeals;
}

const MealPlanView = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);

        if (!user) {
          toast({
            title: "Authentication Required",
            description: "You must be logged in to view meal plans",
            variant: "destructive",
          });
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["mealPlan", planId],
    queryFn: () => (planId ? getMealPlanDetails(planId) : null),
    enabled: !!planId && isAuthenticated === true,
    retry: 1,
  });

  const [organizedMeals, setOrganizedMeals] = useState<WeekMeals>({});

  useEffect(() => {
    if (data && data.mealPlanItems) {
      const meals: WeekMeals = {};

      // Organize meals by day and meal time
      data.mealPlanItems.forEach((item) => {
        if (!meals[item.day_of_week]) {
          meals[item.day_of_week] = {};
        }

        if (!meals[item.day_of_week][item.meal_time]) {
          meals[item.day_of_week][item.meal_time] = [];
        }

        meals[item.day_of_week][item.meal_time].push(item);
      });

      setOrganizedMeals(meals);
    }
  }, [data]);

  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const mealTimeOrder = ["Breakfast", "Lunch", "Dinner", "Snack"];

  const handleRemoveMeal = async (itemId: string) => {
    try {
      await removeMealFromPlan(itemId);
      queryClient.invalidateQueries({ queryKey: ["mealPlan", planId] });
      toast({
        title: "Success",
        description: "Meal removed from plan",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          "Failed to remove meal from plan: " +
          (error.message || "Unknown error"),
        variant: "destructive",
      });
    }
  };

  const handleMealAdded = () => {
    if (planId) {
      queryClient.invalidateQueries({ queryKey: ["mealPlan", planId] });
    }
  };

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="page-container">
        <ProfileSidebar />
        <div className="content-area">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/meal-planning")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid gap-6">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="border rounded-md p-4">
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="grid gap-4">
                    {[...Array(3)].map((_, j) => (
                      <div
                        key={j}
                        className="h-20 bg-gray-100 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-container">
        <ProfileSidebar />
        <div className="content-area">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/meal-planning")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Error</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>Failed to load meal plan. Please try again later.</p>
              <Button
                variant="default"
                className="mt-4"
                onClick={() => navigate("/meal-planning")}
              >
                Back to Meal Planning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ProfileSidebar />
      <div className="content-area">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/meal-planning")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{data?.mealPlan.name}</h1>
          </div>

          <Button variant="outline" onClick={() => navigate("/meal-planning")}>
            Back to Meal Plans
          </Button>
        </div>

        {data?.mealPlan.description && (
          <p className="text-gray-600 mb-6">{data.mealPlan.description}</p>
        )}

        <div className="space-y-8">
          {dayOrder.map((day) => (
            <Card
              key={day}
              className={!organizedMeals[day] ? "opacity-60" : undefined}
            >
              <CardHeader>
                <CardTitle>{day}</CardTitle>
                {!organizedMeals[day] && (
                  <CardDescription>
                    No meals planned for this day
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {mealTimeOrder.map((mealTime) => (
                    <div key={mealTime} className="space-y-3">
                      <h3 className="font-medium text-gray-900">{mealTime}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {organizedMeals[day]?.[mealTime]?.map((item) => (
                          <div
                            key={item.id}
                            className="border rounded-md overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="h-28 bg-gray-100 relative">
                              {item.meal?.image_url ? (
                                <img
                                  src={
                                    item.meal.image_url || "/placeholder.svg"
                                  }
                                  alt={item.meal.meal_name}
                                  className="w-full h-full object-cover"
                                  onClick={() =>
                                    navigate(`/meals/${item.meal.id}`)
                                  }
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="p-3 flex justify-between items-center dark:text-gray-100">
                              <div>
                                <h4 className="font-medium truncate">
                                  {item.meal.meal_name}
                                </h4>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveMeal(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {planId && (
                          <AddMealToMealPlanDialog
                            planId={planId}
                            dayOfWeek={day}
                            mealTime={mealTime}
                            onMealAdded={handleMealAdded}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlanView;
