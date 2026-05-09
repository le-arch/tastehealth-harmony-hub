import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useT } from '@/hooks/useTranslate';
import { ThemeToggle } from './ThemeToggle';
import { NotificationSettings } from './NotificationSettings';
import { LanguageSelector } from './LanguageSelector';
import { SystemPreferences } from './SystemPreferences';

interface PreferencesTabProps {
  settings: {
    notifications: boolean;
    email_notifications: boolean;
    use_metric_system: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
  onSettingsChange: (newSettings: any) => void;
  onSave: () => void;
}

export const PreferencesTab: React.FC<PreferencesTabProps> = ({
  settings,
  onSettingsChange,
  onSave,
}) => {
  const tPreferences = useT('Preferences');
  const tDarkMode = useT('Dark Mode');
  const tNotifications = useT('Push Notifications');
  const tEmailNotifications = useT('Email Notifications');
  const tMetricSystem = useT('Use Metric System');
  const tLanguagePreference = useT('Language Preference');
  const tEnglish = useT('English');
  const tFrench = useT('French');
  const tSave = useT('Save Changes');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tPreferences}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ThemeToggle
          checked={settings.theme === 'dark'}
          onCheckedChange={(checked) =>
            onSettingsChange({ ...settings, theme: checked ? 'dark' : 'light' })
          }
          label={tDarkMode}
        />

        <NotificationSettings
          notifications={settings.notifications}
          emailNotifications={settings.email_notifications}
          onNotificationsChange={(checked) =>
            onSettingsChange({ ...settings, notifications: checked })
          }
          onEmailNotificationsChange={(checked) =>
            onSettingsChange({ ...settings, email_notifications: checked })
          }
          notificationsLabel={tNotifications}
          emailNotificationsLabel={tEmailNotifications}
        />

        <SystemPreferences
          useMetricSystem={settings.use_metric_system}
          onMetricSystemChange={(checked) =>
            onSettingsChange({ ...settings, use_metric_system: checked })
          }
          label={tMetricSystem}
        />

        <LanguageSelector
          currentLanguage={settings.language}
          onLanguageChange={(lang) => onSettingsChange({ ...settings, language: lang })}
          label={tLanguagePreference}
          englishLabel={tEnglish}
          frenchLabel={tFrench}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={onSave}>{tSave}</Button>
      </CardFooter>
    </Card>
  );
};
