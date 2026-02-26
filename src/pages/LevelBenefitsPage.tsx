
import type React from "react";
import LevelBenefits from "../components/gamification/LevelBenefits";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import { useScreenSize } from "@/utils/mobile";
import ProgressGuard from "@/components/ProgressGuard";

const LevelBenefitsPage: React.FC = () => {
  const { isMobile } = useScreenSize();

  return (
    <ProgressGuard requiredStage="level" currentPageName="Level Benefits">
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <ProfileSidebar activePage="Level Benefits" />
        <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? "" : "md:ml-64"}`}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Level Benefits</h1>
          <p className="text-muted-foreground mb-6">As you level up, you'll unlock special benefits and features.</p>
          <LevelBenefits userId="local" />
        </div>
      </div>
    </ProgressGuard>
  );
};

export default LevelBenefitsPage;
