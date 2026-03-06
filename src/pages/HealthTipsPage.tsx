import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, RefreshCw, Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';

interface HealthTip { id: string; title: string; content: string; category: string; icon: string; }

const ALL_TIPS: HealthTip[] = [
  { id: 't1', title: 'Stay Hydrated', content: 'Drink at least 8 glasses of water daily.', category: 'hydration', icon: '💧' },
  { id: 't2', title: 'Eat the Rainbow', content: 'Include fruits and vegetables of different colors.', category: 'nutrition', icon: '🌈' },
  { id: 't3', title: 'Prioritize Sleep', content: 'Aim for 7-9 hours of quality sleep.', category: 'sleep', icon: '😴' },
  { id: 't4', title: 'Move Every Hour', content: 'Take a 5-minute break every hour to stretch or walk.', category: 'exercise', icon: '🏃' },
  { id: 't5', title: 'Mindful Eating', content: 'Eat slowly and without distractions.', category: 'nutrition', icon: '🧘' },
  { id: 't6', title: 'Protein at Every Meal', content: 'Include protein to maintain muscle and stay full longer.', category: 'nutrition', icon: '💪' },
  { id: 't7', title: 'Limit Added Sugars', content: 'WHO recommends less than 25g of added sugar per day.', category: 'nutrition', icon: '🍬' },
  { id: 't8', title: 'Deep Breathing', content: 'Take 5 deep breaths when stressed to lower cortisol.', category: 'mental', icon: '🌬️' },
  { id: 't9', title: 'Eat Fiber-Rich Foods', content: 'Aim for 25-30g of fiber daily from whole foods.', category: 'nutrition', icon: '🌾' },
  { id: 't10', title: 'Morning Sunlight', content: 'Get 10-15 min of morning sunlight for vitamin D.', category: 'wellness', icon: '☀️' },
  { id: 't11', title: 'Stretch Before Bed', content: 'A 10-minute stretch routine improves sleep quality.', category: 'exercise', icon: '🤸' },
  { id: 't12', title: 'Healthy Snacking', content: 'Choose nuts, yogurt, or fruit over processed snacks.', category: 'nutrition', icon: '🥜' },
  { id: 't13', title: 'Cook at Home', content: 'Home-cooked meals are healthier and lower in calories.', category: 'nutrition', icon: '👩‍🍳' },
  { id: 't14', title: 'Walk After Meals', content: 'A 15-min walk after meals lowers blood sugar by 50%.', category: 'exercise', icon: '🚶' },
  { id: 't15', title: 'Gratitude Practice', content: 'Write 3 things you are grateful for each day.', category: 'mental', icon: '🙏' },
];

const HealthTipsPage: React.FC = () => {
  const [dailyTips, setDailyTips] = useState<HealthTip[]>([]);
  const [savedTips, setSavedTips] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('th_saved_tips');
    if (saved) setSavedTips(JSON.parse(saved));
    const today = new Date().toDateString();
    const stored = localStorage.getItem('th_daily_tips_date');
    const storedTips = localStorage.getItem('th_daily_tips');
    if (stored === today && storedTips) { setDailyTips(JSON.parse(storedTips)); }
    else { refreshTips(); }
  }, []);

  const refreshTips = () => {
    const shuffled = [...ALL_TIPS].sort(() => Math.random() - 0.5).slice(0, 5);
    setDailyTips(shuffled);
    localStorage.setItem('th_daily_tips', JSON.stringify(shuffled));
    localStorage.setItem('th_daily_tips_date', new Date().toDateString());
  };

  const toggleSave = (tipId: string) => {
    const updated = savedTips.includes(tipId) ? savedTips.filter(id => id !== tipId) : [...savedTips, tipId];
    setSavedTips(updated);
    localStorage.setItem('th_saved_tips', JSON.stringify(updated));
    toast.success(savedTips.includes(tipId) ? 'Tip unsaved' : 'Tip saved!');
  };

  const savedTipsList = ALL_TIPS.filter(t => savedTips.includes(t.id));

  return (
    <PageLayout activePage="health">
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Lightbulb className="h-7 w-7 text-yellow-500" />Daily Health Tips</h1>
            <p className="text-muted-foreground text-sm mt-1">Fresh wellness tips every day</p>
          </div>
          <Button variant="outline" onClick={() => { refreshTips(); toast.success('New tips!'); }}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
        </div>
        <div className="space-y-4 mb-8">
          {dailyTips.map(tip => (
            <Card key={tip.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex gap-4">
                <span className="text-3xl flex-shrink-0">{tip.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div><h3 className="font-semibold">{tip.title}</h3><Badge variant="outline" className="text-xs capitalize mt-1">{tip.category}</Badge></div>
                    <Button variant="ghost" size="icon" onClick={() => toggleSave(tip.id)} className="flex-shrink-0">
                      {savedTips.includes(tip.id) ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
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
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookmarkCheck className="h-5 w-5 text-primary" />Saved Tips ({savedTipsList.length})</h2>
            <div className="space-y-3">
              {savedTipsList.map(tip => (
                <Card key={tip.id}><CardContent className="p-4 flex items-start gap-3"><span className="text-2xl">{tip.icon}</span><div className="flex-1"><h4 className="font-medium text-sm">{tip.title}</h4><p className="text-xs text-muted-foreground mt-1">{tip.content}</p></div><Button variant="ghost" size="sm" onClick={() => toggleSave(tip.id)} className="text-destructive"><BookmarkCheck className="h-4 w-4" /></Button></CardContent></Card>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default HealthTipsPage;
