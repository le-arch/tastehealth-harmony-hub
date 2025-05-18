"use client";

import { Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MultiSelectToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onRemoveSelected: () => void;
  isProcessing: boolean;
}

export function MultiSelectToolbar({
  selectedCount,
  onClearSelection,
  onRemoveSelected,
  isProcessing,
}: MultiSelectToolbarProps) {
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
          variant="destructive"
          size="sm"
          onClick={onRemoveSelected}
          disabled={isProcessing}
          className="flex items-center gap-1"
        >
          <Trash className="h-4 w-4" />
          <span className="hidden sm:inline">Remove</span>
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
