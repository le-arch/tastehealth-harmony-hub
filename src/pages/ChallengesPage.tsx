
import React from "react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ChallengeCreator from "@/components/ChallengeCreator";
import ProgressGuard from "@/components/ProgressGuard";
import ExploreChallenges from "@/components/gamification/ExploreChallenges";
import { useScreenSize } from "@/utils/mobile";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";
import { Trophy } from "lucide-react";
import { useState } from "react";

const ChallengesPage: React.FC = () => {
  const { isMobile } = useScreenSize();
  const [activeTab, setActiveTab] = useState("create");

  return (
    <ProgressGuard requiredStage="challenges" currentPageName="Challenges">
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <ProfileSidebar activePage="Challenges" />
        <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? '' : 'md:ml-64'} overflow-auto`}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Nutrition Challenges</h1>
          <p className="text-muted-foreground mb-6">Complete challenges to earn points and improve your nutrition habits.</p>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ScrollableTabsList className="mb-6">
              <TabsTrigger value="create">Create Challenge</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
            </ScrollableTabsList>
            <TabsContent value="create"><ChallengeCreator /></TabsContent>
            <TabsContent value="explore"><ExploreChallenges userId="local" /></TabsContent>
          </Tabs>
        </div>
      </div>
    </ProgressGuard>
  );
};

export default ChallengesPage;
