"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CreateMealPlanDialog } from "@/components/CreateMealPlanDialog";
import { AddMealToMealPlanDialog } from "@/components/AddToMealPlanDialog";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { useToast } from "@/hooks/use-toast";
import "./MealPlanPage.css";

interface MealPlan {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface MealPlanItem {
  id: string;
  meal_plan_id: string;
  meal_id: string;
  day_of_week: string;
  meal_time: string;
  meal: {
    id: string;
    meal_name: string;
    image_url: string;
  };
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MEAL_TIMES = ["Breakfast", "Lunch", "Dinner", "Snack"];

const MealPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [mealPlanItems, setMealPlanItems] = useState<MealPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchMealPlans();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      fetchMealPlanItems(selectedPlan);
    }
  }, [selectedPlan]);

  const fetchMealPlans = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your meal plans",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("meal_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setMealPlans(data);
        setSelectedPlan(data[0].id);
      } else {
        setMealPlans([]);
        setSelectedPlan(null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load meal plans: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMealPlanItems = async (planId: string) => {
    try {
      const { data, error } = await supabase
        .from("meal_plan_items")
        .select(
          `
          id,
          meal_plan_id,
          meal_id,
          day_of_week,
          meal_time,
          meal:meals (
            id,
            meal_name,
            image_url
          )
        `
        )
        .eq("meal_plan_id", planId);

      if (error) throw error;

      setMealPlanItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load meal plan items: " + error.message,
        variant: "destructive",
      });
    }
  };

  const startEditingPlan = (plan: MealPlan) => {
    setEditingPlan(plan);
    setEditName(plan.name);
    setEditDescription(plan.description || "");
  };

  const cancelEditingPlan = () => {
    setEditingPlan(null);
    setEditName("");
    setEditDescription("");
  };

  const savePlanEdits = async () => {
    if (!editingPlan || !editName.trim()) return;

    try {
      const { error } = await supabase
        .from("meal_plans")
        .update({
          name: editName,
          description: editDescription,
        })
        .eq("id", editingPlan.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meal plan updated successfully",
      });

      // Update local state
      setMealPlans((prev) =>
        prev.map((plan) =>
          plan.id === editingPlan.id
            ? { ...plan, name: editName, description: editDescription }
            : plan
        )
      );

      cancelEditingPlan();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update meal plan: " + error.message,
        variant: "destructive",
      });
    }
  };

  const deleteMealPlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this meal plan?")) return;

    try {
      // First delete all meal plan items
      const { error: itemsError } = await supabase
        .from("meal_plan_items")
        .delete()
        .eq("meal_plan_id", planId);

      if (itemsError) throw itemsError;

      // Then delete the meal plan
      const { error } = await supabase
        .from("meal_plans")
        .delete()
        .eq("id", planId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meal plan deleted successfully",
      });

      setMealPlans((prev) => prev.filter((plan) => plan.id !== planId));

      if (selectedPlan === planId) {
        const remainingPlans = mealPlans.filter((plan) => plan.id !== planId);
        setSelectedPlan(
          remainingPlans.length > 0 ? remainingPlans[0].id : null
        );
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete meal plan: " + error.message,
        variant: "destructive",
      });
    }
  };

  const removeMealFromPlan = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("meal_plan_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meal removed from plan",
      });

      setMealPlanItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove meal from plan: " + error.message,
        variant: "destructive",
      });
    }
  };

  const getMealsForDayAndTime = (day: string, time: string) => {
    return mealPlanItems.filter(
      (item) => item.day_of_week === day && item.meal_time === time
    );
  };

  // const handleViewPlanDetails = () => {
  //   if (selectedPlan) {
  //     navigate(`/meal-plan-id/${selectedPlan}`);
  //   } else {
  //     toast({
  //       title: "No plan selected",
  //       description: "Please select a meal plan to view details",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleMealPlanCreated = () => {
    fetchMealPlans();
  };

  const handleMealAdded = () => {
    if (selectedPlan) {
      fetchMealPlanItems(selectedPlan);
    }
  };

  const navigateToPreviousPlan = () => {
    if (!selectedPlan || mealPlans.length <= 1) return;

    const currentIndex = mealPlans.findIndex(
      (plan) => plan.id === selectedPlan
    );
    if (currentIndex > 0) {
      setSelectedPlan(mealPlans[currentIndex - 1].id);
    }
  };

  const navigateToNextPlan = () => {
    if (!selectedPlan || mealPlans.length <= 1) return;

    const currentIndex = mealPlans.findIndex(
      (plan) => plan.id === selectedPlan
    );
    if (currentIndex < mealPlans.length - 1) {
      setSelectedPlan(mealPlans[currentIndex + 1].id);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <ProfileSidebar />
        <div className="content-area">
          <p>Loading meal plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ProfileSidebar />
      <div className="content-area">
        <div className="meal-plan-page">
          <div className="page-header">
            <h1>Meal Plans</h1>
            <div className="header-actions">
              {/* {selectedPlan && (
                // <button
                //   className="view-details-button"
                //   onClick={handleViewPlanDetails}
                // >
                //   <Eye size={16} className="mr-1" />
                //   View Details
                // </button>
              )} */}
              <CreateMealPlanDialog onMealPlanCreated={handleMealPlanCreated} />
            </div>
          </div>

          {editingPlan && (
            <div className="edit-plan-form text-gray-700 dark:text-gray-100">
              <h2>Edit Meal Plan</h2>
              <div className="form-group">
                <label htmlFor="edit-plan-name">Plan Name</label>
                <input
                  id="edit-plan-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Plan name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-plan-description">
                  Description (Optional)
                </label>
                <textarea
                  id="edit-plan-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Plan description"
                />
              </div>
              <div className="form-actions">
                <button className="cancel-button" onClick={cancelEditingPlan}>
                  Cancel
                </button>
                <button
                  className="save-button"
                  onClick={savePlanEdits}
                  disabled={!editName.trim()}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {mealPlans.length > 0 ? (
            <div className="meal-plan-content">
              <div className="plan-selector">
                <button
                  className="nav-button"
                  onClick={navigateToPreviousPlan}
                  disabled={
                    mealPlans.findIndex((plan) => plan.id === selectedPlan) <= 0
                  }
                >
                  <ChevronLeft size={18} />
                </button>
                <select
                  value={selectedPlan || ""}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  {mealPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                <button
                  className="nav-button"
                  onClick={navigateToNextPlan}
                  disabled={
                    mealPlans.findIndex((plan) => plan.id === selectedPlan) >=
                    mealPlans.length - 1
                  }
                >
                  <ChevronRight size={18} />
                </button>
                <div className="plan-actions">
                  <button
                    className="edit-button"
                    onClick={() => {
                      const plan = mealPlans.find((p) => p.id === selectedPlan);
                      if (plan) startEditingPlan(plan);
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => selectedPlan && deleteMealPlan(selectedPlan)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="meal-plan-grid text-gray-700 dark:text-gray-100">
                <div className="meal-times-header">
                  <div className="empty-cell"></div>
                  {MEAL_TIMES.map((time) => (
                    <div key={time} className="meal-time-cell">
                      {time}
                    </div>
                  ))}
                </div>

                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="day-row">
                    <div className="day-cell">{day}</div>
                    {MEAL_TIMES.map((time) => (
                      <div key={`${day}-${time}`} className="meal-cell">
                        {getMealsForDayAndTime(day, time).map((item) => (
                          <div key={item.id} className="meal-item">
                            <img
                              src={
                                item.meal?.image_url || "/placeholder-meal.jpg"
                              }
                              alt={item.meal?.meal_name}
                              // onClick={() => navigate(`/meals/${item.meal.id}`)}
                            />
                            <div className="meal-item-content">
                              <span className="meal-name">
                                {item.meal?.meal_name}
                              </span>
                              <button
                                className="remove-meal"
                                onClick={() => removeMealFromPlan(item.id)}
                                aria-label="Remove meal"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {selectedPlan && (
                          <AddMealToMealPlanDialog
                            planId={selectedPlan}
                            dayOfWeek={day}
                            mealTime={time}
                            onMealAdded={handleMealAdded}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-meal-plans">
              <Calendar size={48} />
              <h2>No meal plans yet</h2>
              <p>Create your first meal plan to get started.</p>
              <CreateMealPlanDialog onMealPlanCreated={handleMealPlanCreated} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanPage;
