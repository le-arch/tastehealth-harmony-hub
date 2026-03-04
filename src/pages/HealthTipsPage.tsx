import React, { useState, useEffect } from 'react';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useScreenSize } from '@/utils/mobile';
import { Heart, RefreshCw, Bookmark, BookmarkCheck, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: string;
}

const ALL_TIPS: HealthTip[] = [
  { id: 't1', title: 'Stay Hydrated', content: 'Drink at least 8 glasses of water daily. Dehydration can cause fatigue, headaches, and impaired concentration. Keep a water bottle with you as a reminder.', category: 'hydration', icon: '💧' },
  { id: 't2', title: 'Eat the Rainbow', content: 'Include fruits and vegetables of different colors in your diet. Each color provides unique phytonutrients and antioxidants essential for health.', category: 'nutrition', icon: '🌈' },
  { id: 't3', title: 'Prioritize Sleep', content: 'Aim for 7-9 hours of quality sleep. Sleep is when your body repairs itself, consolidates memories, and regulates hormones.', category: 'sleep', icon: '😴' },
  { id: 't4', title: 'Move Every Hour', content: 'Take a 5-minute break every hour to stretch or walk. Prolonged sitting increases risk of cardiovascular disease and metabolic issues.', category: 'exercise', icon: '🏃' },
  { id: 't5', title: 'Mindful Eating', content: 'Eat slowly and without distractions. It takes about 20 minutes for your brain to register fullness. Chew thoroughly and savor each bite.', category: 'nutrition', icon: '🧘' },
  { id: 't6', title: 'Protein at Every Meal', content: 'Include a source of protein at each meal to maintain muscle mass, feel full longer, and stabilize blood sugar levels.', category: 'nutrition', icon: '💪' },
  { id: 't7', title: 'Limit Added Sugars', content: 'The WHO recommends less than 25g of added sugar per day. Check nutrition labels — sugar hides in sauces, breads, and "healthy" snacks.', category: 'nutrition', icon: '🍬' },
  { id: 't8', title: 'Practice Deep Breathing', content: 'Take 5 deep breaths when stressed. This activates your parasympathetic nervous system, lowering cortisol and blood pressure.', category: 'mental', icon: '🌬️' },
  { id: 't9', title: 'Eat Fiber-Rich Foods', content: 'Aim for 25-30g of fiber daily from whole grains, fruits, vegetables, and legumes. Fiber supports digestion and heart health.', category: 'nutrition', icon: '🌾' },
  { id: 't10', title: 'Morning Sunlight', content: 'Get 10-15 minutes of morning sunlight to regulate your circadian rhythm, improve mood, and boost vitamin D production.', category: 'wellness', icon: '☀️' },
  { id: 't11', title: 'Stretch Before Bed', content: 'A gentle 10-minute stretch routine before bed can improve sleep quality, reduce muscle tension, and calm your mind.', category: 'exercise', icon: '🤸' },
  { id: 't12', title: 'Healthy Snacking', content: 'Choose nutrient-dense snacks like nuts, yogurt, or fruit instead of processed options. Keep healthy snacks visible and accessible.', category: 'nutrition', icon: '🥜' },
  { id: 't13', title: 'Cook at Home More', content: 'Home-cooked meals are typically healthier, lower in calories, and more nutritious than restaurant or takeout food.', category: 'nutrition', icon: '👩‍🍳' },
  { id: 't14', title: 'Walk After Meals', content: 'A 15-minute walk after meals can help lower blood sugar levels by up to 50% and aid in digestion.', category: 'exercise', icon: '🚶' },
  { id: 't15', title: 'Gratitude Practice', content: 'Write down 3 things you are grateful for each day. Studies show gratitude improves mental health, sleep, and overall wellbeing.', category: 'mental', icon: '🙏' },
];

const HealthTipsPage: React.FC = () => {
  const { isMobile } = useScreenSize();
  const [dailyTips, setDailyTips] = useState<HealthTip[]>([]);
  const [savedTips, setSavedTips] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('th_saved_tips');
    if (saved) setSavedTips(JSON.parse(saved));
    generateDailyTips();
  }, []);

  const generateDailyTips = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('th_daily_tips_date');
    const storedTips = localStorage.getItem('th_daily_tips');

    if (stored === today && storedTips) {
      setDailyTips(JSON.parse(storedTips));
    } else {
      const shuffled = [...ALL_TIPS].sort(() => Math.random() - 0.5).slice(0, 5);
      setDailyTips(shuffled);
      localStorage.setItem('th_daily_tips', JSON.stringify(shuffled));
      localStorage.setItem('th_daily_tips_date', today);
    }
  };

  const refreshTips = () => {
    const shuffled = [...ALL_TIPS].sort(() => Math.random() - 0.5).slice(0, 5);
    setDailyTips(shuffled);
    localStorage.setItem('th_daily_tips', JSON.stringify(shuffled));
    localStorage.setItem('th_daily_tips_date', new Date().toDateString());
    toast.success('New tips loaded!');
  };

  const toggleSave = (tipId: string) => {
    const updated = savedTips.includes(tipId)
      ? savedTips.filter(id => id !== tipId)
      : [...savedTips, tipId];
    setSavedTips(updated);
    localStorage.setItem('th_saved_tips', JSON.stringify(updated));
    toast.success(savedTips.includes(tipId) ? 'Tip unsaved' : 'Tip saved!');
  };

  const savedTipsList = ALL_TIPS.filter(t => savedTips.includes(t.id));

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <ProfileSidebar activePage="health" />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? 'mt-16' : 'md:ml-64'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <Lightbulb className="h-7 w-7 text-yellow-500" />
                Daily Health Tips
              </h1>
              <p className="text-muted-foreground mt-1">Fresh wellness tips to keep you healthy every day</p>
            </div>
            <Button variant="outline" onClick={refreshTips}>
              <RefreshCw className="h-4 w-4 mr-2" />Refresh Tips
            </Button>
          </div>

          <div className="space-y-4 mb-8">
            {dailyTips.map((tip, i) => (
              <Card key={tip.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex gap-4">
                  <span className="text-3xl flex-shrink-0">{tip.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{tip.title}</h3>
                        <Badge variant="outline" className="text-xs capitalize mt-1">{tip.category}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSave(tip.id)}
                        className="flex-shrink-0"
                      >
                        {savedTips.includes(tip.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{tip.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {savedTipsList.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookmarkCheck className="h-5 w-5 text-primary" />
                Saved Tips ({savedTipsList.length})
              </h2>
              <div className="space-y-3">
                {savedTipsList.map(tip => (
                  <Card key={tip.id}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <span className="text-2xl">{tip.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{tip.content}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleSave(tip.id)} className="text-red-500">
                        <BookmarkCheck className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthTipsPage;
