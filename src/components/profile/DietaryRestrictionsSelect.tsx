
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DietaryRestriction {
  id: string;
  label: string;
  description: string;
}

interface DietaryRestrictionsSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const dietaryOptions: DietaryRestriction[] = [
  { id: "vegetarian", label: "Vegetarian", description: "No meat or fish. Includes dairy and eggs." },
  { id: "vegan", label: "Vegan", description: "No animal products at all — no dairy, eggs, or honey." },
  { id: "gluten-free", label: "Gluten-Free", description: "Avoids wheat, barley, rye, and related grains." },
  { id: "dairy-free", label: "Dairy-Free", description: "No milk, cheese, butter, or other dairy products." },
  { id: "nut-free", label: "Nut-Free", description: "Excludes all tree nuts and peanuts." },
  { id: "pescatarian", label: "Pescatarian", description: "Vegetarian diet plus fish and seafood." },
  { id: "keto", label: "Keto", description: "Very low carb, high fat diet to promote ketosis." },
  { id: "paleo", label: "Paleo", description: "Focuses on whole foods — no processed food, grains, or legumes." }
];

const DietaryRestrictionsSelect: React.FC<DietaryRestrictionsSelectProps> = ({ value, onChange, disabled }) => {
  const selectedItems = value ? value.split(',').filter(Boolean) : [];

  const handleCheckboxChange = (id: string) => {
    const currentItems = new Set(selectedItems);
    if (currentItems.has(id)) {
      currentItems.delete(id);
    } else {
      currentItems.add(id);
    }
    onChange(Array.from(currentItems).join(','));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
      {dietaryOptions.map((option) => (
        <div 
          key={option.id} 
          className="flex items-start space-x-2 rounded-md border p-3 hover:bg-muted/50 transition-colors"
        >
          <Checkbox 
            id={`dietary-${option.id}`} 
            checked={selectedItems.includes(option.id)} 
            onCheckedChange={() => handleCheckboxChange(option.id)}
            disabled={disabled}
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label 
              htmlFor={`dietary-${option.id}`}
              className="cursor-pointer font-medium text-sm"
            >
              {option.label}
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DietaryRestrictionsSelect;
