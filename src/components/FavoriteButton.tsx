
import type React from "react";
import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  mealId: string;
  favoriteId?: string;
  className?: string;
  size?: number;
  onToggle?: (isFavorited: boolean) => void;
}

export function FavoriteButton({ mealId, favoriteId, className, size = 20, onToggle }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(!!favoriteId);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !favorited;
    setFavorited(newState);
    onToggle?.(newState);
  };

  return (
    <button onClick={toggleFavorite} className={cn("transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none rounded-full p-1.5", favorited ? "text-red-500" : "text-gray-400 hover:text-red-500", className)} aria-label={favorited ? "Remove from favorites" : "Add to favorites"}>
      <Heart className={cn("transition-transform duration-300", favorited && "fill-current animate-pulse")} size={size} />
    </button>
  );
}
