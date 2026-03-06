import React, { useState } from 'react';
import AppNavbar from '@/components/AppNavbar';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import NutritionistChatbot from '@/components/NutritionistChatbot';

interface PageLayoutProps {
  children: React.ReactNode;
  activePage?: string;
  showChatbot?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, activePage, showChatbot = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <ProfileSidebar activePage={activePage} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-14 min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>
      {showChatbot && <NutritionistChatbot />}
    </div>
  );
};

export default PageLayout;
