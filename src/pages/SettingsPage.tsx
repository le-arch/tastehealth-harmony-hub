import type React from "react";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "../contexts/ThemeContext";
import { SettingsIcon, MessageSquare, Apple, Star, Volume2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLS, setLS, LS_KEYS } from "@/utils/localStorage";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { isSoundEnabled, setSoundEnabled, playNotificationSound } from "@/utils/sounds";

interface SettingsData { notifications: boolean; emailNotifications: boolean; useMetric: boolean; }
interface NutritionPrefs { dietType: string; allergies: string; calorieGoal: string; proteinGoal: string; carbsGoal: string; fatsGoal: string; mealFrequency: string; }
interface FeedbackItem { id: string; date: string; rating: number; category: string; message: string; }

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const saved = getLS<SettingsData>(LS_KEYS.SETTINGS, { notifications: true, emailNotifications: true, useMetric: true });
  const [notifications, setNotifications] = useState(saved.notifications);
  const [emailNotifications, setEmailNotifications] = useState(saved.emailNotifications);
  const [useMetric, setUseMetric] = useState(saved.useMetric);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const savedPrefs = getLS<NutritionPrefs>('th_nutrition_prefs', { dietType: 'balanced', allergies: '', calorieGoal: '2000', proteinGoal: '50', carbsGoal: '250', fatsGoal: '65', mealFrequency: '3' });
  const [nutritionPrefs, setNutritionPrefs] = useState(savedPrefs);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('general');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>(getLS('th_feedback', []));

  useEffect(() => { setLS(LS_KEYS.SETTINGS, { notifications, emailNotifications, useMetric }); }, [notifications, emailNotifications, useMetric]);
  const saveNutritionPrefs = () => { setLS('th_nutrition_prefs', nutritionPrefs); toast.success("Nutrition preferences saved!"); };
  const submitFeedback = () => {
    if (!feedbackMessage.trim()) { toast.error("Please enter your feedback"); return; }
    const item: FeedbackItem = { id: crypto.randomUUID(), date: new Date().toISOString(), rating: feedbackRating, category: feedbackCategory, message: feedbackMessage };
    const updated = [item, ...feedbackHistory]; setFeedbackHistory(updated); setLS('th_feedback', updated);
    setFeedbackMessage(''); setFeedbackRating(5); toast.success("Thank you for your feedback!");
  };

  const handleSoundToggle = (checked: boolean) => {
    setSoundOn(checked);
    setSoundEnabled(checked);
    if (checked) {
      playNotificationSound();
    }
    toast.success(checked ? "Sound enabled 🔊" : "Sound muted 🔇");
  };

  return (
    <PageLayout activePage="settings">
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><SettingsIcon className="h-6 w-6" />Settings</h1>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general"><SettingsIcon className="h-4 w-4 mr-1 text-grey-500 fill-grey-500" />General</TabsTrigger>
            <TabsTrigger value="nutrition"><Apple className="h-4 w-4 mr-1 text-red-500 fill-red-500" />Nutrition</TabsTrigger>
            <TabsTrigger value="feedback"><MessageSquare className="h-4 w-4 mr-1 text-green-700 fill-green-500" />Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader><CardTitle>App Settings</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between"><div><Label className="font-medium">Dark Mode</Label><p className="text-sm text-muted-foreground">Switch themes</p></div><Switch checked={theme === "dark"} onCheckedChange={toggleTheme} /></div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-primary" />
                      Sound Effects
                    </Label>
                    <p className="text-sm text-muted-foreground">Play sounds on reminders, notifications & achievements</p>
                  </div>
                  <Switch checked={soundOn} onCheckedChange={handleSoundToggle} />
                </div>
                <Separator />
                <div className="flex items-center justify-between"><div><Label className="font-medium">Push Notifications</Label></div><Switch checked={notifications} onCheckedChange={v => { setNotifications(v); toast.success("Saved!"); }} /></div>
                <Separator />
                <div className="flex items-center justify-between"><div><Label className="font-medium">Email Notifications</Label></div><Switch checked={emailNotifications} onCheckedChange={v => { setEmailNotifications(v); toast.success("Saved!"); }} /></div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Measurement</Label>
                  <RadioGroup value={useMetric ? "metric" : "imperial"} onValueChange={v => { setUseMetric(v === "metric"); toast.success("Saved!"); }} className="flex space-x-4">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="metric" id="metric" /><Label htmlFor="metric">Metric</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="imperial" id="imperial" /><Label htmlFor="imperial">Imperial</Label></div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Language</Label>
                  <Select value={language} onValueChange={setLanguage}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="fr">French</SelectItem></SelectContent></Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition">
            <Card>
              <CardHeader><CardTitle>Nutrition Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div><Label>Diet Type</Label><Select value={nutritionPrefs.dietType} onValueChange={v => setNutritionPrefs({...nutritionPrefs, dietType: v})}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{['balanced','keto','vegan','vegetarian','paleo','mediterranean'].map(d => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Allergies / Restrictions</Label><Input className="mt-1" placeholder="e.g. gluten, dairy, nuts" value={nutritionPrefs.allergies} onChange={e => setNutritionPrefs({...nutritionPrefs, allergies: e.target.value})} /></div>
                <Separator />
                <h3 className="font-semibold">Daily Goals</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Calories (kcal)</Label><Input type="number" value={nutritionPrefs.calorieGoal} onChange={e => setNutritionPrefs({...nutritionPrefs, calorieGoal: e.target.value})} /></div>
                  <div><Label>Protein (g)</Label><Input type="number" value={nutritionPrefs.proteinGoal} onChange={e => setNutritionPrefs({...nutritionPrefs, proteinGoal: e.target.value})} /></div>
                  <div><Label>Carbs (g)</Label><Input type="number" value={nutritionPrefs.carbsGoal} onChange={e => setNutritionPrefs({...nutritionPrefs, carbsGoal: e.target.value})} /></div>
                  <div><Label>Fats (g)</Label><Input type="number" value={nutritionPrefs.fatsGoal} onChange={e => setNutritionPrefs({...nutritionPrefs, fatsGoal: e.target.value})} /></div>
                </div>
                <div><Label>Meals Per Day</Label><Select value={nutritionPrefs.mealFrequency} onValueChange={v => setNutritionPrefs({...nutritionPrefs, mealFrequency: v})}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{['2','3','4','5','6'].map(n => <SelectItem key={n} value={n}>{n} meals</SelectItem>)}</SelectContent></Select></div>
                <Button onClick={saveNutritionPrefs} className="w-full">Save Nutrition Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader><CardTitle>Send Feedback</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Rating</Label><div className="flex gap-1 mt-1">{[1,2,3,4,5].map(n => (<button key={n} onClick={() => setFeedbackRating(n)} className="p-1"><Star className={`h-6 w-6 ${n <= feedbackRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} /></button>))}</div></div>
                <div><Label>Category</Label><Select value={feedbackCategory} onValueChange={setFeedbackCategory}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="general">General</SelectItem><SelectItem value="bug">Bug Report</SelectItem><SelectItem value="feature">Feature Request</SelectItem><SelectItem value="improvement">Improvement</SelectItem></SelectContent></Select></div>
                <div><Label>Your Feedback</Label><Textarea className="mt-1" placeholder="Tell us what you think..." value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} rows={4} /></div>
                <Button onClick={submitFeedback} className="w-full">Submit Feedback</Button>
                {feedbackHistory.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Feedback History</h3>
                    <div className="space-y-3">
                      {feedbackHistory.slice(0, 5).map(f => (
                        <div key={f.id} className="p-3 rounded-lg border text-sm">
                          <div className="flex items-center justify-between mb-1"><Badge variant="outline" className="capitalize">{f.category}</Badge><div className="flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} className={`h-3 w-3 ${n <= f.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />)}</div></div>
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
    </PageLayout>
  );
};

export default SettingsPage;
