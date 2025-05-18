"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  addToFavorites,
  removeFavorite,
  isFavorite,
} from "@/services/favoriteService";
import { useToast } from "@/hooks/use-toast";

interface FavoriteButtonProps {
  mealId: string;
  favoriteId?: string;
  className?: string;
  size?: number;
  onToggle?: (isFavorited: boolean) => void;
}

export function FavoriteButton({
  mealId,
  favoriteId,
  className,
  size = 20,
  onToggle,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(!!favoriteId);
  const [loading, setLoading] = useState(false);
  const [currentFavoriteId, setCurrentFavoriteId] = useState(favoriteId);
  const { toast } = useToast();

  // Check if meal is already favorited on component mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!favoriteId) {
        const isAlreadyFavorite = await isFavorite(mealId);
        setFavorited(isAlreadyFavorite);
      }
    };

    checkFavoriteStatus();
  }, [mealId, favoriteId]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      if (favorited) {
        // Remove from favorites
        if (currentFavoriteId) {
          const success = await removeFavorite(currentFavoriteId);
          if (success) {
            setFavorited(false);
            setCurrentFavoriteId(undefined);
            toast({
              title: "Removed from favorites",
              description: "This meal has been removed from your favorites",
            });
            if (onToggle) onToggle(false);
          }
        }
      } else {
        // Add to favorites
        const favorite = await addToFavorites(mealId);
        if (favorite) {
          setFavorited(true);
          setCurrentFavoriteId(favorite.id);
          toast({
            title: "Added to favorites",
            description: "This meal has been added to your favorites",
          });
          if (onToggle) onToggle(true);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={cn(
        "transition-all duration-200 ease-in-out",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "rounded-full p-1.5",
        favorited ? "text-red-500" : "text-gray-400 hover:text-red-500",
        loading && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "transition-transform duration-300",
          favorited && "fill-current animate-pulse"
        )}
        size={size}
      />
    </button>
  );
}
