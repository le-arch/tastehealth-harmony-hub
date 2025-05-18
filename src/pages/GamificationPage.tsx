import type React from "react";
import GamificationDashboard from "../components/gamification/GamificationDashboard";

const GamificationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <GamificationDashboard />
    </div>
  );
};

export default GamificationPage;
