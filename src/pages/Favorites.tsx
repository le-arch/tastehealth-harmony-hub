
import { useState } from "react";
import { ProfileSidebar } from "../components/profile/ProfileSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, FavoriteMeal } from "@/utils/localStorage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteMeal[]>(getLS(LS_KEYS.FAVORITES, []));
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const save = (updated: FavoriteMeal[]) => { setFavorites(updated); setLS(LS_KEYS.FAVORITES, updated); };

  const addFavorite = () => {
    if (!name.trim()) { toast.error("Enter a meal name"); return; }
    const meal: FavoriteMeal = { id: crypto.randomUUID(), name, calories: parseInt(calories) || 0, protein: parseInt(protein) || 0, carbs: parseInt(carbs) || 0, fats: parseInt(fats) || 0 };
    save([...favorites, meal]);
    toast.success(`${name} added to favorites!`);
    setName(''); setCalories(''); setProtein(''); setCarbs(''); setFats(''); setAddOpen(false);
  };

  const removeFavorite = (id: string) => { save(favorites.filter(f => f.id !== id)); toast.success("Removed from favorites"); };

  return (
    <div className="flex flex-col md:flex-row">
      <ProfileSidebar activePage="favorites" />
      <div className="flex-1 p-6 ml-0 md:ml-16 lg:ml-64">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2"><Heart className="h-6 w-6 text-red-500" />My Favorites</h1>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Add Favorite</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Favorite Meal</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Meal Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Caesar Salad" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Calories</Label><Input type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="0" /></div>
                  <div><Label>Protein (g)</Label><Input type="number" value={protein} onChange={e => setProtein(e.target.value)} placeholder="0" /></div>
                  <div><Label>Carbs (g)</Label><Input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} placeholder="0" /></div>
                  <div><Label>Fats (g)</Label><Input type="number" value={fats} onChange={e => setFats(e.target.value)} placeholder="0" /></div>
                </div>
                <Button onClick={addFavorite} disabled={!name.trim()} className="w-full">Add to Favorites</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No favorites yet. Add your favorite meals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map(f => (
              <Card key={f.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-red-500 fill-red-500" />{f.name}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeFavorite(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {f.calories > 0 && <Badge variant="secondary">{f.calories} kcal</Badge>}
                    {f.protein > 0 && <Badge variant="outline">{f.protein}g protein</Badge>}
                    {f.carbs > 0 && <Badge variant="outline">{f.carbs}g carbs</Badge>}
                    {f.fats > 0 && <Badge variant="outline">{f.fats}g fats</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
