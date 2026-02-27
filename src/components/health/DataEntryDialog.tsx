
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CalorieTracker from './CalorieTracker';
import SleepTracker from './SleepTracker';
import ExerciseTracker from './ExerciseTracker';
import HydrationInput from './HydrationInput';
import BMICalculator from './BMICalculator';

export type DataEntryType = 'water' | 'sleep' | 'calories' | 'exercise' | 'bmi';

interface DataEntryDialogProps {
  type: DataEntryType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DataEntryDialog: React.FC<DataEntryDialogProps> = ({ type, open, onOpenChange }) => {
  const components: Record<DataEntryType, React.ReactNode> = {
    calories: <CalorieTracker />,
    sleep: <SleepTracker />,
    exercise: <ExerciseTracker />,
    water: <HydrationInput />,
    bmi: <BMICalculator />,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add {type.charAt(0).toUpperCase() + type.slice(1)} Data</DialogTitle></DialogHeader>
        {components[type]}
      </DialogContent>
    </Dialog>
  );
};

export default DataEntryDialog;
