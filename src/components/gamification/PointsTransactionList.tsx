
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { getLS, LS_KEYS, PointsTransaction } from "@/utils/localStorage";

interface PointsTransactionListProps { userId: string; limit?: number; showHeader?: boolean; }

export function PointsTransactionList({ userId, limit = 5, showHeader = true }: PointsTransactionListProps) {
  const transactions = getLS<PointsTransaction[]>(LS_KEYS.POINTS_HISTORY, []).slice(0, limit);

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle>Points History</CardTitle>
          <CardDescription>Your recent points activity</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {transactions.length === 0 ? (
          <div className="h-40 flex items-center justify-center">
            <p className="text-muted-foreground">No transactions yet. Start earning points!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map(t => (
              <div key={t.id} className="flex items-center justify-between p-2 border rounded text-sm">
                <span>{t.reason}</span>
                <span className="font-bold text-green-600">+{t.points}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
