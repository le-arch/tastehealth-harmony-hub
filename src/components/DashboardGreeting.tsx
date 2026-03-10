import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, AlertCircle, Calendar, TrendingUp } from 'lucide-react';
import { getLS, LS_KEYS, MoodEntry, MealPlan, CalorieEntry } from '@/utils/localStorage';
import wavingLady from '@/assets/waving-lady.png';
import { Card } from '@/components/ui/card';

const DashboardGreeting: React.FC = () => {
  const currentUser = JSON.parse(localStorage.getItem('th_current_user') || 'null');
  const firstName = currentUser?.firstName || 'User';
  const points = getLS<number>(LS_KEYS.POINTS, 0);
  const streak = getLS<number>(LS_KEYS.STREAK, 0);
  const moodLog = getLS<MoodEntry[]>(LS_KEYS.MOOD_LOG, []);
  const lastMood = moodLog.length > 0 ? moodLog[0] : null;
  const mealPlans = getLS<MealPlan[]>(LS_KEYS.MEAL_PLANS, []);
  const calorieLog = getLS<CalorieEntry[]>(LS_KEYS.CALORIE_LOG, []);
  const today = new Date().toDateString();
  const todayCalories = calorieLog.filter(e => new Date(e.date).toDateString() === today);

  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  let emoji = '🌅';
  if (hour >= 12 && hour < 17) { greeting = 'Good Afternoon'; emoji = '☀️'; }
  else if (hour >= 17 && hour < 21) { greeting = 'Good Evening'; emoji = '🌿'; }
  else if (hour >= 21 || hour < 5) { greeting = 'Good Night'; emoji = '🌙'; }

  const moodEmojis: Record<string, string> = { great: '😄', good: '😊', neutral: '😐', bad: '😔', terrible: '😢', delicious: '😋', satisfied: '😊', unsatisfied: '😞' };
  const lastMoodEmoji = lastMood ? (moodEmojis[lastMood.mood] || '😐') : null;

  // Reminders
  const reminders: string[] = [];
  if (todayCalories.length === 0) reminders.push('📊 Track your calories today!');
  if (mealPlans.length === 0) reminders.push('📅 Create a meal plan to stay on track!');
  if (streak === 0) reminders.push('🔥 Start your streak — check in daily!');
  const streakDate = getLS<string>(LS_KEYS.STREAK_DATE, '');
  if (streakDate !== today && streak > 0) reminders.push('🔥 Don\'t break your streak — check in now!');

  return (
    <div className="space-y-3 mb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl p-5"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <motion.img
              src={wavingLady}
              alt="Greeting"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-lg"
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 2, duration: 1.2, ease: "easeInOut" }}
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                {greeting}, {firstName}! <span className="text-2xl">{emoji}</span>
              </h2>
              <p className="text-primary-foreground/80 text-sm mt-0.5">Here's your health snapshot for today</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-center">
              <Flame className="h-5 w-5 text-orange-300" />
              <span className="text-xl font-bold">{streak}</span>
              <span className="text-xs opacity-80 hidden sm:block">Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-center">
              <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
              <span className="text-xl font-bold">{points}</span>
              <span className="text-xs opacity-80 hidden sm:block">Points</span>
            </div>
            {lastMoodEmoji && (
              <div className="flex items-center gap-1.5 text-center">
                <span className="text-2xl">{lastMoodEmoji}</span>
                <span className="text-xs opacity-80 hidden sm:block">Last Mood</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {reminders.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-3 border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Daily Reminders</p>
                {reminders.map((r, i) => (
                  <p key={i} className="text-xs text-amber-600 dark:text-amber-300">{r}</p>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardGreeting;
