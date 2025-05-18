
import React from 'react';
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface HealthGoalsSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const HealthGoalsSelect: React.FC<HealthGoalsSelectProps> = ({ value, onChange, disabled }) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      className="grid grid-cols-1 gap-2 pt-1"
    >
      <div>
        <RadioGroupItem value="weight-loss" id="weight-loss" className="peer sr-only" />
        <Label
          htmlFor="weight-loss"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-th-green-600 [&:has([data-state=checked])]:border-th-green-600"
        >
          <div className="flex w-full items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Weight Loss</p>
              <p className="text-sm text-muted-foreground">
                Reduce body weight with healthy nutrition
              </p>
            </div>
            {value === "weight-loss" && (
              <CheckIcon className="h-5 w-5 text-th-green-600" />
            )}
          </div>
        </Label>
      </div>

      <div>
        <RadioGroupItem value="weight-gain" id="weight-gain" className="peer sr-only" />
        <Label
          htmlFor="weight-gain"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-th-green-600 [&:has([data-state=checked])]:border-th-green-600"
        >
          <div className="flex w-full items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Weight Gain</p>
              <p className="text-sm text-muted-foreground">
                Increase body weight in a healthy way
              </p>
            </div>
            {value === "weight-gain" && (
              <CheckIcon className="h-5 w-5 text-th-green-600" />
            )}
          </div>
        </Label>
      </div>

      <div>
        <RadioGroupItem value="maintain" id="maintain" className="peer sr-only" />
        <Label
          htmlFor="maintain"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-th-green-600 [&:has([data-state=checked])]:border-th-green-600"
        >
          <div className="flex w-full items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Maintain Weight</p>
              <p className="text-sm text-muted-foreground">
                Keep your current weight with balanced nutrition
              </p>
            </div>
            {value === "maintain" && (
              <CheckIcon className="h-5 w-5 text-th-green-600" />
            )}
          </div>
        </Label>
      </div>

      <div>
        <RadioGroupItem value="muscle-gain" id="muscle-gain" className="peer sr-only" />
        <Label
          htmlFor="muscle-gain"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-th-green-600 [&:has([data-state=checked])]:border-th-green-600"
        >
          <div className="flex w-full items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Muscle Gain</p>
              <p className="text-sm text-muted-foreground">
                Build muscle mass with proper nutrition
              </p>
            </div>
            {value === "muscle-gain" && (
              <CheckIcon className="h-5 w-5 text-th-green-600" />
            )}
          </div>
        </Label>
      </div>

      <div>
        <RadioGroupItem value="overall-health" id="overall-health" className="peer sr-only" />
        <Label
          htmlFor="overall-health"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-th-green-600 [&:has([data-state=checked])]:border-th-green-600"
        >
          <div className="flex w-full items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Overall Health</p>
              <p className="text-sm text-muted-foreground">
                Improve general health and wellbeing
              </p>
            </div>
            {value === "overall-health" && (
              <CheckIcon className="h-5 w-5 text-th-green-600" />
            )}
          </div>
        </Label>
      </div>
    </RadioGroup>
  );
};

export default HealthGoalsSelect;
