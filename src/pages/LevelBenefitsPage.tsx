
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/SupabaseClient";
import LevelBenefits from "../components/gamification/LevelBenefits";
import { gamificationService } from "../services/gamificationService";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import { useScreenSize } from "@/utils/mobile";

const LevelBenefitsPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isMobile, isTablet } = useScreenSize();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          const points = await gamificationService.getUserPoints(user.id);
          setUserPoints(points);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
          <p>Please log in to view your level benefits.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="Level Benefits" />
      <div className={`flex-1 p-3 sm:p-6 ${isMobile ? 'mt-14' : isTablet ? 'sm:ml-16' : 'sm:ml-64'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-6">Level Benefits</h1>

          {userPoints && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Level {userPoints.level}</h2>
                  <p className="opacity-90 text-sm">
                    {userPoints.points_to_next_level} points to next level
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold">{userPoints.total_points}</p>
                  <p className="opacity-90 text-sm">Total Points</p>
                </div>
              </div>
            </div>
          )}

          <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-8 text-sm sm:text-base">
            As you level up in the app, you'll unlock special benefits and
            features. Use your points and level status to access premium content
            and special offers.
          </p>

          <LevelBenefits userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default LevelBenefitsPage;
