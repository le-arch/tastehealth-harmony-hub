
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/SupabaseClient";
import PointsTransactionHistory from "../components/gamification/PointsTransactionHistory";
import ProfileSidebar from "../components/profile/ProfileSidebar";
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>Please log in to view your points transactions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="Points History" />
      <div className={`flex-1 p-3 sm:p-6 ${isMobile ? 'mt-14' : isTablet ? 'sm:ml-16' : 'sm:ml-64'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-6">Points Transactions</h1>
          <p className="text-gray-600 dark:text-gray-100 mb-4 sm:mb-8 text-sm sm:text-base">
            View your complete points transaction history, including points earned
            from challenges, achievements, and daily activities, as well as points
            spent on benefits and rewards.
          </p>

          <PointsTransactionHistory userId={userId} limit={20} />
        </div>
      </div>
    </div>
  );
};

export default PointsTransactionsPage;
