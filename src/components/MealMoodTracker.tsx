import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, MoodEntry } from '@/utils/localStorage';
import { Smile, Trash2 } from 'lucide-react';

const moodOptions = [
  { emoji: "😋", mood: "delicious", description: "Absolutely loved it!", color: "from-green-400 to-emerald-500" },
  { emoji: "😊", mood: "satisfied", description: "Pretty good", color: "from-blue-400 to-cyan-500" },
  { emoji: "😐", mood: "neutral", description: "It was okay", color: "from-amber-400 to-yellow-500" },
  { emoji: "😞", mood: "unsatisfied", description: "Not great", color: "from-orange-400 to-red-400" },
  { emoji: "🤢", mood: "terrible", description: "Did not enjoy at all", color: "from-red-500 to-rose-600" }
];

interface MealMoodTrackerProps {
  meal?: { id: string; name: string; };
  onSave?: () => void;
}

const MealMoodTracker: React.FC<MealMoodTrackerProps> = ({ meal, onSave }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [moodLog, setMoodLog] = useState<MoodEntry[]>(getLS(LS_KEYS.MOOD_LOG, []));

  const handleSave = () => {
    if (!selectedMood) return;
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood: selectedMood,
      notes,
      mealName: meal?.name || 'General',
    };
    const updated = [entry, ...moodLog];
    setMoodLog(updated);
    setLS(LS_KEYS.MOOD_LOG, updated);
    toast.success("Mood saved! 😊");
    setSelectedMood(null); setNotes("");
    onSave?.();
  };

  const deleteMood = (id: string) => {
    const updated = moodLog.filter(m => m.id !== id);
    setMoodLog(updated);
    setLS(LS_KEYS.MOOD_LOG, updated);
    toast.success("Mood entry deleted");
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
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
          <div className="flex justify-center gap-3">
            {moodOptions.map((option) => (
              <motion.button key={option.mood} whileHover={{ scale: 1.2, y: -5 }} whileTap={{ scale: 0.9 }}
                className={`text-3xl h-16 w-16 rounded-2xl flex items-center justify-center transition-all
                  ${selectedMood === option.mood ? `ring-3 ring-primary bg-gradient-to-br ${option.color} shadow-lg` : 'bg-muted hover:bg-muted/80'}`}
                onClick={() => setSelectedMood(option.mood)} title={option.description}>
                {option.emoji}
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {selectedMood && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <p className="text-center mb-2 font-medium">{moodOptions.find(o => o.mood === selectedMood)?.description}</p>
                <Textarea placeholder="Any additional notes about this meal?" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="justify-center">
          <Button disabled={!selectedMood} onClick={handleSave} className="w-full bg-gradient-to-r from-primary to-primary/80">Save Mood</Button>
        </CardFooter>
      </Card>

      {/* Mood History */}
      {moodLog.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Recent Moods ({moodLog.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {moodLog.slice(0, 10).map((entry, idx) => (
                <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{moodOptions.find(m => m.mood === entry.mood)?.emoji}</span>
                    <div>
                      <p className="text-sm font-medium">{entry.mealName || 'General'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
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
