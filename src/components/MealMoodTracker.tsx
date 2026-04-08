import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, MoodEntry } from '@/utils/localStorage';
import { Smile, Trash2, TrendingUp, BarChart3, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { playMilestoneSound } from '@/utils/sounds';
import Confetti from '@/components/Confetti';

const moodOptions = [
  { emoji: "😋", mood: "delicious", description: "Absolutely loved it!", color: "from-green-400 to-emerald-500", score: 5 },
  { emoji: "😊", mood: "satisfied", description: "Pretty good", color: "from-blue-400 to-cyan-500", score: 4 },
  { emoji: "😐", mood: "neutral", description: "It was okay", color: "from-amber-400 to-yellow-500", score: 3 },
  { emoji: "😞", mood: "unsatisfied", description: "Not great", color: "from-orange-400 to-red-400", score: 2 },
  { emoji: "🤢", mood: "terrible", description: "Did not enjoy at all", color: "from-red-500 to-rose-600", score: 1 }
];

interface MealMoodTrackerProps {
  meal?: { id: string; name: string; };
  onSave?: () => void;
}

const MealMoodTracker: React.FC<MealMoodTrackerProps> = ({ meal, onSave }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [mealName, setMealName] = useState(meal?.name || "");
  const [moodLog, setMoodLog] = useState<MoodEntry[]>(getLS(LS_KEYS.MOOD_LOG, []));
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Mood statistics
  const moodStats = React.useMemo(() => {
    const total = moodLog.length;
    if (total === 0) return null;
    const counts: Record<string, number> = {};
    moodLog.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
    const avgScore = moodLog.reduce((sum, e) => {
      const opt = moodOptions.find(o => o.mood === e.mood);
      return sum + (opt?.score || 3);
    }, 0) / total;
    const topMood = Object.entries(counts).sort(([, a], [, b]) => b - a)[0];
    // Most mentioned meal
    const mealCounts: Record<string, number> = {};
    moodLog.filter(e => e.mealName && e.mealName !== 'General').forEach(e => {
      mealCounts[e.mealName!] = (mealCounts[e.mealName!] || 0) + 1;
    });
    const topMeal = Object.entries(mealCounts).sort(([, a], [, b]) => b - a)[0];
    return { total, counts, avgScore: avgScore.toFixed(1), topMood, topMeal };
  }, [moodLog]);

  const handleSave = () => {
    if (!selectedMood) return;
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood: selectedMood,
      notes,
      mealName: mealName.trim() || meal?.name || 'General',
    };
    const updated = [entry, ...moodLog];
    setMoodLog(updated);
    setLS(LS_KEYS.MOOD_LOG, updated);
    
    // Celebration for every 5th mood entry
    if (updated.length % 5 === 0) {
      setShowConfetti(true);
      playMilestoneSound('reward');
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success(`${updated.length} mood entries! Keep tracking! 🎉`);
    } else {
      toast.success("Mood saved! 😊");
    }
    
    setSelectedMood(null);
    setNotes("");
    setMealName("");
    onSave?.();
  };

  const deleteMood = (id: string) => {
    const updated = moodLog.filter(m => m.id !== id);
    setMoodLog(updated);
    setLS(LS_KEYS.MOOD_LOG, updated);
    toast.success("Mood entry deleted");
  };

  const filteredLog = moodLog.filter(entry => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (entry.mealName || '').toLowerCase().includes(s) || 
           entry.mood.toLowerCase().includes(s) || 
           (entry.notes || '').toLowerCase().includes(s);
  });

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Confetti active={showConfetti} />
      
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
            <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <Smile className="h-5 w-5 text-amber-500" />
            </motion.span>
            {meal ? `How did you feel after eating ${meal.name}?` : "How did your meal make you feel?"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Meal name input */}
          {!meal && (
            <Input 
              placeholder="What did you eat? (optional)" 
              value={mealName} 
              onChange={(e) => setMealName(e.target.value)} 
              className="text-center"
            />
          )}

          {/* Mood selection with animation */}
          <div className="flex justify-center gap-3">
            {moodOptions.map((option) => (
              <motion.button key={option.mood} whileHover={{ scale: 1.2, y: -5 }} whileTap={{ scale: 0.9 }}
                className={`text-3xl h-16 w-16 rounded-2xl flex flex-col items-center justify-center transition-all
                  ${selectedMood === option.mood ? `ring-3 ring-primary bg-gradient-to-br ${option.color} shadow-lg` : 'bg-muted hover:bg-muted/80'}`}
                onClick={() => setSelectedMood(option.mood)} title={option.description}>
                <span>{option.emoji}</span>
                <span className="text-[8px] font-medium mt-0.5 text-foreground/70">{option.score}/5</span>
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {selectedMood && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <p className="text-center mb-2 font-medium">{moodOptions.find(o => o.mood === selectedMood)?.description}</p>
                <Textarea placeholder="Any additional notes about this meal? How did it make you feel physically?" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full" rows={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="justify-center">
          <Button disabled={!selectedMood} onClick={handleSave} className="w-full bg-gradient-to-r from-primary to-primary/80">Save Mood</Button>
        </CardFooter>
      </Card>

      {/* Mood Statistics */}
      {moodStats && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Mood Insights
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowStats(!showStats)}>
                {showStats ? 'Hide' : 'Show'}
              </Button>
            </CardTitle>
          </CardHeader>
          <AnimatePresence>
            {showStats && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold">{moodStats.total}</p>
                      <p className="text-xs text-muted-foreground">Total Entries</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold">{moodStats.avgScore}</p>
                      <p className="text-xs text-muted-foreground">Avg Score /5</p>
                    </div>
                  </div>
                  {/* Mood distribution */}
                  <div className="space-y-2">
                    {moodOptions.map(opt => {
                      const count = moodStats.counts[opt.mood] || 0;
                      const pct = Math.round((count / moodStats.total) * 100);
                      return (
                        <div key={opt.mood} className="flex items-center gap-2">
                          <span className="text-lg w-8">{opt.emoji}</span>
                          <div className="flex-1">
                            <Progress value={pct} className="h-2" />
                          </div>
                          <span className="text-xs text-muted-foreground w-12 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                  {moodStats.topMood && (
                    <p className="text-xs text-muted-foreground">
                      Most common mood: {moodOptions.find(o => o.mood === moodStats.topMood[0])?.emoji} {moodStats.topMood[0]}
                      {moodStats.topMeal && ` • Top meal: ${moodStats.topMeal[0]}`}
                    </p>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {/* Mood History */}
      {moodLog.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Recent Moods ({moodLog.length})</span>
              <div className="relative w-40">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-7 pl-7 text-xs" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredLog.slice(0, 20).map((entry, idx) => (
                <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{moodOptions.find(m => m.mood === entry.mood)?.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{entry.mealName || 'General'}</p>
                        <Badge variant="outline" className="text-[9px]">
                          {moodOptions.find(m => m.mood === entry.mood)?.score}/5
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      {entry.notes && <p className="text-xs text-muted-foreground/80 mt-0.5 truncate max-w-[200px]">{entry.notes}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteMood(entry.id)} className="text-destructive h-7 w-7 p-0"><Trash2 className="h-3 w-3" /></Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MealMoodTracker;
