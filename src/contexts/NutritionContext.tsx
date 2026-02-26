
import React, { createContext, useContext, useState } from "react";

export interface Ingredient {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  color: string;
}

export interface Meal {
  id: string;
  name: string;
  ingredients: Ingredient[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  imageUrl?: string;
  isFavorite: boolean;
}

export interface NutritionGoal {
  dailyCalories: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatsPercentage: number;
}

interface NutritionContextType {
  meals: Meal[];
  favoriteMeals: Meal[];
  ingredients: Ingredient[];
  nutritionGoal: NutritionGoal;
  loading: boolean;
  addMealToFavorites: (meal: Meal) => Promise<void>;
  removeMealFromFavorites: (mealId: string) => Promise<void>;
  saveNutritionGoal: (goal: NutritionGoal) => Promise<void>;
  createMeal: (meal: Omit<Meal, 'id'>) => Promise<void>;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);
  const [ingredients] = useState<Ingredient[]>([]);
  const [nutritionGoal, setNutritionGoal] = useState<NutritionGoal>({
    dailyCalories: 2000,
    proteinPercentage: 30,
    carbsPercentage: 40,
    fatsPercentage: 30
  });

  const addMealToFavorites = async (meal: Meal) => {
    setFavoriteMeals([...favoriteMeals, { ...meal, isFavorite: true }]);
  };

  const removeMealFromFavorites = async (mealId: string) => {
    setFavoriteMeals(favoriteMeals.filter(meal => meal.id !== mealId));
  };

  const saveNutritionGoal = async (goal: NutritionGoal) => {
    setNutritionGoal(goal);
  };

  const createMeal = async (meal: Omit<Meal, 'id'>) => {
    const newMeal = { ...meal, id: crypto.randomUUID() };
    setMeals([...meals, newMeal]);
  };

  return (
    <NutritionContext.Provider 
      value={{ 
        meals, favoriteMeals, ingredients, nutritionGoal, loading: false,
        addMealToFavorites, removeMealFromFavorites, saveNutritionGoal, createMeal
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = (): NutritionContextType => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error("useNutrition must be used within a NutritionProvider");
  }
  return context;
};
