
import type React from "react";
import { useNavigate } from "react-router-dom";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { Button } from "@/components/ui/button";

const MealPlanPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="page-container">
      <ProfileSidebar />
      <div className="content-area">
        <h1 className="text-2xl font-bold mb-6">Meal Plans</h1>
        <p className="text-muted-foreground text-center py-8">Manage your meal plans in the Meal Planning page.</p>
        <div className="text-center">
          <Button onClick={() => navigate("/meal-planning")}>Go to Meal Planning</Button>
        </div>
      </div>
    </div>
  );
};

export default MealPlanPage;
