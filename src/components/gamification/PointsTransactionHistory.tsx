
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Coins } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLS, LS_KEYS, PointsTransaction } from "@/utils/localStorage";

interface PointsTransactionHistoryProps { userId: string; limit?: number; }

const PointsTransactionHistory = ({ userId, limit = 20 }: PointsTransactionHistoryProps) => {
  const { language } = useLanguage();
  const transactions = getLS<PointsTransaction[]>(LS_KEYS.POINTS_HISTORY, []).slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          {language === 'fr' ? "Historique des Points" : "Points History"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Coins className="h-12 w-12 mx-auto text-muted-foreground/30 mb-2" />
            <p>{language === 'fr' ? "Aucune transaction de points encore" : "No point transactions yet. Earn points by completing quests and claiming rewards!"}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map(t => (
              <div key={t.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">{t.reason}</span>
                  <span className="text-xs text-muted-foreground ml-2">{new Date(t.date).toLocaleDateString()}</span>
                </div>
                <span className="font-bold text-green-600">+{t.points}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsTransactionHistory;
