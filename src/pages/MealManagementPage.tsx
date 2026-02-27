
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MealManagementPage() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate("/meal-planning")}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold">Meal Management</h1>
      </div>
      <p className="text-muted-foreground text-center py-8">Use the Meal Planning page to manage your meals and plans.</p>
      <div className="text-center">
        <Button onClick={() => navigate("/meal-planning")}>Go to Meal Planning</Button>
      </div>
    </div>
  );
}
