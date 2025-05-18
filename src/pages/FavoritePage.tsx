"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus, CheckSquare, Square } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  getFavorites,
  removeFavorite,
  removeMultipleFavorites,
} from "@/services/favoriteService";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence } from "framer-motion";
import { MultiSelectToolbar } from "@/components/favorites/MultiSelectToolbar";
import { Checkbox } from "@/components/ui/checkbox";

interface Meal {
  id: string;
  meal_name: string;
  image_url: string;
  category_name?: string;
  subcategory_name?: string;
  description?: string;
}

interface Favorite {
  id: string;
  meal_id: string;
  created_at: string;
  meal?: Meal;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Toggle selection mode when items are selected
  useEffect(() => {
    if (selectedFavorites.length > 0 && !isSelectionMode) {
      setIsSelectionMode(true);
    } else if (selectedFavorites.length === 0 && isSelectionMode) {
      setIsSelectionMode(false);
    }
  }, [selectedFavorites, isSelectionMode]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavorites();
      setFavorites(data);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map((fav) => fav.category_name).filter(Boolean))
      );
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    const success = await removeFavorite(favoriteId);
    if (success) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
      toast({
        title: "Removed from favorites",
        description: "This meal has been removed from your favorites",
      });
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedFavorites.length === 0) return;

    setIsProcessing(true);
    try {
      const removedCount = await removeMultipleFavorites(selectedFavorites);
      if (removedCount > 0) {
        setFavorites((prev) =>
          prev.filter((fav) => !selectedFavorites.includes(fav.id))
        );
        setSelectedFavorites([]);
      }
    } catch (error) {
      console.error("Error removing favorites:", error);
      toast({
        title: "Error",
        description: "Failed to remove selected favorites",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelectFavorite = (favoriteId: string) => {
    setSelectedFavorites((prev) =>
      prev.includes(favoriteId)
        ? prev.filter((id) => id !== favoriteId)
        : [...prev, favoriteId]
    );
  };

  const selectAllFavorites = () => {
    if (selectedFavorites.length === filteredFavorites.length) {
      // If all are selected, deselect all
      setSelectedFavorites([]);
    } else {
      // Otherwise, select all filtered favorites
      setSelectedFavorites(filteredFavorites.map((fav) => fav.id));
    }
  };

  const clearSelection = () => {
    setSelectedFavorites([]);
  };

  const addToMealPlan = async (mealId: string) => {
    // This would open a modal to select which meal plan to add to
    console.log("Add meal to meal plan:", mealId);
    toast({
      title: "Feature coming soon",
      description: "Adding to meal plan will be available soon",
    });
  };

  const filteredFavorites = favorites.filter((fav) => {
    const matchesSearch = fav.meal_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || fav.category_name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const allSelected =
    filteredFavorites.length > 0 &&
    selectedFavorites.length === filteredFavorites.length;

  return (
    <div className="container mx-auto py-8 px-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">My Favorites</h1>
          {filteredFavorites.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={selectAllFavorites}
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
              placeholder="Search favorites..."
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
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
      ) : filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map((favorite) => (
            <Card
              key={favorite.id}
              className="overflow-hidden h-full flex flex-col relative"
            >
              {/* Selection checkbox overlay */}
              <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={() => toggleSelectFavorite(favorite.id)}
              >
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedFavorites.includes(favorite.id)}
                    className={`h-5 w-5 ${
                      selectedFavorites.includes(favorite.id)
                        ? "bg-primary border-primary"
                        : "bg-white/80 backdrop-blur-sm"
                    }`}
                  />
                </div>
              </div>

              <div className="relative">
                <img
                  src={favorite.image_url || "/placeholder-meal.jpg"}
                  alt={favorite.meal_name}
                  className="w-full h-48 object-cover"
                />
                <div
                  className="absolute top-2 right-2 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FavoriteButton
                    mealId={favorite.meal_id}
                    favoriteId={favorite.id}
                    className="bg-white/80 backdrop-blur-sm shadow-sm"
                    onToggle={(isFavorited) => {
                      if (!isFavorited) {
                        setFavorites((prev) =>
                          prev.filter((fav) => fav.id !== favorite.id)
                        );
                        setSelectedFavorites((prev) =>
                          prev.filter((id) => id !== favorite.id)
                        );
                      }
                    }}
                  />
                </div>
              </div>

              <CardContent className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">
                  {favorite.meal_name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {favorite.category_name && (
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                      {favorite.category_name}
                    </span>
                  )}
                  {favorite.subcategory_name && (
                    <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-xs">
                      {favorite.subcategory_name}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {favorite.description || "No description available"}
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => addToMealPlan(favorite.meal_id)}
                  className="w-full"
                  disabled={isSelectionMode}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Meal Plan
                </Button>
              </CardFooter>
            </Card>
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
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground">
            Start adding meals to your favorites to see them here.
          </p>
        </div>
      )}

      {/* Multi-select toolbar */}
      <AnimatePresence>
        {selectedFavorites.length > 0 && (
          <MultiSelectToolbar
            selectedCount={selectedFavorites.length}
            onClearSelection={clearSelection}
            onRemoveSelected={handleRemoveSelected}
            isProcessing={isProcessing}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
