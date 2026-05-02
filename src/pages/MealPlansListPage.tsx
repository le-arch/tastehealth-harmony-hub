import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PageLayout from '@/components/PageLayout';
import { MealPlanList } from '@/components/MealPlanList';
import { useLanguage } from '@/contexts/LanguageContext';

const MealPlansListPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const t = language === 'fr'
    ? { title: 'Mes Plans de Repas', subtitle: 'Parcourez et ouvrez vos plans de repas existants', placeholder: 'Rechercher des plans...' }
    : { title: 'My Meal Plans', subtitle: 'Browse and open your existing meal plans', placeholder: 'Search meal plans...' };

  useEffect(() => {
    const handler = () => setRefreshKey(k => k + 1);
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <PageLayout activePage="meal plans">
      <div className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center">
            <Calendar className="h-7 w-7 mr-2 text-primary" />{t.title}
          </h1>
          <p className="text-muted-foreground text-sm">{t.subtitle}</p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.placeholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <MealPlanList key={refreshKey} searchFilter={searchTerm} />
        </div>
      </div>
    </PageLayout>
  );
};

export default MealPlansListPage;
