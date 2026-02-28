import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useScreenSize } from '@/utils/mobile';
import { Bookmark, Calendar, Heart, Smile, Trash2, Search, Plus, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  meals: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DailyJournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
    mood: 'great',
    meals: [] as string[],
  });

  const { language } = useLanguage();
  const { isMobile } = useScreenSize();
  const { addNotification } = useNotifications();

  const t = language === 'fr'
    ? {
      title: 'Journal Quotidien',
      subtitle: 'Suivez votre parcours nutritionnel et votre bien-être',
      newEntry: 'Nouvelle Entrée',
      date: 'Date',
      title: 'Titre',
      content: 'Contenu',
      mood: 'Humeur',
      meals: 'Repas',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Éditer',
      noEntries: 'Aucune entrée trouvée',
      entrySaved: 'Entrée enregistrée!',
      entryDeleted: 'Entrée supprimée!',
      search: 'Rechercher les entrées',
      great: 'Excellent',
      good: 'Bien',
      neutral: 'Neutre',
      bad: 'Mauvais',
      terrible: 'Horrible',
    }
    : {
      title: 'Daily Journal',
      subtitle: 'Track your nutrition journey and wellness',
      newEntry: 'New Entry',
      date: 'Date',
      title: 'Title',
      content: 'Content',
      mood: 'Mood',
      meals: 'Meals',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      noEntries: 'No entries found',
      entrySaved: 'Entry saved!',
      entryDeleted: 'Entry deleted!',
      search: 'Search entries',
      great: 'Great',
      good: 'Good',
      neutral: 'Neutral',
      bad: 'Bad',
      terrible: 'Terrible',
    };

  const moodOptions = [
    { value: 'great', label: t.great, emoji: '😄', color: 'text-green-600' },
    { value: 'good', label: t.good, emoji: '😊', color: 'text-blue-600' },
    { value: 'neutral', label: t.neutral, emoji: '😐', color: 'text-yellow-600' },
    { value: 'bad', label: t.bad, emoji: '😔', color: 'text-orange-600' },
    { value: 'terrible', label: t.terrible, emoji: '😢', color: 'text-red-600' },
  ];

  // Load entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('th_journal_entries');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEntries(parsed.map((e: any) => ({
          ...e,
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt),
        })));
      } catch (error) {
        console.error('Failed to load journal entries:', error);
      }
    }
  }, []);

  const saveEntry = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    if (selectedEntry && isEditing) {
      // Update existing
      const updated = entries.map(e => 
        e.id === selectedEntry.id 
          ? { ...e, ...formData, updatedAt: new Date() }
          : e
      );
      setEntries(updated);
      localStorage.setItem('th_journal_entries', JSON.stringify(updated));
      toast.success(t.entrySaved);
    } else {
      // Create new
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updated = [newEntry, ...entries];
      setEntries(updated);
      localStorage.setItem('th_journal_entries', JSON.stringify(updated));
      toast.success(t.entrySaved);
      addNotification({
        title: 'Journal Entry Created',
        message: `New journal entry: "${formData.title}"`,
        type: 'info',
      });
    }

    resetForm();
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('th_journal_entries', JSON.stringify(updated));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
      setIsEditing(false);
    }
    toast.success(t.entryDeleted);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      title: '',
      content: '',
      mood: 'great',
      meals: [],
    });
    setSelectedEntry(null);
    setIsEditing(false);
  };

  const editEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setFormData({
      date: entry.date,
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      meals: entry.meals,
    });
    setIsEditing(true);
  };

  const filteredEntries = entries.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMoodEmoji = (mood: string) => {
    return moodOptions.find(m => m.value === mood)?.emoji || '😐';
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <ProfileSidebar activePage="journal" />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? 'mt-16' : 'md:ml-64'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Bookmark className="h-8 w-8 text-primary" />
              {t.title}
            </h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{isEditing ? 'Edit Entry' : 'New Entry'}</span>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetForm}
                      >
                        {t.cancel}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{t.date}</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t.mood}</label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {moodOptions.map(mood => (
                        <button
                          key={mood.value}
                          onClick={() => setFormData({ ...formData, mood: mood.value })}
                          className={`p-2 rounded-lg border-2 transition-all text-2xl ${
                            formData.mood === mood.value
                              ? 'border-primary bg-primary/10'
                              : 'border-muted'
                          }`}
                          title={mood.label}
                        >
                          {mood.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t.title}</label>
                    <Input
                      placeholder="Entry title..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t.content}</label>
                    <Textarea
                      placeholder="Write your thoughts, feelings, and observations..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    onClick={saveEntry}
                    className="w-full"
                    size="lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t.save}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Entries List */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {/* Search */}
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Entries */}
              {filteredEntries.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center h-40">
                    <div className="text-center">
                      <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-muted-foreground">{t.noEntries}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredEntries.map((entry) => {
                    const moodData = moodOptions.find(m => m.value === entry.mood);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedEntry?.id === entry.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => editEntry(entry)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                                  <h3 className="font-semibold text-lg">{entry.title}</h3>
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(entry.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteEntry(entry.id);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyJournalPage;
