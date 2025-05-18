import type React from "react";
import { useEffect, useState } from "react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ChallengeCreator from "@/components/ChallengeCreator";

const ChallengesPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="Challenges" />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold mb-6">Nutrition Challenges</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Complete challenges to earn points and improve your nutrition habits.
        </p>
        <ChallengeCreator />
      </div>
    </div>
  );
};

export default ChallengesPage;
