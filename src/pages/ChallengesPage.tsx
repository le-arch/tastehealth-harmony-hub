
import type React from "react";
import { useEffect, useState } from "react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ChallengeCreator from "@/components/ChallengeCreator";
import { useScreenSize } from "@/utils/mobile";

const ChallengesPage: React.FC = () => {
  const { isMobile, isTablet } = useScreenSize();
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="Challenges" />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? '' : 'md:ml-64'}`}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Nutrition Challenges</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
          Complete challenges to earn points and improve your nutrition habits.
        </p>
        <ChallengeCreator />
      </div>
    </div>
  );
};

export default ChallengesPage;
