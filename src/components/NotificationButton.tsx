
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";

const NotificationButton: React.FC = () => {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const handleClick = () => {
    // navigate to notifications page so user can see full list
    navigate('/notifications');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        onClick={handleClick}
        className="relative bg-background shadow-lg border border-border hover:bg-accent transition-colors"
      >
        <Bell className="h-6 w-6 text-green-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
            {unreadCount}
          </span>
        )}
        <span className="sr-only">Notification center</span>
      </Button>
    </div>
  );
};

export default NotificationButton;
