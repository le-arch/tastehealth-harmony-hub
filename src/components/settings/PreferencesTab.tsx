
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
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
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.preferences}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ThemeToggle
          checked={settings.theme === 'dark'}
          onCheckedChange={(checked) =>
            onSettingsChange({
              ...settings,
              theme: checked ? 'dark' : 'light',
            })
          }
          label={t.darkMode}
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
          notificationsLabel={t.notifications}
          emailNotificationsLabel={t.emailNotifications}
        />

        <SystemPreferences
          useMetricSystem={settings.use_metric_system}
          onMetricSystemChange={(checked) =>
            onSettingsChange({ ...settings, use_metric_system: checked })
          }
          label={t.metricSystem}
        />

        <LanguageSelector
          currentLanguage={settings.language}
          onLanguageChange={(lang) => onSettingsChange({ ...settings, language: lang })}
          label={t.languagePreference}
          englishLabel={t.english}
          frenchLabel={t.french}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={onSave}>{t.save}</Button>
      </CardFooter>
    </Card>
  );
};
