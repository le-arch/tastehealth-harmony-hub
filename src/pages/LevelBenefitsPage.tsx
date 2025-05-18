"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/SupabaseClient";
import LevelBenefits from "../components/gamification/LevelBenefits";
import { gamificationService } from "../services/gamificationService";
import ProfileSidebar from "../components/profile/ProfileSidebar";

const LevelBenefitsPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>Please log in to view your level benefits.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="Level Benefits" />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold mb-6">Level Benefits</h1>

        {userPoints && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Level {userPoints.level}</h2>
                <p className="opacity-90">
                  {userPoints.points_to_next_level} points to next level
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{userPoints.total_points}</p>
                <p className="opacity-90">Total Points</p>
              </div>
            </div>
          </div>
        )}

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          As you level up in the app, you'll unlock special benefits and
          features. Use your points and level status to access premium content
          and special offers.
        </p>

        <LevelBenefits userId={userId} />
      </div>
    </div>
  );
};

export default LevelBenefitsPage;
