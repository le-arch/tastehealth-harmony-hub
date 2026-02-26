
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Coins } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PointsTransactionHistoryProps {
  userId: string;
  limit?: number;
}

const PointsTransactionHistory = ({ userId, limit = 20 }: PointsTransactionHistoryProps) => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          {language === 'fr' ? "Historique des Points" : "Points History"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Coins className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>{language === 'fr' ? "Aucune transaction de points encore" : "No point transactions yet"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsTransactionHistory;
