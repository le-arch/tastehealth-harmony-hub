
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bell, RefreshCw, Trash2 } from "lucide-react";
import { useScreenSize } from "@/utils/mobile";

const NotificationsPage = () => {
  const { language } = useLanguage();
  const { isMobile } = useScreenSize();
  const t = language === 'fr'
    ? { title: "Notifications", subTitle: "Gérez vos notifications", noNotifications: "Aucune notification" }
    : { title: "Notifications", subTitle: "Manage your notifications", noNotifications: "No notifications - database features removed" };

  return (
    <div className="flex space-y-6 bg-background">
      <ProfileSidebar activePage="notifications" />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? "" : "md:ml-64"}`}>
        <div className="grid">
          <div className="flex justify-between items-center mb-6">
            <div><h1 className="text-2xl font-semibold">{t.title}</h1><p className="text-muted-foreground">{t.subTitle}</p></div>
          </div>
          <Card><CardContent className="flex justify-center items-center h-40">
            <div className="text-center"><Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">{t.noNotifications}</p></div>
          </CardContent></Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
