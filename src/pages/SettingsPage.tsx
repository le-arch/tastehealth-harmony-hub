
import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "../contexts/ThemeContext";
import { SettingsIcon } from "lucide-react";
import { useScreenSize } from "@/utils/mobile";
import { ProfileSidebar } from "../components/profile/ProfileSidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLS, setLS, LS_KEYS } from "@/utils/localStorage";
import { toast } from "sonner";

interface SettingsData {
  notifications: boolean;
  emailNotifications: boolean;
  useMetric: boolean;
}

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { isMobile } = useScreenSize();
  
  const saved = getLS<SettingsData>(LS_KEYS.SETTINGS, { notifications: true, emailNotifications: true, useMetric: true });
  const [notifications, setNotifications] = useState(saved.notifications);
  const [emailNotifications, setEmailNotifications] = useState(saved.emailNotifications);
  const [useMetric, setUseMetric] = useState(saved.useMetric);

  useEffect(() => {
    setLS(LS_KEYS.SETTINGS, { notifications, emailNotifications, useMetric });
  }, [notifications, emailNotifications, useMetric]);

  return (
    <div className="flex container space-y-6 py-8">
      <ProfileSidebar activePage="settings" />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? "" : "md:ml-64"}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><SettingsIcon className="h-5 w-5" />App Settings</CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div><Label className="font-medium">Dark Mode</Label><p className="text-sm text-muted-foreground">Switch between light and dark themes</p></div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><Label className="font-medium">Push Notifications</Label><p className="text-sm text-muted-foreground">Receive app notifications</p></div>
              <Switch checked={notifications} onCheckedChange={(v) => { setNotifications(v); toast.success("Settings saved!"); }} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><Label className="font-medium">Email Notifications</Label><p className="text-sm text-muted-foreground">Receive email updates</p></div>
              <Switch checked={emailNotifications} onCheckedChange={(v) => { setEmailNotifications(v); toast.success("Settings saved!"); }} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><Label className="font-medium">Measurement System</Label><p className="text-sm text-muted-foreground">Choose your preferred units</p></div>
              <RadioGroup value={useMetric ? "metric" : "imperial"} onValueChange={(v) => { setUseMetric(v === "metric"); toast.success("Settings saved!"); }} className="flex space-x-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="metric" id="metric" /><Label htmlFor="metric">Metric</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="imperial" id="imperial" /><Label htmlFor="imperial">Imperial</Label></div>
              </RadioGroup>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label className="font-medium">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Language" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
