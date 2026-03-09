import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bookmark, Calendar, Trash2, Search, Plus, ChefHat, Edit2 } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TabsTrigger, ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { RichTextEditor, renderFormattedText } from '@/components/ui/rich-text-editor';
import { RecipeFormatEditor, renderRecipeContent } from '@/components/ui/recipe-format-editor';
import { soundManager } from '@/utils/sounds';

interface JournalEntry { 
  id: string; 
  date: string; 
  title: string; 
  content: string; 
  formattedContent?: string;
  mood: string; 
  meals: string[]; 
  createdAt: Date; 
  updatedAt: Date; 
}

interface CustomRecipe { 
  id: string; 
  name: string; 
  ingredients: string; 
  ingredientsFormatted?: string; 
  method: string; 
  methodFormatted?: string; 
  category: string; 
  date: string; 
  imageUrl?: string;
}

const DailyJournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], title: '', content: '', mood: 'great', meals: [] as string[] });
  const [activeTab, setActiveTab] = useState('journal');
  const [recipes, setRecipes] = useState<CustomRecipe[]>(() => { 
    try { 
      const stored = localStorage.getItem('th_custom_recipes');
      return stored ? JSON.parse(stored) : [];
    } catch { 
      return []; 
    } 
  });
  const [recipeForm, setRecipeForm] = useState({ 
    name: '', 
    ingredients: '', 
    method: '', 
    category: 'breakfast',
    imageUrl: ''
  });
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const { language } = useLanguage();
  const { addNotification } = useNotifications();

  const moodOptions = [
    { value: 'great', label: 'Great', emoji: '😄' },
    { value: 'good', label: 'Good', emoji: '😊' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'bad', label: 'Bad', emoji: '😔' },
    { value: 'terrible', label: 'Terrible', emoji: '😢' },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('th_journal_entries');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEntries(parsed.map((e: any) => ({ ...e, createdAt: new Date(e.createdAt), updatedAt: new Date(e.updatedAt) })));
      } catch {}
    }
  }, []);

  const saveEntry = () => {
    if (!formData.title.trim() || !formData.content.trim()) { 
      toast.error('Please fill in title and content'); 
      return; 
    }
    if (selectedEntry && isEditing) {
      const updated = entries.map(e => e.id === selectedEntry.id ? { ...e, ...formData, formattedContent: formData.content, updatedAt: new Date() } : e);
      setEntries(updated); 
      localStorage.setItem('th_journal_entries', JSON.stringify(updated));
      soundManager.playSuccess();
    } else {
      const newEntry: JournalEntry = { 
        id: crypto.randomUUID(), 
        ...formData, 
        formattedContent: formData.content,
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      const updated = [newEntry, ...entries]; 
      setEntries(updated); 
      localStorage.setItem('th_journal_entries', JSON.stringify(updated));
      soundManager.playMilestone();
      addNotification({ title: 'Journal Entry Created', message: `"${formData.title}"`, type: 'info' });
    }
    toast.success('Entry saved!');
    setFormData({ date: new Date().toISOString().split('T')[0], title: '', content: '', mood: 'great', meals: [] });
    setSelectedEntry(null); 
    setIsEditing(false);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id); 
    setEntries(updated); 
    localStorage.setItem('th_journal_entries', JSON.stringify(updated));
    if (selectedEntry?.id === id) { setSelectedEntry(null); setIsEditing(false); }
    toast.success('Entry deleted!');
    soundManager.playClick();
  };

  const editEntry = (entry: JournalEntry) => { 
    setSelectedEntry(entry); 
    setFormData({ date: entry.date, title: entry.title, content: entry.content, mood: entry.mood, meals: entry.meals }); 
    setIsEditing(true); 
  };
  
  const filteredEntries = entries.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.content.toLowerCase().includes(searchTerm.toLowerCase()));

  const saveRecipe = () => {
    if (!recipeForm.name.trim()) { 
      toast.error('Enter a recipe name'); 
      return; 
    }
    
    if (editingRecipeId) {
      const updated = recipes.map(r => 
        r.id === editingRecipeId 
          ? { ...r, ...recipeForm, ingredientsFormatted: recipeForm.ingredients, methodFormatted: recipeForm.method }
          : r
      );
      setRecipes(updated);
      localStorage.setItem('th_custom_recipes', JSON.stringify(updated));
      toast.success('Recipe updated!');
      soundManager.playSuccess();
    } else {
      const r: CustomRecipe = { 
        id: crypto.randomUUID(), 
        ...recipeForm,
        ingredientsFormatted: recipeForm.ingredients,
        methodFormatted: recipeForm.method,
        date: new Date().toISOString() 
      };
      const updated = [r, ...recipes]; 
      setRecipes(updated); 
      localStorage.setItem('th_custom_recipes', JSON.stringify(updated));
      toast.success('Recipe saved!');
      soundManager.playMilestone();
    }
    setRecipeForm({ name: '', ingredients: '', method: '', category: 'breakfast', imageUrl: '' });
    setEditingRecipeId(null);
  };

  const editRecipe = (recipe: CustomRecipe) => {
    setRecipeForm({
      name: recipe.name,
      ingredients: recipe.ingredients,
      method: recipe.method,
      category: recipe.category,
      imageUrl: recipe.imageUrl || ''
    });
    setEditingRecipeId(recipe.id);
  };

  const deleteRecipe = (id: string) => {
    const updated = recipes.filter(x => x.id !== id); 
    setRecipes(updated);
    localStorage.setItem('th_custom_recipes', JSON.stringify(updated)); 
    toast.success('Recipe deleted');
    soundManager.playClick();
  };

  return (
    <PageLayout activePage="journal">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bookmark className="h-7 w-7 text-primary" />
            Daily Journal
          </h1>
          <p className="text-muted-foreground text-sm">Track your nutrition journey and wellness</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ScrollableTabsList className="mb-6">
            <TabsTrigger value="journal">
              <Bookmark className="h-4 w-4 mr-1" />Journal
            </TabsTrigger>
            <TabsTrigger value="recipes">
              <ChefHat className="h-4 w-4 mr-1" />My Recipes
            </TabsTrigger>
          </ScrollableTabsList>

          <TabsContent value="journal">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="glow-effect">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {isEditing ? 'Edit Entry' : 'New Entry'}
                    {isEditing && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { 
                          setSelectedEntry(null); 
                          setIsEditing(false); 
                          setFormData({ date: new Date().toISOString().split('T')[0], title: '', content: '', mood: 'great', meals: [] }); 
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input 
                      type="date" 
                      value={formData.date} 
                      onChange={e => setFormData({ ...formData, date: e.target.value })} 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mood</label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {moodOptions.map(m => (
                        <button 
                          key={m.value} 
                          onClick={() => setFormData({ ...formData, mood: m.value })} 
                          className={`p-2 rounded-lg border-2 text-2xl transition-all hover:scale-110 ${formData.mood === m.value ? 'border-primary bg-primary/10 shadow-lg' : 'border-muted hover:border-primary/50'}`}
                        >
                          {m.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input 
                      placeholder="Entry title..." 
                      value={formData.title} 
                      onChange={e => setFormData({ ...formData, title: e.target.value })} 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <RichTextEditor 
                      placeholder="Write your thoughts... Use **bold**, *italic*, # headings, - bullets, 1. numbered lists, - [ ] checklists, > quotes" 
                      value={formData.content} 
                      onChange={(value) => setFormData({ ...formData, content: value })}
                      rows={8}
                    />
                  </div>
                  <Button onClick={saveEntry} className="w-full glow-effect">
                    <Plus className="h-4 w-4 mr-2" />Save Entry
                  </Button>
                </CardContent>
              </Card>
              <div>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search entries..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="pl-10" 
                  />
                </div>
                {filteredEntries.length === 0 ? (
                  <Card>
                    <CardContent className="flex items-center justify-center h-40">
                      <div className="text-center">
                        <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-muted-foreground">No entries found</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {filteredEntries.map(entry => (
                      <Card 
                        key={entry.id} 
                        className={`cursor-pointer hover:shadow-md transition-all hover:scale-[1.01] ${selectedEntry?.id === entry.id ? 'ring-2 ring-primary glow-effect' : ''}`} 
                        onClick={() => editEntry(entry)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl animate-beat">{moodOptions.find(m => m.value === entry.mood)?.emoji}</span>
                              <h3 className="font-semibold">{entry.title}</h3>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={e => { e.stopPropagation(); deleteEntry(entry.id); }} 
                              className="text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                          <div className="text-sm text-muted-foreground line-clamp-2 mt-2 rich-text-content">
                            {renderFormattedText(entry.formattedContent || entry.content)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recipes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glow-effect recipe-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-primary" />
                    {editingRecipeId ? 'Edit Recipe' : 'Add Recipe'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input 
                      value={recipeForm.name} 
                      onChange={e => setRecipeForm({ ...recipeForm, name: e.target.value })} 
                      placeholder="Recipe name..." 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select 
                      value={recipeForm.category} 
                      onChange={e => setRecipeForm({ ...recipeForm, category: e.target.value })} 
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md text-sm bg-background"
                    >
                      {['breakfast','lunch','dinner','snacks','drinks'].map(c => (
                        <option key={c} value={c} className="capitalize">{c}</option>
                      ))}
                    </select>
                  </div>
                  <RecipeFormatEditor 
                    ingredients={recipeForm.ingredients}
                    setIngredients={(v) => setRecipeForm({ ...recipeForm, ingredients: v })}
                    method={recipeForm.method}
                    setMethod={(v) => setRecipeForm({ ...recipeForm, method: v })}
                    imageUrl={recipeForm.imageUrl}
                    setImageUrl={(v) => setRecipeForm({ ...recipeForm, imageUrl: v })}
                  />
                  <div className="flex gap-2">
                    <Button onClick={saveRecipe} className="flex-1 glow-effect">
                      <Plus className="h-4 w-4 mr-2" />
                      {editingRecipeId ? 'Update Recipe' : 'Save Recipe'}
                    </Button>
                    {editingRecipeId && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingRecipeId(null);
                          setRecipeForm({ name: '', ingredients: '', method: '', category: 'breakfast', imageUrl: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  My Recipes ({recipes.length})
                </h3>
                {recipes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No recipes yet. Add your first recipe!</p>
                ) : (
                  recipes.map(r => (
                    <Card key={r.id} className="recipe-card hover:shadow-lg transition-all">
                      <CardContent className="p-4">
                        {r.imageUrl && (
                          <img 
                            src={r.imageUrl} 
                            alt={r.name} 
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-lg">{r.name}</h4>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => editRecipe(r)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive" 
                              onClick={() => deleteRecipe(r.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <span className="text-xs capitalize text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {r.category}
                        </span>
                        {r.ingredients && (
                          <div className="mb-2 mt-3">
                            <p className="text-xs font-medium text-muted-foreground">Ingredients:</p>
                            <div className="text-xs mt-1 p-2 bg-muted/30 rounded">
                              {renderRecipeContent(r.ingredientsFormatted || r.ingredients, 'bullet')}
                            </div>
                          </div>
                        )}
                        {r.method && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Method:</p>
                            <div className="text-xs mt-1 p-2 bg-muted/30 rounded">
                              {renderRecipeContent(r.methodFormatted || r.method, 'steps')}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default DailyJournalPage;
