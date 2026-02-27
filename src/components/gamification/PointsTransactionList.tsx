import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";

interface PointsTransactionListProps {
  userId: string;
  limit?: number;
  showHeader?: boolean;
}

export function PointsTransactionList({ userId, limit = 5, showHeader = true }: PointsTransactionListProps) {
  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle>Points History</CardTitle>
          <CardDescription>Your recent points activity</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">Database features removed.</p>
        </div>
      </CardContent>
    </Card>
  );
}
