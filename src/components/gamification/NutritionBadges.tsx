
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NutritionBadgesProps {
  userId?: string;
  addPoints?: (points: number, reason: string) => void;
}

const NutritionBadges = ({ userId, addPoints }: NutritionBadgesProps) => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          {language === 'fr' ? "Badges Nutritionnels" : "Nutrition Badges"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Award className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>Database features have been removed.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionBadges;
