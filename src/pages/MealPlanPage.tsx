import type React from "react";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

const MealPlanPage: React.FC = () => {
  return (
    <div className="page-container">
      <ProfileSidebar />
      <div className="content-area">
        <h1 className="text-2xl font-bold mb-6">Meal Plans</h1>
        <p className="text-muted-foreground text-center py-16">Database features removed.</p>
      </div>
    </div>
  );
};

export default MealPlanPage;
