
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { getLS, setLS, LS_KEYS, Notification } from "@/utils/localStorage";
import { Badge } from "@/components/ui/badge";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(getLS(LS_KEYS.NOTIFICATIONS, [
    { id: '1', date: new Date().toISOString(), title: 'Welcome!', message: 'Start tracking your nutrition today.', read: false },
    { id: '2', date: new Date().toISOString(), title: 'Set your goals', message: 'Visit the Goal Wizard to set nutrition goals.', read: false },
  ]));

  const save = (updated: Notification[]) => { setNotifications(updated); setLS(LS_KEYS.NOTIFICATIONS, updated); };
  const unread = notifications.filter(n => !n.read).length;
  const markRead = (id: string) => save(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => save(notifications.map(n => ({ ...n, read: true })));
  const deleteNotif = (id: string) => save(notifications.filter(n => n.id !== id));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">{unread}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Notifications</h3>
          {unread > 0 && <Button variant="ghost" size="sm" onClick={markAllRead}><Check className="h-3 w-3 mr-1" />Read all</Button>}
        </div>
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className={`p-2 rounded border text-sm ${n.read ? 'opacity-60' : 'bg-primary/5'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{n.title}</span>
                  <div className="flex gap-1">
                    {!n.read && <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => markRead(n.id)}><Check className="h-3 w-3" /></Button>}
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => deleteNotif(n.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
