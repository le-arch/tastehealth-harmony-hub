
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Droplet, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLS, setLS, LS_KEYS, HydrationEntry } from '@/utils/localStorage';
import { toast } from 'sonner';

const HydrationTracker = () => {
  const today = new Date().toDateString();
  const allEntries = getLS<HydrationEntry[]>(LS_KEYS.HYDRATION_LOG, []);
  const todayEntry = allEntries.find(e => new Date(e.date).toDateString() === today);
  const [cups, setCups] = useState(todayEntry?.cups || 0);
  const dailyGoal = 8;
  const pct = Math.min((cups / dailyGoal) * 100, 100);

  const saveCups = (newCups: number) => {
    setCups(newCups);
    const updated = allEntries.filter(e => new Date(e.date).toDateString() !== today);
    updated.push({ id: todayEntry?.id || crypto.randomUUID(), date: new Date().toISOString(), cups: newCups });
    setLS(LS_KEYS.HYDRATION_LOG, updated);
  };

  const addCup = () => { if (cups >= dailyGoal) { toast.success("Goal reached! 🎉"); return; } saveCups(cups + 1); };
  const removeCup = () => { if (cups > 0) saveCups(cups - 1); };

  return (
    <div className="space-y-4">
      <div className="relative h-32 w-32 mx-auto">
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center overflow-hidden">
          <motion.div className="absolute bottom-0 left-0 w-full bg-blue-500/60" animate={{ height: `${pct}%` }} transition={{ duration: 0.5 }} />
          <div className="z-10 flex flex-col items-center">
            <span className="text-lg font-bold">{cups}/{dailyGoal}</span>
            <span className="text-xs">cups</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <Button onClick={removeCup} variant="outline" size="sm" className="rounded-full w-8 h-8 p-0"><Minus className="h-3 w-3" /></Button>
        <Button onClick={addCup} size="sm" className="rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600"><Plus className="h-3 w-3" /></Button>
      </div>
    </div>
  );
};

export default HydrationTracker;
