
import type React from "react";
import GamificationDashboard from "../components/gamification/GamificationDashboard";
import { useScreenSize } from "@/utils/mobile";
import ProfileSidebar from "@/components/profile/ProfileSidebar";

const GamificationPage: React.FC = () => {
  const { isMobile, isTablet } = useScreenSize();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="games" />
      <div className={`flex-1 p-3 sm:p-6 ${isMobile ? 'mt-14' : isTablet ? 'sm:ml-16' : 'sm:ml-64'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-6">Nutrition Game</h1>
          <GamificationDashboard />
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
