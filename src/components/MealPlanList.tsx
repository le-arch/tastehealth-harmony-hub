
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDays, Trash2, Plus, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getLS, setLS, LS_KEYS, MealPlan, MealPlanItem, DAYS_OF_WEEK, createEmptyWeek } from '@/utils/localStorage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MEAL_DATABASE } from '@/data/mealDatabase';

type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks';
const CATEGORIES: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

export function MealPlanList() {
  const { language } = useLanguage();
  const [plans, setPlans] = useState<MealPlan[]>(getLS(LS_KEYS.MEAL_PLANS, []));
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addDay, setAddDay] = useState(DAYS_OF_WEEK[0]);
  const [addCategory, setAddCategory] = useState<MealCategory>('breakfast');
  const [addMealName, setAddMealName] = useState('');
  const [addMealCalories, setAddMealCalories] = useState('');
  const [addMealMode, setAddMealMode] = useState<'database' | 'custom'>('database');
  const [mealSearch, setMealSearch] = useState('');

  const save = (updated: MealPlan[]) => { setPlans(updated); setLS(LS_KEYS.MEAL_PLANS, updated); };

  const deletePlan = (id: string) => {
    save(plans.filter(p => p.id !== id));
    if (selectedPlan === id) setSelectedPlan(null);
    toast.success("Plan deleted");
  };

  const plan = plans.find(p => p.id === selectedPlan);

  const addMealToPlan = () => {
    if (!addMealName.trim() || !plan) return;
    const meal: MealPlanItem = { id: crypto.randomUUID(), name: addMealName, calories: parseInt(addMealCalories) || 0 };
    const updated = plans.map(p => {
      if (p.id !== plan.id) return p;
      const days = { ...p.days };
      if (!days[addDay]) days[addDay] = { breakfast: [], lunch: [], dinner: [], snacks: [] };
      days[addDay] = { ...days[addDay], [addCategory]: [...days[addDay][addCategory], meal] };
      return { ...p, days };
    });
    save(updated);
    toast.success(`${addMealName} added to ${addDay} ${addCategory}`);
    setAddMealName(''); setAddMealCalories(''); setAddOpen(false);
    setMealSearch('');
  };

  const addDatabaseMealToPlan = (dbMeal: any) => {
    if (!plan) return;
    const meal: MealPlanItem = { id: crypto.randomUUID(), name: dbMeal.name, calories: dbMeal.nutrition.calories };
    const updated = plans.map(p => {
      if (p.id !== plan.id) return p;
      const days = { ...p.days };
      if (!days[addDay]) days[addDay] = { breakfast: [], lunch: [], dinner: [], snacks: [] };
      days[addDay] = { ...days[addDay], [addCategory]: [...days[addDay][addCategory], meal] };
      return { ...p, days };
    });
    save(updated);
    toast.success(`${dbMeal.name} added to ${addDay} ${addCategory}`);
    setAddMealName(''); setAddMealCalories(''); setAddOpen(false);
    setMealSearch('');
  };

  const filteredMeals = MEAL_DATABASE.filter(m => 
    m.name.toLowerCase().includes(mealSearch.toLowerCase()) &&
    m.category === addCategory
  );

  const removeMeal = (day: string, category: MealCategory, mealId: string) => {
    if (!plan) return;
    const updated = plans.map(p => {
      if (p.id !== plan.id) return p;
      const days = { ...p.days };
      days[day] = { ...days[day], [category]: days[day][category].filter((m: MealPlanItem) => m.id !== mealId) };
      return { ...p, days };
    });
    save(updated);
    toast.success("Meal removed");
  };

  const t = language === 'fr'
    ? { noPlan: "Aucun plan sélectionné", noPlans: "Aucun plan de repas", create: "Créez un plan pour commencer", selectPlan: "Sélectionner", delete: "Supprimer", addMeal: "Ajouter un repas", day: "Jour", category: "Catégorie", name: "Nom", calories: "Calories", add: "Ajouter", back: "Retour" }
    : { noPlan: "No plan selected", noPlans: "No meal plans yet", create: "Create a plan to get started", selectPlan: "View", delete: "Delete", addMeal: "Add Meal", day: "Day", category: "Category", name: "Meal Name", calories: "Calories", add: "Add", back: "Back to Plans" };

  if (selectedPlan && plan) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedPlan(null)}>{t.back}</Button>
          <h2 className="text-xl font-bold">{plan.name}</h2>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />{t.addMeal}</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>{t.addMeal}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>{t.day}</Label>
                    <Select value={addDay} onValueChange={setAddDay}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DAYS_OF_WEEK.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label>{t.category}</Label>
                    <Select value={addCategory} onValueChange={(v) => { setAddCategory(v as MealCategory); setMealSearch(''); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent></Select>
                  </div>
                </div>

                <Tabs value={addMealMode} onValueChange={(v) => { setAddMealMode(v as 'database' | 'custom'); setAddMealName(''); setAddMealCalories(''); }}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="database">From Database</TabsTrigger>
                    <TabsTrigger value="custom">Custom Meal</TabsTrigger>
                  </TabsList>

                  <TabsContent value="database" className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search meals..." 
                        value={mealSearch} 
                        onChange={(e) => setMealSearch(e.target.value)} 
                        className="pl-8"
                      />
                    </div>
                    <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-3 bg-muted/50">
                      {filteredMeals.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No meals found in this category</p>
                      ) : (
                        filteredMeals.map(meal => (
                          <div key={meal.id} className="flex items-center justify-between p-2 bg-background border rounded-lg hover:bg-muted transition-colors">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{meal.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {meal.nutrition.calories} kcal • P: {meal.nutrition.protein}g • C: {meal.nutrition.carbs}g • F: {meal.nutrition.fats}g
                              </p>
                            </div>
                            <Button size="sm" onClick={() => addDatabaseMealToPlan(meal)}>Add</Button>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-3">
                    <div><Label>{t.name}</Label><Input value={addMealName} onChange={e => setAddMealName(e.target.value)} placeholder="e.g. Grilled Chicken Salad" /></div>
                    <div><Label>{t.calories}</Label><Input type="number" value={addMealCalories} onChange={e => setAddMealCalories(e.target.value)} placeholder="e.g. 450" /></div>
                    <Button onClick={addMealToPlan} disabled={!addMealName.trim()} className="w-full">{t.add}</Button>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="border p-2 bg-muted text-left font-medium w-24">{t.day}</th>
                {CATEGORIES.map(c => <th key={c} className="border p-2 bg-muted text-left font-medium capitalize">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {DAYS_OF_WEEK.map(day => {
                const dayData = plan.days[day] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
                return (
                  <tr key={day}>
                    <td className="border p-2 font-medium text-sm bg-muted/50">{day}</td>
                    {CATEGORIES.map(cat => (
                      <td key={cat} className="border p-2 align-top min-w-[180px]">
                        <div className="space-y-1">
                          {dayData[cat].map((meal: MealPlanItem) => (
                            <div key={meal.id} className="flex items-center justify-between bg-background border rounded p-1.5 text-sm group">
                              <div>
                                <span className="font-medium">{meal.name}</span>
                                {meal.calories > 0 && <Badge variant="secondary" className="ml-1 text-xs">{meal.calories} kcal</Badge>}
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeMeal(day, cat, meal.id)}><X className="h-3 w-3 text-destructive" /></Button>
                            </div>
                          ))}
                          <Button variant="ghost" size="sm" className="w-full text-xs h-7 text-muted-foreground" onClick={() => { setAddDay(day); setAddCategory(cat); setAddOpen(true); }}>
                            <Plus className="h-3 w-3 mr-1" />Add
                          </Button>
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">{t.noPlans}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t.create}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {plans.map(p => (
        <Card key={p.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><CalendarDays className="h-4 w-4" />{p.name}</CardTitle>
            {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">Created {new Date(p.created_at).toLocaleDateString()}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setSelectedPlan(p.id)} className="flex-1">{t.selectPlan}</Button>
              <Button size="sm" variant="destructive" onClick={() => deletePlan(p.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
