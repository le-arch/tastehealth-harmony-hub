import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, ChefHat } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PageLayout from '@/components/PageLayout';
import { MealPlanList } from '@/components/MealPlanList';
import { CreateMealPlanDialog } from '@/components/CreateMealPlanDialog';
import { useLanguage } from '@/contexts/LanguageContext';

const MealTimetablePage: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const t = language === 'fr'
    ? { title: 'Emploi du Temps des Repas', subtitle: 'Planifiez vos repas semaine par semaine', placeholder: 'Rechercher des plans...' }
    : { title: 'Meal Timetable', subtitle: 'Plan unique weekly meal timetables', placeholder: 'Search meal plans...' };

  useEffect(() => {
    const handler = () => setRefreshKey(k => k + 1);
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <PageLayout activePage="meal timetable">
      <div className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center">
            <Calendar className="h-7 w-7 mr-2 text-primary" />{t.title}
          </h1>
          <p className="text-muted-foreground text-sm">{t.subtitle}</p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t.placeholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <CreateMealPlanDialog onMealPlanCreated={() => setRefreshKey(k => k + 1)} />
          </div>
          <MealPlanList key={refreshKey} searchFilter={searchTerm} />
        </div>
      </div>
    </PageLayout>
  );
};

export default MealTimetablePage;
