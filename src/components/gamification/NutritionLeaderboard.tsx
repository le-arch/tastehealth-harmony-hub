
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NutritionLeaderboardProps { userId?: string; }

const NutritionLeaderboard = ({ userId }: NutritionLeaderboardProps) => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Trophy className="h-5 w-5 mr-2 text-amber-500" />
          {language === 'fr' ? "Classement Nutritionnel" : "Nutrition Leaderboard"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>Database features have been removed.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionLeaderboard;
