
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MealSearchProps {
  onSelectMeal: (mealId: string) => void;
}

const MealSearch = ({ onSelectMeal }: MealSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Find Meals</h2>
        <div className="flex-1 relative">
          <Input placeholder="Search meals..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10" />
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <div className="text-center py-12">
        <p className="text-muted-foreground">Database features have been removed. No meals to display.</p>
      </div>
    </div>
  );
};

export default MealSearch;
