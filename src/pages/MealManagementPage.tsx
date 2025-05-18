"use client";

import { useState, useEffect } from "react";
import { Search, Filter, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MealCard } from "@/components/MealCard";
import { getMeals } from "@/services/mealService";
import { addMultipleToFavorites } from "@/services/favoriteService";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence } from "framer-motion";
import { MealBatchActions } from "@/components/meals/MealBatchActions";

interface Meal {
  id: string;
  meal_name: string;
  image_url: string;
  description?: string;
  category_name?: string;
  subcategory_name?: string;
}

export default function MealManagementPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMeals();
  }, []);

  // Toggle selection mode when items are selected
  useEffect(() => {
    if (selectedMeals.length > 0 && !isSelectionMode) {
      setIsSelectionMode(true);
    } else if (selectedMeals.length === 0 && isSelectionMode) {
      setIsSelectionMode(false);
    }
  }, [selectedMeals, isSelectionMode]);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const data = await getMeals();
      setMeals(data);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map((meal) => meal.category_name).filter(Boolean))
      );
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast({
        title: "Error",
        description: "Failed to load meals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToMealPlan = (mealId: string) => {
    // This would open a modal to select which meal plan to add to
    console.log("Add meal to meal plan:", mealId);
    toast({
      title: "Feature coming soon",
      description: "Adding to meal plan will be available soon",
    });
  };

  const handleViewDetails = (mealId: string) => {
    // Navigate to meal details page
    console.log("View meal details:", mealId);
    toast({
      title: "Feature coming soon",
      description: "Meal details view will be available soon",
    });
  };

  const toggleSelectMeal = (mealId: string) => {
    setSelectedMeals((prev) =>
      prev.includes(mealId)
        ? prev.filter((id) => id !== mealId)
        : [...prev, mealId]
    );
  };

  const selectAllMeals = () => {
    if (selectedMeals.length === filteredMeals.length) {
      // If all are selected, deselect all
      setSelectedMeals([]);
    } else {
      // Otherwise, select all filtered meals
      setSelectedMeals(filteredMeals.map((meal) => meal.id));
    }
  };

  const clearSelection = () => {
    setSelectedMeals([]);
  };

  const handleAddSelectedToFavorites = async () => {
    if (selectedMeals.length === 0) return;

    setIsProcessing(true);
    try {
      const addedCount = await addMultipleToFavorites(selectedMeals);
      if (addedCount > 0) {
        toast({
          title: "Added to favorites",
          description: `${addedCount} meal${
            addedCount !== 1 ? "s" : ""
          } added to favorites`,
        });
        setSelectedMeals([]);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast({
        title: "Error",
        description: "Failed to add selected meals to favorites",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = meal.meal_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || meal.category_name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const allSelected =
    filteredMeals.length > 0 && selectedMeals.length === filteredMeals.length;

  return (
    <div className="container mx-auto py-8 px-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Meal Management</h1>
          {filteredMeals.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={selectAllMeals}
            >
              {allSelected ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {allSelected ? "Deselect All" : "Select All"}
              </span>
            </Button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      categoryFilter === "all"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setCategoryFilter("all");
                      setShowFilters(false);
                    }}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        categoryFilter === category
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setCategoryFilter(category);
                        setShowFilters(false);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredMeals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onAddToMealPlan={handleAddToMealPlan}
              onViewDetails={handleViewDetails}
              isSelectable={isSelectionMode}
              isSelected={selectedMeals.includes(meal.id)}
              onToggleSelect={toggleSelectMeal}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary h-6 w-6"
            >
              <path d="M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.95 1 4.8a.2.2 0 0 1-.2.2h-.5a.2.2 0 0 1-.2-.2s-.5-.9-1-2.3a7 7 0 0 1 13.95-1.05c0 1.25-.5 4.55-4.25 4.55a1.5 1.5 0 0 0-.35.05L8.8 15.9" />
              <path d="M10.8 9.25v1.5" />
              <path d="M13.8 9.25v1.5" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No meals found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Multi-select toolbar */}
      <AnimatePresence>
        {selectedMeals.length > 0 && (
          <MealBatchActions
            selectedCount={selectedMeals.length}
            onClearSelection={clearSelection}
            onAddToFavorites={handleAddSelectedToFavorites}
            isProcessing={isProcessing}
            selectedMealIds={selectedMeals}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
