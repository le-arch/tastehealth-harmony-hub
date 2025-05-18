
import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Meal type definitions
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

// Supabase client
const supabaseUrl = "https://jyjtphsqtfdqrcsjzzoh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5anRwaHNxdGZkcXJjc2p6em9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNzM1MTcsImV4cCI6MjA1OTk0OTUxN30.7Dn27JSl0nHAvxRi-9ElDlHCnXLfCG_cQ7I5l27uiuM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [nutritionGoal, setNutritionGoal] = useState<NutritionGoal>({
    dailyCalories: 2000,
    proteinPercentage: 30,
    carbsPercentage: 40,
    fatsPercentage: 30
  });
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch ingredients
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('ingredients')
          .select('*');
          
        if (ingredientsError) throw ingredientsError;
        
        // Fetch meals
        const { data: mealsData, error: mealsError } = await supabase
          .from('meals')
          .select('*');
          
        if (mealsError) throw mealsError;
        
        // Fetch favorite meals
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorite_meals')
          .select('*');
          
        if (favoritesError) throw favoritesError;
        
        // Fetch nutrition goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('nutrition_goals')
          .select('*')
          .single();
          
        if (goalsData) {
          setNutritionGoal(goalsData);
        }
        
        // Set state
        setIngredients(ingredientsData || []);
        setMeals(mealsData || []);
        setFavoriteMeals(favoritesData || []);
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Add meal to favorites
  const addMealToFavorites = async (meal: Meal) => {
    try {
      const { error } = await supabase
        .from('favorite_meals')
        .insert({ 
          id: meal.id,
          name: meal.name,
          ingredients: meal.ingredients,
          totalCalories: meal.totalCalories,
          totalProtein: meal.totalProtein,
          totalCarbs: meal.totalCarbs,
          totalFats: meal.totalFats,
          imageUrl: meal.imageUrl,
          isFavorite: true
        });
        
      if (error) throw error;
      
      setFavoriteMeals([...favoriteMeals, {...meal, isFavorite: true}]);
    } catch (error) {
      console.error('Error adding meal to favorites:', error);
    }
  };

  // Remove meal from favorites
  const removeMealFromFavorites = async (mealId: string) => {
    try {
      const { error } = await supabase
        .from('favorite_meals')
        .delete()
        .eq('id', mealId);
        
      if (error) throw error;
      
      setFavoriteMeals(favoriteMeals.filter(meal => meal.id !== mealId));
    } catch (error) {
      console.error('Error removing meal from favorites:', error);
    }
  };

  // Save nutrition goal
  const saveNutritionGoal = async (goal: NutritionGoal) => {
    try {
      const { error } = await supabase
        .from('nutrition_goals')
        .upsert(goal);
        
      if (error) throw error;
      
      setNutritionGoal(goal);
    } catch (error) {
      console.error('Error saving nutrition goal:', error);
    }
  };

  // Create meal
  const createMeal = async (meal: Omit<Meal, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .insert(meal)
        .select()
        .single();
        
      if (error) throw error;
      
      setMeals([...meals, data]);
    } catch (error) {
      console.error('Error creating meal:', error);
    }
  };

  return (
    <NutritionContext.Provider 
      value={{ 
        meals, 
        favoriteMeals, 
        ingredients, 
        nutritionGoal, 
        loading,
        addMealToFavorites,
        removeMealFromFavorites,
        saveNutritionGoal,
        createMeal
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
