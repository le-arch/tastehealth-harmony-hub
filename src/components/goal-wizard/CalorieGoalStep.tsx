import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface Props {
  formData: any;
  calculateCalories: () => number;
  onChange: (field: string, value: any) => void;
}

const CalorieGoalStep: React.FC<Props> = ({ formData, calculateCalories, onChange }) => {
  const recommended = calculateCalories();
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Set Your Calorie Goal</h2>
      <div className="bg-muted/50 p-4 rounded-md">
        <p className="text-sm">
          Based on your information, we recommend approximately{" "}
          <strong>{recommended} calories</strong> per day.
        </p>
      </div>
      <div className="space-y-4">
        <Label htmlFor="calories">
          Daily Calories: <span className="font-medium">{formData.dailyCalories}</span>
        </Label>
        <Slider
          id="calories"
          min={1000}
          max={4000}
          step={50}
          value={[formData.dailyCalories]}
          onValueChange={v => onChange('dailyCalories', v[0])}
          className="py-4"
        />
      </div>
      <div className="flex justify-between">
        <div className="text-center"><div className="text-sm text-muted-foreground">To lose weight</div><div className="font-medium">{recommended - 500}</div></div>
        <div className="text-center"><div className="text-sm text-muted-foreground">Maintain</div><div className="font-medium">{recommended}</div></div>
        <div className="text-center"><div className="text-sm text-muted-foreground">To gain weight</div><div className="font-medium">{recommended + 500}</div></div>
      </div>
    </div>
  );
};

export default CalorieGoalStep;
