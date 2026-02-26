
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarDays } from 'lucide-react';

export interface MealPlan {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export function MealPlanList() {
  const { language } = useLanguage();

  return (
    <div className="text-center py-12">
      <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-foreground">{language === 'fr' ? "Aucun plan de repas" : "No meal plans"}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{language === 'fr' ? "Les fonctionnalités de base de données ont été supprimées." : "Database features have been removed."}</p>
    </div>
  );
}
