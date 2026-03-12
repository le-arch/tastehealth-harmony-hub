import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bookmark, Calendar, Trash2, Search, Plus, ChefHat, Edit3, Upload, Image as ImageIcon, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TabsTrigger, ScrollableTabsList } from '@/components/ui/scrollable-tabs';
import { toast } from 'sonner';
import RichTextEditor from '@/components/journal/RichTextEditor';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface JournalEntry { id: string; date: string; title: string; content: string; mood: string; meals: string[]; createdAt: Date; updatedAt: Date; }
interface CustomRecipe { id: string; name: string; ingredients: string; method: string; category: string; date: string; imageUrl?: string; }

// Animated Date Picker Component
const AnimatedDatePicker = ({ value, onChange, label = "Date" }: { value: string; onChange: (date: string) => void; label?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState<Date>(value ? new Date(value) : new Date());
  
  const selectedDate = value ? new Date(value) : undefined;

  // Animation variants
  const popoverVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="space-y-2">
      <motion.label 
        className="text-sm font-medium flex items-center gap-1"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Sparkles className="h-3 w-3 text-yellow-500" />
        {label}
      </motion.label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal relative overflow-hidden group",
                "border-2 hover:border-primary/50 transition-all duration-300",
                "bg-gradient-to-r from-background to-muted/30",
                !value && "text-muted-foreground"
              )}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              <Calendar className="mr-2 h-4 w-4 relative z-10 group-hover:text-primary transition-colors" />
              
              <span className="relative z-10">
                {value ? format(new Date(value), 'PPP') : <span>Select a date</span>}
              </span>

              {/* Decorative dot for today */}
              {value && format(new Date(value), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </Button>
          </motion.div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-auto p-0 border-2 shadow-xl" 
          align="start"
          sideOffset={5}
        >
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                variants={popoverVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      onChange(format(date, 'yyyy-MM-dd'));
                      setIsOpen(false);
                    }
                  }}
                  month={month}
                  onMonthChange={setMonth}
                  initialFocus
                  animated={true}
                  highlightToday={true}
                  className="rounded-md border-0"
                  components={{
                    IconLeft: ({ ...props }) => (
                      <motion.div
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </motion.div>
                    ),
                    IconRight: ({ ...props }) => (
                      <motion.div
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    ),
                  }}
                />

                {/* Footer with quick actions */}
                <motion.div 
                  className="p-3 border-t border-border flex items-center justify-between bg-muted/20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        const today = format(new Date(), 'yyyy-MM-dd');
                        onChange(today);
                        setIsOpen(false);
                      }}
                      className="text-xs"
                    >
                      Today
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsOpen(false)}
                      className="text-xs"
                    >
                      Close
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const DailyJournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], title: '', content: '', mood: 'great', meals: [] as string[] });
  const [activeTab, setActiveTab] = useState('journal');
  const [recipes, setRecipes] = useState<CustomRecipe[]>(() => { try { return JSON.parse(localStorage.getItem('th_custom_recipes') || '[]'); } catch { return []; } });
  const [recipeForm, setRecipeForm] = useState({ name: '', ingredients: '', method: '', category: 'breakfast', imageUrl: '' });
  const [editingRecipe, setEditingRecipe] = useState<string | null>(null);
  const [mealGallery, setMealGallery] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('th_meal_gallery') || '[]'); } catch { return []; } });
  const recipeFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
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
    if (stored) { try { const parsed = JSON.parse(stored); setEntries(parsed.map((e: any) => ({ ...e, createdAt: new Date(e.createdAt), updatedAt: new Date(e.updatedAt) }))); } catch {} }
  }, []);

  const saveEntry = () => {
    if (!formData.title.trim() || !formData.content.trim()) { toast.error('Please fill in title and content'); return; }
    if (selectedEntry && isEditing) {
      const updated = entries.map(e => e.id === selectedEntry.id ? { ...e, ...formData, updatedAt: new Date() } : e);
      setEntries(updated); localStorage.setItem('th_journal_entries', JSON.stringify(updated));
    } else {
      const newEntry: JournalEntry = { id: crypto.randomUUID(), ...formData, createdAt: new Date(), updatedAt: new Date() };
      const updated = [newEntry, ...entries]; setEntries(updated); localStorage.setItem('th_journal_entries', JSON.stringify(updated));
      addNotification({ title: 'Journal Entry Created', message: `"${formData.title}"`, type: 'info' });
    }
    toast.success('Entry saved!');
    setFormData({ date: new Date().toISOString().split('T')[0], title: '', content: '', mood: 'great', meals: [] });
    setSelectedEntry(null); setIsEditing(false);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id); setEntries(updated); localStorage.setItem('th_journal_entries', JSON.stringify(updated));
    if (selectedEntry?.id === id) { setSelectedEntry(null); setIsEditing(false); }
    toast.success('Entry deleted!');
  };

  const editEntry = (entry: JournalEntry) => { setSelectedEntry(entry); setFormData({ date: entry.date, title: entry.title, content: entry.content, mood: entry.mood, meals: entry.meals }); setIsEditing(true); };
  const filteredEntries = entries.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.content.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleRecipeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setRecipeForm({ ...recipeForm, imageUrl: ev.target?.result as string }); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setMealGallery(prev => {
          const updated = [dataUrl, ...prev];
          localStorage.setItem('th_meal_gallery', JSON.stringify(updated.slice(0, 50)));
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
    toast.success('Photos added to gallery!');
  };

  const saveRecipe = () => {
    if (!recipeForm.name.trim()) { toast.error('Enter a recipe name'); return; }
    let updated: CustomRecipe[];
    if (editingRecipe) {
      updated = recipes.map(r => r.id === editingRecipe ? { ...r, ...recipeForm, date: r.date } : r);
      setEditingRecipe(null);
    } else {
      const r: CustomRecipe = { id: crypto.randomUUID(), ...recipeForm, date: new Date().toISOString() };
      updated = [r, ...recipes];
    }
    setRecipes(updated); localStorage.setItem('th_custom_recipes', JSON.stringify(updated));
    setRecipeForm({ name: '', ingredients: '', method: '', category: 'breakfast', imageUrl: '' });
    toast.success(editingRecipe ? 'Recipe updated!' : 'Recipe saved!');
  };

  const editRecipe = (r: CustomRecipe) => {
    setEditingRecipe(r.id);
    setRecipeForm({ name: r.name, ingredients: r.ingredients, method: r.method, category: r.category, imageUrl: r.imageUrl || '' });
  };

  const renderMarkdownPreview = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-sm mt-1">{line.slice(3)}</h3>;
      if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-sm mt-1">{line.slice(2)}</h2>;
      if (line.startsWith('- [x] ')) return <div key={i} className="flex items-center gap-1 text-xs"><input type="checkbox" checked readOnly className="h-3 w-3" /><span className="line-through text-muted-foreground">{line.slice(6)}</span></div>;
      if (line.startsWith('- [ ] ')) return <div key={i} className="flex items-center gap-1 text-xs"><input type="checkbox" readOnly className="h-3 w-3" /><span>{line.slice(6)}</span></div>;
      if (line.startsWith('- ')) return <li key={i} className="text-xs ml-3 list-disc">{line.slice(2)}</li>;
      if (/^\d+\. /.test(line)) return <li key={i} className="text-xs ml-3 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-primary pl-2 text-xs italic text-muted-foreground">{line.slice(2)}</blockquote>;
      const imgMatch = line.match(/!\[.*?\]\((.*?)\)/);
      if (imgMatch) return <img key={i} src={imgMatch[1]} alt="" className="max-w-full rounded max-h-24 object-cover my-1" />;
      return <p key={i} className="text-xs">{line}</p>;
    });
  };

  return (
    <PageLayout activePage="journal">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <Bookmark className="h-7 w-7 text-red-500 fill-red-300" />
            </motion.span>
            Daily Journal
          </h1>
          <p className="text-muted-foreground text-sm">Track your nutrition journey and wellness</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ScrollableTabsList className="mb-6">
            <TabsTrigger value="journal"><Bookmark className="h-4 w-4 mr-1 inline text-amber-500 fill-amber-300" />Journal</TabsTrigger>
            <TabsTrigger value="recipes"><ChefHat className="h-4 w-4 mr-1 inline text-orange-500 fill-orange-300" />My Recipes</TabsTrigger>
            <TabsTrigger value="gallery"><ImageIcon className="h-4 w-4 mr-1 inline text-blue-500 fill-blue-200" />Meal Gallery</TabsTrigger>
          </ScrollableTabsList>

          <TabsContent value="journal">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="h-5 w-5 text-primary" />
                      {isEditing ? 'Edit Entry' : 'New Entry'}
                      {isEditing && <Button variant="ghost" size="sm" onClick={() => { setSelectedEntry(null); setIsEditing(false); setFormData({ date: new Date().toISOString().split('T')[0], title: '', content: '', mood: 'great', meals: [] }); }} className="ml-2 text-xs">Cancel</Button>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Replace the basic date input with AnimatedDatePicker */}
                    <AnimatedDatePicker 
                      value={formData.date} 
                      onChange={(date) => setFormData({ ...formData, date })}
                      label="Date"
                    />
                    
                    <div>
                      <label className="text-sm font-medium">Mood</label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {moodOptions.map(m => (
                          <motion.button key={m.value} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({ ...formData, mood: m.value })}
                            className={`p-2 rounded-lg border-2 text-2xl transition-all ${formData.mood === m.value ? 'border-primary bg-primary/10 shadow-md' : 'border-muted hover:border-primary/30'}`}
                          >{m.emoji}</motion.button>
                        ))}
                      </div>
                    </div>
                    <div><label className="text-sm font-medium">Title</label><Input placeholder="Entry title..." value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="mt-1" /></div>
                    <div>
                      <label className="text-sm font-medium">Content</label>
                      <div className="mt-1">
                        <RichTextEditor value={formData.content} onChange={(v) => setFormData({ ...formData, content: v })} placeholder="Write your thoughts... Use the toolbar for formatting! Upload images from device." />
                      </div>
                    </div>
                    <Button onClick={saveEntry} className="w-full bg-gradient-to-r from-primary to-primary/80"><Plus className="h-4 w-4 mr-2" />Save</Button>
                  </CardContent>
                </Card>
              </motion.div>
              <div>
                <div className="mb-4 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search entries" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" /></div>
                {filteredEntries.length === 0 ? (
                  <Card><CardContent className="flex items-center justify-center h-40"><div className="text-center"><Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" /><p className="text-muted-foreground">No entries found</p></div></CardContent></Card>
                ) : (
                  <AnimatePresence>
                    <div className="space-y-3">
                      {filteredEntries.map((entry, idx) => (
                        <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                          <Card className={`cursor-pointer hover:shadow-lg transition-all ${selectedEntry?.id === entry.id ? 'ring-2 ring-primary shadow-lg' : 'hover:border-primary/30'}`} onClick={() => editEntry(entry)}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-1">
                                <div className="flex items-center gap-2"><span className="text-xl">{moodOptions.find(m => m.value === entry.mood)?.emoji}</span><h3 className="font-semibold">{entry.title}</h3></div>
                                <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); deleteEntry(entry.id); }} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /></Button>
                              </div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(entry.date).toLocaleDateString()}</p>
                              <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{renderMarkdownPreview(entry.content)}</div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recipes">
            <input type="file" ref={recipeFileRef} onChange={handleRecipeImageUpload} accept="image/*" className="hidden" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-orange-200 dark:border-orange-800/30 shadow-lg">
                  <CardHeader><CardTitle className="flex items-center gap-2"><ChefHat className="h-5 w-5 text-orange-500" />{editingRecipe ? 'Edit Recipe' : 'Add Recipe'}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><label className="text-sm font-medium">Name</label><Input value={recipeForm.name} onChange={e => setRecipeForm({ ...recipeForm, name: e.target.value })} placeholder="Recipe name..." className="mt-1" /></div>
                    <div><label className="text-sm font-medium">Category</label><select value={recipeForm.category} onChange={e => setRecipeForm({ ...recipeForm, category: e.target.value })} className="w-full mt-1 px-3 py-2 border border-input rounded-md text-sm bg-background">{['breakfast','lunch','dinner','snacks','drinks'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2"><Upload className="h-4 w-4 text-blue-500" />Recipe Image</label>
                      <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => recipeFileRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />Upload from Device
                      </Button>
                      {recipeForm.imageUrl && <img src={recipeForm.imageUrl} alt="Preview" className="mt-2 rounded-lg max-h-32 object-cover w-full" />}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ingredients</label>
                      <RichTextEditor value={recipeForm.ingredients} onChange={v => setRecipeForm({ ...recipeForm, ingredients: v })} placeholder="Use bullets (- ) or numbered list (1. ) for ingredients..." minRows={4} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Method</label>
                      <RichTextEditor value={recipeForm.method} onChange={v => setRecipeForm({ ...recipeForm, method: v })} placeholder="Use numbered list (1. ) for steps, **bold** for emphasis..." minRows={4} />
                    </div>
                    <div className="flex gap-2">
                      {editingRecipe && <Button variant="outline" onClick={() => { setEditingRecipe(null); setRecipeForm({ name: '', ingredients: '', method: '', category: 'breakfast', imageUrl: '' }); }} className="flex-1">Cancel</Button>}
                      <Button onClick={saveRecipe} className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"><Plus className="h-4 w-4 mr-2" />{editingRecipe ? 'Update' : 'Save'} Recipe</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">My Recipes ({recipes.length})</h3>
                {recipes.length === 0 ? <p className="text-muted-foreground text-sm">No recipes yet.</p> :
                  <AnimatePresence>
                    {recipes.map((r, idx) => (
                      <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                        <Card className="hover:shadow-md transition-all overflow-hidden">
                          {r.imageUrl && <img src={r.imageUrl} alt={r.name} className="w-full h-36 object-cover" />}
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{r.name}</h4>
                              <Badge variant="outline" className="text-xs capitalize">{r.category}</Badge>
                            </div>
                            {r.ingredients && <div className="mb-2"><p className="text-xs font-medium text-muted-foreground mb-1">Ingredients:</p><div className="text-xs">{renderMarkdownPreview(r.ingredients)}</div></div>}
                            {r.method && <div><p className="text-xs font-medium text-muted-foreground mb-1">Method:</p><div className="text-xs">{renderMarkdownPreview(r.method)}</div></div>}
                            <div className="flex gap-2 mt-3">
                              <Button variant="outline" size="sm" onClick={() => editRecipe(r)} className="text-primary"><Edit3 className="h-3 w-3 mr-1" />Edit</Button>
                              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => {
                                const updated = recipes.filter(x => x.id !== r.id); setRecipes(updated);
                                localStorage.setItem('th_custom_recipes', JSON.stringify(updated)); toast.success('Recipe deleted');
                              }}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                }
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <input type="file" ref={galleryFileRef} onChange={handleGalleryUpload} accept="image/*" multiple className="hidden" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2"><ImageIcon className="h-5 w-5 text-blue-500" />Meal Photo Gallery</h3>
                <Button onClick={() => galleryFileRef.current?.click()} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <Upload className="h-4 w-4 mr-2" />Upload Photos
                </Button>
              </div>
              {mealGallery.length === 0 ? (
                <Card><CardContent className="flex items-center justify-center h-40"><div className="text-center"><ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" /><p className="text-muted-foreground">No photos yet. Upload your meal photos!</p></div></CardContent></Card>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mealGallery.map((img, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="relative group">
                      <img src={img} alt={`Meal ${idx + 1}`} className="w-full h-40 object-cover rounded-lg shadow-sm" />
                      <Button variant="destructive" size="sm" className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => { const updated = mealGallery.filter((_, i) => i !== idx); setMealGallery(updated); localStorage.setItem('th_meal_gallery', JSON.stringify(updated)); toast.success('Photo removed'); }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default DailyJournalPage;