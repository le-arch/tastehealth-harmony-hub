import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type MacroField = 'proteinPercentage' | 'carbsPercentage' | 'fatsPercentage';

interface Props {
  formData: {
    dailyCalories: number;
    proteinPercentage: number;
    carbsPercentage: number;
    fatsPercentage: number;
  };
  onMacroChange: (macro: MacroField, value: number) => void;
}

const MacroStep: React.FC<Props> = ({ formData, onMacroChange }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold">Customize Your Macronutrients</h2>
    <div className="bg-muted/50 p-4 rounded-md">
      <p className="text-sm">Adjust the percentage of each macronutrient to match your dietary preferences. The total must equal 100%.</p>
    </div>
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="protein" className="flex items-center"><div className="w-3 h-3 rounded-full bg-nutrition-protein mr-2" />Protein</Label>
          <div className="font-medium text-sm">{formData.proteinPercentage}% ({Math.round((formData.dailyCalories * formData.proteinPercentage / 100) / 4)}g)</div>
        </div>
        <Slider id="protein" min={10} max={60} step={1} value={[formData.proteinPercentage]} onValueChange={v => onMacroChange('proteinPercentage', v[0])} className="py-2" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="carbs" className="flex items-center"><div className="w-3 h-3 rounded-full bg-nutrition-carbs mr-2" />Carbohydrates</Label>
          <div className="font-medium text-sm">{formData.carbsPercentage}% ({Math.round((formData.dailyCalories * formData.carbsPercentage / 100) / 4)}g)</div>
        </div>
        <Slider id="carbs" min={10} max={60} step={1} value={[formData.carbsPercentage]} onValueChange={v => onMacroChange('carbsPercentage', v[0])} className="py-2" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="fats" className="flex items-center"><div className="w-3 h-3 rounded-full bg-nutrition-fats mr-2" />Fats</Label>
          <div className="font-medium text-sm">{formData.fatsPercentage}% ({Math.round((formData.dailyCalories * formData.fatsPercentage / 100) / 9)}g)</div>
        </div>
        <Slider id="fats" min={10} max={60} step={1} value={[formData.fatsPercentage]} onValueChange={v => onMacroChange('fatsPercentage', v[0])} className="py-2" />
      </div>
    </div>
    <div className="pt-2">
      <div className="h-6 w-full rounded-full overflow-hidden flex">
        <div className="bg-nutrition-protein h-full" style={{ width: `${formData.proteinPercentage}%` }} />
        <div className="bg-nutrition-carbs h-full" style={{ width: `${formData.carbsPercentage}%` }} />
        <div className="bg-nutrition-fats h-full" style={{ width: `${formData.fatsPercentage}%` }} />
      </div>
    </div>
  </div>
);

export default MacroStep;
