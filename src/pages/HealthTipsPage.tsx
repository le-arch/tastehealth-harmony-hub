import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, RefreshCw, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface HealthTip { id: string; title: string; content: string; category: string; icon: string; }

const ALL_TIPS: HealthTip[] = [
  { id: 't1', title: 'Stay Hydrated', content: 'Drink at least 8 glasses of water daily. Proper hydration boosts energy and brain function.', category: 'hydration', icon: '💧' },
  { id: 't2', title: 'Eat the Rainbow', content: 'Include fruits and vegetables of different colors for diverse nutrients.', category: 'nutrition', icon: '🌈' },
  { id: 't3', title: 'Prioritize Sleep', content: 'Aim for 7-9 hours of quality sleep. Poor sleep increases cravings for unhealthy food.', category: 'sleep', icon: '😴' },
  { id: 't4', title: 'Move Every Hour', content: 'Take a 5-minute break every hour to stretch or walk. Reduces risk of sitting-related diseases.', category: 'exercise', icon: '🏃' },
  { id: 't5', title: 'Mindful Eating', content: 'Eat slowly and without distractions. You\'ll eat 25% fewer calories.', category: 'nutrition', icon: '🧘' },
  { id: 't6', title: 'Protein at Every Meal', content: 'Include protein to maintain muscle and stay full longer. Aim for 20-30g per meal.', category: 'nutrition', icon: '💪' },
  { id: 't7', title: 'Limit Added Sugars', content: 'WHO recommends less than 25g of added sugar per day. Read labels carefully.', category: 'nutrition', icon: '🍬' },
  { id: 't8', title: 'Deep Breathing', content: 'Take 5 deep breaths when stressed to lower cortisol and reduce cravings.', category: 'mental', icon: '🌬️' },
  { id: 't9', title: 'Eat Fiber-Rich Foods', content: 'Aim for 25-30g of fiber daily. Fiber supports gut health and weight management.', category: 'nutrition', icon: '🌾' },
  { id: 't10', title: 'Morning Sunlight', content: 'Get 10-15 min of morning sunlight for vitamin D and better circadian rhythm.', category: 'wellness', icon: '☀️' },
  { id: 't11', title: 'Stretch Before Bed', content: 'A 10-minute stretch routine improves sleep quality and reduces muscle tension.', category: 'exercise', icon: '🤸' },
  { id: 't12', title: 'Healthy Snacking', content: 'Choose nuts, yogurt, or fruit over processed snacks for sustained energy.', category: 'nutrition', icon: '🥜' },
  { id: 't13', title: 'Cook at Home', content: 'Home-cooked meals are healthier, lower in calories, and save money.', category: 'nutrition', icon: '👩‍🍳' },
  { id: 't14', title: 'Walk After Meals', content: 'A 15-min walk after meals lowers blood sugar by up to 50%.', category: 'exercise', icon: '🚶' },
  { id: 't15', title: 'Gratitude Practice', content: 'Write 3 things you are grateful for each day to boost mental wellness.', category: 'mental', icon: '🙏' },
  { id: 't16', title: 'Omega-3 Boost', content: 'Eat fatty fish 2-3 times per week or take fish oil for brain and heart health.', category: 'nutrition', icon: '🐟' },
  { id: 't17', title: 'Reduce Sodium', content: 'Keep sodium under 2300mg/day. Use herbs and spices instead of salt.', category: 'nutrition', icon: '🧂' },
  { id: 't18', title: 'Probiotics Daily', content: 'Eat yogurt, kimchi, or kefir to support your gut microbiome.', category: 'nutrition', icon: '🥛' },
  { id: 't19', title: 'Limit Screen Time', content: 'Reduce blue light exposure 1 hour before bed for better sleep quality.', category: 'wellness', icon: '📱' },
  { id: 't20', title: 'Power Naps', content: 'A 20-minute nap boosts alertness and performance without affecting night sleep.', category: 'sleep', icon: '💤' },
  { id: 't21', title: 'Stand More', content: 'Standing desks can burn 50+ extra calories per hour vs sitting.', category: 'exercise', icon: '🧍' },
  { id: 't22', title: 'Vitamin D Check', content: 'Get your vitamin D levels tested. Deficiency affects mood, bones, and immunity.', category: 'wellness', icon: '🌤️' },
  { id: 't23', title: 'Magnesium-Rich Foods', content: 'Eat dark chocolate, avocados, and almonds for better sleep and less stress.', category: 'nutrition', icon: '🥑' },
  { id: 't24', title: 'Cold Shower Benefits', content: 'End your shower with 30 seconds of cold water to boost circulation and alertness.', category: 'wellness', icon: '🚿' },
  { id: 't25', title: 'Chew Slowly', content: 'Chewing each bite 20-30 times improves digestion and reduces overeating.', category: 'nutrition', icon: '🦷' },
  { id: 't26', title: 'Herbal Teas', content: 'Replace sugary drinks with green tea, chamomile, or peppermint tea.', category: 'hydration', icon: '🍵' },
  { id: 't27', title: 'Meal Prep Sunday', content: 'Prepare meals on Sunday to eat healthier throughout the busy week.', category: 'nutrition', icon: '📦' },
  { id: 't28', title: 'Digital Detox', content: 'Take 1 hour daily away from all screens to reduce stress and eye strain.', category: 'mental', icon: '🔌' },
  { id: 't29', title: 'Posture Check', content: 'Good posture reduces back pain, improves breathing, and boosts confidence.', category: 'wellness', icon: '🧘‍♂️' },
  { id: 't30', title: 'Nature Walk', content: 'Spend 20 minutes in nature daily to reduce cortisol and improve mood.', category: 'exercise', icon: '🌲' },
  { id: 't31', title: 'Portion Control', content: 'Use smaller plates to naturally reduce portion sizes without feeling deprived.', category: 'nutrition', icon: '🍽️' },
  { id: 't32', title: 'Journaling', content: 'Write for 10 minutes daily to process emotions and reduce stress.', category: 'mental', icon: '📔' },
  { id: 't33', title: 'Antioxidant-Rich Berries', content: 'Eat a handful of blueberries daily for brain health and anti-aging benefits.', category: 'nutrition', icon: '🫐' },
  { id: 't34', title: 'Bone Broth', content: 'Bone broth supports gut health, joint health, and provides collagen.', category: 'nutrition', icon: '🍲' },
  { id: 't35', title: 'Social Connection', content: 'Eat meals with others when possible. Social eating improves mental health.', category: 'mental', icon: '👥' },
  { id: 't36', title: 'Iron-Rich Foods', content: 'Pair iron-rich foods with vitamin C for better absorption. Try spinach with lemon.', category: 'nutrition', icon: '🥬' },
  { id: 't37', title: 'Eye Rest Rule', content: 'Follow the 20-20-20 rule: every 20 min, look at something 20 feet away for 20 seconds.', category: 'wellness', icon: '👁️' },
  { id: 't38', title: 'Apple Cider Vinegar', content: 'A tablespoon before meals may improve digestion and blood sugar levels.', category: 'nutrition', icon: '🍎' },
  { id: 't39', title: 'Laughter Therapy', content: 'Laughing for 15 minutes burns ~40 calories and releases endorphins.', category: 'mental', icon: '😂' },
  { id: 't40', title: 'Spice It Up', content: 'Turmeric, ginger, and cinnamon have powerful anti-inflammatory properties.', category: 'nutrition', icon: '🌶️' },
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
    // 4 sets of tips per day (pick 4 from different categories)
    const categories = [...new Set(ALL_TIPS.map(t => t.category))];
    const selected: HealthTip[] = [];
    const shuffledCategories = categories.sort(() => Math.random() - 0.5);
    for (const cat of shuffledCategories) {
      if (selected.length >= 4) break;
      const catTips = ALL_TIPS.filter(t => t.category === cat && !selected.find(s => s.id === t.id));
      if (catTips.length > 0) {
        selected.push(catTips[Math.floor(Math.random() * catTips.length)]);
      }
    }
    // Fill up to 4 if needed
    while (selected.length < 4) {
      const remaining = ALL_TIPS.filter(t => !selected.find(s => s.id === t.id));
      if (remaining.length === 0) break;
      selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }
    setDailyTips(selected);
    localStorage.setItem('th_daily_tips', JSON.stringify(selected));
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
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <motion.span animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                <Lightbulb className="h-7 w-7 text-yellow-500 fill-yellow-500" />
              </motion.span>
              Daily Health Tips
            </h1>
            <p className="text-muted-foreground text-sm mt-1">4 fresh wellness tips every day from diverse categories</p>
          </div>
          <Button variant="outline" onClick={() => { refreshTips(); toast.success('New tips!'); }}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
        </div>
        <div className="space-y-4 mb-8">
          {dailyTips.map((tip, idx) => (
            <motion.div key={tip.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary/50">
                <CardContent className="p-5 flex gap-4">
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: idx + 1 }} className="text-3xl flex-shrink-0">{tip.icon}</motion.span>
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
            </motion.div>
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
