
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useScreenSize } from "@/utils/mobile";

interface Props {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const NutritionGoalForm: React.FC<Props> = ({ formData, onChange }) => {
  const { isMobile, isTablet } = useScreenSize();
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">Tell us about yourself</h2>
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 sm:gap-4`}>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" value={formData.age} onChange={e => onChange('age', parseInt(e.target.value))} min={18} max={100} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select id="gender" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.gender} onChange={e => onChange('gender', e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input id="height" type="number" value={formData.height} onChange={e => onChange('height', parseInt(e.target.value))} min={100} max={250} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input id="weight" type="number" value={formData.weight} onChange={e => onChange('weight', parseInt(e.target.value))} min={30} max={300} />
        </div>
      </div>
      <div className="space-y-2 sm:space-y-3">
        <Label htmlFor="activityLevel">Activity Level</Label>
        <select 
          id="activityLevel" 
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" 
          value={formData.activityLevel} 
          onChange={e => onChange('activityLevel', e.target.value)}
        >
          <option value="sedentary">Sedentary (little or no exercise)</option>
          <option value="light">Light (exercise 1-3 days/week)</option>
          <option value="moderate">Moderate (exercise 3-5 days/week)</option>
          <option value="active">Active (exercise 6-7 days/week)</option>
          <option value="veryActive">Very Active (physical job or intense exercise)</option>
        </select>
      </div>
      <div className="space-y-2 sm:space-y-3">
        <Label htmlFor="goal">Your Goal</Label>
        <select 
          id="goal" 
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" 
          value={formData.goal} 
          onChange={e => onChange('goal', e.target.value)}
        >
          <option value="lose">Lose Weight</option>
          <option value="maintain">Maintain Weight</option>
          <option value="gain">Gain Weight</option>
        </select>
      </div>
    </div>
  );
};

export default NutritionGoalForm;
