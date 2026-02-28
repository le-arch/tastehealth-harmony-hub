
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { getLS, setLS, LS_KEYS, Notification } from "@/utils/localStorage";

const generateNotifications = (): Notification[] => {
  const tips = [
    { title: "Stay Hydrated!", message: "Remember to drink at least 8 glasses of water today." },
    { title: "Time for a Snack", message: "A handful of nuts is a great protein-rich snack." },
    { title: "Weekly Challenge", message: "Try eating 5 different colored vegetables this week." },
    { title: "Sleep Reminder", message: "Aim for 7-8 hours of sleep for optimal health." },
    { title: "Exercise Tip", message: "Even a 15-minute walk after meals improves digestion." },
    { title: "Meal Prep Sunday", message: "Plan your meals for the week to eat healthier." },
    { title: "Protein Goal", message: "Track your protein intake to build lean muscle." },
    { title: "New Recipe Available", message: "Check out the latest healthy recipes in the meal database." },
  ];
  const existing = getLS<Notification[]>(LS_KEYS.NOTIFICATIONS, []);
  if (existing.length > 0) return existing;
  
  const generated = tips.slice(0, 4).map((t, i) => ({
    id: crypto.randomUUID(),
    date: new Date(Date.now() - i * 3600000).toISOString(),
    title: t.title,
    message: t.message,
    read: false,
  }));
  setLS(LS_KEYS.NOTIFICATIONS, generated);
  return generated;
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications());

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
