
import type React from "react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ChallengeCreator from "@/components/ChallengeCreator";
import { useScreenSize } from "@/utils/mobile";

const ChallengesPage: React.FC = () => {
  const { isMobile, isTablet } = useScreenSize();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="Challenges" />
      <div className={`flex-1 p-3 sm:p-6 ${isMobile ? 'mt-14' : isTablet ? 'sm:ml-16' : 'sm:ml-64'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-6">Nutrition Challenges</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-8 text-sm sm:text-base">
            Complete challenges to earn points and improve your nutrition habits.
          </p>
          <ChallengeCreator />
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
