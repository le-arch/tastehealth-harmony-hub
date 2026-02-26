
import type React from "react";
import NutritionGamificationSystem from "../components/gamification/NutritionGamificationSystem";
import ProgressGuard from "@/components/ProgressGuard";

const NutritionGamePage: React.FC = () => {
  return (
    <ProgressGuard requiredStage="game" currentPageName="Nutrition Game">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Nutrition Game Center</h1>
        <NutritionGamificationSystem userId="local" standalone={true} />
      </div>
    </ProgressGuard>
  );
};

export default NutritionGamePage;
