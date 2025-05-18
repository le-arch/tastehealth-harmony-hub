
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityLevelSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ActivityLevelSelect: React.FC<ActivityLevelSelectProps> = ({ value, onChange, disabled }) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select activity level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
        <SelectItem value="lightly-active">Lightly active (light exercise 1-3 days/week)</SelectItem>
        <SelectItem value="moderately-active">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
        <SelectItem value="very-active">Very active (hard exercise 6-7 days/week)</SelectItem>
        <SelectItem value="extra-active">Extra active (very hard exercise & physical job)</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ActivityLevelSelect;
