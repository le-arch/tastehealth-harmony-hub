import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";

const IngredientNutritionVisualizer = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <Leaf className="mr-2 h-5 w-5 text-green-500" />
          Ingredient Nutrition Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">Database features removed.</p>
      </CardContent>
    </Card>
  );
};

export default IngredientNutritionVisualizer;
