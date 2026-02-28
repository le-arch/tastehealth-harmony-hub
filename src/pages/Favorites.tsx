
import { useState } from "react";
import { ProfileSidebar } from "../components/profile/ProfileSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Trash2, Star, Search } from "lucide-react";
import { toast } from "sonner";
import { getLS, setLS, LS_KEYS, FavoriteMeal } from "@/utils/localStorage";
import { Badge } from "@/components/ui/badge";
import { MEAL_CATEGORIES } from "@/data/mealDatabase";
import { useScreenSize } from "@/utils/mobile";

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteMeal[]>(getLS(LS_KEYS.FAVORITES, []));
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { isMobile } = useScreenSize();

  const save = (updated: FavoriteMeal[]) => { setFavorites(updated); setLS(LS_KEYS.FAVORITES, updated); };
  const removeFavorite = (id: string) => { save(favorites.filter(f => f.id !== id)); toast.success("Removed from favorites"); };

  const filtered = favorites.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === "all" || (f as any).category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <ProfileSidebar activePage="favorites" />
      <div className={`flex-1 p-4 sm:p-6 ${isMobile ? 'mt-16' : 'md:ml-64'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Heart className="h-6 w-6 text-red-500" />My Favorites</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Input placeholder="Search favorites..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant={filterCategory === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilterCategory("all")}>All ({favorites.length})</Badge>
            {MEAL_CATEGORIES.map(cat => {
              const count = favorites.filter((f: any) => f.category === cat).length;
              return (
                <Badge key={cat} variant={filterCategory === cat ? "default" : "outline"} className="cursor-pointer capitalize" onClick={() => setFilterCategory(cat)}>
                  {cat} ({count})
                </Badge>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{favorites.length === 0 ? "No favorites yet. Browse the Meal Search to add meals!" : "No favorites match this filter."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(f => (
                <Card key={f.id} className="hover:shadow-md transition-shadow overflow-hidden">
                  {(f as any).imageUrl && (
                    <img src={(f as any).imageUrl} alt={f.name} className="w-full h-36 object-cover" />
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-red-500 fill-red-500" />{f.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeFavorite(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {(f as any).category && <Badge className="capitalize">{(f as any).category}</Badge>}
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
    </div>
  );
}
