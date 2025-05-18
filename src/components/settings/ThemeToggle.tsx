import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  checked,
  onCheckedChange,
  label,
}) => {
  return (
    <div className="flex items-center justify-between">
      <Label
        htmlFor="theme"
        className="flex flex-col space-y-1 text-gray-900 dark:text-gray-100"
      >
        <span>{label}</span>
      </Label>
      <div className="flex items-center space-x-2">
        <Sun className="h-5 w-5" />
        <Switch
          id="theme"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <Moon className="h-5 w-5" />
      </div>
    </div>
  );
};
