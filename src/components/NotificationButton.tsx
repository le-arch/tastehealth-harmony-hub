
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const NotificationButton: React.FC = () => {
  const handleClick = () => {
    toast({
      title: "You have a new notification!",
      description: "Check out your latest updates.",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        onClick={handleClick}
        className="bg-background shadow-lg border border-border hover:bg-accent transition-colors"
      >
        <Bell className="h-6 w-6 text-primary" />
        <span className="sr-only">Notification center</span>
      </Button>
    </div>
  );
};

export default NotificationButton;
