
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
import { seedMeals } from '@/services/mealService';

const MealDatabaseSeeder = () => {
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  
  // Translations
  const translations = {
    en: {
      title: "Meal Database Management",
      description: "Populate the database with sample meals, recipes and nutrition information.",
      button: "Populate Meal Database",
      loading: "Populating database...",
      success: "Successfully populated meal database!",
      error: "Failed to populate database. Check console for details."
    },
    fr: {
      title: "Gestion de la Base de Données des Repas",
      description: "Remplir la base de données avec des exemples de repas, recettes et informations nutritionnelles.",
      button: "Remplir la Base de Données",
      loading: "Remplissage de la base de données...",
      success: "Base de données de repas remplie avec succès !",
      error: "Échec du remplissage de la base de données. Consultez la console pour plus de détails."
    }
  };
  
  const t = translations[language as keyof typeof translations] || translations.en;

  const handleSeedDatabase = async () => {
    setLoading(true);
    
    try {
      await seedMeals();
      toast.success(t.success);
    } catch (error) {
      console.error("Error seeding meal database:", error);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">{t.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSeedDatabase} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.loading}
            </>
          ) : t.button}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MealDatabaseSeeder;
