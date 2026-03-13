
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";


const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const unread = notifications.filter(n => !n.isRead).length;
  const markRead = (id: string) => markAsRead(id);
  const markAllRead = markAllAsRead;
  const deleteNotif = deleteNotification;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6 text-green-500 fill-green-500" />
          {unread > 0 && <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-7 h-7 text-xs flex items-center justify-center">{unread}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Notifications</h3>
          {unread > 0 && <Button variant="ghost" size="sm" onClick={markAllRead}><Check className="h-3 w-3 mr-1" />Read all</Button>}
        </div>
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className={`p-2 rounded border text-sm ${n.isRead ? 'opacity-60' : 'bg-primary/5'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{n.title}</span>
                  <div className="flex gap-1">
                    {!n.isRead && <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => markRead(n.id)}><Check className="h-3 w-3" /></Button>}
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => deleteNotif(n.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{n.message}</p>
              </div>
            ))}
          </div>
        )}
        {notifications.length > 0 && (
          <div className="mt-3 text-center">
            <Button variant="link" size="sm" onClick={() => { setIsOpen(false); navigate('/notifications'); }}>
              View all notifications ▶
            </Button>
          </div>
        )}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
