"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../lib/SupabaseClient";
import { toast } from "sonner";
import {
  SettingsIcon,
  Bell,
  PieChartIcon as ChartPie,
  MessageSquare,
} from "lucide-react";
import { ProfileSidebar } from "../components/profile/ProfileSidebar";
import { StarRating } from "../components/ui/star-rating";
import TasteHealthLoader from "../components/TastehealthLoader"

interface UserSettings {
  id: string;
  user_id: string;
  notifications: boolean;
  email_notifications: boolean;
  dark_mode: boolean;
  language: string;
  use_metric_system: boolean;
}

interface UserProfile {
  first_name: string;
  last_name: string;
  dietary_restrictions: string | null;
  allergies: string | null;
  calorie_goal: string | null;
}

interface FeedbackData {
  rating: number;
  comment: string;
}

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    comment: "",
  });

  useEffect(() => {
    fetchUserSettings();
    fetchUserProfile();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoadingSettings(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // Error code PGRST116 means the item was not found
        console.error("Error fetching settings:", error);
      }

      if (data) {
        setSettings(data);
      } else {
        // If no settings exist, create default settings
        createDefaultSettings(user.id);
      }
    } catch (error) {
      console.error("Error in settings fetch:", error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const createDefaultSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .insert({
          user_id: userId,
          notifications: true,
          email_notifications: true,
          dark_mode: theme === "dark",
          language: "en",
          use_metric_system: true,
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
    } catch (error) {
      console.error("Error creating default settings:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoadingProfile(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "first_name, last_name, dietary_restrictions, allergies, calorie_goal"
        )
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      }

      if (data) {
        setProfile(data);
        setCalorieGoal(data.calorie_goal || "");
        setDietaryRestrictions(data.dietary_restrictions || "");
        setAllergies(data.allergies || "");
      }
    } catch (error) {
      console.error("Error in profile fetch:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSettingsChange = async (
    field: keyof UserSettings,
    value: boolean | string
  ) => {
    if (!settings) return;

    try {
      const updatedSettings = { ...settings, [field]: value };
      setSettings(updatedSettings);

      const { error } = await supabase
        .from("user_settings")
        .update({ [field]: value })
        .eq("id", settings.id);

      if (error) throw error;

      // Special case for dark_mode
      if (field === "dark_mode" && theme === "light" && value === true) {
        toggleTheme();
      } else if (field === "dark_mode" && theme === "dark" && value === false) {
        toggleTheme();
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field}`);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You need to be signed in to update your profile");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          dietary_restrictions: dietaryRestrictions,
          allergies,
          calorie_goal: calorieGoal,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeedbackChange = (
    field: keyof FeedbackData,
    value: string | number
  ) => {
    setFeedback((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitFeedback = async () => {
    if (feedback.rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You need to be signed in to submit feedback");
        return;
      }

      // First, check if the app_feedback table exists
      const { error: tableCheckError } = await supabase
        .from("app_feedback")
        .select("id")
        .limit(1);

      // If the table doesn't exist, create it
      if (tableCheckError && tableCheckError.code === "PGRST116") {
        await supabase.rpc("create_app_feedback_table");
      }

      const { error } = await supabase.from("app_feedback").insert({
        user_id: user.id,
        rating: feedback.rating,
        comment: feedback.comment,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success("Thank you for your feedback!");
      setFeedback({ rating: 0, comment: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (isLoadingSettings || isLoadingProfile) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <TasteHealthLoader />
        {/* <p className="text-center py-4">Loading settings...</p> */}
      </div>
    );
  }

  return (
    <div className="flex container space-y-6 py-8 ">
      <ProfileSidebar activePage="settings" />
      <div className="settings-page ml-16 md:ml-64 w-full transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between"></div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              App Settings
            </CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme-toggle" className="font-medium">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                id="theme-toggle"
                checked={settings?.dark_mode || theme === "dark"}
                onCheckedChange={(checked) =>
                  handleSettingsChange("dark_mode", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notification-toggle" className="font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive app notifications
                </p>
              </div>
              <Switch
                id="notification-toggle"
                checked={settings?.notifications || false}
                onCheckedChange={(checked) =>
                  handleSettingsChange("notifications", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-toggle" className="font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates
                </p>
              </div>
              <Switch
                id="email-toggle"
                checked={settings?.email_notifications || false}
                onCheckedChange={(checked) =>
                  handleSettingsChange("email_notifications", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="unit-system" className="font-medium">
                  Measurement System
                </Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred measurement units
                </p>
              </div>
              <RadioGroup
                value={settings?.use_metric_system ? "metric" : "imperial"}
                onValueChange={(value) =>
                  handleSettingsChange("use_metric_system", value === "metric")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="metric" />
                  <Label htmlFor="metric">Metric</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="imperial" />
                  <Label htmlFor="imperial">Imperial</Label>
                </div>
              </RadioGroup>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="language" className="font-medium">
                Language
              </Label>
              <Select
                value={settings?.language || "en"}
                onValueChange={(value) =>
                  handleSettingsChange("language", value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartPie className="h-5 w-5" />
              Nutrition Settings
            </CardTitle>
            <CardDescription>
              Customize your nutrition preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="calorie-goal">Daily Calorie Goal</Label>
              <Input
                id="calorie-goal"
                type="number"
                placeholder="e.g., 2000"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
              />
            </div>

            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Dietary Preferences</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <span className="sr-only">Toggle</span>
                    <ChevronIcon className="h-4 w-4" open={isOpen} />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="dietary-restrictions">
                    Dietary Restrictions
                  </Label>
                  <Input
                    id="dietary-restrictions"
                    placeholder="e.g., Vegetarian, Vegan"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    placeholder="e.g., Nuts, Dairy"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button
              className="w-full"
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Nutrition Settings"}
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Manage your notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Goal Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Get reminders for your daily nutrition goals
                </p>
              </div>
              <Switch
                checked={settings?.notifications || false}
                onCheckedChange={(checked) =>
                  handleSettingsChange("notifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Summary</p>
                <p className="text-sm text-muted-foreground">
                  Receive weekly progress reports
                </p>
              </div>
              <Switch
                checked={settings?.email_notifications || false}
                onCheckedChange={(checked) =>
                  handleSettingsChange("email_notifications", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              App Feedback
            </CardTitle>
            <CardDescription>
              Help us improve by sharing your thoughts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="rating" className="font-medium">
                Rate Your Experience
              </Label>
              <div className="py-2">
                <StarRating
                  rating={feedback.rating}
                  onRatingChange={(rating) =>
                    handleFeedbackChange("rating", rating)
                  }
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="feedback" className="font-medium">
                Your Feedback
              </Label>
              <Textarea
                id="feedback"
                placeholder="Tell us what you think about the app..."
                value={feedback.comment}
                onChange={(e) =>
                  handleFeedbackChange("comment", e.target.value)
                }
                rows={4}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSubmitFeedback}
              disabled={isSubmittingFeedback || feedback.rating === 0}
            >
              {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper chevron icon component
const ChevronIcon = ({
  className,
  open,
}: {
  className?: string;
  open?: boolean;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{
        transform: open ? "rotate(180deg)" : undefined,
        transition: "transform 0.2s",
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};

export default SettingsPage;
