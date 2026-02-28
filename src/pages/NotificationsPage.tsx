
import { useState } from "react";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Bell, Trash2, CheckCheck, Clock } from "lucide-react";
import { useScreenSize } from "@/utils/mobile";

const NotificationsPage = () => {
  const { language } = useLanguage();
  const { isMobile } = useScreenSize();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearNotifications } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const t = language === 'fr'
    ? {
      title: "Notifications",
      subTitle: "Gérez vos notifications",
      noNotifications: "Aucune notification",
      markAllAsRead: "Marquer tout comme lu",
      clearAll: "Effacer tout",
      unread: "Non lu",
      all: "Tous",
      water: "Rappel d'eau",
      achievement: "Réussite",
      meal: "Repas",
      reminder: "Rappel",
      info: "Info"
    }
    : {
      title: "Notifications",
      subTitle: "Manage your notifications",
      noNotifications: "No notifications",
      markAllAsRead: "Mark all as read",
      clearAll: "Clear all",
      unread: "Unread",
      all: "All",
      water: "Water Reminder",
      achievement: "Achievement",
      meal: "Meal Update",
      reminder: "Reminder",
      info: "Info"
    };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'water': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'achievement': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'meal': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'reminder': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <ProfileSidebar activePage="notifications" />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? 'mt-16' : 'md:ml-64'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{t.title}</h1>
              <p className="text-muted-foreground mt-1">{t.subTitle}</p>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={notifications.every(n => n.isRead)}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  {t.markAllAsRead}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearNotifications}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t.clearAll}
                </Button>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="mb-6 flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                {t.all} ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                {t.unread} ({notifications.filter(n => !n.isRead).length})
              </Button>
            </div>
          )}

          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex justify-center items-center h-64">
                <div className="text-center">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">{t.noNotifications}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${
                    notification.isRead ? 'opacity-75' : 'border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                        {!notification.isRead && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <h3 className="font-semibold text-lg">{notification.title}</h3>
                      <p className="text-muted-foreground mt-2">{notification.message}</p>
                      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(notification.timestamp)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
