import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

const HydrationTracker = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const dailyGoal = 8;
  const waterPercentage = Math.min((waterIntake / dailyGoal) * 100, 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Droplet className="mr-2 text-blue-500" />
          Hydration Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative h-48 w-48 mx-auto mb-4">
          <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <motion.div className="absolute bottom-0 left-0 w-full bg-blue-500" animate={{ height: `${waterPercentage}%` }} transition={{ duration: 0.5 }} />
            </div>
            <div className="z-10 flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-800">{waterIntake} / {dailyGoal}</span>
              <span className="text-sm">cups</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))} variant="destructive" size="sm" className="rounded-full w-10 h-10 p-0">-</Button>
          <Button onClick={() => setWaterIntake(Math.min(dailyGoal, waterIntake + 1))} size="sm" className="rounded-full w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600">+</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HydrationTracker;
