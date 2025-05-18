
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookmarkPlus, Bookmark } from 'lucide-react';
import { Meal } from '../contexts/NutritionContext';

interface NutritionCardProps {
  meal: Meal;
  onFavoriteToggle: () => void;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ 
  meal, 
  onFavoriteToggle 
}) => {
  return (
    <Card className="nutrition-card overflow-hidden animate-bounce-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{meal.name}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onFavoriteToggle}
            className="text-secondary hover:text-secondary/80 transition-colors"
          >
            {meal.isFavorite ? (
              <Bookmark className="h-5 w-5 fill-current" />
            ) : (
              <BookmarkPlus className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {meal.imageUrl && (
          <div className="aspect-video overflow-hidden rounded-md">
            <img 
              src={meal.imageUrl} 
              alt={meal.name} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}

        <div className="flex justify-between text-sm text-foreground/80">
          <span>Total calories</span>
          <span className="font-medium">{meal.totalCalories} kcal</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Protein</span>
            <span>{Math.round(meal.totalProtein)}g</span>
          </div>
          <Progress value={meal.totalProtein / (meal.totalProtein + meal.totalCarbs + meal.totalFats) * 100} className="h-2 bg-muted" indicatorClassName="bg-nutrition-protein" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Carbs</span>
            <span>{Math.round(meal.totalCarbs)}g</span>
          </div>
          <Progress value={meal.totalCarbs / (meal.totalProtein + meal.totalCarbs + meal.totalFats) * 100} className="h-2 bg-muted" indicatorClassName="bg-nutrition-carbs" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Fats</span>
            <span>{Math.round(meal.totalFats)}g</span>
          </div>
          <Progress value={meal.totalFats / (meal.totalProtein + meal.totalCarbs + meal.totalFats) * 100} className="h-2 bg-muted" indicatorClassName="bg-nutrition-fats" />
        </div>
      </CardContent>
      
      <CardFooter className="pt-1 flex-wrap gap-2">
        {meal.ingredients.map((ingredient, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            style={{ backgroundColor: ingredient.color + '20', color: ingredient.color }}
            className="rounded-full text-xs"
          >
            {ingredient.name}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};

export default NutritionCard;
