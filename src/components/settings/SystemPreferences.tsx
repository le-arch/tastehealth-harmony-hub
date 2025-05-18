
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SystemPreferencesProps {
  useMetricSystem: boolean;
  onMetricSystemChange: (checked: boolean) => void;
  label: string;
}

export const SystemPreferences: React.FC<SystemPreferencesProps> = ({
  useMetricSystem,
  onMetricSystemChange,
  label,
}) => {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="metric-system" className="flex flex-col space-y-1">
        <span>{label}</span>
      </Label>
      <Switch
        id="metric-system"
        checked={useMetricSystem}
        onCheckedChange={onMetricSystemChange}
      />
    </div>
  );
};
