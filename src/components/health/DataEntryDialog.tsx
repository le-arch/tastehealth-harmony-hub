import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export type DataEntryType = 'water' | 'sleep' | 'calories' | 'exercise' | 'bmi';

interface DataEntryDialogProps {
  type: DataEntryType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DataEntryDialog: React.FC<DataEntryDialogProps> = ({ type, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Data</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-center py-4">Database features removed.</p>
      </DialogContent>
    </Dialog>
  );
};

export default DataEntryDialog;
