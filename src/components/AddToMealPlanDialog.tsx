"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Meal } from "@/services/mealService";

interface AddMealToMealPlanDialogProps {
  planId: string;
  dayOfWeek: string;
  mealTime: string;
  onMealAdded: () => void;
}

export function AddMealToMealPlanDialog({
  planId,
  dayOfWeek,
  mealTime,
  onMealAdded,
}: AddMealToMealPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [selectedMealId, setSelectedMealId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch meals and categories when dialog opens
  useEffect(() => {
    if (open) {
      fetchMeals();
      fetchCategories();
    }
  }, [open]);

  // Filter meals based on search query and category
  useEffect(() => {
    let filtered = [...meals];

    if (searchQuery) {
      filtered = filtered.filter((meal) =>
        meal.meal_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((meal) => meal.category_id === categoryFilter);
    }

    setFilteredMeals(filtered);
  }, [meals, searchQuery, categoryFilter]);

  const fetchMeals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("meals")
        .select(
          `
          id,
          meal_name,
          image_url,
          category_id,
          subcategory_id,
          meal_categories (name),
          meal_subcategories (name)
        `
        )
        .order("meal_name");

      if (error) throw error;

      if (data) {
        const formattedMeals = data.map((meal) => ({
          ...meal,
          category_name: meal.meal_categories?.name,
          subcategory_name: meal.meal_subcategories?.name,
        }));
        setMeals(formattedMeals);
        setFilteredMeals(formattedMeals);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load meals: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("meal_categories")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load categories: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddMeal = async () => {
    if (!selectedMealId) {
      toast({
        title: "Selection Required",
        description: "Please select a meal to add",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add meals to your plan",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("meal_plan_items")
        .insert({
          meal_plan_id: planId,
          meal_id: selectedMealId,
          day_of_week: dayOfWeek,
          meal_time: mealTime,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meal added to your plan",
      });

      setOpen(false);
      setSelectedMealId("");
      onMealAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add meal to plan: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="add-meal">
          <Plus size={16} className="mr-2" />
          <span>Add Meal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Add Meal to {dayOfWeek} - {mealTime}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search meals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="max-h-[300px] overflow-y-auto border rounded-md">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredMeals.length > 0 ? (
              <div className="grid gap-2 p-2">
                {filteredMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      selectedMealId === meal.id
                        ? "bg-gray-100 border border-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedMealId(meal.id)}
                  >
                    <div className="h-12 w-12 mr-3 bg-gray-200 rounded overflow-hidden">
                      {meal.image_url ? (
                        <img
                          src={meal.image_url || "/placeholder.jpg"}
                          alt={meal.meal_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{meal.meal_name}</h4>
                      <div className="text-xs text-gray-500">
                        {meal.category_name}{" "}
                        {meal.subcategory_name
                          ? `• ${meal.subcategory_name}`
                          : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No meals found. Try adjusting your search or filter.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMeal}
            disabled={isSubmitting || !selectedMealId}
          >
            {isSubmitting ? "Adding..." : "Add to Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
