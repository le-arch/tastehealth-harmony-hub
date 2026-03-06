import type React from "react";
import PageLayout from "@/components/PageLayout";
import LevelBenefits from "../components/gamification/LevelBenefits";
import ProgressGuard from "@/components/ProgressGuard";

const LevelBenefitsPage: React.FC = () => {
  return (
    <ProgressGuard requiredStage="level" currentPageName="Level Benefits">
      <PageLayout activePage="level">
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Level Benefits</h1>
          <p className="text-muted-foreground mb-6 text-sm">As you level up, you'll unlock special benefits and features.</p>
          <LevelBenefits userId="local" />
        </div>
      </PageLayout>
    </ProgressGuard>
  );
};

export default LevelBenefitsPage;
