import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CalorieTracker = () => {
  return (
    <Card>
      <CardHeader><CardTitle>Calorie Tracker</CardTitle></CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">Database features removed.</p>
      </CardContent>
    </Card>
  );
};

export default CalorieTracker;
