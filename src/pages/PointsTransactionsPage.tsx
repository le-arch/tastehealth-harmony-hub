
import type React from "react";
import PointsTransactionHistory from "../components/gamification/PointsTransactionHistory";
//import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProgressGuard from "@/components/ProgressGuard";
import { useScreenSize } from "@/utils/mobile";

const PointsTransactionsPage: React.FC = () => {
  const { isMobile } = useScreenSize();

  return (
    <ProgressGuard requiredStage="points" currentPageName="Points History">
      <div className="flex bg-background">
        {/* <ProfileSidebar activePage="Points History" /> */}
        <div className={`grid grid-col-1 gap-4 sm:gap-6 ${isMobile ? "" : "md:ml-64"}`}>
          <h1 className="text-3xl font-bold mb-6">Points Transactions</h1>
          <p className="text-muted-foreground mb-8">View your complete points transaction history.</p>
          <PointsTransactionHistory userId="local" limit={20} />
        </div>
      </div>
    </ProgressGuard>
  );
};

export default PointsTransactionsPage;
