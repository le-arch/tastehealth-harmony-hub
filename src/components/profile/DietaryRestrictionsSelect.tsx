
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DietaryRestriction {
  id: string;
  label: string;
}

interface DietaryRestrictionsSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const dietaryOptions: DietaryRestriction[] = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "nut-free", label: "Nut-Free" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" }
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
          className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50"
        >
          <Checkbox 
            id={`dietary-${option.id}`} 
            checked={selectedItems.includes(option.id)} 
            onCheckedChange={() => handleCheckboxChange(option.id)}
            disabled={disabled}
          />
          <Label 
            htmlFor={`dietary-${option.id}`}
            className="cursor-pointer w-full"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default DietaryRestrictionsSelect;
