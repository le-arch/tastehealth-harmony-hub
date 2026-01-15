
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  Target, 
  Calendar,
  Coins
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface PointsTransactionHistoryProps {
  userId: string;
  limit?: number;
}

interface PointsTransaction {
  id: string;
  points: number;
  transaction_type: string;
  reason: string;
  created_at: string;
  reference_type?: string;
}

const PointsTransactionHistory = ({ userId, limit = 20 }: PointsTransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Points History",
      earned: "Earned",
      spent: "Spent",
      quest: "Quest",
      challenge: "Challenge",
      achievement: "Achievement",
      daily: "Daily Activity",
      noTransactions: "No point transactions yet",
      loading: "Loading transactions..."
    },
    fr: {
      title: "Historique des Points",
      earned: "Gagné",
      spent: "Dépensé",
      quest: "Quête",
      challenge: "Défi",
      achievement: "Succès",
      daily: "Activité Quotidienne",
      noTransactions: "Aucune transaction de points encore",
      loading: "Chargement des transactions..."
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    fetchTransactions();
  }, [userId, limit]);

  const fetchTransactions = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error in fetchTransactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (referenceType?: string, transactionType?: string) => {
    if (referenceType === 'quest') return <Target className="h-4 w-4" />;
    if (referenceType === 'challenge') return <Trophy className="h-4 w-4" />;
    if (referenceType === 'achievement') return <Trophy className="h-4 w-4" />;
    if (transactionType === 'earn') return <TrendingUp className="h-4 w-4" />;
    return <Coins className="h-4 w-4" />;
  };

  const getTransactionColor = (transactionType: string, points: number) => {
    if (transactionType === 'earn' || points > 0) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const getTransactionBadgeColor = (referenceType?: string) => {
    switch (referenceType) {
      case 'quest': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'challenge': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'achievement': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>{t.loading}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Coins className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>{t.noTransactions}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getTransactionColor(transaction.transaction_type, transaction.points) === 'text-green-600' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {getTransactionIcon(transaction.reference_type, transaction.transaction_type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.reason}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </span>
                      {transaction.reference_type && (
                        <Badge variant="outline" className={`text-xs ${getTransactionBadgeColor(transaction.reference_type)}`}>
                          {t[transaction.reference_type as keyof typeof t] || transaction.reference_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`font-bold ${getTransactionColor(transaction.transaction_type, transaction.points)}`}>
                  {transaction.points > 0 ? '+' : ''}{transaction.points}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsTransactionHistory;
