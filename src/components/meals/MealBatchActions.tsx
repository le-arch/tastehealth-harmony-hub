"use client";

import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MealBatchActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAddToFavorites: () => Promise<void>;
  isProcessing: boolean;
  selectedMealIds: string[];
}

export function MealBatchActions({
  selectedCount,
  onClearSelection,
  onAddToFavorites,
  isProcessing,
  selectedMealIds,
}: MealBatchActionsProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border shadow-lg rounded-lg px-4 py-3 z-50 flex items-center gap-4"
      style={{ width: "calc(100% - 2rem)", maxWidth: "500px" }}
    >
      <div className="flex-1">
        <span className="font-medium">{selectedCount}</span> items selected
      </div>
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={onAddToFavorites}
          disabled={isProcessing}
          className="flex items-center gap-1"
        >
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Add to Favorites</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          disabled={isProcessing}
        >
          <X className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Cancel</span>
        </Button>
      </div>
    </motion.div>
  );
}
