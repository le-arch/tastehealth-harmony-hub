import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const NutritionChallenge = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <Trophy className="mr-2 h-5 w-5 text-amber-500" />
          Nutrition Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">Database features removed.</p>
      </CardContent>
    </Card>
  );
};

export default NutritionChallenge;
