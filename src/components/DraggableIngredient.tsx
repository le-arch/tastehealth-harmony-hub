
import { useState } from 'react';
import { Ingredient } from '../contexts/NutritionContext';

interface DraggableIngredientProps {
  ingredient: Ingredient;
  onDragStart: (ingredient: Ingredient) => void;
  onDragEnd: () => void;
}

const DraggableIngredient: React.FC<DraggableIngredientProps> = ({
  ingredient,
  onDragStart,
  onDragEnd
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(ingredient));
    setIsDragging(true);
    onDragStart(ingredient);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`nutrition-drag flex flex-col items-center p-3 rounded-lg ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ 
        backgroundColor: `${ingredient.color}20`,
        borderColor: ingredient.color 
      }}
    >
      <div 
        className="w-10 h-10 mb-2 rounded-full flex items-center justify-center"
        style={{ backgroundColor: ingredient.color }}
      >
        <span className="text-white text-lg font-bold">
          {ingredient.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <span className="text-sm font-medium">{ingredient.name}</span>
      <span className="text-xs text-foreground/70">
        {ingredient.calories} kcal
      </span>
    </div>
  );
};

export default DraggableIngredient;
