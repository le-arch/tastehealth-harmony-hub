
import type React from "react";
import { useState } from "react";
import LevelBenefits from "./LevelBenefits";
import PointsTransactionHistory from "./PointsTransactionHistory";
import NutritionQuest from "./NutritionQuest";
import NutritionLeaderboard from "./NutritionLeaderboard";
import NutritionBadges from "./NutritionBadges";

const GamificationDashboard: React.FC = () => {
  const addPoints = async (points: number, reason: string) => {};

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Nutrition Gamification</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Nutrition Quests</h2>
          <NutritionQuest addPoints={addPoints} />
        </div>
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Nutrition Badges</h2>
          <NutritionBadges addPoints={addPoints} />
        </div>
      </div>
      <div className="bg-card rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <NutritionLeaderboard />
      </div>
    </div>
  );
};

export default GamificationDashboard;
