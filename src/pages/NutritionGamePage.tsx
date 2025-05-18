"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/SuperbaseClient";
import NutritionGamificationSystem from "../components/gamification/NutritionGamificationSystem";

const NutritionGamePage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
          <p>Please log in to access the Nutrition Game Center.</p>
        </div>
      </div>
    );
  }

  return <NutritionGamificationSystem userId={userId} standalone={true} />;
};

export default NutritionGamePage;
