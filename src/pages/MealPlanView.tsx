import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

const MealPlanView = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <ProfileSidebar />
      <div className="content-area">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/meal-planning")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Meal Plan</h1>
        </div>
        <p className="text-muted-foreground text-center py-16">Database features removed.</p>
      </div>
    </div>
  );
};

export default MealPlanView;
