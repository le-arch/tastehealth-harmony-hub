
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenderSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const GenderSelect: React.FC<GenderSelectProps> = ({ value, onChange, disabled }) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select gender" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="male">Male</SelectItem>
        <SelectItem value="female">Female</SelectItem>
        <SelectItem value="non-binary">Non-binary</SelectItem>
        <SelectItem value="other">Other</SelectItem>
        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default GenderSelect;
