"use client";
import { useState, useEffect } from "react";
import { Search, Filter, Plus, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  ScrollableCardContainer,
  ScrollableCardContent,
} from "@/components/ui/card";
import { getFavorites, removeFavorite } from "@/services/favoriteService";
import { useToast } from "@/hooks/use-toast";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ProfileSidebar } from "../components/profile/ProfileSidebar";
import { useNavigate } from "react-router-dom";
import { useScreenSize } from "@/hooks/use-mobile";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useScreenSize();

  useEffect(() => {
    fetchFavorites();
  }, []);

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

  const addToMealPlan = (mealId: string) => {
    navigate(`/meal-planning?addMeal=${mealId}`);
  };

  const viewMealDetails = (mealId: string) => {
    navigate(`/meal/${mealId}`);
  };

  const filteredFavorites = favorites.filter((fav) => {
    const matchesSearch = fav.meal_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || fav.category_name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col md:flex-row">
      <ProfileSidebar activePage="favorites" />
      <div className="flex-1 p-3 sm:p-6 ml-0 md:ml-16 lg:ml-64">
        <div className="container mx-auto py-2 sm:py-4 max-w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">My Favorites</h1>
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
                  className="flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Filter className="h-4 w-4" />
                  <span className={isMobile ? "sr-only" : ""}>Filter</span>
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
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredFavorites.length > 0 ? (
            isMobile || isTablet ? (
              <ScrollableCardContainer className="pb-4">
                <ScrollableCardContent>
                  {filteredFavorites.map((favorite) => (
                    <Card
                      key={favorite.id}
                      className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-200 min-w-[240px] sm:min-w-[280px]"
                    >
                      <div
                        className="relative cursor-pointer"
                        onClick={() => viewMealDetails(favorite.meal_id)}
                      >
                        <img
                          src={favorite.image_url || "/placeholder-meal.jpg"}
                          alt={favorite.meal_name}
                          className="w-full h-36 sm:h-48 object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-meal.jpg";
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <FavoriteButton
                            mealId={favorite.meal_id}
                            favoriteId={favorite.id}
                            className="bg-white/80 backdrop-blur-sm shadow-sm"
                            onToggle={(isFavorited) => {
                              if (!isFavorited) {
                                handleRemoveFavorite(favorite.id);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <CardContent
                        className="p-3 flex-grow cursor-pointer"
                        onClick={() => viewMealDetails(favorite.meal_id)}
                      >
                        <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-1">
                          {favorite.meal_name}
                        </h3>
                        <div className="flex flex-wrap gap-1 mb-2">
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
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {favorite.description || "No description available"}
                        </p>
                      </CardContent>

                      <CardFooter className="p-3 pt-0">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToMealPlan(favorite.meal_id);
                          }}
                          className="w-full text-xs sm:text-sm py-1 sm:py-2 h-auto"
                          size={isMobile ? "sm" : "default"}
                        >
                          <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Add to Meal Plan
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </ScrollableCardContent>
              </ScrollableCardContainer>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredFavorites.map((favorite) => (
                  <Card
                    key={favorite.id}
                    className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-200"
                  >
                    <div
                      className="relative cursor-pointer"
                      onClick={() => viewMealDetails(favorite.meal_id)}
                    >
                      <img
                        src={favorite.image_url || "/placeholder-meal.jpg"}
                        alt={favorite.meal_name}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-meal.jpg";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <FavoriteButton
                          mealId={favorite.meal_id}
                          favoriteId={favorite.id}
                          className="bg-white/80 backdrop-blur-sm shadow-sm"
                          onToggle={(isFavorited) => {
                            if (!isFavorited) {
                              handleRemoveFavorite(favorite.id);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <CardContent
                      className="p-4 flex-grow cursor-pointer"
                      onClick={() => viewMealDetails(favorite.meal_id)}
                    >
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
                        onClick={(e) => {
                          e.stopPropagation();
                          addToMealPlan(favorite.meal_id);
                        }}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Heart className="text-primary h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground px-4">
                Start adding meals to your favorites to see them here.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/meal-planning")}
              >
                Browse Meals
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
