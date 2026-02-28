
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Heart, ArrowLeft, Clock, Users, ChefHat } from "lucide-react";
import { MEAL_DATABASE, MEAL_CATEGORIES, MealDBItem, MealCategory } from "@/data/mealDatabase";
import { getLS, setLS, LS_KEYS, FavoriteMeal } from "@/utils/localStorage";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MealSearchProps {
  onSelectMeal: (mealId: string) => void;
}

const MealSearch = ({ onSelectMeal }: MealSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMeal, setSelectedMeal] = useState<MealDBItem | null>(null);
  const [favorites, setFavorites] = useState<FavoriteMeal[]>(getLS(LS_KEYS.FAVORITES, []));

  const filtered = MEAL_DATABASE.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "all" || m.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const isFavorited = (id: string) => favorites.some(f => f.id === id);

  const toggleFavorite = (meal: MealDBItem) => {
    let updated: FavoriteMeal[];
    if (isFavorited(meal.id)) {
      updated = favorites.filter(f => f.id !== meal.id);
      toast.success(`${meal.name} removed from favorites`);
    } else {
      updated = [...favorites, {
        id: meal.id, name: meal.name, calories: meal.nutrition.calories,
        protein: meal.nutrition.protein, carbs: meal.nutrition.carbs,
        fats: meal.nutrition.fats, imageUrl: meal.image, category: meal.category,
      }];
      toast.success(`${meal.name} added to favorites!`);
    }
    setFavorites(updated);
    setLS(LS_KEYS.FAVORITES, updated);
  };

  if (selectedMeal) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setSelectedMeal(null)} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to meals
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <img src={selectedMeal.image} alt={selectedMeal.name} className="w-full h-64 object-cover rounded-xl" />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedMeal.name}</h2>
                <p className="text-muted-foreground">{selectedMeal.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => toggleFavorite(selectedMeal)}>
                <Heart className={`h-6 w-6 ${isFavorited(selectedMeal.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
              </Button>
            </div>
            <Badge className="mt-2 capitalize">{selectedMeal.category}</Badge>
          </div>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-3 text-lg">Nutrition Facts</h3>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Nutrient</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow><TableCell>Calories</TableCell><TableCell className="text-right font-medium">{selectedMeal.nutrition.calories} kcal</TableCell></TableRow>
                    <TableRow><TableCell>Protein</TableCell><TableCell className="text-right">{selectedMeal.nutrition.protein}g</TableCell></TableRow>
                    <TableRow><TableCell>Carbohydrates</TableCell><TableCell className="text-right">{selectedMeal.nutrition.carbs}g</TableCell></TableRow>
                    <TableRow><TableCell>Fats</TableCell><TableCell className="text-right">{selectedMeal.nutrition.fats}g</TableCell></TableRow>
                    <TableRow><TableCell>Fiber</TableCell><TableCell className="text-right">{selectedMeal.nutrition.fiber}g</TableCell></TableRow>
                    <TableRow><TableCell>Sugar</TableCell><TableCell className="text-right">{selectedMeal.nutrition.sugar}g</TableCell></TableRow>
                    <TableRow><TableCell>Sodium</TableCell><TableCell className="text-right">{selectedMeal.nutrition.sodium}mg</TableCell></TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-3 text-lg flex items-center gap-2"><ChefHat className="h-5 w-5" /> Ingredients</h3>
              <ul className="space-y-1">
                {selectedMeal.recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm py-1 border-b last:border-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-3 text-lg flex items-center gap-2"><Clock className="h-5 w-5" /> Method</h3>
              <ol className="space-y-2">
                {selectedMeal.recipe.method.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm py-1">
                    <span className="font-bold text-primary shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Input placeholder="Search meals by name or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant={selectedCategory === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedCategory("all")}>All</Badge>
        {MEAL_CATEGORIES.map(cat => (
          <Badge key={cat} variant={selectedCategory === cat ? "default" : "outline"} className="cursor-pointer capitalize" onClick={() => setSelectedCategory(cat)}>{cat}</Badge>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-12"><p className="text-muted-foreground">No meals found matching your search.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(meal => (
            <Card key={meal.id} className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group" onClick={() => setSelectedMeal(meal)}>
              <div className="relative">
                <img src={meal.image} alt={meal.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full" onClick={(e) => { e.stopPropagation(); toggleFavorite(meal); }}>
                  <Heart className={`h-4 w-4 ${isFavorited(meal.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Badge className="absolute bottom-2 left-2 capitalize">{meal.category}</Badge>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm mb-1">{meal.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{meal.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">{meal.nutrition.calories} kcal</Badge>
                  <Badge variant="outline" className="text-xs">{meal.nutrition.protein}g protein</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealSearch;
