import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getMealCategories,
  getMealSubcategories,
  getMeals,
  getMealImagePublicUrl,
} from "@/services/mealService";
import { Search, X } from "lucide-react";
import { supabase } from "@/lib/SupabaseClient";

interface MealSearchProps {
  onSelectMeal: (mealId: string) => void;
}

// Helper to get the public URL for a meal image from Supabase Storage
const getMealImageUrl = (imagePath: string | null) => {
  if (!imagePath) return "";
  const { data } = supabase.storage
    .from("tastehealth-store")
    .getPublicUrl(imagePath);
  return data?.publicUrl || "";
};

const MealSearch = ({ onSelectMeal }: MealSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["mealCategories"],
    queryFn: getMealCategories,
  });

  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["mealSubcategories"],
    queryFn: getMealSubcategories,
  });

  const { data: meals, isLoading: mealsLoading } = useQuery({
    queryKey: ["meals", categoryFilter, subcategoryFilter, searchTerm],
    queryFn: () =>
      getMeals({
        category_id: categoryFilter || undefined,
        subcategory_id: subcategoryFilter || undefined,
        search: searchTerm || undefined,
      }),
  });

  const handleReset = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setSubcategoryFilter("");
  };

  const MealImage = ({ mealId }: { mealId: string }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
      getMealImagePublicUrl(mealId).then(setImageUrl);
    }, [mealId]);

    if (!imageUrl) return null;

    return (
      <img src={imageUrl} alt="Meal" className="w-full h-full object-cover" />
    );
  };
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Find Meals</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="w-full md:w-60">
            {categoriesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="w-full md:w-60">
            {subcategoriesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={subcategoryFilter}
                onValueChange={setSubcategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {subcategories?.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button variant="outline" onClick={handleReset} className="md:w-auto">
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div>
        {mealsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-md" />
            ))}
          </div>
        ) : meals && meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="border rounded-md overflow-hidden hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectMeal(meal.id)}
              >
                <div className="h-48 bg-gray-600 relative">
                  {meal.image_url ? (
                    <MealImage mealId={meal.id} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-700">
                      <MealImage mealId={meal.id} />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2  px-2 py-1 text-xs font-medium rounded">
                    {meal.category_name}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-700 truncate dark:text-gray=700">
                    {meal.meal_name}
                  </h3>
                  {meal.subcategory_name && (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {meal.subcategory_name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No meals found. Try adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealSearch;
