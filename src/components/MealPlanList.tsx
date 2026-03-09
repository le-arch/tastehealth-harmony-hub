import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDays, Trash2, Plus, X, Search, Edit3, Utensils } from 'lucide-react';
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
const CATEGORY_COLORS: Record<string, string> = {
  breakfast: 'from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-800/30',
  lunch: 'from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800/30',
  dinner: 'from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800/30',
  snacks: 'from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800/30',
};
const CATEGORY_ICONS: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍿' };
const DAY_COLORS = ['bg-red-500/10', 'bg-orange-500/10', 'bg-amber-500/10', 'bg-green-500/10', 'bg-teal-500/10', 'bg-blue-500/10', 'bg-purple-500/10'];

export function MealPlanList() {
  const { language } = useLanguage();
  const [plans, setPlans] = useState<MealPlan[]>(getLS(LS_KEYS.MEAL_PLANS, []));
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<{ day: string; category: MealCategory; meal: MealPlanItem } | null>(null);
  const [editMealName, setEditMealName] = useState('');
  const [editMealCalories, setEditMealCalories] = useState('');
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
    // Save to daily meals for nutrition tracking
    saveToDailyMeals(addMealName, parseInt(addMealCalories) || 0, addCategory);
    toast.success(`${addMealName} added to ${addDay} ${addCategory}`);
    setAddMealName(''); setAddMealCalories(''); setAddOpen(false); setMealSearch('');
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
    saveToDailyMeals(dbMeal.name, dbMeal.nutrition.calories, addCategory);
    toast.success(`${dbMeal.name} added to ${addDay} ${addCategory}`);
    setAddMealName(''); setAddMealCalories(''); setAddOpen(false); setMealSearch('');
  };

  const saveToDailyMeals = (name: string, calories: number, category: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem('th_daily_meals') || '[]');
      const dbMeal = MEAL_DATABASE.find(m => m.name === name);
      stored.push({
        mealId: dbMeal?.id || name,
        mealName: name,
        calories,
        protein: dbMeal?.nutrition.protein || 0,
        carbs: dbMeal?.nutrition.carbs || 0,
        fats: dbMeal?.nutrition.fats || 0,
        category,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('th_daily_meals', JSON.stringify(stored));
    } catch {}
  };

  const filteredMeals = MEAL_DATABASE.filter(m =>
    m.name.toLowerCase().includes(mealSearch.toLowerCase()) && m.category === addCategory
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

  const startEditMeal = (day: string, category: MealCategory, meal: MealPlanItem) => {
    setEditingMeal({ day, category, meal });
    setEditMealName(meal.name);
    setEditMealCalories(String(meal.calories));
    setEditOpen(true);
  };

  const saveEditMeal = () => {
    if (!editingMeal || !plan) return;
    const updated = plans.map(p => {
      if (p.id !== plan.id) return p;
      const days = { ...p.days };
      days[editingMeal.day] = {
        ...days[editingMeal.day],
        [editingMeal.category]: days[editingMeal.day][editingMeal.category].map((m: MealPlanItem) =>
          m.id === editingMeal.meal.id ? { ...m, name: editMealName, calories: parseInt(editMealCalories) || 0 } : m
        ),
      };
      return { ...p, days };
    });
    save(updated);
    setEditOpen(false); setEditingMeal(null);
    toast.success("Meal updated");
  };

  const t = language === 'fr'
    ? { noPlan: "Aucun plan sélectionné", noPlans: "Aucun plan de repas", create: "Créez un plan pour commencer", selectPlan: "Sélectionner", delete: "Supprimer", addMeal: "Ajouter un repas", day: "Jour", category: "Catégorie", name: "Nom", calories: "Calories", add: "Ajouter", back: "Retour" }
    : { noPlan: "No plan selected", noPlans: "No meal plans yet", create: "Create a plan to get started", selectPlan: "View", delete: "Delete", addMeal: "Add Meal", day: "Day", category: "Category", name: "Meal Name", calories: "Calories", add: "Add", back: "Back to Plans" };

  if (selectedPlan && plan) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button variant="outline" onClick={() => setSelectedPlan(null)} className="hover:bg-primary/10">{t.back}</Button>
          <h2 className="text-xl font-bold flex items-center gap-2"><Utensils className="h-5 w-5 text-primary" />{plan.name}</h2>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild><Button size="sm" className="bg-gradient-to-r from-primary to-primary/80"><Plus className="h-4 w-4 mr-1" />{t.addMeal}</Button></DialogTrigger>
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
                  <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="database">From Database</TabsTrigger><TabsTrigger value="custom">Custom Meal</TabsTrigger></TabsList>
                  <TabsContent value="database" className="space-y-3">
                    <div className="relative"><Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search meals..." value={mealSearch} onChange={(e) => setMealSearch(e.target.value)} className="pl-8" /></div>
                    <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-3 bg-muted/50">
                      {filteredMeals.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No meals found</p> :
                        filteredMeals.map(meal => (
                          <motion.div key={meal.id} whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-2 bg-background border rounded-lg hover:bg-muted transition-colors">
                            <div className="flex-1"><p className="font-medium text-sm">{meal.name}</p><p className="text-xs text-muted-foreground">{meal.nutrition.calories} kcal • P: {meal.nutrition.protein}g • C: {meal.nutrition.carbs}g • F: {meal.nutrition.fats}g</p></div>
                            <Button size="sm" onClick={() => addDatabaseMealToPlan(meal)}>Add</Button>
                          </motion.div>
                        ))}
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

        {/* Edit Meal Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Meal</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={editMealName} onChange={e => setEditMealName(e.target.value)} /></div>
              <div><Label>Calories</Label><Input type="number" value={editMealCalories} onChange={e => setEditMealCalories(e.target.value)} /></div>
              <Button onClick={saveEditMeal} className="w-full">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stylish Timetable */}
        <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr>
                <th className="p-3 text-left font-semibold text-sm bg-gradient-to-r from-primary/5 to-primary/10 border-b border-r w-28">Day</th>
                {CATEGORIES.map(c => (
                  <th key={c} className={`p-3 text-left font-semibold text-sm border-b border-r bg-gradient-to-r ${CATEGORY_COLORS[c]} capitalize`}>
                    <span className="mr-1">{CATEGORY_ICONS[c]}</span>{c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {DAYS_OF_WEEK.map((day, dayIdx) => {
                  const dayData = plan.days[day] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
                  return (
                    <motion.tr key={day} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: dayIdx * 0.05 }}
                      className="hover:bg-muted/30 transition-colors">
                      <td className={`p-3 font-semibold text-sm border-b border-r ${DAY_COLORS[dayIdx]} rounded-l`}>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          {day.slice(0, 3)}
                        </div>
                      </td>
                      {CATEGORIES.map(cat => (
                        <td key={cat} className="p-2 align-top min-w-[200px] border-b border-r">
                          <div className="space-y-1.5">
                            <AnimatePresence>
                              {dayData[cat].map((meal: MealPlanItem) => (
                                <motion.div key={meal.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                  className="flex items-center justify-between bg-background border rounded-lg p-2 text-sm group hover:shadow-sm transition-all hover:border-primary/30">
                                  <div className="flex-1 min-w-0">
                                    <span className="font-medium truncate block">{meal.name}</span>
                                    {meal.calories > 0 && <Badge variant="secondary" className="text-[10px] mt-0.5">{meal.calories} kcal</Badge>}
                                  </div>
                                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEditMeal(day, cat, meal)}><Edit3 className="h-3 w-3 text-primary" /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeMeal(day, cat, meal.id)}><X className="h-3 w-3 text-destructive" /></Button>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                            <Button variant="ghost" size="sm" className="w-full text-xs h-7 text-muted-foreground border border-dashed border-muted-foreground/20 hover:border-primary/40 hover:text-primary"
                              onClick={() => { setAddDay(day); setAddCategory(cat); setAddOpen(true); }}>
                              <Plus className="h-3 w-3 mr-1" />Add
                            </Button>
                          </div>
                        </td>
                      ))}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  if (plans.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <CalendarDays className="mx-auto h-16 w-16 text-primary/40" />
        </motion.div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">{t.noPlans}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t.create}</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {plans.map((p, idx) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
          <Card className="hover:shadow-lg transition-all hover:border-primary/30 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <motion.span animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>
                  <CalendarDays className="h-5 w-5 text-primary" />
                </motion.span>
                {p.name}
              </CardTitle>
              {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">Created {new Date(p.created_at).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setSelectedPlan(p.id)} className="flex-1 bg-gradient-to-r from-primary to-primary/80">{t.selectPlan}</Button>
                <Button size="sm" variant="destructive" onClick={() => deletePlan(p.id)} className="opacity-70 group-hover:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
