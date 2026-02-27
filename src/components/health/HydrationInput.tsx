import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropletIcon } from 'lucide-react';

const HydrationInput = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DropletIcon size={18} className="text-blue-500" />
          Hydration Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">Database features removed.</p>
      </CardContent>
    </Card>
  );
};

export default HydrationInput;
