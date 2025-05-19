
import type React from "react";
import { useEffect, useState } from "react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ChallengeCreator from "@/components/ChallengeCreator";
import { useScreenSize } from "@/utils/mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/scrollable-tabs";
import { ScrollableTabsList } from "@/components/ui/scrollable-tabs";

const ChallengesPage: React.FC = () => {
  const { isMobile, isTablet } = useScreenSize();
  const [activeTab, setActiveTab] = useState("active");
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="Challenges" />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? '' : 'md:ml-64'} overflow-auto`}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Nutrition Challenges</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
          Complete challenges to earn points and improve your nutrition habits.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollableTabsList className="mb-6">
            <TabsTrigger value="active">Active Challenges</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="create">Create Challenge</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </ScrollableTabsList>
          
          <TabsContent value="active">
            {/* Challenge list would go here */}
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your active challenges will appear here.
            </p>
          </TabsContent>
          
          <TabsContent value="completed">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your completed challenges will appear here.
            </p>
          </TabsContent>
          
          <TabsContent value="create">
            <ChallengeCreator />
          </TabsContent>
          
          <TabsContent value="explore">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Explore new challenges to try.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChallengesPage;
