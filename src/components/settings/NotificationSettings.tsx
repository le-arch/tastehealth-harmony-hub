
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NotificationSettingsProps {
  notifications: boolean;
  emailNotifications: boolean;
  onNotificationsChange: (checked: boolean) => void;
  onEmailNotificationsChange: (checked: boolean) => void;
  notificationsLabel: string;
  emailNotificationsLabel: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notifications,
  emailNotifications,
  onNotificationsChange,
  onEmailNotificationsChange,
  notificationsLabel,
  emailNotificationsLabel,
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications" className="flex flex-col space-y-1">
          <span>{notificationsLabel}</span>
        </Label>
        <Switch
          id="notifications"
          checked={notifications}
          onCheckedChange={onNotificationsChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
          <span>{emailNotificationsLabel}</span>
        </Label>
        <Switch
          id="email-notifications"
          checked={emailNotifications}
          onCheckedChange={onEmailNotificationsChange}
        />
      </div>
    </>
  );
};
