"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import gamificationService, {
  type PointsTransaction,
} from "../../services/gamificationService";

interface PointsTransactionListProps {
  userId: string;
  limit?: number;
  showHeader?: boolean;
}

export function PointsTransactionList({
  userId,
  limit = 5,
  showHeader = true,
}: PointsTransactionListProps) {
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const data = await gamificationService.getPointsTransactions(
          userId,
          limit
        );
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, limit]);

  const getTransactionIcon = (transaction: PointsTransaction) => {
    if (transaction.transaction_type === "earn") {
      return <ArrowUpCircle className="h-4 w-4 text-green-500" />;
    } else if (transaction.transaction_type === "spend") {
      return <ArrowDownCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <RefreshCw className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTransactionColor = (transaction: PointsTransaction) => {
    if (transaction.transaction_type === "earn") {
      return "text-green-600";
    } else if (transaction.transaction_type === "spend") {
      return "text-red-600";
    } else {
      return "text-blue-600";
    }
  };

  if (loading) {
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
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
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
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle>Points History</CardTitle>
          <CardDescription>Your recent points activity</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                {getTransactionIcon(transaction)}
                <div>
                  <p className="font-medium">{transaction.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      new Date(transaction.created_at),
                      "MMM d, yyyy • h:mm a"
                    )}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  transaction.transaction_type === "spend"
                    ? "destructive"
                    : "outline"
                }
                className={getTransactionColor(transaction)}
              >
                {transaction.transaction_type === "spend" ? "-" : "+"}
                {Math.abs(transaction.points)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
