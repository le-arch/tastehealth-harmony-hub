
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNutrition, Ingredient } from '../contexts/NutritionContext';
import { useToast } from '@/hooks/use-toast';
import DraggableIngredient from '@/components/DraggableIngredient';
import { BookmarkPlus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Confetti from '@/components/Confetti';

interface SelectedIngredient extends Ingredient {
  quantity: number;
}

const MealBuilder = () => {
  const { ingredients, createMeal, addMealToFavorites } = useNutrition();
  const { toast } = useToast();
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const [mealName, setMealName] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [activeDragIngredient, setActiveDragIngredient] = useState<Ingredient | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Calculate meal nutrition totals
  const totalCalories = selectedIngredients.reduce(
    (total, ing) => total + ing.calories * ing.quantity, 0
  );
  
  const totalProtein = selectedIngredients.reduce(
    (total, ing) => total + ing.protein * ing.quantity, 0
  );
  
  const totalCarbs = selectedIngredients.reduce(
    (total, ing) => total + ing.carbs * ing.quantity, 0
  );
  
  const totalFats = selectedIngredients.reduce(
    (total, ing) => total + ing.fats * ing.quantity, 0
  );
  
  // Handle drag events for drop zone
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    try {
      const droppedIngredient = JSON.parse(e.dataTransfer.getData('application/json')) as Ingredient;
      
      // Check if ingredient already exists in the meal
      const existingIndex = selectedIngredients.findIndex(
        (item) => item.id === droppedIngredient.id
      );
      
      if (existingIndex >= 0) {
        // Increment quantity if already in meal
        const updatedIngredients = [...selectedIngredients];
        updatedIngredients[existingIndex] = {
          ...updatedIngredients[existingIndex],
          quantity: updatedIngredients[existingIndex].quantity + 1,
        };
        setSelectedIngredients(updatedIngredients);
      } else {
        // Add new ingredient to meal
        setSelectedIngredients([
          ...selectedIngredients,
          { ...droppedIngredient, quantity: 1 },
        ]);
      }
      
      // Animate drop
      const dropPosition = {
        x: e.clientX,
        y: e.clientY,
      };
      
      createRippleEffect(dropPosition);
      
    } catch (error) {
      console.error('Error parsing dropped ingredient:', error);
    }
  };
  
  // Create ripple effect animation on drop
  const createRippleEffect = (position: { x: number; y: number }) => {
    if (!dropZoneRef.current) return;
    
    const dropZone = dropZoneRef.current;
    const rect = dropZone.getBoundingClientRect();
    
    const ripple = document.createElement('div');
    ripple.className = 'absolute rounded-full bg-primary/20 pointer-events-none';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.left = `${position.x - rect.left - 50}px`;
    ripple.style.top = `${position.y - rect.top - 50}px`;
    ripple.style.transform = 'scale(0)';
    
    dropZone.appendChild(ripple);
    
    setTimeout(() => {
      ripple.style.transform = 'scale(2)';
      ripple.style.opacity = '0';
      ripple.style.transition = 'all 0.6s ease-out';
      
      setTimeout(() => {
        dropZone.removeChild(ripple);
      }, 600);
    }, 10);
  };
  
  // Update ingredient quantity
  const updateIngredientQuantity = (id: string, quantity: number) => {
    if (quantity < 0) return;
    
    const updatedIngredients = selectedIngredients.map((ing) =>
      ing.id === id ? { ...ing, quantity } : ing
    );
    
    setSelectedIngredients(updatedIngredients);
  };
  
  // Remove ingredient from meal
  const removeIngredient = (id: string) => {
    setSelectedIngredients(selectedIngredients.filter((ing) => ing.id !== id));
  };
  
  // Save meal
  const saveMeal = async () => {
    if (!mealName.trim()) {
      toast({
        title: "Meal name required",
        description: "Please give your meal a name before saving.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedIngredients.length === 0) {
      toast({
        title: "No ingredients added",
        description: "Add some ingredients to your meal by dragging them into the drop zone.",
        variant: "destructive",
      });
      return;
    }
    
    // Create the meal object
    const newMeal = {
      id: uuidv4(),
      name: mealName,
      ingredients: selectedIngredients.map(({ id, name, calories, protein, carbs, fats, color, quantity }) => ({
        id,
        name,
        calories,
        protein,
        carbs,
        fats,
        color,
        quantity
      })),
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      isFavorite: false
    };
    
    try {
      // Save to database
      await createMeal(newMeal);
      
      // Show success animation
      setShowConfetti(true);
      
      // Reset form
      toast({
        title: "Meal created!",
        description: `${mealName} has been saved successfully.`,
      });
      
      // Reset form after delay
      setTimeout(() => {
        setMealName('');
        setSelectedIngredients([]);
        setShowConfetti(false);
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Error saving meal",
        description: "There was a problem saving your meal. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Save meal directly to favorites
  const saveToFavorites = async () => {
    if (!mealName.trim()) {
      toast({
        title: "Meal name required",
        description: "Please give your meal a name before saving.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedIngredients.length === 0) {
      toast({
        title: "No ingredients added",
        description: "Add some ingredients to your meal by dragging them into the drop zone.",
        variant: "destructive",
      });
      return;
    }
    
    // Create the meal object
    const newMeal = {
      id: uuidv4(),
      name: mealName,
      ingredients: selectedIngredients.map(({ id, name, calories, protein, carbs, fats, color, quantity }) => ({
        id,
        name,
        calories,
        protein,
        carbs,
        fats,
        color,
        quantity
      })),
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      isFavorite: true
    };
    
    try {
      // Create the meal
      await createMeal(newMeal);
      
      // Also add to favorites
      await addMealToFavorites(newMeal);
      
      // Show success animation
      setShowConfetti(true);
      
      toast({
        title: "Added to favorites!",
        description: `${mealName} has been saved to your favorites.`,
      });
      
      // Reset form after delay
      setTimeout(() => {
        setMealName('');
        setSelectedIngredients([]);
        setShowConfetti(false);
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Error saving to favorites",
        description: "There was a problem saving your meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Confetti active={showConfetti} />
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Meal Builder</h1>
        <p className="text-muted-foreground">
          Drag and drop ingredients to create your perfect meal
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ingredients Panel */}
        <Card className="lg:col-span-1 nutrition-card">
          <CardHeader className="pb-2">
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {ingredients.map((ingredient) => (
                <DraggableIngredient
                  key={ingredient.id}
                  ingredient={ingredient}
                  onDragStart={setActiveDragIngredient}
                  onDragEnd={() => setActiveDragIngredient(null)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Meal Builder */}
        <Card className="lg:col-span-2 nutrition-card">
          <CardHeader className="pb-2">
            <CardTitle>Build Your Meal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="mealName">Meal Name</Label>
                <Input 
                  id="mealName" 
                  value={mealName} 
                  onChange={(e) => setMealName(e.target.value)} 
                  placeholder="Give your meal a name"
                  className="mt-1"
                />
              </div>
              
              <div 
                ref={dropZoneRef}
                className={`border-2 border-dashed rounded-xl p-4 min-h-40 relative overflow-hidden ${
                  isDraggingOver ? 'border-primary bg-primary/5' : 'border-border'
                } ${
                  selectedIngredients.length === 0 ? 'flex items-center justify-center' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedIngredients.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    <p>Drag and drop ingredients here</p>
                    <p className="text-sm mt-1">Or tap an ingredient to add it to your meal</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedIngredients.map((ing) => (
                      <div 
                        key={ing.id} 
                        className="flex items-center justify-between p-3 rounded-lg animate-fade-in"
                        style={{ backgroundColor: `${ing.color}10` }}
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-8 h-8 rounded-full mr-3 flex items-center justify-center"
                            style={{ backgroundColor: ing.color }}
                          >
                            <span className="text-white text-sm font-bold">
                              {ing.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{ing.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {ing.calories * ing.quantity} kcal
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => updateIngredientQuantity(ing.id, ing.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-6 text-center">{ing.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => updateIngredientQuantity(ing.id, ing.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeIngredient(ing.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedIngredients.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Nutrition Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-sm text-muted-foreground">Total Calories</div>
                      <div className="text-2xl font-bold">{Math.round(totalCalories)} kcal</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-nutrition-protein/10 p-2 rounded-md text-center">
                        <div className="text-xs text-muted-foreground">Protein</div>
                        <div className="font-medium">{Math.round(totalProtein)}g</div>
                      </div>
                      
                      <div className="bg-nutrition-carbs/10 p-2 rounded-md text-center">
                        <div className="text-xs text-muted-foreground">Carbs</div>
                        <div className="font-medium">{Math.round(totalCarbs)}g</div>
                      </div>
                      
                      <div className="bg-nutrition-fats/10 p-2 rounded-md text-center">
                        <div className="text-xs text-muted-foreground">Fats</div>
                        <div className="font-medium">{Math.round(totalFats)}g</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={saveMeal} 
                  className="flex-1"
                  disabled={selectedIngredients.length === 0 || !mealName.trim()}
                >
                  Save Meal
                </Button>
                
                <Button 
                  onClick={saveToFavorites} 
                  variant="outline"
                  className="flex-1 gap-2"
                  disabled={selectedIngredients.length === 0 || !mealName.trim()}
                >
                  <BookmarkPlus className="h-4 w-4" />
                  Save to Favorites
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MealBuilder;
