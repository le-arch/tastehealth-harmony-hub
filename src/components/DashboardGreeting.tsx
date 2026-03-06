import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Smile } from 'lucide-react';
import { getLS, LS_KEYS, MoodEntry } from '@/utils/localStorage';

const DashboardGreeting: React.FC = () => {
  const currentUser = JSON.parse(localStorage.getItem('th_current_user') || 'null');
  const firstName = currentUser?.firstName || 'User';
  const points = getLS<number>(LS_KEYS.POINTS, 0);
  const streak = getLS<number>(LS_KEYS.STREAK, 0);
  const moodLog = getLS<MoodEntry[]>(LS_KEYS.MOOD_LOG, []);
  const lastMood = moodLog.length > 0 ? moodLog[0] : null;

  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  let emoji = '🌅';
  if (hour >= 12 && hour < 17) { greeting = 'Good Afternoon'; emoji = '☀️'; }
  else if (hour >= 17 && hour < 21) { greeting = 'Good Evening'; emoji = '🌿'; }
  else if (hour >= 21 || hour < 5) { greeting = 'Good Night'; emoji = '🌙'; }

  const moodEmojis: Record<string, string> = {
    great: '😄', good: '😊', neutral: '😐', bad: '😔', terrible: '😢'
  };
  const lastMoodEmoji = lastMood ? (moodEmojis[lastMood.mood] || '😐') : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl p-5 mb-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            {greeting}! <span className="text-2xl">{emoji}</span>
          </h2>
          <p className="text-primary-foreground/80 text-sm mt-0.5">
            Here's your health snapshot for today
          </p>
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
  );
};

export default DashboardGreeting;
