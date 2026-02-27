
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropletIcon, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, HydrationEntry } from '@/utils/localStorage';
import { motion } from 'framer-motion';

const HydrationInput = () => {
  const today = new Date().toDateString();
  const allEntries = getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []);
  const todayEntry = allEntries.find(e => new Date(e.date).toDateString() === today);
  const [cups, setCups] = useState(todayEntry?.cups || 0);
  const dailyGoal = 8;

  const saveCups = (newCups: number) => {
    setCups(newCups);
    const updated = allEntries.filter(e => new Date(e.date).toDateString() !== today);
    updated.push({ id: todayEntry?.id || crypto.randomUUID(), date: new Date().toISOString(), cups: newCups });
    setLS(LS_KEYS.HYDRATION_LOG, updated);
  };

  const addCup = () => {
    if (cups >= dailyGoal) { toast.success("Daily goal reached! 🎉"); return; }
    saveCups(cups + 1);
    if (cups + 1 === dailyGoal) toast.success("You hit your daily water goal! 💧");
  };

  const removeCup = () => { if (cups > 0) saveCups(cups - 1); };
  const pct = Math.min((cups / dailyGoal) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><DropletIcon size={18} className="text-blue-500" />Hydration Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-48 w-48 mx-auto">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center overflow-hidden">
            <motion.div className="absolute bottom-0 left-0 w-full bg-blue-500/60" animate={{ height: `${pct}%` }} transition={{ duration: 0.5 }} />
            <div className="z-10 flex flex-col items-center">
              <span className="text-2xl font-bold">{cups} / {dailyGoal}</span>
              <span className="text-sm text-muted-foreground">cups</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={removeCup} variant="destructive" size="sm" className="rounded-full w-10 h-10 p-0"><Minus className="h-4 w-4" /></Button>
          <Button onClick={addCup} size="sm" className="rounded-full w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600"><Plus className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HydrationInput;
