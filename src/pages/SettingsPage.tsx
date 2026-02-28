
import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useTheme } from "../contexts/ThemeContext";
import { SettingsIcon, MessageSquare, Apple, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useScreenSize } from "@/utils/mobile";
import { ProfileSidebar } from "../components/profile/ProfileSidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLS, setLS, LS_KEYS } from "@/utils/localStorage";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsData {
  notifications: boolean;
  emailNotifications: boolean;
  useMetric: boolean;
}

interface NutritionPrefs {
  dietType: string;
  allergies: string;
  calorieGoal: string;
  proteinGoal: string;
  carbsGoal: string;
  fatsGoal: string;
  mealFrequency: string;
}

interface FeedbackItem {
  id: string;
  date: string;
  rating: number;
  category: string;
  message: string;
}

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { isMobile } = useScreenSize();
  
  const saved = getLS<SettingsData>(LS_KEYS.SETTINGS, { notifications: true, emailNotifications: true, useMetric: true });
  const [notifications, setNotifications] = useState(saved.notifications);
  const [emailNotifications, setEmailNotifications] = useState(saved.emailNotifications);
  const [useMetric, setUseMetric] = useState(saved.useMetric);

  // Nutrition preferences
  const savedPrefs = getLS<NutritionPrefs>('th_nutrition_prefs', { dietType: 'balanced', allergies: '', calorieGoal: '2000', proteinGoal: '50', carbsGoal: '250', fatsGoal: '65', mealFrequency: '3' });
  const [nutritionPrefs, setNutritionPrefs] = useState(savedPrefs);

  // Feedback
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('general');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>(getLS('th_feedback', []));

  useEffect(() => {
    setLS(LS_KEYS.SETTINGS, { notifications, emailNotifications, useMetric });
  }, [notifications, emailNotifications, useMetric]);

  const saveNutritionPrefs = () => {
    setLS('th_nutrition_prefs', nutritionPrefs);
    toast.success("Nutrition preferences saved!");
  };

  const submitFeedback = () => {
    if (!feedbackMessage.trim()) { toast.error("Please enter your feedback"); return; }
    const item: FeedbackItem = { id: crypto.randomUUID(), date: new Date().toISOString(), rating: feedbackRating, category: feedbackCategory, message: feedbackMessage };
    const updated = [item, ...feedbackHistory];
    setFeedbackHistory(updated);
    setLS('th_feedback', updated);
    setFeedbackMessage('');
    setFeedbackRating(5);
    toast.success("Thank you for your feedback!");
  };

  return (
    <div className="flex container space-y-6 py-8">
      <ProfileSidebar activePage="settings" />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? "" : "md:ml-64"}`}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="flex items-center gap-2"><SettingsIcon className="h-4 w-4" />General</TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2"><Apple className="h-4 w-4" />Nutrition</TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
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
          </TabsContent>

          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Apple className="h-5 w-5" />Nutrition Preferences</CardTitle>
                <CardDescription>Set your dietary preferences and daily nutrition goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="font-medium">Diet Type</Label>
                  <Select value={nutritionPrefs.dietType} onValueChange={v => setNutritionPrefs({...nutritionPrefs, dietType: v})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="paleo">Paleo</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-medium">Allergies / Restrictions</Label>
                  <Input className="mt-1" placeholder="e.g. gluten, dairy, nuts" value={nutritionPrefs.allergies} onChange={e => setNutritionPrefs({...nutritionPrefs, allergies: e.target.value})} />
                </div>
                <Separator />
                <h3 className="font-semibold">Daily Goals</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Calories (kcal)</Label><Input type="number" value={nutritionPrefs.calorieGoal} onChange={e => setNutritionPrefs({...nutritionPrefs, calorieGoal: e.target.value})} /></div>
                  <div><Label>Protein (g)</Label><Input type="number" value={nutritionPrefs.proteinGoal} onChange={e => setNutritionPrefs({...nutritionPrefs, proteinGoal: e.target.value})} /></div>
                  <div><Label>Carbs (g)</Label><Input type="number" value={nutritionPrefs.carbsGoal} onChange={e => setNutritionPrefs({...nutritionPrefs, carbsGoal: e.target.value})} /></div>
                  <div><Label>Fats (g)</Label><Input type="number" value={nutritionPrefs.fatsGoal} onChange={e => setNutritionPrefs({...nutritionPrefs, fatsGoal: e.target.value})} /></div>
                </div>
                <div>
                  <Label className="font-medium">Meals Per Day</Label>
                  <Select value={nutritionPrefs.mealFrequency} onValueChange={v => setNutritionPrefs({...nutritionPrefs, mealFrequency: v})}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 meals</SelectItem>
                      <SelectItem value="3">3 meals</SelectItem>
                      <SelectItem value="4">4 meals</SelectItem>
                      <SelectItem value="5">5 meals</SelectItem>
                      <SelectItem value="6">6 meals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={saveNutritionPrefs} className="w-full">Save Nutrition Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />Send Feedback</CardTitle>
                <CardDescription>Help us improve TasteHealth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="font-medium">Rating</Label>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setFeedbackRating(n)} className="p-1">
                        <Star className={`h-6 w-6 ${n <= feedbackRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Category</Label>
                  <Select value={feedbackCategory} onValueChange={setFeedbackCategory}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-medium">Your Feedback</Label>
                  <Textarea className="mt-1" placeholder="Tell us what you think..." value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} rows={4} />
                </div>
                <Button onClick={submitFeedback} className="w-full">Submit Feedback</Button>

                {feedbackHistory.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Your Feedback History</h3>
                    <div className="space-y-3">
                      {feedbackHistory.slice(0, 5).map(f => (
                        <div key={f.id} className="p-3 rounded-lg border text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="capitalize">{f.category}</Badge>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(n => <Star key={n} className={`h-3 w-3 ${n <= f.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />)}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{f.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(f.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
