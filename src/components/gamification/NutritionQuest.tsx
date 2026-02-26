
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NutritionQuestProps {
  userId?: string;
  addPoints?: (points: number, reason: string) => void;
}

const NutritionQuest = ({ userId, addPoints }: NutritionQuestProps) => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-purple-500" />
          {language === 'fr' ? "Quêtes Nutritionnelles" : "Nutrition Quests"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Compass className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>{language === 'fr' ? "Aucune quête disponible pour le moment." : "No quests available at the moment."}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionQuest;
