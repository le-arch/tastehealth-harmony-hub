
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import gamificationService, {
  type PointsTransaction,
} from "../../services/gamificationService";
import { format } from "date-fns";

interface PointsTransactionHistoryProps {
  userId: string;
  limit?: number;
}

export const PointsTransactionHistory: React.FC<
  PointsTransactionHistoryProps
> = ({ userId, limit = 10 }) => {
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await gamificationService.getPointsTransactions(
          userId,
          limit
        );

        if (offset === 0) {
          setTransactions(data);
        } else {
          setTransactions((prev) => [...prev, ...data]);
        }

        setHasMore(data.length === limit);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId, limit, offset]);

  const loadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (type === "earn") return "text-green-600";
    if (type === "spend") return "text-red-600";
    if (type === "refund") return "text-blue-600";
    return amount >= 0 ? "text-green-600" : "text-red-600";
  };

  const getTransactionSign = (type: string) => {
    if (type === "earn" || type === "refund") return "+";
    if (type === "spend") return "-";
    return "";
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="p-4 text-center">Loading transaction history...</div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-500 dark:text-gray-700 ">Points Transaction History</h2>

      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="border-b border-gray-200 py-3 last:border-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{transaction.description || transaction.reason}</p>
                <p className="text-xs text-gray-500 dark:text-gray-100">
                  {formatDate(transaction.created_at)}
                </p>
                {transaction.reference_type && (
                  <p className="text-xs text-gray-500">
                    {transaction.reference_type.replace("_", " ")}
                  </p>
                )}
              </div>
              <div
                className={`font-semibold ${getTransactionColor(
                  transaction.transaction_type,
                  transaction.amount || transaction.points
                )}`}
              >
                {getTransactionSign(transaction.transaction_type)}
                {Math.abs(transaction.amount || transaction.points)} pts
              </div>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="text-center text-gray-500 py-4">No transactions yet.</p>
        )}
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PointsTransactionHistory;
