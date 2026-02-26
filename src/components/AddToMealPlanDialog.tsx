
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddMealToMealPlanDialogProps {
  planId: string;
  dayOfWeek: string;
  mealTime: string;
  onMealAdded: () => void;
}

export function AddMealToMealPlanDialog({ dayOfWeek, mealTime, onMealAdded }: AddMealToMealPlanDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="add-meal">
          <Plus size={16} className="mr-2" />
          <span>Add Meal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Meal to {dayOfWeek} - {mealTime}</DialogTitle>
        </DialogHeader>
        <div className="py-8 text-center text-muted-foreground">
          <p>Database features have been removed.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
