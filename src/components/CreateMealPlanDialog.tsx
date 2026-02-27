
import type React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLS, setLS, LS_KEYS, MealPlan, createEmptyWeek } from "@/utils/localStorage";

interface CreateMealPlanDialogProps {
  onMealPlanCreated?: () => void;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
}

export function CreateMealPlanDialog({ onMealPlanCreated, buttonText = "Create Meal Plan", buttonIcon = <Plus className="mr-2 h-4 w-4" /> }: CreateMealPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plans = getLS<MealPlan[]>(LS_KEYS.MEAL_PLANS, []);
    const newPlan: MealPlan = {
      id: crypto.randomUUID(), name, description, created_at: new Date().toISOString(),
      days: createEmptyWeek(),
    };
    setLS(LS_KEYS.MEAL_PLANS, [...plans, newPlan]);
    toast.success("Meal plan created!");
    setOpen(false); setName(""); setDescription("");
    onMealPlanCreated?.();
    // Force re-render by dispatching storage event
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{buttonIcon}{language === 'fr' ? "Créer un Plan de Repas" : buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{language === 'fr' ? "Créer un Plan de Repas" : "Create Meal Plan"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="plan-name" className="block text-sm font-medium mb-1">Plan Name</label>
            <Input id="plan-name" placeholder="Enter plan name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="plan-description" className="block text-sm font-medium mb-1">Description</label>
            <Textarea id="plan-description" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <Button type="submit" disabled={!name} className="w-full">Create Plan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
