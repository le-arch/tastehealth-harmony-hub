"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PointsTransactionHistory from "../components/gamification/PointsTransactionHistory";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProgressGuard from "@/components/ProgressGuard";
import { useScreenSize } from "@/utils/mobile";
const PointsTransactionsPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isMobile, isTablet } = useScreenSize();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>Please log in to view your points transactions.</p>
        </div>
      </div>
    );
  }

  return (
    <ProgressGuard requiredStage="points" currentPageName="Points History">
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="Points History" />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? "" : "md:ml-64"}`}>
        <h1 className="text-3xl font-bold mb-6">Points Transactions</h1>
        <p className="text-gray-600 dark:text-gray-100 mb-8">
          View your complete points transaction history, including points earned
          from challenges, achievements, and daily activities, as well as points
          spent on benefits and rewards.
        </p>

        <PointsTransactionHistory userId={userId} limit={20} />
      </div>
      </div>
    </ProgressGuard>
  );
};

export default PointsTransactionsPage;
